
import React, { ReactNode } from 'react';
import { toast } from 'react-hot-toast';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);

    toast.error(error.message || 'An error occurred.');
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container mt-5">
          <h1 className="text-center text-danger">Oops! Something went wrong.</h1>
          <p className="text-center text-muted">
            {this.state.error ? this.state.error.message : 'An unknown error occurred.'}
          </p>
          <p className="text-center">
            Please go back to the <a href="/">home page</a>.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
