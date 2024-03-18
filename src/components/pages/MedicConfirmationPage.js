import React from "react";
import {useEffect } from "react";

import {
  Box,
  Button,
  Link as ChakraLink,
  Image,
  extendTheme,
  ChakraProvider,
  Text,
} from "@chakra-ui/react";
import AOS from "aos";
import "aos/dist/aos.css";

import Done from "../../assets/MedicRegDone.svg";
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

const LandingPage = () => {
  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <ChakraProvider theme={customTheme}>
      <Box overflowY="scroll" height="100vh">
        <Box
          overflow="hidden"
          alignContent="center"
          alignItems="center"
          marginTop="20px"
        >
          <Text
            fontFamily="body"
            fontSize="36px"
            color="#A210C6"
            marginTop="45px"
          >
            And we’re done!
          </Text>
          <Image
            src={Done}
            alt="Logo"
            w="250px"
            h="250px"
            marginLeft="550px"
            marginTop="10px"
          />
          <Text
            fontFamily="Montserrat"
            fontSize="18px"
            color="black"
            marginTop="30px"
          >
            Your details have been received. <br></br>
            Please give us 3-5 working days to process your application.{" "}
            <br></br>A log in link would be sent to your email address shortly.
          </Text>
          <ChakraLink href="/">
            <Button
              w="250px"
              h="50px"
              bg="#A210C6"
              marginTop="20px"
              color="white"
            >
              Back to home
            </Button>
          </ChakraLink>
        </Box>
      </Box>
    </ChakraProvider>
  );
};

export default LandingPage;
