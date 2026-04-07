import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Package, Search, Plus, Trash2, Pencil } from 'lucide-react';
import { toast } from 'sonner';
import EmptyState from '../../components/EmptyState';
import { apiRequest } from '../../lib/api';
import { formatCurrency } from '../../utils/formatters';
import ProductFormModal from '../../components/ProductFormModal';

const ManageProducts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [saving, setSaving] = useState(false);

  const loadProducts = async () => {
    const data = await apiRequest('/products/farmer/mine/list');
    setProducts(data.products);
  };

  useEffect(() => {
    loadProducts().catch(() => setProducts([]));
  }, []);

  const filteredProducts = useMemo(() => products.filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase())), [products, searchTerm]);

  const removeProduct = async (id) => {
    await apiRequest(`/products/${id}`, { method: 'DELETE' });
    toast.success('Product removed successfully');
    loadProducts();
  };

  const openCreate = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const openEdit = (product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  const handleSubmit = async ({ formData, images }) => {
    setSaving(true);
    try {
      if (editingProduct) {
        await apiRequest(`/products/${editingProduct.id}`, {
          method: 'PUT',
          body: JSON.stringify({
            ...formData,
            isActive: true
          })
        });
        toast.success('Product updated successfully');
      } else {
        const payload = new FormData();
        Object.entries(formData).forEach(([key, value]) => payload.append(key, value));
        images.filter((image) => image.file).forEach((image) => payload.append('images', image.file));
        await apiRequest('/products', { method: 'POST', body: payload });
        toast.success('Product added successfully');
      }
      setModalOpen(false);
      setEditingProduct(null);
      loadProducts();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Products</h1>
            <p className="text-gray-600">View and manage your product listings</p>
          </div>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={openCreate} className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all shadow-lg">
            <Plus className="w-5 h-5" />
            <span>Add Product</span>
          </motion.button>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" placeholder="Search products..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all outline-none" />
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
          {filteredProducts.length === 0 ? <EmptyState icon={Package} title="No Products Listed" description="Start by adding your first product to the marketplace" action={openCreate} actionLabel="Add Product" /> : (
            <div className="space-y-4">
              {filteredProducts.map((product) => (
                <div key={product.id} className="flex flex-col md:flex-row md:items-center gap-4 border border-gray-100 rounded-2xl p-4">
                  <img src={product.imageUrls?.[0] || 'https://placehold.co/160x160?text=Agri'} alt={product.name} className="w-24 h-24 rounded-xl object-cover" />
                  <div className="flex-1">
                    <h2 className="text-lg font-bold text-gray-900">{product.name}</h2>
                    <p className="text-sm text-gray-600 capitalize">{product.category}</p>
                    <p className="text-sm text-gray-600">{product.quantity} {product.unit} available</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-700">{formatCurrency(product.price)}</p>
                    <div className="mt-3 flex gap-3 justify-end">
                      <button onClick={() => openEdit(product)} className="inline-flex items-center gap-2 text-blue-600"><Pencil className="w-4 h-4" />Edit</button>
                      <button onClick={() => removeProduct(product.id)} className="inline-flex items-center gap-2 text-red-600"><Trash2 className="w-4 h-4" />Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
      <ProductFormModal open={modalOpen} onClose={() => { setModalOpen(false); setEditingProduct(null); }} onSubmit={handleSubmit} initialProduct={editingProduct} saving={saving} />
    </div>
  );
};

export default ManageProducts;
