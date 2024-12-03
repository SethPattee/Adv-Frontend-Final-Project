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
import ErrorThrower from './component/ErrorThrower';
import GenericFormInput from './component/GenericFormInputBlogProfile';
import BlogPage from './component/BlogPage';
import FeedbackPage from './component/FeedbackPage';
import ContactPage from './component/ContactPage';
import GenericPage from './component/usedgeneric/GenericPage';
import StarGallery from './component/usedgeneric/StarGallery';
import SpinningWheel from './component/usedgeneric/SpinningWheel';
import LinksPage from './component/LinksPage';
const queryClient = new QueryClient();
const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Providers>
        <ThemeProvider>
        <InventoryProviderWithClient>
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
                        element={<h1 className="text-center">Welcome to the Cosmos</h1>}
                      />
                      <Route path="/books" element={<BookList />} />
                      <Route path="/books/:id" element={<BookDetail />} />
                      <Route path="/inv" element={<InventoryDisplay />} />
                      <Route path="/inventory" element={<InventoryManagement />} />
                      <Route path="/tan" element={<TanStack />} />
                      <Route path="/e" element={<ErrorThrower />} />
                      <Route path="/g" element={<BlogPage />} />
                      <Route path="/f" element={<FeedbackPage />} />
                      <Route path="/c" element={<ContactPage />} />
                      <Route path="/gen" element={<GenericPage />} />
                      <Route path="/gallery" element={<StarGallery />} />
                      <Route path="/spin" element={<SpinningWheel />} />
                      <Route path="/links" element={<LinksPage />} />
                    </Routes>
                    {/* <InventoryForm /> */}
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
