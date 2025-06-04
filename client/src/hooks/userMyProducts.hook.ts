import { useState, useEffect } from 'react';
import { deleteProduct as deleteProductService, myProducts as fetchMyProducts } from '../services/product.services';
import { Product } from '../types/product.type';

export const useMyProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

 useEffect(() => {
     const getProducts = async () => {
       try {
         const data = await fetchMyProducts();
         setProducts(data);
         console.log("user hook my products:", data)
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
