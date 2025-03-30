import React from 'react';

const LoadingView: React.FC = () => {
  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <h2>Generating transcript and SOAP note</h2>
      <p>This may take a few moments...</p>
    </div>
  );
};

export default LoadingView; 