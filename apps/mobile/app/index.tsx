import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Sparkles, ArrowRight } from "lucide-react-native";
import { colors, spacing, borderRadius, fontSize, fontWeight, shadows } from "@/lib/theme";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";

export default function LandingScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { user, loading } = useAuth();

    // If user is already logged in, redirect to dashboard
    useEffect(() => {
        if (!loading && user) {
            router.replace('/(tabs)');
        }
    }, [user, loading]);

    const handleGetStarted = () => {
        // Go directly to wishlist in guest mode
        router.push('/(tabs)');
    };

    const handleSignIn = () => {
        router.push('/auth?mode=login');
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Background decorations */}
            <View style={styles.bgCircle1} />
            <View style={styles.bgCircle2} />

            <View style={styles.content}>
                {/* Logo */}
                <View style={styles.logoContainer}>
                    <View style={styles.logoBox}>
                        <Sparkles size={32} color={colors.primary} />
                    </View>
                    <Text style={styles.logoText}>Wishly</Text>
                </View>

                {/* Hero */}
                <View style={styles.heroSection}>
                    <View style={styles.badge}>
                        <Sparkles size={12} color={colors.primary} />
                        <Text style={styles.badgeText}>JOIN 10K+ CREATORS</Text>
                    </View>

                    <Text style={styles.heroTitle}>
                        Your Wishlist,{'\n'}
                        <Text style={styles.heroTitleAccent}>Reimagined</Text>
                    </Text>

                    <Text style={styles.heroSubtitle}>
                        Create beautiful, shareable wishlists that your followers will actually love.
                    </Text>
                </View>

                {/* CTA */}
                <View style={styles.ctaSection}>
                    <TouchableOpacity
                        style={styles.primaryButton}
                        onPress={handleGetStarted}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.primaryButtonText}>Get Started</Text>
                        <ArrowRight size={20} color={colors.white} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.secondaryButton}
                        onPress={handleSignIn}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.secondaryButtonText}>I already have an account</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Footer */}
            <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
                <Text style={styles.footerText}>
                    By continuing, you agree to our Terms & Privacy Policy
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    bgCircle1: {
        position: 'absolute',
        top: -100,
        right: -100,
        width: 300,
        height: 300,
        borderRadius: 150,
        backgroundColor: colors.primaryLight,
        opacity: 0.5,
    },
    bgCircle2: {
        position: 'absolute',
        bottom: -50,
        left: -100,
        width: 250,
        height: 250,
        borderRadius: 125,
        backgroundColor: '#E8F4FF',
        opacity: 0.4,
    },
    content: {
        flex: 1,
        paddingHorizontal: spacing.lg,
        justifyContent: 'center',
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.xxl,
    },
    logoBox: {
        width: 56,
        height: 56,
        borderRadius: borderRadius.xl,
        backgroundColor: colors.primaryLight,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    logoText: {
        fontSize: fontSize['3xl'],
        fontWeight: fontWeight.bold,
        color: colors.text,
        letterSpacing: -0.5,
    },
    heroSection: {
        alignItems: 'center',
        marginBottom: spacing.xxl,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.primaryLight,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.full,
        marginBottom: spacing.lg,
        gap: spacing.xs,
    },
    badgeText: {
        fontSize: fontSize.xs,
        fontWeight: fontWeight.bold,
        color: colors.primary,
        letterSpacing: 1.5,
    },
    heroTitle: {
        fontSize: fontSize['4xl'],
        fontWeight: fontWeight.extrabold,
        color: colors.text,
        textAlign: 'center',
        lineHeight: 44,
        marginBottom: spacing.md,
    },
    heroTitleAccent: {
        color: colors.primary,
    },
    heroSubtitle: {
        fontSize: fontSize.md,
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: 24,
        paddingHorizontal: spacing.lg,
    },
    ctaSection: {
        alignItems: 'center',
        gap: spacing.md,
    },
    primaryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.primary,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.xl,
        borderRadius: borderRadius.full,
        gap: spacing.sm,
        width: '100%',
        maxWidth: 320,
        ...shadows.primary,
    },
    primaryButtonText: {
        fontSize: fontSize.lg,
        fontWeight: fontWeight.bold,
        color: colors.white,
    },
    secondaryButton: {
        paddingVertical: spacing.sm,
    },
    secondaryButtonText: {
        fontSize: fontSize.base,
        color: colors.textMuted,
        fontWeight: fontWeight.medium,
    },
    footer: {
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
    },
    footerText: {
        fontSize: fontSize.xs,
        color: colors.textLight,
        textAlign: 'center',
    },
});
