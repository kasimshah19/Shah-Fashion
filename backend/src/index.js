import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { products, reviews } from './data/products.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

function filterProducts(query) {
  let result = [...products];

  if (query.category) {
    const cat = query.category.toLowerCase();
    if (cat === 'sarees') result = result.filter((p) => p.category === 'Saree' || p.category === 'Saree + Blouse Combo');
    else if (cat === 'blouse-pieces') result = result.filter((p) => p.category === 'Blouse Piece');
    else if (cat === 'sale') result = result.filter((p) => p.isSale);
    else if (cat === 'new-arrivals') result = result.filter((p) => p.isNew);
    else if (cat === 'silk-sarees') result = result.filter((p) => p.fabric.toLowerCase().includes('silk'));
    else if (cat === 'cotton-sarees') result = result.filter((p) => p.fabric === 'Cotton');
    else if (cat === 'wedding') result = result.filter((p) => p.occasion.includes('Wedding'));
  }

  if (query.fabric) {
    const fabrics = query.fabric.split(',');
    result = result.filter((p) => fabrics.includes(p.fabric));
  }

  if (query.color) {
    const colors = query.color.split(',');
    result = result.filter((p) => p.colors.some((c) => colors.includes(c)));
  }

  if (query.occasion) {
    const occasions = query.occasion.split(',');
    result = result.filter((p) => p.occasion.some((o) => occasions.includes(o)));
  }

  if (query.region) {
    const regions = query.region.split(',');
    result = result.filter((p) => regions.includes(p.region));
  }

  if (query.blouseStatus) {
    const statuses = query.blouseStatus.split(',');
    result = result.filter((p) => statuses.includes(p.blouseStatus));
  }

  if (query.priceMin) result = result.filter((p) => p.discountedPrice >= Number(query.priceMin));
  if (query.priceMax) result = result.filter((p) => p.discountedPrice <= Number(query.priceMax));
  if (query.rating) result = result.filter((p) => p.rating >= Number(query.rating));
  if (query.discount === 'true') result = result.filter((p) => p.discountPercent > 0);

  if (query.search) {
    const q = query.search.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.fabric.toLowerCase().includes(q) ||
        p.region.toLowerCase().includes(q) ||
        p.colors.some((c) => c.toLowerCase().includes(q))
    );
  }

  switch (query.sort) {
    case 'price-asc':
      result.sort((a, b) => a.discountedPrice - b.discountedPrice);
      break;
    case 'price-desc':
      result.sort((a, b) => b.discountedPrice - a.discountedPrice);
      break;
    case 'newest':
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
    case 'rating':
      result.sort((a, b) => b.rating - a.rating);
      break;
    case 'popularity':
    default:
      result.sort((a, b) => b.reviewCount - a.reviewCount);
      break;
  }

  return result;
}

app.get('/api/products', (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 12;
  const filtered = filterProducts(req.query);
  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);

  res.json({
    products: paginated,
    total: filtered.length,
    page,
    totalPages: Math.ceil(filtered.length / limit),
  });
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find((p) => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

app.get('/api/products/:id/reviews', (req, res) => {
  const productReviews = reviews.filter((r) => r.productId === req.params.id);
  res.json(productReviews);
});

app.get('/api/search/suggest', (req, res) => {
  const q = (req.query.q || '').toLowerCase();
  if (!q || q.length < 2) return res.json([]);

  const suggestions = products
    .filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.fabric.toLowerCase().includes(q) ||
        p.region.toLowerCase().includes(q)
    )
    .slice(0, 6)
    .map((p) => ({ id: p.id, name: p.name, image: p.images[0], price: p.discountedPrice }));

  res.json(suggestions);
});

app.post('/api/delivery/check', (req, res) => {
  const { pincode } = req.body;
  if (!pincode || !/^\d{6}$/.test(pincode)) {
    return res.status(400).json({ error: 'Invalid pincode' });
  }
  const days = parseInt(pincode.slice(0, 2), 10) > 50 ? 5 : 3;
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + days);
  res.json({
    pincode,
    available: true,
    estimate: `${days}-${days + 2} business days`,
    deliveryDate: deliveryDate.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    }),
  });
});

/**
 * STUB: Replace with real Razorpay / PayU / Cashfree integration.
 * See src/utils/payment.ts for the client-side stub as well.
 */
app.post('/api/payment/initiate', (req, res) => {
  const { orderId, amount, method } = req.body;
  console.log(`[PAYMENT STUB] Order ${orderId}, ₹${amount}, method: ${method}`);
  res.json({
    success: true,
    paymentId: `pay_stub_${Date.now()}`,
    message: 'Payment stub — integrate Razorpay here',
  });
});

app.post('/api/orders', (req, res) => {
  const order = {
    id: `SF${Date.now()}`,
    ...req.body,
    status: 'Placed',
    createdAt: new Date().toISOString(),
  };
  res.json(order);
});

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, '../../dist')));

app.use((_req, res) => {
  res.sendFile(path.resolve(__dirname, '../../dist/index.html'), (err) => {
    if (err) res.status(404).json({ error: 'Not found' });
  });
});

app.listen(PORT, () => {
  console.log(`Shah Fashion API running on http://localhost:${PORT}`);
});
