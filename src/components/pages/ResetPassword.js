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
  InputRightElement,
} from "@chakra-ui/react";
import AOS from "aos";
import "aos/dist/aos.css";

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
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    AOS.init();
  }, []);

  const handleClick = () => setShow(!show);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    try {
      const token = localStorage.getItem("token"); // assuming the token is stored in local storage
      const response = await axios.post(
        "https://your-api-endpoint.com/resetPassword",
        {
          newPassword: password,
          token: token  // Add token to the body if needed
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.success) {
        alert("Password reset successfully!");
      } else {
        alert("Failed to reset password.");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      alert("Error resetting password.");
    }
  };

  return (
    <ChakraProvider theme={customTheme}>
      <Box overflowY="scroll" height="100vh">
        {/* <NavigationBar /> */}
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
                onChange={(e) => setConfirmPassword(e.target.value)}
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
