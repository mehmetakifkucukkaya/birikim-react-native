// Premium Fintech Design System - Border-first Minimalism
export const Colors = {
    // Dark Theme (Primary) - Exact specifications
    dark: {
        background: {
            canvas: '#0B0F14',       // Main background - exact spec
            card: '#0F141B',         // Card surface - exact spec
            surface: '#151B23',      // Elevated surface
            floating: '#1A202C',     // FAB/Bottom sheet
        },
        text: {
            primary: '#E6EEF6',      // Headlines - exact spec
            secondary: '#B7C2CC',    // Body text - exact spec
            tertiary: '#6B7785',     // Helper text
            inverse: '#0F172A',      // Light backgrounds
        },
        accent: {
            primary: '#22C55E',      // Green - positive - exact spec
            secondary: '#06B6D4',    // Teal - info/secondary - exact spec
            danger: '#EF4444',       // Red - negative
            warning: '#F59E0B',      // Amber - warning
            neutral: '#B7C2CC',      // Neutral gray
        },
        border: {
            primary: 'rgba(255, 255, 255, 0.06)',    // Main borders - exact spec
            secondary: 'rgba(255, 255, 255, 0.04)',  // Dividers
            focus: 'rgba(34, 197, 94, 0.6)',         // Focus states - green tint
            outline: 'rgba(34, 197, 94, 1)',         // Outline buttons - 1.5px
        },
        highlight: {
            inner: 'rgba(255, 255, 255, 0.08)',      // Inner card highlight - subtle
            profit: 'rgba(34, 197, 94, 0.1)',        // Profit card - 10% green tint
            subtle: 'rgba(255, 255, 255, 0.04)',     // Very subtle highlight
        }
    },

    // Light Theme (Alternative) - Professional light mode
    light: {
        background: {
            canvas: '#F7F8FA',       // Main background
            card: '#FFFFFF',         // Card surface
            surface: '#F1F5F9',      // Elevated surface
            floating: '#FFFFFF',     // FAB/Bottom sheet
        },
        text: {
            primary: '#0F172A',      // Headlines
            secondary: '#475569',    // Body text
            tertiary: '#64748B',     // Helper text
            inverse: '#FFFFFF',      // Dark backgrounds
        },
        accent: {
            primary: '#22C55E',      // Green - positive
            secondary: '#06B6D4',    // Teal - info/secondary
            danger: '#EF4444',       // Red - negative
            warning: '#F59E0B',      // Amber - warning
            neutral: '#475569',      // Neutral gray
        },
        border: {
            primary: 'rgba(15, 23, 42, 0.08)',      // Main borders
            secondary: 'rgba(15, 23, 42, 0.04)',    // Dividers
            focus: 'rgba(34, 197, 94, 0.6)',        // Focus states
        },
        highlight: {
            inner: 'rgba(255, 255, 255, 0.95)',     // Inner card highlight
            subtle: 'rgba(255, 255, 255, 0.8)',     // Very subtle highlight
        }
    }
};

export const Typography = {
    fontFamily: {
        regular: 'Inter-Regular',
        medium: 'Inter-Medium',
        semiBold: 'Inter-SemiBold',
        bold: 'Inter-Bold',
    },

    fontSize: {
        caption: 13,     // Helper text, labels
        body: 16,        // Main body text - exact spec
        subhead: 18,     // Secondary headings
        title: 22,       // Card titles
        h2: 24,          // Section headers
        h1: 32,          // Main headers - exact spec (32 semibold)
        display: 32,     // Large display numbers - tabular
    },

    lineHeight: {
        tight: 1.2,      // Headlines
        normal: 1.4,     // Body text
        relaxed: 1.5,    // Comfortable reading
    },

    letterSpacing: {
        tight: -0.4,     // Large headings
        normal: 0,       // Body text
        wide: 0.4,       // Small caps, labels
    },

    // Tabular numbers for financial data - exact spec
    fontVariant: {
        tabular: ['tabular-nums'],
        normal: ['normal'],
    }
};

