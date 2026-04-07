import React from 'react';
import { motion } from 'motion/react';

const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  action, 
  actionLabel 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.2, duration: 0.6, type: "spring", stiffness: 150 }}
        whileHover={{ scale: 1.1, rotate: 5 }}
        className="w-24 h-24 rounded-full bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center mb-6 shadow-lg relative overflow-hidden group"
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-green-100 to-green-200 opacity-0 group-hover:opacity-100"
          transition={{ duration: 0.3 }}
        />
        {Icon && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
          >
            <Icon className="w-12 h-12 text-green-600 relative z-10" />
          </motion.div>
        )}
      </motion.div>
      
      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-xl font-semibold text-gray-900 mb-2"
      >
        {title}
      </motion.h3>
      
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="text-gray-600 text-center max-w-md mb-6"
      >
        {description}
      </motion.p>
      
      {action && actionLabel && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          onClick={action}
          whileHover={{ 
            scale: 1.05, 
            y: -2,
            boxShadow: "0 10px 25px -5px rgba(22, 163, 74, 0.4)",
            transition: { duration: 0.2 }
          }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg shadow-md relative overflow-hidden group"
        >
          <span className="relative z-10">{actionLabel}</span>
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-green-700 to-green-800 opacity-0 group-hover:opacity-100"
            transition={{ duration: 0.3 }}
          />
        </motion.button>
      )}
    </motion.div>
  );
};

export default EmptyState;