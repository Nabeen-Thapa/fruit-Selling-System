import { useState, useRef, useEffect } from 'react';
import { ProductCategory, ProductFormState, ProductImage, quantityTypes, UseProductFormReturn } from '../../types/product.type';
const categories: ProductCategory[] = ['fruit', 'berry', 'tropical'];
const quantityTypes: quantityTypes[] = ['kg' , 'dorzen' , 'pices'];

export const useProductForm = (): UseProductFormReturn => {
  const [product, setProduct] = useState<ProductFormState>({
    name: '',
    price: '',
    description: '',
    quantity: '',
    category: 'fruit',
    quantityType: "kg",
    images: [],
  });

  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const [userCookieData, setUserCookieData] = useState(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };


  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      const files = Array.from(e.dataTransfer.files);
      handleFiles(files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = (files: File[]) => {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));

    if (imageFiles.length === 0) {
      setError('Please upload only image files (JPEG, PNG)');
      return;
    }

    if (product.images.length + imageFiles.length > 5) {
      setError('Maximum 5 images allowed');
      return;
    }

    setError('');

    const newImages: ProductImage[] = imageFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: Date.now() + Math.random()
    }));

    setProduct(prev => ({
      ...prev,
      images: [...prev.images, ...newImages]
    }));
  };

  const removeImage = (id: number) => {
    setProduct(prev => ({
      ...prev,
      images: prev.images.filter(img => img.id !== id)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formData = new FormData();

      // Append all product data
      formData.append('name', product.name);
      formData.append('price', product.price.toString());
      formData.append('description', product.description);
      formData.append('quantity', product.quantity);
      formData.append('category', product.category);
      formData.append('quantityType', product.quantityType);

      // Debug: Log form data before sending
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      // Append images
      product.images.forEach((image) => {
        formData.append('productImages', image.file);
      });

      const response = await fetch('http://localhost:5000/product/add', {
        method: 'POST',
         credentials: 'include',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Failed to add product');

      setShowSuccess(true);
      resetForm();

      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setProduct({
      name: '',
      price: '',
      description: '',
      quantity: '',
      category: 'fruit',
      quantityType: 'kg',
      images: [],
    });
    setError('');
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return {
    product,
    loading,
    showSuccess,
    isDragging,
    error,
    fileInputRef,
    handleChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileInput,
    removeImage,
    handleSubmit,
    resetForm,
    triggerFileInput
  };
};



