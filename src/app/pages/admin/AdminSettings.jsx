import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Save, Bell, Shield, Globe } from 'lucide-react';
import { toast } from 'sonner';
import { apiRequest } from '../../lib/api';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    siteName: 'AgriValue',
    email: 'admin@agrivalue.com',
    notifications: true,
    emailNotifications: true,
    maintenanceMode: false,
    autoApprove: false
  });

  useEffect(() => {
    apiRequest('/admin/settings')
      .then((data) => {
        const current = data.settings;
        setSettings({
          siteName: current.site_name,
          email: current.admin_email,
          notifications: Boolean(current.notifications),
          emailNotifications: Boolean(current.email_notifications),
          maintenanceMode: Boolean(current.maintenance_mode),
          autoApprove: Boolean(current.auto_approve)
        });
      })
      .catch(() => {});
  }, []);

  const handleChange = (key, value) => setSettings({ ...settings, [key]: value });

  const handleSave = async () => {
    try {
      await apiRequest('/admin/settings', {
        method: 'PUT',
        body: JSON.stringify(settings)
      });
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
            <p className="text-gray-600">Manage platform configuration and preferences</p>
          </div>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleSave} className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all shadow-lg">
            <Save className="w-5 h-5" />
            <span>Save Changes</span>
          </motion.button>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">General Settings</h2>
            </div>
            <div className="space-y-4">
              <input type="text" value={settings.siteName} onChange={(e) => handleChange('siteName', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-300" />
              <input type="email" value={settings.email} onChange={(e) => handleChange('email', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-300" />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
            </div>
            <div className="space-y-4">
              {[
                ['notifications', 'Push Notifications', 'Receive push notifications for important events'],
                ['emailNotifications', 'Email Notifications', 'Receive email updates and alerts']
              ].map(([key, title, description]) => (
                <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-medium text-gray-900">{title}</p>
                    <p className="text-sm text-gray-600">{description}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={settings[key]} onChange={(e) => handleChange(key, e.target.checked)} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-700 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Security & Access</h2>
            </div>
            <div className="space-y-4">
              {[
                ['maintenanceMode', 'Maintenance Mode', 'Temporarily disable platform access for maintenance'],
                ['autoApprove', 'Auto-Approve Listings', 'Automatically approve new product listings']
              ].map(([key, title, description]) => (
                <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-medium text-gray-900">{title}</p>
                    <p className="text-sm text-gray-600">{description}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={settings[key]} onChange={(e) => handleChange(key, e.target.checked)} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminSettings;
