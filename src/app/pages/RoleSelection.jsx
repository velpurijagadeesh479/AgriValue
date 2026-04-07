import React from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Sprout, ShoppingBag } from 'lucide-react';

const RoleSelection = () => {
  const navigate = useNavigate();

  const roles = [
    {
      id: 'farmer',
      icon: Sprout,
      title: 'Farmer',
      description: 'List your agricultural products and connect with global buyers',
      gradient: 'from-green-500 to-green-700',
      hoverGradient: 'from-green-600 to-green-800'
    },
    {
      id: 'buyer',
      icon: ShoppingBag,
      title: 'Buyer',
      description: 'Browse quality agricultural products and connect with farmers',
      gradient: 'from-amber-500 to-amber-700',
      hoverGradient: 'from-amber-600 to-amber-800'
    }
  ];

  const handleRoleSelect = (roleId) => {
    localStorage.setItem('selectedRole', roleId);
    navigate('/signup');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-amber-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-6xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Join <span className="bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">AgriValue</span>
          </h1>
          <p className="text-xl text-gray-600">
            Select your role to get started
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {roles.map((role, index) => (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              onClick={() => handleRoleSelect(role.id)}
              className="cursor-pointer bg-white rounded-2xl border-2 border-gray-200 shadow-lg hover:shadow-2xl transition-all p-8 group"
            >
              <div className={`w-20 h-20 bg-gradient-to-br ${role.gradient} rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:${role.hoverGradient} transition-all`}>
                <role.icon className="w-10 h-10 text-white" />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">
                {role.title}
              </h3>
              
              <p className="text-gray-600 text-center leading-relaxed">
                {role.description}
              </p>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-full mt-6 px-6 py-3 bg-gradient-to-r ${role.gradient} text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all`}
              >
                Continue as {role.title}
              </motion.button>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-8"
        >
          <p className="text-gray-600">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-green-600 hover:text-green-700 font-semibold"
            >
              Sign In
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default RoleSelection;