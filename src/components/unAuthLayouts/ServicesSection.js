import React, {useEffect } from "react";
import "animate.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { ArrowUpIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Link as ChakraLink,
  Image,
  Flex,
  Text,
} from "@chakra-ui/react";
import Elderly from "../../assets/Elder.svg";
import PostPaturm from "../../assets/Postpartum.svg";
import Recovery from "../../assets/Recovery.svg";
import ShortHome from "../../assets/ShortService.svg";
import Nanny from "../../assets/Nanny.svg";
import Doctor from "../../assets/Doctor.svg";
import "../../styles/pages/LandingPage.css";
import { NavLink } from "react-router-dom";

export default function ServicesSection() {
  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <div>
      <Box
        borderRadius="10px"
        bg="#A210C6"
        px={{ base: "20px", md: "40px" }}
        py={{ base: "40px", md: "60px" }}
      >
        <Text
          fontSize={{ base: "2xl", md: "4xl" }}
          fontWeight="bold"
          fontFamily="body"
          color="white"
          textAlign="center"
          mb="4"
        >
          Our Services
        </Text>

        <Flex
          flexWrap="wrap"
          justifyContent="center"
          alignItems="center"
          gap={{ base: "20px", md: "40px" }}
        >
          <ServiceBox
            image={Elderly}
            title="Elderly Care"
            description="Comprehensive nursing care focusing on the needs and overall well-being of the elderly"
          />

          <ServiceBox
            image={PostPaturm}
            title="Post-Partum Care"
            description="Specialized care for new-born babies and their mothers post-delivery"
          />
          <ServiceBox
            image={Recovery}
            title="Recovery Care"
            description="All-inclusive care for people recovering from surgery, critical and long-term illnesses"
          />

          <ServiceBox
            image={Nanny}
            title="Nanny services"
            description="Professional child-care services provided by well-trained nannies for children of all ages"
          />
          <ServiceBox
            image={ShortHome}
            title="Short home visit"
            description="Professional home nursing services to address specific healthcare needs"
          />
        </Flex>

        <Flex flexWrap="wrap" justifyContent="center" mt="10">
          <Box
            marginTop={{ base: "0", md: "50px" }}
            marginBottom={{ base: "20px", md: "50px" }}
            marginLeft={{ base: "0", md: "-100px" }}
            padding={{ base: "90px", md: "0px" }}
            className="box"
            data-aos="zoom-out"
            data-aos-duration="10000"
            h={{ base: "auto", md: "500px" }}
            w={{ base: "100%", md: "520px" }}
            animation="zoomInOut 8s infinite"
            overflow="hidden"
            display={{ base: "block", lg: "block" }}
          >
            <Image
              src={Doctor}
              alt="Doctor"
              style={{ width: "100%", height: "100%" }}
            />
          </Box>

          <Flex
            flexDirection="column"
            ml="8"
            marginTop={{ base: "0", md: "150px" }}
            textAlign={{ base: "center", md: "left" }}
          >
            <Text
              fontSize={{ base: "2xl", md: "4xl" }}
              fontWeight="bold"
              fontFamily="body"
              color="white"
            >
              Join the Future of
            </Text>
            <Text
              fontSize={{ base: "2xl", md: "4xl" }}
              fontWeight="bold"
              fontFamily="body"
              color="white"
            >
              Healthcare
            </Text>
            <Text
              fontSize={{ base: "lg", md: "xl" }}
              color="white"
              fontFamily="Montserrat"
              mt="2"
            >
              Empower healthcare innovation and shape
            </Text>
            <Text
              fontSize={{ base: "lg", md: "xl" }}
              color="white"
              fontFamily="Montserrat"
              mt="2"
            >
              the future of Healthcare delivery with Mikul Health
            </Text>
            <ChakraLink href="/join" color="#A210C6">
              <Button mt="4" bg="white" borderRadius="100px" px="6">
                Join us
              </Button>
            </ChakraLink>
          </Flex>
        </Flex>

        <Flex
          alignItems="center"
          justifyContent={{ base: "flex-end", md: "flex-end" }}
          mt="8"
        >
          <NavLink to="/" onClick={handleClick}>
            <ArrowUpIcon
              borderRadius="50%"
              boxShadow="0 8px 12px rgba(0,0,0,0.2)"
              color="white"
              boxSize={{ base: 8, md: 12 }}
            />
          </NavLink>
        </Flex>
      </Box>
    </div>
  );
}

const ServiceBox = ({ image, title, description }) => {
  return (
    <Box
      borderRadius="20px"
      data-aos="zoom-in"
      data-aos-duration="10000"
      textAlign="center"
      w={{ base: "70%", md: "30%" }}
      mt={{ base: "4", md: "0" }}
    >
      <Flex justifyContent="center" alignItems="center" mb="4">
        <Image src={image} alt={title} w="300px" h="300" />
      </Flex>
      <Text
        color="white"
        textAlign="center"
        fontSize={{ base: "24", md: "28px" }}
        fontWeight="bold"
        mt="4"
      >
        {title}
      </Text>
      <Text color="white" textAlign="center" mt="2">
        {description}
      </Text>
    </Box>
  );
};
