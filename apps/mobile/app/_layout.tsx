import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { GuestWishlistProvider } from "@/context/GuestWishlistContext";
import { View, ActivityIndicator, StyleSheet, LogBox } from "react-native";
import { colors } from "@/lib/theme";

// Suppress SafeAreaView deprecation warning from third-party libraries
LogBox.ignoreLogs([
    "SafeAreaView has been deprecated",
    /SafeAreaView/,
]);

function RootLayoutNav() {
    const { user, loading } = useAuth();
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        if (loading) return;

        const inAuthGroup = segments[0] === '(tabs)';
        const inAuthScreen = segments[0] === 'auth';

        // If user is logged in and on landing or auth page, redirect to tabs
        if (user && !inAuthGroup && segments[0] !== 'create') {
            router.replace('/(tabs)');
        }
        // Allow guest access to tabs - don't redirect them away
        // Only redirect from auth page if already logged in
    }, [user, loading, segments]);


    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <>
            <StatusBar style="dark" />
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="create" />
                <Stack.Screen name="auth" />
                <Stack.Screen name="(tabs)" />
            </Stack>
        </>
    );
}

export default function RootLayout() {
    return (
        <SafeAreaProvider>
            <AuthProvider>
                <GuestWishlistProvider>
                    <RootLayoutNav />
                </GuestWishlistProvider>
            </AuthProvider>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.background,
    },
});
