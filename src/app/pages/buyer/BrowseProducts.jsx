import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { ShoppingBag, Search, Filter, Heart, ShoppingCart, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import EmptyState from '../../components/EmptyState';
import { apiRequest } from '../../lib/api';
import { formatCurrency } from '../../utils/formatters';

const BrowseProducts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const query = new URLSearchParams({
          q: searchTerm,
          category
        });
        const data = await apiRequest(`/products?${query.toString()}`, { signal: controller.signal });
        setProducts(data.products);
      } catch (error) {
        if (error.name !== 'AbortError') {
          toast.error(error.message);
        }
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [searchTerm, category]);

  const addToCart = async (productId) => {
    try {
      await apiRequest('/buyer/cart', {
        method: 'POST',
        body: JSON.stringify({ productId, quantity: 1 })
      });
      toast.success('Added to cart');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const addToWishlist = async (productId) => {
    try {
      await apiRequest('/buyer/wishlist', {
        method: 'POST',
        body: JSON.stringify({ productId })
      });
      toast.success('Added to wishlist');
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Products</h1>
        <p className="text-gray-600 mb-8">Discover quality agricultural products from verified farmers</p>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all outline-none"
              />
            </div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all outline-none"
            >
              <option value="all">All Categories</option>
              <option value="vegetables">Vegetables</option>
              <option value="fruits">Fruits</option>
              <option value="grains">Grains</option>
              <option value="dairy">Dairy</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            <span className="px-4 py-2 bg-green-50 text-green-700 rounded-lg font-medium text-sm">
              <Filter className="w-4 h-4 inline mr-2" />
              {loading ? 'Loading products...' : `${products.length} product(s) found`}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
          {loading ? (
            <p className="text-gray-600">Loading products...</p>
          ) : products.length === 0 ? (
            <EmptyState icon={ShoppingBag} title="No Products Available" description="Try another search or category filter" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product.id} className="border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-shadow">
                  <img
                    src={product.imageUrls?.[0] || 'https://placehold.co/800x600?text=Agri+Value'}
                    alt={product.name}
                    className="w-full h-52 object-cover"
                  />
                  <div className="p-5">
                    <div className="flex justify-between items-start gap-4 mb-3">
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">{product.name}</h2>
                        <p className="text-sm text-gray-500 capitalize">{product.category}</p>
                      </div>
                      <span className="text-xl font-bold text-green-700">{formatCurrency(product.price)}</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{product.description}</p>
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <p>{product.farmer?.businessName || product.farmer?.name}</p>
                      <p className="flex items-center gap-2"><MapPin className="w-4 h-4" />{product.location}</p>
                      <p>{product.quantity} {product.unit} available</p>
                    </div>
                    <div className="flex gap-3">
                      <Link
                        to={`/product/${product.id}`}
                        className="flex-1 px-4 py-3 bg-green-600 text-white text-center rounded-xl hover:bg-green-700 transition-colors font-semibold"
                      >
                        View Details
                      </Link>
                      <button
                        onClick={() => addToCart(product.id)}
                        className="p-3 rounded-xl border border-gray-300 hover:bg-gray-50"
                      >
                        <ShoppingCart className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => addToWishlist(product.id)}
                        className="p-3 rounded-xl border border-gray-300 hover:bg-gray-50"
                      >
                        <Heart className="w-5 h-5" />
                      </button>
                    </div>
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

export default BrowseProducts;
