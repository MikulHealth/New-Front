import { useSelector } from "react-redux";
import React, { useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
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
import { useNavigate } from "react-router-dom";
import logo from "../../assets/Whitelogo.svg";
import "react-toastify/dist/ReactToastify.css";

const WalletPaymentPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => state.userReducer);
  const location = useLocation();
  const { costOfService, appointmentId, beneficiary } = location.state;
  const toast = useToast();

  const formattedCost = (cost) => {
    const num = Number(cost);
    return num.toLocaleString("en-US");
  };

  const handleWalletPayment = async () => {
    setLoading(true);

    const customerId = user?.userId;
    const method = "WALLET";
    const narration = `Payment for appointment ${appointmentId}`;
    const currency = "NGN";
    const source = user?.walletId;
    const destination = "destination-wallet-id";
    const reference = "unique-transaction-reference";

    const payload = {
      customerId,
      appointmentId,
      amount: costOfService,
      method,
      narration,
      currency,
      source,
      destination,
      reference,
    };

    const apiUrl = `https://backend-c1pz.onrender.com/v1/api/wallets/payment`;
    // const apiUrl = `http://localhost:8080/v1/api/wallets/payment`;

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
          // title: "Success",
          description: "Payment successful",
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        setTimeout(() => {
          navigate("/client-dashboard");
        }, 3000);
      } else {
        setLoading(false);
        const errorMessage = response.data
          ? response.data.message
          : "Unknown error";
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
      });
    }
  };

  const handleCancel = () => {
    navigate("/client-dashboard");
  };

  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");
  const paymentFormWidth = isLargerThan768 ? "50%" : "90%";

  return (
    <Box height="100vh" bg="#510863" textAlign="center" color="white" p={4}>
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
    </Box>
  );
};

export default WalletPaymentPage;
