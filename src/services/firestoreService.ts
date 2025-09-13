import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    orderBy,
    query,
    Timestamp,
    updateDoc,
    where
} from 'firebase/firestore';
import { db } from './firebase';

// PRD'ye uygun Yatırım interface'i
export interface Investment {
    id?: string;
    type: 'Altın' | 'USD' | 'Euro' | 'Gümüş' | 'BIST100' | 'Diğer';
    buyPrice: number;     // TL bazında alış fiyatı
    quantity: number;     // Miktar (gram, adet, lot vb.)
    buyDate: Date;        // Alış tarihi
    userId?: string;      // Kullanıcı kimliği (opsiyonel)
    notes?: string;       // Notlar
    createdAt: Date;
    updatedAt: Date;
}

// PRD'ye uygun History interface'i
export interface History {
    id?: string;
    investmentId: string;                    // İlgili yatırım ID'si
    action: 'eklendi' | 'güncellendi' | 'silindi';  // İşlem türü
    date: Date;                             // İşlem tarihi
    details: string;                        // İşlem detayları
    oldData?: Partial<Investment>;          // Güncelleme durumunda eski veri
    newData?: Partial<Investment>;          // Güncelleme durumunda yeni veri
}

// Collection referansları
const INVESTMENTS_COLLECTION = 'investments';
const HISTORY_COLLECTION = 'history';

export class FirestoreService {

    // Yeni yatırım ekle (PRD'ye uygun)
    static async addInvestment(investment: Omit<Investment, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
        try {
            const investmentData = {
                ...investment,
                buyDate: Timestamp.fromDate(investment.buyDate),
                createdAt: Timestamp.fromDate(new Date()),
                updatedAt: Timestamp.fromDate(new Date())
            };

            const docRef = await addDoc(collection(db, INVESTMENTS_COLLECTION), investmentData);

            // History'ye kayıt ekle
            await this.addHistory({
                investmentId: docRef.id,
                action: 'eklendi',
                date: new Date(),
                details: `${investment.type} yatırımı eklendi: ${investment.quantity} birim, ${investment.buyPrice} TL fiyatla`,
                newData: investment
            });

            return docRef.id;
        } catch (error) {
            console.error('Yatırım eklenirken hata oluştu:', error);
            throw error;
        }
    }