export const Spacing = {
    xs: 4,
    sm: 8,
    base: 16,       // Inside cards - exact spec
    lg: 20,         // Inside cards - exact spec  
    xl: 24,
    between: 12,    // Between cards - exact spec (12-16)
    betweenLg: 16,  // Between cards - exact spec (12-16)
    '2xl': 32,
    '3xl': 48,
    '4xl': 64,
};

export const BorderRadius = {
    sm: 8,
    base: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    full: 9999,
};

// Premium Shadow System - Exact Specifications
export const Shadow = {
    // Level 1: Card elevation - exact spec
    level1: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.22,        // Exact spec - 0.22 instead of 0.25
        shadowRadius: 12,
        elevation: 4,
    },

    // Level 2: FAB/floating elements - exact spec  
    level2: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.35,        // Exact spec
        shadowRadius: 30,
        elevation: 8,
    },

    // No shadow - border-first design
    none: {
        shadowColor: 'transparent',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 0,
    }
};

// Professional Card System - Border-first approach
export const CardStyles = {
    // Primary card style - border-first with subtle inner highlight
    primary: {
        backgroundColor: Colors.dark.background.card,
        borderWidth: 1,
        borderColor: Colors.dark.border.primary,
        borderRadius: 16,           // Use direct value instead of BorderRadius.lg
    },

    // Card with inner highlight for premium feel
    highlighted: {
        backgroundColor: Colors.dark.background.card,
        borderWidth: 1,
        borderColor: Colors.dark.border.primary,
        borderRadius: 16,           // Use direct value instead of BorderRadius.lg
        // Inner highlight will be added as LinearGradient
    },

    // Success variant for positive metrics
    success: {
        backgroundColor: Colors.dark.background.card,
        borderWidth: 1,
        borderColor: 'rgba(34, 197, 94, 0.2)',
        borderRadius: 16,           // Use direct value instead of BorderRadius.lg
    },

    // Danger variant for negative metrics
    danger: {
        backgroundColor: Colors.dark.background.card,
        borderWidth: 1,
        borderColor: 'rgba(239, 68, 68, 0.2)',
        borderRadius: 16,           // Use direct value instead of BorderRadius.lg
    }
};

// Button System - Outline Primary CTA
export const ButtonStyles = {
    // Primary outline button - exact spec
    primaryOutline: {
        backgroundColor: 'transparent',
        borderWidth: 1.5,           // Exact spec - 1.5px stroke
        borderColor: Colors.dark.border.outline,
        borderRadius: 12,           // Use direct value instead of BorderRadius.base
        paddingVertical: 16,        // Use direct value instead of Spacing.base
        paddingHorizontal: 20,      // Use direct value instead of Spacing.lg
    },

    // Secondary filled button
    secondaryFilled: {
        backgroundColor: Colors.dark.accent.secondary,
        borderWidth: 0,
        borderRadius: 12,           // Use direct value instead of BorderRadius.base
        paddingVertical: 16,        // Use direct value instead of Spacing.base
        paddingHorizontal: 20,      // Use direct value instead of Spacing.lg
    }
};

// Icon spacing - exact spec
export const IconSpacing = {
    gap: 8,                      // Icon gap - exact spec
    size: {
        small: 16,
        medium: 18,
        large: 20,
    }
};

// Utility functions with tabular number support
export const formatCurrency = (amount: number, currency: string = 'TRY'): string => {
    if (currency === 'TRY') {
        // Format: ₺12.345,67 with tabular nums
        return new Intl.NumberFormat('tr-TR', {
            style: 'currency',
            currency: 'TRY',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount);
    }

    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
};

export const formatPercentage = (value: number, showSign: boolean = true): string => {
    const sign = showSign && value > 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
};

export const getPerformanceColor = (value: number, theme: 'dark' | 'light' = 'dark'): string => {
    if (value > 0) return Colors[theme].accent.primary;
    if (value < 0) return Colors[theme].accent.danger;
    return Colors[theme].text.secondary;
};
