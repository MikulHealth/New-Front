import { useSelector } from "react-redux";
import React, { useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import {
  Box,
  useToast,
  // extendTheme,
  Text,
  // Link as ChakraLink,
  useMediaQuery,
 
  Flex,
  Button,
  Image,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/Whitelogo.svg";

// const customTheme = extendTheme({
//   components: {
//     Link: {
//       baseStyle: {
//         _focus: {
//           boxShadow: "none",
//         },
//       },
//     },
//   },
//   fonts: {
//     body: "Gill Sans MT, sans-serif",
//     heading: "Gill Sans MT, sans-serif",
//   },
// });

const WalletPaymentPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const { user } = useSelector((state) => state.userReducer);
  const location = useLocation();
  const { costOfService, appointmentId, beneficiary } = location.state;

  console.log("cost ", costOfService);
  console.log("ID ", appointmentId);

 
  const formattedCost = (cost) => {
    // Divide costOfService by 100 to represent the amount in naira
    const costInNaira = cost / 100;

    // Format the costOfService as naira with the last two zeros separated by a dot
    const formattedCost =
      "₦ " + costInNaira.toLocaleString("en-NG", { maximumFractionDigits: 2 });

    return formattedCost;
  };

const handleWalletPayment = async () => {
    setLoading(true);
    console.log("Paying with wallet...");
    const customerId = user?.userId;
    const amount = costOfService / 100;
    
    const method = "WALLET"; 
  
    // const apiUrl = `http://localhost:8080/v1/api/wallets/withdraw?customerId=${encodeURIComponent(customerId)}&appointmentId=${encodeURIComponent(appointmentId)}&amount=${encodeURIComponent(amount)}&method=${encodeURIComponent(method)}`;
    const apiUrl = `https://backend-c1pz.onrender.com/v1/api/wallets/withdraw?customerId=${encodeURIComponent(customerId)}&appointmentId=${encodeURIComponent(appointmentId)}&amount=${encodeURIComponent(amount)}&method=${encodeURIComponent(method)}`;
  
    console.log("Amount being sent:", amount);
    const payload = {
        customerId: encodeURIComponent(customerId),
        amount: encodeURIComponent(amount),
        method: encodeURIComponent(method)
    };
    console.log("Payload:", payload);

    try {
      const token = localStorage.getItem("token"); 
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
  
      // Making the API call to withdraw from the wallet
      const response = await axios.post(apiUrl, {}, { headers });
  
      if (response.data.success) {
        setLoading(false);
  
        toast({
          title: "Payment Successful",
          status: "success",
          duration: 6000,
        });
       
        setTimeout(() => {
          navigate("/dashboard"); 
        }, 3000);

      } else {
        setLoading(false);
  
        console.error("Error Making Payment");
        const errorMessage = response.data
          ? response.data.message
          : "Unknown error";
        toast({
          title: "Payment failed",
          description: errorMessage,
          status: "error",
          duration: 6000,
        });
      }
    } catch (error) {
      setLoading(false);
      console.error("An error occurred:", error);
      toast({
        title: "Error Making payment",
        description: error.response?.data?.message || "Unknown error",
        status: "error",
        duration: 6000,
      });
    }
  };

  const handleCancel = () => {
    navigate("/dashboard");
    window.location.reload();
  };

  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");
  const paymentFormWidth = isLargerThan768 ? "50%" : "90%";

  return (
    <Box height="100vh" bg="#510863" textAlign="center" color="white" p={4}>
      <Box mb={4}>
        <Image
           src={logo}
          alt="Logo"
          w="100px"
          h="30px"
        />
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
                {formattedCost(costOfService)}
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
                  onClick={handleWalletPayment }
                  isLoading={loading}
                  loadingText="Processing..."
                >
                 {loading ? "Processing..." : "Process payment"}
                </Button>
                <Button
                  marginLeft="5px"
                  bg="red.400"
                  color="white"
                  onClick={handleCancel}
                  _hover={{ bg: "red.500" }}
                >
                  Cancel Payment
                </Button>
              </Flex>
          
          </Box>
       
      </Box>
    </Box>
  );
};

export default WalletPaymentPage;
