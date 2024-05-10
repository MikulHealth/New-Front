import React, { useState, useEffect } from "react";
import axios from "axios";
import logo from "../../assets/Logo.svg";
import {
  Box,
  Button,
  Link as ChakraLink,
  extendTheme,
  ChakraProvider,
  Text,
  Image,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import AOS from "aos";
import { useNavigate  } from "react-router-dom";
import "aos/dist/aos.css";
import "../../styles/pages/LandingPage.css";
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

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [emailAddress, setEmailOrPhone] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    AOS.init();
  }, []);

  const handleInputChange = (event) => {
    setEmailOrPhone(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        // "http://localhost:8080/v1/angel/forgotPassword",
        "https://backend-c1pz.onrender.com/v1/angel/forgotPassword",
        JSON.stringify({ emailAddress }),
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.success) {
        toast.success(
          "Kindly check your email to find the password reset link"
        );
        setTimeout(() => {
          navigate("/");
        }, 5000);
      } else {
        console.error("Forgot password failed:", response.data.message);
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Network error", error);
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ChakraProvider theme={customTheme}>
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
      <Box overflowY="scroll" height="100vh">
        <Box >
          <a href="/">
            <Image
              justifySelf="center"
              src={logo}
              alt="Logo"
              ml={{ base: "30px", md: "30px" }}
              h={{ base: "100px", md: "200px" }}
              // mt="10px"
              w={{ base: "100px", md: "200px" }}
            />
          </a>
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          // marginTop="10px"
          paddingX="1rem"
        >
          <Text
            fontFamily="body"
            fontSize={{ base: "24px", md: "32px" }}
            color="#A210C6"
            marginTop="10px"
            textAlign="center"
          >
            Let's reset your password
          </Text>
          <Text
            fontFamily="Montserrat"
            fontSize={{ base: "16px", md: "20px" }}
            color="black"
            marginTop="20px"
            textAlign="center"
          >
            A one-time link will be sent to your email address
            <br />
            for you to change your password
          </Text>
          <FormControl
            isRequired
            width={{ base: "90%", sm: "600px" }}
            marginTop="30px"
            as="form"
            onSubmit={handleSubmit}
          >
            <FormLabel>Enter email address or phone number</FormLabel>
            <Input
              placeholder="Enter email address or phone number"
              value={emailAddress}
              onChange={handleInputChange}
            />
            <Button
              type="submit"
              width={{ base: "90%", sm: "250px" }}
              height="50px"
              bg="#A210C6"
              marginTop="20px"
              color="white"
              isLoading={loading}
              loadingText="Loading..."
            >
              Submit
            </Button>
          </FormControl>
          <Text
            fontSize={{ base: "16px", md: "20px" }}
            fontFamily="Montserrat"
            marginTop="20px"
            textAlign="center"
          >
            Remember your password?{" "}
            <ChakraLink fontStyle="italic" href="/login" color="#A210C6">
              Go back
            </ChakraLink>
          </Text>
        </Box>
      </Box>
    </ChakraProvider>
  );
};

export default ForgotPassword;
