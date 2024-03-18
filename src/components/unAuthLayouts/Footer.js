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
        direction={{ base: "column", md: "row" }}
        justify="space-between"
        // align="start"
        flexWrap="wrap"
      >
        <Box mb={{ base: "6", md: "0" }}>
          <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold">
            MIKUL HEALTH
          </Text>
          <Text mt={{ base: "1", md: "2" }} fontSize={{ base: "lg", md: "xl" }}>
            We leverage technological advancement to
          </Text>
          <Text fontSize={{ base: "lg", md: "xl" }}>
            provide care for you and your loved ones.
          </Text>
        </Box>
        <Box mb={{ base: "6", md: "0" }} ml={{ base: "0", md: "-200px" }}>
          <Text
            fontSize={{ base: "2xl", md: "3xl" }}
            fontWeight="bold"
            textDecoration="underline"
          >
            Quick Links
          </Text>
          <Box textAlign="center" mt={{ base: "2", md: "4" }}>
            <ul style={{ listStyleType: "none", padding: 0 }}>
              <li>
                <NavLink to="/">Home</NavLink>
              </li>
              <li>
                <NavLink to="/about">About</NavLink>
              </li>
              <li>
                <NavLink to="/contact">Contact us</NavLink>
              </li>
              <li>
                <NavLink to="/join">Join Mikul Health</NavLink>
              </li>
              <li>
                <ChakraLink href="https://wa.me/2347032579006">
                  Terms and Privacy policy
                </ChakraLink>
              </li>
            </ul>
          </Box>
        </Box>
        <Box mb={{ base: "6", md: "0" }} mr={{ base: "0", md: "25px" }}>
          <Text
            fontSize={{ base: "2xl", md: "3xl" }}
            fontWeight="bold"
            textDecoration="underline"
          >
            Socials
          </Text>
          <Flex
            justify="center"
            mt={{ base: "2", md: "4" }}
          >
            <ChakraLink href="https://web.facebook.com/mikulhealthcare/?_rdc=1&_rdr://example.com">
              <Image src={FBIcon} alt="Facebook" w="32px" h="32px" mr="4" />
            </ChakraLink>
            <ChakraLink href="https://www.instagram.com/mikulhealth/">
              <Image src={IGIcon} alt="Instagram" w="32px" h="32px" mr="4" />
            </ChakraLink>
            <ChakraLink href="https://wa.me/message/3VO5QNBR2AB4L1://example.com">
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
