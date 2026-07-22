import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Modal,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    Alert,
    Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadows } from '@/lib/theme';
import { X, Mail, Chrome } from 'lucide-react-native';
import { FontAwesome } from '@expo/vector-icons';
import { supabase } from '@wishly/db/mobile';

interface AuthModalProps {
    visible: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function AuthModal({ visible, onClose, onSuccess }: AuthModalProps) {
    const insets = useSafeAreaInsets();
    const [mode, setMode] = useState<'signup' | 'signin'>('signup');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleEmailAuth = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            if (mode === 'signup') {
                const { error } = await supabase.auth.signUp({ email, password });
                if (error) throw error;
                Alert.alert('Success', 'Please check your email for verification!', [
                    { text: 'OK', onPress: onSuccess }
                ]);
            } else {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
                onSuccess();
            }
        } catch (error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSocialAuth = async (provider: 'google' | 'apple') => {
        // Note: Social auth requires additional setup
        Alert.alert('Coming Soon', `${provider} sign-in will be available soon!`);
    };

    const resetForm = () => {
        setEmail('');
        setPassword('');
        setMode('signup');
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={handleClose}
        >
            <Pressable style={styles.overlay} onPress={handleClose}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardView}
                >
                    <Pressable
                        style={[styles.sheet, { paddingBottom: insets.bottom + spacing.lg }]}
                        onPress={(e) => e.stopPropagation()}
                    >
                        {/* Handle */}
                        <View style={styles.handleContainer}>
                            <View style={styles.handle} />
                        </View>

                        {/* Close Button */}
                        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
                            <X size={24} color={colors.textMuted} />
                        </TouchableOpacity>

                        {/* Header */}
                        <View style={styles.header}>
                            <Text style={styles.title}>
                                {mode === 'signup' ? 'Save & share your wishlist' : 'Welcome back'}
                            </Text>
                            <Text style={styles.subtitle}>
                                {mode === 'signup'
                                    ? 'Create a free account to send this wishlist and access it anywhere.'
                                    : 'Sign in to access your wishlists.'}
                            </Text>
                        </View>

                        {mode === 'signup' ? (
                            <>
                                {/* Social Buttons */}
                                <View style={styles.socialButtons}>
                                    <TouchableOpacity
                                        style={styles.socialButton}
                                        onPress={() => handleSocialAuth('google')}
                                    >
                                        <Chrome size={20} color={colors.text} />
                                        <Text style={styles.socialButtonText}>Continue with Google</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.socialButton}
                                        onPress={() => handleSocialAuth('apple')}
                                    >
                                        <FontAwesome name="apple" size={20} color={colors.text} />
                                        <Text style={styles.socialButtonText}>Continue with Apple</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[styles.socialButton, styles.emailButton]}
                                        onPress={() => setMode('signin')}
                                    >
                                        <Mail size={20} color={colors.white} />
                                        <Text style={[styles.socialButtonText, styles.emailButtonText]}>
                                            Continue with Email
                                        </Text>
                                    </TouchableOpacity>
                                </View>

                                {/* Already have account */}
                                <TouchableOpacity
                                    style={styles.toggleButton}
                                    onPress={() => setMode('signin')}
                                >
                                    <Text style={styles.toggleText}>I already have an account</Text>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <>
                                {/* Email/Password Form */}
                                <View style={styles.form}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Email address"
                                        placeholderTextColor={colors.textMuted}
                                        value={email}
                                        onChangeText={setEmail}
                                        autoCapitalize="none"
                                        keyboardType="email-address"
                                    />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Password"
                                        placeholderTextColor={colors.textMuted}
                                        value={password}
                                        onChangeText={setPassword}
                                        secureTextEntry
                                    />
                                    <TouchableOpacity
                                        style={styles.primaryButton}
                                        onPress={handleEmailAuth}
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <ActivityIndicator color={colors.white} />
                                        ) : (
                                            <Text style={styles.primaryButtonText}>Sign In</Text>
                                        )}
                                    </TouchableOpacity>
                                </View>

                                {/* Switch to signup */}
                                <TouchableOpacity
                                    style={styles.toggleButton}
                                    onPress={() => setMode('signup')}
                                >
                                    <Text style={styles.toggleText}>Create a new account</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </Pressable>
                </KeyboardAvoidingView>
            </Pressable>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: colors.overlay,
        justifyContent: 'flex-end',
    },
    keyboardView: {
        width: '100%',
    },
    sheet: {
        backgroundColor: colors.background,
        borderTopLeftRadius: borderRadius.xxl,
        borderTopRightRadius: borderRadius.xxl,
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.sm,
    },
    handleContainer: {
        alignItems: 'center',
        paddingVertical: spacing.sm,
    },
    handle: {
        width: 40,
        height: 4,
        backgroundColor: colors.border,
        borderRadius: 2,
    },
    closeButton: {
        position: 'absolute',
        top: spacing.md,
        right: spacing.md,
        padding: spacing.sm,
        zIndex: 10,
    },
    header: {
        alignItems: 'center',
        marginTop: spacing.lg,
        marginBottom: spacing.xl,
    },
    title: {
        fontSize: fontSize.xl,
        fontWeight: fontWeight.bold,
        color: colors.text,
        textAlign: 'center',
        marginBottom: spacing.sm,
    },
    subtitle: {
        fontSize: fontSize.base,
        color: colors.textMuted,
        textAlign: 'center',
        lineHeight: 22,
        paddingHorizontal: spacing.md,
    },
    socialButtons: {
        gap: spacing.md,
        marginBottom: spacing.lg,
    },
    socialButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 52,
        borderRadius: borderRadius.lg,
        backgroundColor: colors.card,
        borderWidth: 1,
        borderColor: colors.border,
        gap: spacing.sm,
    },
    socialButtonText: {
        fontSize: fontSize.base,
        fontWeight: fontWeight.medium,
        color: colors.text,
    },
    emailButton: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    emailButtonText: {
        color: colors.white,
    },
    toggleButton: {
        alignItems: 'center',
        paddingVertical: spacing.md,
    },
    toggleText: {
        fontSize: fontSize.base,
        color: colors.textMuted,
        fontWeight: fontWeight.medium,
    },
    form: {
        gap: spacing.md,
        marginBottom: spacing.md,
    },
    input: {
        height: 52,
        backgroundColor: colors.card,
        borderRadius: borderRadius.lg,
        paddingHorizontal: spacing.md,
        fontSize: fontSize.base,
        color: colors.text,
        borderWidth: 1,
        borderColor: colors.border,
    },
    primaryButton: {
        height: 52,
        backgroundColor: colors.primary,
        borderRadius: borderRadius.lg,
        alignItems: 'center',
        justifyContent: 'center',
        ...shadows.primary,
    },
    primaryButtonText: {
        fontSize: fontSize.md,
        fontWeight: fontWeight.bold,
        color: colors.white,
    },
});
