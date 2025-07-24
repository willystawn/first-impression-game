
import { useState, useEffect, useCallback } from 'react';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

// Initialize the Supabase client with the provided credentials.
// This removes the dependency on environment variables which are not available in the browser.

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
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
