import { TextInput, TextInputProps, View, Text } from "react-native";
import { cn } from "@/lib/utils";
import { forwardRef, useState } from "react";

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
}

const Input = forwardRef<TextInput, InputProps>(
    ({ className, label, error, onFocus, onBlur, ...props }, ref) => {
        const [isFocused, setIsFocused] = useState(false);

        return (
            <View className="space-y-2 w-full">
                {label && (
                    <Text className="text-sm font-medium text-foreground ml-1">
                        {label}
                    </Text>
                )}
                <TextInput
                    ref={ref}
                    className={cn(
                        "flex h-12 w-full rounded-2xl border border-input bg-background px-4 py-2 text-base text-foreground placeholder:text-muted-foreground",
                        isFocused && "border-primary/50 bg-primary/5",
                        error && "border-red-500 bg-red-50",
                        className
                    )}
                    placeholderTextColor="#94a3b8"
                    onFocus={(e) => {
                        setIsFocused(true);
                        onFocus?.(e);
                    }}
                    onBlur={(e) => {
                        setIsFocused(false);
                        onBlur?.(e);
                    }}
                    {...props}
                />
                {error && (
                    <Text className="text-xs text-red-500 ml-1 font-medium">{error}</Text>
                )}
            </View>
        );
    }
);

Input.displayName = "Input";

export { Input };
