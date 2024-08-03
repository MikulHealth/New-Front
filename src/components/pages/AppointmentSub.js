import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { baseUrl } from "../../apiCalls/config";
import { addDays, differenceInDays } from 'date-fns';
import {
  Box,
  extendTheme,
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
import TransactionPinModal from "../sections/TransactionPinModal";

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
    body: "Montserrat, sans-serif",
    heading: "Gill Sans MT, sans-serif",
  },
});

const AppSubscriptionPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [pinVerified, setPinVerified] = useState(false);
  const { user } = useSelector((state) => state.userReducer);
  const location = useLocation();
  const { costOfService, appointmentId, beneficiary, actualStartDate, actualEndDate } = location.state;
  const toast = useToast();
  const openPinModal = () => setPinModalOpen(true);
  const closePinModal = () => setPinModalOpen(false);


const calculateNewDates = (actualStartDate, actualEndDate) => {
  // Parse the dates to Date objects if they are not already
  const startDate = new Date(actualStartDate);
  const endDate = new Date(actualEndDate);

  // Calculate the duration in days between the start and end dates
  const durationInDays = differenceInDays(endDate, startDate);

  // Set the new start date as the actual end date
  const newStartDate = endDate;

  // Calculate the new end date by adding the duration to the new start date
  const newEndDate = addDays(newStartDate, durationInDays);

  return { newStartDate, newEndDate };
};

const { newStartDate, newEndDate } = calculateNewDates(actualStartDate, actualEndDate);
console.log(`New Start Date: ${newStartDate}`);
console.log(`New End Date: ${newEndDate}`);


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
    const destination = "destination-wallet-id";
    const reference = "unique-transaction-reference";
    const startDate = newStartDate;
    const endDate = newEndDate;

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
      startDate,
      endDate,
    };

    const apiUrl = `${baseUrl}/api/wallets/schedule-payment`;

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
          description: "Subscription payment successful",
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
      pt="10px"
      p={8}
      theme={customTheme}
    >
      <Box mb={4}>
        <Image src={logo} alt="Logo" w="100px" h="30px" />
      </Box>
      <Box color="white" mx="auto" w={paymentFormWidth}>
        <Text fontFamily="heading" fontSize="24px" fontWeight="bold" mb={4}>
          Confirm Subscription Payment
        </Text>
        <Box color="black" p={4} bg="white" borderRadius="xl">
          <Box textAlign="center">
            <Text
              fontFamily="body"
              fontSize={{ base: "16px", md: "18px" }}
              mb={4}
            >
              Hi {user?.firstName}, 
              <br></br>You are about to set up a re-occuring payment of{" "}
              <Text
                as="span"
                textDecoration="underline"
                fontWeight="bold"
                color="#510863"
              >
                ₦{formattedCost(costOfService)}
              </Text>{" "}
              when the appointment reaches it's end date, to proceed with your
              subscription for{" "}
              <Text
                as="span"
                textDecoration="underline"
                fontWeight="bold"
                color="#510863"
              >
                {beneficiary}'s
              </Text>{" "}
              care, ensure your wallet has the required amount mentioned above
              for the cost of service when the appointment reaches it's end date.
              <br></br>
              <br></br>
              With this setup, the current appointment would be re-booked with
              the same duration when the end date reaches and we successfully
              make a withdrawal from your wallet.
              <br></br>
              <br></br>
              At any point if you wish to cancel the subscription, you can do so
              from the dashboard.
            </Text>
          </Box>

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
              {loading ? "Processing..." : "Process subscription"}
            </Button>
            <Button
              marginLeft="5px"
              bg="#E1ACAE"
              color="red.500"
              onClick={handleCancel}
              _hover={{ bg: "red.500", color: "white" }}
            >
              Cancel subscription
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

export default AppSubscriptionPage;
