import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Package, ShoppingCart, IndianRupee, Eye, Plus, Boxes, MessageSquare } from 'lucide-react';
import StatCard from '../../components/StatCard';
import { apiRequest } from '../../lib/api';
import { formatCurrency, formatDate } from '../../utils/formatters';

const FarmerDashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    apiRequest('/farmer/dashboard').then(setData).catch(() => setData({ stats: {}, recentOrders: [], productPerformance: [] }));
  }, []);

  const stats = [
    { icon: Package, title: 'Total Products', value: data?.stats?.totalProducts ?? '0', gradient: 'from-green-500 to-green-700', onClick: () => navigate('/farmer/products') },
    { icon: ShoppingCart, title: 'Active Orders', value: data?.stats?.activeOrders ?? '0', gradient: 'from-blue-500 to-blue-700', onClick: () => navigate('/farmer/orders') },
    { icon: IndianRupee, title: 'Total Earnings', value: formatCurrency(data?.stats?.totalEarnings ?? 0), gradient: 'from-emerald-500 to-emerald-700', onClick: () => navigate('/farmer/earnings') },
    { icon: Eye, title: 'Profile Views', value: data?.stats?.profileViews ?? '0', gradient: 'from-purple-500 to-purple-700', onClick: () => navigate('/farmer/profile') }
  ];

  const quickActions = [
    { icon: Plus, label: 'Add Product', action: () => navigate('/farmer/products') },
    { icon: Boxes, label: 'Inventory', action: () => navigate('/farmer/inventory') },
    { icon: ShoppingCart, label: 'Orders', action: () => navigate('/farmer/orders') },
    { icon: MessageSquare, label: 'Messages', action: () => navigate('/farmer/messages') }
  ];

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Farmer Dashboard</h1>
        <p className="text-gray-600 mb-8">Welcome back! Manage your farm and products.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }}>
              <StatCard {...stat} />
            </motion.div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <button key={action.label} onClick={action.action} className="flex items-center gap-3 rounded-2xl border border-gray-200 px-5 py-4 hover:border-green-500 hover:bg-green-50 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-green-100 text-green-700 flex items-center justify-center">
                  <action.icon className="w-5 h-5" />
                </div>
                <span className="font-medium text-gray-800">{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Orders</h2>
            <div className="space-y-4">
              {(data?.recentOrders || []).map((order) => (
                <button key={order.id} onClick={() => navigate('/farmer/orders')} className="w-full text-left flex justify-between items-center border border-gray-100 rounded-xl p-4 hover:bg-gray-50">
                  <div>
                    <p className="font-semibold text-gray-900">Order #{order.id}</p>
                    <p className="text-sm text-gray-600 capitalize">{order.status}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-700">{formatCurrency(order.total_amount)}</p>
                    <p className="text-xs text-gray-500">{formatDate(order.created_at)}</p>
                  </div>
                </button>
              ))}
              {data && data.recentOrders.length === 0 && <p className="text-gray-500">No orders yet.</p>}
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Product Performance</h2>
            <div className="space-y-4">
              {(data?.productPerformance || []).map((product) => (
                <button key={product.name} onClick={() => navigate('/farmer/products')} className="w-full text-left flex justify-between items-center border border-gray-100 rounded-xl p-4 hover:bg-gray-50">
                  <p className="font-semibold text-gray-900">{product.name}</p>
                  <p className="text-sm text-gray-600">{product.sold_quantity} units sold</p>
                </button>
              ))}
              {data && data.productPerformance.length === 0 && <p className="text-gray-500">No product sales yet.</p>}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FarmerDashboard;
