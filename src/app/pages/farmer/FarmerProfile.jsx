import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Save } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';
import { apiRequest } from '../../lib/api';

const FarmerProfile = () => {
  const { user, login } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || '',
    businessName: user?.businessName || '',
    bio: user?.bio || '',
    address: user?.address || ''
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSave = async () => {
    try {
      const data = await apiRequest('/users/me', {
        method: 'PUT',
        body: JSON.stringify(formData)
      });
      login({ token: localStorage.getItem('authToken'), user: data.user });
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
            <p className="text-gray-600">Manage your account information</p>
          </div>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleSave} className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all shadow-lg">
            <Save className="w-5 h-5" />
            <span>Save Changes</span>
          </motion.button>
        </div>
        <div className="max-w-4xl bg-white rounded-2xl border border-gray-200 shadow-lg p-8">
          <div className="flex items-center space-x-6 mb-8 pb-8 border-b border-gray-200">
            <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center text-white text-3xl font-bold">{user?.name?.charAt(0) || 'U'}</div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
              <p className="text-gray-600">{user?.email}</p>
            </div>
          </div>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-300" placeholder="Full Name" />
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-300" placeholder="Email" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-300" placeholder="Phone" />
              <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-300" placeholder="Location" />
            </div>
            <input type="text" name="businessName" value={formData.businessName} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-300" placeholder="Farm Name" />
            <textarea name="bio" value={formData.bio} onChange={handleChange} rows={4} className="w-full px-4 py-3 rounded-xl border border-gray-300 resize-none" placeholder="Tell buyers about your farm..." />
            <textarea name="address" value={formData.address} onChange={handleChange} rows={3} className="w-full px-4 py-3 rounded-xl border border-gray-300 resize-none" placeholder="Farm address" />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FarmerProfile;
