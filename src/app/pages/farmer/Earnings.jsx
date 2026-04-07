import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { IndianRupee, TrendingUp, Calendar, X, CheckCircle2, Circle } from 'lucide-react';
import StatCard from '../../components/StatCard';
import { apiRequest } from '../../lib/api';
import { formatCurrency, formatDate } from '../../utils/formatters';

const Earnings = () => {
  const [data, setData] = useState({ stats: {}, transactions: [], detail: { totalOrders: [], monthOrders: [], pendingOrders: [], processGuide: [] } });
  const [activeTab, setActiveTab] = useState('total');
  const [selectedRequest, setSelectedRequest] = useState(null);

  const detail = data?.detail || {
    totalOrders: data?.transactions || [],
    monthOrders: [],
    pendingOrders: [],
    processGuide: []
  };

  useEffect(() => {
    apiRequest('/farmer/earnings').then(setData).catch(() => setData({ stats: {}, transactions: [], detail: { totalOrders: [], monthOrders: [], pendingOrders: [], processGuide: [] } }));
  }, []);

  const stats = [
    { icon: IndianRupee, title: 'Total Earnings', value: formatCurrency(data.stats.totalEarnings ?? 0), gradient: 'from-emerald-500 to-emerald-700', onClick: () => setActiveTab('total') },
    { icon: TrendingUp, title: 'This Month', value: formatCurrency(data.stats.thisMonth ?? 0), gradient: 'from-blue-500 to-blue-700', onClick: () => setActiveTab('month') },
    { icon: Calendar, title: 'Pending', value: formatCurrency(data.stats.pending ?? 0), gradient: 'from-amber-500 to-amber-700', onClick: () => setActiveTab('pending') }
  ];

  const detailConfig = useMemo(() => {
    if (activeTab === 'month') {
      return { title: 'This Month Earnings', items: detail.monthOrders || [] };
    }
    if (activeTab === 'pending') {
      return { title: 'Pending Amount Details', items: detail.pendingOrders || [] };
    }
    return { title: 'Total Earnings Details', items: detail.totalOrders || [] };
  }, [activeTab, detail]);

  const getProgressSteps = (status) => {
    const steps = [
      { key: 'accepted', label: 'Accepted' },
      { key: 'ready', label: 'Ready' },
      { key: 'shipped', label: 'Started Shipping' },
      { key: 'delivered', label: 'Delivered' }
    ];

    const statusIndexMap = {
      pending: 0,
      processing: 1,
      shipped: 2,
      delivered: 3,
      cancelled: -1
    };

    const currentIndex = statusIndexMap[status] ?? 0;

    return steps.map((step, index) => ({
      ...step,
      done: currentIndex >= index && currentIndex !== -1,
      current: currentIndex === index
    }));
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Earnings</h1>
            <p className="text-gray-600">Track your revenue and payment progress.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }}>
              <StatCard {...stat} />
            </motion.div>
          ))}
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{detailConfig.title}</h2>
            <div className="space-y-4">
              {detailConfig.items.map((item) => (
                <button key={item.id} onClick={() => setSelectedRequest(item)} className="w-full text-left flex justify-between items-center border border-gray-100 rounded-xl p-4 hover:bg-gray-50">
                  <div>
                    <p className="font-semibold text-gray-900">Order #{item.id}</p>
                    <p className="text-sm text-gray-500">{formatDate(item.created_at)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-700">{formatCurrency(item.total_amount)}</p>
                    <p className="text-sm capitalize text-gray-600">{item.status}</p>
                  </div>
                </button>
              ))}
              {detailConfig.items.length === 0 && <p className="text-gray-500">No entries available for this view.</p>}
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Request Status</h2>
            <div className="space-y-4">
              {detailConfig.items.map((item) => (
                <button key={`status-${item.id}`} onClick={() => setSelectedRequest(item)} className="w-full text-left rounded-2xl border border-gray-100 p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-gray-900">Order #{item.id}</p>
                      <p className="text-sm text-gray-500">{formatDate(item.created_at)}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
                        item.status === 'delivered'
                          ? 'bg-green-50 text-green-700'
                          : item.status === 'pending'
                          ? 'bg-amber-50 text-amber-700'
                          : item.status === 'processing'
                          ? 'bg-blue-50 text-blue-700'
                          : item.status === 'shipped'
                          ? 'bg-purple-50 text-purple-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-gray-700">
                    Amount: <span className="font-semibold text-green-700">{formatCurrency(item.total_amount)}</span>
                  </p>
                </button>
              ))}
              {detailConfig.items.length === 0 && <p className="text-gray-500">No request status available for this view.</p>}
            </div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {selectedRequest && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div initial={{ y: 24, opacity: 0, scale: 0.98 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 24, opacity: 0, scale: 0.98 }} className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Order #{selectedRequest.id} Status</h2>
                  <p className="text-gray-600">{formatDate(selectedRequest.created_at)}</p>
                </div>
                <button onClick={() => setSelectedRequest(null)} className="p-2 rounded-xl hover:bg-gray-100">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="rounded-2xl border border-gray-200 p-5 mb-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">Current Status</p>
                    <p className="text-lg font-semibold text-gray-900 capitalize">{selectedRequest.status}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Amount</p>
                    <p className="text-lg font-semibold text-green-700">{formatCurrency(selectedRequest.total_amount)}</p>
                  </div>
                </div>
              </div>

              {selectedRequest.status === 'cancelled' ? (
                <div className="rounded-2xl bg-red-50 border border-red-200 p-5">
                  <p className="font-semibold text-red-700 mb-2">Order Cancelled</p>
                  <p className="text-sm text-red-600">This request was cancelled before it reached delivery.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {getProgressSteps(selectedRequest.status).map((step, index, array) => (
                    <div key={step.key} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step.done ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                          {step.done ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-4 h-4" />}
                        </div>
                        {index < array.length - 1 && (
                          <div className={`w-0.5 h-10 ${step.done ? 'bg-green-600' : 'bg-gray-200'}`} />
                        )}
                      </div>
                      <div className="pt-0.5">
                        <p className={`font-semibold ${step.done ? 'text-gray-900' : 'text-gray-500'}`}>{step.label}</p>
                        <p className="text-sm text-gray-500">
                          {step.current ? 'Current stage of this earning request.' : step.done ? 'Completed successfully.' : 'Waiting to reach this stage.'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Earnings;
