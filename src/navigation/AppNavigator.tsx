import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import AddInvestmentScreen from '../screens/AddInvestmentScreen';
import HistoryScreen from '../screens/HistoryScreen';
import HomeScreen from '../screens/HomeScreen';
import PortfolioScreen from '../screens/PortfolioScreen';
import SettingsScreen from '../screens/SettingsScreen';

export type RootStackParamList = {
    Home: undefined;
    AddInvestment: undefined;
    Portfolio: undefined;
    History: undefined;
    Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Birikim' }} />
                <Stack.Screen name="AddInvestment" component={AddInvestmentScreen} options={{ title: 'Yatırım Ekle' }} />
                <Stack.Screen name="Portfolio" component={PortfolioScreen} options={{ title: 'Portföy' }} />
                <Stack.Screen name="History" component={HistoryScreen} options={{ title: 'Geçmiş' }} />
                <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Ayarlar' }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;


