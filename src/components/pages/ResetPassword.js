import React from "react";
import { useEffect } from "react";
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
  InputGroup,
  InputRightElement,

} from "@chakra-ui/react";
import AOS from "aos";
import "aos/dist/aos.css";
import "../../styles/pages/LandingPage.css";
import NavigationBar from "../unAuthLayouts/NavigationBar";
// import logo from "../../assets/Whitelogo.png";

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


  return (
    <ChakraProvider theme={customTheme}>
      <Box overflowY="scroll" height="100vh">
       <NavigationBar/>
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
            The new password must not be <br>
            </br> the same as the old password
          </Text>
          <FormControl isRequired w={{base: "300px", md: "500px"}} ml={{base: "50px", md: "430px"}} marginTop="50px">
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
