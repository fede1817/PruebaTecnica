import axios from 'axios';

const BASE_URL = 'https://dummyjson.com';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const productService = {
  getProducts: async (limit: number = 10, skip: number = 0) => {
    const response = await api.get(`/products?limit=${limit}&skip=${skip}`);
    return response.data;
  },

  searchProducts: async (
    query: string,
    limit: number = 10,
    skip: number = 0,
  ) => {
    const response = await api.get(
      `/products/search?q=${query}&limit=${limit}&skip=${skip}`,
    );
    return response.data;
  },

  getProductById: async (id: number) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },
};
