import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
    View,
    Text,
    ScrollView,
    RefreshControl,
    TouchableOpacity,
    TextInput,
    Alert,
    StyleSheet,
    Share,
    ActivityIndicator,
    Linking,
    Animated,
    Easing,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { supabase } from "@wishly/db/mobile";
import { useAuth } from "@/context/AuthContext";
import { useGuestWishlist } from "@/context/GuestWishlistContext";
import { colors, spacing, borderRadius, fontSize, fontWeight, shadows } from "@/lib/theme";
import { EmptyState } from "@/components/EmptyState";
import { Sparkles, Share2, Plus, Loader2, Trash2, ExternalLink, LogIn } from "lucide-react-native";
import { FontAwesome } from "@expo/vector-icons";
import { scrapeUrl } from "@/lib/scraper";
import { useRouter } from "expo-router";

interface WishlistItem {
    id: string;
    title: string;
    image_url: string | null;
    price: string | null;
    original_url: string;
    created_at: string;
}

interface Profile {
    username: string | null;
    avatar_url: string | null;
}

// Extract store name from URL
function getStoreName(url: string): string {
    try {
        const hostname = new URL(url).hostname.replace('www.', '');
        const parts = hostname.split('.');
        return parts[0].toUpperCase();
    } catch {
        return 'STORE';
    }
}

