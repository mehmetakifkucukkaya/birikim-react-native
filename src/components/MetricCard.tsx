import { Icon } from '@rneui/themed';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors, Typography, formatCurrency, formatPercentage, getPerformanceColor } from '../utils/designSystem';
import ProfessionalCard from './GlassCard';

interface MetricCardProps {
    title: string;
    value: number;
    type: 'currency' | 'percentage';
    icon: string;
    iconType?: string;
    iconColor?: string;
    trend?: number; // For sparkline effect
    theme?: 'dark' | 'light';
    variant?: 'default' | 'success' | 'danger';
}

const MetricCard: React.FC<MetricCardProps> = ({
    title,
    value,
    type,
    icon,
    iconType = 'material',
    iconColor,
    trend,
    theme = 'dark',
    variant = 'default'
}) => {
    const colors = Colors[theme];

    const getCardVariant = () => {
        if (variant !== 'default') return variant;
        if (type === 'percentage') {
            // For profit card, use subtle tint instead of full success variant
            return 'default';
        }
        return 'default';
    };

    // Get background tint for profit cards - 10% green tint, not full fill
    const getCardBackgroundTint = () => {
        if (type === 'percentage' && value >= 0) {
            return colors.highlight.profit;  // 10% green tint - exact spec
        }
        if (type === 'percentage' && value < 0) {
            return 'rgba(239, 68, 68, 0.1)';  // 10% red tint
        }
        return 'transparent';
    };

    const getValueColor = () => {
        if (type === 'percentage') {
            return getPerformanceColor(value, theme);
        }
        return colors.text.primary;
    };

    const formatValue = () => {
        if (type === 'currency') {
            return formatCurrency(value);
        }
        return formatPercentage(value, true);
    };

    return (
        <View style={[styles.card, { backgroundColor: getCardBackgroundTint() }]}>
            <ProfessionalCard
                variant={getCardVariant()}
                theme={theme}
                style={styles.innerCard}
                shadowLevel="card"
            >
                <View style={styles.header}>
                    <View style={[styles.iconContainer, { backgroundColor: colors.highlight.inner }]}>
                        <Icon
                            name={icon}
                            type={iconType}
                            size={18}
                            color={iconColor || colors.accent.secondary}
                        />
                    </View>
                    <Text style={[styles.title, { color: colors.text.tertiary }]}>
                        {title}
                    </Text>
                </View>

                <View style={styles.content}>
                    <Text style={[
                        styles.value,
                        {
                            color: getValueColor(),
                            fontVariant: ['tabular-nums'] as any,
                        }
                    ]}>
                        {formatValue()}
                    </Text>

                    {trend !== undefined && (
                        <View style={styles.trendContainer}>
                            <Icon
                                name={trend >= 0 ? 'trending-up' : 'trending-down'}
                                type="material"
                                size={14}
                                color={getPerformanceColor(trend, theme)}
                            />
                            <View style={styles.sparkline}>
                                {/* Refined mini sparkline */}
                                <View style={[
                                    styles.sparklineDot,
                                    { backgroundColor: getPerformanceColor(trend, theme) }
                                ]} />
                                <View style={[
                                    styles.sparklineDot,
                                    { backgroundColor: getPerformanceColor(trend, theme), opacity: 0.7 }
                                ]} />
                                <View style={[
                                    styles.sparklineDot,
                                    { backgroundColor: getPerformanceColor(trend, theme), opacity: 0.4 }
                                ]} />
                            </View>
                        </View>
                    )}
                </View>
            </ProfessionalCard>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        flex: 1,
        marginHorizontal: 4,              // Direct value - Spacing.xs
        marginBottom: 12,                 // Direct value - 12-16 between cards - exact spec
        borderRadius: 16,                 // Direct value - BorderRadius.lg
        overflow: 'hidden',
    },
    innerCard: {
        margin: 0,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,                 // Direct value - Spacing.base
    },
    iconContainer: {
        width: 28,
        height: 28,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,                   // Direct value - Spacing.sm
    },
    title: {
        fontSize: Typography.fontSize.caption,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: Typography.letterSpacing.wide,
        lineHeight: Typography.lineHeight.tight * Typography.fontSize.caption,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        marginTop: 4,                     // Direct value - Spacing.xs
    },
    value: {
        fontSize: Typography.fontSize.display,
        fontWeight: '700',
        letterSpacing: Typography.letterSpacing.tight,
        lineHeight: Typography.lineHeight.tight * Typography.fontSize.display,
    },
    trendContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 8,                    // Direct value - Spacing.sm
    },
    sparkline: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginLeft: 4,                    // Direct value - Spacing.xs
    },
    sparklineDot: {
        width: 2,
        height: 8,
        borderRadius: 1,
        marginHorizontal: 0.5,
    },
});

export default MetricCard;
