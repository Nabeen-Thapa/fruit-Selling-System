import { useState, useEffect } from 'react';
import { Product } from '../../types/product.type';
import { fetchProducts, deleteProduct as deleteProductService } from '../../services/product.services';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const getProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, []);

  const handleDeleteProduct = async (productId: string) => {
    try {
      setLoading(true);
      const { success, message } = await deleteProductService(productId);
      
      if (success) {
        setProducts(prev => prev.filter(product => product.id !== productId));
      } else {
        setError(message || 'Failed to delete product');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Deletion failed');
    } finally {
      setLoading(false);
    }
  };

  return { 
    products, 
    loading, 
    error, 
    deleteProduct: handleDeleteProduct 
  };
};