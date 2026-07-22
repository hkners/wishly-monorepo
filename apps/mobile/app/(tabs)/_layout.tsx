import { Tabs } from "expo-router";
import { View, StyleSheet } from "react-native";
import { Sparkles, Plus, User } from "lucide-react-native";
import { colors, spacing } from "@/lib/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
    const insets = useSafeAreaInsets();

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: colors.white,
                    borderTopWidth: 1,
                    borderTopColor: colors.border,
                    height: 56 + insets.bottom,
                    paddingBottom: insets.bottom,
                },
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.textMuted,
                tabBarShowLabel: false,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Wishlist",
                    tabBarIcon: ({ color }) => (
                        <Sparkles size={24} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="add"
                options={{
                    title: "Add",
                    tabBarIcon: ({ color }) => (
                        <Plus size={24} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    tabBarIcon: ({ color }) => (
                        <User size={24} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
