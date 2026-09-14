import { PrismaClient } from '@prisma/client';
import { products } from '../src/data/products.js';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // 1. Create categories
  const categoryNames = ['Silk Sarees', 'Cotton Sarees', 'Wedding', 'Blouse Pieces', 'Sale', 'New Arrivals'];
  const categoryMap = {};

  for (const name of categoryNames) {
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    const cat = await prisma.category.upsert({
      where: { slug },
      update: {},
      create: { name, slug }
    });
    categoryMap[name] = cat.id;
  }

  // 2. Create products
  for (const p of products) {
    let targetCatId = null;

    if (p.category === 'Saree') {
      if (p.fabric.includes('Silk')) targetCatId = categoryMap['Silk Sarees'];
      else if (p.fabric.includes('Cotton')) targetCatId = categoryMap['Cotton Sarees'];
      else if (p.occasion.includes('Wedding')) targetCatId = categoryMap['Wedding'];
    } else if (p.category === 'Blouse Piece') {
      targetCatId = categoryMap['Blouse Pieces'];
    }

    if (p.isSale) targetCatId = categoryMap['Sale'];
    if (p.isNew) targetCatId = categoryMap['New Arrivals'];

    await prisma.product.upsert({
      where: { sku: p.sku },
      update: {},
      create: {
        id: p.id,
        sku: p.sku,
        name: p.name,
        description: p.description || '',
        categoryId: targetCatId,
        fabric: p.fabric || '',
        work: p.work || '',
        region: p.region || '',
        blouseStatus: p.blouseStatus || '',
        price: p.price,
        discountedPrice: p.discountedPrice || p.price,
        stock: p.stock || 0,
        images: p.images || [],
        isNew: p.isNew || false,
        isBestseller: p.isBestseller || false,
        isSale: p.isSale || false,
      }
    });
  }

  // 3. Create default admin user
  await prisma.user.upsert({
    where: { email: 'admin@shahfashion.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@shahfashion.com',
      phone: '1234567890',
      role: 'ADMIN'
    }
  });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
