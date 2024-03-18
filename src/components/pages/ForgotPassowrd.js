import React from "react";
import { useEffect } from "react";

import {
  Box,
  Button,
  Link as ChakraLink,
  HStack,
  Spacer,
  Image,
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
import logo from "../../assets/Whitelogo.png";

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
  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <ChakraProvider theme={customTheme}>
      <Box overflowY="scroll" height="100vh">
        <Box
          bg="#A210C6"
          p={3}
          color="white"
          position="sticky"
          top="0"
          zIndex="1000"
          borderBottom="1px solid white"
        >
          <HStack spacing={10}>
            <Box w="5px" />
            <a href="/">
              <Image src={logo} alt="Logo" w="100px" h="30px" />
            </a>
            <Spacer />
            <Spacer />
            <Spacer />
            <Spacer />
            <ChakraLink fontStyle="italic" href="/" color="#A210C6">
              <Button bg="white">Home</Button>
            </ChakraLink>
          </HStack>
        </Box>
        <Box
          overflow="hidden"
          alignContent="center"
          alignItems="center"
          marginTop="30px"
        >
          <Text
            fontFamily="body"
            fontSize="32px"
            color="#A210C6"
            marginTop="50px"
          >
            Let's reset your password
          </Text>
          <Text
            fontFamily="Montserrat"
            fontSize="20px"
            color="black"
            marginTop="30px"
          >
            A one-time link will be sent to your email address <br></br>
            for you to change your password
          </Text>
          <FormControl isRequired w="500px" marginLeft="430px" marginTop="50px">
            <FormLabel>Enter email address or phone number</FormLabel>
            <Input placeholder="Enter email address or phone number" />
          </FormControl>

          <ChakraLink href="/verify-otp">
            <Button
              w="250px"
              h="50px"
              bg="#A210C6"
              marginTop="20px"
              color="white"
            >
              Submit
            </Button>
          </ChakraLink>
          <Text fontSize="20px" fontFamily="Montserrat" marginTop="20px">
            Remeber your password?{" "}
            <ChakraLink fontStyle="italic" href="/login" color="#A210C6">
              go back
            </ChakraLink>
          </Text>
        </Box>
      </Box>
    </ChakraProvider>
  );
};

export default LandingPage;
