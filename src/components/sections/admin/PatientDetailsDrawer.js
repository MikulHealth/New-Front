import React from 'react';
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Avatar,
  Text,
  VStack,
  Divider,
  Flex
} from "@chakra-ui/react";

const PatientDetailsDrawer = ({ isOpen, onClose, patient }) => {
  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
      <DrawerOverlay />
      <DrawerContent bg="#4B4B4B" color="white">
        <DrawerCloseButton />
        <DrawerHeader>Patient Details</DrawerHeader>
        <DrawerBody>
          <VStack align="left" spacing={4}>
            <Flex justifyContent="center">
              <Avatar size="xl" name={`${patient.recipientFirstName} ${patient.recipientLastName}`} />
            </Flex>
            <Text fontSize="2xl" fontWeight="bold">
              {patient.recipientFirstName} {patient.recipientLastName}
            </Text>
            <Text>Email: {patient.recipientEmail || "N/A"}</Text>
            <Text>Phone Number: {patient.recipientPhoneNumber}</Text>
            <Text>Gender: {patient.recipientGender}</Text>
            <Text>Date of Birth: {new Date(patient.recipientDOB).toLocaleDateString()}</Text>
            <Text>Relationship: {patient.relationship || "N/A"}</Text>
            <Text>Policy Number: {patient.policyNumber}</Text>
            <Text>Customer Phone Number: {patient.customerPhoneNumber}</Text>
            <Divider />
            <Text fontSize="lg" fontWeight="bold">
              Additional Information
            </Text>
            <Text>Customer ID: {patient.customerId || "N/A"}</Text>
            <Text>Saved: {patient.saved ? "Yes" : "No"}</Text>
            <Text>Created On: {new Date(patient.createdAt).toLocaleDateString()}</Text>
          </VStack>
        </DrawerBody>
        <DrawerFooter justifyContent="space-between">
          <Button variant="outline" colorScheme="blue" onClick={() => alert('Edit Beneficiary Details')}>
            Edit Beneficiary Details
          </Button>
          <Button variant="outline" colorScheme="red" onClick={() => alert('Remove Beneficiary')}>
            Remove Beneficiary
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default PatientDetailsDrawer;
