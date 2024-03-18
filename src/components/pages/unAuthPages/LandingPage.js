import React, { useEffect} from "react";
import {
  useDisclosure,
  Box,
  Button,
  HStack,
  Spacer,
  Image,
  extendTheme,
  ChakraProvider,
  Text,
  Divider,
} from "@chakra-ui/react";
import "animate.css";
import MHNurse from "../../../assets/MHNurse.svg";
import SignUp from "../../../assets/SignUp.svg";
import SelectCare from "../../../assets/SelectService.svg";
import GetMatched from "../../../assets/GetMatched.svg";
import ReceieveCare from "../../../assets/RecieveCare.svg";
import CenterMed from "../../../assets/CenterMedic.svg";
import Kudirat from "../../../assets/Kudirat.svg";
import Joy from "../../../assets/Josy.svg";
import Adeola from "../../../assets/Adeola.svg";
import Gift from "../../../assets/Gift.svg";
import "../../../styles/pages/LandingPage.css";
import GetStartedModal from "../../unAuthLayouts/GetStarted";
import AOS from "aos";
import "aos/dist/aos.css";
import NavigationBar from "../../unAuthLayouts/NavigationBar";
import Footer from "../../unAuthLayouts/Footer";
import Services from "../../unAuthLayouts/ServicesSection";
import Faqs from "../../unAuthLayouts/Faqs";

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
  useEffect(() => {
    AOS.init();
  }, []);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const settingsContainerStyle = {
    animation: "slideInUp 0.9s ease-in-out",
  };
  return (
    <ChakraProvider theme={customTheme}>
      <NavigationBar />
      <Box
        style={settingsContainerStyle}
        flexWrap="wrap"
        marginBottom={{ base: "50px", md: "100px" }}
        marginTop={{ base: "50px", md: "50px" }}
        display="flex"
        flexDirection={{ base: "column", md: "row" }}
        alignItems={{ base: "center", md: "flex-start" }}
        justifyContent={{ base: "center", md: "flex-start" }}
        textAlign={{ base: "center", md: "left" }}
        px={{ base: "20px", md: "unset" }}
        marginLeft={{ base: 0, md: "50px" }}
      >
        <HStack
          flexWrap="wrap"
          spacing={8}
          alignItems="center"
          justifyContent="center"
        >
          <Box
            marginTop={{ base: "50px", md: "50px" }}
            width={{ base: "100%", md: "auto" }}
            mb={{ base: "20px", md: "unset" }}
            textAlign={{ base: "center", md: "left" }}
          >
            <Text
              fontSize={{ base: "36px", md: "48px" }}
              textAlign={{ base: "center", md: "left" }}
              fontWeight="bold"
              fontFamily="body"
            >
              <span style={{ color: "#A210C6" }}>Healthcare</span> that you{" "}
            </Text>
            <Text
              marginTop="-10px"
              textAlign={{ base: "center", md: "left" }}
              fontSize={{ base: "36px", md: "48px" }}
              fontWeight="bold"
              fontFamily="body"
            >
              deserve at your fingertips
            </Text>
            <Text
              marginTop="10px"
              textAlign={{ base: "center", md: "left" }}
              fontWeight="bold"
              fontFamily="body"
              fontSize={{ base: "16px", md: "20px" }}
              color="#A210C6"
            >
              We source carefully trained medics to help <br />
              you and your loved ones on their health
              <br />
              journey.
            </Text>

            <Button
              marginTop={{ base: "10px", md: "50px" }}
              marginBottom={{ base: "50px", md: "50px" }}
              bg="#A210C6"
              color="white"
              borderRadius="100px"
              onClick={onOpen}
            >
              Get started
            </Button>
          </Box>
        </HStack>

        <Spacer />

        <style>
          {`
          @keyframes zoomInOut {
            0% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.2);
            }
            100% {
              transform: scale(1);
            }
          }
        `}
        </style>
        <Box
          marginTop={{ base: "0", md: "50px" }}
          marginLeft={{ base: "0", md: "0px" }}
          padding={{ base: "90px", md: "0px" }}
          className="box"
          data-aos="zoom-out"
          data-aos-duration="10000"
          h={{ base: "auto", md: "500px" }}
          w={{ base: "100%", md: "520px" }}
          animation="zoomInOut 8s infinite"
          overflow="hidden"
          display={{ base: "block", lg: "block" }}
        >
          <Image
            src={MHNurse}
            alt="Nurse"
            style={{ width: "100%", height: "100%" }}
          />
        </Box>
      </Box>
      <Services />
      <Divider />
      <Box flexWrap="wrap" bg="white">
        <Box marginTop={{ base: "20px", md: "50px" }}>
          <Text
            fontSize={{ base: "36px", md: "48px" }}
            fontWeight="bold"
            fontFamily="body"
            color="black"
          >
            How it works
          </Text>
        </Box>
        <Box
          justifyContent={{ base: "center", md: "space-between" }}
          // marginLeft={{ base: "0", md: "0px" }}
          padding={{ base: "0", md: "50px" }}
          flexWrap="wrap"
          display="flex"
        >
          <Box
            bg="white"
            justifyContent="center"
            alignItems="center"
            padding="20px"
            borderRadius="20px"
            flexDirection="row"
            data-aos="flip-left"
            data-aos-duration="30000"
          >
            <Box marginLeft="20px">
              <Image src={SignUp} alt="Logo" w="200px" h="200px" />
            </Box>

            <Text fontSize="xl" fontWeight="bold" textAlign="center">
              Sign up
            </Text>
            <Text textAlign="center">
              Getting started is quick <br />
              and easy. Sign up with <br />
              us to receive premium <br />
              care
            </Text>
          </Box>

          <Box
            bg="white"
            justifyContent="center"
            alignItems="center"
            padding="20px"
            borderRadius="20px"
            flexDirection="row"
            data-aos="flip-left"
            data-aos-duration="30000"
          >
            <Box marginLeft="20px">
              <Image src={SelectCare} alt="Logo" w="200px" h="200px" />
            </Box>

            <Text fontSize="xl" fontWeight="bold" textAlign="center">
              Select Care
            </Text>
            <Text textAlign="center">
              Now that you are a part <br />
              of our community, you <br />
              can find the kind of <br />
              service you need
            </Text>
          </Box>

          <Box
            bg="white"
            justifyContent="center"
            alignItems="center"
            padding="20px"
            borderRadius="20px"
            flexDirection="row"
            data-aos="flip-right"
            data-aos-duration="30000"
          >
            <Box marginLeft="15px">
              <Image src={GetMatched} alt="Logo" w="200px" h="200px" />
            </Box>

            <Text fontSize="xl" fontWeight="bold" textAlign="center">
              Get Matched
            </Text>
            <Text textAlign="center">
              Personalized care, just a <br />
              click away. We match <br />
              you to a professional <br />
              tailored to your needs
            </Text>
          </Box>

          <Box
            bg="white"
            justifyContent="center"
            alignItems="center"
            padding="20px"
            borderRadius="20px"
            flexDirection="row"
            data-aos="flip-right"
            data-aos-duration="30000"
          >
            <Box marginLeft="15px">
              <Image src={ReceieveCare} alt="Logo" w="200px" h="200px" />
            </Box>

            <Text fontSize="xl" fontWeight="bold" textAlign="center">
              Receive Care
            </Text>
            <Text textAlign="center">
              Getting started is quick <br />
              and easy. Sign up with <br />
              us to receive premium <br />
              care
            </Text>
          </Box>
        </Box>
      </Box>
     
      <Box flexWrap="wrap" bg="white">
        <Divider />

        <Box marginTop={{ base: "10", md: "30px" }}>
          <Text
            fontSize={{ base: "2xl", md: "48px" }}
            fontWeight="bold"
            fontFamily="Montserrat"
            color="black"
          >
            Testimonials
          </Text>
          <Text
            fontSize={{ base: "xl", md: "2xl" }}
            fontFamily="body"
            color="black"
          >
            Here is what our clients have to say about us
          </Text>
        </Box>

        <Box
          padding={{ base: "20", md: "30px" }}
          marginLeft={{ base: "0", md: "45px" }}
          flexWrap="wrap"
          display="flex"
        >
          <Box>
            <Box
              justifyContent="center"
              alignItems="center"
              padding="20px"
              borderRadius="20px"
              flexDirection="row"
            >
              <Box marginLeft="2px">
                <Image
                  src={Kudirat}
                  alt="image"
                  w="398px"
                  h="191px"
                  data-aos="fade-left"
                  data-aos-duration="10000"
                />
              </Box>
            </Box>
            <Box w="10" />

            <Box
              justifyContent="center"
              alignItems="center"
              padding="20px"
              borderRadius="20px"
              flexDirection="row"
            >
              <Box>
                <Image
                  src={Adeola}
                  alt="image"
                  w="398px"
                  h="191px"
                  data-aos="fade-right"
                  data-aos-duration="10000"
                />
              </Box>
            </Box>
          </Box>

          <Box
            display={{ base: "none", lg: "block" }}
            justifyContent="center"
            alignItems="center"
            padding="20px"
            borderRadius="20px"
            flexDirection="row"
          >
            <Box>
              <Image
                src={CenterMed}
                alt="image"
                w="306px"
                h="413px"
                data-aos="zoom-in"
                data-aos-duration="10000"
              />
            </Box>
          </Box>

          <Box>
            <Box
              justifyContent="center"
              alignItems="center"
              padding="20px"
              borderRadius="20px"
              flexDirection="row"
            >
              <Box>
                <Image
                  src={Joy}
                  alt="image"
                  w="398px"
                  h="191px"
                  data-aos="fade-left"
                  data-aos-duration="10000"
                />
              </Box>
            </Box>

            <Box
              justifyContent="center"
              alignItems="center"
              padding="20px"
              borderRadius="20px"
              flexDirection="row"
            >
              <Box>
                <Image
                  src={Gift}
                  alt="image"
                  w="398px"
                  h="191px"
                  data-aos="fade-right"
                  data-aos-duration="10000"
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <Faqs />
      <Footer />
      <GetStartedModal isOpen={isOpen} onClose={onClose} />
    </ChakraProvider>
  );
};

export default LandingPage;
