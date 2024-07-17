import React, { useState } from "react";
import axios from "axios";
import { baseUrl } from "../../apiCalls/config";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Divider,
  Flex,
  Text,
  Spinner,
  useToast,
} from "@chakra-ui/react";

const ReviewBankModal = ({ isOpen, onClose, bankDetails, onSave }) => {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${baseUrl}/api/wallets/add-bank`, bankDetails);
    if (response.data.success) {
        setIsLoading(false);
         toast({
        title: "Success",
        description: "Bank details saved successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
        onClose();
      onSave(response.data);
      } else {
        setIsLoading(false);
        console.error("Bank details failed to save");
        const errorMessage = response.data
          ? response.data.message
          : "Unknown failure";
          toast({
           
            description: errorMessage,
            status: "error",
            duration: 5000,
            isClosable: true,
          });
      }
     
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Failed to save bank details",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (!bankDetails) {
    return null;
  }

  return (
    <Modal
      size={{ base: "sm", md: "md" }}
      isOpen={isOpen}
      onClose={onClose}
      isCentered
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader fontSize={{base: "14px", md: "16px"}}>
          Please review and confirm your bank information
        </ModalHeader>
        <ModalBody>
          <FormControl>
            <Flex justifyContent="space-between">
              <FormLabel color="#21242780" fontSize="14">
                Account Number
              </FormLabel>
              <Text>{bankDetails.accountNumber}</Text>
            </Flex>
          </FormControl>
          <Divider my={4} borderColor="gray.500" />
          <FormControl mt={4}>
            <Flex justifyContent="space-between">
              <FormLabel color="#21242780" fontSize="14">
                Account Name
              </FormLabel>
              <Text>{bankDetails.accountName}</Text>
            </Flex>
          </FormControl>
          <Divider my={4} borderColor="gray.500" />
          <FormControl mt={4}>
            <Flex justifyContent="space-between">
              <FormLabel color="#21242780" fontSize="14">
                Bank Name
              </FormLabel>
              <Text>{bankDetails.bankName}</Text>
            </Flex>
          </FormControl>
          <Divider my={4} borderColor="gray.500" />
        </ModalBody>
        <ModalFooter>
          <Button bg="#A210C6" color="white" onClick={handleSubmit} isLoading={isLoading}>
            {isLoading ? <Spinner size="sm" /> : "Submit"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ReviewBankModal;
