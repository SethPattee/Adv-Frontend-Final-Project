import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import './sass.sass';
import InventoryProviderWithClient from './component/InventoryContext';
import { Container, Row, Col } from "react-bootstrap";
import ErrorBoundary from './component/ErrorBoundry';
import BookList from './component/BookList';
import BookDetail from './component/BookDetail';
import InventoryDisplay from './component/InventoryDisplay';
import InventoryManagement from './component/InventoryManagment';
import Spinner from './component/Spinner';
import InventoryForm from './component/InventoryForm';
import TanStack from './component/TanStack';
import LoginButton from './AuthLogic/LoginButton';
import Providers from './AuthLogic/provider';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import Navbar from './component/Navbar';
import { ThemeProvider } from './context/ThemeContext';
const queryClient = new QueryClient();
const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Providers>
        <ThemeProvider>
        <InventoryProviderWithClient>
          <LoginButton />
          <ErrorBoundary> 
            <Router>
              <Toaster position="top-right" />
              <Navbar />
              <Container className="mt-4 content">
                <Row>
                  <Col>
                    <Routes>
                      <Route
                        path="/"
                        element={<h1 className="text-center">Welcome to BookStore</h1>}
                      />
                      <Route path="/books" element={<BookList />} />
                      <Route path="/books/:id" element={<BookDetail />} />
                      <Route path="/inv" element={<InventoryDisplay />} />
                      <Route path="/inventory" element={<InventoryManagement />} />
                      <Route path="/spin" element={<Spinner />} />
                      <Route path="/tan" element={<TanStack />} />
                    </Routes>
                    <InventoryForm />
                  </Col>
                </Row>
              </Container>
            </Router>
          </ErrorBoundary>
        </InventoryProviderWithClient>
        </ThemeProvider>
      </Providers>
    </QueryClientProvider>
  );
};

export default App;
