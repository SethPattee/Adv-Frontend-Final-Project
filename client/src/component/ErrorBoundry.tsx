// import React, { ReactNode, useEffect } from 'react';
// import { toast } from 'react-hot-toast';

// interface ErrorBoundaryProps {
//   children: ReactNode;
// }

// const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ children }) => {
//   const [hasError, setHasError] = React.useState<boolean>(false);
//   const [error, setError] = React.useState<Error | null>(null);

//   useEffect(() => {
//     if (hasError && error) {
//       toast.error(error.message || 'An error occurred. Please check the console for more details.');
//     }
//   }, [hasError, error]);

//   const handleError = (error: Error) => {
//     setHasError(true);
//     setError(error);
//   };

//   if (hasError) {
//     return (
//       <div className="container mt-5">
//         <h1 className="text-center text-danger">Oops! Something went wrong.</h1>
//         <p className="text-center text-muted">
//           {error ? error.message : 'An unknown error occurred.'}
//         </p>
//         <p className="text-center">
//           Please go back to the <a href="/">home page</a>.
//         </p>
//       </div>
//     );
//   }

//   return <ErrorBoundaryWrapper onError={handleError}>{children}</ErrorBoundaryWrapper>;
// };

// const ErrorBoundaryWrapper: React.FC<{ children: ReactNode; onError: (error: Error) => void }> = ({ children, onError }) => {
//   try {
//     return <>{children}</>;
//   } catch (error) {
//     onError(error instanceof Error ? error : new Error('Unknown error'));
//     return null;
//   }
// };

// export default ErrorBoundary;



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
    // Update state so the next render shows the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log error details (optional)
    console.error('Error caught by ErrorBoundary:', error, errorInfo);

    // Show a toast notification for the error
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
