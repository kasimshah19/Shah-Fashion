import { useState, useRef } from 'react';
import { Star, Upload, X, Loader2 } from 'lucide-react';
import { supabase } from '../../utils/supabase';
import { useToast } from '../ui/Toast';
import { useAuth } from '../../context/AuthContext';

interface ReviewFormProps {
  productId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ReviewForm({ productId, onSuccess, onCancel }: ReviewFormProps) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      if (photos.length + newFiles.length > 3) {
        showToast('Maximum 3 photos allowed');
        return;
      }
      setPhotos((prev) => [...prev, ...newFiles]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      showToast('Please log in to submit a review');
      return;
    }
    if (rating === 0) {
      showToast('Please select a rating');
      return;
    }
    if (!comment.trim()) {
      showToast('Please write a comment');
      return;
    }

    setIsSubmitting(true);
    try {
      // Get real user id from Supabase auth
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
      if (authError || !authUser) throw new Error('You must be logged in with a real account to submit a review');

      const uploadedUrls: string[] = [];
      
      // Upload photos if any
      for (const file of photos) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = `${authUser.id}/${productId}/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('review-images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('review-images')
          .getPublicUrl(filePath);
          
        uploadedUrls.push(publicUrl);
      }

      // Insert review using the real Supabase user ID
      const { error: insertError } = await supabase.from('reviews').insert({
        product_id: productId,
        user_id: authUser.id,
        rating,
        comment: comment.trim(),
        images: uploadedUrls.length > 0 ? uploadedUrls : null,
        status: 'pending'
      });

      if (insertError) throw insertError;

      showToast('Your review is submitted and pending approval!');
      setRating(0);
      setComment('');
      setPhotos([]);
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error('Error submitting review:', error);
      showToast(error.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-serif text-lg font-semibold text-gray-900">Write a Review</h3>
        {onCancel && (
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="focus:outline-none transition-colors"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
              >
                <Star
                  size={24}
                  className={(hoverRating || rating) >= star ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Review</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="input-field w-full resize-none"
            placeholder="What did you like or dislike?"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Add Photos (optional)</label>
          <div className="flex flex-wrap gap-3">
            {photos.map((photo, i) => (
              <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                <img src={URL.createObjectURL(photo)} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removePhoto(i)}
                  className="absolute top-1 right-1 w-6 h-6 bg-black/50 hover:bg-black/70 rounded-full text-white flex items-center justify-center backdrop-blur-sm"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            
            {photos.length < 3 && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 hover:border-maroon hover:text-maroon transition-colors"
              >
                <Upload size={20} className="mb-1" />
                <span className="text-xs">Upload</span>
              </button>
            )}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handlePhotoSelect}
            accept="image/*"
            multiple
            className="hidden"
          />
          <p className="text-xs text-gray-500 mt-1">Up to 3 images, max 5MB each.</p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary w-full py-3 mt-2 flex justify-center items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Submitting...
            </>
          ) : (
            'Submit Review'
          )}
        </button>
      </form>
    </div>
  );
}
