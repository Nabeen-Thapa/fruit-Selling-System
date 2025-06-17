import { useState, useEffect, useCallback } from 'react';
import { Buyer } from '../../types/buyer.types';
import { buyerLoginService, deleteBuyer, fetchBuyers, registerBuyer, viewAllSellersService, viewBuyer } from '../../services/buyer.services';
import { fetchCurrentUser } from '../../services/auth.fetchCurrentUser.utils';

export const useBuyers = () => {
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // useEffect(() => {
  //   const loadBuyers = async () => {
  //     setLoading(true);
  //     try {
  //       const data = await fetchBuyers();
  //       setBuyers(data);
  //     } catch (err) {
  //       setError(err instanceof Error ? err.message : 'Unknown error');
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   loadBuyers();
  // }, []);

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
      const response = await buyerLoginService(email, password);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };


  const viewAllSellers = async () => {
    try {
      const currentUser = await fetchCurrentUser();
      if (!currentUser) throw new Error("faile to view your data");
      const sellers = await viewAllSellersService();
      console.log("buyer hook:", sellers)
      return sellers;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Login failed');
      throw error;
    }
  }

  const viewBuyerData = useCallback(async () => {
      setLoading(true);
      setError(null);
      try {
        const currentUser = await fetchCurrentUser();
        if (!currentUser) throw new Error("Failed to view your data");
        const viewSellerRes = await viewBuyer();
        return viewSellerRes;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch seller data');
        throw err;
      } finally {
        setLoading(false);
      }
    }, []);

  return { buyers, loading, setLoading, error, viewAllSellers,viewBuyerData, addBuyer, removeBuyer, loginBuyer};
};
