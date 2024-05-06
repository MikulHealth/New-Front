import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import LoadingSpinner from "../../utils/Spiner";
import logo from "../../assets/Logo.svg";
import { Link } from "react-router-dom";

import {
  Box,
  Button,
  extendTheme,
  ChakraProvider,
  Text,
  FormControl,
  Image,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  InputLeftAddon,
  useToast,
  Flex,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Checkbox,
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
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
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

  const handleTermsChange = (e) => {
    setAgreeToTerms(e.target.checked);
    setIsTermsOpen(true); // Open the modal when checkbox is checked
  };

  const closeTermsModal = () => setIsTermsOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreeToTerms) {
      toast({
        title: "Terms and Conditions",
        description: "You must agree to the terms and conditions to continue",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        // "https://backend-c1pz.onrender.com/v1/angel/join",
        "http://localhost:8080/v1/angel/join",
        formData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      // Storing phoneNumber in localStorage before sending OTP
      localStorage.setItem("phoneNumber", formData.phoneNumber);
      toast({
        title: "Registration Successful",
        description: response.data.message,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      // Call sendOtp function after successful registration
      await sendOtp();
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

  const sendOtp = async () => {
    try {
      const number = localStorage.getItem("phoneNumber");
      const response = await axios.post(
        // "http://localhost:8080/api/v1/sms/verify-number",
        "https://backend-c1pz.onrender.com/api/v1/sms/verify-number",
        { phoneNumber: number },
        { headers: { "Content-Type": "application/json" } }
      );
      console.log(response);
      toast({
        title: "OTP Resent",
        description: "A new OTP has been sent to your phone.",
        status: "info",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Failed to send OTP",
        description: "Unable to send OTP at this time. Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
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
    <ChakraProvider overflow="hidden" theme={customTheme}>
      <Flex overflow="scroll" align="center" justify="center" height="100vh">
        <Box
          mb="300px"
          mt={{ base: "700px", md: "800px" }}
          width={{ base: "90%", sm: "500px" }}
          h={{ base: "140%", md: "160%" }}
          p="6"
          bg="white"
        >
          <a href="/">
            <Image
              justifySelf="center"
              src={logo}
              alt="Logo"
              ml={{ base: "20px", md: "90px" }}
              h={{ base: "80px", md: "100px" }}
              w={{ base: "300px", md: "350px" }}
            />
          </a>
          <Text fontSize="2xl" color="#A210C6" mb="4" textAlign="center">
            Create your account
          </Text>
          <form onSubmit={handleSubmit}>
            {/* Form fields */}
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
              {/* <FormLabel mt="4">Home Address</FormLabel> */}
              {/* <Input
                name="address"
                placeholder="Home address"
                onChange={handleInputChange}
              /> */}
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
            </FormControl>
            <Checkbox
              isChecked={agreeToTerms}
              onChange={handleTermsChange}
              mt="4"
            >
              By continuing, you agree to{" "}
              <Text as="span" color="#A210C6">
                Mikul Health's terms and condition.
              </Text>
            </Checkbox>

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
          </form>
          <Text fontSize="16px" fontFamily="Montserrat" mt="15px">
            Already have an account?{" "}
            <Link
              to="/login"
              style={{
                fontStyle: "italic",
                color: "#A210C6",
                textDecoration: "none",
              }}
            >
              Login
            </Link>
          </Text>
        </Box>
      </Flex>

      {/* Terms Modal */}
      <Modal isOpen={isTermsOpen} onClose={closeTermsModal} size="full">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Terms of Use & Privacy Policy</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb="4">
              <strong>BACKGROUND:</strong>
              <br />
              (A) These Terms of Service together with any and all other
              documents connected with these Terms of Service set out the terms
              and conditions on which Mikul Health Technology Limited (“Us” or
              “MHTL” or “We”) paid home care service is sold to Customers/You
              through our website, www.mikulhealth.com (“Our Site”) and
              in-person.
              <br />
              <br />
              (B) Please read these Terms of Service carefully and ensure that
              You understand them before accessing and paying. If You have any
              query about anything in these Terms of Service, please contact Us
              to discuss. Before accessing Our Site or MHTL paid home care
              service, You will be required to read, accept, and agree to comply
              with and be bound by these Terms of Service. If You do not, You
              will not be able to access MHTL paid home care service through Our
              Site or in-person.
              <br />
              <br />
              (C) All of the information and the MHTL paid home care service
              that We offer to You will form part of those that We:
              <br />
              (i) are required by law to give to You; or
              <br />
              (ii) voluntarily give to You when You decide to request and pay
              for the MHTL paid home care service or when, subsequently, You
              make any decision about pay for the MHTL paid home care service.
              <br />
              <br />
              (D) These Terms of Service, as well as any and all Contracts, are
              in the English language only.
              <br />
              <br />
              <strong>1. Definitions and Interpretation</strong>
              <br />
              1.1 In these Terms of Service, unless the context otherwise
              requires, the following expressions have the following meanings:
              <br />
              “Account” means the account, referred to in Sub-Clause 7.1, that
              You must set up with Us on Our Site or in-person in order to
              request, pay for, and access the MHTL paid home care service;
              <br />
              “Background Items” means background and other information about
              topics relevant to the MHTL paid home care service that We provide
              to You in-person, downloadable or viewable as text/graphics;
              <br />
              “Customer” means an individual Customer or Business Customers who
              is to receive or use the MHTL paid home care service;
              <br />
              “Contract” means a contract to access the to receive or use the
              MHTL paid home care service, as explained in Clause 7;
              <br />
              “MHTL paid home care service” includes any consultation,
              examination, diagnosis, advice, instruction, care or any other
              Background Items, content, materials, programs or related
              information, sold by Us through Our Site and made available by Us
              to You in-person and downloadable or other viewable text, graphics
              or other video, audio or other items or information, including
              Background Items.
              <br />
              <br />
              More terms continue as described in the original document...
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr="3" onClick={closeTermsModal}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </ChakraProvider>
  );
};

export default LandingPage;
