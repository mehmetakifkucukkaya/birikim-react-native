import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
    Avatar,
    Button,
    Card,
    Icon,
    Text,
    useTheme
} from '@rneui/themed';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Animated, Easing, FlatList, Platform, RefreshControl, StyleSheet, View } from 'react-native';
import AppHeader from '../components/AppHeader';
import type { RootStackParamList, TabParamList } from '../navigation/AppNavigator';
import { FirestoreService, Investment } from '../services/firestoreService';

type Props = CompositeScreenProps<
    BottomTabScreenProps<TabParamList, 'PortfolioTab'>,
    NativeStackScreenProps<RootStackParamList>
>;

const PortfolioScreen: React.FC<Props> = ({ navigation }) => {
    const { theme } = useTheme();
    const [investments, setInvestments] = useState<Investment[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    // Animation values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(50)).current;

    useEffect(() => {
        loadInvestments();

        // Entrance animation
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
                easing: Easing.out(Easing.cubic)
            }),
            Animated.timing(translateY, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
                easing: Easing.out(Easing.back(1.5))
            })
        ]).start();
    }, []);

    const loadInvestments = async () => {
        try {
            setLoading(true);
            const data = await FirestoreService.getAllInvestments();
            setInvestments(data);
        } catch (error) {
            console.error('Yatırımlar yüklenirken hata:', error);
            Alert.alert('Hata', 'Yatırımlar yüklenirken bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadInvestments();
        setRefreshing(false);
    };

    const handleDeleteInvestment = async (investmentId: string, investmentName: string) => {
        Alert.alert(
            'Yatırımı Sil',
            `${investmentName} yatırımını silmek istediğinizden emin misiniz?`,
            [
                { text: 'İptal', style: 'cancel' },
                {
                    text: 'Sil',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await FirestoreService.deleteInvestment(investmentId);
                            await loadInvestments(); // Listeyi yenile
                            Alert.alert('Başarılı', 'Yatırım silindi.');
                        } catch (error) {
                            console.error('Yatırım silinirken hata:', error);
                            Alert.alert('Hata', 'Yatırım silinirken bir hata oluştu.');
                        }
                    }
                }
            ]
        );
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('tr-TR', {
            style: 'currency',
            currency: 'TRY',
            minimumFractionDigits: 2
        }).format(amount);
    };

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('tr-TR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }).format(date);
    };

    const getInvestmentIcon = (type: string) => {
        const iconMap: Record<string, { name: string; type: string; color: string }> = {
            'Altın': { name: 'local-offer', type: 'material', color: '#FFD700' },
            'USD': { name: 'attach-money', type: 'material', color: '#4CAF50' },
            'Euro': { name: 'euro-symbol', type: 'material', color: '#2196F3' },
            'Gümüş': { name: 'star', type: 'material', color: '#9E9E9E' },
            'BIST100': { name: 'trending-up', type: 'material', color: '#FF9800' },
            'Diğer': { name: 'account-balance', type: 'material', color: '#9C27B0' }
        };

        return iconMap[type] || iconMap['Diğer'];
    };

    const calculateCurrentValue = (investment: Investment) => {
        // Şimdilik basit bir simülasyon - gerçek API entegrasyonunda değişecek
        const multiplier = investment.type === 'Altın' ? 1.1 :
            investment.type === 'USD' ? 1.05 :
                investment.type === 'Euro' ? 0.95 : 1.0;
        return investment.buyPrice * investment.quantity * multiplier;
    };

    const calculateProfit = (investment: Investment) => {
        const invested = investment.buyPrice * investment.quantity;
        const current = calculateCurrentValue(investment);
        return current - invested;
    };

    const calculateProfitPercentage = (investment: Investment) => {
        const invested = investment.buyPrice * investment.quantity;
        const profit = calculateProfit(investment);
        return invested > 0 ? (profit / invested) * 100 : 0;
    };

    const renderInvestmentItem = ({ item }: { item: Investment }) => {
        const icon = getInvestmentIcon(item.type);
        const currentValue = calculateCurrentValue(item);
        const profit = calculateProfit(item);
        const profitPercentage = calculateProfitPercentage(item);
        const invested = item.buyPrice * item.quantity;
        const isProfit = profit >= 0;

        return (
            <Animated.View
                style={{
                    opacity: fadeAnim,
                    transform: [{ translateY: translateY }]
                }}
            >
                <Card containerStyle={styles.modernCard}>
                    <LinearGradient
                        colors={['rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.02)']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.cardGradient}
                    />

                    <View style={styles.investmentHeader}>
                        <View style={styles.investmentInfo}>
                            <View style={[styles.avatarContainer, { backgroundColor: icon.color }]}>
                                <Avatar
                                    rounded
                                    icon={{
                                        name: icon.name,
                                        type: icon.type,
                                        color: 'white'
                                    }}
                                    size={40}
                                    containerStyle={styles.avatar}
                                />
                                <View style={styles.avatarGlow} />
                            </View>

                            <View style={styles.investmentDetails}>
                                <Text style={styles.investmentType}>
                                    {item.type}
                                </Text>
                                <Text style={styles.investmentQuantity}>
                                    {item.quantity} {item.type === 'Altın' || item.type === 'Gümüş' ? 'gr' :
                                        item.type === 'USD' || item.type === 'Euro' ? 'birim' : 'adet'}
                                </Text>
                                <Text style={styles.investmentDate}>
                                    {formatDate(item.buyDate)}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.investmentValues}>
                            <Text style={styles.currentValue}>
                                {formatCurrency(currentValue)}
                            </Text>
                            <View style={[
                                styles.profitBadge,
                                { backgroundColor: isProfit ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)' }
                            ]}>
                                <Text style={[styles.profitPercentage, { color: isProfit ? '#10B981' : '#EF4444' }]}>
                                    {isProfit ? '+' : ''}{profitPercentage.toFixed(1)}%
                                </Text>
                            </View>
                        </View>

                        <View style={styles.actionButton}>
                            <Icon
                                name="more-vert"
                                type="material"
                                color={theme.colors.grey3}
                                onPress={() => handleDeleteInvestment(item.id!, `${item.type} (${item.quantity} adet)`)}
                            />
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.investmentBottom}>
                        <View style={styles.priceInfo}>
                            <Text style={styles.label}>ALIŞ FİYATI</Text>
                            <Text style={styles.value}>
                                {formatCurrency(item.buyPrice)}
                            </Text>
                        </View>
                        <View style={styles.priceInfo}>
                            <Text style={styles.label}>GÜNCEL FİYAT</Text>
                            <Text style={styles.value}>
                                {formatCurrency(currentValue / item.quantity)}
                            </Text>
                        </View>
                        <View style={styles.priceInfo}>
                            <Text style={styles.label}>KAR/ZARAR</Text>
                            <Text style={[styles.profitValue, { color: isProfit ? '#10B981' : '#EF4444' }]}>
                                {isProfit ? '+' : ''}{formatCurrency(profit)}
                            </Text>
                        </View>
                    </View>

                    {item.notes && (
                        <View style={styles.notesContainer}>
                            <Icon
                                name="comment"
                                type="material"
                                color="#8B5CF6"
                                size={16}
                                containerStyle={styles.notesIcon}
                            />
                            <Text style={styles.notes}>
                                {item.notes}
                            </Text>
                        </View>
                    )}
                </Card>
            </Animated.View>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.white }]}>
            {/* Professional Header with Gradient */}
            <AppHeader
                title="Yatırımlarım"
                fadeAnim={fadeAnim}
            />

            {investments.length === 0 ? (
                <Animated.View
                    style={[
                        styles.emptyState,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY }]
                        }
                    ]}
                >
                    <View style={styles.emptyStateIconContainer}>
                        <LinearGradient
                            colors={['rgba(99, 102, 241, 0.2)', 'rgba(139, 92, 246, 0.2)']}
                            style={styles.emptyStateGradient}
                        />
                        <Icon
                            name="account-balance-wallet"
                            type="material"
                            color="#8B5CF6"
                            size={64}
                        />
                    </View>
                    <Text style={styles.emptyStateText}>
                        Henüz Yatırım Yok
                    </Text>
                    <Text style={styles.emptyStateSubtext}>
                        İlk yatırımınızı ekleyerek portföyünüzü oluşturmaya ve finansal büyümenizi takip etmeye başlayın
                    </Text>
                    <LinearGradient
                        colors={['#6366F1', '#8B5CF6']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.emptyStateButtonGradient}
                    >
                        <Button
                            title="İlk Yatırımı Ekle"
                            onPress={() => navigation.navigate('AddInvestment')}
                            buttonStyle={styles.emptyStateButton}
                            titleStyle={styles.emptyStateButtonText}
                            icon={{
                                name: 'add-circle-outline',
                                type: 'material',
                                size: 20,
                                color: 'white',
                                style: { marginRight: 8 }
                            }}
                        />
                    </LinearGradient>
                </Animated.View>
            ) : (
                <FlatList
                    data={investments}
                    renderItem={renderInvestmentItem}
                    keyExtractor={(item) => item.id!}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={['#6366F1']}
                            tintColor="#6366F1"
                        />
                    }
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F0F0F',
    },

    // Modern Header Styles
    headerGradient: {
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        paddingBottom: 30,
        paddingHorizontal: 20,
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
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
        letterSpacing: -0.5,
    },
    addButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: 12,
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: 'rgba(0, 0, 0, 0.3)',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },

    // Modern Card Styles
    modernCard: {
        borderRadius: 20,
        marginHorizontal: 16,
        marginBottom: 16,
        padding: 0,
        overflow: 'hidden',
        backgroundColor: '#1C1C1E',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    cardGradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '100%',
    },
    // Investment Card Components
    investmentHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
    },
    investmentInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    avatarContainer: {
        borderRadius: 12,
        padding: 8,
        position: 'relative',
        overflow: 'hidden',
    },
    avatar: {
        backgroundColor: 'transparent',
    },
    avatarGlow: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: 12,
        opacity: 0.5,
    },
    investmentDetails: {
        marginLeft: 16,
        flex: 1,
    },
    investmentType: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
        color: '#FFFFFF',
        letterSpacing: -0.3,
    },
    investmentQuantity: {
        fontSize: 14,
        marginBottom: 2,
        color: '#8E8E93',
    },
    investmentDate: {
        fontSize: 12,
        color: '#8E8E93',
        opacity: 0.8,
    },
    investmentValues: {
        alignItems: 'flex-end',
        marginRight: 12,
    },
    currentValue: {
        fontSize: 18,
        fontWeight: '800',
        marginBottom: 6,
        color: '#FFFFFF',
    },
    profitBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    profitPercentage: {
        fontSize: 13,
        fontWeight: '700',
    },
    actionButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 8,
        padding: 4,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        marginHorizontal: 20,
    },
    investmentBottom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
        paddingTop: 16,
    },
    priceInfo: {
        alignItems: 'center',
    },
    label: {
        fontSize: 12,
        marginBottom: 6,
        color: '#8E8E93',
        fontWeight: '500',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    value: {
        fontSize: 15,
        fontWeight: '600',
        textAlign: 'center',
        color: '#FFFFFF',
    },
    profitValue: {
        fontSize: 16,
        fontWeight: '700',
    },
    notesContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingHorizontal: 20,
        paddingBottom: 20,
        paddingTop: 8,
    },
    notesIcon: {
        marginRight: 8,
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        padding: 4,
        borderRadius: 8,
    },
    notes: {
        fontSize: 14,
        flex: 1,
        color: '#C7C7CC',
    },
    // Empty State
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
    },
    emptyStateIconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        position: 'relative',
        overflow: 'hidden',
    },
    emptyStateGradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    emptyStateText: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 16,
        color: '#FFFFFF',
        letterSpacing: -0.5,
        textAlign: 'center',
    },
    emptyStateSubtext: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 32,
        lineHeight: 24,
        color: '#8E8E93',
        opacity: 0.9,
        maxWidth: 280,
    },
    emptyStateButtonGradient: {
        borderRadius: 12,           // Smaller radius for modern look
        overflow: 'hidden',
        // Remove all shadows for premium fintech design
        elevation: 0,
        shadowColor: 'transparent',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
    },
    emptyStateButton: {
        backgroundColor: 'transparent',
        paddingHorizontal: 20,      // Refined padding - exact spec
        paddingVertical: 16,        // Keep vertical padding
        borderWidth: 0,
    },
    emptyStateButtonText: {
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.3,
    },
});

export default PortfolioScreen;


