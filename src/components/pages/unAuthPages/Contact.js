import React from "react";
import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Image,
  extendTheme,
  ChakraProvider,
  Text,
  FormControl,
  Input,
  Flex,
  Textarea,
  AspectRatio,
} from "@chakra-ui/react";
import AOS from "aos";
import "aos/dist/aos.css";
import WhatsAppIcon from "../../../assets/WhatsApp.svg";
import AddressIcon from "../../../assets/AddressIcon.svg";
import EmailIcon from "../../../assets/Email.svg";
import PhoneIcon from "../../../assets/Phone.svg";
import "../../../styles/pages/LandingPage.css";
import NavigationBar from "../../unAuthLayouts/NavigationBar";
import Footer from "../../unAuthLayouts/Footer";

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
  const [input, setInput] = useState("");

  const handleInputChange = (e) => setInput(e.target.value);

  useEffect(() => {
    AOS.init();
  }, []);

  const settingsContainerStyle = {
    animation: "slideInUp 0.9s ease-in-out",
  };

  return (
    <ChakraProvider theme={customTheme}>
      <Box overflow="hidden">
        <Box overflowY="scroll" height="100vh">
          <NavigationBar />
          <Box
            flexWrap="wrap"
            style={settingsContainerStyle}
            mt={{ base: "0px", md: "60px" }}
            p={{ base: "20px", md: "0px" }}
            bg="white"
            ml={{ base: "0px", md: "60px" }}
            justify="center"
            display="flex"
          >
            <Box>
              <Text
                fontSize="28px"
                fontWeight="bold"
                textAlign="left"
                fontFamily="heading"
                color="#A210C6"
                paddingTop="70px"
                data-aos="fade-left"
                data-aos-duration="10000"
              >
                CONTACT US
              </Text>
              <Text
                fontSize={{ base: "32px", md: "48px", lg: "64px" }}
                fontWeight="bold"
                fontFamily="body"
                textAlign="left"
                color="#A210C6"
                marginLeft="5px"
                paddingTop="10px"
              >
                We would like to<br></br>
                hear from you
              </Text>
              <Text
                fontSize={{ base: "22px", md: "28px", lg: "24px" }}
                textAlign="left"
                color="#A210C6"
                marginLeft="5px"
                paddingTop="10px"
              >
                You’re one click away from getting the medical help you need.
                Fill <br></br>
                the form to let us know how we can help you.
              </Text>
            </Box>

            <Box
              borderRadius="10px"
              bg="white"
              ml={{ base: "15px", md: "60px" }}
              marginTop="80px"
              w={{ base: "323px", md: "523px" }}
              h={{ base: "620px", md: "692px" }}
              overflow="hidden"
              boxShadow={`0px 0px 1px 2px #ECCFF4`}
              className="animate__animated animate__fadeIn animate__slow"
            >
              <FormControl padding="40px">
                <Input
                  type="fullenane"
                  value={input}
                  onChange={handleInputChange}
                  marginTop="50px"
                  placeholder="Fullname"
                  bg="#FADCFF"
                />

                <Input
                  type="email"
                  value={input}
                  onChange={handleInputChange}
                  marginTop="50px"
                  placeholder="Email"
                  bg="#FADCFF"
                />

                <Input
                  type="Phone number"
                  value={input}
                  onChange={handleInputChange}
                  marginTop="50px"
                  placeholder="Phone number"
                  bg="#FADCFF"
                />

                <Textarea
                  type="Message"
                  value={input}
                  onChange={handleInputChange}
                  placeholder="How can we help"
                  marginTop="50px"
                  bg="#FADCFF"
                />
              </FormControl>
              <Button
                bg="#A210C6"
                color="white"
                marginTop="10px"
                ml={{ base: "15px", md: "-300px" }}
              >
                Send message
              </Button>
            </Box>
          </Box>

          <Box
            flexWrap="wrap"
            bg="#A210C6"
            paddingTop="60px"
            justify="center"
            marginTop="-250px"
            display="flex"
            color="white"
          >
            <Box ml={{ base: "0", md: "160px" }} marginTop="300px">
              <Flex>
                <Image
                  src={AddressIcon}
                  alt="Logo"
                  w="35px"
                  h="35px"
                  marginLeft="80px"
                />
                <Text
                  fontSize="24px"
                  fontFamily="body"
                  color="white"
                  marginLeft="20px"
                >
                  Address
                </Text>
              </Flex>

              <Text textAlign="left" marginLeft="80px" fontSize="16px">
                Polystar Building, 4th Floor,<br></br>
                2nd Roundabout, <br></br>
                Lekki Phase 1, Lagos State, <br></br>
                Nigeria
              </Text>
            </Box>

            <Box
              justify={{ base: "center", md: "" }}
              ml={{ base: "80px", md: "400px" }}
              mt={{ base: "100px", md: "300px" }}
              mb={{ base: "100px", md: "200px" }}
            >
              <Flex>
                <Image src={EmailIcon} alt="Logo" w="35px" h="35px" />
                <Text
                  fontSize="24px"
                  fontFamily="body"
                  color="white"
                  marginLeft="10px"
                  textAlign="left"
                >
                  Email
                </Text>
              </Flex>

              <Text fontSize="16px" textAlign="left">
                support@mikulhealth.com
              </Text>
              <Box mt={{ base: "30px", md: "10px" }}>
                <Flex>
                  <Image src={PhoneIcon} alt="Logo" w="42px" h="42px" />
                  <Text
                    fontSize="24px"
                    fontFamily="body"
                    color="white"
                    marginLeft="10px"
                  >
                    Phone/WhatsApp
                  </Text>
                </Flex>

                <Text fontSize="16px" textAlign="left">
                  +2349160596636
                </Text>
              </Box>
              <a href="https://example.com">
                <Image
                  src={WhatsAppIcon}
                  alt="Logo"
                  w="80px"
                  h="80px"
                  marginTop="2px"
                  ml={{ base: "180px", md: "300px" }}
                  mb={{ base: "10px", md: "-150px" }}
                />
              </a>
            </Box>
          </Box>

          <Box bg="#A210C6" padding="10px" marginTop="-30px">
            <AspectRatio ratio={16 / 9}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.952912260219!2d3.375295414770757!3d6.5276316452784755!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8b2ae68280c1%3A0xdc9e87a367c3d9cb!2sLagos!5e0!3m2!1sen!2sng!4v1567723392506"
                title="Google Maps location of Lagos"
                width="600"
                height="450"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
              />
            </AspectRatio>
          </Box>

          <Box h="10px" bg="white"></Box>
          <Footer />
        </Box>
      </Box>
    </ChakraProvider>
  );
};

export default LandingPage;
