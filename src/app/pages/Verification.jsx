import React from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Shield, ArrowLeft } from 'lucide-react';

const Verification = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-amber-50 flex items-center justify-center px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-md w-full">
        <button onClick={() => navigate('/login')} className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Login</span>
        </button>
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center">
              <Shield className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Verification Removed</h1>
          <p className="text-gray-600 mb-6">
            Your project now uses direct backend authentication with MySQL-backed accounts, so this old captcha step is no longer required.
          </p>
          <button onClick={() => navigate('/login')} className="w-full px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all shadow-lg font-semibold">
            Continue to Login
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Verification;
