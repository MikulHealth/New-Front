import React from "react";
import axios from "axios";
import logo from "../../assets/Logo.svg";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Link as ChakraLink,
  Image,
  extendTheme,
  ChakraProvider,
  Text,
  FormControl,
  FormLabel,
  Input,
  useToast,
  Select,
  Flex,
  VStack,
  Stack,
} from "@chakra-ui/react";
import AOS from "aos";
import "aos/dist/aos.css";
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
      <Flex overflow="scroll" align="center" justify="center" height="100vh">
        <Box
          mb="300px"
          mt={{ base: "700px", md: "800px" }}
          width={{ base: "90%", sm: "500px" }}
          h={{ base: "140%", md: "160%" }}
          p="6"
          bg="white"
        >
          <Box  top={{ base: "-10px", md: "20px" }} left={{ base: "-10px", md: "20px" }}>
          <a href="/">
            <Image src={logo} alt="Logo" h={{ base: "40px", md: "58px" }} w={{ base: "150px", md: "200px" }} />
          </a>
        </Box>
          <Text
            fontFamily="header"
            fontSize="2xl"
            color="#A210C6"
            mb="4"
            textAlign="center"
          >
            Get started as medic
          </Text>
            <form onSubmit={handleSubmit} >
              <FormControl isRequired>
                <Stack direction={{ base: "column", md: "row" }} spacing={4} marginTop="20px">
                  <Box flex="1">
                    <FormLabel>Medic Type</FormLabel>
                    <Select name="medicType" placeholder="Medic Type" onChange={handleInputChange}>
                      <option value="Registered Nurse">Registered Nurse</option>
                      <option value="Physiotherapist">Physiotherapist</option>
                      <option value="Assistant Nurse">Assistant Nurse</option>
                    </Select>
                  </Box>
                  <Box flex="1">
                    <FormLabel>Specialization</FormLabel>
                    <Select name="specialization" placeholder="Specialization" onChange={handleInputChange}>
                      <option value="Midwife">Midwife</option>
                      <option value="Accident and Emergency">Accident and Emergency</option>
                      <option value="General Nurse">General Nurse</option>
                      <option value="Other">Other</option>
                    </Select>
                  </Box>
                </Stack>
                <Stack direction={{ base: "column", md: "row" }} spacing={4} marginTop="20px">
                  <Box flex="1">
                    <FormLabel>Bank Name</FormLabel>
                    <Select name="bankName" placeholder="Your Bank name" onChange={handleInputChange}>
                      <option value="Access Bank">Access Bank</option>
                      <option value="Bankly">Bankly</option>
                      <option value="Zeneith Bank">Zeneith Bank</option>
                    </Select>
                  </Box>
                  <Box flex="1">
                    <FormLabel>Account Number</FormLabel>
                    <Input name="accountNumber" placeholder="Account number" onChange={handleInputChange} />
                  </Box>
                </Stack>
                <Stack direction={{ base: "column", md: "row" }} spacing={4} marginTop="20px">
                  <Box flex="1">
                    <FormLabel>Account Name</FormLabel>
                    <Input name="accountName" placeholder="Account Name" onChange={handleInputChange} />
                  </Box>
                </Stack>
                <FormLabel marginTop="20px">Upload CV (only PNG, JPG and PDF files are accepted)</FormLabel>
                <Input
                  name="cvCopy"
                  type="file"
                  onChange={(e) => {
                    postCv(e.target.files[0], formData, setFormData);
                  }}
                />
                {cvLoading && <LoadingSpinner size={20} />}
                <FormLabel marginTop="20px">Upload valid licence (only PNG, JPG and PDF files are accepted)</FormLabel>
                <Input
                  name="license"
                  type="file"
                  onChange={(e) => {
                    postLicense(e.target.files[0], formData, setFormData);
                  }}
                />
                {licenseLoading && <LoadingSpinner size={20} />}
                <FormLabel marginTop="20px">Upload headshot (only PNG and JPG files are accepted)</FormLabel>
                <Input
                  name="image"
                  type="file"
                  accept="image/*"
                  placeholder="Image"
                  onChange={(e) => {
                    postImage(e.target.files[0], formData, setFormData);
                  }}
                />
                {imageLoading && <LoadingSpinner size={20} />}
               
                <Button
                  type="submit"
                  w={{ base: "100%", md: "350px" }}
                  bg="#A210C6"
                  marginTop="20px"
                  color="white"
                  isLoading={loading}
                  loadingText="Submiting..."
                >
                  {loading ? "Loading..." : "Submit"}
                </Button>
              </FormControl>
            </form>
          {/* </VStack> */}
        </Box>
      </Flex>
    </ChakraProvider>
  );
};

export default LandingPage;
