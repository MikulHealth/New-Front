import React from "react";
import axios from "axios";
import logo from "../../assets/Logo.svg";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../../apiCalls/config";
import {
  Box,
  Button,
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
  Stack,
  FormErrorMessage,
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
    license: "",
    medicType: "",
    specialization: "",
    cvCopy: "",
    bankName: "",
    accountNumber: "",
    accountName: "",
    phoneNumber: localStorage.getItem("phoneNumber"),
    yearsOfExp: "",
    preferredLanguage: "",
  });

  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();
  const [cvCopy, setCvCopy] = useState();
  const [license, setLicense] = useState();
  const [cvLoading, setCvLoading] = useState(false);
  const [licenseLoading, setLicenseLoading] = useState(false);
  const toast = useToast();

  const majorLanguages = [
    "English",
    "Yoruba",
    "Igbo",
    "Hausa",
    "Pidgin",
    "Other",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    validateInput(name, value);
  };

  const validateInput = (name, value) => {
    let errors = { ...validationErrors };
    switch (name) {
      case "yearsOfExp":
        if (!/^\d+$/.test(value) || parseInt(value, 10) < 0) {
          errors[name] = "Please enter a valid number of years.";
        } else {
          delete errors[name];
        }
        break;
      case "medicType":
      case "specialization":
      case "preferredLanguage":
        if (!value) {
          errors[name] = `${name.replace(/([A-Z])/g, " $1")} is required.`;
        } else {
          delete errors[name];
        }
        break;
      default:
        break;
    }
    setValidationErrors(errors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate all fields before submission
    for (let field in formData) {
      validateInput(field, formData[field]);
    }

    if (Object.keys(validationErrors).length > 0) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form before submitting.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    setLoading(true);
    await postCv(cvCopy, formData, setFormData);
    await postLicense(license, formData, setFormData);

    try {
      const response = await axios.post(
        `${baseUrl}/angel/registerMedic`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        toast({
          title: "Successful",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        setTimeout(() => {
          navigate("/verify-medic");
        }, 5000);
      } else {
        setLoading(false);
        console.error("Error registering");
        toast.error(response.data.message);
      }
    } catch (error) {
      toast({
        title: "Failed",
        description: error.response.data,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    AOS.init();
  }, []);

  const postLicense = async (license, formData, setFormData) => {
    setLicenseLoading(true);
    if (license === undefined) {
      return;
    }
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
      } catch (err) {
        console.log(err);
        setLicenseLoading(false);
      }
    } else {
      return;
    }
  };

  const postCv = async (cvCopy, formData, setFormData) => {
    setCvLoading(true);
    if (cvCopy === undefined) {
      return;
    }
    if (
      cvCopy.type === "image/jpeg" ||
      cvCopy.type === "image/png" ||
      cvCopy.type === "application/pdf"
    ) {
      const data = new FormData();
      data.append("file", cvCopy);
      data.append("upload_preset", "medicCv");
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
          cvCopy: imageData.url.toString(),
        });
        setCvLoading(false);
      } catch (err) {
        console.log(err);
        setCvLoading(false);
      }
    } else {
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
          <Box
            top={{ base: "-10px", md: "20px" }}
            left={{ base: "-10px", md: "20px" }}
          >
            <a href="/">
              <Image
                src={logo}
                alt="Logo"
                h={{ base: "40px", md: "58px" }}
                w={{ base: "150px", md: "200px" }}
              />
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
          <form onSubmit={handleSubmit}>
            <FormControl color="#00000080" isRequired isInvalid={validationErrors.medicType}>
              <Stack
                direction={{ base: "column", md: "row" }}
                spacing={4}
                marginTop="20px"
              >
                <Box flex="1">
                  <FormLabel>Medic Type</FormLabel>
                  <Select
                    name="medicType"
                    placeholder="Medic Type"
                    onChange={handleInputChange}
                  >
                    <option value="Registered Nurse">Registered Nurse</option>
                    {/* <option value="Physiotherapist">Physiotherapist</option> */}
                    <option value="Certified Nurse Assistant">
                      Certified Nurse Assistant
                    </option>
                    <option value="Professional Nanny">
                      Professional Nanny
                    </option>
                  </Select>
                  {validationErrors.medicType && (
                    <FormErrorMessage>
                      <Text as="i">{validationErrors.medicType}</Text>
                    </FormErrorMessage>
                  )}
                </Box>
                <Box flex="1">
                  <FormLabel>Specialization</FormLabel>
                  <Select
                    name="specialization"
                    placeholder="Specialization"
                    onChange={handleInputChange}
                  >
                    <option value="Midwife">Midwife</option>
                    <option value="Accident and Emergency">
                      Accident and Emergency
                    </option>
                    <option value="General Nurse">General Nurse</option>
                    <option value="Other">Other</option>
                  </Select>
                  {validationErrors.specialization && (
                    <FormErrorMessage>
                      <Text as="i">{validationErrors.specialization}</Text>
                    </FormErrorMessage>
                  )}
                </Box>
              </Stack>
              <Box
                spacing={4}
                marginTop="20px"
                flex="1"
                isInvalid={validationErrors.preferredLanguage}
              >
                <FormLabel>Native Language</FormLabel>
                <Select
                  isRequired
                  name="preferredLanguage"
                  placeholder="select language"
                  value={formData.preferredLanguage}
                  onChange={handleInputChange}
                >
                  {majorLanguages.map((language) => (
                    <option key={language} value={language}>
                      {language}
                    </option>
                  ))}
                </Select>
                {validationErrors.preferredLanguage && (
                  <FormErrorMessage>
                    <Text as="i">{validationErrors.preferredLanguage}</Text>
                  </FormErrorMessage>
                )}
              </Box>
              <Box
                spacing={4}
                marginTop="20px"
                flex="1"
                isInvalid={validationErrors.yearsOfExp}
              >
                <FormLabel>Years of experience</FormLabel>
                <Input
                  name="yearsOfExp"
                  type="number"
                  placeholder="How many years of experience do you have"
                  onChange={handleInputChange}
                />
                {validationErrors.yearsOfExp && (
                  <FormErrorMessage>
                    <Text as="i">{validationErrors.yearsOfExp}</Text>
                  </FormErrorMessage>
                )}
              </Box>
              <FormLabel marginTop="20px">
                Upload CV (only PNG, JPG and PDF files are accepted)
              </FormLabel>
              <Input
                name="cvCopy"
                type="file"
                onChange={(e) => {
                  setCvCopy(e.target.files[0]);
                  postCv(e.target.files[0], formData, setFormData);
                }}
              />
              {cvLoading && <LoadingSpinner size={20} />}
              <FormLabel marginTop="20px">
                Upload valid licence/ certificate for Certfied Nurse
                Assistant or any relevant certificate to your training (only PNG, JPG and PDF files are accepted)
              </FormLabel>
              <Input
                name="license"
                type="file"
                onChange={(e) => {
                  setLicense(e.target.files[0]);
                  postLicense(e.target.files[0], formData, setFormData);
                }}
              />
              {licenseLoading && <LoadingSpinner size={20} />}
              <Button
                type="submit"
                w={{ base: "100%", md: "350px" }}
                // bg="#A210C6"
                  bg="linear-gradient(80deg, #A210C6, #E552FF)"
                marginTop="20px"
                color="white"
                isLoading={loading}
                loadingText="Submitting..."
              >
                {loading ? "Loading..." : "Submit"}
              </Button>
            </FormControl>
          </form>
        </Box>
      </Flex>
    </ChakraProvider>
  );
};

export default LandingPage;
