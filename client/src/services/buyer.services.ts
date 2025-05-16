import { Buyer } from "../types/buyer.types";


const API_BASE_URL = 'http://localhost:5000/buyer';

export const registerBuyer = async (buyerData: Omit<Buyer, 'id' | 'createdAt' | 'lastLogin'>): Promise<Buyer> => {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(buyerData),
  });
  if (!response.ok) throw new Error('Failed to register buyer');
  return response.json();
};

export const fetchBuyers = async (): Promise<Buyer[]> => {
  const response = await fetch(`${API_BASE_URL}/view`);
  if (!response.ok) throw new Error('Failed to fetch buyers');
  return response.json();
};

export const deleteBuyer = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/delete?id=${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete buyer');
};