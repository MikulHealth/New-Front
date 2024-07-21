import React, { useState, useEffect } from "react";
import {
  useDisclosure,
  Box,
  Button,
  HStack,
  Spacer,
  Image,
  extendTheme,
  ChakraProvider,
  keyframes,
  usePrefersReducedMotion,
  useBreakpointValue,
  Flex,
  Text,
  Divider,
} from "@chakra-ui/react";
import "animate.css";
import MHNurse from "../../../assets/MHNurse.svg";
import KudiratImg from "../../../assets/KudiratImg.svg";
import JoyImg from "../../../assets/JoyImg.svg";
import AdeolaImg from "../../../assets/AdeolaImg.svg";
import GiftImg from "../../../assets/GiftImg.svg";
import SignUp from "../../../assets/SignUp.svg";
import SelectCare from "../../../assets/SelectService.svg";
import GetMatched from "../../../assets/GetMatched.svg";
import ReceieveCare from "../../../assets/RecieveCare.svg";
// import CenterMed from "../../../assets/CenterMedic.svg";
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

const rollIn = keyframes`
  from { transform: translateY(100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const rollOut = keyframes`
  from { transform: translateY(0); opacity: 1; }
  to { transform: translateY(-100%); opacity: 0; }
`;

const phrases = ["Easy!", "Reliable!", "Secure!", "Convenient!"];

const LandingPage = () => {
  useEffect(() => {
    AOS.init()
  }, []);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animation, setAnimation] = useState(rollIn);
  const prefersReducedMotion = usePrefersReducedMotion();
  

  const responsivePadding = useBreakpointValue({
    base: "4",
    md: "8",
    lg: "10",
  });
  const responsiveFontSize = useBreakpointValue({
    base: "12px",
    md: "15px",
  });
  const responsiveAvatarSize = useBreakpointValue({
    base: "40px",
    md: "100px",
    lg: "125px",
  });

  useEffect(() => {
    const intervalId = setInterval(() => {
      setAnimation(rollOut);
      setTimeout(() => {
        setCurrentIndex((currentIndex + 1) % phrases.length);
        setAnimation(rollIn);
      }, 500);
    }, 3000); 
    return () => clearInterval(intervalId);
  }, [currentIndex]);

  const animationStyle = prefersReducedMotion
    ? undefined
    : `${animation} 0.5s ease-in-out forwards`;

  const settingsContainerStyle = {
    animation: "slideInUp 0.9s ease-in-out",
  };
  return (
    <ChakraProvider theme={customTheme}>
      <NavigationBar />
      <Box
        style={settingsContainerStyle}
        flexWrap="wrap"
        display="flex"
        flexDirection={{ base: "column", md: "row" }}
        alignItems={{ base: "center", md: "flex-start" }}
        justifyContent={{ base: "center", md: "flex-start" }}
        textAlign={{ base: "center", md: "left" }}
        px={{ base: "20px", md: "5px" }}
        marginLeft={{ base: 0, md: "50px" }}
        maxWidth="1280px"
        margin="0 auto"
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
            textAlign="left"
            justify="left"
          >
            <Text
              fontSize={{ base: "30px", md: "48px" }}
              fontWeight="bold"
              fontFamily="body"
              
            >
              <span style={{ color: "#A210C6" }}>Healthcare</span> that you{" "}
              <br></br>
              deserve at your fingertips.
            </Text>

            <Text
              mt="5px"
              textAlign={{ base: "left", md: "left" }}
              fontSize={{ base: "26px", md: "48px" }}
              fontWeight="bold"
              fontFamily="body"
              css={{
                animation: animationStyle,
              }}
            >
              {phrases[currentIndex]}
            </Text>
            <Text
              marginTop="10px"
              textAlign={{ base: "left", md: "left" }}
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
              mt={{ base: "30px", md: "50px" }}
              mb={{ base: "30px", md: "50px" }}
              // bg="#A210C6"
              bg="linear-gradient(80deg, #A210C6, #E552FF)"
      
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
          mt={{ base: "0", md: "50px" }}
          mb={{base: "0", ms: "50px"}}
          ml={{ base: "0", md: "0px" }}
          padding={{ base: "50px", md: "0px" }}
          className="box"
          data-aos="zoom-out"
          data-aos-duration="10000"
          h={{ base: "auto", md: "500px" }}
          w={{ base: "100%", md: "520px" }}
          animation="zoomInOut 8s infinite"
          overflow="hidden"
          display={{ base: "block", lg: "block" }}
          maxWidth="300px"
        >
          <Image
            src={MHNurse}
            alt="Nurse"
            style={{ width: "100%", height: "100%" }}
           
          />
        </Box>
        <Spacer />
      </Box>
      <Services />
      <Divider />
      <Box maxWidth="1280px" margin="0 auto" flexWrap="wrap" bg="white">
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

      <Box maxWidth="1280px" margin="0 auto" flexWrap="wrap" bg="white">
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
            fontSize={{ base: "18px", md: "22px", lg: "24px" }}
            fontFamily="body"
            color="black"
          >
            Here is what our clients have to say about us
          </Text>
        </Box>

        <Box
          padding={{ base: "0px", md: "30px" }}
          ml={{ base: "30px", md: "45px" }}
          justify="center" 
          mt={{ base: "10px" }}
          flexWrap="wrap"
          display="flex"
        >
          <Flex flexWrap="wrap">
            <Box
              justifyContent="center"
              alignItems="center"
              padding="20px"
              borderRadius="20px"
              // flexDirection="row"
            >
              <Box marginLeft="2px">
                <Flex
                  border="2px"
                  borderColor="#A210C6"
                  bg="white"
                  boxShadow="base"
                  borderRadius="lg"
                  overflow="hidden"
                  align="center"
                  w={{ base: " 298px", md: "498px" }}
                  h={{ base: " 91px", md: "191px" }}
                  p={responsivePadding}
                >
                  <Image
                    borderRadius="full"
                    boxSize={responsiveAvatarSize}
                    src={KudiratImg}
                    alt="Kudirat J."
                    marginRight={{ md: "4" }}
                  />
                  <Box flex="1">
                    <Text
                      ml={{ base: "10px" }}
                      fontSize={responsiveFontSize}
                      color="black"
                      fontFamily="body"
                      textAlign="left"
                    >
                      They offer quality, affordable and accessible home care
                      services. I highly recommend 👍
                    </Text>
                    <Text
                      fontSize={responsiveFontSize}
                      fontWeight="bold"
                      color="black"
                      fontFamily="body"
                      mt={{ base: "2", md: "4" }}
                      textAlign="left"
                    >
                      Kudirat J.
                    </Text>
                  </Box>
                </Flex>
              </Box>
            </Box>
            <Box w="10" />

            <Box
              justifyContent="center"
              alignItems="center"
              padding="20px"
              borderRadius="20px"
              // flexDirection="row"
            >
              <Box>
                <Flex
                  border="2px"
                  borderColor="#A210C6"
                  bg="white"
                  w={{ base: " 298px", md: "498px" }}
                  h={{ base: " 91px", md: "191px" }}
                  boxShadow="base"
                  borderRadius="lg"
                  overflow="hidden"
                  align="center"
                  p={responsivePadding}
                >
                  <Image
                    borderRadius="full"
                    boxSize={responsiveAvatarSize}
                    src={JoyImg}
                    alt="Kudirat J."
                    marginRight={{ md: "4" }}
                  />
                  <Box flex="1">
                    <Text
                      ml={{ base: "10px" }}
                      fontSize={responsiveFontSize}
                      color="black"
                      fontFamily="body"
                      textAlign="left"
                    >
                      I like the fact that it isn't out of reach but affordable.
                      The quality of care given is highly commendable.
                    </Text>
                    <Text
                      fontSize={responsiveFontSize}
                      fontWeight="bold"
                      color="black"
                      fontFamily="body"
                      mt={{ base: "2", md: "4" }}
                      textAlign="left"
                    >
                      Joy U.
                    </Text>
                  </Box>
                </Flex>
              </Box>
            </Box>
          </Flex>

          {/* <Box
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
          </Box> */}

          <Flex flexWrap="wrap">
            <Box
              justifyContent="center"
              alignItems="center"
              padding="20px"
              borderRadius="20px"
              // flexDirection="row"
            >
              <Box>
                <Flex
                  border="2px"
                  borderColor="#A210C6"
                  bg="white"
                  w={{ base: " 298px", md: "498px" }}
                  h={{ base: " 91px", md: "191px" }}
                  boxShadow="base"
                  borderRadius="lg"
                  overflow="hidden"
                  align="center"
                  p={responsivePadding}
                >
                  <Image
                    borderRadius="full"
                    boxSize={responsiveAvatarSize}
                    src={AdeolaImg}
                    alt="Adeola G."
                    marginRight={{ md: "4" }}
                  />
                  <Box flex="1">
                    <Text
                      ml={{ base: "10px" }}
                      fontSize={responsiveFontSize}
                      color="black"
                      fontFamily="body"
                      textAlign="left"
                    >
                      Their standard of care is excellent. The caregiver was
                      friendly and thoughtful.
                    </Text>
                    <Text
                      fontSize={responsiveFontSize}
                      fontWeight="bold"
                      color="black"
                      fontFamily="body"
                      mt={{ base: "2", md: "4" }}
                      textAlign="left"
                    >
                      Adeola G.
                    </Text>
                  </Box>
                </Flex>
              </Box>
            </Box>
            <Box w="10" />
            <Box
              justifyContent="center"
              alignItems="center"
              padding="20px"
              borderRadius="20px"
              // flexDirection="row"
            >
              <Box>
                <Flex
                  border="2px"
                  borderColor="#A210C6"
                  bg="white"
                  w={{ base: " 298px", md: "498px" }}
                  h={{ base: " 91px", md: "191px" }}
                  boxShadow="base"
                  borderRadius="lg"
                  overflow="hidden"
                  align="center"
                  p={responsivePadding}
                >
                  <Image
                    borderRadius="full"
                    boxSize={responsiveAvatarSize}
                    src={GiftImg}
                    alt="Gift D."
                    marginRight={{ md: "4" }}
                  />
                  <Box flex="1">
                    <Text
                      fontSize={responsiveFontSize}
                      color="black"
                      fontFamily="body"
                      ml={{ base: "10px" }}
                      textAlign="left"
                    >
                      Mikul Health is affordable and delivers great customer
                      service .
                    </Text>
                    <Text
                      fontSize={responsiveFontSize}
                      fontWeight="bold"
                      color="black"
                      fontFamily="body"
                      mt={{ base: "2", md: "4" }}
                      textAlign="left"
                    >
                      Gift D.
                    </Text>
                  </Box>
                </Flex>
              </Box>
            </Box>
          </Flex>
        </Box>
      </Box>
      <Faqs />
      <Footer />
      <GetStartedModal isOpen={isOpen} onClose={onClose} />
    </ChakraProvider>
  );
};

export default LandingPage;
