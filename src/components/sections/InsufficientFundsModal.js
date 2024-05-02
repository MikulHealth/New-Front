import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { WarningIcon } from "@chakra-ui/icons";
function InsufficientFundsModal({ isOpen, onClose }) {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/wallet");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      motionPreset="slideInBottom"
      size="md"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {" "}
          <WarningIcon w={10} h={10} color="yellow.400" />{" "}
          <Text color="#A210C6"> Insufficient Funds </Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text fontSize="md" mb={4}>
            You do not have enough funds to pay for this service. Kindly
            fund your wallet with the necessary amount to proceed.
          </Text>
        </ModalBody>
        <ModalFooter>
          <Button color="white" bg="#A210C6" mr={3} onClick={handleNavigate}>
            Go to Wallet
          </Button>
          <Button color="white" bg="yellow.500" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default InsufficientFundsModal;
