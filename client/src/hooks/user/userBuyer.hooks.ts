import { useState, useEffect } from 'react';
import { Buyer } from '../../types/buyer.types';
import { deleteBuyer, fetchBuyers, registerBuyer } from '../../services/buyer.services';

export const useBuyers = () => {
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  useEffect(() => {
    loadBuyers();
  }, []);

  return { buyers, loading, error, addBuyer, removeBuyer };
};