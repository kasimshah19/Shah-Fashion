import { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { HomepageBlockModal } from '../../components/admin/HomepageBlockModal';

export function AdminHomepagePage() {
  const [content, setContent] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBlock, setEditingBlock] = useState<any>(null);

  const fetchContent = async () => {
    const { data } = await supabase.from('homepage_content').select('*').order('sort_order', { ascending: true });
    if (data) setContent(data);
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this block?')) return;
    await supabase.from('homepage_content').delete().eq('id', id);
    setContent(content.filter(c => c.id !== id));
  };

  const openAddModal = () => {
    setEditingBlock(null);
    setModalOpen(true);
  };

  const openEditModal = (block: any) => {
    setEditingBlock(block);
    setModalOpen(true);
  };

  const sections = {
    Hero: content.filter(c => c.section === 'hero'),
    Collection: content.filter(c => c.section === 'category_tile'),
    Offer: content.filter(c => c.section === 'offer_banner'),
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Homepage Content</h1>
        <button onClick={openAddModal} className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto">
          <Plus size={18} /> Add Block
        </button>
      </div>

      <div className="space-y-8">
        {Object.entries(sections).map(([type, items]) => (
          <div key={type} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
              <h2 className="font-medium text-gray-900">{type} Blocks</h2>
            </div>
            <div className="p-6">
              {items.length === 0 ? (
                <p className="text-gray-500 text-sm">No {type} blocks found. Default content will be used.</p>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {items.map((item) => (
                    <div key={item.id} className={`border ${!item.active ? 'border-dashed border-gray-300 opacity-70' : 'border-gray-200'} rounded-lg p-4 flex gap-4`}>
                      {item.image_url && (
                        <img src={item.image_url} alt="" className="w-24 h-24 object-cover rounded bg-gray-100 shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <h3 className="font-medium text-gray-900 truncate pr-2">{item.title}</h3>
                          {!item.active && <span className="text-[10px] uppercase font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">Draft</span>}
                        </div>
                        <p className="text-sm text-gray-500 truncate">{item.subtitle}</p>
                        {item.cta_link && <p className="text-xs text-blue-600 truncate mt-1">→ {item.cta_link}</p>}
                        <div className="mt-3 flex gap-2">
                          <button onClick={() => openEditModal(item)} className="text-sm min-h-[44px] min-w-[44px] px-3 bg-gray-50 rounded-lg border border-gray-200 text-blue-600 hover:text-blue-800 hover:bg-blue-50 flex items-center gap-1 font-medium transition-colors">
                            <Edit2 size={16} /> Edit
                          </button>
                          <button onClick={() => handleDelete(item.id)} className="text-sm min-h-[44px] min-w-[44px] px-3 bg-gray-50 rounded-lg border border-gray-200 text-red-600 hover:text-red-800 hover:bg-red-50 flex items-center gap-1 font-medium transition-colors">
                            <Trash2 size={16} /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {modalOpen && (
        <HomepageBlockModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          block={editingBlock}
          onSaved={fetchContent}
        />
      )}
    </div>
  );
}
