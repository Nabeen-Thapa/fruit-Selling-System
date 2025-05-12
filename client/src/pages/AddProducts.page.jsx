import React, { useState, useRef } from 'react';
import { FiPlus, FiX, FiUpload, FiTrash2, FiImage, FiCheck } from 'react-icons/fi';

export const AddProducts = () => {
  const [product, setProduct] = useState({
    name: '',
    price: '',
    description: '',
    seller: '',
    phone: '',
    email: '',
    quantity: '',
    category: 'fruit',
    images: [],
  });

  const [products, setProducts] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const categories = ['fruit', 'berry', 'tropical'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleFiles = (files) => {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) return;

    const newImages = imageFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: Date.now() + Math.random()
    }));

    setProduct(prev => ({
      ...prev,
      images: [...prev.images, ...newImages]
    }));
  };

  const removeImage = (id) => {
    setProduct(prev => ({
      ...prev,
      images: prev.images.filter(img => img.id !== id)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newProduct = {
      ...product,
      id: Date.now(),
      price: parseFloat(product.price),
      quantity: parseInt(product.quantity),
      images: product.images.map(img => ({
        url: img.preview, // In a real app, you'd upload to a server
        alt: product.name
      }))
    };
    
    setProducts([...products, newProduct]);
    setShowSuccess(true);
    resetForm();
    
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const resetForm = () => {
    setProduct({
      name: '',
      price: '',
      description: '',
      seller: '',
      phone: '',
      email: '',
      quantity: '',
      category: 'fruit',
      images: [],
    });
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-green-700">
            Add New Product
          </h1>
          <p className="mt-2 text-sm text-gray-600 max-w-md mx-auto">
            Create a new listing for your fresh fruits with multiple high-quality images
          </p>
        </div>

        {/* Success Toast */}
        {showSuccess && (
          <div className="fixed top-4 right-4 z-50">
            <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center animate-fade-in">
              <FiCheck className="mr-2" />
              <span>Product added successfully!</span>
            </div>
          </div>
        )}

        <form 
          onSubmit={handleSubmit} 
          className="space-y-6 bg-white shadow-xl rounded-2xl p-6 sm:p-8 border border-gray-100"
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Product Name */}
              <div className="space-y-1">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Product Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={product.name}
                  onChange={handleChange}
                  required
                  className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  placeholder="e.g., Organic Apples"
                />
              </div>

              {/* Price and Quantity */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                    Price (USD) *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">RS.</span>
                    </div>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      min="0"
                      step="0.01"
                      value={product.price}
                      onChange={handleChange}
                      required
                      className="block w-full pl-8 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    min="0"
                    value={product.quantity}
                    onChange={handleChange}
                    required
                    className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  />
                </div>
              </div>

              {/* Seller */}
              <div className="space-y-1">
                <label htmlFor="seller" className="block text-sm font-medium text-gray-700">
                  Seller/Farm Name *
                </label>
                <input
                  type="text"
                  id="seller"
                  name="seller"
                  value={product.seller}
                  onChange={handleChange}
                  required
                  className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  placeholder="e.g., Sunny Valley Farms"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="seller" className="block text-sm font-medium text-gray-700">
                  Seller/Farm phone *
                </label>
                <input
                  type="text"
                  id="seller"
                  name="seller"
                  value={product.phone}
                  onChange={handleChange}
                  required
                  className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  placeholder="e.g., 98/97xxxxxxxx"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="seller" className="block text-sm font-medium text-gray-700">
                  Seller/Farm phone *
                </label>
                <input
                  type="text"
                  id="seller"
                  name="seller"
                  value={product.email}
                  onChange={handleChange}
                  required
                  className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  placeholder="e.g., example@gmial.com"
                />
              </div>

             
              
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div className="space-y-1">
                 {/* Category */}
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={product.category}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all appearance-none bg-white bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNoZXZyb24tZG93biI+PHBhdGggZD0ibTYgOSA2IDYgNi02Ii8+PC9zdmc+')] bg-no-repeat bg-[right_1rem_center] bg-[length:1.5rem]"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              {/* Description */}
              <div className="space-y-1">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={5}
                  value={product.description}
                  onChange={handleChange}
                  required
                  className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all min-h-[120px]"
                  placeholder="Describe your product in detail..."
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Product Images *
                </label>
                
                {/* Drag and Drop Area */}
                <div 
                  className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${isDragging ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-gray-400'}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={triggerFileInput}
                >
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <FiImage className="h-10 w-10 text-gray-400" />
                    <p className="text-sm text-gray-600">
                      {isDragging ? 'Drop images here' : 'Drag & drop images or click to browse'}
                    </p>
                    <p className="text-xs text-gray-500">
                      Upload up to 10 images (JPEG, PNG)
                    </p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                </div>

                {/* Image Previews */}
                {product.images.length > 0 && (
                  <div className="mt-4">
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                      {product.images.map((img) => (
                        <div key={img.id} className="relative group">
                          <img
                            src={img.preview}
                            alt="Preview"
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(img.id)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                          >
                            <FiTrash2 className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all font-medium"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={product.images.length === 0}
              className={`px-6 py-2.5 rounded-lg font-medium text-white transition-all ${product.images.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-md'}`}
            >
              <FiPlus className="inline mr-2" />
              Add Product
            </button>
          </div>
        </form>

        {/* Recently Added Products
        {products.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Recently Added</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((prod) => (
                <div key={prod.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative aspect-square bg-gray-100 overflow-hidden">
                    {prod.images[0] && (
                      <img
                        src={prod.images[0].url}
                        alt={prod.name}
                        className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                      />
                    )}
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                      {prod.images.length} {prod.images.length === 1 ? 'image' : 'images'}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900">{prod.name}</h3>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-green-600 font-bold">${prod.price.toFixed(2)}</span>
                      <span className="text-sm text-gray-500">{prod.seller}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
};