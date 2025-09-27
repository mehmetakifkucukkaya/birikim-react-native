import {
    Card,
    Icon,
    Text,
    useTheme
} from '@rneui/themed';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import AppHeader from '../components/AppHeader';

const SettingsScreen: React.FC = () => {
    const { theme } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.white }]}>
            <AppHeader
                title="Ayarlar"
            />

            <Card containerStyle={[styles.card, { backgroundColor: theme.colors.grey0 }]}>
                <View style={styles.settingItem}>
                    <Icon
                        name="dark-mode"
                        type="material"
                        color={theme.colors.black}
                        size={24}
                    />
                    <View style={styles.settingContent}>
                        <Text style={[styles.settingTitle, { color: theme.colors.black }]}>
                            Karanlık Mod
                        </Text>
                        <Text style={[styles.settingDescription, { color: theme.colors.grey3 }]}>
                            Şu anda aktif
                        </Text>
                    </View>
                </View>
            </Card>

            <Card containerStyle={[styles.card, { backgroundColor: theme.colors.grey0 }]}>
                <View style={styles.settingItem}>
                    <Icon
                        name="notifications"
                        type="material"
                        color={theme.colors.black}
                        size={24}
                    />
                    <View style={styles.settingContent}>
                        <Text style={[styles.settingTitle, { color: theme.colors.black }]}>
                            Bildirimler
                        </Text>
                        <Text style={[styles.settingDescription, { color: theme.colors.grey3 }]}>
                            Fiyat uyarıları ve güncellemeler
                        </Text>
                    </View>
                </View>
            </Card>

            <Card containerStyle={[styles.card, { backgroundColor: theme.colors.grey0 }]}>
                <View style={styles.settingItem}>
                    <Icon
                        name="info"
                        type="material"
                        color={theme.colors.black}
                        size={24}
                    />
                    <View style={styles.settingContent}>
                        <Text style={[styles.settingTitle, { color: theme.colors.black }]}>
                            Hakkında
                        </Text>
                        <Text style={[styles.settingDescription, { color: theme.colors.grey3 }]}>
                            Sürüm 1.0.0
                        </Text>
                    </View>
                </View>
            </Card>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    header: {
        marginBottom: 24,
        paddingHorizontal: 4,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    card: {
        borderRadius: 15,
        marginBottom: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
    },
    settingContent: {
        marginLeft: 16,
        flex: 1,
    },
    settingTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
    },
    settingDescription: {
        fontSize: 14,
    },
});

export default SettingsScreen;


