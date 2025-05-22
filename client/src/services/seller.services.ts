import { Seller } from "../types/seller.types";

const BASE_URL = "http://localhost:5000/seller"

export const registerSeller = async (sellerData: Omit<Seller, 'id' | 'createdAt' | 'lastLogin'>): Promise<Seller> => {
    const sellerResponse = await fetch(`${BASE_URL}/register`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(sellerData),
    });
    
    if (!sellerResponse.ok) {
        throw new Error('Failed to register seller');
    }
    
    // Handle 204 No Content
    if (sellerResponse.status === 204) {
        return sellerData as Seller; // Return input data or mock response
    }
    
    return sellerResponse.json();
}

export interface SellerLoginData {
  email: string;
  password: string;
}


// src/services/authService.ts
export const loginSeller = async (email: string, password: string) => {
  const res = await fetch("http://localhost:5000/seller/auth/login", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const contentType = res.headers.get("content-type");

  let data: any;
  if (contentType && contentType.includes("application/json")) {
    data = await res.json();
  } else {
    const text = await res.text();
    throw new Error(`Unexpected response: ${text}`);
  }

  if (!res.ok) throw new Error(data.message || "Login failed");

  return data;
};
