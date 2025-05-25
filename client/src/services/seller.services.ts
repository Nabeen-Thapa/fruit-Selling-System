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
  console.log("cient service seller login:", res);

  const contentType = res.headers.get("content-type");

  // Check for success status
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
};
