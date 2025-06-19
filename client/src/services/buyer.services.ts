import { Buyer } from "../types/buyer.types";
import { usersView } from "../types/seller.types";


const BASE_URL = 'http://localhost:5000/buyer';
export const registerBuyer = async (buyerData: Omit<Buyer, 'id' | 'createdAt' | 'lastLogin'>): Promise<Buyer> => {
  const response = await fetch(`${BASE_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(buyerData),
  });

  const contentType = response.headers.get('content-type');

  if (!response.ok) {
    let errorMsg = 'Failed to register buyer';
    if (contentType && contentType.includes('application/json')) {
      const errorData = await response.json();
      errorMsg = errorData.message || errorMsg;
    }
    throw new Error(errorMsg);
  }

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


export const viewBuyer = async () => {
  try {
    const viewResponse = await fetch(`http://localhost:5000/buyer/viewData`, {
      method: "GET",
      credentials: "include"
    });

    const data = await viewResponse.json();

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

export const updateBuyerDetail = async (updatedBuyerData: Partial<usersView>) => {
  try {
    const res = await fetch(`http://localhost:5000/buyer/update`, {
      method: 'PUT',
      credentials: "include",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ updatedBuyerData }),
    });
    console.log("service update buyer:", updatedBuyerData)
    if (!res.ok) throw new Error("Failed to update seller");
    const updatedData = await res.json();

    console.log("Updated:", updatedData);
    // Optionally refresh data or close modal
  } catch (error) {
    console.error(error);
  }
}

export const viewAllSellersService = async () => {
  try {
    const response = await fetch("http://localhost:5000/buyer/viewSellers", {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) throw new Error("unable to access sellers");
    const sellers = await response.json();
    console.log("seller service:", sellers);
    return sellers.data;
  } catch (error) {
    console.error("error in buyer service:", (error as Error).message);
    throw error;
  }
}