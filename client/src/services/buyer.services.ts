import { Buyer } from "../types/buyer.types";


const BASE_URL = 'http://localhost:5000/buyer';

export const registerBuyer = async (buyerData: Omit<Buyer, 'id' | 'createdAt' | 'lastLogin'>): Promise<Buyer> => {
  const response = await fetch(`${BASE_URL}/register`, {
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
  const response = await fetch(`${BASE_URL}/view`);
  if (!response.ok) throw new Error('Failed to fetch buyers');
  return response.json();
};

export const deleteBuyer = async (id: string): Promise<void> => {
  const response = await fetch(`${BASE_URL}/delete?id=${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete buyer');
};


export const buyerLoginService = async (email: string, password: string) => {
  const res = await fetch(`http://localhost:5000/buyer/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password })
  });
  const contentType = res.headers.get("content-type");

  if (!res.ok) {
    // Try to extract error message from JSON if available
    if (contentType && contentType.includes("application/json")) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Login failed");
    } else {
      throw new Error("Login failed with no response body");
    }
  } 
  // Return parsed response if JSON
  if (contentType && contentType.includes("application/json")) {
    return await res.json();
  } else {
    return { message: "Login successful (no JSON response)" };
  }
}