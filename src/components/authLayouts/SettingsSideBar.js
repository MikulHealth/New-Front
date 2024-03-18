import React from "react";
import {
  Flex,
  Text,
  Divider,
  Box,
  extendTheme,
  VStack,
  ChakraProvider,
} from "@chakra-ui/react";
import {
  SettingsIcon,
  LockIcon,
  BellIcon,
  QuestionIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";

import { NavLink, useLocation } from "react-router-dom";

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

export default function SettingsSideBar() {
  const location = useLocation();
  // const [setshowProfileMobile] = useState(false);
  const isActive = (pathname) => {
    return location.pathname === pathname;
  };

  const activeStyle = {
    color: "#A210C6",
  };

  // const handleCloseProleMobile = () => {
  //   setshowProfileMobile(false);
  // };

  // const handleOpenProleMobile = () => {
  //   setshowProfileMobile(true);
  // };

  return (
    <ChakraProvider theme={customTheme}>
      <Box p={3}>
        <VStack ml={{ base: "100px" }} w="20vw">
          <Text
            ml={{ base: "-290px", md: "-290px" }}
            textAlign="left"
            fontFamily="heading"
            fontSize={{ base: "18px", md: "24px" }}
          >
            Account
          </Text>
          <Flex ml={{ base: "-150px" }} flexDirection="column">
            <NavLink to="/edit-profile">
              <Flex
                alignItems="center"
                marginTop="25px"
                style={{ cursor: "pointer" }}
                _hover={activeStyle}
                {...(isActive("/edit-profile") && { color: "#A210C6" })}
              >
                <SettingsIcon boxSize={{ base: "24px", md: "32px" }} />
                <Text
                  // onClick={handleOpenProleMobile}
                  marginBottom="5px"
                  fontSize={{ base: "18px", md: "20px" }}
                  marginLeft="10px"
                  marginTop="10px"
                >
                  Profile
                </Text>
                <ChevronRightIcon marginLeft="auto" />
              </Flex>
            </NavLink>
            <Divider my={1} borderColor="black.500" />

            <NavLink to="/change-password">
              <Flex
                alignItems="center"
                marginTop="25px"
                style={{ cursor: "pointer" }}
                _hover={activeStyle}
                {...(isActive("/change-password") && { color: "#A210C6" })}
              >
                <LockIcon boxSize={{ base: "24px", md: "32px" }} />
                <Text
                  marginBottom="5px"
                  fontSize={{ base: "18px", md: "20px" }}
                  marginLeft="10px"
                  marginTop="10px"
                >
                  Change password
                </Text>
                <ChevronRightIcon marginLeft="auto" />
              </Flex>
            </NavLink>
            <Divider my={1} borderColor="black.500" />

            <NavLink to="/notification-settings">
              <Flex
                alignItems="center"
                marginTop="25px"
                style={{ cursor: "pointer" }}
                _hover={activeStyle}
                {...(isActive("/notification-settings") && {
                  color: "#A210C6",
                })}
              >
                <BellIcon boxSize={{ base: "28px", md: "32px" }} />
                <Text
                  marginBottom="5px"
                  fontSize={{ base: "18px", md: "20px" }}
                  marginLeft="10px"
                  marginTop="10px"
                >
                  Notification Settings
                </Text>
                <ChevronRightIcon marginLeft="auto" />
              </Flex>
            </NavLink>
            <Divider my={1} borderColor="black.500" />

            <NavLink to="/help">
              <Flex
                alignItems="center"
                marginTop="25px"
                style={{ cursor: "pointer" }}
                _hover={activeStyle}
                {...(isActive("/help") && { color: "#A210C6" })}
              >
                <QuestionIcon boxSize={{ base: "24px", md: "32px" }} />
                <Text
                  marginBottom="5px"
                  fontSize={{ base: "18px", md: "20px" }}
                  marginLeft="10px"
                  marginTop="10px"
                >
                  Help
                </Text>
                <ChevronRightIcon marginLeft="auto" />
              </Flex>
            </NavLink>
            <Divider my={1} borderColor="black.500" />
          </Flex>
        </VStack>
      </Box>
      <Box />
      {/* <ProfileSettingsMobile
        isOpen={showProfileMobile}
        onClose={handleCloseProleMobile}
      /> */}
    </ChakraProvider>
  );
}
