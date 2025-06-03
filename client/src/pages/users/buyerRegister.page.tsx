import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBuyers } from '../../hooks/user/userBuyer.hooks';
import { Buyer } from '../../types/buyer.types';
import { BuyerForm } from '../../components/user/buyerForm';
import { useSeller } from '../../hooks/user/useSeller.hook';
// BuyerRegister.tsx
export const BuyerRegister: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { addSeller } = useSeller(error, setError, loading, setLoading);
    const navigate = useNavigate();

  const handleSubmit = async (buyerData: Omit<Buyer, 'id' | 'createdAt' | 'lastLogin'>) => {
    try {
      await addBuyer(buyerData);
      navigate('/buyer/login');
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Register New Buyer</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <BuyerForm onSubmit={handleSubmit} loading={loading} />
    </div>
  );
};