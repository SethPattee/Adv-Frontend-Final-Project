import React from 'react';
import { useInventoryQuery, useDeleteItemMutation } from './hooks';
import Spinner from './Spinner';
import { toast } from 'react-hot-toast';

const InventoryDisplay: React.FC = () => {
  const { data: inventory, isLoading, error } = useInventoryQuery();
  const clearInventoryMutation = useDeleteItemMutation();

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const handleClearInventory = () => {
    inventory?.forEach((book) => {
      clearInventoryMutation.mutate(book.id, {
        onSuccess: () => {
          toast.success(`Deleted ${book.title}`);
        },
        onError: (error) => {
          toast.error(`Error deleting ${book.title}: ${error.message}`);
        },
      });
    });
  };

  return (
    <div>
      <h1>Book Inventory</h1>
      {inventory && inventory.length > 0 ? (
        <>
          <ul>
            {inventory.map((book) => (
              <li key={book.id}>
                {book.title} by {book.author || 'Unknown Author'}
              </li>
            ))}
          </ul>
          <button onClick={handleClearInventory}>Clear Inventory</button>
        </>
      ) : (
        <p>No books in the inventory.</p>
      )}
    </div>
  );
};

export default InventoryDisplay;