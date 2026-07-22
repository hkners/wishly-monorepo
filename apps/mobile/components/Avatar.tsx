import React from 'react';
import { View, Text, StyleSheet } from "react-native";
import { colors, spacing, borderRadius, fontSize, fontWeight } from "@/lib/theme";
import { Image } from "expo-image";
import { User } from "lucide-react-native";

interface AvatarProps {
    uri?: string | null;
    size?: number;
    name?: string;
}

export function Avatar({ uri, size = 48, name }: AvatarProps) {
    const initials = name ? name.charAt(0).toUpperCase() : '?';

    if (uri) {
        return (
            <Image
                source={{ uri }}
                style={[
                    styles.image,
                    { width: size, height: size, borderRadius: size / 2 }
                ]}
                contentFit="cover"
                transition={200}
            />
        );
    }

    return (
        <View
            style={[
                styles.placeholder,
                { width: size, height: size, borderRadius: size / 2 }
            ]}
        >
            <User size={size * 0.4} color={colors.primary} />
        </View>
    );
}

const styles = StyleSheet.create({
    image: {
        backgroundColor: colors.cardAlt,
    },
    placeholder: {
        backgroundColor: colors.primaryLight,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
