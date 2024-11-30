// import React, { useState, useRef } from 'react';
// import { Container, Form, Button, Table, Alert } from 'react-bootstrap';
// import { InventoryItem } from './InventoryContext';
// import Spinner from './Spinner';

// import { useInventoryQuery, useAddItemMutation, useUpdateItemMutation, useDeleteItemMutation } from './hooks';
// import ImageUploadPreview from './ImageUpload';

// const InventoryManagement: React.FC = () => {
//   const [newSticker, setNewSticker] = useState({
//     title: '',
//     author: '',
//     description: '',
//   });
//   const [newStickerImage, setNewStickerImage] = useState<File | null>(null);
//   const [editId, setEditId] = useState<string | null>(null);
//   const [editSticker, setEditSticker] = useState<InventoryItem | null>(null);
//   const [editBookImage, setEditStickerImage] = useState<File | null>(null);
//   const imageUploadRef = useRef<{ resetImage: () => void } | null>(null);

//   const { data: inventory, isLoading, error } = useInventoryQuery();
//   const addItemMutation = useAddItemMutation();
//   const updateItemMutation = useUpdateItemMutation();
//   const deleteItemMutation = useDeleteItemMutation();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (newSticker.title.trim().length > 0) {
//       const formData = new FormData();
//       formData.append('title', newSticker.title);
//       formData.append('author', newSticker.author || '');
//       formData.append('description', newSticker.description || '');
//       if (newStickerImage) {
//         formData.append('image', newStickerImage);
//       }
//       addItemMutation.mutate(formData, {
//         onSuccess: () => {
//           setNewSticker({ title: '', author: '', description: '' });
//           setNewStickerImage(null);
//           if (imageUploadRef.current) {
//             imageUploadRef.current.resetImage();
//           }
//         },
//       });
//     }
//   };

//   const handleEdit = (book: InventoryItem) => {
//     setEditId(book.id);
//     setEditSticker(book);
//     setEditStickerImage(null);
//   };

//   const handleSaveEdit = async () => {
//     if (editSticker) {
//       const formData = new FormData();
//       formData.append('title', editSticker.title);
//       formData.append('author', editSticker.author || '');
//       formData.append('description', editSticker.description || '');
//       if (editBookImage) {
//         formData.append('image', editBookImage);
//       }
//       updateItemMutation.mutate(
//         { id: editSticker.id, formData },
//         {
//           onSuccess: () => {
//             setEditId(null);
//             setEditSticker(null);
//             setEditStickerImage(null);
//           },
//         }
//       );
//     }
//   };

//   const handleCancelEdit = () => {
//     setEditId(null);
//     setEditSticker(null);
//     setEditStickerImage(null);
//   };

//   const handleDelete = async (id: string) => {
//     deleteItemMutation.mutate(id);
//   };

//   if (isLoading) {
//     return <Spinner />;
//   }

//   if (error) {
//     return <Alert variant="danger">Error loading inventory: {(error as Error).message}</Alert>;
//   }
//   return (
//     <Container className="my-4">
//       <h1>Sticker Management</h1>
//       {error && <Alert variant="danger">{error}</Alert>}
//       <Form onSubmit={handleSubmit} className="mb-4">
//         <Form.Group controlId="formTitle">
//           <Form.Label>Title</Form.Label>
//           <Form.Control
//             type="text"
//             placeholder="Enter Sticker title"
//             value={newSticker.title}
//             onChange={(e) => setNewSticker({ ...newSticker, title: e.target.value })}
//             required
//           />
//         </Form.Group>

//         <Form.Group controlId="formPrice">
//           <Form.Label>Price</Form.Label>
//           <Form.Control
//             type="text"
//             placeholder="Enter Price"
//             value={newSticker.author}
//             onChange={(e) => setNewSticker({ ...newSticker, author: e.target.value })}
//           />
//         </Form.Group>

//         <Form.Group controlId="formDescription">
//           <Form.Label>Description</Form.Label>
//           <Form.Control
//             as="textarea"
//             rows={3}
//             placeholder="Enter Sticker description"
//             value={newSticker.description}
//             onChange={(e) => setNewSticker({ ...newSticker, description: e.target.value })}
//           />
//         </Form.Group>

//         <ImageUploadPreview
//           onImageChange={(file) => setNewStickerImage(file)}
//           ref={imageUploadRef}
//         />

//         <Button variant="primary" type="submit" className="mt-3">
//           Add Sticker
//         </Button>
//       </Form>
//       <Table striped bordered hover responsive className="mt-4">
//         <thead>
//           <tr>
//             <th>Image</th>
//             <th>Title</th>
//             <th>Price</th>
//             <th>Description</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {inventory?.map((book) => (
//             <tr key={book.id}>
//               {editId === book.id ? (
//               <>
//               <td>
//                 <ImageUploadPreview
//                   initialImage={book.imagePath}
//                   onImageChange={(file) => setEditStickerImage(file)}
//                 />
//               </td>
//               <td>
//                 <Form.Control
//                   type="text"
//                   value={editSticker?.title || ''}
//                   onChange={(e) => setEditSticker({ ...editSticker!, title: e.target.value })}
//                 />
//               </td>
//               <td>
//                 <Form.Control
//                   type="text"
//                   value={editSticker?.author || ''}
//                   onChange={(e) => setEditSticker({ ...editSticker!, author: e.target.value })}
//                 />
//               </td>
//               <td>
//                 <Form.Control
//                   as="textarea"
//                   rows={2}
//                   value={editSticker?.description || ''}
//                   onChange={(e) => setEditSticker({ ...editSticker!, description: e.target.value })}
//                 />
//               </td>
//               <td>
//                 <Button variant="success" onClick={handleSaveEdit}>
//                   Save
//                 </Button>{' '}
//                 <Button variant="secondary" onClick={handleCancelEdit}>
//                   Cancel
//                 </Button>
//               </td>
//             </>
//           ) : (
//             <>
//               <td>
//                 <img
//                   // src={`${import.meta.env.VITE_API_URL}/images/${book.imagePath}`}
//                   src = {`http://localhost:5009/images/${book.imagePath}`}
//                   alt={book.title}
//                   style={{ maxWidth: '100px', maxHeight: '100px' }}
//                 />
//               </td>
//               <td>{book.title}</td>
//               <td>{book.author || 'N/A'}</td>
//               <td>{book.description || 'No description'}</td>
//               <td>
//                 <Button variant="warning" onClick={() => handleEdit(book)}>
//                   Edit
//                 </Button>{' '}
//                 <Button variant="danger" onClick={() => handleDelete(book.id)}>
//                   Delete
//                 </Button>
//               </td>
//             </>
//           )}
//         </tr>
//       ))}
//     </tbody>
//   </Table>
// </Container>
//   );
// };

