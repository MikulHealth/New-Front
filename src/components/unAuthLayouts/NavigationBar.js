import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  useDisclosure,
  Box,
  Button,
  HStack,
  Image,
  VStack,
  Collapse,
  IconButton,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import logo from "../../assets/Whitelogo.svg";
import GetStartedModal from "./GetStarted";

export default function NavigationBar() {
  const { isOpen, onToggle } = useDisclosure();
  const location = useLocation();
  const [pageTitle, setPageTitle] = useState("Home");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    switch (location.pathname) {
      case "/":
        setPageTitle("Home");
        break;
      case "/about":
        setPageTitle("About");
        break;
      case "/contact":
        setPageTitle("Contact");
        break;
      case "/login":
        setPageTitle("Login");
        break;
      default:
        setPageTitle("Home");
        break;
    }
  }, [location]);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <header style={{ position: "sticky", top: 0, zIndex: 1000 }}>
      <Box
        w="100%"
        bg="linear-gradient(80deg, #A210C6, #E552FF)"
        p={3}
        color="white"
        borderBottom="1px solid white"
      >
        <HStack spacing={6} alignItems="center">
          <Box w="5px" />
          <a href="/">
            <Image src={logo} alt="Logo" w="100px" h="30px" />
          </a>

          <IconButton
            bg="white"
            color="#510863"
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            display={{ base: "block", md: "none" }}
            onClick={onToggle}
            aria-label="Toggle Navigation"
            ml="auto"
          />
          <HStack
            fontSize={{ base: "lg", md: "xl" }}
            marginRight={{ base: "0px", md: "50px" }}
            spacing={6}
            display={{ base: "none", md: "flex" }}
            flexGrow="1"
            justifyContent="flex-end"
          >
            <NavLink to="/" pageTitle={pageTitle}>
              Home
            </NavLink>
            <NavLink to="/about" pageTitle={pageTitle}>
              About Us
            </NavLink>
            <NavLink to="/contact" pageTitle={pageTitle}>
              Contact Us
            </NavLink>
            <NavLink to="/login" pageTitle={pageTitle}>
              Login
            </NavLink>
          </HStack>

          <Button
            fontSize={{ base: "lg", md: "xl" }}
            // bg="white"
            // color="#A210C6"
            bg="white"
            color="#A210C6"
            border="1px solid white"
       
            onClick={handleOpenModal}
            display={{ base: "none", md: "block" }}
          >
            Get started
          </Button>
        </HStack>
      </Box>

      <Collapse in={isOpen} animateOpacity>
        <Box
          fontSize={{ base: "lg", md: "xl" }}
          p={4}
          bg="linear-gradient(90deg, #A210C6, #FF0080)"
          color="white"
          textAlign="center"
        >
          <VStack spacing={4}>
            <NavLink to="/" pageTitle={pageTitle}>
              Home
            </NavLink>
            <NavLink to="/about" pageTitle={pageTitle}>
              About Us
            </NavLink>
            <NavLink to="/contact" pageTitle={pageTitle}>
              Contact Us
            </NavLink>
            <NavLink to="/login" pageTitle={pageTitle}>
              Login
            </NavLink>
            <Button
              fontSize={{ base: "lg", md: "xl" }}
              bg="white"
              // color="#A210C6"
              color="linear-gradient(90deg, #A210C6, #FF0080)"
       
              onClick={handleOpenModal}
            >
              Get started
            </Button>
          </VStack>
        </Box>
      </Collapse>

      <GetStartedModal isOpen={showModal} onClose={handleCloseModal} />
    </header>
  );
}

const NavLink = ({ to, children, pageTitle }) => (
  <Link
    to={to}
    style={{
      textDecoration: pageTitle === children ? "underline" : "none",
      fontWeight: pageTitle === children ? "bold" : "normal",
      color: "white",
    }}
  >
    {children}
  </Link>
);
