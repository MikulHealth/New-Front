// GoogleMapsConfig.js
import React from 'react';
import { LoadScript } from '@react-google-maps/api';
const libraries = ["places"];
const googleMapsApiKey = "AIzaSyAGHpgeiFAzUQqrosmbd2G531zmD9zgiI8"; 

const GoogleMapsConfig = ({ children }) => {
  return (
    <LoadScript
      googleMapsApiKey={googleMapsApiKey}
      libraries={libraries}
    >
      {children}
    </LoadScript>
  );
};

export default GoogleMapsConfig;