export default function DashboardScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { user } = useAuth();
    const { items: guestItems, addItem: addGuestItem, removeItem: removeGuestItem } = useGuestWishlist();

    // Determine if we're in guest mode
    const isGuest = !user;

    const [items, setItems] = useState<WishlistItem[]>([]);
    const [profile, setProfile] = useState<Profile>({ username: null, avatar_url: null });
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [quickAddUrl, setQuickAddUrl] = useState("");
    const [adding, setAdding] = useState(false);

    // Smooth spin animation for loader
    const spinAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (adding) {
            spinAnim.setValue(0);
            Animated.loop(
                Animated.timing(spinAnim, {
                    toValue: 1,
                    duration: 600,
                    easing: Easing.linear,
                    useNativeDriver: true,
                })
            ).start();
        } else {
            spinAnim.setValue(0);
        }
    }, [adding]);

    const spin = spinAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const fetchData = useCallback(async () => {
        if (isGuest) {
            // In guest mode, use local items from context
            const localItems: WishlistItem[] = guestItems.map(item => ({
                id: item.id,
                title: item.title,
                image_url: item.imageUrl,
                price: item.price,
                original_url: item.link || '',
                created_at: item.createdAt,
            }));
            setItems(localItems);
            setProfile({ username: 'Guest', avatar_url: null });
            setLoading(false);
            setRefreshing(false);
            return;
        }

        try {
            const { data: profileData } = await supabase
                .from("profiles")
                .select("username, avatar_url")
                .eq("id", user!.id)
                .single();

            if (profileData) {
                setProfile(profileData);
            }

            const { data: itemsData, error } = await supabase
                .from("items")
                .select("*")
                .eq("user_id", user!.id)
                .order("position", { ascending: true });

            if (error) throw error;
            setItems(itemsData || []);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [user, isGuest, guestItems]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleRefresh = useCallback(() => {
        setRefreshing(true);
        fetchData();
    }, [fetchData]);

    // Check if a string is a valid URL
    const isValidUrl = (text: string): boolean => {
        try {
            const url = new URL(text.trim());
            return url.protocol === 'http:' || url.protocol === 'https:';
        } catch {
            return false;
        }
    };

    const handleQuickAdd = async (urlToAdd?: string) => {
        const url = urlToAdd || quickAddUrl;
        if (!url || adding) return;
        setAdding(true);

        try {
            const data = await scrapeUrl(url);

            if (isGuest) {
                // Guest mode: save to local storage
                await addGuestItem({
                    title: data.title,
                    imageUrl: data.imageUrl,
                    price: data.price,
                    link: data.originalUrl,
                });
            } else {
                // Authenticated: save to Supabase
                const { error } = await supabase
                    .from("items")
                    .insert({
                        title: data.title,
                        image_url: data.imageUrl,
                        price: data.price,
                        original_url: data.originalUrl,
                        user_id: user!.id,
                        position: 0,
                    });

                if (error) throw error;
            }

            setQuickAddUrl("");
            Alert.alert("Success", "Item added to your wishlist!");
            fetchData();
        } catch (e) {
            Alert.alert("Error", "Failed to add item. Please try again.");
        } finally {
            setAdding(false);
        }
    };

    // Handle text input change - auto-add if a valid URL is pasted
    const handleUrlChange = (text: string) => {
        setQuickAddUrl(text);

        // Auto-add if a valid URL is pasted (detected by having http/https and being longer)
        if (isValidUrl(text) && text.length > 10) {
            // Small delay to allow the UI to update before starting the add
            setTimeout(() => {
                handleQuickAdd(text);
            }, 300);
        }
    };

    const handleDeleteItem = (id: string) => {
        Alert.alert(
            "Delete Item",
            "Are you sure you want to remove this?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            if (isGuest) {
                                await removeGuestItem(id);
                                fetchData();
                            } else {
                                const { error } = await supabase.from("items").delete().eq("id", id);
                                if (error) throw error;
                                setItems(items.filter(item => item.id !== id));
                            }
                        } catch (error) {
                            Alert.alert("Error", "Failed to delete item");
                        }
                    }
                },
            ]
        );
    };

    const handleShare = () => {
        if (isGuest) {
            Alert.alert(
                "Share Your Wishlist",
                "Sign up to share your wishlist with friends and family!",
                [
                    { text: "Maybe Later", style: "cancel" },
                    { text: "Sign Up", onPress: handleSignIn }
                ]
            );
            return;
        }
        Share.share({
            message: `Check out ${profile.username}'s wishlist on Wishly! https://wishly.gocampai.com/${profile.username}`,
        });
    };

    const handleOpenLink = (url: string) => {
        if (url) {
            Linking.openURL(url);
        }
    };

    const handleSignIn = () => {
        router.push('/auth');
    };

    const username = profile.username || "Guest";

    if (loading) {
        return (
            <View style={[styles.container, styles.centered, { paddingTop: insets.top }]}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        tintColor={colors.primary}
                    />
                }
                showsVerticalScrollIndicator={false}
            >
                {/* Guest Banner */}
                {isGuest && (
                    <TouchableOpacity style={styles.guestBanner} onPress={handleSignIn} activeOpacity={0.9}>
                        <View style={styles.guestBannerContent}>
                            <LogIn size={18} color={colors.white} />
                            <Text style={styles.guestBannerText}>Sign up to save your wishlist</Text>
                        </View>
                        <Text style={styles.guestBannerArrow}>→</Text>
                    </TouchableOpacity>
                )}

                {/* Profile Card */}
                <View style={styles.profileCard}>
                    <View style={styles.profileLeft}>
                        <View style={styles.avatarFlower}>
                            <Text style={styles.flowerEmoji}>{isGuest ? '👋' : '🌸'}</Text>
                        </View>
                        <View>
                            <Text style={styles.username}>{username}</Text>
                            {!isGuest && (
                                <View style={styles.socialIcons}>
                                    <TouchableOpacity style={styles.socialIcon}>
                                        <FontAwesome name="instagram" size={16} color={colors.text} />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.socialIcon}>
                                        <FontAwesome name="music" size={14} color={colors.text} />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.socialIcon}>
                                        <FontAwesome name="twitter" size={16} color={colors.text} />
                                    </TouchableOpacity>
                                </View>
                            )}
                            {isGuest && (
                                <Text style={styles.guestSubtext}>Your items are saved locally</Text>
                            )}
                        </View>
                    </View>
                    <TouchableOpacity style={styles.shareIconButton} onPress={handleShare}>
                        <Share2 size={18} color={colors.textSecondary} />
                    </TouchableOpacity>
                </View>

                {/* Quick Add Bar */}
                <View style={styles.quickAddContainer}>
                    <TextInput
                        placeholder="Paste a link to add..."
                        placeholderTextColor={colors.textMuted}
                        value={quickAddUrl}
                        onChangeText={handleUrlChange}
                        style={styles.quickAddInput}
                        onSubmitEditing={() => handleQuickAdd()}
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                    <TouchableOpacity
                        style={[
                            styles.quickAddButton,
                            quickAddUrl ? styles.quickAddButtonActive : null,
                        ]}
                        onPress={() => handleQuickAdd()}
                        disabled={adding || !quickAddUrl}
                    >
                        {adding ? (
                            <Animated.View style={{ transform: [{ rotate: spin }] }}>
                                <Loader2 size={18} color={colors.white} />
                            </Animated.View>
                        ) : (
                            <Plus size={18} color={quickAddUrl ? colors.white : colors.textLight} />
                        )}
                    </TouchableOpacity>
                </View>

                {/* Items Grid */}
                {items.length > 0 ? (
                    <View style={styles.grid}>
                        {items.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                style={styles.card}
                                onPress={() => handleOpenLink(item.original_url)}
                                activeOpacity={0.9}
                            >
                                {/* Image Container with Store and Price Badges */}
                                <View style={styles.imageWrapper}>
                                    {/* Store Label Badge */}
                                    {item.original_url && (
                                        <View style={styles.storeBadge}>
                                            <Text style={styles.storeLabel}>
                                                {getStoreName(item.original_url)}
                                            </Text>
                                        </View>
                                    )}

                                    {item.image_url ? (
                                        <Image
                                            source={{ uri: item.image_url }}
                                            style={styles.cardImage}
                                            contentFit="contain"
                                            transition={200}
                                        />
                                    ) : (
                                        <View style={styles.imagePlaceholder}>
                                            <ExternalLink size={32} color={colors.textMuted} />
                                        </View>
                                    )}
                                    {item.price && (
                                        <View style={styles.priceBadge}>
                                            <Text style={styles.priceText}>{item.price}</Text>
                                        </View>
                                    )}
                                </View>

                                {/* Title */}
                                <Text style={styles.cardTitle} numberOfLines={2}>
                                    {item.title}
                                </Text>

                                {/* Delete Button */}
                                <TouchableOpacity
                                    style={styles.deleteButton}
                                    onPress={() => handleDeleteItem(item.id)}
                                >
                                    <Trash2 size={14} color={colors.error} />
                                </TouchableOpacity>
                            </TouchableOpacity>
                        ))}
                    </View>
                ) : (
                    <EmptyState
                        icon={<Sparkles size={48} color={colors.primary} />}
                        title="Your wishlist is empty"
                        description="Paste a link above or tap the + button to add your first wish!"
                        actionLabel="Add Your First Item"
                        onAction={() => router.push('/(tabs)/add')}
                    />
                )}
            </ScrollView>
        </View>
    );
}

