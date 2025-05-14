import axios from 'axios';

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