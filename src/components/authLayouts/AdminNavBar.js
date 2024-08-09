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
  Input,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import MedicDetailsDrawer from "../sections/MedicDetails";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import LogoutIcon from "../../assets/Logout.svg";
import { HamburgerIcon, SearchIcon } from "@chakra-ui/icons"; 
import AppointmentsIcon from "../../assets/AppointmentIcon.svg";
import HomeIcon from "../../assets/HomeBlack.svg";
import Wallet from "../../assets/Wallet.svg";
import serviceIcon from "../../assets/PatientsIcon.svg";
import SettingsIcon from "../../assets/SettingsIcon.svg";
import { AiOutlineBell } from "react-icons/ai"; // Importing the bell icon

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

export default function AdminNavBar() {
  const { user } = useSelector((state) => state.userReducer);
  const navigate = useNavigate();
  const location = useLocation();
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
    admin: "Dashboard",
    "/mh-appointment": "Appointments",
    "/mh-patients": "Patients",
    "/admin-settings": "Settings",
    "/logout": "Logout",
    "/admin-edit-profile": "Settings",
    "/admin-change-password": "Settings",
    "/admin-notification-settings": "Settings",
    "/admin-help": "Help",
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
                <NavLink to="/admin" style={listItemStyle}>
                  <Flex
                    fontFamily="heading"
                    fontSize={{ base: "18", md: "28px" }}
                    color={location.pathname === "/admin" ? "#A210C6" : ""}
                    fontWeight={location.pathname === "/admin" ? "bold" : ""}
                    textDecoration={
                      location.pathname === "/admin" ? "underline" : ""
                    }
                    alignItems="center"
                  >
                    <Image src={HomeIcon} alt="home" style={iconStyle} />
                    <Text style={listTextStyle}>Home</Text>
                  </Flex>
                </NavLink>

                <NavLink to="/mh-patients" style={listItemStyle}>
                  <Flex
                    fontFamily="heading"
                    fontSize={{ base: "18", md: "28px" }}
                    color={
                      location.pathname === "/mh-patients" ? "#A210C6" : ""
                    }
                    fontWeight={
                      location.pathname === "/mh-patients" ? "bold" : ""
                    }
                    textDecoration={
                      location.pathname === "/mh-patients" ? "underline" : ""
                    }
                    alignItems="center"
                  >
                    <Image src={serviceIcon} alt="Patients" style={iconStyle} />
                    <Text style={listTextStyle}>Patients</Text>
                  </Flex>
                </NavLink>

                <NavLink to="/mh-appointment" style={listItemStyle}>
                  <Flex
                    fontFamily="heading"
                    fontSize={{ base: "18", md: "28px" }}
                    color={
                      location.pathname === "/mh-appointment" ? "#A210C6" : ""
                    }
                    fontWeight={
                      location.pathname === "/mh-appointment" ? "bold" : ""
                    }
                    textDecoration={
                      location.pathname === "/mh-appointment" ? "underline" : ""
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

                <NavLink to="/settings" style={listItemStyle}>
                  <Flex
                    fontSize={{ base: "18", md: "28px" }}
                    fontFamily="heading"
                    style={listTextStyle}
                    marginLeft="5px"
                    textDecoration={
                      location.pathname === "/admin-settings" ||
                      location.pathname === "/admin-edit-profile" ||
                      location.pathname === "/admin-change-password" ||
                      location.pathname === "/admin-notification-settings" ||
                      location.pathname === "/admin-help"
                        ? "underline"
                        : ""
                    }
                    fontWeight={
                      location.pathname === "/admin-settings" ||
                      location.pathname === "/admin-edit-profile" ||
                      location.pathname === "/admin-change-password" ||
                      location.pathname === "/admin-notification-settings" ||
                      location.pathname === "/admin-help"
                        ? "bold"
                        : ""
                    }
                    color={
                      location.pathname === "/admin-settings" ||
                      location.pathname === "/admin-edit-profile" ||
                      location.pathname === "/admin-change-password" ||
                      location.pathname === "/admin-notification-settings" ||
                      location.pathname === "/admin-help"
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
          justifyContent="space-between"
        >
          <IconButton
            aria-label="Open navigation"
            icon={<HamburgerIcon />}
            display={{ base: "block", md: "none" }}
            onClick={onOpen}
          />
          <Flex
            alignItems="center"
            justifyContent="space-between"
            width="100%"
            padding="10px"
          >
            <VStack alignItems="flex-start" spacing={0}>
              <Heading color="white" fontSize="20px" fontWeight="bold">
                Hello, {user?.firstName}{" "}
                <span role="img" aria-label="wave">
                  👋
                </span>
              </Heading>
              <Text color="white" fontStyle="italic">
                Welcome to the MH Admin Dashboard.
              </Text>
            </VStack>
            <Spacer />
            <Spacer />
            <Spacer />
            <Spacer />
            <Spacer />
            <Spacer />
            <Spacer />
            <HStack spacing={5}>
              <Spacer />
              <Spacer />
              <Spacer />
              <Spacer />
              <Spacer />
              <Spacer />
              <Spacer />
              <InputGroup>
                <Input
                  placeholder="Search anything"
                  backgroundColor="#4B4B4B"
                  color="white"
                  borderRadius="10px"
                  width="300px"
                />
                <InputLeftElement
                  children={<SearchIcon color="white" />}
                  pointerEvents="none"
                />
              </InputGroup>
              <Spacer />
              <Spacer />
              <Spacer />
              <Spacer />
              <Spacer />
              <Spacer />
              <Spacer />
              <Flex alignItems="center">
                <AiOutlineBell size={24} color="white" />
                <Box
                  style={{ cursor: "pointer", marginLeft: "15px" }}
                  onClick={handleOpenUserDetailsModal}
                >
                  <Avatar
                    borderRadius="full"
                    color="white"
                    boxShadow="0 4px 8px rgba(0, 0, 0, 0.1)"
                    size="md"
                    src={user?.image}
                    name={user?.firstName}
                    bg="#A210C6"
                  />
                </Box>
              </Flex>
            </HStack>
          </Flex>
        </HStack>
      </header>
      <MedicDetailsDrawer
        isOpen={showUserDetailsModal}
        onClose={handleCloseUserDetailsModal}
      />
    </ChakraProvider>
  );
}
