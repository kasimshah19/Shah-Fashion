import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '../frontend/.env') });
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
async function test() {
  const { data: o } = await supabase.from('orders').select('*').limit(1);
  console.log('orders:', o ? Object.keys(o[0] || {}) : 'none');
}
test();
