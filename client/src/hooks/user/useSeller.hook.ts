import { useState } from 'react';
import { Seller } from '../../types/seller.types';
import { registerSeller } from '../../services/seller.services';

export const useSeller = () => {
    const [seller, setSeller] = useState<Seller[]>([]);
    const [sellerLoading, setSellerLoading] = useState(false);
    const [error, setError] = useState('');

    const addSeller = async (sellerData: Omit<Seller, 'id' | 'createdAt' | 'lastLogin'>) => {
        setSellerLoading(true);
        try {
            const newSeller = await registerSeller(sellerData);
            setSeller(prev => [...prev, newSeller]);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to add buyer');
            throw error;
        } finally {
            setSellerLoading(false);
        }
    }

    return {addSeller, error,sellerLoading};
}