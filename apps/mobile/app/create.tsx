import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Alert,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadows } from '@/lib/theme';
import { useGuestWishlist } from '@/context/GuestWishlistContext';
import { useAuth } from '@/context/AuthContext';
import { AuthModal } from '@/components/AuthModal';
import { supabase } from '@wishly/db/mobile';
import { Plus, Trash2, Share2, Link2, ImageIcon, Sparkles } from 'lucide-react-native';
import { Image } from 'expo-image';

export default function CreateWishlistScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { user } = useAuth();
    const { items, addItem, removeItem, clearItems, itemCount } = useGuestWishlist();

    const [title, setTitle] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [link, setLink] = useState('');
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [pendingAction, setPendingAction] = useState<'share' | 'item' | null>(null);

    // If user is already logged in, redirect to dashboard
    useEffect(() => {
        if (user) {
            router.replace('/(tabs)');
        }
    }, [user]);

    // Trigger auth modal when adding 2nd item
    useEffect(() => {
        if (itemCount >= 2 && !user && pendingAction === 'item') {
            setShowAuthModal(true);
        }
    }, [itemCount, user, pendingAction]);

    const handleAddItem = async () => {
        if (!title.trim()) {
            Alert.alert('Error', 'Please enter a title for your item');
            return;
        }

        await addItem({
            title: title.trim(),
            imageUrl: imageUrl.trim() || null,
            price: null,
            link: link.trim() || null,
        });

        // Clear form
        setTitle('');
        setImageUrl('');
        setLink('');

        // Check if this is the 2nd item
        if (itemCount === 1) {
            setPendingAction('item');
        }
    };

    const handleShare = () => {
        if (itemCount === 0) {
            Alert.alert('Add Items First', 'Add at least one item to your wishlist before sharing.');
            return;
        }
        setPendingAction('share');
        setShowAuthModal(true);
    };

    const handleAuthSuccess = async () => {
        setShowAuthModal(false);

        // Get current user
        const { data: { user: newUser } } = await supabase.auth.getUser();
        if (!newUser) return;

        // Sync local items to Supabase
        const guestItems = items;
        if (guestItems.length > 0) {
            const itemsToInsert = guestItems.map(item => ({
                title: item.title,
                image_url: item.imageUrl,
                original_url: item.link,
                price: null,
                user_id: newUser.id,
            }));

            const { error } = await supabase.from('items').insert(itemsToInsert);
            if (error) {
                console.error('Error syncing items:', error);
            } else {
                // Clear local storage after successful sync
                await clearItems();
            }
        }

        // Navigate to dashboard
        router.replace('/(tabs)');
    };

    const handleRemoveItem = (id: string) => {
        Alert.alert(
            'Remove Item',
            'Are you sure you want to remove this item?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Remove', style: 'destructive', onPress: () => removeItem(id) },
            ]
        );
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.flex}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.logoBox}>
                            <Sparkles size={24} color={colors.primary} />
                        </View>
                        <Text style={styles.title}>Create Your Wishlist</Text>
                        <Text style={styles.subtitle}>
                            Add items you'd love to receive. Share when you're ready!
                        </Text>
                    </View>

                    {/* Add Item Form */}
                    <View style={styles.formCard}>
                        <Text style={styles.formTitle}>Add an item</Text>

                        <View style={styles.inputGroup}>
                            <View style={styles.inputIcon}>
                                <Sparkles size={18} color={colors.textMuted} />
                            </View>
                            <TextInput
                                style={styles.input}
                                placeholder="What do you want? *"
                                placeholderTextColor={colors.textMuted}
                                value={title}
                                onChangeText={setTitle}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <View style={styles.inputIcon}>
                                <ImageIcon size={18} color={colors.textMuted} />
                            </View>
                            <TextInput
                                style={styles.input}
                                placeholder="Image URL (optional)"
                                placeholderTextColor={colors.textMuted}
                                value={imageUrl}
                                onChangeText={setImageUrl}
                                autoCapitalize="none"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <View style={styles.inputIcon}>
                                <Link2 size={18} color={colors.textMuted} />
                            </View>
                            <TextInput
                                style={styles.input}
                                placeholder="Product link (optional)"
                                placeholderTextColor={colors.textMuted}
                                value={link}
                                onChangeText={setLink}
                                autoCapitalize="none"
                                keyboardType="url"
                            />
                        </View>

                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={handleAddItem}
                            activeOpacity={0.8}
                        >
                            <Plus size={20} color={colors.white} />
                            <Text style={styles.addButtonText}>Add to Wishlist</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Items List */}
                    {items.length > 0 && (
                        <View style={styles.itemsSection}>
                            <Text style={styles.sectionTitle}>
                                Your Items ({items.length})
                            </Text>

                            {items.map(item => (
                                <View key={item.id} style={styles.itemCard}>
                                    {item.imageUrl && (
                                        <Image
                                            source={{ uri: item.imageUrl }}
                                            style={styles.itemImage}
                                            contentFit="cover"
                                        />
                                    )}
                                    <View style={styles.itemContent}>
                                        <Text style={styles.itemTitle} numberOfLines={2}>
                                            {item.title}
                                        </Text>
                                        {item.link && (
                                            <Text style={styles.itemLink} numberOfLines={1}>
                                                {item.link}
                                            </Text>
                                        )}
                                    </View>
                                    <TouchableOpacity
                                        style={styles.deleteButton}
                                        onPress={() => handleRemoveItem(item.id)}
                                    >
                                        <Trash2 size={16} color={colors.error} />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    )}
                </ScrollView>

                {/* Share Button (fixed at bottom) */}
                {items.length > 0 && (
                    <View style={[styles.shareContainer, { paddingBottom: insets.bottom + spacing.md }]}>
                        <TouchableOpacity
                            style={styles.shareButton}
                            onPress={handleShare}
                            activeOpacity={0.8}
                        >
                            <Share2 size={20} color={colors.white} />
                            <Text style={styles.shareButtonText}>Share Wishlist</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </KeyboardAvoidingView>

            {/* Auth Modal */}
            <AuthModal
                visible={showAuthModal}
                onClose={() => {
                    setShowAuthModal(false);
                    setPendingAction(null);
                }}
                onSuccess={handleAuthSuccess}
            />
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
        paddingBottom: 120,
    },
    header: {
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    logoBox: {
        width: 56,
        height: 56,
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
        textAlign: 'center',
    },
    formCard: {
        backgroundColor: colors.card,
        borderRadius: borderRadius.xxl,
        padding: spacing.lg,
        marginBottom: spacing.lg,
        borderWidth: 1,
        borderColor: colors.border,
        ...shadows.sm,
    },
    formTitle: {
        fontSize: fontSize.md,
        fontWeight: fontWeight.semibold,
        color: colors.text,
        marginBottom: spacing.md,
    },
    inputGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.cardAlt,
        borderRadius: borderRadius.lg,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
    },
    inputIcon: {
        paddingLeft: spacing.md,
    },
    input: {
        flex: 1,
        height: 48,
        paddingHorizontal: spacing.md,
        fontSize: fontSize.base,
        color: colors.text,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 48,
        backgroundColor: colors.text,
        borderRadius: borderRadius.lg,
        gap: spacing.sm,
    },
    addButtonText: {
        fontSize: fontSize.base,
        fontWeight: fontWeight.bold,
        color: colors.white,
    },
    itemsSection: {
        marginTop: spacing.md,
    },
    sectionTitle: {
        fontSize: fontSize.md,
        fontWeight: fontWeight.semibold,
        color: colors.text,
        marginBottom: spacing.md,
    },
    itemCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.card,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
        ...shadows.sm,
    },
    itemImage: {
        width: 48,
        height: 48,
        borderRadius: borderRadius.md,
        marginRight: spacing.md,
        backgroundColor: colors.cardAlt,
    },
    itemContent: {
        flex: 1,
    },
    itemTitle: {
        fontSize: fontSize.base,
        fontWeight: fontWeight.medium,
        color: colors.text,
        marginBottom: 2,
    },
    itemLink: {
        fontSize: fontSize.sm,
        color: colors.textMuted,
    },
    deleteButton: {
        width: 36,
        height: 36,
        borderRadius: borderRadius.full,
        backgroundColor: '#FEE2E2',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: spacing.sm,
    },
    shareContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.md,
        backgroundColor: colors.background,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    shareButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 56,
        backgroundColor: colors.primary,
        borderRadius: borderRadius.full,
        gap: spacing.sm,
        ...shadows.primary,
    },
    shareButtonText: {
        fontSize: fontSize.md,
        fontWeight: fontWeight.bold,
        color: colors.white,
    },
});
