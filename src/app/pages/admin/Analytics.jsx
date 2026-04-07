import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { apiRequest } from '../../lib/api';
import { formatCurrency } from '../../utils/formatters';

const COLORS = ['#16a34a', '#2563eb', '#f59e0b', '#ef4444', '#8b5cf6'];

const Analytics = () => {
  const [data, setData] = useState({ userGrowth: [], revenueTrends: [], orderStats: [], productPerformance: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest('/admin/analytics')
      .then(setData)
      .catch(() => setData({ userGrowth: [], revenueTrends: [], orderStats: [], productPerformance: [] }))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Platform Analytics</h1>
          <p className="text-gray-600">Detailed insights and performance metrics</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">User Growth</h2>
            {loading ? <p className="text-gray-500">Loading user growth...</p> : (
              <>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={data.userGrowth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="users" fill="#16a34a" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-3 gap-3 mt-4">
                  {data.userGrowth.slice(-3).map((row) => (
                    <div key={row.month} className="rounded-xl bg-green-50 p-3 text-center">
                      <p className="text-xs text-gray-600">{row.month}</p>
                      <p className="font-semibold text-green-700">{row.users}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Revenue Trends</h2>
            {loading ? <p className="text-gray-500">Loading revenue trends...</p> : (
              <>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={data.revenueTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Bar dataKey="revenue" fill="#2563eb" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-3 mt-4">
                  {data.revenueTrends.slice(-2).map((row) => (
                    <div key={row.month} className="rounded-xl bg-blue-50 p-3 text-center">
                      <p className="text-xs text-gray-600">{row.month}</p>
                      <p className="font-semibold text-blue-700">{formatCurrency(row.revenue)}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Order Statistics</h2>
            {!loading && data.orderStats.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={data.orderStats} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={95} label>
                    {data.orderStats.map((entry, index) => (
                      <Cell key={entry.status} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500">{loading ? 'Loading order statistics...' : 'No order statistics available.'}</p>
            )}
            <div className="space-y-2 mt-4">
              {data.orderStats.map((row) => (
                <div key={row.status} className="flex justify-between text-sm text-gray-700">
                  <span className="capitalize">{row.status}</span>
                  <span className="font-semibold">{row.count}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Product Performance</h2>
            {loading ? <p className="text-gray-500">Loading product performance...</p> : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={data.productPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" hide />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="sold" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
            <div className="space-y-2 mt-4">
              {data.productPerformance.map((row) => (
                <div key={row.name} className="flex justify-between text-sm text-gray-700">
                  <span>{row.name}</span>
                  <span className="font-semibold">{row.sold} sold</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Analytics;
