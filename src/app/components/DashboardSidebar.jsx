import React from 'react';
import { useNavigate, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, Users, UserCheck, ShoppingCart, TrendingUp, 
  BarChart3, FileText, Settings, Package, Inbox, DollarSign,
  Heart, MessageSquare, ShoppingBag
} from 'lucide-react';

const DashboardSidebar = ({ isOpen, role }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const adminMenuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: UserCheck, label: 'Manage Farmers', path: '/admin/farmers' },
    { icon: ShoppingCart, label: 'Manage Buyers', path: '/admin/buyers' },
    { icon: TrendingUp, label: 'Transactions', path: '/admin/transactions' },
    { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
    { icon: FileText, label: 'Reports', path: '/admin/reports' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' }
  ];

  const farmerMenuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/farmer/dashboard' },
    { icon: Package, label: 'Manage Products', path: '/farmer/products' },
    { icon: ShoppingBag, label: 'Inventory', path: '/farmer/inventory' },
    { icon: ShoppingCart, label: 'Orders', path: '/farmer/orders' },
    { icon: MessageSquare, label: 'Messages', path: '/farmer/messages' },
    { icon: DollarSign, label: 'Earnings', path: '/farmer/earnings' },
    { icon: Settings, label: 'Profile', path: '/farmer/profile' }
  ];

  const buyerMenuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/buyer/dashboard' },
    { icon: ShoppingBag, label: 'Browse Products', path: '/buyer/browse' },
    { icon: ShoppingCart, label: 'Cart', path: '/buyer/cart' },
    { icon: Inbox, label: 'Orders', path: '/buyer/orders' },
    { icon: MessageSquare, label: 'Messages', path: '/buyer/messages' },
    { icon: Heart, label: 'Wishlist', path: '/buyer/wishlist' },
    { icon: Settings, label: 'Profile', path: '/buyer/profile' }
  ];

  const getMenuItems = () => {
    switch (role) {
      case 'admin': return adminMenuItems;
      case 'farmer': return farmerMenuItems;
      case 'buyer': return buyerMenuItems;
      default: return [];
    }
  };

  const menuItems = getMenuItems();
  const isActive = (path) => location.pathname === path;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          initial={{ x: -264, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -264, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 overflow-y-auto z-30 shadow-lg"
        >
          <nav className="p-4 space-y-2">
            {menuItems.map((item, index) => (
              <motion.button
                key={index}
                onClick={() => navigate(item.path)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                whileHover={{ 
                  x: 8, 
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.98 }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all relative overflow-hidden group ${
                  isActive(item.path)
                    ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {/* Active indicator */}
                {isActive(item.path) && (
                  <motion.div
                    layoutId="activeItem"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                
                {/* Icon with animation */}
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <item.icon className="w-5 h-5" />
                </motion.div>
                
                <span className="font-medium">{item.label}</span>
                
                {/* Hover gradient effect */}
                {!isActive(item.path) && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-green-50 to-green-100 opacity-0 group-hover:opacity-100 -z-10"
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.button>
            ))}
          </nav>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};

export default DashboardSidebar;
