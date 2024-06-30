import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import {
  ChakraProvider,
  VStack,
  Image,
  Box,
  Flex,
  extendTheme,
} from "@chakra-ui/react";

import BigSettingsIcon from "../../assets/BigSettingsIcon.svg";
import MedicMobileFooter from "../authLayouts/MedicFooter";
import MedicSettingsSideBar from "../authLayouts/MedicSettingsSidebar";
import MedicNavBar from "../authLayouts/MedicNavBar";
import MedicSideBar from "../authLayouts/MedicSideBar";

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

const MedicSettingsPage = () => {
  const settingsContainerStyle = {
    animation: "slideInUp 0.9s ease-in-out",
  };

  return (
    <ChakraProvider theme={customTheme}>
     <MedicSideBar/>
      <VStack
        style={settingsContainerStyle}
        position="fixed"
        ml={{ md: "220px" }}
        w={{ base: "100%", md: "70%" }}
        h={{ base: "100%", md: "100%" }}
      >
        <MedicNavBar/>
        <Flex mt={{ md: "30px" }} ml={{ base: "-60px", md: "-50px" }}>
         <MedicSettingsSideBar/>
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
       <MedicMobileFooter/>
      </VStack>
    </ChakraProvider>
  );
};

export default MedicSettingsPage;
