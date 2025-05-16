import React from 'react';
import { Buyer } from '../../types/buyer.types';

interface BuyerCardProps {
  buyer: Buyer;
  onDelete: (id: string) => void;
}

export const BuyerCard: React.FC<BuyerCardProps> = ({ buyer, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-3">
      <h3 className="text-xl font-semibold">{buyer.name}</h3>
      <p className="text-gray-600">{buyer.email}</p>
      <p className="text-gray-600">{buyer.phone}</p>
      <div className="border-t pt-2">
        <p className="text-sm text-gray-500">Address: {buyer.address}</p>
        <p className="text-sm text-gray-500">Shipping: {buyer.shippingAddress}</p>
      </div>
      <div className="flex justify-between items-center pt-2">
        <span className="text-xs text-gray-400">
          Joined: {new Date(buyer.createdAt).toLocaleDateString()}
        </span>
        <button
          onClick={() => onDelete(buyer.id)}
          className="text-red-500 hover:text-red-700 text-sm font-medium"
        >
          Delete
        </button>
      </div>
    </div>
  );
};