const CARD_WIDTH = '48%';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFE4EC',
    },
    centered: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollContent: {
        paddingHorizontal: spacing.md,
        paddingBottom: 120,
    },
    // Guest Banner
    guestBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.primary,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.lg,
        marginTop: spacing.md,
        marginBottom: spacing.sm,
    },
    guestBannerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    guestBannerText: {
        color: colors.white,
        fontWeight: fontWeight.semibold,
        fontSize: fontSize.sm,
    },
    guestBannerArrow: {
        color: colors.white,
        fontSize: fontSize.lg,
        fontWeight: fontWeight.bold,
    },
    // Profile Card
    profileCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.white,
        padding: spacing.md,
        borderRadius: borderRadius.xxl,
        marginTop: spacing.md,
        marginBottom: spacing.lg,
        ...shadows.md,
    },
    profileLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
    },
    avatarFlower: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#FFF0F5',
        alignItems: 'center',
        justifyContent: 'center',
    },
    flowerEmoji: {
        fontSize: 24,
    },
    username: {
        fontSize: fontSize.lg,
        fontWeight: fontWeight.bold,
        color: colors.text,
        marginBottom: 4,
    },
    guestSubtext: {
        fontSize: fontSize.xs,
        color: colors.textMuted,
    },
    socialIcons: {
        flexDirection: 'row',
        gap: spacing.sm,
    },
    socialIcon: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: colors.cardAlt,
        alignItems: 'center',
        justifyContent: 'center',
    },
    shareIconButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.cardAlt,
        alignItems: 'center',
        justifyContent: 'center',
    },
    // Quick Add
    quickAddContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        borderRadius: borderRadius.full,
        paddingHorizontal: spacing.md,
        height: 52,
        marginBottom: spacing.lg,
        ...shadows.sm,
    },
    quickAddInput: {
        flex: 1,
        height: '100%',
        fontSize: fontSize.base,
        color: colors.text,
    },
    quickAddButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: colors.cardAlt,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: spacing.sm,
    },
    quickAddButtonActive: {
        backgroundColor: colors.primary,
    },
    // Grid & Cards
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        width: CARD_WIDTH,
        backgroundColor: colors.white,
        borderRadius: borderRadius.xl,
        marginBottom: spacing.md,
        padding: spacing.md,
        position: 'relative',
        ...shadows.sm,
    },
    storeBadge: {
        position: 'absolute',
        top: spacing.xs,
        left: spacing.xs,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        paddingHorizontal: spacing.sm,
        paddingVertical: 2,
        borderRadius: borderRadius.sm,
        zIndex: 10,
    },
    storeLabel: {
        fontSize: 9,
        fontWeight: fontWeight.bold,
        color: colors.textSecondary,
        letterSpacing: 0.5,
    },
    imageWrapper: {
        width: '100%',
        aspectRatio: 1,
        backgroundColor: '#FAFAFA',
        borderRadius: borderRadius.lg,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.sm,
        position: 'relative',
        overflow: 'hidden',
    },
    cardImage: {
        width: '85%',
        height: '85%',
    },
    imagePlaceholder: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    priceBadge: {
        position: 'absolute',
        bottom: spacing.xs,
        right: spacing.xs,
        backgroundColor: '#1a1a2e',
        paddingHorizontal: spacing.sm,
        paddingVertical: 2,
        borderRadius: borderRadius.md,
    },
    priceText: {
        fontSize: 10,
        fontWeight: fontWeight.bold,
        color: colors.white,
    },
    cardTitle: {
        fontSize: fontSize.sm,
        fontWeight: fontWeight.medium,
        color: colors.text,
        lineHeight: 18,
        textAlign: 'center',
    },
    deleteButton: {
        position: 'absolute',
        top: spacing.sm,
        right: spacing.sm,
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#FEE2E2',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
