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
  InputGroup,

  InputRightElement,

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
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);

  useEffect(() => {
    AOS.init();
  }, []);

  // const handleFileChange = (event) => {
  //   // Access the selected file using event.target.files
  //   const selectedFile = event.target.files[0];
  //   console.log(selectedFile);
  //   // Perform any additional logic or state updates as needed
  // };

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
            The new password must not be the same as the old password
          </Text>
          <FormControl isRequired w="500px" marginLeft="430px" marginTop="50px">
            <FormLabel>
              Password (must contain alphabets, numbers and special characters)
            </FormLabel>
            <InputGroup size="md" marginTop="5px">
              <Input
                pr="4.5rem"
                type={show ? "text" : "password"}
                placeholder="Enter password"
              />
              <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={handleClick}>
                  {show ? "Hide" : "Show"}
                </Button>
              </InputRightElement>
            </InputGroup>
            <FormLabel marginTop="10px">Confirm Password</FormLabel>
            <InputGroup size="md" marginTop="5px">
              <Input
                pr="4.5rem"
                type={show ? "text" : "password"}
                placeholder="Confirm password"
              />
              <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={handleClick}>
                  {show ? "Hide" : "Show"}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>

          <ChakraLink href="/change-password">
            <Button
              w="250px"
              h="50px"
              bg="#A210C6"
              marginTop="20px"
              color="white"
            >
              Reset
            </Button>
          </ChakraLink>
        </Box>
      </Box>
    </ChakraProvider>
  );
};

export default LandingPage;
