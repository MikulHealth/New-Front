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
import logo from "../../assets/Whitelogo.png";
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
      case "/services":
        setPageTitle("Services");
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
        bg="#A210C6"
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
            ml="auto" // Aligns the icon to the right end on mobile and tablet devices
          />
          <HStack
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
            {/* <NavLink to="/servicesSection" pageTitle={pageTitle}>
              Services
            </NavLink> */}
            <NavLink to="/contact" pageTitle={pageTitle}>
              Contact Us
            </NavLink>
          </HStack>

          <Button
            bg="white"
            color="#A210C6"
            onClick={handleOpenModal}
            display={{ base: "none", md: "block" }}
          >
            Get started
          </Button>
        </HStack>
      </Box>

      {/* Responsive Collapse Menu */}
      <Collapse in={isOpen} animateOpacity>
        <Box p={4} bg="#A210C6" color="white" textAlign="center">
          <VStack spacing={4}>
            <NavLink to="/" pageTitle={pageTitle}>
              Home
            </NavLink>
            <NavLink to="/about" pageTitle={pageTitle}>
              About Us
            </NavLink>
            <NavLink to="/servicesSection" pageTitle={pageTitle}>
              Services
            </NavLink>
            <NavLink to="/contact" pageTitle={pageTitle}>
              Contact Us
            </NavLink>
            <Button bg="white" color="#A210C6" onClick={handleOpenModal}>
              Get started
            </Button>
          </VStack>
        </Box>
      </Collapse>

      <GetStartedModal isOpen={showModal} onClose={handleCloseModal} />
    </header>
  );
}

// NavLink Component
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
