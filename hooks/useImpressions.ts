
import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'first-impressions-app-data';

const getStoredImpressions = (): string[] => {
    try {
        const items = window.localStorage.getItem(STORAGE_KEY);
        if (items) {
            const parsed = JSON.parse(items);
            if (Array.isArray(parsed) && parsed.every(item => typeof item === 'string')) {
                return parsed;
            }
        }
    } catch (error) {
        console.error("Error reading impressions from localStorage:", error);
        window.localStorage.removeItem(STORAGE_KEY);
    }
    return [];
};

export const useImpressions = () => {
    const [impressions, setImpressions] = useState<string[]>(getStoredImpressions);

    useEffect(() => {
        const handleStorageChange = (e: StorageEvent): void => {
            if (e.key === STORAGE_KEY) {
                setImpressions(getStoredImpressions());
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const addImpression = useCallback((impression: string): void => {
        if (!impression || impression.trim() === '') return;

        const currentImpressions = getStoredImpressions();
        const updatedImpressions = [...currentImpressions, impression.trim()];
        
        try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedImpressions));
            // Manually update the state for the *current* tab, as 'storage' event doesn't fire on the same tab.
            setImpressions(updatedImpressions);
        } catch (error) {
            console.error("Error writing impression to localStorage:", error);
        }
    }, []);

    const clearImpressions = useCallback((): void => {
        try {
            window.localStorage.removeItem(STORAGE_KEY);
            // Manually update the state for the *current* tab
            setImpressions([]);
        } catch (error) {
            console.error("Error clearing localStorage:", error);
        }
    }, []);

    return { impressions, addImpression, clearImpressions };
};
