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
  useMediaQuery,
  extendTheme,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { WarningIcon } from "@chakra-ui/icons";

const customTheme = extendTheme({
  components: {
    Link: {
      baseStyle: {
        _focus: {
          boxShadow: "none",
        },
      },
    },
  },
  fonts: {
    body: "Gill Sans MT, sans-serif",
    heading: "Gill Sans MT, sans-serif",
  },
});

function InsufficientFundsModal({ isOpen, onClose, amountNeeded }) {
  const navigate = useNavigate();
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");
  const modalWidth = isLargerThan768 ? "400px" : "90vw";
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
      theme={customTheme}
      isOpen={isOpen}
      onClose={onClose}
      motionPreset="slideInBottom"
      size="md"
    >
      <ModalOverlay />
      <ModalContent width={modalWidth} borderRadius="25px 25px 25px 0px">
        <ModalHeader>
          {/* <Box display="flex" alignItems="center" justifyContent="center"> */}
          <WarningIcon w={10} h={10} color="yellow.400" />
          <Text fontFamily="heading" color="#A210C6" fontSize={{base: "18px", md: "24px"}}>
            Insufficient Funds
          </Text>
          {/* </Box> */}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text fontFamily="body" fontSize="md" mb={4}>
            You do not have enough funds to pay for this service. Please fund
            your wallet with at least
            <Text color="#A210C6" as="span" fontWeight="bold">
              {" "}
              {" ₦" + formattedCost(amountNeeded)}{" "}
            </Text>
            to proceed.
          </Text>
        </ModalBody>
        <ModalFooter>
          <Button
            fontFamily="body"
            color="white"
            bg="#A210C6"
            mr={3}
            onClick={handleNavigate}
          >
            Open Wallet
          </Button>
          <Button
            fontFamily="body"
            color="white"
            bg="gray.500"
            onClick={onClose}
          >
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default InsufficientFundsModal;
