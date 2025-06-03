import { useState, useEffect } from 'react';
import { Buyer } from '../../types/buyer.types';
import { buyerLoginService, deleteBuyer, fetchBuyers, registerBuyer } from '../../services/buyer.services';

export const useBuyers = (error, setError,loading, setLoading) => {
  const [buyers, setBuyers] = useState<Buyer[]>([]);
   const [state, setState] = useState<{
    buyers: Buyer[];
    loading: boolean;
    error: string | null;
  }>({
    buyers: [],
    loading: false,
    error: null
  });

  const loadBuyers = async () => {
    setLoading(true);
    try {
      const data = await fetchBuyers();
      setBuyers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const addBuyer = async (buyerData: Omit<Buyer, 'id' | 'createdAt' | 'lastLogin'>) => {
    setLoading(true);
    try {
      const newBuyer = await registerBuyer(buyerData);
      setBuyers(prev => [...prev, newBuyer]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add buyer');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeBuyer = async (id: string) => {
    setLoading(true);
    try {
      await deleteBuyer(id);
      setBuyers(prev => prev.filter(buyer => buyer.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete buyer');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loginBuyer = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await buyerLoginService(email, password); // call your service function
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBuyers();
  }, []);
 return {
    buyers: state.buyers,
    loading: state.loading,
    error: state.error,
    addBuyer,
    removeBuyer,
    loginBuyer
  };};