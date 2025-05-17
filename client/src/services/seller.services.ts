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