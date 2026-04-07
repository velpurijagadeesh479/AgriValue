import { createBrowserRouter, Navigate } from 'react-router';

// Public Pages
import Landing from './pages/Landing';
import About from './pages/About';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import ProductDetail from './pages/ProductDetail';

// Auth Pages
import RoleSelection from './pages/RoleSelection';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Verification from './pages/Verification';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageFarmers from './pages/admin/ManageFarmers';
import ManageBuyers from './pages/admin/ManageBuyers';
import Transactions from './pages/admin/Transactions';
import Analytics from './pages/admin/Analytics';
import Reports from './pages/admin/Reports';
import AdminSettings from './pages/admin/AdminSettings';
import ReportDetail from './pages/admin/ReportDetail';
import AdminProfile from './pages/admin/AdminProfile';

// Farmer Pages
import FarmerDashboard from './pages/farmer/FarmerDashboard';
import AddProduct from './pages/farmer/AddProduct';
import ManageProducts from './pages/farmer/ManageProducts';
import Inventory from './pages/farmer/Inventory';
import FarmerOrders from './pages/farmer/FarmerOrders';
import FarmerMessages from './pages/farmer/FarmerMessages';
import Earnings from './pages/farmer/Earnings';
import FarmerProfile from './pages/farmer/FarmerProfile';

// Buyer Pages
import BuyerDashboard from './pages/buyer/BuyerDashboard';
import BrowseProducts from './pages/buyer/BrowseProducts';
import Cart from './pages/buyer/Cart';
import BuyerOrders from './pages/buyer/BuyerOrders';
import BuyerMessages from './pages/buyer/BuyerMessages';
import Wishlist from './pages/buyer/Wishlist';
import BuyerProfile from './pages/buyer/BuyerProfile';

// Protected Route Component
import { isAuthenticated, getUserRole } from './utils/auth';

const ProtectedRoute = ({ children, allowedRoles }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  const userRole = getUserRole();
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export const router = createBrowserRouter([
  // Public Routes
  {
    path: '/',
    element: <Landing />
  },
  {
    path: '/about',
    element: <About />
  },
  {
    path: '/contact',
    element: <Contact />
  },
  {
    path: '/faq',
    element: <FAQ />
  },
  {
    path: '/privacy',
    element: <Privacy />
  },
  {
    path: '/terms',
    element: <Terms />
  },
  {
    path: '/product/:id',
    element: <ProductDetail />
  },

  // Auth Routes
  {
    path: '/role-selection',
    element: <RoleSelection />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/signup',
    element: <SignUp />
  },
  {
    path: '/verification',
    element: <Verification />
  },

  // Admin Routes
  {
    path: '/admin',
    element: (
      <ProtectedRoute allowedRoles={['admin']}>
        <DashboardLayout role="admin" />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/admin/dashboard" replace />
      },
      {
        path: 'dashboard',
        element: <AdminDashboard />
      },
      {
        path: 'farmers',
        element: <ManageFarmers />
      },
      {
        path: 'buyers',
        element: <ManageBuyers />
      },
      {
        path: 'transactions',
        element: <Transactions />
      },
      {
        path: 'analytics',
        element: <Analytics />
      },
      {
        path: 'reports',
        element: <Reports />
      },
      {
        path: 'reports/:type',
        element: <ReportDetail />
      },
      {
        path: 'settings',
        element: <AdminSettings />
      },
      {
        path: 'profile',
        element: <AdminProfile />
      }
    ]
  },

  // Farmer Routes
  {
    path: '/farmer',
    element: (
      <ProtectedRoute allowedRoles={['farmer']}>
        <DashboardLayout role="farmer" />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/farmer/dashboard" replace />
      },
      {
        path: 'dashboard',
        element: <FarmerDashboard />
      },
      {
        path: 'add-product',
        element: <AddProduct />
      },
      {
        path: 'products',
        element: <ManageProducts />
      },
      {
        path: 'inventory',
        element: <Inventory />
      },
      {
        path: 'orders',
        element: <FarmerOrders />
      },
      {
        path: 'messages',
        element: <FarmerMessages />
      },
      {
        path: 'earnings',
        element: <Earnings />
      },
      {
        path: 'profile',
        element: <FarmerProfile />
      }
    ]
  },

  // Buyer Routes
  {
    path: '/buyer',
    element: (
      <ProtectedRoute allowedRoles={['buyer']}>
        <DashboardLayout role="buyer" />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/buyer/dashboard" replace />
      },
      {
        path: 'dashboard',
        element: <BuyerDashboard />
      },
      {
        path: 'browse',
        element: <BrowseProducts />
      },
      {
        path: 'cart',
        element: <Cart />
      },
      {
        path: 'orders',
        element: <BuyerOrders />
      },
      {
        path: 'messages',
        element: <BuyerMessages />
      },
      {
        path: 'wishlist',
        element: <Wishlist />
      },
      {
        path: 'profile',
        element: <BuyerProfile />
      }
    ]
  },

  // 404 Route
  {
    path: '*',
    element: <Navigate to="/" replace />
  }
]);
