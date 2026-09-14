import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '../frontend/.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data: p } = await supabase.from('products').select('*').limit(1);
  const { data: i } = await supabase.from('product_images').select('*').limit(1);
  const { data: h } = await supabase.from('homepage_content').select('*').limit(1);
  console.log('products:', p ? Object.keys(p[0] || {}) : 'none');
  console.log('product_images:', i ? Object.keys(i[0] || {}) : 'none');
  console.log('homepage_content:', h ? Object.keys(h[0] || {}) : 'none');
}
test();
