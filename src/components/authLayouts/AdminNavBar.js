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
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import LogoutIcon from "../../assets/Logout.svg";
import { HamburgerIcon, SearchIcon } from "@chakra-ui/icons";
import AppointmentsIcon from "../../assets/AppointmentIcon.svg";
import HomeIcon from "../../assets/HomeBlack.svg";
import Wallet from "../../assets/Wallet.svg";
import serviceIcon from "../../assets/PatientsIcon.svg";
import SettingsIcon from "../../assets/SettingsIcon.svg";
import { AiOutlineBell } from "react-icons/ai";

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
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 4) {
      setGreeting("you should be sleeping");
    } else if (hour < 12) {
      setGreeting("good morning");
    } else if (hour < 18) {
      setGreeting("good afternoon");
    } else {
      setGreeting("good evening");
    }
  }, []);

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
    "/admin": "Hello, Welcome",
    "/users/customers": "Mikul Health Customers",
    "/users/medics": "Mikul Health Medics",
    "/users/admins": "Mikul Health Admins",
    "/appointments": "All Appointments",
    "/admin/medical-reports": "Medical Reports",
    "/finance": "Financials",
  };

  const pageTitle = pageTitles[location.pathname] || "MH Admin Dashboard";

  return (
    <ChakraProvider theme={customTheme}>
      <header
        style={{
          top: 0,
          zIndex: 1000,
          padding: "10px 20px",
          width: "100%",
        }}
      >
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

                <NavLink to="/users/customers" style={listItemStyle}>
                  <Flex
                    fontFamily="heading"
                    fontSize={{ base: "18", md: "28px" }}
                    color={
                      location.pathname === "/users/customers" ? "#A210C6" : ""
                    }
                    fontWeight={
                      location.pathname === "/users/customers" ? "bold" : ""
                    }
                    textDecoration={
                      location.pathname === "/users/customers"
                        ? "underline"
                        : ""
                    }
                    alignItems="center"
                  >
                    <Image src={serviceIcon} alt="Patients" style={iconStyle} />
                    <Text style={listTextStyle}>Customers</Text>
                  </Flex>
                </NavLink>

                <NavLink to="/users/medics" style={listItemStyle}>
                  <Flex
                    fontFamily="heading"
                    fontSize={{ base: "18", md: "28px" }}
                    color={
                      location.pathname === "/users/medics" ? "#A210C6" : ""
                    }
                    fontWeight={
                      location.pathname === "/users/medics" ? "bold" : ""
                    }
                    textDecoration={
                      location.pathname === "/users/medics" ? "underline" : ""
                    }
                    alignItems="center"
                  >
                    <Image src={serviceIcon} alt="Medics" style={iconStyle} />
                    <Text style={listTextStyle}>Medics</Text>
                  </Flex>
                </NavLink>

                <NavLink to="/users/admins" style={listItemStyle}>
                  <Flex
                    fontFamily="heading"
                    fontSize={{ base: "18", md: "28px" }}
                    color={
                      location.pathname === "/users/admins" ? "#A210C6" : ""
                    }
                    fontWeight={
                      location.pathname === "/users/admins" ? "bold" : ""
                    }
                    textDecoration={
                      location.pathname === "/users/admins" ? "underline" : ""
                    }
                    alignItems="center"
                  >
                    <Image src={serviceIcon} alt="Admins" style={iconStyle} />
                    <Text style={listTextStyle}>Admins</Text>
                  </Flex>
                </NavLink>

                <NavLink to="/appointments" style={listItemStyle}>
                  <Flex
                    fontFamily="heading"
                    fontSize={{ base: "18", md: "28px" }}
                    color={
                      location.pathname === "/appointments" ? "#A210C6" : ""
                    }
                    fontWeight={
                      location.pathname === "/appointments" ? "bold" : ""
                    }
                    textDecoration={
                      location.pathname === "/appointments" ? "underline" : ""
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

                <NavLink to="/admin/medical-reports" style={listItemStyle}>
                  <Flex
                    fontFamily="heading"
                    fontSize={{ base: "18", md: "28px" }}
                    color={
                      location.pathname === "/admin/medical-reports"
                        ? "#A210C6"
                        : ""
                    }
                    fontWeight={
                      location.pathname === "/admin/medical-reports"
                        ? "bold"
                        : ""
                    }
                    textDecoration={
                      location.pathname === "/admin/medical-reports"
                        ? "underline"
                        : ""
                    }
                    alignItems="center"
                  >
                    <Image
                      src={Wallet}
                      alt="Medical Reports"
                      style={iconStyle}
                    />
                    <Text style={listTextStyle}>Medical Reports</Text>
                  </Flex>
                </NavLink>

                <NavLink to="/finance" style={listItemStyle}>
                  <Flex
                    fontFamily="heading"
                    fontSize={{ base: "18", md: "28px" }}
                    color={location.pathname === "/finance" ? "#A210C6" : ""}
                    fontWeight={location.pathname === "/finance" ? "bold" : ""}
                    textDecoration={
                      location.pathname === "/finance" ? "underline" : ""
                    }
                    alignItems="center"
                  >
                    <Image src={Wallet} alt="Financials" style={iconStyle} />
                    <Text style={listTextStyle}>Financials</Text>
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
            <Box textAlign="left" flex="1">
              <Heading color="white" fontSize="20px" fontWeight="bold">
                {pageTitle === "Hello, Welcome"
                  ? `Hello ${user?.firstName}, ${greeting}`
                  : pageTitle}
              </Heading>
            </Box>
            <Spacer />
            <HStack w="100%" spacing={5} flex="1" justifyContent="flex-end">
              <InputGroup width="300px">
                <Input
                  placeholder="Search anything"
                  backgroundColor="#4B4B4B"
                  color="white"
                  borderRadius="10px"
                />
                <InputLeftElement
                  children={<SearchIcon color="white" />}
                  pointerEvents="none"
                />
              </InputGroup>

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
    </ChakraProvider>
  );
}
