import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBuyers } from '../../hooks/user/userBuyer.hooks';
import { BuyerCard } from '../../components/user/buyerCard';

export const BuyersList: React.FC = () => {
  const { buyers, loading, error, removeBuyer } = useBuyers();
  const navigate = useNavigate();

  if (loading) return <div className="text-center py-8">Loading buyers...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Buyers</h1>
        <button
          onClick={() => navigate('/buyers/register')}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Add New Buyer
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {buyers.map(buyer => (
          <BuyerCard 
            key={buyer.id} 
            buyer={buyer} 
            onDelete={removeBuyer} 
          />
        ))}
      </div>
    </div>
  );
};