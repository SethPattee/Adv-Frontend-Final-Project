import React, { useState } from 'react';

const ErrorThrower: React.FC = () => {
  const [throwError, setThrowError] = useState(false);

  if (throwError) {
    throw new Error("User-triggered error: Something has gone wrong!");
  }

  return (
    <div className="my-4">
      <button
        className="btn btn-danger"
        onClick={() => setThrowError(true)} 
      >
        Throw Error
      </button>
    </div>
  );
};

export default ErrorThrower;
