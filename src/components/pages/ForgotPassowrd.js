import React from "react";
import { useEffect } from "react";
import NavigationBar from "../unAuthLayouts/NavigationBar";
import {
  Box,
  Button,
  Link as ChakraLink,
  extendTheme,
  ChakraProvider,
  Text,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import AOS from "aos";
import "aos/dist/aos.css";
import "../../styles/pages/LandingPage.css";

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
  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <ChakraProvider theme={customTheme}>
      <Box overflowY="scroll" height="100vh">
        <NavigationBar />
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          marginTop="30px"
          paddingX="1rem"
        >
          <Text
            fontFamily="body"
            fontSize={{ base: "24px", md: "32px" }}
            color="#A210C6"
            marginTop="30px"
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
          >
            <FormLabel>Enter email address or phone number</FormLabel>
            <Input placeholder="Enter email address or phone number" />
          </FormControl>

          <ChakraLink href="/verify-otp">
            <Button
              width={{ base: "90%", sm: "250px" }}
              height="50px"
              bg="#A210C6"
              marginTop="20px"
              color="white"
            >
              Submit
            </Button>
          </ChakraLink>
          <Text
            fontSize={{ base: "16px", md: "20px" }}
            fontFamily="Montserrat"
            marginTop="20px"
            textAlign="center"
          >
            Remember your password?{" "}
            <ChakraLink fontStyle="italic" href="/login" color="#A210C6">
              go back
            </ChakraLink>
          </Text>
        </Box>
      </Box>
    </ChakraProvider>
  );
};

export default ForgotPassword;
