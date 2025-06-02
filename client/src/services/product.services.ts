import axios from 'axios';
import { Product } from '../types/product.type';

const API_BASE_URL = 'http://localhost:5000';

export const createProduct = async (productData: FormData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/product/add`, productData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create product');
  }
};

export const fetchProducts = async (): Promise<Product[]> => {
  const response = await fetch('http://localhost:5000/product/view');
  if (!response.ok) throw new Error('Failed to fetch products');
  const data = await response.json();

  return data.data.map((product: Product) => ({
    ...product,
    price: typeof product.price === 'string' ? parseFloat(product.price) : product.price
  }));
};


export const fetchSpecificProduct = async (id: string): Promise<Product> => {
  const response = await fetch(`http://localhost:5000/product/${id}/view`);
  if (!response.ok) throw new Error('Failed to fetch product');
  const data = await response.json();

  const product = data.data;
  return {
    ...product,
    price: typeof product.price === 'string' ? parseFloat(product.price) : product.price
  };
};



export const deleteProduct = async (id: string): Promise<{ success: boolean; message?: string }> => {
  try {
  
    const response = await fetch(`http://localhost:5000/product/${id}/delete`, {
      method: 'DELETE',
      credentials: "include",
      headers: {
        'Content-Type': 'application/json',
      },
      
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || 
        `Failed to delete product (Status: ${response.status})`
      );
    }

    return {
      success: true,
      ...(await response.json().catch(() => ({})))
    };
  } catch (error) {
    console.error(`Delete failed for product ${id}:`, error);
    
    // Return structured error information
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Deletion failed'
    };
  }
};