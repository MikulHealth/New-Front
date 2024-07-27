// AddressInput.js
import React, { useState, useRef } from 'react';
import { Input, Box, List, ListItem } from "@chakra-ui/react";

const AddressInput = ({ value, onChange }) => {
  const [predictions, setPredictions] = useState([]);
  const [inputValue, setInputValue] = useState(value);
  const autocompleteService = useRef(null);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    onChange(value);

    if (value) {
      if (!autocompleteService.current) {
        autocompleteService.current = new window.google.maps.places.AutocompleteService();
      }
      autocompleteService.current.getPlacePredictions(
        {
          input: value,
          componentRestrictions: { country: "NG" },
        },
        (predictions, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            const filteredPredictions = predictions.filter((prediction) =>
              prediction.description.includes("Lagos")
            );
            setPredictions(filteredPredictions);
          } else {
            setPredictions([]);
          }
        }
      );
    } else {
      setPredictions([]);
    }
  };

  const handlePredictionClick = (prediction) => {
    setInputValue(prediction.description);
    setPredictions([]);
    onChange(prediction.description);
  };

  return (
    <Box w={{ base: "full", md: "550px" }}>
      <Input
        type="text"
        placeholder="Location"
        value={inputValue}
        onChange={handleInputChange}
        w={{ base: "full", md: "550px" }}
      />
      {predictions.length > 0 && (
        <List
          border="1px solid #ccc"
          borderRadius="5px"
          mt="2"
          maxH="200px"
          overflowY="auto"
        >
          {predictions.map((prediction) => (
            <ListItem
              key={prediction.place_id}
              p="2"
              cursor="pointer"
              _hover={{ backgroundColor: "gray.100" }}
              onClick={() => handlePredictionClick(prediction)}
            >
              {prediction.description}
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default AddressInput;
