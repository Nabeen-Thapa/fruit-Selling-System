import axios from 'axios';
import { Product, ProductFormState, ProductImages } from '../types/product.type';


const APIURL = import.meta.env.VITE_API_URL;
export const createProduct = async (productData: FormData) => {
  try {
    const response = await axios.post(`${APIURL}/product/add`, productData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to create product');
  }
};

export const fetchProducts = async (): Promise<Product[]> => {
  const response = await fetch(`${APIURL}/product/view`);
  if (!response.ok) throw new Error('Failed to fetch products');
  const data = await response.json();

  return data.data.map((product: Product) => ({
    ...product,
    price: typeof product.price === 'string' ? parseFloat(product.price) : product.price
  }));
};


export const fetchSpecificProduct = async (id: string): Promise<Product> => {
  const response = await fetch(`${APIURL}/product/${id}/view`);
  if (!response.ok) throw new Error('Failed to fetch product');
  const data = await response.json();

  const product = data.data;
  const sellers = data.data.sellers;
  return {
    ...product,
    sellers,
    price: typeof product.price === 'string' ? parseFloat(product.price) : product.price
  };
};


export const deleteProduct = async (id: string): Promise<{ success: boolean; message?: string }> => {
  try {

    const response = await fetch(`${APIURL}/product/${id}/delete`, {
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
      message: error instanceof Error ? (error as Error).message : 'Deletion failed'
    };
  }

};



export const updateProduct = async (
  id: string,
  productData: ProductFormState,
  existingImages: ProductImages[]): Promise<Product> => {
  const formData = new FormData();

  // Append product data
  formData.append('name', productData.name);
  formData.append('price', productData.price);
  formData.append('description', productData.description);
  formData.append('quantity', productData.quantity);
  formData.append('category', productData.category);
  formData.append('quantityType', productData.quantityType);

  existingImages.forEach((img) => {
    formData.append('existingImages[]', JSON.stringify(img)); // can also send just `img.id` if backend expects only ID
  });

  // Append new images
  productData.images.forEach((image) => {
    formData.append('productImages', image.file);
  });

  const response = await fetch(`${APIURL}/product/${id}/update`, {
    method: 'PUT',
    credentials: 'include',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to update product');
  }

  return response.json();
};

export const myProducts = async (id: string): Promise<Product[]> => {
  const response = await fetch(`${APIURL}/product/myProducts/${id}`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) throw new Error("Unable to access your product");

  const data = await response.json();

  return data.data.map((product: Product) => ({
    ...product,
    price: typeof product.price === 'string' ? parseFloat(product.price) : product.price
  }));
};

