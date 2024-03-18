import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import AOS from "aos";
import "aos/dist/aos.css";
import Login1 from "../../assets/Login1.svg";

import Google from "../../assets/GoogleIcon.svg";
import logo from "../../assets/Whitelogo.png";
import "../../styles/pages/LandingPage.css";
import { UnlockIcon } from "@chakra-ui/icons";

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
  const toast = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [phoneInput, setPhoneInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");

  const handlePhoneInputChange = (e) => setPhoneInput(e.target.value);
  const handlePasswordInputChange = (e) => setPasswordInput(e.target.value);

  const handleLogin = async () => {
    setLoading(true);
    try {
      // const apiUrl = "http://localhost:8080/login";
      const apiUrl = "https://backend-c1pz.onrender.com/login";
      const headers = {
        "Content-Type": "application/json",
      };

      const requestBody = {
        phoneNumber: phoneInput,
        password: passwordInput,
      };

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const responseData = await response.json(); // Parse JSON response
        console.log("Login successful:", responseData.message);
        localStorage.setItem("token", responseData.access_token); // Corrected line
        toast({
          title: "Login successful",
          description: responseData.message,
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom-right",
          icon: <UnlockIcon />,
        });

        setLoading(false);
        setTimeout(() => {
          navigate("/dashboard");
        }, 3000);
      } else {
        const errorData = await response.json();
        console.error("Login failed:", errorData.message);

        toast({
          title: "Login failed",
          description: errorData.message,
          status: "failed",
          duration: 5000,
          isClosable: true,
        });

        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      alert(
        "Login failed, confirm your login details or check your internet connection"
      );
      // toast({
      //   title: "Login failed",
      //   description:error.message,
      //   status: "failed",
      //   duration: 5000,
      //   isClosable: true,
      // });
    }
  };

  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);

  const { isOpen, onOpen, onClose } = useDisclosure();

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
              <a href="/">
                <Image src={logo} alt="Logo" w="100px" h="30px" />
              </a>
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
        <Box display="flex">
          <Box marginLeft="-110px">
            <Image
              src={Login1}
              alt="Logo"
              w="715px"
              h="1000px"
              maxH="89vh"
              objectFit="contain"
              marginLeft="-50px"
            />
            {/* <Image
              src={Shade}
              alt="Logo"
              w="715px"
              h="1024px"
              marginTop="-640px"
              maxH="100vh"
              objectFit="contain"
            /> */}
          </Box>
          <Box>
            <Text
              fontSize="32px"
              fontFamily="body"
              color="#A210C6"
              marginTop="30px"
              marginLeft="20px"
            >
              Login to your account
            </Text>
            <FormControl isRequired marginTop="20px" marginLeft="100px">
              {/* <FormLabel marginTop="20px">Email address</FormLabel> */}
              <Input
                placeholder="Phone number"
                value={phoneInput}
                onChange={handlePhoneInputChange}
              />
              <InputGroup size="md" marginTop="30px">
                <Input
                  pr="4.5rem"
                  type={show ? "text" : "password"}
                  placeholder="Enter password"
                  onChange={handlePasswordInputChange}
                />
                <InputRightElement width="4.5rem">
                  <Button h="1.75rem" size="sm" onClick={handleClick}>
                    {show ? "Hide" : "Show"}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <Box marginTop="10px">
                <ChakraLink
                  margingLeft="150px"
                  fontStyle="italic"
                  href="/forgot-password"
                  color="#A210C6"
                >
                  forgot password?
                </ChakraLink>
              </Box>

              {/* <ChakraLink href="/login"> */}
              <Button
                isLoading={loading}
                loadingText="Loading..."
                onClick={handleLogin}
                w="350px"
                bg="#A210C6"
                marginTop="20px"
                color="white"
              >
                {loading ? "Loading..." : "Login"}
              </Button>
              {/* </ChakraLink> */}
              <Box marginTop="30px">
                <Text>or</Text>
                <Box
                  border={`1px solid #A210C6`}
                  padding="8px"
                  // paddingLeft="10px"
                  marginTop="20px"
                  display="flex"
                  borderRadius="10px"
                  marginLeft="120px"
                  w="250px"
                  h="45px"
                >
                  <Image
                    src={Google}
                    alt="GoogleIcon"
                    w="20px"
                    h="20px"
                    marginLeft="25px"
                    marginTop="2px"
                  />
                  <Text marginTop="2px" marginLeft="5px">
                    Continue with Google
                  </Text>
                </Box>
              </Box>

              <Text fontSize="16px" fontFamily="Montserrat" marginTop="30px">
                Dont have an account?{" "}
                <ChakraLink onClick={onOpen} fontStyle="italic" color="#A210C6">
                  Sign Up
                </ChakraLink>
              </Text>

              <Modal
                blockScrollOnMount={false}
                isOpen={isOpen}
                onClose={onClose}
              >
                <ModalOverlay />
                <ModalContent bg="gray">
                  <ChakraLink
                    fontStyle="italic"
                    href="/customer-signUp"
                    color="#A210C6"
                  >
                    <Button
                      marginTop="30px"
                      marginLeft="80px"
                      bg="gray"
                      color="black"
                      w="300px"
                      border="1px solid white"
                    >
                      Sign up
                    </Button>
                  </ChakraLink>
                  <ChakraLink fontStyle="italic" href="/join" color="#A210C6">
                    <Button
                      marginTop="30px"
                      marginLeft="80px"
                      bg="gray"
                      color="black"
                      w="300px"
                      border="1px solid white"
                    >
                      Sign up as medic
                    </Button>
                  </ChakraLink>
                  <ModalCloseButton />

                  <ModalFooter>
                    <Button
                      marginTop="30px"
                      marginLeft="200px"
                      bg="black"
                      color="white"
                      mr={3}
                      onClick={onClose}
                    >
                      Close
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </FormControl>
          </Box>
        </Box>
      </Box>
    </ChakraProvider>
  );
};

export default LandingPage;
