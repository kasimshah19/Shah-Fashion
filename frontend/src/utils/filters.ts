import type { Product, ProductFilters } from '../types';

export function filterProducts(list: Product[], filters: ProductFilters): Product[] {
  let result = [...list];

  if (filters.category) {
    const cat = filters.category.toLowerCase();
    if (cat === 'sarees') result = result.filter((p) => p.category === 'Saree' || p.category === 'Saree + Blouse Combo');
    else if (cat === 'blouse-pieces') result = result.filter((p) => p.category === 'Blouse Piece');
    else if (cat === 'sale') result = result.filter((p) => p.isSale);
    else if (cat === 'new-arrivals') result = result.filter((p) => p.isNew);
    else if (cat === 'silk-sarees') result = result.filter((p) => p.fabric.toLowerCase().includes('silk'));
    else if (cat === 'cotton-sarees') result = result.filter((p) => p.fabric === 'Cotton');
    else if (cat === 'wedding') result = result.filter((p) => p.occasion.includes('Wedding'));
  }

  if (filters.fabric?.length) {
    result = result.filter((p) => filters.fabric!.includes(p.fabric));
  }
  if (filters.color?.length) {
    result = result.filter((p) => p.colors.some((c) => filters.color!.includes(c)));
  }
  if (filters.occasion?.length) {
    result = result.filter((p) => p.occasion.some((o) => filters.occasion!.includes(o)));
  }
  if (filters.region?.length) {
    result = result.filter((p) => filters.region!.includes(p.region));
  }
  if (filters.blouseStatus?.length) {
    result = result.filter((p) => filters.blouseStatus!.includes(p.blouseStatus));
  }
  if (filters.priceMin != null) result = result.filter((p) => p.discountedPrice >= filters.priceMin!);
  if (filters.priceMax != null) result = result.filter((p) => p.discountedPrice <= filters.priceMax!);
  if (filters.rating) result = result.filter((p) => p.rating >= filters.rating!);
  if (filters.discount) result = result.filter((p) => p.discountPercent > 0);

  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.fabric.toLowerCase().includes(q) ||
        p.region.toLowerCase().includes(q) ||
        p.colors.some((c) => c.toLowerCase().includes(q))
    );
  }

  switch (filters.sort) {
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
