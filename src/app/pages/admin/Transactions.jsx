import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Search } from 'lucide-react';
import EmptyState from '../../components/EmptyState';
import { apiRequest } from '../../lib/api';
import { formatCurrency, formatDate } from '../../utils/formatters';

const Transactions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  useEffect(() => {
    apiRequest('/admin/transactions').then((data) => setTransactions(data.transactions)).catch(() => setTransactions([]));
  }, []);

  const filtered = useMemo(
    () => transactions.filter((transaction) => `${transaction.id} ${transaction.buyer_name} ${transaction.farmer_name}`.toLowerCase().includes(searchTerm.toLowerCase())),
    [transactions, searchTerm]
  );

  const loadDetail = async (id) => {
    const data = await apiRequest(`/admin/transactions/${id}`);
    setSelectedTransaction(data);
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Transaction Monitoring</h1>
            <p className="text-gray-600">Track all platform transactions and payments</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" placeholder="Search transactions..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all outline-none" />
          </div>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
          <div className="xl:col-span-3 bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
            {filtered.length === 0 ? (
              <EmptyState icon={TrendingUp} title="No Transactions Found" description="All platform transactions will be tracked and displayed here" />
            ) : (
              <div className="space-y-4">
                {filtered.map((transaction) => (
                  <button
                    key={transaction.id}
                    onClick={() => loadDetail(transaction.id)}
                    className={`w-full text-left border rounded-2xl p-5 flex justify-between items-center gap-4 ${selectedTransaction?.transaction?.id === transaction.id ? 'border-green-600 bg-green-50' : 'border-gray-100'}`}
                  >
                    <div>
                      <p className="font-semibold text-gray-900">Order #{transaction.id}</p>
                      <p className="text-sm text-gray-600">{transaction.buyer_name} to {transaction.farmer_name}</p>
                      <p className="text-xs text-gray-500">{formatDate(transaction.created_at)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-700">{formatCurrency(transaction.total_amount)}</p>
                      <p className="text-sm text-gray-600 capitalize">{transaction.status}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
            {!selectedTransaction ? (
              <p className="text-gray-500">Click any transaction to see full details.</p>
            ) : (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Transaction Details</h2>
                  <p className="text-sm text-gray-600">Order #{selectedTransaction.transaction.id}</p>
                </div>
                <div className="space-y-2 text-sm text-gray-700">
                  <p><span className="font-semibold">Buyer:</span> {selectedTransaction.transaction.buyer_name}</p>
                  <p><span className="font-semibold">Buyer Email:</span> {selectedTransaction.transaction.buyer_email}</p>
                  <p><span className="font-semibold">Farmer:</span> {selectedTransaction.transaction.farmer_name}</p>
                  <p><span className="font-semibold">Farmer Email:</span> {selectedTransaction.transaction.farmer_email}</p>
                  <p><span className="font-semibold">Amount:</span> {formatCurrency(selectedTransaction.transaction.total_amount)}</p>
                  <p><span className="font-semibold">Status:</span> <span className="capitalize">{selectedTransaction.transaction.status}</span></p>
                  <p><span className="font-semibold">Shipping:</span> {selectedTransaction.transaction.shipping_address || '-'}</p>
                  <p><span className="font-semibold">Created:</span> {formatDate(selectedTransaction.transaction.created_at)}</p>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-3">Items</h3>
                  <div className="space-y-3">
                    {selectedTransaction.items.map((item) => (
                      <div key={item.id} className="border border-gray-100 rounded-xl p-3">
                        <p className="font-medium text-gray-900">{item.product_name}</p>
                        <p className="text-sm text-gray-600">{item.quantity} {item.unit} x {formatCurrency(item.unit_price)}</p>
                        <p className="text-sm font-semibold text-green-700">{formatCurrency(item.total_price)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Transactions;