// export default InventoryManagement;


import React, { useState, useRef } from 'react';
import { Container, Form, Button, Table, Alert } from 'react-bootstrap';
import { InventoryItem } from './InventoryContext';
import Spinner from './Spinner';
import { useInventoryQuery, useAddItemMutation, useUpdateItemMutation, useDeleteItemMutation } from './hooks';
import ImageUploadPreview from './ImageUpload';
import { useAuth } from 'react-oidc-context';
import { Navigate } from 'react-router-dom';

const InventoryManagement: React.FC = () => {
  const auth = useAuth();
  const [newSticker, setNewSticker] = useState({ title: '', author: '', description: '' });
  const [newStickerImage, setNewStickerImage] = useState<File | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [editSticker, setEditSticker] = useState<InventoryItem | null>(null);
  const [editBookImage, setEditStickerImage] = useState<File | null>(null);
  const imageUploadRef = useRef<{ resetImage: () => void } | null>(null);

  const { data: inventory, isLoading, error } = useInventoryQuery();
  const addItemMutation = useAddItemMutation();
  const updateItemMutation = useUpdateItemMutation();
  const deleteItemMutation = useDeleteItemMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newSticker.title.trim().length > 0) {
      const formData = new FormData();
      formData.append('title', newSticker.title);
      formData.append('author', newSticker.author || '');
      formData.append('description', newSticker.description || '');
      if (newStickerImage) {
        formData.append('image', newStickerImage);
      }
      addItemMutation.mutate(formData, {
        onSuccess: () => {
          setNewSticker({ title: '', author: '', description: '' });
          setNewStickerImage(null);
          if (imageUploadRef.current) {
            imageUploadRef.current.resetImage();
          }
        },
      });
    }
  };

  const handleEdit = (book: InventoryItem) => {
    setEditId(book.id);
    setEditSticker(book);
    setEditStickerImage(null);
  };

  const handleSaveEdit = async () => {
    if (editSticker) {
      const formData = new FormData();
      formData.append('title', editSticker.title);
      formData.append('author', editSticker.author || '');
      formData.append('description', editSticker.description || '');
      if (editBookImage) {
        formData.append('image', editBookImage);
      }
      updateItemMutation.mutate(
        { id: editSticker.id, formData },
        {
          onSuccess: () => {
            setEditId(null);
            setEditSticker(null);
            setEditStickerImage(null);
          },
        }
      );
    }
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setEditSticker(null);
    setEditStickerImage(null);
  };

  const handleDelete = async (id: string) => {
    deleteItemMutation.mutate(id);
  };

  // Redirect unauthenticated users
  if (!auth.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return <Alert variant="danger">Error loading inventory: {(error as Error).message}</Alert>;
  }

  return (
    <Container className="my-4">
      <h1>Sticker Management</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit} className="mb-4">
        <Form.Group controlId="formTitle">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Sticker title"
            value={newSticker.title}
            onChange={(e) => setNewSticker({ ...newSticker, title: e.target.value })}
            required
          />
        </Form.Group>

        <Form.Group controlId="formPrice">
          <Form.Label>Price</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Price"
            value={newSticker.author}
            onChange={(e) => setNewSticker({ ...newSticker, author: e.target.value })}
          />
        </Form.Group>

        <Form.Group controlId="formDescription">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter Sticker description"
            value={newSticker.description}
            onChange={(e) => setNewSticker({ ...newSticker, description: e.target.value })}
          />
        </Form.Group>

        <ImageUploadPreview
          onImageChange={(file) => setNewStickerImage(file)}
          ref={imageUploadRef}
        />

        <Button variant="primary" type="submit" className="mt-3">
          Add Sticker
        </Button>
      </Form>
      <Table striped bordered hover responsive className="mt-4">
        <thead>
          <tr>
            <th>Image</th>
            <th>Title</th>
            <th>Price</th>
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
                  onImageChange={(file) => setEditStickerImage(file)}
                />
              </td>
              <td>
                <Form.Control
                  type="text"
                  value={editSticker?.title || ''}
                  onChange={(e) => setEditSticker({ ...editSticker!, title: e.target.value })}
                />
              </td>
              <td>
                <Form.Control
                  type="text"
                  value={editSticker?.author || ''}
                  onChange={(e) => setEditSticker({ ...editSticker!, author: e.target.value })}
                />
              </td>
              <td>
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={editSticker?.description || ''}
                  onChange={(e) => setEditSticker({ ...editSticker!, description: e.target.value })}
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
                  src={`http://localhost:5009/images/${book.imagePath}`}
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
