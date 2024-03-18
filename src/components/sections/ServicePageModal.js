import React from "react";
import { Modal, ModalOverlay, ModalContent, ModalCloseButton } from "@chakra-ui/react";
import ServicesPage from "../pages/Services";
import {
    Box,
    Button,
    Flex,
    VStack,
    Image,
    extendTheme,
    ChakraProvider,
    Text,
    useToast,
  } from "@chakra-ui/react";

const ServicesModal = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="5xl">
      <ModalOverlay />
      <ModalContent p={2} borderRadius="md" overflowY="auto">
        <ModalCloseButton />
        <ServicesPage />
        <Box h="15vh"></Box>
      </ModalContent>
    </Modal>
  );
};

export default ServicesModal;
