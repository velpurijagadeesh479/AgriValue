import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Upload, Save, X } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';
import { apiRequest } from '../../lib/api';

const AddProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    price: '',
    quantity: '',
    unit: 'kg',
    location: ''
  });
  const [images, setImages] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleFiles = (files) => {
    const validFiles = Array.from(files).filter((file) => file.type.startsWith('image/') && file.size <= 10 * 1024 * 1024);
    const nextImages = validFiles.map((file) => ({ file, preview: URL.createObjectURL(file), name: file.name }));
    setImages((prev) => [...prev, ...nextImages].slice(0, 5));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const removeImage = (index) => setImages((prev) => prev.filter((_, currentIndex) => currentIndex !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => payload.append(key, value));
      images.forEach((image) => payload.append('images', image.file));
      await apiRequest('/products', { method: 'POST', body: payload });
      toast.success('Product added successfully');
      navigate('/farmer/products');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Product</h1>
        <p className="text-gray-600 mb-8">List a new product on the marketplace</p>
        <div className="max-w-4xl bg-white rounded-2xl border border-gray-200 shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Images</label>
              <input type="file" id="file-upload" accept="image/*" multiple onChange={(e) => handleFiles(e.target.files)} className="hidden" />
              <label htmlFor="file-upload" onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop} className={`block border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${dragActive ? 'border-green-600 bg-green-50' : 'border-gray-300 hover:border-green-600 hover:bg-green-50'}`}>
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
              <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-gray-300" placeholder="Product Name" />
              <select name="category" value={formData.category} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-gray-300">
                <option value="">Select Category</option>
                <option value="vegetables">Vegetables</option>
                <option value="fruits">Fruits</option>
                <option value="grains">Grains</option>
                <option value="dairy">Dairy</option>
                <option value="other">Other</option>
              </select>
            </div>
            <textarea name="description" value={formData.description} onChange={handleChange} required rows={4} className="w-full px-4 py-3 rounded-xl border border-gray-300 resize-none" placeholder="Describe your product..." />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <input type="number" name="price" value={formData.price} onChange={handleChange} required step="0.01" className="w-full px-4 py-3 rounded-xl border border-gray-300" placeholder="Price" />
              <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-gray-300" placeholder="Quantity" />
              <select name="unit" value={formData.unit} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-gray-300">
                <option value="kg">Kilograms (kg)</option>
                <option value="quintal">Quintal</option>
                <option value="ton">Ton</option>
                <option value="units">Units</option>
                <option value="dozens">Dozens</option>
              </select>
            </div>
            <input type="text" name="location" value={formData.location} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-gray-300" placeholder="Harvest Location" />
            <div className="flex space-x-4">
              <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all shadow-lg font-semibold">
                <Save className="w-5 h-5" />
                <span>{saving ? 'Saving...' : 'Add Product'}</span>
              </motion.button>
              <motion.button type="button" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => navigate('/farmer/products')} className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold">
                Cancel
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default AddProduct;
