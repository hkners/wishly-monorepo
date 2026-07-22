import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking, Alert } from "react-native";
import { Image } from "expo-image";
import { Trash2, ExternalLink } from "lucide-react-native";
import { colors, spacing, borderRadius, fontSize, fontWeight, shadows } from "@/lib/theme";

interface WishlistItem {
    id: string;
    title: string;
    image_url: string | null;
    price: string | null;
    original_url: string;
}

interface WishlistCardProps {
    item: WishlistItem;
    onDelete: () => void;
}

export function WishlistCard({ item, onDelete }: WishlistCardProps) {
    const handlePress = () => {
        if (item.original_url) {
            Linking.openURL(item.original_url);
        }
    };

    const handleDelete = () => {
        Alert.alert(
            "Delete Item",
            "Are you sure you want to remove this from your wishlist?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", style: "destructive", onPress: onDelete },
            ]
        );
    };

    return (
        <View style={styles.card}>
            <TouchableOpacity onPress={handlePress} activeOpacity={0.9}>
                <View style={styles.imageContainer}>
                    {item.image_url ? (
                        <Image
                            source={{ uri: item.image_url }}
                            style={styles.image}
                            contentFit="cover"
                            transition={200}
                        />
                    ) : (
                        <View style={styles.placeholder}>
                            <ExternalLink size={24} color={colors.textMuted} />
                        </View>
                    )}
                </View>
            </TouchableOpacity>

            <View style={styles.content}>
                <Text style={styles.title} numberOfLines={2}>
                    {item.title}
                </Text>
                {item.price && (
                    <Text style={styles.price}>{item.price}</Text>
                )}
            </View>

            <View style={styles.actions}>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={handlePress}
                    activeOpacity={0.7}
                >
                    <ExternalLink size={16} color={colors.textSecondary} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={handleDelete}
                    activeOpacity={0.7}
                >
                    <Trash2 size={16} color={colors.error} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const CARD_WIDTH = '48%';

const styles = StyleSheet.create({
    card: {
        width: CARD_WIDTH,
        backgroundColor: colors.card,
        borderRadius: borderRadius.xl,
        marginBottom: spacing.md,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.border,
        ...shadows.sm,
    },
    imageContainer: {
        width: '100%',
        aspectRatio: 1,
        backgroundColor: colors.cardAlt,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    placeholder: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.cardAlt,
    },
    content: {
        padding: spacing.md,
    },
    title: {
        fontSize: fontSize.base,
        fontWeight: fontWeight.medium,
        color: colors.text,
        lineHeight: 20,
        marginBottom: spacing.xs,
    },
    price: {
        fontSize: fontSize.md,
        fontWeight: fontWeight.bold,
        color: colors.primary,
    },
    actions: {
        flexDirection: 'row',
        paddingHorizontal: spacing.md,
        paddingBottom: spacing.md,
        gap: spacing.sm,
    },
    actionButton: {
        width: 36,
        height: 36,
        borderRadius: borderRadius.full,
        backgroundColor: colors.cardAlt,
        alignItems: 'center',
        justifyContent: 'center',
    },
    deleteButton: {
        backgroundColor: '#FEE2E2',
    },
});
