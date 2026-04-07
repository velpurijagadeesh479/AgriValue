import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';
import { toast } from 'sonner';
import EmptyState from '../../components/EmptyState';
import { useNavigate } from 'react-router';
import { apiRequest } from '../../lib/api';
import { formatCurrency } from '../../utils/formatters';

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState({ items: [], summary: { subtotal: 0, shipping: 0, tax: 0, total: 0 } });
  const [loading, setLoading] = useState(true);

  const loadCart = async () => {
    try {
      setLoading(true);
      const data = await apiRequest('/buyer/cart');
      setCart(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const updateQuantity = async (itemId, quantity) => {
    if (quantity <= 0) {
      return removeItem(itemId);
    }
    await apiRequest(`/buyer/cart/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity })
    });
    loadCart();
  };

  const removeItem = async (itemId) => {
    await apiRequest(`/buyer/cart/${itemId}`, { method: 'DELETE' });
    toast.success('Removed from cart');
    loadCart();
  };

  const checkout = async () => {
    try {
      await apiRequest('/buyer/checkout', { method: 'POST', body: JSON.stringify({}) });
      toast.success('Order placed successfully');
      loadCart();
      navigate('/buyer/orders');
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
        <p className="text-gray-600 mb-8">Review your items before checkout</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
            {loading ? (
              <p className="text-gray-600">Loading cart...</p>
            ) : cart.items.length === 0 ? (
              <EmptyState icon={ShoppingCart} title="Your Cart is Empty" description="Start adding products to your cart" action={() => navigate('/buyer/browse')} actionLabel="Browse Products" />
            ) : (
              <div className="space-y-4">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex flex-col md:flex-row md:items-center gap-4 border border-gray-100 rounded-2xl p-4">
                    <img src={item.product.imageUrls?.[0] || 'https://placehold.co/160x160?text=Agri'} alt={item.product.name} className="w-24 h-24 rounded-xl object-cover" />
                    <div className="flex-1">
                      <h2 className="text-lg font-bold text-gray-900">{item.product.name}</h2>
                      <p className="text-sm text-gray-600">{item.product.farmer?.businessName || item.product.farmer?.name}</p>
                      <p className="text-sm text-green-700 font-semibold">{formatCurrency(item.product.price)} / {item.product.unit}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-2 border rounded-lg"><Minus className="w-4 h-4" /></button>
                      <span className="font-semibold min-w-8 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2 border rounded-lg"><Plus className="w-4 h-4" /></button>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{formatCurrency(item.total)}</p>
                      <button onClick={() => removeItem(item.id)} className="mt-2 text-red-600 text-sm inline-flex items-center gap-1"><Trash2 className="w-4 h-4" />Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 h-fit">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>{formatCurrency(cart.summary.subtotal)}</span></div>
              <div className="flex justify-between text-gray-600"><span>Shipping</span><span>{formatCurrency(cart.summary.shipping)}</span></div>
              <div className="flex justify-between text-gray-600"><span>Tax (GST)</span><span>{formatCurrency(cart.summary.tax)}</span></div>
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between text-xl font-bold text-gray-900"><span>Total</span><span>{formatCurrency(cart.summary.total)}</span></div>
              </div>
            </div>
            <motion.button whileHover={{ scale: cart.items.length ? 1.02 : 1 }} whileTap={{ scale: cart.items.length ? 0.98 : 1 }} onClick={checkout} disabled={!cart.items.length} className={`w-full px-6 py-3 rounded-xl font-semibold ${cart.items.length ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>
              Proceed to Checkout
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Cart;
