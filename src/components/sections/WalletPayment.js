import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { baseUrl } from "../../apiCalls/config";
import {
  Box,
  Text,
  useMediaQuery,
  Flex,
  Button,
  Image,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import logo from "../../assets/Whitelogo.svg";
import "react-toastify/dist/ReactToastify.css";
import TransactionPinModal from "./TransactionPinModal";

const WalletPaymentPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [pinVerified, setPinVerified] = useState(false);
  const { user } = useSelector((state) => state.userReducer);
  const location = useLocation();
  const { costOfService, appointmentId, beneficiary } = location.state;
  const toast = useToast();
  const openPinModal = () => setPinModalOpen(true);
  const closePinModal = () => setPinModalOpen(false);

  const formattedCost = (cost) => {
    const num = Number(cost);
    return num.toLocaleString("en-US");
  };

  const handleWalletPayment = async () => {
    if (!pinVerified) {
      openPinModal();
      return;
    }

    setLoading(true);

    const customerId = user?.userId;
    const method = "WALLET";
    const narration = `Payment for appointment ${appointmentId}`;
    const currency = "NGN";
    const source = user?.walletId;
    const reference = appointmentId;

    const payload = {
      customerId,
      appointmentId,
      amount: costOfService,
      method,
      narration,
      currency,
      source,
      reference,
    };

    const apiUrl = `${baseUrl}/api/wallets/payment`;

    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.post(apiUrl, payload, { headers });

      if (response.data.success) {
        setLoading(false);
        toast({
          description: "Payment successful",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });

        setTimeout(() => {
          navigate("/client-dashboard");
        }, 3000);
      } else {
        setLoading(false);
        const errorMessage = response.data.message || "Unknown error";
        toast({
          title: "Error",
          description: errorMessage,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      setLoading(false);
      toast({
        title: "Error",
        description: "Error making payment",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  const handleCancel = () => {
    navigate("/client-dashboard");
  };

  const handlePinSubmit = async (pin) => {
    try {
      if (user?.transactionPinCreated) {
        const response = await axios.post(
          `${baseUrl}/api/wallets/transaction-pin/match`,
          {
            userId: user?.userId,
            pin,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.data.success) {
          setPinVerified(true);
          closePinModal();
          handleWalletPayment();
        } else {
          throw new Error("Incorrect transaction pin");
        }
      } else {
        const response = await axios.post(
          `${baseUrl}/api/wallets/transaction-pin/create`,
          {
            userId: user?.userId,
            pin,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.data.success) {
          setPinVerified(true);
          closePinModal();
          handleWalletPayment();
        } else {
          throw new Error("Incorrect transaction pin");
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");
  const paymentFormWidth = isLargerThan768 ? "50%" : "90%";

  return (
    <Box
      height="100vh"
      bg="linear-gradient(80deg, #510863, #E552FF)"
      textAlign="center"
      color="white"
      p={4}
    >
      <Box mb={4}>
        <Image src={logo} alt="Logo" w="100px" h="30px" />
      </Box>
      <Box color="white" mx="auto" w={paymentFormWidth}>
        <Text fontSize="24px" fontWeight="bold" mb={4}>
          Confirm Payment
        </Text>
        <Box color="black" p={4} bg="white" borderRadius="xl">
          <Text fontSize="20px" mb={4}>
            Hi {user?.firstName}, kindly pay the sum of{" "}
            <Text
              as="span"
              textDecoration="underline"
              fontWeight="bold"
              color="#510863"
            >
              ₦{formattedCost(costOfService)}
            </Text>{" "}
            to proceed with your booking for{" "}
            <Text
              as="span"
              textDecoration="underline"
              fontWeight="bold"
              color="#510863"
            >
              {beneficiary}'s
            </Text>{" "}
            care. You would be matched with a caregiver within 48hrs upon a
            successful payment.
          </Text>
          <Flex display={{ base: "flex", md: "block" }}>
            <Button
              _hover={{ color: "" }}
              bg="green.400"
              color="white"
              onClick={handleWalletPayment}
              isLoading={loading}
              loadingText="Processing..."
              spinner={<Spinner color="white" />}
            >
              {loading ? "Processing..." : "Process payment"}
            </Button>
            <Button
              marginLeft="5px"
              bg="#E1ACAE"
              color="red.500"
              onClick={handleCancel}
              _hover={{ bg: "red.500", color: "white" }}
            >
              Cancel payment
            </Button>
          </Flex>
        </Box>
      </Box>

      <TransactionPinModal
        isOpen={pinModalOpen}
        onClose={() => setPinModalOpen(false)}
        handleSubmit={handlePinSubmit}
      />
    </Box>
  );
};

export default WalletPaymentPage;
