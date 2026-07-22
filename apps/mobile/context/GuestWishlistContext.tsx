import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@wishly_guest_items';

export interface GuestItem {
    id: string;
    title: string;
    imageUrl: string | null;
    price: string | null;
    link: string | null;
    createdAt: string;
}

interface GuestWishlistContextType {
    items: GuestItem[];
    addItem: (item: Omit<GuestItem, 'id' | 'createdAt'>) => Promise<void>;
    removeItem: (id: string) => Promise<void>;
    clearItems: () => Promise<void>;
    getItemsForSync: () => GuestItem[];
    itemCount: number;
}

const GuestWishlistContext = createContext<GuestWishlistContextType>({
    items: [],
    addItem: async () => { },
    removeItem: async () => { },
    clearItems: async () => { },
    getItemsForSync: () => [],
    itemCount: 0,
});

export function useGuestWishlist() {
    return useContext(GuestWishlistContext);
}

export function GuestWishlistProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<GuestItem[]>([]);

    // Load items from storage on mount
    useEffect(() => {
        loadItems();
    }, []);

    const loadItems = async () => {
        try {
            const stored = await AsyncStorage.getItem(STORAGE_KEY);
            if (stored) {
                setItems(JSON.parse(stored));
            }
        } catch (error) {
            console.error('Error loading guest items:', error);
        }
    };

    const saveItems = async (newItems: GuestItem[]) => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
            setItems(newItems);
        } catch (error) {
            console.error('Error saving guest items:', error);
        }
    };

    const addItem = useCallback(async (item: Omit<GuestItem, 'id' | 'createdAt'>) => {
        const newItem: GuestItem = {
            ...item,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
        };
        const newItems = [...items, newItem];
        await saveItems(newItems);
    }, [items]);

    const removeItem = useCallback(async (id: string) => {
        const newItems = items.filter(item => item.id !== id);
        await saveItems(newItems);
    }, [items]);

    const clearItems = useCallback(async () => {
        await AsyncStorage.removeItem(STORAGE_KEY);
        setItems([]);
    }, []);

    const getItemsForSync = useCallback(() => {
        return items;
    }, [items]);

    return (
        <GuestWishlistContext.Provider
            value={{
                items,
                addItem,
                removeItem,
                clearItems,
                getItemsForSync,
                itemCount: items.length,
            }}
        >
            {children}
        </GuestWishlistContext.Provider>
    );
}
