

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, Col, Row, Container } from 'react-bootstrap';
import ErrorThrower from './ErrorThrower';
import Spinner from './Spinner';
import { useInventoryQuery } from './hooks';

const API_BASE_URL = 'https://sethapi.duckdns.org';

if (!API_BASE_URL) console.error('VITE_API_URL is not defined');
else console.log('VITE_API_URL is', API_BASE_URL);

const BookList: React.FC = () => {
  const [showSpinner, setShowSpinner] = useState(true);
  const { data: inventory, isLoading, error } = useInventoryQuery();

  useEffect(() => {
    const timer = setTimeout(() => setShowSpinner(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!inventory) {
    console.error('Inventory data is undefined');
  }
  

  if (showSpinner || isLoading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <h1>Error</h1>
        <p>An error occurred while loading the sticker list: {error.message}</p>
      </Container>
    );
  }

  if (!inventory || inventory.length === 0) {
    console.error('Inventory data is empty or undefined');
    return (
      <Container>
        <h1>No Stickers Available</h1>
      </Container>
    );
  }
  

  return (
    <Container className="book-list-container">
      <h1 className="text-center mb-4">Our Stickers</h1>
      <Row>
        {inventory?.map((item) => (
          <Col key={item.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
            <Card className="book-card">
              <Card.Img
                variant="top"
                src={`${API_BASE_URL}/images/${item.imagePath}`}
                alt={item.title}
                onError={(e) => (e.currentTarget.src = `${API_BASE_URL}/images/default_book.jpg`)}
              />
              <Card.Body>
                <Card.Title className="book-title">{item.title}</Card.Title>
                <Card.Text className="book-author">
                  <strong>Price:</strong> {item.author || 'Unknown'}
                </Card.Text>
                <Card.Text className="book-description">
                  <strong>Description: </strong>
                  {item.description || 'No description available'}
                </Card.Text>
                <Link to={`/books/${item.id}`} className="btn btn-primary book-link">
                  View Details
                </Link>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <ErrorThrower />
    </Container>
  );
};

export default BookList;