import React, { useState, useRef } from 'react';
import { Container, Form, Button, Table, Alert } from 'react-bootstrap';
import { InventoryItem } from './InventoryContext';
import Spinner from './Spinner';

import { useInventoryQuery, useAddItemMutation, useUpdateItemMutation, useDeleteItemMutation } from './hooks';
import ImageUploadPreview from './ImageUpload';

const InventoryManagement: React.FC = () => {
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    description: '',
  });
  const [newBookImage, setNewBookImage] = useState<File | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [editBook, setEditBook] = useState<InventoryItem | null>(null);
  const [editBookImage, setEditBookImage] = useState<File | null>(null);
  const imageUploadRef = useRef<{ resetImage: () => void } | null>(null);

  const { data: inventory, isLoading, error } = useInventoryQuery();
  const addItemMutation = useAddItemMutation();
  const updateItemMutation = useUpdateItemMutation();
  const deleteItemMutation = useDeleteItemMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newBook.title.trim().length > 0) {
      const formData = new FormData();
      formData.append('title', newBook.title);
      formData.append('author', newBook.author || '');
      formData.append('description', newBook.description || '');
      if (newBookImage) {
        formData.append('image', newBookImage);
      }
      addItemMutation.mutate(formData, {
        onSuccess: () => {
          setNewBook({ title: '', author: '', description: '' });
          setNewBookImage(null);
          if (imageUploadRef.current) {
            imageUploadRef.current.resetImage();
          }
        },
      });
    }
  };

  const handleEdit = (book: InventoryItem) => {
    setEditId(book.id);
    setEditBook(book);
    setEditBookImage(null);
  };

  const handleSaveEdit = async () => {
    if (editBook) {
      const formData = new FormData();
      formData.append('title', editBook.title);
      formData.append('author', editBook.author || '');
      formData.append('description', editBook.description || '');
      if (editBookImage) {
        formData.append('image', editBookImage);
      }
      updateItemMutation.mutate(
        { id: editBook.id, formData },
        {
          onSuccess: () => {
            setEditId(null);
            setEditBook(null);
            setEditBookImage(null);
          },
        }
      );
    }
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setEditBook(null);
    setEditBookImage(null);
  };

  const handleDelete = async (id: string) => {
    deleteItemMutation.mutate(id);
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return <Alert variant="danger">Error loading inventory: {(error as Error).message}</Alert>;
  }
  return (
    <Container className="my-4">
      <h1>Inventory Management</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit} className="mb-4">
        <Form.Group controlId="formTitle">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter book title"
            value={newBook.title}
            onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
            required
          />
        </Form.Group>

        <Form.Group controlId="formAuthor">
          <Form.Label>Author</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter author name"
            value={newBook.author}
            onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
          />
        </Form.Group>

        <Form.Group controlId="formDescription">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter book description"
            value={newBook.description}
            onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
          />
        </Form.Group>

        <ImageUploadPreview
          onImageChange={(file) => setNewBookImage(file)}
          ref={imageUploadRef}
        />

        <Button variant="primary" type="submit" className="mt-3">
          Add Book
        </Button>
      </Form>
      <Table striped bordered hover responsive className="mt-4">
        <thead>
          <tr>
            <th>Image</th>
            <th>Title</th>
            <th>Author</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {inventory?.map((book) => (
            <tr key={book.id}>
              {editId === book.id ? (
              <>
              <td>
                <ImageUploadPreview
                  initialImage={book.imagePath}
                  onImageChange={(file) => setEditBookImage(file)}
                />
              </td>
              <td>
                <Form.Control
                  type="text"
                  value={editBook?.title || ''}
                  onChange={(e) => setEditBook({ ...editBook!, title: e.target.value })}
                />
              </td>
              <td>
                <Form.Control
                  type="text"
                  value={editBook?.author || ''}
                  onChange={(e) => setEditBook({ ...editBook!, author: e.target.value })}
                />
              </td>
              <td>
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={editBook?.description || ''}
                  onChange={(e) => setEditBook({ ...editBook!, description: e.target.value })}
                />
              </td>
              <td>
                <Button variant="success" onClick={handleSaveEdit}>
                  Save
                </Button>{' '}
                <Button variant="secondary" onClick={handleCancelEdit}>
                  Cancel
                </Button>
              </td>
            </>
          ) : (
            <>
              <td>
                <img
                  // src={`${import.meta.env.VITE_API_URL}/images/${book.imagePath}`}
                  src = {`http://localhost:5009/images/${book.imagePath}`}
                  alt={book.title}
                  style={{ maxWidth: '100px', maxHeight: '100px' }}
                />
              </td>
              <td>{book.title}</td>
              <td>{book.author || 'N/A'}</td>
              <td>{book.description || 'No description'}</td>
              <td>
                <Button variant="warning" onClick={() => handleEdit(book)}>
                  Edit
                </Button>{' '}
                <Button variant="danger" onClick={() => handleDelete(book.id)}>
                  Delete
                </Button>
              </td>
            </>
          )}
        </tr>
      ))}
    </tbody>
  </Table>
</Container>
  );
};

export default InventoryManagement;
