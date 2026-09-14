import { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';
import { Search, CheckCircle, XCircle } from 'lucide-react';

type Review = {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
};

export function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  useEffect(() => {
    fetchReviews();
  }, []);

  async function fetchReviews() {
    setLoading(true);
    // Fetch all reviews
    const { data: reviewsData, error: reviewsError } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });
      
    console.log('AdminReviews - Raw Reviews Data:', reviewsData);
    if (reviewsError) {
      console.error('AdminReviews - Error fetching reviews:', reviewsError);
      setLoading(false);
      return;
    }

    // Fetch products from Supabase to match UUIDs properly
    const { data: productsData, error: productsError } = await supabase.from('products').select('id, name');
    if (productsError) {
      console.error('AdminReviews - Error fetching products:', productsError);
    }

    // Fetch profiles for customer names
    const { data: profilesData, error: profilesError } = await supabase.from('profiles').select('id, full_name');
    if (profilesError) {
      console.error('AdminReviews - Error fetching profiles:', profilesError);
    }

    if (reviewsData) {
      const enrichedReviews = reviewsData.map((review: Review) => {
        const product = productsData?.find(p => p.id === review.product_id);
        const profile = profilesData?.find(p => p.id === review.user_id);
        
        let customerName = profile?.full_name;
        if (!customerName || customerName.trim() === '') {
          customerName = 'Verified Buyer';
        }

        return {
          ...review,
          productName: product?.name || 'Unknown Product',
          customerName: customerName
        };
      });
      setReviews(enrichedReviews);
    }
    
    setLoading(false);
  }

  const updateStatus = async (id: string, newStatus: 'approved' | 'rejected') => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .update({ status: newStatus })
        .eq('id', id)
        .select();
        
      if (error) throw error;
      
      if (!data || data.length === 0) {
        throw new Error('Update blocked by database (RLS) or review not found.');
      }
      
      setReviews(reviews.map(r => r.id === id ? { ...r, status: newStatus } : r));
    } catch (err) {
      console.error('Error updating review status:', err);
      alert('Failed to update review status. Please check your database permissions.');
    }
  };

  const filtered = reviews.filter(r => 
    (r.productName || '').toLowerCase().includes(search.toLowerCase()) || 
    (r.comment || '').toLowerCase().includes(search.toLowerCase()) ||
    (r.customerName || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Product Reviews</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search reviews by product or content..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon focus:border-transparent"
            />
          </div>
        </div>

        </div>

        {/* Mobile View */}
        <div className="md:hidden flex flex-col divide-y divide-gray-100">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading reviews...</div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No reviews found.</div>
          ) : (
            filtered.map((review) => (
              <div key={review.id} className="p-4 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{review.productName}</p>
                    <p className="text-sm text-gray-500">{review.customerName}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap
                    ${review.status === 'approved' ? 'bg-green-100 text-green-800' : 
                      review.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                      'bg-yellow-100 text-yellow-800'}`}>
                    {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
                  </span>
                </div>
                
                <div className="flex text-yellow-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-200'}>★</span>
                  ))}
                </div>

                <p className="text-sm text-gray-600 line-clamp-3">
                  {review.comment}
                </p>

                <div className="flex justify-end gap-2 pt-2 border-t border-gray-50 mt-1">
                  {review.status !== 'approved' && (
                    <button 
                      onClick={() => updateStatus(review.id, 'approved')}
                      className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-gray-400 hover:text-green-600 rounded-lg hover:bg-green-50 transition-colors"
                      title="Approve"
                    >
                      <CheckCircle size={18} />
                    </button>
                  )}
                  {review.status !== 'rejected' && (
                    <button 
                      onClick={() => updateStatus(review.id, 'rejected')}
                      className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                      title="Reject"
                    >
                      <XCircle size={18} />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Rating</th>
                <th className="px-6 py-4">Comment</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">Loading reviews...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">No reviews found.</td>
                </tr>
              ) : (
                filtered.map((review) => (
                  <tr key={review.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900 max-w-[150px] truncate">{review.productName}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{review.customerName}</td>
                    <td className="px-6 py-4">
                      <div className="flex text-yellow-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-200'}>★</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-600 max-w-xs truncate" title={review.comment}>
                        {review.comment}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium 
                        ${review.status === 'approved' ? 'bg-green-100 text-green-800' : 
                          review.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                          'bg-yellow-100 text-yellow-800'}`}>
                        {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {review.status !== 'approved' && (
                          <button 
                            onClick={() => updateStatus(review.id, 'approved')}
                            className="p-1.5 text-gray-400 hover:text-green-600 rounded-lg hover:bg-green-50 transition-colors"
                            title="Approve"
                          >
                            <CheckCircle size={18} />
                          </button>
                        )}
                        {review.status !== 'rejected' && (
                          <button 
                            onClick={() => updateStatus(review.id, 'rejected')}
                            className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                            title="Reject"
                          >
                            <XCircle size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
