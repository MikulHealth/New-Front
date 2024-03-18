import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import LeftSideBar from "../authLayouts/LeftSideBar";
import NavBar from "../authLayouts/NavBar";
import {
  ChakraProvider,
  VStack,
  Image,
  Box,
  Flex,
  extendTheme,
} from "@chakra-ui/react";

import SettingsSideBar from "../authLayouts/SettingsSideBar";
import BigSettingsIcon from "../../assets/BigSettingsIcon.svg";
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

const SettingsPage = () => {
  const settingsContainerStyle = {
    animation: "slideInUp 0.9s ease-in-out",
  };

  return (
    <ChakraProvider theme={customTheme}>
      <LeftSideBar />
      <VStack
        style={settingsContainerStyle}
        position="fixed"
        ml={{ md: "200px" }}
        w={{ base: "100%", md: "70%" }}
        h={{ base: "100%", md: "100%" }}
      >
        <NavBar />
        <Flex mt={{ md: "30px" }} ml={{ base: "-60px", md: "-50px" }}>
          <SettingsSideBar />
          <Box display={{ base: "none", md: "block" }} mt={{ md: "20px" }}>
            <Image
              src={BigSettingsIcon}
              alt="Settings Icon"
              boxSize={{ base: "24px", md: "50px" }}
              h={{ base: "156", md: "456px" }}
              w={{ base: "188px", md: "488px" }}
            />
          </Box>
        </Flex>
        <MobileFooter />
      </VStack>
    </ChakraProvider>
  );
};

export default SettingsPage;
