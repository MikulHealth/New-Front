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
//   Box,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { WarningIcon } from "@chakra-ui/icons";

function InsufficientFundsModal({ isOpen, onClose, amountNeeded }) {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/wallet");
    onClose();
  };

  
  const formattedCost = (cost) => {
    const num = Number(cost);
    return num.toLocaleString("en-US");
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
          {/* <Box display="flex" alignItems="center" justifyContent="center"> */}
            <WarningIcon w={10} h={10} color="yellow.400" />
            <Text color="#A210C6" marginLeft={2}>Insufficient Funds</Text>
          {/* </Box> */}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text fontSize="md" mb={4}>
            You do not have enough funds to pay for this service. Please fund your wallet with at least
            <Text color="#A210C6" as="span" fontWeight="bold"> {' ₦' + formattedCost(amountNeeded)} </Text>
            to proceed.
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
