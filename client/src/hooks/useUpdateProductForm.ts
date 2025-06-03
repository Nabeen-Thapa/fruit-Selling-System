import { useState, useRef, useEffect } from 'react';
import { ProductFormState, ProductImage, ProductImages } from '../types/product.type';
import { fetchSpecificProduct, updateProduct } from '../services/product.services';

interface UseUpdateProductFormReturn {
  product: ProductFormState | null;
  loading: boolean;
  showSuccess: boolean;
  isDragging: boolean;
  error: string;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDragLeave: () => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  handleFileInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: (id: number) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  resetForm: () => void;
  triggerFileInput: () => void;
  existingImages: ProductImages[];
}

export const useUpdateProductForm = (id: string): UseUpdateProductFormReturn => {
  const [product, setProduct] = useState<ProductFormState | null>(null);
  const [existingImages, setExistingImages] = useState<ProductImages[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const fetchedProduct = await fetchSpecificProduct(id);
        setExistingImages(fetchedProduct.images || []);
        
        setProduct({
          name: fetchedProduct.name,
          price: fetchedProduct.price.toString(),
          description: fetchedProduct.description,
          quantity: fetchedProduct.quantity.toString(),
        category: (fetchedProduct as any).category || 'fruit',// Temporary type assertion
            images: []
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load product');
      }
    };

    loadProduct();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProduct(prev => prev ? { ...prev, [name]: value } : null);
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
    if (!product) return;

    const imageFiles = files.filter(file => file.type.startsWith('image/'));

    if (imageFiles.length === 0) {
      setError('Please upload only image files (JPEG, PNG)');
      return;
    }

    const totalImages = product.images.length + imageFiles.length;
    if (totalImages > 5) {
      setError('Maximum 5 new images allowed');
      return;
    }

    setError('');

    const newImages: ProductImage[] = imageFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: Date.now() + Math.random()
    }));

    setProduct({
      ...product,
      images: [...product.images, ...newImages]
    });
  };

  const removeImage = (id: number) => {
    if (!product) return;
    setProduct({
      ...product,
      images: product.images.filter(img => img.id !== id)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    
    setLoading(true);
    setError('');

    try {
      await updateProduct(id, product);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    if (!product) return;
    setProduct({
      ...product,
      images: []
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
    triggerFileInput,
    existingImages
  };
};