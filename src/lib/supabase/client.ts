import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/database.types';

export const supabase = createClientComponentClient<Database>({
  options: {
    db: {
      schema: 'public'
    }
  }
});

export type SupabaseClient = typeof supabase; 