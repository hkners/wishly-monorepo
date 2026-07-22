import { Text as RNText, type TextProps as RNTextProps } from "react-native";
import { cn } from "@/lib/utils";

export interface TextProps extends RNTextProps {
    className?: string;
}

export function Text({ className, ...props }: TextProps) {
    return (
        <RNText
            className={cn("text-base text-foreground", className)}
            {...props}
        />
    );
}
