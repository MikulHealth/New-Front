import React from "react";
import axios from "axios";
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
  FormLabel,
  Input,
  useToast,
  Select,
} from "@chakra-ui/react";
import AOS from "aos";
import "aos/dist/aos.css";
import Nurse from "../../assets/Nurse.svg";
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
    nin: "",
    license: "",
    guarantorName: "",
    guarantorPhone: "",
    guarantorEmail: "",
    medicType: "",
    specialization: "",
    cvCopy: "",
    bankName: "",
    accountNumber: "",
    accountName: "",
    homeAddress: "",
    phoneNumber: localStorage.getItem("phoneNumber"),
    image: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  // const [show, setShow] = useState(false);
  // const [uploading, setUploading] = useState(false);
  const [image] = useState();
  const [cvCopy] = useState();
  const [license] = useState();
  const [cvLoading, setCvLoading] = useState(false);
  const [licenseLoading, setLicenseLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const toast = useToast();
  // const handleClick = () => setShow(!show);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await postImage(image, formData, setFormData);
    await postCv(cvCopy, formData, setFormData);
    await postLicense(license, formData, setFormData);
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8080/v1/angel/verify-medic",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Handle response as needed
      console.log(response);
      toast({
        title: "Successful",
        description: response.data.message,
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      setTimeout(() => {
        navigate("/confirm-medic-reg");
      }, 3000);
      // Redirect or perform other actions based on the response
    } catch (error) {
      toast({
        title: "Failed",
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

  useEffect(() => {
    AOS.init();
  }, []);

  const postLicense = async (license, formData, setFormData) => {
    setLicenseLoading(true);
    if (license === undefined) {
      // toast.error("Please select an image")
      return;
    }
    console.log(license);
    if (
      license.type === "image/jpeg" ||
      license.type === "image/png" ||
      license.type === "application/pdf"
    ) {
      const data = new FormData();
      data.append("file", license);
      data.append("upload_preset", "license");
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
          license: imageData.url.toString(),
        });
        setLicenseLoading(false);
        console.log(imageData.url.toString());
      } catch (err) {
        console.log(err);
        setLicenseLoading(false);
      }
    } else {
      // toast.error("Please select an image");

      return;
    }
  };

  const postCv = async (cvCopy, formData, setFormData) => {
    setCvLoading(true);
    if (cvCopy === undefined) {
      // toast.error("Please select an image")
      return;
    }
    console.log(cvCopy);
    if (
      cvCopy.type === "image/jpeg" ||
      cvCopy.type === "image/png" ||
      cvCopy.type === "application/pdf"
    ) {
      const data = new FormData();
      data.append("file", cvCopy);
      data.append("upload_preset", "medicCv");
      data.append("cloud_name", "dmfewrwla");
      // setLoading(true);
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
          cvCopy: imageData.url.toString(),
        });
        setCvLoading(false);
        console.log(imageData.url.toString());
      } catch (err) {
        console.log(err);
        setCvLoading(false);
      }
    } else {
      // toast.error("Please select an image");

      return;
    }
  };

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
        <Box display="flex" overflow="hidden">
          <Box>
            <Image src={Nurse} alt="Logo" w="715px" h="1024px" />
            <Image
              src={Shade}
              alt="Logo"
              w="715px"
              h="1024px"
              marginTop="-900px"
            />
          </Box>
          <Box>
            <Text
              fontSize="32px"
              fontFamily="body"
              color="#A210C6"
              marginTop="80px"
              marginLeft="10px"
            >
              Complete Registration
            </Text>
            <form onSubmit={handleSubmit}>
              <FormControl isRequired marginTop="20px" marginLeft="125px">
                <Box display="flex" marginTop="20px">
                  <Box>
                    <FormLabel>Your Home address</FormLabel>
                    <Input
                      name="homeAddress"
                      placeholder="Home address"
                      htmlSize={20}
                      width="auto"
                      onChange={handleInputChange}
                    />
                  </Box>
                  <Box>
                    <FormLabel>Guaranto's Name</FormLabel>
                    <Input
                      name="guarantorName"
                      placeholder="Full name"
                      htmlSize={20}
                      width="auto"
                      marginLeft="10px"
                      onChange={handleInputChange}
                    />
                  </Box>
                </Box>
                <Box display="flex" marginTop="30px">
                  <Box>
                    <FormLabel>Guarantor's email address</FormLabel>
                    <Input
                      name="guarantorEmail"
                      placeholder="email address"
                      htmlSize={20}
                      width="auto"
                      onChange={handleInputChange}
                    />
                  </Box>
                  <Box>
                    <FormLabel>Guarantor's Phone number</FormLabel>
                    <Input
                      name="guarantorPhone"
                      placeholder="Phone number"
                      htmlSize={20}
                      width="auto"
                      marginLeft="10px"
                      onChange={handleInputChange}
                    />
                  </Box>
                </Box>
                <Box name="medicType" display="flex" marginTop="30px">
                  <Select
                    name="medicType"
                    placeholder="Medic Type"
                    w="205px"
                    onChange={handleInputChange}
                  >
                    <option value="Registered Nurse">Registered Nurse</option>
                    <option value="Physiotherapist">Physiotherapist</option>
                    <option value="Assistant Nurse">Assistant Nurse</option>
                  </Select>
                  <Box>
                    <Select
                      name="specialization"
                      placeholder="Specialization"
                      w="205px"
                      marginLeft="10px"
                      onChange={handleInputChange}
                    >
                      <option value="Midwife">Midwife</option>
                      <option value="Accident and Emergency">
                        Accident and Emergency
                      </option>
                      <option value="General Nurse">General Nurse</option>
                      <option value="Other">Other</option>
                    </Select>
                  </Box>
                </Box>

                <Box display="flex" marginTop="30px">
                  <Select
                    name="bankName"
                    placeholder="Your Bank name"
                    w="205px"
                    onChange={handleInputChange}
                  >
                    <option value="Access Bank">Access Bank</option>
                    <option value="Bankly">Bankly</option>
                    <option value="Zeneith Bank">Zeneith Bank</option>
                  </Select>
                  <Box>
                    <Input
                      name="accountNumber"
                      placeholder="Account number"
                      htmlSize={20}
                      width="auto"
                      marginLeft="10px"
                      onChange={handleInputChange}
                    />
                  </Box>
                </Box>
                <Box display="flex" marginTop="30px">
                  <Box>
                    <Input
                      name="accountName"
                      placeholder="Account Name"
                      htmlSize={20}
                      width="auto"
                      onChange={handleInputChange}
                    />
                  </Box>
                  <Box>
                    <Input
                      name="nin"
                      placeholder="NIN ID"
                      htmlSize={20}
                      width="auto"
                      marginLeft="10px"
                      onChange={handleInputChange}
                    />
                  </Box>
                </Box>
                <FormLabel marginLeft="10px" marginTop="30px">
                  Upload CV (only PNG, JPG and PDF files are accepted)
                </FormLabel>
                <Input
                  name="cvCopy"
                  marginLeft="-123px"
                  w="422px"
                  type="file"
                  onChange={(e) => {
                    postCv(e.target.files[0], formData, setFormData);
                  }}
                />
                {cvLoading && <LoadingSpinner size={20} />}
                <FormLabel marginLeft="10px" marginTop="30px">
                  Upload valid licence (only PNG, JPG and PDF files are
                  accepted)
                </FormLabel>
                <Input
                  name="license"
                  marginLeft="-123px"
                  w="422px"
                  type="file"
                  onChange={(e) => {
                    postLicense(e.target.files[0], formData, setFormData);
                  }}
                />
                {licenseLoading && <LoadingSpinner size={20} />}
                <FormLabel marginLeft="10px" marginTop="30px">
                  Upload headshort (only PNG and JPG files are accepted)
                </FormLabel>
                <Input
                  name="image"
                  marginLeft="-123px"
                  w="422px"
                  type="file"
                  accept="image/*"
                  placeholder="Image"
                  onChange={(e) => {
                    postImage(e.target.files[0], formData, setFormData);
                  }}
                />
                {imageLoading && <LoadingSpinner size={20} />}

                <Text
                  marginLeft="-123px"
                  fontSize="18px"
                  fontFamily="Montserrat"
                  marginTop="20px"
                  // fontWeight="bold"
                >
                  By clicking the “create account” button, you agree to our{" "}
                  <br></br>
                  <ChakraLink fontStyle="italic" href="/login" color="#A210C6">
                    terms and conditions
                  </ChakraLink>
                </Text>
                <Button
                  type="submit"
                  w="350px"
                  bg="#A210C6"
                  marginTop="20px"
                  marginLeft="-140px"
                  color="white"
                  isLoading={loading}
                  loadingText="Creating..."
                >
                  {loading ? "Loading..." : "Create Account"}
                </Button>
                <Text
                  marginLeft="-123px"
                  fontSize="16px"
                  fontFamily="Montserrat"
                  marginTop="10px"
                  fontWeight="bold"
                >
                  Already have an account?{" "}
                  <ChakraLink fontStyle="italic" href="/login" color="#A210C6">
                    Login
                  </ChakraLink>
                </Text>
              </FormControl>
            </form>
          </Box>
        </Box>
      </Box>
    </ChakraProvider>
  );
};

export default LandingPage;
