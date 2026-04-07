import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, Save, X } from 'lucide-react';

const emptyForm = {
  name: '',
  category: '',
  description: '',
  price: '',
  quantity: '',
  unit: 'kg',
  location: ''
};

const ProductFormModal = ({ open, onClose, onSubmit, initialProduct, saving }) => {
  const [formData, setFormData] = useState(emptyForm);
  const [images, setImages] = useState([]);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    if (initialProduct) {
      setFormData({
        name: initialProduct.name || '',
        category: initialProduct.category || '',
        description: initialProduct.description || '',
        price: initialProduct.price || '',
        quantity: initialProduct.quantity || '',
        unit: initialProduct.unit || 'kg',
        location: initialProduct.location || ''
      });
      setImages((initialProduct.imageUrls || []).map((url, index) => ({ preview: url, name: `existing-${index}`, existing: true })));
    } else {
      setFormData(emptyForm);
      setImages([]);
    }
  }, [initialProduct, open]);

  const handleFiles = (files) => {
    const validFiles = Array.from(files).filter((file) => file.type.startsWith('image/') && file.size <= 10 * 1024 * 1024);
    const next = validFiles.map((file) => ({ file, preview: URL.createObjectURL(file), name: file.name }));
    setImages((prev) => [...prev.filter((item) => item.existing), ...next].slice(0, 5));
  };

  const removeImage = (index) => setImages((prev) => prev.filter((_, currentIndex) => currentIndex !== index));

  const submit = (e) => {
    e.preventDefault();
    onSubmit({ formData, images });
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div initial={{ y: 24, opacity: 0, scale: 0.96 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 24, opacity: 0, scale: 0.96 }} className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{initialProduct ? 'Edit Product' : 'Add New Product'}</h2>
                <p className="text-gray-600 text-sm">Manage your marketplace listing without leaving the page.</p>
              </div>
              <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={submit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Images</label>
                <input type="file" id="product-file-upload" accept="image/*" multiple onChange={(e) => handleFiles(e.target.files)} className="hidden" />
                <label
                  htmlFor="product-file-upload"
                  onDragEnter={(e) => { e.preventDefault(); setDragActive(true); }}
                  onDragLeave={(e) => { e.preventDefault(); setDragActive(false); }}
                  onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                  onDrop={(e) => { e.preventDefault(); setDragActive(false); handleFiles(e.dataTransfer.files); }}
                  className={`block border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${dragActive ? 'border-green-600 bg-green-50' : 'border-gray-300 hover:border-green-600 hover:bg-green-50'}`}
                >
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
                  <p className="text-sm text-gray-500">PNG, JPG up to 10MB, max 5 images</p>
                </label>
                {images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    {images.map((image, index) => (
                      <div key={`${image.name}-${index}`} className="relative group">
                        <img src={image.preview} alt={`Preview ${index + 1}`} className="w-full h-32 object-cover rounded-lg border border-gray-200" />
                        <button type="button" onClick={() => removeImage(index)} className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input type="text" name="name" value={formData.name} onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })} required className="w-full px-4 py-3 rounded-xl border border-gray-300" placeholder="Product Name" />
                <select name="category" value={formData.category} onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })} required className="w-full px-4 py-3 rounded-xl border border-gray-300">
                  <option value="">Select Category</option>
                  <option value="vegetables">Vegetables</option>
                  <option value="fruits">Fruits</option>
                  <option value="grains">Grains</option>
                  <option value="dairy">Dairy</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <textarea name="description" value={formData.description} onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })} required rows={4} className="w-full px-4 py-3 rounded-xl border border-gray-300 resize-none" placeholder="Describe your product..." />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <input type="number" name="price" value={formData.price} onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })} required step="0.01" className="w-full px-4 py-3 rounded-xl border border-gray-300" placeholder="Price" />
                <input type="number" name="quantity" value={formData.quantity} onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })} required className="w-full px-4 py-3 rounded-xl border border-gray-300" placeholder="Quantity" />
                <select name="unit" value={formData.unit} onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })} required className="w-full px-4 py-3 rounded-xl border border-gray-300">
                  <option value="kg">Kilograms (kg)</option>
                  <option value="quintal">Quintal</option>
                  <option value="ton">Ton</option>
                  <option value="units">Units</option>
                  <option value="dozens">Dozens</option>
                </select>
              </div>
              <input type="text" name="location" value={formData.location} onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })} required className="w-full px-4 py-3 rounded-xl border border-gray-300" placeholder="Harvest Location" />
              <div className="flex space-x-4">
                <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all shadow-lg font-semibold">
                  <Save className="w-5 h-5" />
                  <span>{saving ? 'Saving...' : initialProduct ? 'Update Product' : 'Add Product'}</span>
                </motion.button>
                <button type="button" onClick={onClose} className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold">Cancel</button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProductFormModal;
