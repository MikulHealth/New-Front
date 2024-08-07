import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  Text,
  PinInput,
  PinInputField,
  HStack,
} from "@chakra-ui/react";
import { useSelector } from "react-redux";

const TransactionPinModal = ({ isOpen, onClose, handleSubmit }) => {
  const { user } = useSelector((state) => state.userReducer);
  const [pin, setPin] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false); // New state for success status
  const transactionPinCreated = user?.transactionPinCreated;

  const handlePinSubmit = async () => {
    setIsLoading(true);
    const success = await handleSubmit(pin);
    setIsLoading(false);
    setIsSuccess(success); 
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={{ base: "sm", sm: "md", md: "lg" }}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader fontFamily="heading" color="#A210C6">
          {transactionPinCreated ? "Verify Transaction Pin" : "Create Transaction Pin"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {isSuccess ? (
            <Text fontWeight="body" mb={4}>
              {transactionPinCreated ? "Transaction pin verified successfully." : "Transaction pin created successfully."}
            </Text>
          ) : (
            <>
              <Text fontWeight="body" mb={4}>
                {transactionPinCreated
                  ? "Please enter your transaction pin to verify."
                  : "Please create a 4-digit transaction pin that you can remember easily."}
              </Text>
              <HStack justifyContent="center" spacing={4}>
                <PinInput
                  type="number"
                  value={pin}
                  onChange={setPin}
                  placeholder="*"
                  otp
                  size="lg"
                  autoFocus
                >
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                </PinInput>
              </HStack>
            </>
          )}
        </ModalBody>
        <ModalFooter>
          {isSuccess ? (
            <Button
              fontFamily="body"
              bg="gray.500"
              color="white"
              onClick={onClose}
            >
              Close
            </Button>
          ) : (
            <>
              <Button
                bg="#A210C6"
                color="white"
                mr={3}
                onClick={handlePinSubmit}
                fontFamily="body"
                isLoading={isLoading}
              >
                Submit
              </Button>
              <Button
                fontFamily="body"
                bg="gray.500"
                color="white"
                onClick={onClose}
              >
                Cancel
              </Button>
            </>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default TransactionPinModal;
