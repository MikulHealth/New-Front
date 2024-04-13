import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Link as ChakraLink,
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
  Image,
  ChakraProvider,
  extendTheme,
} from "@chakra-ui/react";
import { UnlockIcon } from "@chakra-ui/icons";
import NavigationBar from "../unAuthLayouts/NavigationBar";
import Google from "../../assets/GoogleIcon.svg";
import AOS from "aos";
import "aos/dist/aos.css";
import "../../styles/pages/LandingPage.css";

const customTheme = extendTheme({
  components: {
    Link: {
      baseStyle: {
        _focus: { boxShadow: "none" },
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
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [phoneInput, setPhoneInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [show, setShow] = useState(false);

  const handlePhoneInputChange = (e) => setPhoneInput(e.target.value);
  const handlePasswordInputChange = (e) => setPasswordInput(e.target.value);
  const handleClick = () => setShow(!show);

  const handleLogin = async () => {
    setLoading(true);
    const apiUrl = "https://backend-c1pz.onrender.com/login";
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber: phoneInput,
          password: passwordInput,
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        localStorage.setItem("token", responseData.access_token);
        toast({
          title: "Login successful",
          description: responseData.message,
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom-right",
          icon: <UnlockIcon />,
        });
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
      }
    } catch (error) {
      console.error("Login failed:", error.message);
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
        <NavigationBar />
        <Box
          display={{ base: "block", md: "flex" }}
          paddingX={{ base: "1rem", md: "2rem" }}
          justifyContent="center"
        >
          <Box
            maxWidth={{ base: "90%", sm: "600px", md: "650px", lg: "700px" }}
            mx="auto"
            textAlign={{ base: "center", md: "left" }}
          >
            <Text fontSize="32px" fontFamily="body" color="#A210C6" mt="30px">
              Login to your account
            </Text>
            <FormControl isRequired mt="20px">
              <Input
                placeholder="Phone number"
                value={phoneInput}
                onChange={handlePhoneInputChange}
              />
              <InputGroup size="md" mt="30px">
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
              <ChakraLink
                fontStyle="italic"
                href="/forgot-password"
                color="#A210C6"
                display="block"
                mt="10px"
              >
                forgot password?
              </ChakraLink>
              <Button
                isLoading={loading}
                loadingText="Loading..."
                onClick={handleLogin}
                width="full"
                bg="#A210C6"
                mt="20px"
                color="white"
              >
                {loading ? "Loading..." : "Login"}
              </Button>
              <Text textAlign="center" mt="30px">
                or
              </Text>
              <Box
                border="1px solid #A210C6"
                p="8px"
                mt="20px"
                display="flex"
                borderRadius="10px"
                justifyContent="center"
                alignItems="center"
              >
                <Image src={Google} alt="GoogleIcon" w="20px" h="20px" />
                <Text ml="5px">Continue with Google</Text>
              </Box>
              <Text fontSize="16px" fontFamily="Montserrat" mt="30px">
                Don't have an account?{" "}
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
                      mt="30px"
                      bg="gray"
                      color="black"
                      w="300px"
                      border="1px solid white"
                    >
                      Sign up
                    </Button>
                  </ChakraLink>
                  <ModalCloseButton />
                  <ModalFooter>
                    <Button onClick={onClose} bg="black" color="white">
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
