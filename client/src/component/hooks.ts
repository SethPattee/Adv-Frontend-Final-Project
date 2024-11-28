import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import apiService from './apiService';

const keys = {
  inventory: {
    all: ['inventory'] as const,
    lists: () => [...keys.inventory.all, 'list'] as const,
    list: (filters: string) => [...keys.inventory.lists(), { filters }] as const,
    details: () => [...keys.inventory.all, 'detail'] as const,
    detail: (id: string) => [...keys.inventory.details(), id] as const,
  },
};

const handleError = (error: Error) => {
  console.error('An error occurred:', error);
  toast.error(`An error occurred: ${error.message}`);
};

export const useInventoryQuery = (filters: string = '') => {
  return useQuery({
    queryKey: keys.inventory.list(filters),
    queryFn: () => apiService.getInventory(),
    refetchInterval: 30000,
  });
};

export const useAddItemMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: apiService.addItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.inventory.lists() });
      toast.success('Item added successfully');
    },
    onError: handleError,
  });
};

export const useUpdateItemMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      apiService.updateItem(id, formData),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: keys.inventory.lists() });
      queryClient.invalidateQueries({ queryKey: keys.inventory.detail(variables.id) });
      toast.success('Item updated successfully');
    },
    onError: handleError,
  });
};

export const useDeleteItemMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: apiService.deleteItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.inventory.lists() });
      toast.success('Item deleted successfully');
    },
    onError: handleError,
  });
};