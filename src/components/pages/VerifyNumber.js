import React, { useState, useEffect } from "react";
import axios from "axios";
// import NavigationBar from "../unAuthLayouts/NavigationBar";
import logo from "../../assets/Logo.svg";
import { useNavigate } from "react-router-dom";
import {
  useToast,
  Box,
  Button,
  Image,
  HStack,
  extendTheme,
  ChakraProvider,
  Text,
  PinInput,
  PinInputField,
  VStack,
} from "@chakra-ui/react";
import AOS from "aos";
import "aos/dist/aos.css";

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

const LandingPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [inputs, setInputs] = useState(Array(6).fill(""));

  // useEffect(() => {
  //   console.log("Current OTP input state:", inputs.join(""));
  // }, [inputs]);

  const handleInputChange = (value, index) => {
    let newInputs = [...inputs];
    newInputs[index] = value;
    setInputs(newInputs);
    // console.log(`Input at index ${index} changed to:`, value); 
    // console.log("Current state of inputs:", newInputs.join("")); 
  };

  useEffect(() => {
    console.log("Updated state of inputs:", inputs.join("")); 
  }, [inputs]); // Depend on 'inputs' to trigger this effect

  const resendOtp = async () => {
    try {
      const number = localStorage.getItem("phoneNumber");
      const response = await axios.post(
        // "http://localhost:8080/api/v1/sms/verify-number",
        " https://backend-c1pz.onrender.com/api/v1/sms/verify-number",

        { phoneNumber: number },
        { headers: { "Content-Type": "application/json" } }
      );
      console.log(response);
      toast.error("A new OTP has been sent to your phone.");
    } catch (error) {
      toast.error("Unable to resend OTP at this time. Please try again later.");
    }
  };

  const handleVerify = async () => {
    setLoading(true);

    try {
      const enteredOtp = inputs.join("");
      console.log("Collected OTP:", enteredOtp); 
      const number = localStorage.getItem("phoneNumber");
      const response = await axios.post(
        // "http://localhost:8080/api/v1/sms/verify-otp",
        "https://backend-c1pz.onrender.com/v1/sms/verify-otp",
        { phoneNumber: number, otpNumber: enteredOtp },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.success) {
        setLoading(false);
        toast.success(response.data.message);
        setTimeout(() => {
          navigate("/login");
        }, 5000);
      } else {
        setLoading(false);
        console.error("Error verifying otp");
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(
        "Wrong or expired OTP, confirm the code sent or click 'resend code' for a new code"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <ChakraProvider theme={customTheme}>
      <Box overflowY="scroll" height="100vh">
        {/* <NavigationBar /> */}
        <VStack
          spacing={4}
          align="center"
          justify="center"
          p={4}
          height="100vh"
        >
          <a href="/">
            <Image
              justifySelf="center"
              src={logo}
              alt="Logo"
              ml={{ base: "40px", md: "90px" }}
              h={{ base: "80px", md: "100px" }}
              w={{ base: "300px", md: "350px" }}
            />
          </a>
          <Text fontSize="2xl" color="#A210C6">
            Verify your phone number
          </Text>
          <Text fontSize="lg" color="gray.600">
            Please input the 6 digit code sent to your phone number
          </Text>
          <HStack>
            {/* <PinInput
              onChange={(value, index) => handleInputChange(value, index)}
            >
              {Array.from({ length: 6 }, (_, index) => (
                <PinInputField key={index} />
              ))}
            </PinInput> */}
            <PinInput>
              {Array.from({ length: 6 }, (_, index) => (
                <PinInputField
                  key={index}
                  onChange={(e) => handleInputChange(e.target.value, index)}
                />
              ))}
            </PinInput>
          </HStack>
          <Text fontSize="20px" fontFamily="Montserrat" marginTop="20px">
            Didn’t receive a code?{" "}
            <Button
              fontStyle="italic"
              color="#A210C6"
              onClick={resendOtp}
              isLoading={loading}
            >
              resend code
            </Button>
          </Text>
          <Button
            w="200px"
            // bg="#A210C6"
              bg="linear-gradient(80deg, #A210C6, #E552FF)"
            onClick={handleVerify}
            isLoading={loading}
            loadingText="Verifying..."
            color="white"
          >
            Verify
          </Button>
        </VStack>
      </Box>
    </ChakraProvider>
  );
};

export default LandingPage;
