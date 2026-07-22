import { View, TouchableOpacity, Linking } from "react-native";
import { Image } from "expo-image";
import { Text } from "@/components/ui/text";
import { Gift, ExternalLink } from "lucide-react-native";

interface WishlistItem {
    id: string;
    title: string;
    image_url: string | null;
    price: string | null;
    original_url: string;
}

// Logic from web-backup to generate consistent pastel gradients
const getGradient = (id: string) => {
    const gradients = [
        "bg-red-50",    // Soft Pinkish
        "bg-sky-50",    // Alice Blue-ish
        "bg-amber-50",  // Beige-ish
        "bg-emerald-50",// Honeydew-ish
        "bg-orange-50", // Seashell-ish
    ];
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
        hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % gradients.length;
    return gradients[index];
};

function tryGetDomain(url: string) {
    try {
        const hostname = new URL(url).hostname;
        return hostname.replace("www.", "").split(".")[0];
    } catch (e) {
        return "Link";
    }
}

export function WishlistCard({ item, onDelete }: { item: WishlistItem; onDelete?: () => void }) {
    const gradientClass = getGradient(item.id);

    const handlePress = () => {
        if (item.original_url) {
            Linking.openURL(item.original_url);
        }
    };

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={handlePress}
            className={`w-[48%] mb-4 ${gradientClass} rounded-[24px] p-2 border border-white/60 shadow-sm`}
        >
            {/* Inner White Container */}
            <View className="relative w-full aspect-[4/5] bg-white rounded-[18px] overflow-hidden items-center justify-center p-3 shadow-sm">

                {/* Domain Badge */}
                <View className="absolute top-2 left-2 bg-stone-50/90 px-2 py-1 rounded-md border border-stone-100 z-10">
                    <Text className="text-[9px] font-bold tracking-widest uppercase text-muted-foreground">
                        {tryGetDomain(item.original_url)}
                    </Text>
                </View>

                {/* Delete Button */}
                <TouchableOpacity
                    onPress={onDelete}
                    className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full shadow-sm z-20"
                >
                    <Text className="text-xs font-bold text-muted-foreground">✕</Text>
                </TouchableOpacity>

                {/* Image */}
                {item.image_url ? (
                    <Image
                        source={{ uri: item.image_url }}
                        style={{ width: '100%', height: '100%' }}
                        contentFit="contain"
                        transition={200}
                    />
                ) : (
                    <Gift className="text-muted-foreground" size={32} />
                )}

                {/* Price Tag */}
                {item.price && (
                    <View className="absolute bottom-2 right-2 bg-slate-900 px-2 py-1 rounded-full shadow-md z-10">
                        <Text className="text-[10px] font-bold text-white tracking-wide">
                            {item.price}
                        </Text>
                    </View>
                )}
            </View>

            {/* Title Area */}
            <View className="px-2 pt-3 pb-2 min-h-[50px] justify-center items-center">
                <Text className="font-serif text-xs text-center leading-tight line-clamp-2 text-foreground font-medium">
                    {item.title}
                </Text>
            </View>
        </TouchableOpacity>
    );
}
