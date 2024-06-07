// PatientReportDrawer.js
import React, { useState } from "react";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
  Input,
  FormControl,
  FormLabel,
  Box,
} from "@chakra-ui/react";
import axios from "axios";

const PatientReportDrawer = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    temperature: "",
    bloodPressure: "",
    pulse: "",
    bloodSugar: "",
    sp02: "",
    respiration: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        "https://your-backend-api.com/patient-report",
        formData
      );
      console.log("Report submitted successfully:", response.data);
      onClose(); // Close the drawer on success
    } catch (error) {
      console.error("Error submitting report:", error);
    }
  };

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="lg">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Patient report</DrawerHeader>
        <DrawerBody>
          <FormControl isRequired mb="4">
            <FormLabel>Temperature</FormLabel>
            <Input
              name="temperature"
              placeholder="Temperature"
              value={formData.temperature}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl isRequired mb="4">
            <FormLabel>Blood pressure</FormLabel>
            <Input
              name="bloodPressure"
              placeholder="Blood pressure"
              value={formData.bloodPressure}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl isRequired mb="4">
            <FormLabel>Pulse</FormLabel>
            <Input
              name="pulse"
              placeholder="Pulse"
              value={formData.pulse}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl isRequired mb="4">
            <FormLabel>Blood sugar</FormLabel>
            <Input
              name="bloodSugar"
              placeholder="Blood sugar"
              value={formData.bloodSugar}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl isRequired mb="4">
            <FormLabel>SpO2</FormLabel>
            <Input
              name="sp02"
              placeholder="SpO2"
              value={formData.sp02}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl isRequired mb="4">
            <FormLabel>Respiration</FormLabel>
            <Input
              name="respiration"
              placeholder="Respiration"
              value={formData.respiration}
              onChange={handleChange}
            />
          </FormControl>
        </DrawerBody>
        <DrawerFooter>
          <Button variant="outline" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button bg="#A210C6" color="white" onClick={handleSubmit}>
            Submit Report
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default PatientReportDrawer;
