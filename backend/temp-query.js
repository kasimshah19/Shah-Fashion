import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '../frontend/.env') });
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
async function test() {
  const { data: o, error } = await supabase.from('orders').select('*, profiles(*)').order('created_at', { ascending: false });
  console.log('orders:', o);
  console.log('error:', error);
}
test();
