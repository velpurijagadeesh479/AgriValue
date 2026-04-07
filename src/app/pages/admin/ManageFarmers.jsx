import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { UserCheck, Search, Plus, Pencil, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';
import EmptyState from '../../components/EmptyState';
import { apiRequest } from '../../lib/api';
import { formatDate } from '../../utils/formatters';

const initialForm = {
  name: '',
  email: '',
  phone: '',
  role: 'farmer',
  location: '',
  businessName: '',
  bio: '',
  address: '',
  password: 'Farmer@123'
};

const ManageFarmers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [farmers, setFarmers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState(initialForm);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const loadFarmers = async () => {
    const data = await apiRequest('/admin/users?role=farmer');
    setFarmers(data.users);
  };

  useEffect(() => {
    loadFarmers().catch(() => setFarmers([]));
  }, []);

  const filteredFarmers = useMemo(() => farmers.filter((farmer) => `${farmer.name} ${farmer.email}`.toLowerCase().includes(searchTerm.toLowerCase())), [farmers, searchTerm]);

  const openCreate = () => {
    setEditingUser(null);
    setFormData(initialForm);
    setIsFormOpen(true);
  };

  const openEdit = (farmer) => {
    setEditingUser(farmer);
    setFormData({
      name: farmer.name || '',
      email: farmer.email || '',
      phone: farmer.phone || '',
      role: 'farmer',
      location: farmer.location || '',
      businessName: farmer.business_name || '',
      bio: farmer.bio || '',
      address: farmer.address || '',
      password: 'Farmer@123'
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
        toast.success('Farmer updated successfully');
      } else {
        await apiRequest('/admin/users', {
          method: 'POST',
          body: JSON.stringify(formData)
        });
        toast.success('Farmer created successfully');
      }
      closeForm();
      loadFarmers();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteFarmer = async (id) => {
    try {
      await apiRequest(`/admin/users/${id}`, { method: 'DELETE' });
      toast.success('Farmer deleted successfully');
      loadFarmers();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="mb-8 flex justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Farmers</h1>
            <p className="text-gray-600">Monitor and manage farmer accounts and their listings</p>
          </div>
          <button onClick={openCreate} className="px-5 py-3 bg-green-600 text-white rounded-xl inline-flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Farmer
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" placeholder="Search farmers..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all outline-none" />
          </div>
        </div>

        {isFormOpen && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">{editingUser ? 'Edit Farmer' : 'Add Farmer'}</h2>
              <button onClick={closeForm} className="p-2 rounded-lg hover:bg-gray-100"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input name="name" value={formData.name} onChange={handleChange} className="px-4 py-3 rounded-xl border border-gray-300" placeholder="Full name" required />
                <input name="email" type="email" value={formData.email} onChange={handleChange} className="px-4 py-3 rounded-xl border border-gray-300" placeholder="Email" required />
                <input name="phone" value={formData.phone} onChange={handleChange} className="px-4 py-3 rounded-xl border border-gray-300" placeholder="Phone" />
                <input name="location" value={formData.location} onChange={handleChange} className="px-4 py-3 rounded-xl border border-gray-300" placeholder="Location" />
                <input name="businessName" value={formData.businessName} onChange={handleChange} className="px-4 py-3 rounded-xl border border-gray-300" placeholder="Farm name" />
                {!editingUser && <input name="password" value={formData.password} onChange={handleChange} className="px-4 py-3 rounded-xl border border-gray-300" placeholder="Temporary password" />}
              </div>
              <textarea name="bio" value={formData.bio} onChange={handleChange} rows={3} className="w-full px-4 py-3 rounded-xl border border-gray-300 resize-none" placeholder="Bio" />
              <textarea name="address" value={formData.address} onChange={handleChange} rows={3} className="w-full px-4 py-3 rounded-xl border border-gray-300 resize-none" placeholder="Address" />
              <div className="flex gap-3">
                <button type="submit" className="px-5 py-3 bg-green-600 text-white rounded-xl">{editingUser ? 'Update Farmer' : 'Create Farmer'}</button>
                <button type="button" onClick={closeForm} className="px-5 py-3 border border-gray-300 rounded-xl">Cancel</button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
          {filteredFarmers.length === 0 ? <EmptyState icon={UserCheck} title="No Farmers Registered" description="Farmer accounts and their product listings will be displayed here" /> : (
            <div className="space-y-4">
              {filteredFarmers.map((farmer) => (
                <div key={farmer.id} className="border border-gray-100 rounded-2xl p-5 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                  <div>
                    <p className="font-semibold text-gray-900">{farmer.name}</p>
                    <p className="text-sm text-gray-600">{farmer.email}</p>
                    <p className="text-sm text-gray-500">{farmer.business_name || farmer.location}</p>
                    <p className="text-xs text-gray-400">{formatDate(farmer.created_at)}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(farmer)} className="px-4 py-2 rounded-xl border border-gray-300 inline-flex items-center gap-2"><Pencil className="w-4 h-4" />Edit</button>
                    <button onClick={() => deleteFarmer(farmer.id)} className="px-4 py-2 rounded-xl border border-red-200 text-red-600 inline-flex items-center gap-2"><Trash2 className="w-4 h-4" />Delete</button>
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

export default ManageFarmers;
