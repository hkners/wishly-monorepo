import { View, Text, TextInput, Alert, TouchableOpacity, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, Keyboard, Animated, LayoutAnimation, UIManager } from "react-native";
import { useState, useRef, useEffect } from "react";
import { supabase } from "@wishly/db/mobile";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Instagram, Apple, ArrowRight, Eye, EyeOff } from "lucide-react-native";
import { FontAwesome } from "@expo/vector-icons";

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function AuthScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { mode } = useLocalSearchParams<{ mode?: string }>();
    const scrollViewRef = useRef<ScrollView>(null);
    const [isLogin, setIsLogin] = useState(mode === 'login');
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [keyboardVisible, setKeyboardVisible] = useState(false);

    // Animated values
    const logoScale = useRef(new Animated.Value(1)).current;
    const brandingOpacity = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
        const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

        const keyboardShow = Keyboard.addListener(showEvent, () => {
            setKeyboardVisible(true);
            Animated.parallel([
                Animated.spring(logoScale, {
                    toValue: 0.6,
                    useNativeDriver: true,
                    tension: 80,
                    friction: 12,
                }),
                Animated.timing(brandingOpacity, {
                    toValue: 0,
                    duration: 150,
                    useNativeDriver: true,
                }),
            ]).start();

            setTimeout(() => {
                scrollViewRef.current?.scrollTo({ y: 100, animated: true });
            }, Platform.OS === 'ios' ? 0 : 100);
        });

        const keyboardHide = Keyboard.addListener(hideEvent, () => {
            setKeyboardVisible(false);
            Animated.parallel([
                Animated.spring(logoScale, {
                    toValue: 1,
                    useNativeDriver: true,
                    tension: 80,
                    friction: 12,
                }),
                Animated.timing(brandingOpacity, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();

            scrollViewRef.current?.scrollTo({ y: 0, animated: true });
        });

        return () => {
            keyboardShow.remove();
            keyboardHide.remove();
        };
    }, [logoScale, brandingOpacity]);

    const handleToggle = (login: boolean) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setIsLogin(login);
    };

    async function handleAuth() {
        if (!email || !password) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }
        setLoading(true);
        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
                router.replace("/(tabs)");
            } else {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
                Alert.alert("Success", "Please check your email for verification!");
            }
        } catch (error: any) {
            Alert.alert("Error", error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <KeyboardAvoidingView
            style={[styles.container, { paddingTop: insets.top }]}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={0}
        >
            <ScrollView
                ref={scrollViewRef}
                contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                bounces={keyboardVisible}
                scrollEnabled={keyboardVisible}
            >
                {/* Branding - fades when keyboard opens */}
                <Animated.View style={[styles.brandingContainer, { opacity: brandingOpacity }]}>
                    <Text style={styles.headerTitle}>
                        {isLogin ? "Welcome back" : "Claim your space"}
                    </Text>
                    <Text style={styles.headerSubtitle}>
                        {isLogin ? "Sign in to continue" : "Create your aesthetic storefront"}
                    </Text>
                </Animated.View>

                {/* Toggle */}
                <View style={styles.toggleContainer}>
                    <TouchableOpacity
                        onPress={() => handleToggle(true)}
                        style={[styles.toggleButton, isLogin && styles.toggleButtonActive]}
                        activeOpacity={0.8}
                    >
                        <Text style={[styles.toggleText, isLogin && styles.toggleTextActive]}>Log In</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => handleToggle(false)}
                        style={[styles.toggleButton, !isLogin && styles.toggleButtonActive]}
                        activeOpacity={0.8}
                    >
                        <Text style={[styles.toggleText, !isLogin && styles.toggleTextActive]}>Sign Up</Text>
                    </TouchableOpacity>
                </View>

                {/* Form */}
                <View style={styles.formContainer}>

                    <View style={styles.inputWrapper}>
                        <Text style={styles.inputLabel}>Email</Text>
                        <TextInput
                            placeholder="you@example.com"
                            placeholderTextColor="#c4c4c4"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                            style={styles.input}
                            returnKeyType="next"
                        />
                    </View>

                    <View style={styles.inputWrapper}>
                        <View style={styles.labelRow}>
                            <Text style={styles.inputLabel}>Password</Text>
                            {isLogin && (
                                <TouchableOpacity activeOpacity={0.7}>
                                    <Text style={styles.forgotLink}>Forgot?</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                        <View style={styles.passwordContainer}>
                            <TextInput
                                placeholder="••••••••"
                                placeholderTextColor="#c4c4c4"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                                style={styles.passwordInput}
                                returnKeyType="done"
                                onSubmitEditing={handleAuth}
                            />
                            <TouchableOpacity
                                onPress={() => setShowPassword(!showPassword)}
                                style={styles.eyeButton}
                                activeOpacity={0.7}
                            >
                                {showPassword ? (
                                    <EyeOff size={18} color="#999" />
                                ) : (
                                    <Eye size={18} color="#999" />
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Primary Button */}
                <TouchableOpacity
                    onPress={handleAuth}
                    disabled={loading}
                    style={[styles.primaryButton, loading && styles.primaryButtonDisabled]}
                    activeOpacity={0.9}
                >
                    <Text style={styles.primaryButtonText}>
                        {loading ? "Please wait..." : (isLogin ? "Sign In" : "Create Account")}
                    </Text>
                    {!loading && <ArrowRight size={20} color="#fff" style={{ marginLeft: 8 }} />}
                </TouchableOpacity>

                {/* Divider - below button, industry standard */}
                {!keyboardVisible && (
                    <View style={styles.dividerSection}>
                        <View style={styles.dividerContainer}>
                            <View style={styles.dividerLine} />
                            <Text style={styles.dividerText}>or continue with</Text>
                            <View style={styles.dividerLine} />
                        </View>

                        {/* Social Buttons - below primary button */}
                        <View style={styles.socialContainer}>
                            <TouchableOpacity style={styles.socialButton} activeOpacity={0.7}>
                                <FontAwesome name="google" size={20} color="#EA4335" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.socialButton} activeOpacity={0.7}>
                                <Apple size={22} color="#000" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.socialButton} activeOpacity={0.7}>
                                <Instagram size={22} color="#E4405F" />
                            </TouchableOpacity>
                        </View>

                        {/* Terms */}
                        <Text style={styles.termsText}>
                            By continuing, you agree to our{" "}
                            <Text style={styles.termsLink}>Terms of Service</Text> and{" "}
                            <Text style={styles.termsLink}>Privacy Policy</Text>
                        </Text>
                    </View>
                )}
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FDFCFB',
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
    },
    logoContainer: {
        alignItems: 'center',
        marginTop: 48,
        marginBottom: 16,
    },
    logoBox: {
        backgroundColor: '#FFF1F2',
        width: 64,
        height: 64,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoText: {
        color: '#f43f5e',
        fontWeight: '700',
        fontSize: 26,
    },
    brandingContainer: {
        alignItems: 'center',
        marginTop: 60,
        marginBottom: 32,
    },
    headerTitle: {
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
        fontSize: 28,
        color: '#1a1a1a',
        marginBottom: 6,
    },
    headerSubtitle: {
        color: '#888',
        fontSize: 15,
        fontWeight: '400',
    },
    toggleContainer: {
        flexDirection: 'row',
        backgroundColor: '#f4f4f5',
        borderRadius: 12,
        padding: 4,
        marginBottom: 28,
        height: 48,
    },
    toggleButton: {
        flex: 1,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    toggleButtonActive: {
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    toggleText: {
        fontWeight: '600',
        fontSize: 14,
        color: '#888',
    },
    toggleTextActive: {
        color: '#1a1a1a',
    },
    formContainer: {
        gap: 20,
    },
    inputWrapper: {},
    inputLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#555',
        marginBottom: 8,
        marginLeft: 4,
    },
    labelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    forgotLink: {
        fontSize: 13,
        fontWeight: '500',
        color: '#f43f5e',
        marginRight: 4,
    },
    input: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e5e5e5',
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 52,
        fontSize: 16,
        color: '#1a1a1a',
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e5e5e5',
        borderRadius: 12,
        height: 52,
    },
    passwordInput: {
        flex: 1,
        paddingHorizontal: 16,
        height: '100%',
        fontSize: 16,
        color: '#1a1a1a',
    },
    eyeButton: {
        paddingHorizontal: 14,
        height: '100%',
        justifyContent: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e5e5e5',
        borderRadius: 12,
        height: 52,
        paddingHorizontal: 16,
    },
    atPrefix: {
        fontSize: 16,
        color: '#888',
        marginRight: 2,
    },
    inputWithPrefix: {
        flex: 1,
        fontSize: 16,
        color: '#1a1a1a',
        height: '100%',
    },
    primaryButton: {
        flexDirection: 'row',
        width: '100%',
        height: 54,
        backgroundColor: '#f43f5e',
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 28,
        shadowColor: '#f43f5e',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 6,
    },
    primaryButtonDisabled: {
        opacity: 0.6,
    },
    primaryButtonText: {
        color: '#ffffff',
        fontWeight: '700',
        fontSize: 16,
    },
    dividerSection: {
        marginTop: 32,
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#e8e8e8',
    },
    dividerText: {
        marginHorizontal: 16,
        fontSize: 13,
        fontWeight: '500',
        color: '#999',
    },
    socialContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 16,
        marginBottom: 32,
    },
    socialButton: {
        width: 56,
        height: 56,
        borderRadius: 14,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e8e8e8',
        alignItems: 'center',
        justifyContent: 'center',
    },
    termsText: {
        fontSize: 12,
        textAlign: 'center',
        color: '#999',
        lineHeight: 18,
        paddingHorizontal: 16,
    },
    termsLink: {
        color: '#666',
        fontWeight: '500',
    },
});
