import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Users, UserCheck, ShoppingCart, TrendingUp, Package, DollarSign } from 'lucide-react';
import StatCard from '../../components/StatCard';
import { apiRequest } from '../../lib/api';
import { formatCurrency, formatDate } from '../../utils/formatters';

const AdminDashboard = () => {
  const [data, setData] = useState({ stats: {}, recentUsers: [], recentTransactions: [] });

  useEffect(() => {
    apiRequest('/admin/dashboard').then(setData).catch(() => setData({ stats: {}, recentUsers: [], recentTransactions: [] }));
  }, []);

  const stats = [
    { icon: Users, title: 'Total Users', value: data.stats.totalUsers ?? '0', gradient: 'from-blue-500 to-blue-700' },
    { icon: UserCheck, title: 'Active Farmers', value: data.stats.activeFarmers ?? '0', gradient: 'from-green-500 to-green-700' },
    { icon: ShoppingCart, title: 'Active Buyers', value: data.stats.activeBuyers ?? '0', gradient: 'from-amber-500 to-amber-700' },
    { icon: Package, title: 'Total Products', value: data.stats.totalProducts ?? '0', gradient: 'from-purple-500 to-purple-700' },
    { icon: TrendingUp, title: 'Total Orders', value: data.stats.totalOrders ?? '0', gradient: 'from-pink-500 to-pink-700' },
    { icon: DollarSign, title: 'Revenue', value: formatCurrency(data.stats.revenue ?? 0), gradient: 'from-emerald-500 to-emerald-700' }
  ];

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600 mb-8">Welcome back! Here's your platform overview.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }}>
              <StatCard {...stat} />
            </motion.div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Users</h2>
            <div className="space-y-4">
              {data.recentUsers.map((user) => (
                <div key={user.id} className="flex justify-between items-center border border-gray-100 rounded-xl p-4">
                  <div>
                    <p className="font-semibold text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-600 capitalize">{user.role}</p>
                  </div>
                  <p className="text-xs text-gray-500">{formatDate(user.created_at)}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Transactions</h2>
            <div className="space-y-4">
              {data.recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex justify-between items-center border border-gray-100 rounded-xl p-4">
                  <div>
                    <p className="font-semibold text-gray-900">Order #{transaction.id}</p>
                    <p className="text-sm text-gray-600 capitalize">{transaction.status}</p>
                  </div>
                  <p className="font-semibold text-green-700">{formatCurrency(transaction.total_amount)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
