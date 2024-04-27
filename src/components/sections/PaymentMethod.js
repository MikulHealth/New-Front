import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Box,
  Text,
  Flex,
  Image,
} from "@chakra-ui/react";
// import RightArrow from "../../assets/RightArrow.svg";
import CardPayment from "../../assets/OnlinePayment.svg";
import Wallet from "../../assets/WalletIcon.svg";
import { useNavigate } from "react-router-dom";
function PaymentModal({ isOpen, onClose, paymentData }) {
  const navigate = useNavigate();

  const handleWalletPayment = () => {
    console.log("Paying with wallet...");
    // Here you'd add logic for wallet payment
    // For example, API call to process wallet payment with the `paymentData` provided
    // ...
    onClose(); // Close the modal after payment
  };

  const handleCardPayment = () => {
    console.log("Paying online...");
    const { id: appointmentId, costOfService, beneficiary } = paymentData;

    console.log("beneficiary", appointmentId);

    setTimeout(() => {
      navigate("/make-payment", {
        state: { costOfService, appointmentId, beneficiary },
      });
    }, 1000);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={{ base: "xs", sm: "md", md: "lg", lg: "xl" }}
    >
      <ModalOverlay />
      <ModalContent borderRadius="20px 20px 20px 0px" bg="#A210C6">
        <ModalHeader color="white">Choose payment method</ModalHeader>
        <ModalCloseButton color="white" />
        <ModalBody paddingBottom="25px">
          <Box
            bg="white"
            marginLeft="8px"
            borderRadius="15px"
            onClick={handleWalletPayment}
            style={{
              cursor: "",
            }}
            _hover={{ color: "#A210C6" }}
          >
            <Flex>
              <Image
                marginLeft="15px"
                marginTop="15px"
                w="30px"
                h="30px"
                boxSize={["20px", "30px"]}
                src={Wallet}
                alt="Settings"
              />
              <Box marginLeft="10px" padding="10px" paddingBottom="10px">
                <Text fontSize={["lg", "xl"]} fontWeight="bold">
                  Via Wallet
                </Text>
                <Text fontSize={["sm", "md"]}>
                  Make payment directly from your Mikul Health wallet
                </Text>
              </Box>
              {/* <Image
               display={{base: "none", md: "block"}}
                marginLeft="15px"
                marginTop="25px"
                w="30px"
                h="30px"
                boxSize={["20px", "30px"]}
                src={RightArrow}
                alt="Settings"
              /> */}
            </Flex>
          </Box>
          <Box
            bg="white"
            marginTop="15px"
            marginLeft="8px"
            borderRadius="15px"
            onClick={handleCardPayment}
            style={{
              cursor: "",
            }}
            _hover={{ color: "#A210C6" }}
          >
            <Flex>
              <Image
                marginLeft="15px"
                marginTop="15px"
                w="30px"
                h="30px"
                boxSize={["20px", "30px"]}
                src={CardPayment}
                alt="Settings"
              />
              <Box marginLeft="10px" padding="10px" paddingBottom="10px">
                <Text fontSize={["lg", "xl"]} fontWeight="bold">
                  Card Payment
                </Text>
                <Text fontSize={["sm", "md"]}>
                  Make payment for booking with card
                </Text>
              </Box>
              {/* <Image
              display={{base: "none", md: "block"}}
                marginLeft="15px"
                marginTop="25px"
                w="30px"
                h="30px"
                boxSize={["20px", "30px"]}
                src={RightArrow}
                alt="Settings"
              /> */}
            </Flex>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default PaymentModal;
