import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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

  Flex,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightElement,

  useToast,
  Select,
} from "@chakra-ui/react";
import AOS from "aos";
import "aos/dist/aos.css";
import Customer from "../../assets/UserSignUp.svg";
import Shade from "../../assets/Shade.svg";
import logo from "../../assets/Whitelogo.png";
import "../../styles/pages/LandingPage.css";
import LoadingSpinner from "../../utils/Spiner";

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
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    gender: "",
    dob: "",
    address: "",
    image: "",
    kinName: "",
    kinNumber: "",
    language: "English",
    relationship: "Self",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [image] = useState();
  const [show, setShow] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  // const [selectedDate, setSelectedDate] = useState(null);

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;

  //   if (name === "dob") {
  //     setSelectedDate(value);
  //     setFormData({
  //       ...formData,
  //       dob: value,
  //     });
  //   } else {
  //     setFormData({
  //       ...formData,
  //       [name]: value,
  //     });
  //   }
  // };

  const handleDobChange = (date) => {
    setFormData({
      ...formData,
      dob: date,
    });
  };
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const toast = useToast();
  const handleClick = () => setShow(!show);
  console.log("form details", formData);

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateFields()) {
      return;
    }

    await postImage(image, formData, setFormData);
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8080/v1/angel/join",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      localStorage.setItem("phoneNumber", formData.phoneNumber);
      console.log(response);
      toast({
        title: "Registration Successful",
        description: response.data.message,
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      const verifyNumberResponse = await axios.post(
        "http://localhost:8080/api/v1/sms/verify-number",
        {
          phoneNumber: formData.phoneNumber,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      localStorage.setItem("phoneNumber", formData.phoneNumber);
      // Handle the response for the second API call as needed
      console.log(verifyNumberResponse);

      setTimeout(() => {
        navigate("/verify-number");
      }, 5000);
      // Redirect or perform other actions based on the response
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: error.response.data,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      // Set loading back to false regardless of success or failure
      setLoading(false);
    }
  };

  const validateFields = () => {
    const fieldMappings = {
      firstName: "First Name",
      lastName: "Last Name",
      email: "Email",
      phoneNumber: "Phone Number",
      password: "Password",
      confirmPassword: "Confirm Password",
      gender: "Gender",
      dob: "Date of Birth",
      address: "Address",
      kinName: "Next of Kin Name",
      kinNumber: "Next of Kin Phone Number",
    };

    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "phoneNumber",
      "password",
      "confirmPassword",
      "gender",
      "dob",
      "address",
      "kinName",
      "kinNumber",
    ];

    for (const field of requiredFields) {
      if (!formData[field]) {
        const readableFieldName = fieldMappings[field];
        toast({
          title: `${readableFieldName} is Required`,
          description: `Please provide ${readableFieldName}.`,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return false;
      }
    }

    return true;
  };

  useEffect(() => {
    AOS.init();
  }, []);

  const postImage = async (image, formData, setFormData) => {
    setImageLoading(true);
    if (image === undefined) {
      // toast.error("Please select an image")
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
        console.log(err);
        setImageLoading(false);
      }
    } else {
      // toast.error("Please select an image");

      return;
    }
  };

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
        <Box display="flex">
          <Box w="55%">
            <Image
              src={Customer}
              alt="Logo"
              w="650px"
              h="1050px"
              marginTop="-70px"
            />
            <Image
              src={Shade}
              alt="Logo"
              w="700px"
              h="1050px"
              marginTop="-1000px"
            />
          </Box>
          <Box>
            <Text
              fontSize="32px"
              fontFamily="body"
              color="#A210C6"
              marginTop="30px"
              marginLeft="-80px"
            >
              Create your account
            </Text>
            <form onSubmit={handleSubmit}>
              <FormControl isRequired marginTop="20px" w="110%">
                <FormLabel>What is your name</FormLabel>
                <Flex>
                  <Input
                    name="firstName"
                    placeholder="First name"
                    onChange={handleInputChange}
                    w="240px"
                  />

                  <Input
                    name="lastName"
                    placeholder="Last name"
                    onChange={handleInputChange}
                    w="240px"
                    marginLeft="10px"
                  />
                </Flex>

                <Flex>
                  <Box>
                    <FormLabel
                      fontSize="15px"
                      marginLeft="10px"
                      marginTop="30px"
                    >
                      Upload headshort
                    </FormLabel>
                    <Input
                      name="image"
                      w="240px"
                      type="file"
                      accept="image/*"
                      placeholder="Image"
                      onChange={(e) => {
                        postImage(e.target.files[0], formData, setFormData);
                      }}
                    />
                    {imageLoading && <LoadingSpinner size={20} />}
                  </Box>
                  <Box>
                    <FormLabel marginLeft="45px" marginTop="28px">
                      Email address
                    </FormLabel>
                    <Input
                      name="email"
                      placeholder="Email"
                      type="email"
                      onChange={handleInputChange}
                      marginLeft="10px"
                      w="240px"
                    />
                  </Box>
                </Flex>
                <FormLabel marginTop="20px">Contact details</FormLabel>
                <Flex>
                  <Input
                    name="address"
                    placeholder="Home address"
                    type="address"
                    onChange={handleInputChange}
                    w="490px"
                  />
                </Flex>
                <Box w="490px">
                  <InputGroup marginTop="20px">
                    <InputLeftAddon children="+234" />
                    <Input
                      name="phoneNumber"
                      type="tel"
                      placeholder="Phone number"
                      onChange={handleInputChange}
                    />
                  </InputGroup>
                </Box>

                <Flex>
                  <Box>
                    <FormLabel marginTop="20px">Gender </FormLabel>
                    <Select
                      name="gender"
                      placeholder="Select your gender"
                      w="240px"
                      onChange={handleInputChange}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </Select>
                  </Box>
                  <Box marginLeft="18px" w="240px">
                    <FormLabel marginTop="20px">Date of Birth</FormLabel>
                    <DatePicker
                        name="dob"
                        selected={formData.dob}
                        onChange={(date) => handleDobChange(date)}
                        maxDate={new Date()}
                        peekNextMonth
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        dateFormat="yyyy-MM-dd"
                        placeholderText="Select your date of birth"
                        className="form-control"
                      />
                  </Box>
                </Flex>
                <Flex marginTop="1px">
                  <Box>
                    <FormLabel marginTop="20px">Next of kin </FormLabel>
                    <Input
                      name="kinName"
                      type="text"
                      placeholder="Next of kin name"
                      onChange={handleInputChange}
                      w="240px"
                    />
                    <Input
                      name="kinNumber"
                      type="text"
                      placeholder="Next of kin phone number"
                      onChange={handleInputChange}
                      w="240px"
                      marginLeft="18px"
                    />
                  </Box>
                </Flex>

                <Box w="500px" marginTop="20px">
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
                </Box>
                <Box marginTop="20px" w="500px">
                  <InputGroup size="md">
                    <Input
                      name="confirmPassword"
                      pr="4.5rem"
                      type={show ? "text" : "password"}
                      placeholder="Confirm password"
                      onChange={handleInputChange}
                      w="500px"
                    />
                    <InputRightElement width="4.5rem">
                      <Button h="1.75rem" size="sm" onClick={handleClick}>
                        {show ? "Hide" : "Show"}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                </Box>

                <Box marginLeft="-30px">
                  <ChakraLink href="/join-complete">
                    <Button
                      type="submit"
                      w="350px"
                      bg="#A210C6"
                      marginTop="20px"
                      color="white"
                      isLoading={loading}
                      loadingText="Registering..."
                    >
                      {loading ? "Loading..." : "Submit"}
                    </Button>
                  </ChakraLink>

                  <Text
                    fontSize="16px"
                    fontFamily="Montserrat"
                    marginTop="10px"
                  >
                    Already have an account?{" "}
                    <ChakraLink
                      fontStyle="italic"
                      href="/login"
                      color="#A210C6"
                    >
                      Login
                    </ChakraLink>
                  </Text>
                </Box>
              </FormControl>
            </form>
          </Box>
        </Box>
      </Box>
    </ChakraProvider>
  );
};

export default LandingPage;
