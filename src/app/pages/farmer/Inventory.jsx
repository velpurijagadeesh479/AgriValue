import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, TrendingDown, AlertTriangle } from 'lucide-react';
import StatCard from '../../components/StatCard';
import { apiRequest } from '../../lib/api';
import { formatCurrency } from '../../utils/formatters';

const Inventory = () => {
  const [data, setData] = useState({ stats: {}, products: [] });

  useEffect(() => {
    apiRequest('/farmer/inventory').then(setData).catch(() => setData({ stats: {}, products: [] }));
  }, []);

  const stats = [
    { icon: ShoppingBag, title: 'Total Items', value: data.stats.totalItems ?? '0', gradient: 'from-blue-500 to-blue-700' },
    { icon: TrendingDown, title: 'Low Stock Items', value: data.stats.lowStockItems ?? '0', gradient: 'from-amber-500 to-amber-700' },
    { icon: AlertTriangle, title: 'Out of Stock', value: data.stats.outOfStock ?? '0', gradient: 'from-red-500 to-red-700' }
  ];

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Inventory Management</h1>
        <p className="text-gray-600 mb-8">Track and manage your product inventory with live marketplace data.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }}>
              <StatCard {...stat} />
            </motion.div>
          ))}
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Inventory Overview</h2>
          <div className="space-y-4">
            {data.products.map((product) => (
              <div key={product.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 border border-gray-100 rounded-xl p-4">
                <div className="md:col-span-2">
                  <p className="font-semibold text-gray-900">{product.name}</p>
                  <p className="text-sm text-gray-600 capitalize">{product.category}</p>
                </div>
                <p className="text-sm text-gray-700">{product.quantity} {product.unit}</p>
                <p className="text-sm font-medium text-green-700">{formatCurrency(product.price)}</p>
                <p className={`text-sm font-medium ${product.quantity <= 0 ? 'text-red-600' : product.quantity <= 50 ? 'text-amber-600' : 'text-green-700'}`}>
                  {product.quantity <= 0 ? 'Out of Stock' : product.quantity <= 50 ? 'Low Stock' : 'In Stock'}
                </p>
              </div>
            ))}
            {data.products.length === 0 && <p className="text-gray-500">No inventory data yet.</p>}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Inventory;
