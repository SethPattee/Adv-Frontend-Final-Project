import React, { useState } from 'react';
import { useInventory } from './InventoryContext';
import Spinner from './Spinner';

const InventoryForm: React.FC = () => {
  const { addItem, isLoading } = useInventory();
  const [itemName, setItemName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (itemName.trim().length > 0) {
      const formData = new FormData();
      formData.append('title', itemName);
      try {
        const newItem = await addItem(formData);
        console.log('New item added:', newItem);
        setItemName('');
      } catch (error) {
        console.error('Error adding item:', error);
      }
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <form onSubmit={handleSubmit} className="inventory-form">
      <label htmlFor="itemName" className="form-label">Item Name</label>
      <input
        id="itemName"
        type="text"
        value={itemName}
        onChange={(e) => setItemName(e.target.value)}
        placeholder="Enter item name"
        className="form-control"
      />
      <button className="btn btn-primary">Add Item</button>
    </form>
  );
};

export default InventoryForm;
