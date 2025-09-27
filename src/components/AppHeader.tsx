import { Icon, Text, useTheme } from '@rneui/themed';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Animated, Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface AppHeaderProps {
    title: string;
    showBackButton?: boolean;
    showNotification?: boolean;
    onBackPress?: () => void;
    onNotificationPress?: () => void;
    fadeAnim?: Animated.Value;
}

const AppHeader: React.FC<AppHeaderProps> = ({
    title,
    showBackButton = false,
    showNotification = false,
    onBackPress,
    onNotificationPress,
    fadeAnim = new Animated.Value(1)
}) => {
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();

    return (
        <LinearGradient
            colors={['#6366F1', '#8B5CF6', '#A855F7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
                styles.headerGradient,
                { paddingTop: (insets?.top || 0) + (Platform.OS === 'ios' ? 40 : 20) }
            ]}
        >
            <Animated.View
                style={[
                    styles.header,
                    { opacity: fadeAnim }
                ]}
            >
                <View style={styles.headerContent}>
                    <View style={styles.leftSection}>
                        {showBackButton && (
                            <View style={styles.iconButton}>
                                <Icon
                                    name="arrow-back"
                                    type="material"
                                    color="white"
                                    size={22}
                                    onPress={onBackPress}
                                />
                            </View>
                        )}
                        <View>
                            <Text style={styles.headerTitle}>{title}</Text>
                        </View>
                    </View>

                    <View style={styles.rightSection}>
                        {showNotification && (
                            <View style={styles.notificationBadge}>
                                <Icon
                                    name="notifications"
                                    type="material"
                                    color="white"
                                    size={20}
                                    onPress={onNotificationPress}
                                />
                                <View style={styles.badge} />
                            </View>
                        )}
                    </View>
                </View>
            </Animated.View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    headerGradient: {
        paddingBottom: 30,
        paddingHorizontal: 20,
        marginHorizontal: -16,
        marginTop: -16,
        marginBottom: 24,
    },
    header: {
        marginTop: 10,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rightSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        letterSpacing: -0.5,
    },
    notificationBadge: {
        position: 'relative',
        padding: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: 12,
    },
    badge: {
        position: 'absolute',
        top: 6,
        right: 6,
        width: 8,
        height: 8,
        backgroundColor: '#EF4444',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: 'white',
    },
});

export default AppHeader;
