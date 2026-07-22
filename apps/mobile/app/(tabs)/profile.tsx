import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Alert,
    StyleSheet,
    ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { supabase } from "@wishly/db/mobile";
import { useAuth } from "@/context/AuthContext";
import { useGuestWishlist } from "@/context/GuestWishlistContext";
import { colors, spacing, borderRadius, fontSize, fontWeight, shadows } from "@/lib/theme";
import { Avatar } from "@/components/Avatar";
import { LogOut, Camera, User, Globe, LogIn, Sparkles, ArrowRight } from "lucide-react-native";

export default function ProfileScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { user, signOut } = useAuth();
    const { itemCount, clearItems } = useGuestWishlist();

    const isGuest = !user;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [username, setUsername] = useState("");
    const [fullName, setFullName] = useState("");
    const [website, setWebsite] = useState("");
    const [avatarUrl, setAvatarUrl] = useState("");

    useEffect(() => {
        if (isGuest) {
            setLoading(false);
            return;
        }
        fetchProfile();
    }, [isGuest]);

    const fetchProfile = async () => {
        try {
            if (!user) return;

            const { data, error } = await supabase
                .from("profiles")
                .select("username, website, avatar_url, full_name")
                .eq("id", user.id)
                .single();

            if (error && error.code !== 'PGRST116') throw error;

            if (data) {
                setUsername(data.username || "");
                setWebsite(data.website || "");
                setAvatarUrl(data.avatar_url || "");
                setFullName(data.full_name || "");
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
        } finally {
            setLoading(false);
        }
    };

    const updateProfile = async () => {
        try {
            setSaving(true);
            if (!user) throw new Error("No user");

            const updates = {
                id: user.id,
                username,
                website,
                full_name: fullName,
                avatar_url: avatarUrl,
                updated_at: new Date().toISOString(),
            };

            const { error } = await supabase.from("profiles").upsert(updates);
            if (error) throw error;

            Alert.alert("Success", "Profile updated!");
        } catch (error: any) {
            Alert.alert("Error", error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = async () => {
        Alert.alert(
            "Sign Out",
            "Are you sure you want to sign out?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Sign Out",
                    style: "destructive",
                    onPress: async () => {
                        await signOut();
                        router.replace("/");
                    }
                },
            ]
        );
    };

    const handleSignIn = () => {
        router.push('/auth');
    };

    const handleClearGuestData = () => {
        Alert.alert(
            "Clear Local Data",
            "This will remove all items from your guest wishlist. Continue?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Clear",
                    style: "destructive",
                    onPress: async () => {
                        await clearItems();
                        Alert.alert("Done", "Your local wishlist has been cleared.");
                    }
                },
            ]
        );
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.centered, { paddingTop: insets.top }]}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    // Guest Profile View
    if (isGuest) {
        return (
            <View style={[styles.container, { paddingTop: insets.top }]}>
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Profile</Text>
                    </View>

                    {/* Guest Hero */}
                    <View style={styles.guestHero}>
                        <View style={styles.guestIconWrapper}>
                            <Sparkles size={48} color={colors.primary} />
                        </View>
                        <Text style={styles.guestTitle}>You're in Guest Mode</Text>
                        <Text style={styles.guestDescription}>
                            Sign in to save your wishlist to the cloud, share it with friends, and access it from any device.
                        </Text>

                        <TouchableOpacity
                            style={styles.signInButton}
                            onPress={handleSignIn}
                            activeOpacity={0.8}
                        >
                            <LogIn size={20} color={colors.white} />
                            <Text style={styles.signInButtonText}>Sign In or Create Account</Text>
                            <ArrowRight size={18} color={colors.white} />
                        </TouchableOpacity>
                    </View>

                    {/* Guest Info Card */}
                    <View style={styles.guestInfoCard}>
                        <View style={styles.guestInfoRow}>
                            <Text style={styles.guestInfoLabel}>Local Items</Text>
                            <Text style={styles.guestInfoValue}>{itemCount}</Text>
                        </View>
                        <View style={styles.guestInfoDivider} />
                        <Text style={styles.guestWarning}>
                            ⚠️ Items are stored locally and will be lost if you clear app data
                        </Text>
                    </View>

                    {/* Clear Data Button */}
                    {itemCount > 0 && (
                        <TouchableOpacity
                            style={styles.clearButton}
                            onPress={handleClearGuestData}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.clearButtonText}>Clear Local Data</Text>
                        </TouchableOpacity>
                    )}
                </ScrollView>
            </View>
        );
    }

    // Authenticated Profile View
    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Profile</Text>
                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                        <LogOut size={20} color={colors.error} />
                    </TouchableOpacity>
                </View>

                {/* Avatar Section */}
                <View style={styles.avatarSection}>
                    <View style={styles.avatarWrapper}>
                        <Avatar uri={avatarUrl} size={100} name={fullName || username} />
                        <TouchableOpacity style={styles.cameraButton}>
                            <Camera size={16} color={colors.white} />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.displayName}>{fullName || username || "Your Name"}</Text>
                    <Text style={styles.emailText}>{user?.email}</Text>
                </View>

                {/* Form */}
                <View style={styles.form}>
                    <View style={styles.inputGroup}>
                        <View style={styles.labelRow}>
                            <User size={16} color={colors.textMuted} />
                            <Text style={styles.label}>Full Name</Text>
                        </View>
                        <TextInput
                            value={fullName}
                            onChangeText={setFullName}
                            placeholder="Your full name"
                            placeholderTextColor={colors.textMuted}
                            style={styles.input}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <View style={styles.labelRow}>
                            <Text style={styles.atSymbol}>@</Text>
                            <Text style={styles.label}>Username</Text>
                        </View>
                        <TextInput
                            value={username}
                            onChangeText={setUsername}
                            placeholder="username"
                            placeholderTextColor={colors.textMuted}
                            style={styles.input}
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <View style={styles.labelRow}>
                            <Globe size={16} color={colors.textMuted} />
                            <Text style={styles.label}>Website</Text>
                        </View>
                        <TextInput
                            value={website}
                            onChangeText={setWebsite}
                            placeholder="https://yoursite.com"
                            placeholderTextColor={colors.textMuted}
                            style={styles.input}
                            autoCapitalize="none"
                            keyboardType="url"
                        />
                    </View>
                </View>

                {/* Save Button */}
                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={updateProfile}
                    disabled={saving}
                    activeOpacity={0.8}
                >
                    {saving ? (
                        <ActivityIndicator color={colors.white} />
                    ) : (
                        <Text style={styles.saveButtonText}>Save Changes</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    centered: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollContent: {
        padding: spacing.lg,
        paddingBottom: 120,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    headerTitle: {
        fontSize: fontSize['2xl'],
        fontWeight: fontWeight.bold,
        color: colors.text,
    },
    logoutButton: {
        width: 44,
        height: 44,
        borderRadius: borderRadius.full,
        backgroundColor: '#FEE2E2',
        alignItems: 'center',
        justifyContent: 'center',
    },
    // Guest Hero
    guestHero: {
        alignItems: 'center',
        backgroundColor: colors.white,
        borderRadius: borderRadius.xxl,
        padding: spacing.xl,
        marginBottom: spacing.lg,
        ...shadows.md,
    },
    guestIconWrapper: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: colors.primaryLight,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.lg,
    },
    guestTitle: {
        fontSize: fontSize.xl,
        fontWeight: fontWeight.bold,
        color: colors.text,
        marginBottom: spacing.sm,
    },
    guestDescription: {
        fontSize: fontSize.base,
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: spacing.lg,
    },
    signInButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.primary,
        height: 52,
        borderRadius: borderRadius.xl,
        paddingHorizontal: spacing.lg,
        gap: spacing.sm,
        width: '100%',
        ...shadows.primary,
    },
    signInButtonText: {
        color: colors.white,
        fontSize: fontSize.md,
        fontWeight: fontWeight.bold,
    },
    // Guest Info Card
    guestInfoCard: {
        backgroundColor: colors.white,
        borderRadius: borderRadius.xl,
        padding: spacing.lg,
        marginBottom: spacing.lg,
        ...shadows.sm,
    },
    guestInfoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    guestInfoLabel: {
        fontSize: fontSize.base,
        color: colors.textSecondary,
    },
    guestInfoValue: {
        fontSize: fontSize.lg,
        fontWeight: fontWeight.bold,
        color: colors.text,
    },
    guestInfoDivider: {
        height: 1,
        backgroundColor: colors.border,
        marginVertical: spacing.md,
    },
    guestWarning: {
        fontSize: fontSize.sm,
        color: colors.textMuted,
        lineHeight: 20,
    },
    clearButton: {
        alignItems: 'center',
        paddingVertical: spacing.md,
    },
    clearButtonText: {
        fontSize: fontSize.base,
        color: colors.error,
        fontWeight: fontWeight.medium,
    },
    // Avatar Section
    avatarSection: {
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    avatarWrapper: {
        position: 'relative',
        marginBottom: spacing.md,
    },
    cameraButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: colors.background,
    },
    displayName: {
        fontSize: fontSize.xl,
        fontWeight: fontWeight.bold,
        color: colors.text,
        marginBottom: spacing.xs,
    },
    emailText: {
        fontSize: fontSize.base,
        color: colors.textMuted,
    },
    form: {
        gap: spacing.lg,
        marginBottom: spacing.xl,
    },
    inputGroup: {
        gap: spacing.sm,
    },
    labelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    label: {
        fontSize: fontSize.sm,
        fontWeight: fontWeight.medium,
        color: colors.textSecondary,
    },
    atSymbol: {
        fontSize: fontSize.md,
        fontWeight: fontWeight.medium,
        color: colors.textMuted,
    },
    input: {
        backgroundColor: colors.card,
        borderRadius: borderRadius.lg,
        paddingHorizontal: spacing.md,
        height: 52,
        fontSize: fontSize.base,
        color: colors.text,
        borderWidth: 1,
        borderColor: colors.border,
    },
    saveButton: {
        backgroundColor: colors.primary,
        height: 56,
        borderRadius: borderRadius.xl,
        alignItems: 'center',
        justifyContent: 'center',
        ...shadows.primary,
    },
    saveButtonText: {
        fontSize: fontSize.md,
        fontWeight: fontWeight.bold,
        color: colors.white,
    },
});
