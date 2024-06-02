import React from "react";
import FBIcon from "../../assets/FaceBookIcon.svg";
import IGIcon from "../../assets/InstagramIcon.svg";
import WHIcon from "../../assets/WAIcon.svg";
import { ArrowUpIcon } from "@chakra-ui/icons";
import { Box, Link as ChakraLink, Flex, Image, Text } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";

const Footer = ({ onFaqsClick }) => {
  const handleClick = () => {
    // Scroll to the top of the page
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Box
      bg="#A210C6"
      color="white"
      px={{ base: "4", md: "8" }}
      py={{ base: "6", md: "10" }}
      textAlign={{ base: "center", md: "center" }}
    >
      <Flex
        maxWidth="1280px"
        margin="0 auto"
        direction={{ base: "column", md: "row" }}
        justify="space-between"
        // align="start"
        flexWrap="wrap"
      >
        <Box mb={{ base: "6", md: "0" }}>
          <Text
            textAlign="left"
            style={{ marginBottom: "49px" }}
            fontSize={{ base: "2xl", md: "3xl" }}
            fontWeight="bold"
          >
            MIKUL HEALTH
          </Text>
          <Text
            textAlign="left"
            mt={{ base: "1", md: "2" }}
            fontSize={{ base: "lg", md: "xl" }}
          >
            We leverage technological advancement to
          </Text>
          <Text textAlign="left" fontSize={{ base: "lg", md: "xl" }}>
            provide care for you and your loved ones.
          </Text>
        </Box>
        <Box mb={{ base: "6", md: "0" }} ml={{ base: "0", md: "-200px" }}>
          <Text
            fontSize={{ base: "2xl", md: "3xl" }}
            fontWeight="bold"
            style={{ marginBottom: "49px" }}
          >
            Quick Links
          </Text>
          <Box fontSize={{ base: "lg", md: "xl" }} textAlign="left" mt={{ base: "2", md: "4" }}>
            <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
              <li style={{ marginBottom: "42px" }}>
                <NavLink to="/">Home</NavLink>
              </li>
              <li style={{ marginBottom: "42px" }}>
                <NavLink to="/about">About Us</NavLink>
              </li>
              <li style={{ marginBottom: "42px" }}>
                <NavLink to="/contact">Contact Us</NavLink>
              </li>
              <li style={{ marginBottom: "42px" }}>
                <NavLink to="/">Terms of Use</NavLink>
              </li>
              <li style={{ marginBottom: "42px" }}>
                <NavLink to="/">Privacy Policy</NavLink>
              </li>
            </ul>
          </Box>
        </Box>
        <Box mb={{ base: "6", md: "0" }} mr={{ base: "0", md: "25px" }}>
          <Text
            fontSize={{ base: "2xl", md: "3xl" }}
            fontWeight="bold"
            // textDecoration="underline"
          >
            Socials
          </Text>
          <Flex  justifyContent="space-between" mt={{ base: "2", md: "4" }}>
            <ChakraLink href="https://web.facebook.com/mikulhealthcare/?_rdc=1&_rdr:/">
              <Image src={FBIcon} alt="Facebook" w="32px" h="32px" mr="4" />
            </ChakraLink>
            <ChakraLink href="https://www.instagram.com/mikulhealth/">
              <Image src={IGIcon} alt="Instagram" w="32px" h="32px" mr="4" />
            </ChakraLink>
            <ChakraLink href="https://wa.me/message/7NHXMWT4I54JC1/">
              <Image src={WHIcon} alt="WhatsApp" w="32px" h="32px" />
            </ChakraLink>
          </Flex>
        </Box>
      </Flex>
      <Box textAlign="center" mt={{ base: "6", md: "8" }}>
        <NavLink onClick={handleClick}>
          <ArrowUpIcon
            boxShadow="0 8px 12px rgba(0,0,0,0.2)"
            borderRadius="50%"
            p="2"
            color="white"
            boxSize={{ base: "10", md: "12" }}
          />
        </NavLink>
      </Box>
    </Box>
  );
};

export default Footer;
