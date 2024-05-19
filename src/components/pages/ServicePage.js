import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import ElderlyCareModal from "../sections/ElderlyCareModal";
import PostpartumCareModal from "../sections/PostpartumCareModal";
import RecoveryCareModal from "../sections/RecoveryCareModal";
import NannyCareModal from "../sections/NannyCareModal";
import ShortNurseVisitModal from "../sections/ShortNurseVisitModal";
import LeftSideBar from "../authLayouts/LeftSideBar";
import {
  ChakraProvider,
  VStack,
  Image,
  Box,
  Text,
  Flex,
  extendTheme,
} from "@chakra-ui/react";
import NavBar from "../authLayouts/NavBar";
import HelppIcon from "../../assets/HelpIcon.svg";
import Chevron from "../../assets/Chevron.svg";
import MobileFooter from "../authLayouts/MobileFooter";

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
    body: "Montserrat, sans-serif",
    heading: "Gill Sans MT, sans-serif",
  },
});

const ServicePage = () => {
  const [showElderlyCareModal, setShowElderlyCareModal] = useState(false);
  const [showPostpartumCareModal, setShowPostpartumCareModal] = useState(false);
  const [showRecoveryCareModal, setShowRecoveryCareModal] = useState(false);
  const [showNannyCareModal, setShowNannyCareModal] = useState(false);
  const [showShortCareModal, setShowShortCareModal] = useState(false);

  const handleOpenElderlyCareModal = () => {
    setShowElderlyCareModal(true);
  };

  const handleOpenRecoveryCareModal = () => {
    setShowRecoveryCareModal(true);
  };

  const handleOpenPostpatumCareModal = () => {
    setShowPostpartumCareModal(true);
  };

  const handleOpenNannyCareModal = () => {
    setShowNannyCareModal(true);
  };

  const handleOpenShortCareModal = () => {
    setShowShortCareModal(true);
  };

  const services = [
    {
      title: "Elderly care",
      // icon: Elderly,
      onClick: handleOpenElderlyCareModal,
    },
    {
      title: "Postpartum care",
      // icon: PostPaturm,
      onClick: handleOpenPostpatumCareModal,
    },
    {
      title: "Recovery care",
      // icon: Recovery,
      onClick: handleOpenRecoveryCareModal,
    },
    {
      title: "Nanny services",
      // icon: PostPaturm,
      onClick: handleOpenNannyCareModal,
    },
    {
      title: "Short home visit",
      // icon: Online,
      onClick: handleOpenShortCareModal,
    },
  ];

  const settingsContainerStyle = {
    animation: "slideInUp 0.9s ease-in-out",
  };

  return (
    <ChakraProvider theme={customTheme}>
      <LeftSideBar />
      <VStack
        style={settingsContainerStyle}
        // overflow="scroll"
        ml={{ md: "270px" }}
        w={{ base: "100%", md: "80%" }}
        h={{ base: "100%", md: "100%" }}
      >
        <VStack marginTop="10px">
          <NavBar />
          <VStack mb={{ base: "100px", md: "0" }}>
            <Box
              justifyContent={{ base: "center" }}
              ml={{ md: "-120px" }}
              mt={{ md: "15px" }}
            >
              {services.map((service, index) => (
                <Box
                  key={index}
                  marginTop="20px"
                  marginLeft="8px"
                  h={{base: "8vh", md: "10vh"}}
                  w={{ base: "90vw", md: "65vw" }}
                  borderRadius="15px"
                  paddingBottom="5px"
                  style={{
                    cursor: "pointer",
                    boxShadow: "0px 4px 8px rgba(162, 16, 198, 0.4)",
                  }}
                  _hover={{ color: "#A210C6" }}
                  onClick={service.onClick}
                >
                  <Flex>
                    <Box margin="25px">
                      <Text fontFamily="heading" fontSize={{ base: "16px", md: "20px" }}>
                        {service.title}
                      </Text>
                    </Box>
                    <Image
                      src={Chevron}
                      display={{ base: "none", md: "block" }}
                      ml={{ md: "800px" }}
                      marginTop="20px"
                      w="30px"
                      h="30px"
                      color="#A210C6"
                      position="absolute"
                    />
                  </Flex>
                </Box>
              ))}
              <NavLink to="/customize-service">
                <Box
                  marginTop="20px"
                  marginLeft="8px"
                   h={{base: "8vh", md: "10vh"}}
                  w={{ base: "90vw", md: "65vw" }}
                  borderRadius="15px"
                  paddingBottom="5px"
                  style={{
                    cursor: "pointer",
                    boxShadow: "0px 4px 8px rgba(162, 16, 198, 0.4)",
                  }}
                  _hover={{ color: "#A210C6" }}
                >
                  <Flex mb={{ base: "30px", md: "0" }}>
                    <Box margin="25px">
                      <Text fontFamily="heading" fontSize={{ base: "16px", md: "20px" }}>
                        Customize service
                      </Text>
                    </Box>
                    <Image
                      src={Chevron}
                      display={{ base: "none", md: "block" }}
                      ml={{ md: "800px" }}
                      marginTop="20px"
                      w="30px"
                      h="30px"
                      color="#A210C6"
                      position="absolute"
                    />
                  </Flex>
                </Box>
              </NavLink>
            </Box>
            <Box
              display={{ base: "none", md: "block" }}
              marginTop="-50px"
              ml={{ md: "1000px" }}
            >
              <NavLink to="/help">
                <Image
                  src={HelppIcon}
                  alt="Logo"
                  w="70px"
                  h="70px"
                  style={{
                    cursor: "pointer",
                    animation: "zoomInOut 2s infinite alternate",
                  }}
                />
              </NavLink>
              <style>
                {`
              @keyframes zoomInOut {
                0% {
                  transform: scale(1);
                }
                100% {
                  transform: scale(1.2);
                }
              }
            `}
              </style>
            </Box>
            <MobileFooter />
          </VStack>

          <ElderlyCareModal
            isOpen={showElderlyCareModal}
            onClose={() => setShowElderlyCareModal(false)}
          />
          <PostpartumCareModal
            isOpen={showPostpartumCareModal}
            onClose={() => setShowPostpartumCareModal(false)}
          />
          <NannyCareModal
            isOpen={showNannyCareModal}
            onClose={() => setShowNannyCareModal(false)}
          />
          <RecoveryCareModal
            isOpen={showRecoveryCareModal}
            onClose={() => setShowRecoveryCareModal(false)}
          />
          <ShortNurseVisitModal
            isOpen={showShortCareModal}
            onClose={() => setShowShortCareModal(false)}
          />
        </VStack>
      </VStack>
    </ChakraProvider>
  );
};

export default ServicePage;
