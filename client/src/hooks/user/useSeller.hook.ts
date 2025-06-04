import { useState } from 'react';
import { Seller } from '../../types/seller.types';
import { loginSeller, registerSeller } from '../../services/seller.services';

export const useSeller = () => {
  const [seller, setSeller] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addSeller = async (sellerData: Omit<Seller, 'id' | 'createdAt' | 'lastLogin'>) => {
    setLoading(true);
    try {
      const newSeller = await registerSeller(sellerData);
      setSeller(prev => [...prev, newSeller]);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to add seller');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const sellerLogin = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await loginSeller(email, password);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    addSeller,
    sellerLogin,
    loading,
    error,
    setError,     
    setLoading   
  };
};
