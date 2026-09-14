import { useState, useEffect } from 'react';
import { X, Upload, Loader2, XCircle } from 'lucide-react';
import { supabase } from '../../utils/supabase';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: any;
  onSaved: () => void;
}

export function ProductModal({ isOpen, onClose, product, onSaved }: ProductModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    category: 'Saree',
    fabric: '',
    work: '',
    occasion: [] as string[],
    colors: [] as string[],
    region_style: '',
    blouse_status: 'Blouse Sold Separately',
    mrp: '',
    discounted_price: '',
    stock_quantity: '',
    is_active: true,
    is_new: false,
    is_bestseller: false
  });
  
  const [images, setImages] = useState<{file?: File, url?: string, type: string}[]>([
    { type: 'front' },
    { type: 'pallu' },
    { type: 'blouse' },
    { type: 'draped' }
  ]);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        sku: product.sku,
        description: product.description || '',
        category: product.category || 'Saree',
        fabric: product.fabric || '',
        work: product.work || '',
        occasion: Array.isArray(product.occasion) ? product.occasion : (typeof product.occasion === 'string' ? [product.occasion] : []),
        colors: Array.isArray(product.colors) ? product.colors : (typeof product.colors === 'string' ? [product.colors] : []),
        region_style: product.region_style || '',
        blouse_status: product.blouse_status || 'Blouse Sold Separately',
        mrp: product.mrp || '',
        discounted_price: product.discounted_price || '',
        stock_quantity: product.stock_quantity || '',
        is_active: product.is_active ?? true,
        is_new: product.is_new ?? false,
        is_bestseller: product.is_bestseller ?? false
      });
      
      if (product.product_images && product.product_images.length > 0) {
        const newImages = [...images];
        product.product_images.forEach((img: any) => {
          const idx = newImages.findIndex(i => i.type === img.image_type);
          if (idx !== -1) {
            newImages[idx].url = img.image_url;
          }
        });
        setImages(newImages);
      }
    }
  }, [product]);

  if (!isOpen) return null;

  const handleImageChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newImages = [...images];
      newImages[index] = { ...newImages[index], file, url: URL.createObjectURL(file) };
      setImages(newImages);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages[index] = { type: newImages[index].type };
    setImages(newImages);
  };

  const uploadImage = async (file: File) => {
    const ext = file.name.split('.').pop();
    const fileName = `${Math.random()}.${ext}`;
    const { error } = await supabase.storage.from('product-images').upload(fileName, file);
    if (error) throw error;
    const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(fileName);
    return urlData.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        mrp: Number(formData.mrp),
        discounted_price: Number(formData.discounted_price),
        stock_quantity: Number(formData.stock_quantity),
      };

      let productId = product?.id;

      if (product) {
        // Update product
        const { error } = await supabase.from('products').update(payload).eq('id', product.id);
        if (error) throw error;
      } else {
        // Insert product
        const { data, error } = await supabase.from('products').insert([payload]).select().single();
        if (error) throw error;
        productId = data.id;
      }

      // Handle images
      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        if (img.file) {
          const url = await uploadImage(img.file);
          // check if image of this type already exists for this product
          const { data: existingImg } = await supabase
            .from('product_images')
            .select('id')
            .eq('product_id', productId)
            .eq('image_type', img.type)
            .maybeSingle();

          if (existingImg) {
            await supabase.from('product_images').update({ image_url: url }).eq('id', existingImg.id);
          } else {
            await supabase.from('product_images').insert([{
              product_id: productId,
              image_url: url,
              image_type: img.type,
              sort_order: i + 1
            }]);
          }
        }
      }

      onSaved();
      onClose();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">{product ? 'Edit Product' : 'Add Product'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 border-b pb-2">Basic Info</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SKU *</label>
                  <input required type="text" value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2">
                    <option value="Saree">Saree</option>
                    <option value="Blouse Piece">Blouse Piece</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2"></textarea>
              </div>

              <h3 className="font-semibold text-gray-900 border-b pb-2 mt-6">Pricing & Inventory</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">MRP (₹) *</label>
                  <input required type="number" value={formData.mrp} onChange={e => setFormData({...formData, mrp: e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sale Price (₹)</label>
                  <input required type="number" value={formData.discounted_price} onChange={e => setFormData({...formData, discounted_price: e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
                  <input required type="number" value={formData.stock_quantity} onChange={e => setFormData({...formData, stock_quantity: e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2" />
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mt-4">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={formData.is_active} onChange={e => setFormData({...formData, is_active: e.target.checked})} className="rounded text-maroon" /> Active
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={formData.is_new} onChange={e => setFormData({...formData, is_new: e.target.checked})} className="rounded text-maroon" /> New Arrival
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={formData.is_bestseller} onChange={e => setFormData({...formData, is_bestseller: e.target.checked})} className="rounded text-maroon" /> Bestseller
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 border-b pb-2">Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fabric</label>
                  <input type="text" value={formData.fabric} onChange={e => setFormData({...formData, fabric: e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Region / Style</label>
                  <input type="text" value={formData.region_style} onChange={e => setFormData({...formData, region_style: e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Colors (comma separated)</label>
                <input type="text" value={(Array.isArray(formData.colors) ? formData.colors : []).join(', ')} onChange={e => setFormData({...formData, colors: e.target.value.split(',').map(s=>s.trim())})} className="w-full border border-gray-200 rounded-lg px-3 py-2" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Occasions (comma separated)</label>
                <input type="text" value={(Array.isArray(formData.occasion) ? formData.occasion : []).join(', ')} onChange={e => setFormData({...formData, occasion: e.target.value.split(',').map(s=>s.trim())})} className="w-full border border-gray-200 rounded-lg px-3 py-2" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Blouse Status</label>
                <select value={formData.blouse_status} onChange={e => setFormData({...formData, blouse_status: e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2">
                  <option value="Blouse Sold Separately">Blouse Sold Separately</option>
                  <option value="Blouse Included (Unstitched)">Blouse Included (Unstitched)</option>
                  <option value="Blouse Included (Stitched)">Blouse Included (Stitched)</option>
                  <option value="Blouse Piece Only">Blouse Piece Only</option>
                </select>
              </div>

              <h3 className="font-semibold text-gray-900 border-b pb-2 mt-6">Images</h3>
              <div className="grid grid-cols-2 gap-4">
                {images.map((img, idx) => (
                  <div key={idx} className="border border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center relative min-h-[120px]">
                    <span className="absolute top-2 left-2 text-xs font-semibold uppercase text-gray-500 bg-white px-1 rounded">{img.type}</span>
                    {img.url ? (
                      <>
                        <img src={img.url} alt="" className="w-full h-24 object-contain mb-2" />
                        <button type="button" onClick={() => removeImage(idx)} className="absolute top-2 right-2 text-red-500 hover:bg-red-50 p-1 rounded">
                          <XCircle size={16} />
                        </button>
                      </>
                    ) : (
                      <>
                        <Upload size={24} className="text-gray-400 mb-2" />
                        <span className="text-xs text-gray-500">Upload Image</span>
                        <input type="file" accept="image/*" onChange={(e) => handleImageChange(idx, e)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </form>
        
        <div className="border-t border-gray-100 p-6 flex justify-end gap-3 bg-gray-50">
          <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-white">
            Cancel
          </button>
          <button type="button" onClick={handleSubmit} disabled={loading} className="px-6 py-2 bg-maroon text-white rounded-lg font-medium hover:bg-maroon-dark disabled:opacity-50 flex items-center gap-2">
            {loading && <Loader2 size={16} className="animate-spin" />}
            {product ? 'Save Changes' : 'Create Product'}
          </button>
        </div>
      </div>
    </div>
  );
}
