# 📄 Yatırım Takip Uygulaması – PRD

## 1. Amaç

Kullanıcıların altın, gümüş, döviz ve benzeri yatırım araçlarını takip edebileceği, satın alma bilgilerini kaydedip anlık portföy değerini hesaplayabileceği mobil bir uygulama geliştirmek.

Uygulama Dili Türkçe olacak.

## 2. Kullanıcı Senaryosu

- Kullanıcı **yatırım ekler**: tür (altın, euro, usd, gümüş), alış tarihi, alış fiyatı, miktar.
- Kullanıcı **“Güncel değer hesapla”** butonuna basar.
- Sistem, **CollectAPI (altın/döviz/borsa API)** üzerinden güncel fiyatları çeker.
- Kullanıcıya **portföy toplam değeri, kâr/zarar TL bazında ve yüzde olarak** gösterilir.
- Kullanıcı **geçmiş işlemlerini (History)** görebilir.

## 3. Özellikler

### 3.1 Yatırım İşlemleri

- [x] Yatırım ekleme (Tür, alış tarihi, alış fiyatı, miktar).
- [x] Yatırım güncelleme / silme.

### 3.2 Portföy Görünümü

- [x] Tüm yatırımlar listelenir.
- [x] Toplam yatırılan tutar, güncel toplam değer.
- [x] Kâr/zarar (TL ve %).

### 3.3 History (Geçmiş İşlemler)

- [x] Her eklenen yatırım **işlem geçmişine kaydedilir**.
- [x] Tarih, yatırım türü, miktar, alış fiyatı gösterilir.
- [x] Kullanıcı geçmişi filtreleyebilir (ör. sadece altın yatırımları).

### 3.4 Güncel Fiyat Hesaplama

- [x] **CollectAPI** kullanılarak anlık altın, döviz, borsa fiyatları alınır.
- [x] Tüm yatırımlar güncel fiyatla hesaplanır.

### 3.5 Kullanıcı Deneyimi

- [ ] Basit ve minimal arayüz (React Native).
- [ ] Cross-platform mobil uyumlu, responsive tasarım.
- [ ] iOS ve Android için native görünüm.

---

## 4. Teknik Mimari

### 4.1 Frontend

- **Teknoloji:** React Native
- **Kurulum:**

  ```bash
  # React Native CLI kurulumu
  npm install -g @react-native-community/cli

  # Proje oluşturma
  npx react-native init BirikimApp
  cd BirikimApp

  # Gerekli paketler
  npm install @react-navigation/native @react-navigation/stack
  npm install react-native-screens react-native-safe-area-context
  npm install @react-native-firebase/app @react-native-firebase/firestore
  npm install react-native-elements react-native-vector-icons
  ```

- **Görevler:**

  - Yatırım ekleme, listeleme, geçmiş görüntüleme ekranları
  - API çağrıları için Firebase Functions proxy kullanılacak
  - React Native Elements ile minimal UI
  - Cross-platform (iOS & Android) uyumlu tasarım
  - Navigation ile ekran geçişleri

### 4.2 Backend & Database

- **Teknoloji:** Firebase
- **Kurulum:**

  ```bash
  # Firebase CLI kurulumu
  npm install -g firebase-tools

  # Proje oluşturma
  firebase login
  firebase init
  ```

- **Kullanılacak Servisler:**

  - **Firebase Firestore:** Yatırımlar ve History kayıtları tutulacak
  - **Firebase Authentication:** (Opsiyonel) Kullanıcı giriş/çıkışı
  - **Firebase Functions:** CollectAPI çağrılarını proxy’lemek için

### 4.3 API

- **Servis:** [CollectAPI](https://collectapi.com/tr/api/economy/altin-doviz-ve-borsa-api)
- **Endpoint Örnekleri:**

  - `GET /economy/goldPrice` → Altın fiyatları
  - `GET /economy/currencyToAll?int=USD` → USD bazlı dövizler

- **Kullanım:**

  - Firebase Functions üzerinde token saklanacak
  - Frontend → Firebase Function → CollectAPI

---

## 5. Veri Modeli

### 5.1 Koleksiyonlar

#### `investments`

| Alan     | Tip    | Açıklama                 |
| -------- | ------ | ------------------------ |
| type     | String | Altın, USD, Euro, vb.    |
| buyPrice | Number | Alış fiyatı              |
| quantity | Number | Miktar                   |
| buyDate  | Date   | Alış tarihi              |
| userId   | String | Kullanıcı kimliği (ops.) |

#### `history`

| Alan         | Tip    | Açıklama                        |
| ------------ | ------ | ------------------------------- |
| investmentId | Ref    | İlgili yatırım                  |
| action       | String | eklendi / silindi / güncellendi |
| date         | Date   | İşlem tarihi                    |

---

## 6. History Kullanıcı Akışı

1. Kullanıcı yeni yatırım ekler.
2. Firestore’a **investments** koleksiyonuna kayıt atılır.
3. Aynı anda **history** koleksiyonuna da “yatırım eklendi” log’u düşülür.
4. Kullanıcı geçmiş ekranında bu log’u görebilir.

---

## 7. Güvenlik

- API token Firebase Functions içinde environment variable olarak tutulacak.
- Firestore Security Rules ile kullanıcı yalnızca kendi yatırımlarını görebilecek.

---

## 8. Yol Haritası

- **Sprint 1:** React Native proje kurulumu + Firebase entegrasyonu + yatırım ekleme/görüntüleme.
- **Sprint 2:** CollectAPI entegrasyonu + portföy değeri hesaplama.
- **Sprint 3:** History ekranı + filtreleme.
- **Sprint 4:** UI iyileştirme + iOS/Android test + yayın.

---

## 9. React Native Ekran Yapısı

### 9.1 Ana Ekranlar

- **HomeScreen:** Portföy özeti ve hızlı erişim
- **AddInvestmentScreen:** Yeni yatırım ekleme formu
- **PortfolioScreen:** Tüm yatırımların detaylı listesi
- **HistoryScreen:** İşlem geçmişi ve filtreleme
- **SettingsScreen:** Uygulama ayarları

### 9.2 Navigation Yapısı

```javascript
// Stack Navigator yapısı
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="AddInvestment" component={AddInvestmentScreen} />
        <Stack.Screen name="Portfolio" component={PortfolioScreen} />
        <Stack.Screen name="History" component={HistoryScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
```

---

## 10. React Native Avantajları

- **Daha Hızlı Geliştirme:** Flutter'a göre daha az build sorunu
- **Native Performans:** JavaScript bridge ile native performans
- **Geniş Topluluk:** Büyük geliştirici topluluğu ve kaynak
- **Kolay Debugging:** Chrome DevTools ile kolay debugging
- **Hot Reload:** Anlık kod değişikliği görüntüleme

## 11. Gelecek Geliştirmeler

- Grafiklerle portföy gelişimi (react-native-chart-kit).
- Push notification: "Döviz/Altın fiyatı şu eşiği geçti" uyarısı.
- CSV / Excel export (react-native-fs).
- Offline çalışma desteği (AsyncStorage).
- Biometric authentication (Touch ID / Face ID).
