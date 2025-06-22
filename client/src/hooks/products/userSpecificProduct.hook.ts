import React, { useState, useEffect } from 'react';
import { Product } from '../../types/product.type';
import { fetchSpecificProduct } from '../../services/product.services';
export const useSpecificProduct = (id?: string) => {
  const [product, setProduct] = useState<Product>();
  const [loadingOne, setLoadingOne] = useState(true); // ✅ default to true
  const [error, setError] = useState('');

  useEffect(() => {
    const getSpecificProduct = async (id: string) => {
      try {
        setLoadingOne(true); // ✅ Start loading
        const data = await fetchSpecificProduct(id);
        console.log(" get specific product hook:", data)
        setProduct(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoadingOne(false); // ✅ End loading
      }
    };

    if (id) getSpecificProduct(id);
  }, [id]);

  return { product, loadingOne, error };
};
