import React, { useState } from "react";
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
    medicGovId: "",
    medicHomeAddress: "",
    medicHeadshot: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      for (const key in formData) {
        data.append(key, formData[key]);
      }

      const response = await fetch(
        "http://localhost:8080/v1/angel/verify-medic",
        {
          method: "POST",
          body: data,
        }
      );

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "Submit Successfully",
          description: result.message,
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        setTimeout(() => {
          navigate("/complete");
        }, 3000);
      } else {
        toast({
          title: "Submition Failed",
          description: result.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
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
           <Box top={{ base: "10px", md: "20px" }} left={{ base: "10px", md: "20px" }}>
          <a href="/">
            <Image src={logo} alt="Logo" h={{ base: "40px", md: "58px" }} w={{ base: "150px", md: "200px" }} />
          </a>
        </Box>
          <Text
            fontFamily="heading"
            fontSize="2xl"
            color="#A210C6"
            mb="4"
            textAlign="center"
          >
            Verify Medic's Identity
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
              <FormLabel>Medic's Government Issued ID</FormLabel>
              <Input
                name="medicGovId"
                placeholder="Government Issued ID"
                type="file"
                accept="image/*,application/pdf"
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    medicGovId: e.target.files[0],
                  });
                }}
                marginBottom="20px"
              />
              <FormLabel>Medic's Headshot (only PNG and JPG files are accepted)</FormLabel>
              <Input
                name="medicHeadshot"
                placeholder="Headshot"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    medicHeadshot: e.target.files[0],
                  });
                }}
                marginBottom="20px"
              />
              {loading && <LoadingSpinner size={20} />}
              <FormLabel>Medic's Home Address</FormLabel>
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
