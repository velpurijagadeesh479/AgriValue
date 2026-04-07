import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Heart, Trash2, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import EmptyState from '../../components/EmptyState';
import { useNavigate } from 'react-router';
import { apiRequest } from '../../lib/api';
import { formatCurrency } from '../../utils/formatters';

const Wishlist = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);

  const loadWishlist = async () => {
    const data = await apiRequest('/buyer/wishlist');
    setItems(data.items);
  };

  useEffect(() => {
    loadWishlist().catch(() => setItems([]));
  }, []);

  const removeItem = async (id) => {
    await apiRequest(`/buyer/wishlist/${id}`, { method: 'DELETE' });
    toast.success('Removed from wishlist');
    loadWishlist();
  };

  const moveToCart = async (productId) => {
    await apiRequest('/buyer/cart', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity: 1 })
    });
    toast.success('Added to cart');
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Wishlist</h1>
            <p className="text-gray-600">Save products for later</p>
          </div>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate('/buyer/browse')} className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all shadow-lg">
            <ShoppingCart className="w-5 h-5" />
            <span>Browse Products</span>
          </motion.button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
          {items.length === 0 ? <EmptyState icon={Heart} title="Your Wishlist is Empty" description="Start adding products you love to your wishlist" action={() => navigate('/buyer/browse')} actionLabel="Browse Products" /> : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex flex-col md:flex-row gap-4 border border-gray-100 rounded-2xl p-4">
                  <img src={item.product.imageUrls?.[0] || 'https://placehold.co/160x160?text=Agri'} alt={item.product.name} className="w-24 h-24 rounded-xl object-cover" />
                  <div className="flex-1">
                    <h2 className="text-lg font-bold text-gray-900">{item.product.name}</h2>
                    <p className="text-sm text-gray-600">{item.product.farmer?.businessName || item.product.farmer?.name}</p>
                    <p className="text-green-700 font-semibold">{formatCurrency(item.product.price)}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => moveToCart(item.product.id)} className="px-4 py-2 rounded-xl bg-green-600 text-white">Add to Cart</button>
                    <button onClick={() => removeItem(item.id)} className="px-4 py-2 rounded-xl border text-red-600 inline-flex items-center gap-2"><Trash2 className="w-4 h-4" />Remove</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Wishlist;
