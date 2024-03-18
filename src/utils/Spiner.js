import React from 'react';
import PropTypes from 'prop-types';
import "./spiner.css"; 


const LoadingSpinner = ({ size }) => {
  const spinnerSize = `${size}px`;
  return (
    <div className="loading-spinner" style={{ width: spinnerSize, height: spinnerSize }}>
      <div className="spinner-inner" />
    </div>
  );
};

LoadingSpinner.propTypes = {
  size: PropTypes.number,
};

LoadingSpinner.defaultProps = {
  size: 40,
};

export default LoadingSpinner;
