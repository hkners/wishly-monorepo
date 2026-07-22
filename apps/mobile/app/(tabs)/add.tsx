import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Alert,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import { supabase } from "@wishly/db/mobile";
import { useAuth } from "@/context/AuthContext";
import { useGuestWishlist } from "@/context/GuestWishlistContext";
import { scrapeUrl } from "@/lib/scraper";
import { colors, spacing, borderRadius, fontSize, fontWeight, shadows } from "@/lib/theme";
import { Link2, X, Plus, ArrowLeft, Sparkles } from "lucide-react-native";

interface ScrapedData {
    title: string;
    imageUrl: string | null;
    price: string | null;
    originalUrl: string;
}

export default function AddScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { user } = useAuth();
    const { addItem: addGuestItem } = useGuestWishlist();

    const isGuest = !user;

    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState<ScrapedData | null>(null);
    const [saving, setSaving] = useState(false);

    const handlePreview = async () => {
        if (!url) return;
        setLoading(true);
        setPreview(null);

        try {
            const data = await scrapeUrl(url);
            setPreview(data);
        } catch (e) {
            Alert.alert("Error", "Could not fetch details from this link.");
        } finally {
            setLoading(false);
        }
    };

    const handleAddItem = async () => {
        if (!preview) return;
        setSaving(true);

        try {
            if (isGuest) {
                // Guest mode: save to local storage
                await addGuestItem({
                    title: preview.title,
                    imageUrl: preview.imageUrl,
                    price: preview.price,
                    link: preview.originalUrl,
                });
            } else {
                // Authenticated: save to Supabase
                const { error } = await supabase
                    .from("items")
                    .insert({
                        title: preview.title,
                        image_url: preview.imageUrl,
                        price: preview.price,
                        original_url: preview.originalUrl,
                        user_id: user!.id,
                    });

                if (error) throw error;
            }

            Alert.alert("Success", "Item added to your wishlist!", [
                { text: "OK", onPress: () => router.replace("/(tabs)") }
            ]);
            setPreview(null);
            setUrl("");
        } catch (error: any) {
            Alert.alert("Error", error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleClear = () => {
        setUrl("");
        setPreview(null);
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.flex}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.iconContainer}>
                            <Sparkles size={28} color={colors.primary} />
                        </View>
                        <Text style={styles.title}>Add to Wishlist</Text>
                        <Text style={styles.subtitle}>
                            Paste a link to any product you love
                        </Text>
                    </View>

                    {/* URL Input */}
                    <View style={styles.inputContainer}>
                        <Link2 size={20} color={colors.textMuted} />
                        <TextInput
                            placeholder="https://example.com/product"
                            placeholderTextColor={colors.textMuted}
                            value={url}
                            onChangeText={setUrl}
                            style={styles.input}
                            autoCapitalize="none"
                            autoCorrect={false}
                            onSubmitEditing={handlePreview}
                        />
                        {url.length > 0 && (
                            <TouchableOpacity onPress={handleClear}>
                                <X size={20} color={colors.textMuted} />
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Preview Button */}
                    <TouchableOpacity
                        style={[styles.previewButton, !url && styles.buttonDisabled]}
                        onPress={handlePreview}
                        disabled={!url || loading}
                        activeOpacity={0.8}
                    >
                        {loading ? (
                            <ActivityIndicator color={colors.white} />
                        ) : (
                            <Text style={styles.previewButtonText}>Preview Link</Text>
                        )}
                    </TouchableOpacity>

                    {/* Preview Card */}
                    {preview && (
                        <View style={styles.previewCard}>
                            <View style={styles.previewHeader}>
                                <View style={styles.previewBadge}>
                                    <Text style={styles.previewBadgeText}>PREVIEW</Text>
                                </View>
                                <TouchableOpacity onPress={() => setPreview(null)}>
                                    <X size={20} color={colors.textMuted} />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.previewContent}>
                                {preview.imageUrl && (
                                    <Image
                                        source={{ uri: preview.imageUrl }}
                                        style={styles.previewImage}
                                        contentFit="cover"
                                        transition={200}
                                    />
                                )}
                                <View style={styles.previewDetails}>
                                    <Text style={styles.previewTitle} numberOfLines={2}>
                                        {preview.title}
                                    </Text>
                                    {preview.price && (
                                        <Text style={styles.previewPrice}>{preview.price}</Text>
                                    )}
                                </View>
                            </View>

                            <TouchableOpacity
                                style={styles.addButton}
                                onPress={handleAddItem}
                                disabled={saving}
                                activeOpacity={0.8}
                            >
                                {saving ? (
                                    <ActivityIndicator color={colors.white} />
                                ) : (
                                    <>
                                        <Plus size={20} color={colors.white} />
                                        <Text style={styles.addButtonText}>Add to Wishlist</Text>
                                    </>
                                )}
                            </TouchableOpacity>
                        </View>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    flex: {
        flex: 1,
    },
    scrollContent: {
        padding: spacing.lg,
        flexGrow: 1,
    },
    header: {
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: borderRadius.xl,
        backgroundColor: colors.primaryLight,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.md,
    },
    title: {
        fontSize: fontSize['2xl'],
        fontWeight: fontWeight.bold,
        color: colors.text,
        marginBottom: spacing.xs,
    },
    subtitle: {
        fontSize: fontSize.base,
        color: colors.textMuted,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.card,
        borderRadius: borderRadius.xl,
        paddingHorizontal: spacing.md,
        height: 56,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
        gap: spacing.sm,
    },
    input: {
        flex: 1,
        height: '100%',
        fontSize: fontSize.base,
        color: colors.text,
    },
    previewButton: {
        backgroundColor: colors.text,
        height: 56,
        borderRadius: borderRadius.xl,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.lg,
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    previewButtonText: {
        fontSize: fontSize.md,
        fontWeight: fontWeight.bold,
        color: colors.white,
    },
    previewCard: {
        backgroundColor: colors.card,
        borderRadius: borderRadius.xxl,
        padding: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
        ...shadows.md,
    },
    previewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    previewBadge: {
        backgroundColor: colors.cardAlt,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.sm,
    },
    previewBadgeText: {
        fontSize: fontSize.xs,
        fontWeight: fontWeight.bold,
        color: colors.textMuted,
        letterSpacing: 1,
    },
    previewContent: {
        flexDirection: 'row',
        gap: spacing.md,
        marginBottom: spacing.md,
    },
    previewImage: {
        width: 80,
        height: 80,
        borderRadius: borderRadius.md,
        backgroundColor: colors.cardAlt,
    },
    previewDetails: {
        flex: 1,
        justifyContent: 'center',
    },
    previewTitle: {
        fontSize: fontSize.md,
        fontWeight: fontWeight.medium,
        color: colors.text,
        lineHeight: 22,
        marginBottom: spacing.xs,
    },
    previewPrice: {
        fontSize: fontSize.lg,
        fontWeight: fontWeight.bold,
        color: colors.primary,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.primary,
        height: 52,
        borderRadius: borderRadius.lg,
        gap: spacing.sm,
        ...shadows.primary,
    },
    addButtonText: {
        fontSize: fontSize.md,
        fontWeight: fontWeight.bold,
        color: colors.white,
    },
});
