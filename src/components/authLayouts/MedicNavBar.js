import {
  Avatar,
  Heading,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerBody,
  IconButton,
  Box,
  Text,
  VStack,
  HStack,
  Flex,
  extendTheme,
  ChakraProvider,
  useDisclosure,
  Image,
  Spacer,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import MedicDetailsDrawer from "../sections/MedicDetails";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import LogoutIcon from "../../assets/Logout.svg";
import { HamburgerIcon } from "@chakra-ui/icons";
// import LogoutModal from "../sections/LogoutModal";
import AppointmentsIcon from "../../assets/AppointmentIcon.svg";
import HomeIcon from "../../assets/HomeBlack.svg";
import Wallet from "../../assets/Wallet.svg";
import serviceIcon from "../../assets/PatientsIcon.svg";
import SettingsIcon from "../../assets/SettingsIcon.svg";

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

export default function MedicNavBar() {
  const { user } = useSelector((state) => state.userReducer);
  const navigate = useNavigate();
  const location = useLocation();
  // const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [showUserDetailsModal, setShowUserDetailsModal] = useState(false);

  const handleOpenUserDetailsModal = () => {
    setShowUserDetailsModal(true);
  };

  const handleCloseUserDetailsModal = () => {
    setShowUserDetailsModal(false);
  };

  const handleConfirmLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("phoneNumber");
    navigate("/login");
    window.location.reload();
  };

  const listItemStyle = {
    fontStyle: "body",
    fontSize: "16px",
    marginBottom: "30px",
  };

  const iconStyle = {
    marginRight: "10px",
    height: "24px",
    width: "24px",
  };

  const listTextStyle = {
    marginTop: "5px",
    marginLeft: "5px",
  };

  const pageTitles = {
    "/medic-dashboard": "Dashboard",
    "/medic-appointment": "Appointments",
    "/medic-wallet": "Wallet",
    "/patients": "Patients",
    "/medic-settings": "Settings",
    "/logout": "Logout",
    "/medic-edit-profile": "Settings",
    "/medic-change-password": "Settings",
    "/medic-notification-settings": "Settings",
    "/help": "Help",
  };

  const pageTitle = pageTitles[location.pathname] || "Unknown Page";
  const isDashboard = location.pathname === "/medic-dashboard";

  return (
    <ChakraProvider theme={customTheme}>
      <header style={{ top: 0, zIndex: 1000 }}>
        <Drawer size="xs" isOpen={isOpen} onClose={onClose} placement="left">
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerBody>
              <VStack spacing={3} align="left" mt={5}>
                <NavLink to="/medic-dashboard" style={listItemStyle}>
                  <Flex
                    fontFamily="heading"
                    fontSize={{ base: "18", md: "28px" }}
                    color={
                      location.pathname === "/medic-dashboard" ? "#A210C6" : ""
                    }
                    fontWeight={
                      location.pathname === "/medic-dashboard" ? "bold" : ""
                    }
                    textDecoration={
                      location.pathname === "/medic-dashboard"
                        ? "underline"
                        : ""
                    }
                    alignItems="center"
                  >
                    <Image src={HomeIcon} alt="home" style={iconStyle} />
                    <Text style={listTextStyle}>Home</Text>
                  </Flex>
                </NavLink>

                <NavLink to="/patients" style={listItemStyle}>
                  <Flex
                    fontFamily="heading"
                    fontSize={{ base: "18", md: "28px" }}
                    color={location.pathname === "/patients" ? "#A210C6" : ""}
                    fontWeight={location.pathname === "/patients" ? "bold" : ""}
                    textDecoration={
                      location.pathname === "/patients" ? "underline" : ""
                    }
                    alignItems="center"
                  >
                    <Image src={serviceIcon} alt="Patients" style={iconStyle} />
                    <Text style={listTextStyle}>Patients</Text>
                  </Flex>
                </NavLink>

                <NavLink to="/appointment" style={listItemStyle}>
                  <Flex
                    fontFamily="heading"
                    fontSize={{ base: "18", md: "28px" }}
                    color={
                      location.pathname === "/appointment" ? "#A210C6" : ""
                    }
                    fontWeight={
                      location.pathname === "/appointment" ? "bold" : ""
                    }
                    textDecoration={
                      location.pathname === "/appointment" ? "underline" : ""
                    }
                    alignItems="center"
                  >
                    <Image
                      src={AppointmentsIcon}
                      alt="appointment"
                      style={iconStyle}
                    />
                    <Text style={listTextStyle}>Appointments</Text>
                  </Flex>
                </NavLink>

                <NavLink to="/wallet" style={listItemStyle}>
                  <Flex
                    fontSize={{ base: "18", md: "28px" }}
                    fontFamily="heading"
                    color={
                      location.pathname === "/medic-wallet" ? "#A210C6" : ""
                    }
                    fontWeight={
                      location.pathname === "/medic-wallet" ? "bold" : ""
                    }
                    textDecoration={
                      location.pathname === "/medic-wallet" ? "underline" : ""
                    }
                    alignItems="center"
                  >
                    <Image src={Wallet} alt="wallet" style={iconStyle} />
                    <Text style={listTextStyle}>Wallet</Text>
                  </Flex>
                </NavLink>

                <NavLink to="/settings" style={listItemStyle}>
                  <Flex
                    fontSize={{ base: "18", md: "28px" }}
                    fontFamily="heading"
                    style={listTextStyle}
                    marginLeft="5px"
                    textDecoration={
                      location.pathname === "/medic-settings" ||
                      location.pathname === "/medic-edit-profile" ||
                      location.pathname === "/medic-change-password" ||
                      location.pathname === "/medic-notification-settings" ||
                      location.pathname === "/help"
                        ? "underline"
                        : ""
                    }
                    fontWeight={
                      location.pathname === "/medic-settings" ||
                      location.pathname === "/medic-edit-profile" ||
                      location.pathname === "/medic-change-password" ||
                      location.pathname === "/medic-notification-settings" ||
                      location.pathname === "/help"
                        ? "bold"
                        : ""
                    }
                    color={
                      location.pathname === "/medic-settings" ||
                      location.pathname === "/medic-edit-profile" ||
                      location.pathname === "/medic-change-password" ||
                      location.pathname === "/medic-notification-settings" ||
                      location.pathname === "/help"
                        ? "#A210C6"
                        : ""
                    }
                  >
                    <Image
                      marginLeft="-5px"
                      src={SettingsIcon}
                      alt="settings"
                      style={iconStyle}
                    />
                    <Text style={listTextStyle}>Settings</Text>
                  </Flex>
                </NavLink>
                <NavLink onClick={handleConfirmLogout} style={listItemStyle}>
                  <Flex
                    fontSize={{ base: "18", md: "28px" }}
                    fontFamily="heading"
                    style={{
                      cursor: "pointer",
                    }}
                    color="#A210C6"
                  >
                    <Image src={LogoutIcon} alt="logout" style={iconStyle} />
                    <Text
                      style={listTextStyle}
                      textDecoration={
                        location.pathname === "/logout" ? "underline" : ""
                      }
                      marginLeft="5px"
                    >
                      Logout
                    </Text>
                  </Flex>
                </NavLink>
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
        <HStack
          flexGrow="1"
          marginTop="20px"
          direction={{ base: "row", md: "row" }}
          width="100%"
          px={{ base: "20px", md: "20px" }}
          spacing={10}
          // ml="20px"
          justifyContent={{ base: "flex-start", md: "flex-start" }}
        >
          <IconButton
            aria-label="Open navigation"
            icon={<HamburgerIcon />}
            display={{ base: "block", md: "none" }}
            onClick={onOpen}
          />
          {isDashboard ? (
            <Flex
              justifyContent="flex-start"
              flexDirection={{ base: "column", md: "row" }}
            >
              <Heading
                ml={{ md: "20px" }}
                fontSize={{ base: "18", md: "28px" }}
                color="#A210C6"
                fontWeight="bold"
                fontFamily="heading"
              >
                Hello {user?.firstName},
              </Heading>
              <Text
                fontStyle="italic"
                fontFamily="body"
                marginLeft={{ base: "10px", md: "5px" }}
                fontSize={{ base: "10px", md: "16px" }}
                marginTop={{ base: "5px", md: "5px" }}
              >
                How are you doing today?
              </Text>
            </Flex>
          ) : (
            <Heading
              justifyContent="flex-start"
              fontSize={{ base: "18", md: "28px" }}
              color="#A210C6"
              fontWeight="bold"
            >
              {pageTitle}
            </Heading>
          )}
          <Spacer />

          <Box
            style={{ cursor: "pointer" }}
            onClick={handleOpenUserDetailsModal}
            display={{ base: "block", md: "flex" }}
            ml={{ base: "50px", md: "450px" }}
            justifyContent="flex-end"
          >
            <Avatar
              borderRadius="full"
              boxShadow="0 4px 8px rgba(0, 0, 0, 0.1)"
              size={{ base: "sm", md: "md" }}
              marginTop={{ base: "5px", md: "0" }}
              src={user?.image}
              name={user?.firstName}
              bg="#A210C6"
            />
          </Box>
        </HStack>
      </header>
      <MedicDetailsDrawer
        isOpen={showUserDetailsModal}
        onClose={handleCloseUserDetailsModal}
      />
    </ChakraProvider>
  );
}
