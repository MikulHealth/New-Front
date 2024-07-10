// import React, { useState, useRef } from 'react';
// import { StandaloneSearchBox } from '@react-google-maps/api';
// import { Input } from "@chakra-ui/react";

// const AutocompleteInput = ({ onPlaceSelected, value }) => {
//   const [inputValue, setInputValue] = useState(value || "");
//   const searchBoxRef = useRef(null);

//   const handlePlaceChanged = () => {
//     const places = searchBoxRef.current.getPlaces();
//     if (places.length === 0) return;

//     const place = places[0];
//     const address = place.formatted_address;
//     setInputValue(address);
//     onPlaceSelected(address);
//   };

//   return (
//     <StandaloneSearchBox
//       onLoad={ref => (searchBoxRef.current = ref)}
//       onPlacesChanged={handlePlaceChanged}
//     >
//       <input
//         type="text"
//         placeholder="Enter your address"
//         value={inputValue}
//         onChange={(e) => setInputValue(e.target.value)}
//         // style={{
//         //   boxSizing: `border-box`,
//         //   border: `1px solid transparent`,
//         //   width: `100%`,
//         //   height: `40px`,
//         //   padding: `0 12px`,
//         //   borderRadius: `3px`,
//         //   boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
//         //   fontSize: `16px`,
//         //   outline: `none`,
//         //   textOverflow: `ellipses`,
//         // }}
//       />
//     </StandaloneSearchBox>
//   );
// };

// export default AutocompleteInput;
