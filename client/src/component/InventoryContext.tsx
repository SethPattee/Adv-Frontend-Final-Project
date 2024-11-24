import React from 'react';
import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import apiService from './apiService';

export interface InventoryItem {
  id: string;
  title: string;
  author?: string;
  description?: string;
  imagePath: string;
}

interface InventoryContextType {
  inventory: InventoryItem[] | undefined;
  isLoading: boolean;
  error: unknown;
  addItem: (item: FormData) => Promise<InventoryItem>;
  updateItem: (id: string, updatedItem: FormData) => Promise<InventoryItem>;
  deleteItem: (id: string) => Promise<void>;
  clearInventory: () => Promise<void>;
}

const InventoryContext = React.createContext<InventoryContextType | null>(null);

export const useInventory = () => {
  const context = React.useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};

const queryClient = new QueryClient();

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: inventory, isLoading, error } = useQuery<InventoryItem[]>({
    queryKey: ['inventory'],
    queryFn: apiService.getInventory,
  });

  const queryClient = useQueryClient();

  const addItemMutation = useMutation({
    mutationFn: apiService.addItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });

  const updateItemMutation = useMutation({
    mutationFn: ({ id, updatedItem }: { id: string; updatedItem: FormData }) =>
      apiService.updateItem(id, updatedItem),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: apiService.deleteItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });

  const clearInventoryMutation = useMutation({
    mutationFn: apiService.clearInventory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });

  const contextValue: InventoryContextType = {
    inventory,
    isLoading,
    error,
    addItem: addItemMutation.mutateAsync,
    updateItem: (id: string, updatedItem: FormData) => updateItemMutation.mutateAsync({ id, updatedItem }),
    deleteItem: deleteItemMutation.mutateAsync,
    clearInventory: clearInventoryMutation.mutateAsync,
  };

  return (
    <InventoryContext.Provider value={contextValue}>
      {children}
    </InventoryContext.Provider>
  );
};

export const InventoryProviderWithClient: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <InventoryProvider>{children}</InventoryProvider>
    </QueryClientProvider>
  );
};

export default InventoryProviderWithClient;

