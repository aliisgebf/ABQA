import { createClient, SupabaseClient } from '@supabase/supabase-js';

let clientInstance: SupabaseClient | null = null;
let isConfigChecked = false;
let isConnected = false;

export async function getSupabaseClient(): Promise<SupabaseClient | null> {
  if (clientInstance) return clientInstance;
  if (isConfigChecked) return null;

  try {
    const res = await fetch('/api/config');
    if (res.ok) {
      const config = await res.json();
      if (config.supabaseConfigured && config.supabaseUrl && config.supabasePublishableKey) {
        clientInstance = createClient(config.supabaseUrl, config.supabasePublishableKey);
        isConnected = true;
      }
    }
  } catch (e) {
    console.warn('Could not fetch Supabase configuration from server:', e);
  }

  isConfigChecked = true;
  return clientInstance;
}

export function isSupabaseActive(): boolean {
  return isConnected;
}
