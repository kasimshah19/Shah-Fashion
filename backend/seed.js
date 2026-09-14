import pg from 'pg';
import crypto from 'crypto';

const { Client } = pg;
const client = new Client({ connectionString: 'postgresql://postgres.nhcydyrfriweficewdtc:UCt6ra1KXahARBj1@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres' });

const baseProducts = [
  {
    name: 'Royal Crimson Banarasi Silk Saree',
    description: 'A luxurious Banarasi silk saree featuring intricate zari work, perfect for weddings and grand occasions.',
    category: 'Saree',
    fabric: 'Banarasi Silk',
    work: 'Zari Weaving',
    occasion: ['Wedding', 'Festive'],
    colors: ['Red', 'Gold'],
    region_style: 'Varanasi',
    blouse_status: 'Blouse Included (Unstitched)',
    mrp: 15500,
    discounted_price: 13175,
    rating: 4.8,
    review_count: 42,
    is_new: true,
    stock_quantity: 50,
    is_bestseller: true,
    is_active: true,
    sku: 'BAN-SILK-CRIMSON-'
  },
  {
    name: 'Emerald Green Kanjeevaram Silk',
    description: 'Authentic Kanjeevaram silk with traditional temple borders and heavy pallu.',
    category: 'Saree',
    fabric: 'Kanjeevaram Silk',
    work: 'Temple Border Zari',
    occasion: ['Wedding', 'Party Wear'],
    colors: ['Green', 'Gold'],
    region_style: 'Kanchipuram',
    blouse_status: 'Blouse Included (Unstitched)',
    mrp: 18000,
    discounted_price: 18000,
    rating: 4.9,
    review_count: 56,
    is_new: false,
    stock_quantity: 20,
    is_bestseller: true,
    is_active: true,
    sku: 'KAN-SILK-EM-'
  },
  {
    name: 'Indigo Block Print Cotton Saree',
    description: 'Lightweight breathable cotton saree with traditional indigo block prints, ideal for daily and office wear.',
    category: 'Saree',
    fabric: 'Cotton',
    work: 'Block Print',
    occasion: ['Casual', 'Office Wear'],
    colors: ['Indigo', 'White'],
    region_style: 'Jaipur',
    blouse_status: 'Blouse Sold Separately',
    mrp: 850,
    discounted_price: 850,
    rating: 4.5,
    review_count: 128,
    is_new: false,
    stock_quantity: 100,
    is_bestseller: false,
    is_active: true,
    sku: 'COT-IND-'
  },
  {
    name: 'Powder Blue Floral Chiffon Saree',
    description: 'Flowy and elegant chiffon saree with delicate floral motifs.',
    category: 'Saree',
    fabric: 'Chiffon',
    work: 'Floral Print',
    occasion: ['Party Wear', 'Casual'],
    colors: ['Blue'],
    region_style: 'Surat',
    blouse_status: 'Blouse Included (Unstitched)',
    mrp: 2200,
    discounted_price: 1980,
    rating: 4.2,
    review_count: 35,
    is_new: true,
    stock_quantity: 40,
    is_bestseller: false,
    is_active: true,
    sku: 'CHI-BLU-'
  },
  {
    name: 'Pastel Pink Hand-Painted Organza',
    description: 'Exquisite sheer organza saree with hand-painted botanical designs.',
    category: 'Saree',
    fabric: 'Organza',
    work: 'Hand Painted',
    occasion: ['Party Wear', 'Festive'],
    colors: ['Pink'],
    region_style: 'Kolkata',
    blouse_status: 'Blouse Included (Unstitched)',
    mrp: 5500,
    discounted_price: 5500,
    rating: 4.7,
    review_count: 20,
    is_new: true,
    stock_quantity: 15,
    is_bestseller: false,
    is_active: true,
    sku: 'ORG-PNK-'
  }
];

const products = [];
const productImages = [];

for (let i = 0; i < 24; i++) {
  const base = baseProducts[i % 5];
  const pId = crypto.randomUUID();
  products.push({
    ...base,
    id: pId,
    name: base.name + (i > 4 ? ` (Variant ${i})` : ''),
    sku: base.sku + i
  });

  productImages.push({ product_id: pId, image_url: 'https://images.unsplash.com/photo-1610189014605-72439121d51a?w=800&q=80', image_type: 'front', sort_order: 1 });
  productImages.push({ product_id: pId, image_url: 'https://images.unsplash.com/photo-1605792657660-596af9009e82?w=800&q=80', image_type: 'pallu', sort_order: 2 });
  productImages.push({ product_id: pId, image_url: 'https://images.unsplash.com/photo-1583391733959-b151249b4317?w=800&q=80', image_type: 'blouse', sort_order: 3 });
  productImages.push({ product_id: pId, image_url: 'https://images.unsplash.com/photo-1610189014605-72439121d51a?w=800&q=80', image_type: 'draped', sort_order: 4 });
}

const homepageContent = [
  { id: crypto.randomUUID(), section: 'hero', title: 'The Wedding Collection', subtitle: 'Timeless Silks for Your Special Day', image_url: 'https://images.unsplash.com/photo-1610189014605-72439121d51a?w=1600&q=80', cta_link: '/shop/wedding', cta_text: 'Shop Now', active: true, sort_order: 1 },
  { id: crypto.randomUUID(), section: 'category_tile', title: 'Banarasi Silks', image_url: 'https://images.unsplash.com/photo-1605792657660-596af9009e82?w=800&q=80', cta_link: '/shop/banarasi', active: true, sort_order: 2 },
  { id: crypto.randomUUID(), section: 'category_tile', title: 'Everyday Cottons', image_url: 'https://images.unsplash.com/photo-1583391733959-b151249b4317?w=800&q=80', cta_link: '/shop/cotton', active: true, sort_order: 3 },
];

async function seed() {
  await client.connect();
  console.log('Seeding Database via pg...');

  try {
    for (const p of products) {
      await client.query(`
        INSERT INTO products (
          id, name, description, category, fabric, work, occasion, colors, region_style, blouse_status,
          mrp, discounted_price, rating, review_count, is_new, stock_quantity, is_bestseller, is_active, sku
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19
        ) ON CONFLICT (sku) DO NOTHING
      `, [p.id, p.name, p.description, p.category, p.fabric, p.work, p.occasion, p.colors, p.region_style, p.blouse_status, p.mrp, p.discounted_price, p.rating, p.review_count, p.is_new, p.stock_quantity, p.is_bestseller, p.is_active, p.sku]);
    }
    console.log('Inserted products.');
    
    for (const i of productImages) {
      await client.query(`
        INSERT INTO product_images (product_id, image_url, image_type, sort_order)
        VALUES ($1, $2, $3, $4)
      `, [i.product_id, i.image_url, i.image_type, i.sort_order]);
    }
    console.log('Inserted product images.');

    for (const h of homepageContent) {
      await client.query(`
        INSERT INTO homepage_content (id, section, title, subtitle, image_url, cta_link, cta_text, active, sort_order)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `, [h.id, h.section, h.title, h.subtitle, h.image_url, h.cta_link, h.cta_text, h.active, h.sort_order]);
    }
    console.log('Inserted homepage content.');

  } catch (err) {
    console.error('Error during seeding:', err);
  } finally {
    await client.end();
  }
}

seed();
