import React, { useState, useEffect } from "react";
import axios from "axios";
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
  Image,
  InputRightElement,
} from "@chakra-ui/react";
import { useNavigate, useLocation  } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import logo from "../../assets/Logo.svg";
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

const LandingPage = () => {
  const [show, setShow] = useState(false);
  const location = useLocation(); 
  const query = new URLSearchParams(location.search);
  const token = query.get('token'); 
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmOption] = useState('');

  useEffect(() => {
    AOS.init();
  }, []);

  const handleClick = () => setShow(!show);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error(
        "Passwords do not match!"
      );
      return;
    }
    console.log("token "+ token)

    try {
      const response = await axios.post(
        // "http://localhost:8080/v1/angel/resetPassword",
          "https://backend-c1pz.onrender.com/v1/angel/resetPassword",
        {
          newPassword: password,
          token: token  
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        toast.success(
          "Password reset successfully!"
        );
        navigate("/login"); 
      } else {
      
        toast.error(
          "Failed to reset password. "+ response.data.message
        );
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error(
        "Error resetting password. Please try again."
      );
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
          overflow="hidden"
          alignContent="center"
          alignItems="center"
          // marginTop="30px"
          mt={{md: "-50px"}}
        >
          <Text
            fontFamily="body"
            fontSize="32px"
            color="#A210C6"
            // marginTop="10px"
          >
            Let's reset your password
          </Text>
          <Text
            fontFamily="Montserrat"
            fontSize="20px"
            color="black"
            marginTop="30px"
          >
            The new password must not be the same <br></br>as the old password
          </Text>
          <FormControl isRequired w={{base: "300px", md: "500px"}} ml={{base: "50px", md: "430px"}} marginTop="50px" as="form" onSubmit={handleSubmit}>
            <FormLabel>
              Password (must contain alphabets, numbers and special characters)
            </FormLabel>
            <InputGroup size="md" marginTop="5px">
              <Input
                pr="4.5rem"
                type={show ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                value={confirmPassword}
                onChange={(e) => setConfirmOption(e.target
                .value)}
              />
              <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={handleClick}>
                  {show ? "Hide" : "Show"}
                </Button>
              </InputRightElement>
            </InputGroup>
            <Button
              type="submit"
              w="250px"
              h="50px"
              bg="#A210C6"
              marginTop="20px"
              color="white"
            >
              Reset
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
              go back
            </ChakraLink>
          </Text>
        </Box>
      </Box>
    </ChakraProvider>
  );
};

export default LandingPage;
