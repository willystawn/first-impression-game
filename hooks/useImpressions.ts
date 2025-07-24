
import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';

// This app requires environment variables for Supabase credentials.
// You must provide SUPABASE_URL and SUPABASE_ANON_KEY.
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;


if (!supabaseUrl || !supabaseAnonKey) {
    // In a real app, you might show a proper error UI.
    // Here, we'll throw to make the configuration issue obvious during development.
    throw new Error("Supabase credentials (SUPABASE_URL, SUPABASE_ANON_KEY) are not configured in environment variables.");
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Define the shape of an impression object coming from the database
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
        // Initial data fetch
        fetchImpressions();

        // Listen for any changes in the 'impressions' table
        const channel = supabase.channel('impressions-realtime')
            .on(
                'postgres_changes', 
                { event: '*', schema: 'public', table: 'impressions' },
                () => {
                    // Refetch all data on any change. This is simpler and more robust
                    // than trying to handle individual INSERT/UPDATE/DELETE events.
                    fetchImpressions();
                }
            )
            .subscribe();
            
        // Cleanup subscription on component unmount
        return () => {
            supabase.removeChannel(channel);
        };
    }, [fetchImpressions]);

    const addImpression = useCallback(async (impression: string): Promise<void> => {
        if (!impression || impression.trim() === '') return;

        const { error } = await supabase
            .from('impressions')
            .insert({ text: impression.trim() });
        
        if (error) {
            console.error("Error adding impression:", error.message);
        }
    }, []);

    const clearImpressions = useCallback(async (): Promise<void> => {
        const { error } = await supabase
            .from('impressions')
            .delete()
            .gt('id', 0); // A filter is required for delete, so we delete where id > 0

        if (error) {
            console.error("Error clearing impressions:", error.message);
        }
    }, []);

    return { impressions, addImpression, clearImpressions };
};
