import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavigationBar from "../unAuthLayouts/NavigationBar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import LoadingSpinner from "../../utils/Spiner";

import {
  Box,
  Button,
  extendTheme,
  ChakraProvider,
  Text,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  InputLeftAddon,
  useToast,
  Flex,
  Select,
} from "@chakra-ui/react";
import AOS from "aos";
import "aos/dist/aos.css";
import "../../styles/pages/LandingPage.css";

const customTheme = extendTheme({
  components: {
    Link: {
      baseStyle: { _focus: { boxShadow: "none" } },
    },
  },
  fonts: {
    body: "Gill Sans MT, sans-serif",
    heading: "Gill Sans MT, sans-serif",
  },
});

const LandingPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    gender: "",
    dob: new Date(),
    address: "",
    image: "",
    kinName: "",
    kinNumber: "",
    language: "English",
    relationship: "Self",
  });
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDobChange = (date) => {
    setFormData({ ...formData, dob: date });
  };

  const handleClick = () => setShow(!show);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        // "http://localhost:8080/v1/angel/join",
        "https://backend-c1pz.onrender.com/v1/angel/join",
        formData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      toast({
        title: "Registration Successful",
        description: response.data.message,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      navigate("/verify-number");
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: error.response ? error.response.data : "Network error",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const postImage = async (image) => {
    setImageLoading(true);
    if (image === undefined) {
      toast({
        title: "Error",
        description: "Please select an image",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    console.log(image);
    if (image.type === "image/jpeg" || image.type === "image/png") {
      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", "profileImage");
      data.append("cloud_name", "dmfewrwla");

      try {
        const response = await fetch(
          "https://api.cloudinary.com/v1_1/dmfewrwla/image/upload",
          {
            method: "post",
            body: data,
          }
        );

        const imageData = await response.json();

        setFormData({
          ...formData,
          image: imageData.url.toString(),
        });
        setImageLoading(false);
        console.log(imageData.url.toString());
      } catch (err) {
        console.error(err);
        setImageLoading(false);
      }
    } else {
      toast({
        title: "Error",
        description: "Please select a valid image file",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
  };

  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <ChakraProvider theme={customTheme}>
      <NavigationBar />
      <Flex align="center" justify="center" height="100vh">
        <Box
          mb="300px"
          mt={{ base: "600px", md: "700px" }}
          width={{ base: "90%", sm: "500px" }}
          p="6"
          boxShadow="xl"
          rounded="md"
          bg="white"
        >
          <Text fontSize="2xl" color="#A210C6" mb="4" textAlign="center">
            Create your account
          </Text>
          <form onSubmit={handleSubmit}>
            <FormControl isRequired>
              <FormLabel>First Name</FormLabel>
              <Input
                name="firstName"
                placeholder="First name"
                onChange={handleInputChange}
              />
              <FormLabel mt="4">Last Name</FormLabel>
              <Input
                name="lastName"
                placeholder="Last name"
                onChange={handleInputChange}
              />
              <FormLabel mt="4">Email Address</FormLabel>
              <Input
                name="email"
                type="email"
                placeholder="Email"
                onChange={handleInputChange}
              />
              <FormLabel mt="4">Home Address</FormLabel>
              <Input
                name="address"
                placeholder="Home address"
                onChange={handleInputChange}
              />
              <FormLabel mt="4">Phone Number</FormLabel>
              <InputGroup>
                <InputLeftAddon children="+234" />
                <Input
                  name="phoneNumber"
                  type="tel"
                  placeholder="Phone number"
                  onChange={handleInputChange}
                />
              </InputGroup>
              <FormLabel mt="4">Gender</FormLabel>
              <Select
                name="gender"
                placeholder="Select your gender"
                onChange={handleInputChange}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </Select>
              <Box marginLeft="1px" w="450px">
                <FormLabel marginTop="20px">Date of Birth</FormLabel>
                <Flex
                  alignItems="flex-start"
                  border="1px solid" 
                  borderColor="gray.200"
                  p={2} 
                  borderRadius="8px"
                >
                  <DatePicker
                    name="dob"
                    selected={formData.dob}
                    onChange={handleDobChange}
                    maxDate={new Date()}
                    peekNextMonth
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    dateFormat="yyyy-MM-dd"
                    placeholderText="Select your date of birth"
                    className="form-control"
                  />
                </Flex>
              </Box>
              <FormLabel mt="4">Upload Image</FormLabel>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => postImage(e.target.files[0])}
              />
              {imageLoading && <LoadingSpinner />}
              <FormLabel mt="4">Password</FormLabel>
              <InputGroup size="md">
                <Input
                  name="password"
                  pr="4.5rem"
                  type={show ? "text" : "password"}
                  placeholder="Enter password"
                  onChange={handleInputChange}
                />
                <InputRightElement width="4.5rem">
                  <Button h="1.75rem" size="sm" onClick={handleClick}>
                    {show ? "Hide" : "Show"}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <FormLabel mt="4">Confirm Password</FormLabel>
              <InputGroup size="md">
                <Input
                  name="confirmPassword"
                  pr="4.5rem"
                  type={show ? "text" : "password"}
                  placeholder="Confirm password"
                  onChange={handleInputChange}
                />
                <InputRightElement width="4.5rem">
                  <Button h="1.75rem" size="sm" onClick={handleClick}>
                    {show ? "Hide" : "Show"}
                  </Button>
                </InputRightElement>
              </InputGroup>

              <Button
                mt="6"
                type="submit"
                w="full"
                bg="#A210C6"
                color="white"
                isLoading={loading}
                loadingText="Registering..."
              >
                Submit
              </Button>
            </FormControl>
          </form>
        </Box>
      </Flex>
    </ChakraProvider>
  );
};

export default LandingPage;
