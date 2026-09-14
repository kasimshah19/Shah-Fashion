import { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';
import { Plus, Edit2, Trash2, Search, Image as ImageIcon } from 'lucide-react';
import { formatPrice } from '../../utils/format';
import { ProductModal } from '../../components/admin/ProductModal';

export function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  
  const fetchProducts = async () => {
    setLoading(true);
    const { data } = await supabase.from('products').select(`*, product_images(image_url, image_type)`).order('created_at', { ascending: false });
    if (data) setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase()));

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    await supabase.from('products').delete().eq('id', id);
    setProducts(products.filter(p => p.id !== id));
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const openEditModal = (product: any) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <button onClick={openAddModal} className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto">
          <Plus size={18} /> Add Product
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by name or SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon focus:border-transparent"
            />
          </div>
        </div>

        {/* Mobile View */}
        <div className="md:hidden flex flex-col divide-y divide-gray-100">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading products...</div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No products found.</div>
          ) : (
            filtered.map((product) => {
              const frontImage = product.product_images?.find((img: any) => img.image_type === 'front');
              return (
                <div key={product.id} className="p-4 flex flex-col gap-3">
                  <div className="flex items-start gap-3">
                    {frontImage ? (
                      <img src={frontImage.image_url} alt="" className="w-16 h-16 rounded object-cover border border-gray-200" />
                    ) : (
                      <div className="w-16 h-16 rounded bg-gray-100 flex items-center justify-center text-gray-400 border border-gray-200">
                        <ImageIcon size={24} />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{product.name}</p>
                      <p className="text-sm text-gray-500 mb-1">SKU: {product.sku}</p>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900">{formatPrice(product.discounted_price)}</p>
                        {product.mrp > product.discounted_price && (
                          <p className="text-xs text-gray-400 line-through">{formatPrice(product.mrp)}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        product.stock_quantity > 10 ? 'bg-green-100 text-green-800' :
                        product.stock_quantity > 0 ? 'bg-orange-100 text-orange-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {product.stock_quantity} in stock
                      </span>
                      <div className="flex gap-1">
                        {product.is_new && <span className="w-2 h-2 rounded-full bg-blue-500" title="New" />}
                        {product.is_bestseller && <span className="w-2 h-2 rounded-full bg-purple-500" title="Bestseller" />}
                        {product.is_active ? <span className="w-2 h-2 rounded-full bg-green-500" title="Active" /> : <span className="w-2 h-2 rounded-full bg-gray-400" title="Inactive" />}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEditModal(product)} className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => handleDelete(product.id)} className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">SKU</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">Loading products...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">No products found.</td>
                </tr>
              ) : (
                filtered.map((product) => {
                  const frontImage = product.product_images?.find((img: any) => img.image_type === 'front');
                  return (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {frontImage ? (
                          <img src={frontImage.image_url} alt="" className="w-10 h-10 rounded object-cover border border-gray-200" />
                        ) : (
                          <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center text-gray-400 border border-gray-200">
                            <ImageIcon size={18} />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-xs text-gray-500">{product.fabric}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{product.sku}</td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{formatPrice(product.discounted_price)}</p>
                      {product.mrp > product.discounted_price && (
                        <p className="text-xs text-gray-400 line-through">{formatPrice(product.mrp)}</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        product.stock_quantity > 10 ? 'bg-green-100 text-green-800' :
                        product.stock_quantity > 0 ? 'bg-orange-100 text-orange-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {product.stock_quantity} in stock
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1">
                        {product.is_new && <span className="w-2 h-2 rounded-full bg-blue-500" title="New" />}
                        {product.is_bestseller && <span className="w-2 h-2 rounded-full bg-purple-500" title="Bestseller" />}
                        {product.is_active ? <span className="w-2 h-2 rounded-full bg-green-500" title="Active" /> : <span className="w-2 h-2 rounded-full bg-gray-400" title="Inactive" />}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEditModal(product)} className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(product.id)} className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )})
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {modalOpen && (
        <ProductModal 
          isOpen={modalOpen} 
          onClose={() => setModalOpen(false)} 
          product={editingProduct}
          onSaved={fetchProducts}
        />
      )}
    </div>
  );
}
