import React, { ReactNode, useEffect } from 'react';
import { toast } from 'react-hot-toast';

interface ErrorBoundaryProps {
  children: ReactNode;
}

const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ children }) => {
  const [hasError, setHasError] = React.useState<boolean>(false);
  const [error, setError] = React.useState<Error | null>(null);

  useEffect(() => {
    if (hasError && error) {
      // Display an error toast
      toast.error(error.message || 'An error occurred. Please check the console for more details.');
    }
  }, [hasError, error]);

  // This error boundary will catch errors in the children components
  const handleError = (error: Error) => {
    setHasError(true);
    setError(error);
  };

  if (hasError) {
    return (
      <div className="container mt-5">
        <h1 className="text-center text-danger">Oops! Something went wrong.</h1>
        <p className="text-center text-muted">
          {error ? error.message : 'An unknown error occurred.'}
        </p>
        <p className="text-center">
          Please go back to the <a href="/">home page</a>.
        </p>
      </div>
    );
  }

  return <ErrorBoundaryWrapper onError={handleError}>{children}</ErrorBoundaryWrapper>;
};

// Wrapper for child components that catches errors
const ErrorBoundaryWrapper: React.FC<{ children: ReactNode; onError: (error: Error) => void }> = ({ children, onError }) => {
  try {
    return <>{children}</>;
  } catch (error) {
    onError(error instanceof Error ? error : new Error('Unknown error'));
    return null;
  }
};

export default ErrorBoundary;




// import React, { Component, ReactNode, useRef } from 'react';

// interface ErrorBoundaryProps {
//   children: ReactNode;
// }

// interface ErrorBoundaryState {
//   hasError: boolean;
//   error: Error | null;
// }


// class ErrorBoundaryClass extends Component<
//   ErrorBoundaryProps & { addToast: (message: string, type: "success" | "error" | "info", duration?: number) => void },
//   ErrorBoundaryState
// > {
//   constructor(props: ErrorBoundaryProps & { addToast: (message: string, type: "success" | "error" | "info", duration?: number) => void }) {
//     super(props);
//     this.state = { hasError: false, error: null };
//   }

//   static getDerivedStateFromError(error: Error) {
//     return { hasError: true, error };
//   }

//   componentDidCatch(error: Error, info: React.ErrorInfo) {
//     console.error("ErrorBoundary caught an error", error, info);
//     this.props.addToast(
//       error.message || 'An error occurred. Please check the console for more details.',
//       'error'
//     );
//   }

//   render() {
//     if (this.state.hasError) {
//       return (
//         <div className="container mt-5">
//           <h1 className="text-center text-danger">Oops! Something went wrong.</h1>
//           <p className="text-center text-muted">
//             {this.state.error ? this.state.error.message : "An unknown error occurred."}
//           </p>
//           <p className="text-center">
//             Please go back to the <a href="/">home page</a>.
//           </p>
//         </div>
//       );
//     }

//     return this.props.children;
//   }
// }

// const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ children }) => {
//   const { addToast } = useToast();  
//   const errorBoundaryRef = useRef<ErrorBoundaryClass>(null); 

//   return <ErrorBoundaryClass ref={errorBoundaryRef} addToast={addToast}>{children}</ErrorBoundaryClass>;
// };

// export default ErrorBoundary;

