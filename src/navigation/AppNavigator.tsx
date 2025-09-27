import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Icon, useTheme } from '@rneui/themed';
import React from 'react';
import { View } from 'react-native';
import AddInvestmentScreen from '../screens/AddInvestmentScreen';
import HistoryScreen from '../screens/HistoryScreen';
import HomeScreen from '../screens/HomeScreen';
import PortfolioScreen from '../screens/PortfolioScreen';
import SettingsScreen from '../screens/SettingsScreen';

export type RootStackParamList = {
    MainTabs: undefined;
    AddInvestment: undefined;
};

export type TabParamList = {
    HomeTab: undefined;
    PortfolioTab: undefined;
    AddTab: undefined;
    HistoryTab: undefined;
    SettingsTab: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

// Empty component for Add tab - just redirects to AddInvestment screen
const AddTabPlaceholder = () => <View />;

function MainStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="MainTabs" component={TabNavigator} />
            <Stack.Screen name="AddInvestment" component={AddInvestmentScreen} />
        </Stack.Navigator>
    );
}

function TabNavigator() {
    const { theme } = useTheme();

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ focused, size }) => {
                    let iconName: string;
                    let iconType = 'material';

                    switch (route.name) {
                        case 'HomeTab':
                            iconName = 'dashboard';
                            break;
                        case 'PortfolioTab':
                            iconName = 'account-balance-wallet';
                            break;
                        case 'AddTab':
                            iconName = 'add-circle';
                            size = 32; // Larger size for the add button
                            break;
                        case 'HistoryTab':
                            iconName = 'history';
                            break;
                        case 'SettingsTab':
                            iconName = 'settings';
                            break;
                        default:
                            iconName = 'help';
                    }

                    return (
                        <Icon
                            name={iconName}
                            type={iconType}
                            size={size}
                            color={focused ? theme.colors.primary : theme.colors.grey3}
                        />
                    );
                },
                tabBarActiveTintColor: theme.colors.primary,
                tabBarInactiveTintColor: theme.colors.grey3,
                tabBarStyle: {
                    backgroundColor: theme.colors.grey0,
                    borderTopColor: theme.colors.grey2,
                    borderTopWidth: 0.5,
                    height: 70,
                    paddingBottom: 8,
                    paddingTop: 8,
                    elevation: 8,
                    shadowColor: '#000',
                    shadowOffset: {
                        width: 0,
                        height: -2,
                    },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                },
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: '600',
                    marginTop: 2,
                },
                tabBarItemStyle: {
                    paddingVertical: 4,
                }
            })}
        >
            <Tab.Screen
                name="HomeTab"
                component={HomeScreen}
                options={{
                    tabBarLabel: 'Portföy',
                }}
            />
            <Tab.Screen
                name="PortfolioTab"
                component={PortfolioScreen}
                options={{
                    tabBarLabel: 'Yatırımlar'
                }}
            />
            <Tab.Screen
                name="AddTab"
                component={AddTabPlaceholder}
                options={{
                    tabBarLabel: 'Ekle',
                    tabBarLabelStyle: {
                        fontSize: 11,
                        fontWeight: 'bold',
                        marginTop: 2,
                    }
                }}
                listeners={({ navigation }) => ({
                    tabPress: (e) => {
                        e.preventDefault();
                        navigation.navigate('AddInvestment');
                    },
                })}
            />
            <Tab.Screen
                name="HistoryTab"
                component={HistoryScreen}
                options={{
                    tabBarLabel: 'Geçmiş'
                }}
            />
            <Tab.Screen
                name="SettingsTab"
                component={SettingsScreen}
                options={{
                    tabBarLabel: 'Ayarlar'
                }}
            />
        </Tab.Navigator>
    );
}

const AppNavigator: React.FC = () => {
    return (
        <NavigationContainer>
            <MainStack />
        </NavigationContainer>
    );
};

export default AppNavigator;


