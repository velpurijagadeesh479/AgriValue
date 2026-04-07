import React from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, Bell, User, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../lib/api';
import { formatDate } from '../utils/formatters';

const DashboardNavbar = ({ sidebarOpen, setSidebarOpen, role }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [notificationsOpen, setNotificationsOpen] = React.useState(false);
  const [notifications, setNotifications] = React.useState([]);
  const [unreadCount, setUnreadCount] = React.useState(0);

  const loadNotifications = React.useCallback(async () => {
    try {
      const data = await apiRequest('/notifications');
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, []);

  React.useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 15000);
    return () => clearInterval(interval);
  }, [loadNotifications]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getRoleLabel = () => {
    switch (role) {
      case 'admin': return 'Admin';
      case 'farmer': return 'Farmer';
      case 'buyer': return 'Buyer';
      default: return 'User';
    }
  };

  return (
    <motion.nav 
      initial={{ y: -64 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-lg border-b border-gray-200 z-40 shadow-sm"
    >
      <div className="h-full px-4 flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <motion.button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            whileHover={{ scale: 1.05, backgroundColor: "rgba(243, 244, 246, 1)" }}
            whileTap={{ scale: 0.95, rotate: 90 }}
            transition={{ duration: 0.2 }}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <motion.div
              animate={{ rotate: sidebarOpen ? 90 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <Menu className="w-6 h-6 text-gray-700" />
            </motion.div>
          </motion.button>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent cursor-pointer relative group"
            onClick={() => navigate('/')}
          >
            AgriValue
            <motion.div
              className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-green-600 to-green-800"
              initial={{ width: 0 }}
              whileHover={{ width: '100%' }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <motion.button
              onClick={() => {
                setNotificationsOpen(!notificationsOpen);
                setDropdownOpen(false);
              }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Bell className="w-6 h-6 text-gray-700" />
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500 }}
                  className="absolute -top-1 -right-1 min-w-5 h-5 px-1 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-semibold"
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </motion.span>
              )}
            </motion.button>

            <AnimatePresence>
              {notificationsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-[360px] bg-white rounded-2xl shadow-xl border border-gray-200 z-50 overflow-hidden"
                >
                  <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">Live Notifications</p>
                      <p className="text-xs text-gray-500">Updates refresh every 15 seconds</p>
                    </div>
                    <button onClick={loadNotifications} className="text-sm text-green-700 font-medium">Refresh</button>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-8 text-center text-gray-500">No live notifications right now.</div>
                    ) : (
                      notifications.map((item) => (
                        <div key={item.id} className="px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-medium text-gray-900">{item.title}</p>
                              <p className="text-sm text-gray-600 mt-1">{item.message}</p>
                            </div>
                            <span className="text-[10px] uppercase tracking-wide text-green-700 bg-green-50 px-2 py-1 rounded-full">
                              {item.type}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 mt-2">{formatDate(item.createdAt)}</p>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Menu */}
          <div className="relative">
            <motion.button
              onClick={() => {
                setDropdownOpen(!dropdownOpen);
                setNotificationsOpen(false);
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <motion.div 
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center text-white font-semibold shadow-lg"
              >
                {user?.name?.charAt(0) || 'U'}
              </motion.div>
              <div className="text-left hidden md:block">
                <div className="text-sm font-semibold text-gray-900">
                  {user?.name || 'User'}
                </div>
                <div className="text-xs text-gray-600">{getRoleLabel()}</div>
              </div>
              <motion.div
                animate={{ rotate: dropdownOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown className="w-4 h-4 text-gray-600" />
              </motion.div>
            </motion.button>

            {/* Dropdown */}
            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50 overflow-hidden"
                >
                  <motion.button
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate(`/${role}/profile`);
                    }}
                    whileHover={{ backgroundColor: "rgba(243, 244, 246, 1)", x: 4 }}
                    transition={{ duration: 0.2 }}
                    className="w-full px-4 py-2 text-left flex items-center space-x-3 transition-colors"
                  >
                    <User className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-700">Profile</span>
                  </motion.button>
                  <motion.button
                    onClick={() => {
                      setDropdownOpen(false);
                      handleLogout();
                    }}
                    whileHover={{ backgroundColor: "rgba(254, 242, 242, 1)", x: 4 }}
                    transition={{ duration: 0.2 }}
                    className="w-full px-4 py-2 text-left flex items-center space-x-3 transition-colors"
                  >
                    <LogOut className="w-4 h-4 text-red-600" />
                    <span className="text-sm text-red-600">Logout</span>
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default DashboardNavbar;
