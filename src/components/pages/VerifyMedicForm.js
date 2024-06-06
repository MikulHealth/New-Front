import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  ChakraProvider,
  FormControl,
  FormLabel,
  Input,
  Image,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/Logo.svg";
import { extendTheme } from "@chakra-ui/react";
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

const VerifyMedicForm = () => {
  const [formData, setFormData] = useState({
    guarantorFirstName: "",
    guarantorLastName: "",
    guarantorEmail: "",
    guarantorPhone: "",
    guarantorHomeAddress: "",
    phoneNumber: localStorage.getItem("phoneNumber"),
    ninNumber: "",
    ninCopy: "",
    medicHomeAddress: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const [ninCopy] = useState();
  const [NINLoading, setNINLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
   
    await postNINCopy(ninCopy, formData, setFormData);
    setLoading(true);

      try {
        const response = await axios.post(
            "http://localhost:8080/v1/angel/medicIdentity",
          formData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

      console.log(response);
      toast({
        title: "Successful",
        description: response.data.message,
        status: "success",
        duration: 5000,
        isClosable: true,
      });

        setTimeout(() => {
          navigate("/complete");
        }, 5000);
     
    } catch (error) {
      toast({
        title: "An error occurred",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };


  const postNINCopy = async (image, formData, setFormData) => {
    setNINLoading(true);
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
        setNINLoading(false);
        console.log(imageData.url.toString());
      } catch (err) {
        console.log(err);
        setNINLoading(false);
      }
    } else {
      // toast.error("Please select an image");

      return;
    }
  };

  return (
    <ChakraProvider theme={customTheme}>
      <Box overflow="scroll" align="center" justify="center" height="100vh">
        <Box
          //   mb="100px"
          //   mt={{ base: "700px", md: "300px" }}
          width={{ base: "90%", sm: "500px" }}
          h={{ base: "140%", md: "160%" }}
          p="6"
          bg="white"
        >
          <Box
            top={{ base: "10px", md: "20px" }}
            left={{ base: "10px", md: "20px" }}
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
            fontFamily="heading"
            fontSize="2xl"
            color="#A210C6"
            mb="4"
            textAlign="center"
          >
            Verify Your Identity
          </Text>
          <form onSubmit={handleSubmit}>
            <FormControl isRequired marginTop="20px">
              <Box display="flex" marginBottom="20px">
                <Box flex="1" marginRight="10px">
                  <FormLabel>Guarantor's First Name</FormLabel>
                  <Input
                    name="guarantorFirstName"
                    placeholder="First Name"
                    onChange={handleInputChange}
                  />
                </Box>
                <Box flex="1" marginLeft="10px">
                  <FormLabel>Guarantor's Last Name</FormLabel>
                  <Input
                    name="guarantorLastName"
                    placeholder="Last Name"
                    onChange={handleInputChange}
                  />
                </Box>
              </Box>
              <Box display="flex" marginBottom="20px">
                <Box flex="1" marginRight="10px">
                  <FormLabel>Guarantor's Email Address</FormLabel>
                  <Input
                    name="guarantorEmail"
                    placeholder="Email Address"
                    onChange={handleInputChange}
                  />
                </Box>
                <Box flex="1" marginLeft="10px">
                  <FormLabel>Guarantor's Phone Number</FormLabel>
                  <Input
                    name="guarantorPhone"
                    placeholder="Phone Number"
                    onChange={handleInputChange}
                  />
                </Box>
              </Box>
              <FormLabel>Guarantor's Home Address</FormLabel>
              <Input
                name="guarantorHomeAddress"
                placeholder="Home Address"
                onChange={handleInputChange}
                marginBottom="20px"
              />
              <FormLabel>National Identity nummber (NIN) </FormLabel>
              <Input
                name="ninNumber"
                placeholder="NIN"
                onChange={handleInputChange}
                marginBottom="20px"
              />
              <FormLabel>
                NIN Copy (only PNG, JPG and PDF files are accepted)
              </FormLabel>
              <Input
                name="ninCopy"
                placeholder="Nin copy"
                type="file"
                accept="image/*,application/pdf"
                marginBottom="20px"
                onChange={(e) => {
                  postNINCopy(e.target.files[0], formData, setFormData);
                }}
              />
              {NINLoading && <LoadingSpinner size={20} />}

              <FormLabel>Your Home Address</FormLabel>
              <Input
                name="medicHomeAddress"
                placeholder="Home Address"
                onChange={handleInputChange}
                marginBottom="20px"
              />
              <Button
                type="submit"
                w="100%"
                bg="#A210C6"
                color="white"
                isLoading={loading}
                loadingText="Submiting..."
              >
                {loading ? "Submiting..." : "Submit"}
              </Button>
            </FormControl>
          </form>
        </Box>
      </Box>
    </ChakraProvider>
  );
};

export default VerifyMedicForm;
