import { useSelector } from "react-redux";
import React, { useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import {
  Box,
  // useToast,
  // extendTheme,
  Text,
  // Link as ChakraLink,
  useMediaQuery,
  FormControl,
  FormLabel,
  Input,
  Flex,
  Button,
  Image,
} from "@chakra-ui/react";
import { PaystackButton } from "react-paystack";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/Whitelogo.svg";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

const PaymentConfirmationPage = () => {
  const navigate = useNavigate();
  const [loading] = useState(false);
  // const toast = useToast();
  const { user } = useSelector((state) => state.userReducer);
  const location = useLocation();
  const { costOfService, appointmentId, beneficiary } = location.state;
  const amountInKobo = parseInt(costOfService * 100); 


  const [paymentData, setPaymentData] = useState({
    email: user?.email || "",
    amount: amountInKobo,
    reference: appointmentId,
    name: `${user?.firstName || ""} ${user?.lastName || ""}`,
    phone: user?.phoneNumber || "",
    publicKey: "pk_test_be79821835be2e8689484980b54a9785c8fa0778",
  });

  console.log("cost ", costOfService);
  console.log("ID ", appointmentId);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentData({
      ...paymentData,
      [name]: value,
    });
  };

  
  const formattedCost = (cost) => {
    const num = Number(cost);
    return num.toLocaleString("en-US");
  };

  const handlePaymentSuccess = (response) => {
    verifyPayment();
  };

  const handlePaymentFailure = (error) => {
    toast.error("Payment failed, please try again later");
  };

  const verifyPayment = async () => {
    toast.success("Please wait, while we verify your payment");
    try {
      const token = localStorage.getItem("token");
      console.log("ID is " + appointmentId);
      // const apiUrl = `http://localhost:8080/v1/payment/verify/${appointmentId}`;
      const apiUrl = `https://backend-c1pz.onrender.com/v1/payment/verify/${appointmentId}`;

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.get(apiUrl, { headers });
      console.log(response.data);

      if (response.data.status === true) {
        setPaymentData({
          email: "",
          amount: " ",
          reference: " ",
          name: " ",
          phone: " ",
          publicKey: " ",
        });
        toast.success("Payment verified");
        setTimeout(() => {
          navigate("/dashboard")
        }, 5000);
        // window.location.reload();
      } else {
        toast.error("Payment verification failed, please cancel and try again");
        console.error("Payment verification failed");
      }
    } catch (error) {
      toast.error("Payment verification failed, please cancel and try again");
      console.error("An error occurred during payment verification:", error);
    }
  };

  const handlePayment = (e) => {
    e.preventDefault();
  };

  const handleCancel = () => {
    navigate("/dashboard");
    // window.location.reload();
  };

  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");
  const paymentFormWidth = isLargerThan768 ? "50%" : "90%";

  return (
    <Box height="100vh" bg="#510863" textAlign="center" color="white" p={4}>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Box mb={4}>
        <Image src={logo} alt="Logo" w="100px" h="30px" />
      </Box>
      <Box color="white" mx="auto" w={paymentFormWidth}>
        <Text fontSize="24px" fontWeight="bold" mb={4}>
          Confirm Payment
        </Text>
        <form onSubmit={handlePayment}>
          <Box color="black" p={4} bg="white" borderRadius="xl">
            <Text fontSize="20px" mb={4}>
              Hi {user?.firstName}, kindly pay the sum of{" "}
              <Text
                as="span"
                textDecoration="underline"
                fontWeight="bold"
                color="#510863"
              >
                 ₦{formattedCost(costOfService)}.00
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
            <FormControl alignItems="center" isRequired>
              <FormLabel>Full Name</FormLabel>
              <Input
                type="text"
                name="name"
                placeholder="Full Name"
                value={paymentData.name}
                onChange={handleInputChange}
                mb={4}
              />
              <FormLabel>Email Address</FormLabel>
              <Input
                type="email"
                name="email"
                placeholder="Email Address"
                value={paymentData.email}
                onChange={handleInputChange}
                mb={4}
              />
              <FormLabel>Phone Number</FormLabel>
              <Input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={paymentData.phone}
                onChange={handleInputChange}
                mb={4}
              />
              <Flex display={{ base: "flex", md: "block" }}>
                <Button
                  _hover={{ color: "" }}
                  bg="green.400"
                  color="white"
                  onClick={handlePayment}
                  isLoading={loading}
                >
                  <Box color="white">
                    {/* Use the retrieved paymentData */}
                    <PaystackButton
                      {...paymentData}
                      text="Process Payment"
                      fontFamily="body"
                      fontWight="bold"
                      className="submits"
                      onSuccess={handlePaymentSuccess}
                      onClose={handlePaymentFailure}
                    />
                  </Box>
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
            </FormControl>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default PaymentConfirmationPage;
