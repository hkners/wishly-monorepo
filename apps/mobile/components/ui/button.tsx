import { Text, TouchableOpacity, TouchableOpacityProps, View, ActivityIndicator } from "react-native";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface ButtonProps extends TouchableOpacityProps {
    variant?: "default" | "outline" | "ghost" | "link";
    size?: "default" | "sm" | "lg" | "icon";
    isLoading?: boolean;
    className?: string;
    textClassName?: string;
}

const Button = forwardRef<View, ButtonProps>(
    ({ className, textClassName, variant = "default", size = "default", isLoading, children, disabled, ...props }, ref) => {
        return (
            <TouchableOpacity
                ref={ref}
                disabled={disabled || isLoading}
                className={cn(
                    "flex-row items-center justify-center rounded-2xl",
                    // Disabled state
                    (disabled || isLoading) && "opacity-50",
                    // Variants
                    variant === "default" && "bg-primary shadow-sm active:opacity-90",
                    variant === "outline" && "bg-transparent border border-input active:bg-muted",
                    variant === "ghost" && "bg-transparent active:bg-muted/50",
                    variant === "link" && "bg-transparent underline",
                    // Sizes
                    size === "default" && "h-12 px-5 py-2",
                    size === "sm" && "h-9 px-3",
                    size === "lg" && "h-14 px-8",
                    size === "icon" && "h-10 w-10",
                    className
                )}
                activeOpacity={0.7}
                {...props}
            >
                {isLoading && <ActivityIndicator size="small" className="mr-2 text-current" color={variant === "default" ? "white" : "#f43f5e"} />}
                {typeof children === "string" ? (
                    <Text
                        className={cn(
                            "font-semibold text-base",
                            variant === "default" && "text-primary-foreground",
                            variant === "outline" && "text-foreground",
                            variant === "ghost" && "text-foreground",
                            variant === "link" && "text-primary",
                            textClassName
                        )}
                    >
                        {children}
                    </Text>
                ) : (
                    children
                )}
            </TouchableOpacity>
        );
    }
);

Button.displayName = "Button";

export { Button };
