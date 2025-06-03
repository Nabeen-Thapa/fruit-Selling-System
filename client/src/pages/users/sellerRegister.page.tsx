import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Seller } from '../../types/seller.types';
import { useSeller } from '../../hooks/user/useSeller.hook';
import { SellerForm } from '../../components/user/sellerFrom';

export const SellerRegister: React.FC = () => {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { addSeller } = useSeller(error, setError, loading, setLoading);
    const navigate = useNavigate();

    const handleSubmit = async (sellerData: Omit<Seller, 'id' | 'createdAt' | 'lastLogin'>) => {
        try {
            await addSeller(sellerData);
            navigate('/buyer/login');
        } catch (error) {
            console.error('Registration failed:', error);
        }
    };

    return (
        <div className='max-w-2xl mx-auto py-8 px-4'>
            <h1 className='text-2xl font-bold mb-6 text-center'>New seller</h1>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <SellerForm onSubmit={handleSubmit} loading={loading} />
        </div>
    );
};
