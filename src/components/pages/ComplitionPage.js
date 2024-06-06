import React from "react";
import {
  ChakraProvider,
  Box,
  Button,
  Image,
  Text,
  VStack,
  extendTheme,
  Flex,
} from "@chakra-ui/react";
import logo from "../../assets/Logo.svg";
import Complete from "../../assets/complete.svg";
import { useNavigate } from "react-router-dom";

const customTheme = extendTheme({
  fonts: {
    body: "Gill Sans MT, sans-serif",
    heading: "Gill Sans MT, sans-serif",
  },
});

const CompletionPage = () => {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate("/login");
  };

  return (
    <ChakraProvider theme={customTheme}>
      <Flex direction="column" height="100vh">
        <Box position="absolute" top={{ base: "10px", md: "20px" }} left={{ base: "10px", md: "20px" }}>
          <a href="/">
            <Image src={logo} alt="Logo" h={{ base: "40px", md: "58px" }} w={{ base: "150px", md: "200px" }} />
          </a>
        </Box>
        <Flex align="center" justify="center" flex="1" padding={{ base: "10px", md: "0" }}>
          <VStack align="center" justify="center" spacing={{ base: 2, md: 4 }}>
            <Text
              fontFamily="heading"
              fontSize={{ base: "2xl", md: "3xl" }}
              color="#A210C6"
              fontWeight="bold"
              textAlign="center"
            >
              And we're done!
            </Text>
            <Box>
              <Image
                justifySelf="center"
                src={Complete}
                alt="Completion Image"
                h={{ base: "150px", md: "300px" }}
                w={{ base: "150px", md: "300px" }}
              />
            </Box>
            <Text fontFamily="body" fontSize={{ base: "sm", md: "md" }} textAlign="center">
              Your details have been received.
              <br />
              Please give us 2-3 working days to process your application and verify you.
             
            </Text>
            <Button
              fontFamily="body"
              bg="#A210C6"
              color="white"
              onClick={handleBackToHome}
              width={{ base: "80%", md: "auto" }}
            >
              Login
            </Button>
          </VStack>
        </Flex>
      </Flex>
    </ChakraProvider>
  );
};

export default CompletionPage;
