import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, Icon, LinearProgress, Text } from '@rneui/themed';
import React, { useEffect, useState } from 'react';
import { Animated, Dimensions, Platform, ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import ProfessionalCard from '../components/GlassCard';
import MetricCard from '../components/MetricCard';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { FirestoreService, Investment } from '../services/firestoreService';
import { BorderRadius, ButtonStyles, Colors, IconSpacing, Shadow, Spacing, Typography, formatCurrency } from '../utils/designSystem';

const { width } = Dimensions.get('window');

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen: React.FC<Props> = ({ navigation }) => {
    const [investments, setInvestments] = useState<Investment[]>([]);
    const [portfolioStats, setPortfolioStats] = useState({
        totalInvested: 0,
        currentValue: 0,
        profit: 0,
        profitPercentage: 0
    });
    const [loading, setLoading] = useState(false);
    const [theme] = useState<'dark' | 'light'>('dark'); // Will be dynamic later

    // Animation values
    const fadeAnim = useState(new Animated.Value(0))[0];
    const scaleAnim = useState(new Animated.Value(0.95))[0];
    const colors = Colors[theme];

    useEffect(() => {
        loadInvestments();

        // Entrance animation
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 50,
                friction: 8,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const loadInvestments = async () => {
        try {
            const data = await FirestoreService.getAllInvestments();
            setInvestments(data);
            calculatePortfolioStats(data);
        } catch (error) {
            console.error('Yatırımlar yüklenirken hata:', error);
        }
    };

    const calculatePortfolioStats = (investments: Investment[]) => {
        let totalInvested = 0;
        let currentValue = 0;

        investments.forEach((investment: Investment) => {
            const invested = investment.buyPrice * investment.quantity;
            totalInvested += invested;
            // Şu an için alış fiyatını güncel fiyat olarak kullanıyoruz
            // CollectAPI entegrasyonundan sonra gerçek fiyatlar kullanılacak
            currentValue += invested * 1.05; // %5 artış simülasyonu
        });

        const profit = currentValue - totalInvested;
        const profitPercentage = totalInvested > 0 ? (profit / totalInvested) * 100 : 0;

        setPortfolioStats({
            totalInvested,
            currentValue,
            profit,
            profitPercentage
        });
    };

    const handleCalculateCurrentValue = () => {
        setLoading(true);
        // Simüle edilen hesaplama
        setTimeout(() => {
            calculatePortfolioStats(investments);
            setLoading(false);
        }, 1500);
    };


    const getAssetDistribution = () => {
        const distribution: Record<string, number> = {};
        let total = 0;

        investments.forEach(investment => {
            const value = investment.buyPrice * investment.quantity;
            distribution[investment.type] = (distribution[investment.type] || 0) + value;
            total += value;
        });

        return Object.entries(distribution).map(([type, value]) => ({
            type,
            value,
            percentage: total > 0 ? (value / total) * 100 : 0
        }));
    };

    return (
        <>
            <StatusBar
                barStyle="light-content"
                backgroundColor={(colors.background as any).canvas || '#0B0F14'}
                translucent={true}
            />
            <ScrollView
                style={[styles.container, { backgroundColor: (colors.background as any).canvas || '#0B0F14' }]}
                showsVerticalScrollIndicator={false}
            >
                {/* Modern Header */}
                <View style={styles.header}>
                    <Animated.View style={[styles.headerContent, { opacity: fadeAnim }]}>
                        <View style={styles.headerLeft}>
                            <Text style={[styles.greeting, { color: colors.text.secondary }]}>
                                Merhaba
                            </Text>
                            <Text style={[styles.headerTitle, { color: colors.text.primary }]}>
                                Portföy Özeti
                            </Text>
                        </View>
                        <View style={styles.headerRight}>
                            <View style={styles.notificationButton}>
                                <Icon
                                    name="notifications-outline"
                                    type="ionicon"
                                    size={22}
                                    color={colors.text.primary}
                                />
                                <View style={styles.notificationBadge} />
                            </View>
                        </View>
                    </Animated.View>
                </View>

                {/* Metrics Grid */}
                <Animated.View
                    style={[
                        styles.metricsGrid,
                        { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }
                    ]}
                >
                    <View style={styles.metricsRow}>
                        <MetricCard
                            title="Toplam Yatırım"
                            value={portfolioStats.totalInvested}
                            type="currency"
                            icon="account-balance-wallet"
                            iconColor={colors.accent.secondary}
                            theme={theme}
                        />
                        <MetricCard
                            title="Güncel Değer"
                            value={portfolioStats.currentValue}
                            type="currency"
                            icon="trending-up"
                            iconColor={colors.accent.primary}
                            theme={theme}
                        />
                    </View>

                    <MetricCard
                        title="Toplam Kar/Zarar"
                        value={portfolioStats.profitPercentage}
                        type="percentage"
                        icon={portfolioStats.profit >= 0 ? "trending-up" : "trending-down"}
                        trend={portfolioStats.profitPercentage}
                        theme={theme}
                        variant={portfolioStats.profit >= 0 ? 'success' : 'danger'}
                    />
                </Animated.View>

                {/* Calculate Button - Outline Primary CTA */}
                <Animated.View style={[styles.calculateSection, { opacity: fadeAnim }]}>
                    <Button
                        title={loading ? "Hesaplanıyor..." : "Güncel Değeri Hesapla"}
                        onPress={handleCalculateCurrentValue}
                        loading={loading}
                        buttonStyle={[ButtonStyles.primaryOutline, styles.calculateButton]}
                        titleStyle={[styles.calculateButtonText, {
                            color: colors.accent.primary
                        }]}
                        icon={{
                            name: 'refresh',
                            type: 'material',
                            size: IconSpacing.size.medium,
                            color: colors.accent.primary,
                        }}
                    />
                </Animated.View>

                {/* Asset Distribution */}
                <Animated.View style={[styles.assetSection, { opacity: fadeAnim }]}>
                    <ProfessionalCard theme={theme} variant="highlighted">
                        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
                            Varlık Dağılımı
                        </Text>

                        {getAssetDistribution().length > 0 ? (
                            getAssetDistribution().map((asset, index) => (
                                <View key={`asset-${index}`} style={styles.assetItem}>
                                    <View style={styles.assetHeader}>
                                        <View style={styles.assetLeft}>
                                            <View style={[
                                                styles.assetIcon,
                                                { backgroundColor: colors.accent.secondary + '20' }
                                            ]}>
                                                <Text style={[
                                                    styles.assetSymbol,
                                                    { color: colors.accent.secondary }
                                                ]}>
                                                    {asset.type.substring(0, 2)}
                                                </Text>
                                            </View>
                                            <View>
                                                <Text style={[styles.assetType, { color: colors.text.primary }]}>
                                                    {asset.type}
                                                </Text>
                                                <Text style={[styles.assetValue, { color: colors.text.secondary }]}>
                                                    {formatCurrency(asset.value)}
                                                </Text>
                                            </View>
                                        </View>
                                        <View style={styles.assetRight}>
                                            <Text style={[
                                                styles.assetPercentage,
                                                {
                                                    color: colors.accent.primary,
                                                    backgroundColor: colors.accent.primary + '15'
                                                }
                                            ]}>
                                                {asset.percentage.toFixed(1)}%
                                            </Text>
                                        </View>
                                    </View>
                                    <LinearProgress
                                        style={styles.progressBar}
                                        value={asset.percentage / 100}
                                        color={colors.accent.primary}
                                        trackColor={colors.border.primary}
                                    />
                                </View>
                            ))
                        ) : (
                            <View style={styles.emptyState}>
                                <Icon
                                    name="pie-chart-outline"
                                    type="ionicon"
                                    color={colors.text.secondary}
                                    size={48}
                                />
                                <Text style={[styles.emptyStateText, { color: colors.text.secondary }]}>
                                    Henüz yatırım eklenmemiş
                                </Text>
                                <Text style={[styles.emptyStateSubtext, { color: colors.text.tertiary }]}>
                                    Yatırım ekleyerek portföy dağılımınızı görüntüleyin
                                </Text>
                            </View>
                        )}
                    </ProfessionalCard>
                </Animated.View>

                {/* Bottom Padding for Tab Navigator */}
                <View style={styles.bottomPadding} />
            </ScrollView>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    // Modern Header
    header: {
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        paddingHorizontal: Spacing.base,
        paddingBottom: Spacing.lg,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    headerLeft: {
        flex: 1,
    },
    headerRight: {
        alignItems: 'flex-end',
    },
    greeting: {
        fontSize: Typography.fontSize.caption,
        fontWeight: '500',
        marginBottom: Spacing.xs,
        letterSpacing: Typography.letterSpacing.normal,
        lineHeight: Typography.lineHeight.normal * Typography.fontSize.caption,
    },
    headerTitle: {
        fontSize: Typography.fontSize.h1,
        fontWeight: '700',
        letterSpacing: Typography.letterSpacing.tight,
        lineHeight: Typography.lineHeight.tight * Typography.fontSize.h1,
    },
    notificationButton: {
        width: 44,
        height: 44,
        borderRadius: BorderRadius.base,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    notificationBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#EF4444',
    },

    // Metrics Grid
    metricsGrid: {
        paddingHorizontal: Spacing.base,
        marginBottom: Spacing.betweenLg,    // 16px between sections - exact spec
    },
    metricsRow: {
        flexDirection: 'row',
        marginHorizontal: -Spacing.xs,
    },

    // Calculate Button
    calculateSection: {
        paddingHorizontal: Spacing.base,
        marginBottom: Spacing.betweenLg,    // 16px between sections - exact spec
    },
    calculateButton: {
        ...Shadow.none,  // No shadow for outline button
    },
    calculateButtonText: {
        fontSize: Typography.fontSize.body,
        fontWeight: '600',
        marginLeft: IconSpacing.gap,  // 8px gap - exact spec
        lineHeight: Typography.lineHeight.normal * Typography.fontSize.body,
    },

    // Asset Distribution
    assetSection: {
        paddingHorizontal: Spacing.base,
        marginBottom: Spacing.xl,
    },
    sectionTitle: {
        fontSize: Typography.fontSize.title,
        fontWeight: '700',
        marginBottom: Spacing.lg,
        letterSpacing: Typography.letterSpacing.tight,
        lineHeight: Typography.lineHeight.tight * Typography.fontSize.title,
    },
    assetItem: {
        marginBottom: Spacing.base,
        paddingVertical: Spacing.base,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    },
    assetHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.sm,
    },
    assetLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    assetRight: {
        alignItems: 'flex-end',
    },
    assetIcon: {
        width: 36,
        height: 36,
        borderRadius: BorderRadius.sm,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Spacing.base,
    },
    assetSymbol: {
        fontSize: Typography.fontSize.caption,
        fontWeight: '700',
        textTransform: 'uppercase',
        lineHeight: Typography.lineHeight.tight * Typography.fontSize.caption,
    },
    assetType: {
        fontSize: Typography.fontSize.body,
        fontWeight: '600',
        marginBottom: 2,
        lineHeight: Typography.lineHeight.normal * Typography.fontSize.body,
    },
    assetValue: {
        fontSize: Typography.fontSize.caption,
        fontWeight: '500',
        fontVariant: ['tabular-nums'] as any,
        lineHeight: Typography.lineHeight.normal * Typography.fontSize.caption,
    },
    assetPercentage: {
        fontSize: Typography.fontSize.caption,
        fontWeight: '700',
        paddingHorizontal: Spacing.sm,
        paddingVertical: Spacing.xs,
        borderRadius: BorderRadius.sm,
        overflow: 'hidden',
        fontVariant: ['tabular-nums'] as any,
    },
    progressBar: {
        height: 4,
        borderRadius: 2,
    },

    // Empty State
    emptyState: {
        alignItems: 'center',
        paddingVertical: Spacing['3xl'],
        paddingHorizontal: Spacing.lg,
    },
    emptyStateText: {
        fontSize: Typography.fontSize.subhead,
        fontWeight: '600',
        marginTop: Spacing.base,
        marginBottom: Spacing.sm,
        textAlign: 'center',
        lineHeight: Typography.lineHeight.normal * Typography.fontSize.subhead,
    },
    emptyStateSubtext: {
        fontSize: Typography.fontSize.body,
        textAlign: 'center',
        lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.body,
        opacity: 0.8,
    },

    // Bottom Padding
    bottomPadding: {
        height: 100, // Space for tab navigator
    },
});

export default HomeScreen;


