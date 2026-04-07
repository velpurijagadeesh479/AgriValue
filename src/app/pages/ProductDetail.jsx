import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { motion } from 'motion/react';
import { Heart, ShoppingCart, MapPin, Star, ArrowLeft, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import PublicNavbar from '../components/PublicNavbar';
import Footer from '../components/Footer';
import { apiRequest } from '../lib/api';
import { formatCurrency } from '../utils/formatters';

const ProductDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await apiRequest(`/products/${id}`);
        setProduct(data.product);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const addToCart = async () => {
    try {
      await apiRequest('/buyer/cart', {
        method: 'POST',
        body: JSON.stringify({ productId: product.id, quantity: 1 })
      });
      toast.success('Added to cart');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const addToWishlist = async () => {
    try {
      await apiRequest('/buyer/wishlist', {
        method: 'POST',
        body: JSON.stringify({ productId: product.id })
      });
      toast.success('Added to wishlist');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const startConversation = async () => {
    try {
      await apiRequest('/messages/start', {
        method: 'POST',
        body: JSON.stringify({
          farmerId: product.farmerId,
          message: `Hello, I am interested in ${product.name}. Can you share more details?`
        })
      });
      toast.success('Conversation started');
      navigate('/buyer/messages');
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <PublicNavbar />
      <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.button initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} onClick={() => navigate('/buyer/browse')} className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Products</span>
          </motion.button>

          {loading ? (
            <p className="text-gray-600">Loading product details...</p>
          ) : !product ? (
            <p className="text-red-600">Product not found.</p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <img
                  src={product.imageUrls?.[0] || 'https://placehold.co/800x800?text=Agri+Value'}
                  alt={product.name}
                  className="w-full rounded-2xl aspect-square object-cover mb-4"
                />
                <div className="grid grid-cols-4 gap-4">
                  {(product.imageUrls?.length ? product.imageUrls : [product.imageUrls?.[0] || 'https://placehold.co/200x200?text=Agri']).slice(0, 4).map((image, index) => (
                    <img key={index} src={image} alt={`${product.name} ${index + 1}`} className="bg-gray-100 rounded-xl aspect-square object-cover" />
                  ))}
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
                <div className="flex items-center space-x-4 mb-6">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 text-amber-500 fill-amber-500" />)}
                  </div>
                  <span className="text-gray-600 capitalize">{product.category} product</span>
                </div>
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <p className="text-4xl font-bold text-green-600 mb-2">
                    {formatCurrency(product.price)} <span className="text-xl text-gray-600 font-normal">/ {product.unit}</span>
                  </p>
                  <p className="text-gray-600">Available quantity: {product.quantity} {product.unit}</p>
                </div>
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-3">Description</h2>
                  <p className="text-gray-600 leading-relaxed">{product.description}</p>
                </div>
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900 mb-3">Farmer Information</h2>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center text-white font-bold">
                      {(product.farmer?.name || 'F').charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{product.farmer?.businessName || product.farmer?.name}</p>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{product.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-4">
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={addToCart} className="flex-1 flex items-center justify-center space-x-2 px-6 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all shadow-lg font-semibold">
                    <ShoppingCart className="w-5 h-5" />
                    <span>Add to Cart</span>
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={startConversation} className="px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all">
                    <MessageSquare className="w-5 h-5" />
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={addToWishlist} className="px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all">
                    <Heart className="w-5 h-5" />
                  </motion.button>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetail;
