import type React from 'react';
import { Component, type ErrorInfo } from 'react';
import toast from 'react-hot-toast';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    toast.error('An unexpected error occurred. Please try again later.');
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 max-w-md mx-auto bg-red-100 text-red-700 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold">Something went wrong</h1>
          <p>We're sorry, but an error occurred while rendering this page.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
