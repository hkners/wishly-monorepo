/**
 * Wishly App Theme
 * Centralized design tokens for consistent styling
 */

export const colors = {
    // Primary
    primary: '#f43f5e',
    primaryLight: '#FFEFF3',
    primaryDark: '#e11d48',

    // Background
    background: '#FDFCF8',
    card: '#FFFFFF',
    cardAlt: '#fafaf9',

    // Text
    text: '#0f172a',
    textSecondary: '#57534e',
    textMuted: '#a8a29e',
    textLight: '#d6d3d1',

    // Borders
    border: '#f5f5f4',
    borderDark: '#e7e5e4',

    // Status
    success: '#22c55e',
    error: '#ef4444',
    warning: '#f59e0b',

    // Social
    white: '#FFFFFF',
    black: '#000000',
    overlay: 'rgba(0, 0, 0, 0.5)',
};

export const spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
};

export const borderRadius = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    full: 9999,
};

export const fontSize = {
    xs: 10,
    sm: 12,
    base: 14,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
};

export const fontWeight = {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
};

export const shadows = {
    sm: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    md: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    lg: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
    },
    primary: {
        shadowColor: '#fecdd3',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.5,
        shadowRadius: 16,
        elevation: 8,
    },
};

// Common style patterns
export const commonStyles = {
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    centerContent: {
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
    },
    row: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
    },
    rowBetween: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        justifyContent: 'space-between' as const,
    },
};
