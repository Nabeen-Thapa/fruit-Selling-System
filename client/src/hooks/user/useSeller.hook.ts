import { useState } from 'react';
import { Seller } from '../../types/seller.types';
import { loginSeller, registerSeller } from '../../services/seller.services';

export const useSeller = (error, setError, loading, setLoading) => {
    const [seller, setSeller] = useState<Seller[]>([]);
   
    

    const addSeller = async (sellerData: Omit<Seller, 'id' | 'createdAt' | 'lastLogin'>) => {
        setLoading(true);
        try {
            const newSeller = await registerSeller(sellerData);
            setSeller(prev => [...prev, newSeller]);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to add buyer');
            throw error;
        } finally {
            setLoading(false);
        }
    }

    const sellerLogin = async (email: string, password: string) => {
        setLoading(true);
        try {
          const response = await loginSeller(email, password); // call your service function
          return response;
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Login failed');
          throw err;
        } finally {
          setLoading(false);
        }
      };

    return {addSeller, error,loading, sellerLogin};
}