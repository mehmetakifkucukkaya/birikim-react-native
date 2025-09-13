import React, { useEffect } from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { testFirebaseConnection } from './src/services/firebaseTest';

export default function App() {
  useEffect(() => {
    // Firebase bağlantısını test et (sadece development'ta)
    if (__DEV__) {
      testFirebaseConnection()
        .then((success) => {
          if (success) {
            console.log('🔥 Firebase başarıyla bağlandı!');
          }
        })
        .catch((error) => {
          console.error('Firebase bağlantı hatası:', error);
        });
    }
  }, []);

  return <AppNavigator />;
}
