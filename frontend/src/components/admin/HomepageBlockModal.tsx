import { useState, useEffect } from 'react';
import { X, Upload, Loader2 } from 'lucide-react';
import { supabase } from '../../utils/supabase';

interface HomepageBlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  block?: any;
  onSaved: () => void;
}

export function HomepageBlockModal({ isOpen, onClose, block, onSaved }: HomepageBlockModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    section: 'hero',
    title: '',
    subtitle: '',
    cta_text: '',
    cta_link: '',
    sort_order: 1,
    active: true
  });
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (block) {
      setFormData({
        section: block.section || 'hero',
        title: block.title || '',
        subtitle: block.subtitle || '',
        cta_text: block.cta_text || '',
        cta_link: block.cta_link || '',
        sort_order: block.sort_order || 1,
        active: block.active ?? true
      });
      setImageUrl(block.image_url || null);
      setImageFile(null);
    } else {
      setFormData({
        section: 'hero',
        title: '',
        subtitle: '',
        cta_text: '',
        cta_link: '',
        sort_order: 1,
        active: true
      });
      setImageUrl(null);
      setImageFile(null);
    }
  }, [block]);

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  const uploadImage = async (file: File) => {
    const ext = file.name.split('.').pop();
    const fileName = `${Math.random()}.${ext}`;
    const { error } = await supabase.storage.from('banner-images').upload(fileName, file);
    if (error) throw error;
    const { data: urlData } = supabase.storage.from('banner-images').getPublicUrl(fileName);
    return urlData.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let finalImageUrl = imageUrl;
      if (imageFile) {
        finalImageUrl = await uploadImage(imageFile);
      }

      const payload = {
        ...formData,
        sort_order: Number(formData.sort_order),
        image_url: finalImageUrl
      };

      if (block) {
        const { error } = await supabase.from('homepage_content').update(payload).eq('id', block.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('homepage_content').insert([payload]);
        if (error) throw error;
      }

      onSaved();
      onClose();
    } catch (error) {
      console.error('Error saving block:', error);
      alert('Error saving block');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">{block ? 'Edit Block' : 'Add Block'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
            <select value={formData.section} onChange={e => setFormData({...formData, section: e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2">
              <option value="hero">Hero Carousel</option>
              <option value="category_tile">Category Tile</option>
              <option value="offer_banner">Offer Banner</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
            <input type="text" value={formData.subtitle} onChange={e => setFormData({...formData, subtitle: e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2" />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CTA Text</label>
              <input type="text" value={formData.cta_text} onChange={e => setFormData({...formData, cta_text: e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CTA Link</label>
              <input type="text" value={formData.cta_link} onChange={e => setFormData({...formData, cta_link: e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
              <input type="number" required value={formData.sort_order} onChange={e => setFormData({...formData, sort_order: Number(e.target.value)})} className="w-full border border-gray-200 rounded-lg px-3 py-2" />
            </div>
            <div className="flex items-center">
              <label className="flex items-center gap-2 mt-6 cursor-pointer">
                <input type="checkbox" checked={formData.active} onChange={e => setFormData({...formData, active: e.target.checked})} className="rounded text-maroon" /> Active
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
            <div className="border border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center relative min-h-[160px]">
              {imageUrl ? (
                <>
                  <img src={imageUrl} alt="" className="w-full h-32 object-contain mb-2" />
                  <label className="text-sm text-blue-600 cursor-pointer bg-blue-50 px-3 py-1 rounded hover:bg-blue-100">
                    Change Image
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                </>
              ) : (
                <>
                  <Upload size={24} className="text-gray-400 mb-2" />
                  <span className="text-xs text-gray-500">Upload Image</span>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                </>
              )}
            </div>
          </div>
        </form>
        
        <div className="border-t border-gray-100 p-6 flex justify-end gap-3 bg-gray-50">
          <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-white">
            Cancel
          </button>
          <button type="button" onClick={handleSubmit} disabled={loading} className="px-6 py-2 bg-maroon text-white rounded-lg font-medium hover:bg-maroon-dark disabled:opacity-50 flex items-center gap-2">
            {loading && <Loader2 size={16} className="animate-spin" />}
            {block ? 'Save Changes' : 'Create Block'}
          </button>
        </div>
      </div>
    </div>
  );
}
