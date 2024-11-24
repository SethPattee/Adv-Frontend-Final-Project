import axios from 'axios';
import { InventoryItem } from './InventoryContext';

const API_BASE_URL = 'http://localhost:5009/';

if (!API_BASE_URL) {
  console.error('VITE_API_URL is not defined and no fallback was provided.');
} else {
  console.log('VITE_API_URL is', API_BASE_URL);
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Logging for debugging
apiClient.interceptors.request.use((config) => {
  console.log('Request:', config);
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    console.log('Response:', response);
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

const apiService = {
  getInventory: async (): Promise<InventoryItem[]> => {
    const response = await apiClient.get('/inventory');
    return response.data;
  },

  addItem: async (item: FormData): Promise<InventoryItem> => {
    const response = await apiClient.post('/inventory', item);
    return response.data;
  },

  updateItem: async (id: string, updatedItem: FormData): Promise<InventoryItem> => {
    const response = await apiClient.put(`/inventory/${id}`, updatedItem);
    return response.data;
  },

  deleteItem: async (id: string): Promise<void> => {
    await apiClient.delete(`/inventory/${id}`);
  },

  clearInventory: async (): Promise<void> => {
    await apiClient.delete('/inventory');
  },
};

export default apiService;
