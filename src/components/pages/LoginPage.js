import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/Logo.svg";
import GetStartedModal from "../unAuthLayouts/GetStarted";
import {
  Box,
  Button,
  Link as ChakraLink,
  Text,
  FormControl,
  Input,
  InputGroup,
  InputRightElement,
  // useToast,
  Image,
  ChakraProvider,
  extendTheme,
} from "@chakra-ui/react";
// import NavigationBar from "../unAuthLayouts/NavigationBar";
// import Google from "../../assets/GoogleIcon.svg";
import AOS from "aos";
import "aos/dist/aos.css";
import "../../styles/pages/LandingPage.css";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  // const toast = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [phoneInput, setPhoneInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [show, setShow] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const handlePhoneInputChange = (e) => setPhoneInput(e.target.value);
  const handlePasswordInputChange = (e) => setPasswordInput(e.target.value);
  const handleClick = () => setShow(!show);

  const handleLogin = async () => {
    setLoading(true);
    // const apiUrl = "https://backend-c1pz.onrender.com/login";
    const apiUrl = "http://localhost:8080/login";

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
        toast.success("Login successfull");
        const responseData = await response.json();
        localStorage.setItem("token", responseData.access_token);
        setTimeout(() => {
          navigate("/dashboard");
        }, 3000);
      } else {
        const errorData = await response.json();
        console.error("Login failed:", errorData.message);
        toast.error("Wrong passowd or phone number");
      }
    } catch (error) {
      console.error("Login failed:", error.message);
      toast.error("Wrong passowd or phone number");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    AOS.init();
  }, []);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <ChakraProvider theme={customTheme}>
      <Box overflow="hidden" height="100vh">
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

        <Box
          display={{ base: "block", md: "flex" }}
          paddingX={{ base: "1rem", md: "2rem" }}
          justifyContent="center"
          overflow="hidden"
        >
          <Box
            maxWidth={{ base: "90%", sm: "600px", md: "650px", lg: "700px" }}
            mx="auto"
            textAlign={{ base: "center", md: "center" }}
            // justify="center"
            height="100vh"
            mt={{ base: "30px", md: "60px" }}
          >
            <a href="/">
              <Image
                src={logo}
                alt="Logo"
                ml={{ base: "45px", md: "70px" }}
                h={{ base: "80px", md: "100px" }}
                w={{ base: "300px", md: "350px" }}
              />
            </a>
            <Text
              mt={{ base: "5px", md: "5px" }}
              fontSize="26px"
              fontFamily="body"
              color="#A210C6"
            >
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
              {/* <Text textAlign="center" mt="30px">
                or
              </Text> */}
              {/* <Box
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
              </Box> */}
              <Text fontSize="16px" fontFamily="Montserrat" mt="30px">
                Don't have an account?{" "}
                <ChakraLink
                  onClick={handleOpenModal}
                  fontStyle="italic"
                  color="#A210C6"
                >
                  Sign Up
                </ChakraLink>
              </Text>
            </FormControl>
          </Box>
        </Box>
      </Box>
      <GetStartedModal isOpen={showModal} onClose={handleCloseModal} />
    </ChakraProvider>
  );
};

export default LandingPage;
