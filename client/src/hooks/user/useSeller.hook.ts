import { useState, useCallback } from 'react';
import { Seller } from '../../types/seller.types';
import { loginSeller, registerSeller, viewBuyers, viewSeller } from '../../services/seller.services';
import { fetchCurrentUser } from '../../services/auth.fetchCurrentUser.utils';

export const useSeller = () => {
  const [seller, setSeller] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addSeller = useCallback(async (sellerData: Omit<Seller, 'id' | 'createdAt' | 'lastLogin'>) => {
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
  }, []);

  const sellerLogin = useCallback(async (email: string, password: string) => {
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
  }, []);

  const viewSellerData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const currentUser = await fetchCurrentUser();
      if (!currentUser) throw new Error("Failed to view your data");
      const viewSellerRes = await viewSeller();
      return viewSellerRes;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch seller data');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const viewBuyerList = useCallback(async () => {
    try {
      const buyerList = await viewBuyers();
      if (!buyerList) throw new Error("Unable to access buyer list");
      return buyerList;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch buyers');
      throw error;
    }
  }, []);

  

  return {
    addSeller,
    sellerLogin,
    viewSellerData,
    viewBuyerList,
    loading,
    error,
    setError,
    setLoading
  };
};