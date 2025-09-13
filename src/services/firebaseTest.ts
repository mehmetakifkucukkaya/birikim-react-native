import { FirestoreService, Investment } from './firestoreService';

// Firebase bağlantısını test etmek için basit bir fonksiyon
export const testFirebaseConnection = async (): Promise<boolean> => {
    try {
        console.log('Firebase bağlantısı test ediliyor...');

        // PRD'ye uygun test verisi
        const testInvestment: Omit<Investment, 'id' | 'createdAt' | 'updatedAt'> = {
            type: 'Altın',
            buyPrice: 2500,        // TL/gram
            quantity: 10,          // 10 gram altın
            buyDate: new Date(),
            notes: 'Bu bir test yatırımıdır.'
        };

        // Test yatırımı ekle
        const investmentId = await FirestoreService.addInvestment(testInvestment);
        console.log('Test yatırımı eklendi, ID:', investmentId);

        // Yatırımları listele
        const investments = await FirestoreService.getAllInvestments();
        console.log('Toplam yatırım sayısı:', investments.length);

        // Test yatırımını sil
        await FirestoreService.deleteInvestment(investmentId);
        console.log('Test yatırımı silindi');

        console.log('✅ Firebase bağlantısı başarıyla test edildi!');
        return true;
    } catch (error) {
        console.error('❌ Firebase bağlantısı test edilirken hata oluştu:', error);
        return false;
    }
};

// Firestore kurallarını kontrol etmek için basit test
export const checkFirestoreRules = async (): Promise<boolean> => {
    try {
        console.log('Firestore kuralları kontrol ediliyor...');

        // Sadece okuma testi
        const investments = await FirestoreService.getAllInvestments();
        console.log('✅ Firestore okuma işlemi başarılı');

        return true;
    } catch (error) {
        console.error('❌ Firestore kuralları hatası:', error);
        return false;
    }
};
