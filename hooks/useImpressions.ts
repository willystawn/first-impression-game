import { useState, useEffect, useCallback } from 'react';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Impression {
    id: number;
    text: string;
}

export const useImpressions = () => {
    const [impressions, setImpressions] = useState<Impression[]>([]);

    const fetchImpressions = useCallback(async () => {
        const { data, error } = await supabase
            .from('impressions')
            .select('id, text')
            .order('created_at', { ascending: true });
            
        if (error) {
            console.error("Error fetching impressions:", error.message);
            setImpressions([]);
        } else {
            setImpressions(data || []);
        }
    }, []);

    useEffect(() => {
        fetchImpressions();
        const channel = supabase.channel('impressions-realtime')
            .on(
                'postgres_changes', 
                { event: '*', schema: 'public', table: 'impressions' },
                () => {
                    fetchImpressions();
                }
            )
            .subscribe();
            
        return () => {
            supabase.removeChannel(channel);
        };
    }, [fetchImpressions]);

    // === PERUBAHAN DI SINI ===
    // Mengembalikan fungsi untuk menerima array string dan memasukkannya sebagai baris terpisah
    const addImpressions = useCallback(async (impressionTexts: string[]): Promise<void> => {
        const impressionsToInsert = impressionTexts
            .map(text => text.trim())
            .filter(text => text.length > 0)
            .map(text => ({ text })); // Membuat object untuk setiap kesan

        if (impressionsToInsert.length === 0) return;

        // Memasukkan array object ke supabase, yang akan menjadi beberapa baris
        const { error } = await supabase
            .from('impressions')
            .insert(impressionsToInsert);
        
        if (error) {
            console.error("Error adding impressions:", error.message);
        }
    }, []);

    const clearImpressions = useCallback(async (): Promise<void> => {
        const { error } = await supabase
            .from('impressions')
            .delete()
            .gt('id', 0);

        if (error) {
            console.error("Error clearing impressions:", error.message);
        }
    }, []);

    // Ekspor addImpressions (plural)
    return { impressions, addImpressions, clearImpressions };
};