    // Tüm yatırımları getir (PRD'ye uygun)
    static async getAllInvestments(): Promise<Investment[]> {
        try {
            const q = query(collection(db, INVESTMENTS_COLLECTION), orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);

            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                buyDate: doc.data().buyDate?.toDate() || new Date(),
                createdAt: doc.data().createdAt?.toDate() || new Date(),
                updatedAt: doc.data().updatedAt?.toDate() || new Date(),
            } as Investment));
        } catch (error) {
            console.error('Yatırımlar getirilirken hata oluştu:', error);
            throw error;
        }
    }

    // Yatırım güncelle (PRD'ye uygun + History logging)
    static async updateInvestment(investmentId: string, updates: Partial<Investment>): Promise<void> {
        try {
            // Önce eski veriyi al
            const investmentRef = doc(db, INVESTMENTS_COLLECTION, investmentId);
            const oldDoc = await getDocs(query(collection(db, INVESTMENTS_COLLECTION), where('__name__', '==', investmentId)));
            const oldData = oldDoc.docs[0]?.data() as Investment;

            const updateData = {
                ...updates,
                updatedAt: Timestamp.fromDate(new Date())
            };

            if (updates.buyDate) {
                updateData.buyDate = Timestamp.fromDate(updates.buyDate);
            }

            await updateDoc(investmentRef, updateData);

            // History'ye kayıt ekle
            await this.addHistory({
                investmentId: investmentId,
                action: 'güncellendi',
                date: new Date(),
                details: `${oldData.type} yatırımı güncellendi`,
                oldData: oldData,
                newData: updates
            });

        } catch (error) {
            console.error('Yatırım güncellenirken hata oluştu:', error);
            throw error;
        }
    }

    // Yatırım sil (PRD'ye uygun + History logging)
    static async deleteInvestment(investmentId: string): Promise<void> {
        try {
            // Önce veriyi al
            const oldDoc = await getDocs(query(collection(db, INVESTMENTS_COLLECTION), where('__name__', '==', investmentId)));
            const oldData = oldDoc.docs[0]?.data() as Investment;

            const investmentRef = doc(db, INVESTMENTS_COLLECTION, investmentId);
            await deleteDoc(investmentRef);

            // History'ye kayıt ekle
            await this.addHistory({
                investmentId: investmentId,
                action: 'silindi',
                date: new Date(),
                details: `${oldData.type} yatırımı silindi: ${oldData.quantity} birim, ${oldData.buyPrice} TL`,
                oldData: oldData
            });

        } catch (error) {
            console.error('Yatırım silinirken hata oluştu:', error);
            throw error;
        }
    }

    // Yatırım tipine göre filtrele (PRD'ye uygun)
    static async getInvestmentsByType(type: Investment['type']): Promise<Investment[]> {
        try {
            const q = query(
                collection(db, INVESTMENTS_COLLECTION),
                where('type', '==', type),
                orderBy('createdAt', 'desc')
            );
            const querySnapshot = await getDocs(q);

            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                buyDate: doc.data().buyDate?.toDate() || new Date(),
                createdAt: doc.data().createdAt?.toDate() || new Date(),
                updatedAt: doc.data().updatedAt?.toDate() || new Date(),
            } as Investment));
        } catch (error) {
            console.error('Tip bazlı yatırımlar getirilirken hata oluştu:', error);
            throw error;
        }
    }

    // === HISTORY YÖNETİMİ (PRD'ye uygun) === //

    // History kaydı ekle
    static async addHistory(history: Omit<History, 'id'>): Promise<string> {
        try {
            const historyData = {
                ...history,
                date: Timestamp.fromDate(history.date)
            };

            const docRef = await addDoc(collection(db, HISTORY_COLLECTION), historyData);
            return docRef.id;
        } catch (error) {
            console.error('History kaydı eklenirken hata oluştu:', error);
            throw error;
        }
    }

    // Tüm history kayıtlarını getir
    static async getAllHistory(): Promise<History[]> {
        try {
            const q = query(collection(db, HISTORY_COLLECTION), orderBy('date', 'desc'));
            const querySnapshot = await getDocs(q);

            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                date: doc.data().date?.toDate() || new Date(),
            } as History));
        } catch (error) {
            console.error('History kayıtları getirilirken hata oluştu:', error);
            throw error;
        }
    }

    // Belirli yatırımın history'sini getir
    static async getHistoryByInvestmentId(investmentId: string): Promise<History[]> {
        try {
            const q = query(
                collection(db, HISTORY_COLLECTION),
                where('investmentId', '==', investmentId),
                orderBy('date', 'desc')
            );
            const querySnapshot = await getDocs(q);

            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                date: doc.data().date?.toDate() || new Date(),
            } as History));
        } catch (error) {
            console.error('Yatırım history kayıtları getirilirken hata oluştu:', error);
            throw error;
        }
    }

    // Action tipine göre history filtrele
    static async getHistoryByAction(action: History['action']): Promise<History[]> {
        try {
            const q = query(
                collection(db, HISTORY_COLLECTION),
                where('action', '==', action),
                orderBy('date', 'desc')
            );
            const querySnapshot = await getDocs(q);

            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                date: doc.data().date?.toDate() || new Date(),
            } as History));
        } catch (error) {
            console.error('Action bazlı history kayıtları getirilirken hata oluştu:', error);
            throw error;
        }
    }

    // === PORTFÖY HESAPLAMALARı (PRD'ye uygun) === //

    // Portföy toplam değeri hesapla (anlık fiyatlarla)
    static async calculatePortfolioValue(currentPrices: Record<string, number>): Promise<{
        totalInvested: number;
        currentValue: number;
        profit: number;
        profitPercentage: number;
    }> {
        try {
            const investments = await this.getAllInvestments();

            let totalInvested = 0;
            let currentValue = 0;

            investments.forEach(investment => {
                const invested = investment.buyPrice * investment.quantity;
                totalInvested += invested;

                const currentPrice = currentPrices[investment.type] || investment.buyPrice;
                const current = currentPrice * investment.quantity;
                currentValue += current;
            });

            const profit = currentValue - totalInvested;
            const profitPercentage = totalInvested > 0 ? (profit / totalInvested) * 100 : 0;

            return {
                totalInvested,
                currentValue,
                profit,
                profitPercentage
            };
        } catch (error) {
            console.error('Portföy değeri hesaplanırken hata oluştu:', error);
            throw error;
        }
    }
}
