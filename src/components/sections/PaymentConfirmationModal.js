import { useSelector } from "react-redux";
import React, { useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { baseUrl } from "../../apiCalls/config";
import {
  Box,
  Text,
  useMediaQuery,
  FormControl,
  FormLabel,
  Input,
  extendTheme,
  Flex,
  Button,
  Image,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/Whitelogo.svg";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

const PaymentConfirmationPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
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

  // const handlePaymentSuccess = (response) => {
  //   verifyPayment();
  // };

  const handlePaymentFailure = (error) => {
    toast.error("Payment failed, please try again later");
  };

  // const verifyPayment = async () => {
  //   toast.info("Please wait, while we verify your payment");
  //   try {
  //     const token = localStorage.getItem("token");
  //     console.log("ID is " + appointmentId);
  //     const apiUrl = `${baseUrl}/payment/verify/${appointmentId}`;

  //     const headers = {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${token}`,
  //     };

  //     const response = await axios.get(apiUrl, { headers });
  //     console.log(response.data);

  //     if (response.data.status === true) {
  //       setPaymentData({
  //         email: "",
  //         amount: " ",
  //         reference: " ",
  //         name: " ",
  //         phone: " ",
  //       });
  //       toast.success("Payment verified");
  //       setTimeout(() => {
  //         navigate("/client-dashboard");
  //       }, 5000);
  //     } else {
  //       toast.error("Payment verification failed, please cancel and try again");
  //       console.error("Payment verification failed");
  //     }
  //   } catch (error) {
  //     toast.error("Payment verification failed, please cancel and try again");
  //     console.error("An error occurred during payment verification:", error);
  //   }
  // };

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const apiUrl = `${baseUrl}/payment/payment`;
  
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
  
      const response = await axios.post(apiUrl, {
        amount: amountInKobo,
        appointmentId: paymentData.reference,
        userId: user?.userId,
      }, { headers });
  
      if (response.status === 200) {
        const authorizationUrl = response.data.data.authorizationUrl;
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        const windowFeatures = isMobile ? '' : 'width=500,height=600';
  
        const newWindow = window.open(authorizationUrl, '_blank', windowFeatures);
  
        if (newWindow) {
          newWindow.focus();
          setTimeout(() => {
            navigate("/appointment");
          }, 5000);
        } else {
          toast.error("Pop-up blocked. Please allow pop-ups for this site.");
        }
      } else {
        toast.error("Payment initialization failed, please try again later");
      }
    } catch (error) {
      console.error("An error occurred during payment processing:", error);
      handlePaymentFailure(error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCancel = () => {
    navigate("/client-dashboard");
  };

  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");
  const paymentFormWidth = isLargerThan768 ? "50%" : "90%";

  return (
    <Box
      theme={customTheme}
      height="100vh"
      bg="linear-gradient(80deg, #510863, #E552FF)"
      textAlign="center"
      color="white"
      p={4}
    >
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Box margin={{ base: "10px", md: "10px" }}>
        <Image src={logo} alt="Logo" w="100px" h="30px" />
      </Box>
      <Box color="white" mx="auto" w={paymentFormWidth}>
        <Text
          fontFamily="heading"
          fontSize={{ base: "20px", md: "24px" }}
          fontWeight="bold"
          mb={4}
        >
          Confirm Payment
        </Text>
        <form onSubmit={handlePayment}>
          <Box
            fontSize={{ base: "16px", md: "18px" }}
            color="black"
            p={4}
            bg="white"
            borderRadius="xl"
          >
            <Text fontFamily="body" mb={4}>
              Hi {user?.firstName}, kindly pay the sum of{" "}
              <Text
                fontFamily="body"
                as="span"
                textDecoration="underline"
                fontWeight="bold"
                color="#510863"
              >
                ₦{formattedCost(costOfService)}
              </Text>{" "}
              to proceed with your booking for{" "}
              <Text
                fontFamily="body"
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
            <FormControl fontFamily="body" alignItems="center" isRequired>
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
              <Flex
                justifyContent="center"
                display={{ base: "flex", md: "block" }}
              >
                <Button
                  _hover={{ color: "" }}
                  bg="green.400"
                  color="white"
                  type="submit"
                  isLoading={loading}
                >
                  Process Payment
                </Button>
                <Button
                  marginLeft="5px"
                  fontFamily="body"
                  bg="#E1ACAE"
                  color="red.500"
                  onClick={handleCancel}
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
