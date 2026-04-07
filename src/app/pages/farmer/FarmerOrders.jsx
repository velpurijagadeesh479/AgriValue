import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, Search, X } from 'lucide-react';
import EmptyState from '../../components/EmptyState';
import { apiRequest } from '../../lib/api';
import { formatCurrency, formatDate } from '../../utils/formatters';

const FarmerOrders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    apiRequest('/farmer/orders').then((data) => setOrders(data.orders)).catch(() => setOrders([]));
  }, []);

  const filteredOrders = useMemo(() => orders.filter((order) => {
    const matchesSearch = `${order.id} ${order.buyer_name}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  }), [orders, searchTerm, statusFilter]);

  const openOrder = async (id) => {
    const data = await apiRequest(`/farmer/orders/${id}`);
    setSelectedOrder(data);
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Orders Received</h1>
        <p className="text-gray-600 mb-8">Manage incoming orders from buyers</p>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" placeholder="Search orders..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all outline-none" />
            </div>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all outline-none">
              <option value="all">All Orders</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
          {filteredOrders.length === 0 ? <EmptyState icon={ShoppingCart} title="No Orders Yet" description="Orders from buyers will appear here" /> : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <button key={order.id} onClick={() => openOrder(order.id)} className="w-full text-left border border-gray-100 rounded-2xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:bg-gray-50">
                  <div>
                    <p className="text-lg font-bold text-gray-900">Order #{order.id}</p>
                    <p className="text-gray-600">Buyer: {order.buyer_business_name || order.buyer_name}</p>
                    <p className="text-sm text-gray-500">{formatDate(order.created_at)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-700">{formatCurrency(order.total_amount)}</p>
                    <span className="inline-block mt-2 px-3 py-1 rounded-full bg-green-50 text-green-700 text-sm capitalize">{order.status}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      <AnimatePresence>
        {selectedOrder && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 24, opacity: 0 }} className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Order #{selectedOrder.order.id}</h2>
                  <p className="text-gray-600">{formatDate(selectedOrder.order.created_at)}</p>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="p-2 rounded-xl hover:bg-gray-100"><X className="w-5 h-5" /></button>
              </div>
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="rounded-2xl border border-gray-200 p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Buyer Details</h3>
                  <p>{selectedOrder.order.buyer_business_name || selectedOrder.order.buyer_name}</p>
                  <p className="text-sm text-gray-600">{selectedOrder.order.buyer_email}</p>
                  <p className="text-sm text-gray-600">{selectedOrder.order.buyer_phone || '-'}</p>
                </div>
                <div className="rounded-2xl border border-gray-200 p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Order Status</h3>
                  <p className="capitalize">{selectedOrder.order.status}</p>
                  <p className="text-sm text-gray-600 mt-2">Shipping: {selectedOrder.order.shipping_address || '-'}</p>
                  <p className="text-sm font-semibold text-green-700 mt-2">{formatCurrency(selectedOrder.order.total_amount)}</p>
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">Items</h3>
                {selectedOrder.items.map((item) => (
                  <div key={item.id} className="rounded-2xl border border-gray-100 p-4 flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-900">{item.product_name}</p>
                      <p className="text-sm text-gray-600">{item.quantity} {item.unit} x {formatCurrency(item.unit_price)}</p>
                    </div>
                    <p className="font-semibold text-green-700">{formatCurrency(item.total_price)}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FarmerOrders;
