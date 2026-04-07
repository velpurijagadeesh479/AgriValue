import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, ShoppingCart, Heart, TrendingUp } from 'lucide-react';
import StatCard from '../../components/StatCard';
import { apiRequest } from '../../lib/api';
import { formatCurrency, formatDate } from '../../utils/formatters';

const BuyerDashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    apiRequest('/buyer/dashboard').then(setData).catch(() => setData({ stats: {}, recentOrders: [], recommendedProducts: [] }));
  }, []);

  const stats = [
    { icon: ShoppingCart, title: 'Active Orders', value: data?.stats?.activeOrders ?? '0', gradient: 'from-blue-500 to-blue-700' },
    { icon: ShoppingBag, title: 'Total Orders', value: data?.stats?.totalOrders ?? '0', gradient: 'from-green-500 to-green-700' },
    { icon: Heart, title: 'Wishlist Items', value: data?.stats?.wishlistItems ?? '0', gradient: 'from-pink-500 to-pink-700' },
    { icon: TrendingUp, title: 'Total Spent', value: formatCurrency(data?.stats?.totalSpent ?? 0), gradient: 'from-purple-500 to-purple-700' }
  ];

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Buyer Dashboard</h1>
        <p className="text-gray-600 mb-8">Welcome back! Explore quality agricultural products.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }}>
              <StatCard {...stat} />
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Orders</h2>
            <div className="space-y-4">
              {(data?.recentOrders || []).map((order) => (
                <div key={order.id} className="flex justify-between items-center border border-gray-100 rounded-xl p-4">
                  <div>
                    <p className="font-semibold text-gray-900">Order #{order.id}</p>
                    <p className="text-sm text-gray-600">{order.farmer_name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-700">{formatCurrency(order.total_amount)}</p>
                    <p className="text-xs text-gray-500">{formatDate(order.created_at)}</p>
                  </div>
                </div>
              ))}
              {data && data.recentOrders.length === 0 && <p className="text-gray-500">No orders yet.</p>}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recommended Products</h2>
            <div className="space-y-4">
              {(data?.recommendedProducts || []).map((product) => (
                <div key={product.id} className="flex items-center gap-4 border border-gray-100 rounded-xl p-3">
                  <img src={product.imageUrls?.[0] || 'https://placehold.co/120x120?text=Agri'} alt={product.name} className="w-16 h-16 rounded-xl object-cover" />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-600">{product.farmer?.businessName || product.farmer?.name}</p>
                  </div>
                  <span className="font-semibold text-green-700">{formatCurrency(product.price)}</span>
                </div>
              ))}
              {data && data.recommendedProducts.length === 0 && <p className="text-gray-500">No recommendations yet.</p>}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BuyerDashboard;
