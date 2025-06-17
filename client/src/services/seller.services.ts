import { Seller, usersView } from "../types/seller.types";

const BASE_URL = "http://localhost:5000/seller"

export const registerSeller = async (sellerData: Omit<Seller, 'id' | 'createdAt' | 'lastLogin'>): Promise<Seller> => {
  const sellerResponse = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(sellerData),
  });

  const contentType = sellerResponse.headers.get('content-type');

  if (!sellerResponse.ok) {
    let errorMsg = 'Failed to register buyer';
    if (contentType && contentType.includes('application/json')) {
      const errorData = await sellerResponse.json();
      errorMsg = errorData.message || errorMsg;
    }
    throw new Error(errorMsg);
  }


  return sellerResponse.json();
}

// src/services/authService.ts
export const loginSeller = async (email: string, password: string) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  //console.log("cient service seller login:", res);

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


export const viewSeller = async () => {
  try {
    const viewResponse = await fetch(`http://localhost:5000/seller/view`, {
      method: "GET",
      credentials: "include"
    });

    const data = await viewResponse.json(); // ✅ Parse once

    if (!viewResponse.ok) {
      const errorMessage = data?.message || "Failed to view seller";
      throw new Error(errorMessage);
    }

    // console.log("view seller service:", data); // ✅ use parsed data

    return data;
    
  } catch (error) {
    console.error("Error fetching seller:", (error as Error).message);
    throw error;
  }
}


export const viewBuyers = async()=>{
  try {
    const viewResponse = await fetch(`http://localhost:5000/seller/viewbuyers`,{
      method: "GET",
      credentials: "include",
    })
    if(!viewResponse.ok) return new Error("unabke to access buyers");
    const buyersList = await viewResponse.json();
    // console.log("fortend seller service buyers:", buyersList);
    return buyersList.data;
  } catch (error) {
     console.error("Error fetching seller:", (error as Error).message);
    throw error;
  }
}

export const updateSeller = async (updatedUser: Partial<usersView>) => {
  try {
    const res = await fetch(`http://localhost:5000/seller/update`, {
      method: 'PUT',
      credentials: "include",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({updatedUser}),
    });
    console.log("service update seller:", updatedUser)
    if (!res.ok) throw new Error("Failed to update seller");
    const updatedData = await res.json();

    console.log("Updated:", updatedData);
    // Optionally refresh data or close modal
  } catch (error) {
    console.error(error);
  }
};
