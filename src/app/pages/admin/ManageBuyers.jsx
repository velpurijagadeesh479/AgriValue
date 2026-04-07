import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ShoppingCart, Search, Plus, Pencil, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';
import EmptyState from '../../components/EmptyState';
import { apiRequest } from '../../lib/api';
import { formatDate } from '../../utils/formatters';

const initialForm = {
  name: '',
  email: '',
  phone: '',
  role: 'buyer',
  location: '',
  businessName: '',
  bio: '',
  address: '',
  password: 'Buyer@123'
};

const ManageBuyers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [buyers, setBuyers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState(initialForm);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const loadBuyers = async () => {
    const data = await apiRequest('/admin/users?role=buyer');
    setBuyers(data.users);
  };

  useEffect(() => {
    loadBuyers().catch(() => setBuyers([]));
  }, []);

  const filteredBuyers = useMemo(() => buyers.filter((buyer) => `${buyer.name} ${buyer.email}`.toLowerCase().includes(searchTerm.toLowerCase())), [buyers, searchTerm]);

  const openCreate = () => {
    setEditingUser(null);
    setFormData(initialForm);
    setIsFormOpen(true);
  };

  const openEdit = (buyer) => {
    setEditingUser(buyer);
    setFormData({
      name: buyer.name || '',
      email: buyer.email || '',
      phone: buyer.phone || '',
      role: 'buyer',
      location: buyer.location || '',
      businessName: buyer.business_name || '',
      bio: buyer.bio || '',
      address: buyer.address || '',
      password: 'Buyer@123'
    });
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingUser(null);
    setFormData(initialForm);
  };

  const handleChange = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await apiRequest(`/admin/users/${editingUser.id}`, {
          method: 'PUT',
          body: JSON.stringify(formData)
        });
        toast.success('Buyer updated successfully');
      } else {
        await apiRequest('/admin/users', {
          method: 'POST',
          body: JSON.stringify(formData)
        });
        toast.success('Buyer created successfully');
      }
      closeForm();
      loadBuyers();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteBuyer = async (id) => {
    try {
      await apiRequest(`/admin/users/${id}`, { method: 'DELETE' });
      toast.success('Buyer deleted successfully');
      loadBuyers();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="mb-8 flex justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Buyers</h1>
            <p className="text-gray-600">Monitor buyer accounts and their purchase activity</p>
          </div>
          <button onClick={openCreate} className="px-5 py-3 bg-green-600 text-white rounded-xl inline-flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Buyer
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" placeholder="Search buyers..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all outline-none" />
          </div>
        </div>

        {isFormOpen && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">{editingUser ? 'Edit Buyer' : 'Add Buyer'}</h2>
              <button onClick={closeForm} className="p-2 rounded-lg hover:bg-gray-100"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input name="name" value={formData.name} onChange={handleChange} className="px-4 py-3 rounded-xl border border-gray-300" placeholder="Full name" required />
                <input name="email" type="email" value={formData.email} onChange={handleChange} className="px-4 py-3 rounded-xl border border-gray-300" placeholder="Email" required />
                <input name="phone" value={formData.phone} onChange={handleChange} className="px-4 py-3 rounded-xl border border-gray-300" placeholder="Phone" />
                <input name="location" value={formData.location} onChange={handleChange} className="px-4 py-3 rounded-xl border border-gray-300" placeholder="Location" />
                <input name="businessName" value={formData.businessName} onChange={handleChange} className="px-4 py-3 rounded-xl border border-gray-300" placeholder="Business name" />
                {!editingUser && <input name="password" value={formData.password} onChange={handleChange} className="px-4 py-3 rounded-xl border border-gray-300" placeholder="Temporary password" />}
              </div>
              <textarea name="bio" value={formData.bio} onChange={handleChange} rows={3} className="w-full px-4 py-3 rounded-xl border border-gray-300 resize-none" placeholder="Bio" />
              <textarea name="address" value={formData.address} onChange={handleChange} rows={3} className="w-full px-4 py-3 rounded-xl border border-gray-300 resize-none" placeholder="Address" />
              <div className="flex gap-3">
                <button type="submit" className="px-5 py-3 bg-green-600 text-white rounded-xl">{editingUser ? 'Update Buyer' : 'Create Buyer'}</button>
                <button type="button" onClick={closeForm} className="px-5 py-3 border border-gray-300 rounded-xl">Cancel</button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
          {filteredBuyers.length === 0 ? <EmptyState icon={ShoppingCart} title="No Buyers Registered" description="Buyer accounts and their order history will be displayed here" /> : (
            <div className="space-y-4">
              {filteredBuyers.map((buyer) => (
                <div key={buyer.id} className="border border-gray-100 rounded-2xl p-5 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                  <div>
                    <p className="font-semibold text-gray-900">{buyer.name}</p>
                    <p className="text-sm text-gray-600">{buyer.email}</p>
                    <p className="text-sm text-gray-500">{buyer.business_name || buyer.location}</p>
                    <p className="text-xs text-gray-400">{formatDate(buyer.created_at)}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(buyer)} className="px-4 py-2 rounded-xl border border-gray-300 inline-flex items-center gap-2"><Pencil className="w-4 h-4" />Edit</button>
                    <button onClick={() => deleteBuyer(buyer.id)} className="px-4 py-2 rounded-xl border border-red-200 text-red-600 inline-flex items-center gap-2"><Trash2 className="w-4 h-4" />Delete</button>
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

export default ManageBuyers;
