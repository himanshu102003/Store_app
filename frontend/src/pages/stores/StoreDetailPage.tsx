import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Store, Rating } from '../../types';
import { getStoreById } from '../../services/storeService';
import { createRating, getRatings } from '../../services/ratingService';
import { StarIcon } from '@heroicons/react/24/solid';
import { format } from 'date-fns';

const StoreDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [store, setStore] = useState<Store | null>(null);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!id) {
      setError('Invalid store ID');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const [storeData, ratingsData] = await Promise.all([
          getStoreById(id),
          getRatings({ storeId: id }),
        ]);
        setStore(storeData);
        setRatings(ratingsData.items);
      } catch (err) {
        setError('Failed to load store details. Please try again later.');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/login', { state: { from: `/stores/${id}` } });
      return;
    }

    try {
      setIsSubmitting(true);
      const newRating = await createRating(id!, { value: rating, comment });
      
      // Update UI
      setRatings([newRating, ...ratings]);
      setComment('');
      
      // Update store's average rating
      if (store) {
        const totalRatings = (store.ratingCount || 0) + 1;
        const newAverage = (
          ((store.averageRating || 0) * (totalRatings - 1) + rating) / totalRatings
        );
        
        setStore({
          ...store,
          averageRating: parseFloat(newAverage.toFixed(1)),
          ratingCount: totalRatings,
        });
      }
    } catch (err) {
      setError('Failed to submit review. Please try again.');
      console.error('Error submitting review:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-medium text-gray-900">Store not found</h2>
        <p className="mt-2 text-gray-600">The store you're looking for doesn't exist.</p>
        <Link to="/stores" className="mt-4 inline-block text-indigo-600 hover:text-indigo-500">
          &larr; Back to stores
        </Link>
      </div>
    );
  }

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/stores" className="text-sm text-gray-500 hover:text-gray-700 flex items-center mb-6">
          <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to stores
        </Link>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6">
            <h1 className="text-2xl font-bold text-gray-900">{store.name}</h1>
            <div className="flex items-center mt-2" aria-label={`Average rating: ${store.averageRating?.toFixed(1) || 'No rating'} out of 5 from ${store.ratingCount || 'no'} reviews`}>
              <div className="flex" role="img" aria-label={`${store.averageRating?.toFixed(1) || 'No'} out of 5 stars`}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon
                    key={star}
                    className={`h-5 w-5 ${
                      star <= Math.round(store.averageRating || 0)
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                    }`}
                    aria-hidden="true"
                  />
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-600">
                {store.averageRating?.toFixed(1) || 'No'} rating
                {store.ratingCount ? ` (${store.ratingCount} review${store.ratingCount !== 1 ? 's' : ''})` : ''}
              </span>
            </div>
          </div>

          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Address</dt>
                <dd className="mt-1 text-sm text-gray-900">{store.address}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Owner</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {store.owner?.name || 'Unknown'}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Description</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {store.description || 'No description available.'}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Added on</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {format(new Date(store.createdAt), 'MMMM d, yyyy')}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg font-medium text-gray-900">Write a Review</h2>
            {user ? (
              <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Rating
                  </label>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setRating(value)}
                        className="p-1 focus:outline-none"
                        aria-label={`Rate ${value} out of 5`}
                        title={`Rate ${value} out of 5`}
                      >
                        <StarIcon
                          className={`h-8 w-8 ${
                            value <= rating ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                          aria-hidden="true"
                        />
                      </button>
                    ))}
                    <span className="ml-2 text-sm text-gray-500">
                      {rating} out of 5
                    </span>
                  </div>
                </div>
                <div>
                  <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
                    Your Review
                  </label>
                  <textarea
                    id="comment"
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Share your experience..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                  Please{' '}
                  <Link
                    to="/login"
                    state={{ from: `/stores/${id}` }}
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    sign in
                  </Link>{' '}
                  to leave a review.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg font-medium text-gray-900">
              Customer Reviews {store.ratingCount ? `(${store.ratingCount})` : ''}
            </h2>
          </div>
          <div className="border-t border-gray-200 divide-y divide-gray-200">
            {ratings.length > 0 ? (
              ratings.map((rating) => (
                <div key={rating.id} className="px-4 py-5 sm:px-6">
                  <div className="flex items-center">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <StarIcon
                          key={star}
                          className={`h-5 w-5 ${
                            star <= rating.value ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-sm text-gray-500">
                        {rating.user?.name || 'Anonymous'}
                      </span>
                    </div>
                    <div className="ml-auto text-sm text-gray-500">
                      {format(new Date(rating.createdAt), 'MMM d, yyyy')}
                    </div>
                  </div>
                  {rating.comment && (
                    <div className="mt-2 text-sm text-gray-700">
                      {rating.comment}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="px-4 py-5 sm:px-6 text-center text-gray-500 text-sm">
                No reviews yet. Be the first to review this store!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreDetailsPage;
