import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { CardStyles, Colors, Shadow } from '../utils/designSystem';

interface ProfessionalCardProps {
    children: React.ReactNode;
    style?: ViewStyle;
    variant?: 'default' | 'highlighted' | 'success' | 'danger';
    theme?: 'dark' | 'light';
    shadowLevel?: 'none' | 'minimal' | 'card';
}

const ProfessionalCard: React.FC<ProfessionalCardProps> = ({
    children,
    style,
    variant = 'default',
    theme = 'dark',
    shadowLevel = 'card'
}) => {
    const colors = Colors[theme];

    const getCardStyle = () => {
        switch (variant) {
            case 'success':
                return CardStyles.success;
            case 'danger':
                return CardStyles.danger;
            case 'highlighted':
                return CardStyles.highlighted;
            default:
                return CardStyles.primary;
        }
    };

    const getShadowStyle = () => {
        switch (shadowLevel) {
            case 'none':
                return Shadow.none;
            case 'minimal':
                return Shadow.level1;  // Use level1 instead of minimal
            default:
                return Shadow.level1;  // Use level1 as default - exact spec
        }
    };

    const getInnerHighlight = () => {
        if (variant === 'highlighted' || variant === 'default') {
            return ['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0)'];
        }
        return null;
    };

    const cardStyle = getCardStyle();
    const shadowStyle = getShadowStyle();
    const innerHighlight = getInnerHighlight();

    if (innerHighlight) {
        return (
            <View style={[styles.container, shadowStyle, style]}>
                <View style={[cardStyle, styles.cardBase]}>
                    {/* Inner highlight gradient */}
                    <LinearGradient
                        colors={innerHighlight}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 0.3 }}
                        style={styles.innerHighlight}
                    />
                    <View style={styles.content}>
                        {children}
                    </View>
                </View>
            </View>
        );
    }

    return (
        <View style={[styles.container, shadowStyle, style]}>
            <View style={[cardStyle, styles.cardBase]}>
                <View style={styles.content}>
                    {children}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 16,               // Use direct value
    },
    cardBase: {
        borderRadius: 16,               // Use direct value
        overflow: 'hidden',
        position: 'relative',
    },
    innerHighlight: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '30%',
        borderTopLeftRadius: 16,        // Use direct value
        borderTopRightRadius: 16,       // Use direct value
    },
    content: {
        padding: 16,                // Use direct value - 16-20 inside cards - exact spec
        minHeight: 80,
    },
});

export default ProfessionalCard;
