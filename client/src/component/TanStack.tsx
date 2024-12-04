import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiService from './apiService';
import { InventoryItem, useInventory } from './InventoryContext';

const TanStack: React.FC = () => {
  const { addItem } = useInventory();
  const queryClient = useQueryClient();

  const { data: inventory, isLoading, error } = useQuery<InventoryItem[]>({
    queryKey: ['inventory'],
    queryFn: apiService.getInventory,
  });
  
  // Mutate and add an item
  const mutation = useMutation({
    mutationFn: (newItem: FormData) => addItem(newItem),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });

  if (isLoading) return <div>Loading inventory...</div>;
  if (error) return <div>Error loading inventory</div>;

  return (
    <div>
      <h1>Inventory</h1>
      <ul>
        {inventory?.map(item => (
          <li key={item.id}>
            {item.title} - {item.author}
          </li>
        ))}
      </ul>

      <button
        onClick={() => {
          const formData = new FormData();
          formData.append('title', 'Sticker');
          formData.append('author', '$1200');
          mutation.mutate(formData);
        }}
      >
        Add Item
      </button>
    </div>
  );
};

export default TanStack;
