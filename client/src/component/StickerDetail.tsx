import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, Container, Row, Col } from 'react-bootstrap';
import { useQuery } from '@tanstack/react-query';
import apiService from './apiService';
import Spinner from './Spinner';

const StickerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const { data: inventory, isLoading, error } = useQuery({
    queryKey: ['inventory'],
    queryFn: apiService.getInventory,
  });

  if (isLoading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <h1>Error loading book details</h1>
        <p>{(error as Error).message}</p>
        <Link to="/stickers" className="btn btn-primary">
          Back to List
        </Link>
      </Container>
    );
  }

  const book = inventory?.find((b) => b.id === id);

  if (!book) {
    return (
      <Container>
        <h1>Sticker not found</h1>
        <Link to="/stickers" className="btn btn-primary">
          Back to List
        </Link>
      </Container>
    );
  }

  return (
    <Container>
      <h1>Sticker Details</h1>
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>{book.title}</Card.Title>
              <Card.Subtitle>{book.author || 'Unknown Price'}</Card.Subtitle>
              <Card.Text>{book.description || 'No description available.'}</Card.Text>
              <Link to="/stickers" className="btn btn-primary">
                Back to List
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default StickerDetail;
