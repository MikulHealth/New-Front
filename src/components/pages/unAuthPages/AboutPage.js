import React from "react";
import { useEffect } from "react";
import {
  Box,
  Image,
  extendTheme,
  Flex,
  ChakraProvider,
  Text,
} from "@chakra-ui/react";
import AOS from "aos";
import "aos/dist/aos.css";
import Caregivers from "../../../assets/Caregiver.svg";
import Vetted from "../../../assets/Vetted.svg";
// import AbtPic from "../../../assets/AbtPic.svg";
import Wallet from "../../../assets/WalletWhite.svg";
import Eye from "../../../assets/Eye.svg";
import Persona from "../../../assets/Pesona.svg";
import Safety from "../../../assets/Safety.svg";
import Quality from "../../../assets/Quality.svg";
import Flexible from "../../../assets/Flexible.svg";
import Sylvia from "../../../assets/Sylvia.svg";
import Michael from "../../../assets/Michael.svg";
import Jim from "../../../assets/Jim.svg";
import Hafsie from "../../../assets/Hafsie.svg";
import "../../../styles/pages/LandingPage.css";
import NavigationBar from "../../unAuthLayouts/NavigationBar";
import Footer from "../../unAuthLayouts/Footer";
import Folder from "../../../assets/Folder.svg";
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
    body: "Gill Sans MT, sans-serif",
    heading: "Gill Sans MT, sans-serif",
  },
});

const LandingPage = () => {
  useEffect(() => {
    AOS.init();
  }, []);

  const settingsContainerStyle = {
    animation: "slideInUp 0.9s ease-in-out",
  };

  return (
    <ChakraProvider theme={customTheme}>
      <Box>
        <NavigationBar />
        <Box
          style={settingsContainerStyle}
          maxWidth="1280px"
          margin="0 auto"
          marginTop="-1px"
          bgImage={`url(${Folder})`}
          bgSize={{ base: "cover", md: "cover", lg: "cover" }}
          bgPosition={{ base: "center", md: "center", lg: "top center" }}
          minHeight="100vh"
        >
          <Box pt={{ base: "100px", md: "150px", lg: "160px" }}>
            <Text
              fontSize={{ base: "32px", md: "48px", lg: "64px" }}
              fontWeight="bold"
              textAlign="center"
              color="white"
              fontStyle="heading"
              textShadow="2px 2px 4px gray"
              data-aos="fade-up"
              data-aos-duration="10000"
              fontFamily="heading"
            >
              Mission
            </Text>

            <Text
              fontSize={{ base: "22px", md: "28px", lg: "24px" }}
              textAlign="center"
              fontFamily="body"
              color="white"
              fontStyle="body"
              textShadow="2px 2px 4px gray"
              data-aos="fade-up"
              data-aos-duration="10000"
            >
              To create the best in-home nursing care experience <br></br>
              company and we are focused on creating a <br></br>
              technology-accessible platform that drives easy access to
              patient-care <br></br>information and management.
            </Text>
          </Box>
        </Box>
        <Box
          bg="#A210C6"
          pt="60px"
          ml={{ base: "-10px", md: "-40px", lg: "-40px" }}
        >
          <Box
            maxWidth="1280px"
            margin="0 auto"
            justify="center"
            data-aos="fade-right"
            data-aos-duration="10000"
          >
            <Text
              fontSize={{ base: "22px", md: "28px" }}
              fontFamily="heading"
              color="white"
            >
              WHY USE MIKUL HEALTH?
            </Text>
            <Text
              textAlign="center"
              fontSize={{ base: "22px", md: "28px" }}
              fontFamily="body"
              color="black"
            >
              With Mikul Health, <br></br>
              your are assured of
            </Text>
          </Box>

          <Flex
            direction={{ base: "column", md: "row" }}
            align="center"
            justifyContent="space-between"
            p="20px"
            ml={{ base: "10px", md: "80px", lg: "90px" }}
            data-aos="fade-up"
            data-aos-duration="10000"
          >
            <Box
              justifyContent="center"
              alignItems="center"
              padding="20px"
              borderRadius="20px"
              flexDirection="row"
            >
              <Box marginLeft="100px">
                <Image
                  src={Wallet}
                  alt="Logo"
                  w="100px"
                  h="103px"
                  paddingTop="10px"
                />
              </Box>

              <Text
                fontSize={{ base: "22px", md: "28px" }}
                fontWeight="bold"
                textAlign="center"
                marginTop="10px"
                fontFamily="heading"
              >
                Affordability & <br></br>
                Accessibility
              </Text>
              <Text
                fontSize={{ base: "16px", md: "18px" }}
                textAlign="center"
                marginTop="10px"
                color="white"
                fontFamily="body"
              >
                We offer competitive pricing for homecare <br></br>
                services, making it affordable for everyone <br></br>
                to receive quality care. We also offer round-<br></br>
                the-clock availability of caregivers, making <br></br>
                it easy for you to get the care you need <br></br>
                when you need it.
              </Text>
            </Box>

            <Box
              justifyContent="center"
              alignItems="center"
              padding="20px"
              borderRadius="20px"
              flexDirection="row"
            >
              <Box ml={{ base: "100px", md: "90px" }}>
                <Image
                  src={Eye}
                  alt="Logo"
                  w="100px"
                  h="103px"
                  paddingTop="10px"
                />
              </Box>

              <Text
                fontSize={{ base: "22px", md: "28px" }}
                fontWeight="bold"
                textAlign="center"
                fontFamily="heading"
                marginTop="10px"
              >
                Viscibility & <br></br>
                Transperency{" "}
              </Text>
              <Text
                fontSize={{ base: "16px", md: "18px" }}
                textAlign="center"
                marginTop="10px"
                color="white"
                fontFamily="body"
              >
                We use state-of-the-art technology to <br></br>
                protect your personal and medical <br></br>
                information, ensuring that your data is <br></br>
                secure and confidential. Additionally, all our <br></br>
                caregivers are trained to maintain a safe <br></br>
                and secure environment in your home, <br></br>
                reducing the risk of accidents or incidents.
              </Text>
            </Box>

            <Box
              justifyContent="center"
              alignItems="center"
              padding="20px"
              borderRadius="20px"
              flexDirection="row"
            >
              <Box ml={{ base: "115px", md: "120px" }}>
                <Image
                  src={Persona}
                  alt="Logo"
                  w="100px"
                  h="103px"
                  paddingTop="20px"
                />
              </Box>
              <Text
                fontSize={{ base: "22px", md: "28px" }}
                fontWeight="bold"
                textAlign="center"
                marginTop="20px"
                fontFamily="heading"
              >
                Personalization
              </Text>
              <Text
                fontSize={{ base: "16px", md: "18px" }}
                textAlign="center"
                marginTop="28px"
                color="white"
                fontFamily="body"
              >
                 We offer personalized care plans based on <br></br>
                your individual needs and preferences,<br></br>
                ensuring that you receive the best possible care.
              </Text>
            </Box>
          </Flex>

          <Flex
            direction={{ base: "column", md: "row" }}
            align="center"
            justifyContent="space-between"
            p="20px"
            ml={{ base: "10px", md: "80px", lg: "90px" }}
            data-aos="fade-up"
            data-aos-duration="10000"
          >
            <Box
              justifyContent="center"
              alignItems="center"
              padding="20px"
              borderRadius="20px"
              flexDirection="row"
            >
              <Box ml={{ base: "110px", md: "110px" }}>
                <Image
                  src={Safety}
                  alt="Logo"
                  w="100px"
                  h="103px"
                  paddingTop="10px"
                />
              </Box>
              <Text
                fontSize={{ base: "22px", md: "28px" }}
                fontWeight="bold"
                textAlign="center"
                marginTop="10px"
                fontFamily="heading"
              >
                Safety & Security
              </Text>
              <Text
                fontSize={{ base: "16px", md: "18px" }}
                textAlign="center"
                marginTop="10px"
                color="white"
                fontFamily="body"
              >
                All our caregivers are thoroughly screened <br></br>
                and background checks are carried out. We <br></br>
                do this to provide you with the assurance <br></br>
                that you're receiving safe and trustworthy care.
              </Text>
            </Box>

            <Box
              justifyContent="center"
              alignItems="center"
              padding="20px"
              borderRadius="20px"
              flexDirection="row"
            >
              <Box ml={{ base: "100px", md: "90px" }}>
                <Image
                  src={Quality}
                  alt="Logo"
                  w="100px"
                  h="103px"
                  paddingTop="10px"
                />
              </Box>
              <Text
                fontSize={{ base: "22px", md: "28px" }}
                fontWeight="bold"
                textAlign="center"
                marginTop="10px"
                fontFamily="heading"
              >
                Quality Care
              </Text>
              <Text
                fontSize={{ base: "16px", md: "18px" }}
                textAlign="center"
                marginTop="10px"
                color="white"
                fontFamily="body"
              >
                We ensure that all caregivers registered <br></br>
                with us meet high-quality standards, <br></br>
                ensuring that you receive the best possible <br></br>
                care at all times.
              </Text>
            </Box>

            <Box
              justifyContent="center"
              alignItems="center"
              padding="20px"
              borderRadius="20px"
              flexDirection="row"
            >
              <Box ml={{ base: "100px", md: "110px" }}>
                <Image
                  src={Flexible}
                  alt="Logo"
                  w="100px"
                  h="103px"
                  paddingTop="10px"
                />
              </Box>
              <Text
                fontSize={{ base: "22px", md: "28px" }}
                fontWeight="bold"
                textAlign="center"
                marginTop="10px"
                fontFamily="heading"
              >
                Flexibility
              </Text>
              <Text
                fontFamily="body"
                textAlign="center"
                marginTop="10px"
                color="white"
                fontSize={{ base: "16px", md: "18px" }}
              >
                We offer flexible scheduling options that fit <br></br>
                your busy lifestyle, allowing you to receive <br></br>
                care when it's most convenient for you.
              </Text>
            </Box>
          </Flex>
        </Box>

        <Box maxWidth="1280px" margin="0 auto" bg="white">
          <Box mt="30px">
            <Text
              fontSize={{ base: "28px", md: "38px", lg: "64px" }}
              fontWeight="bold"
              textAlign="center"
              fontFamily="heading"
            >
              Meet Our Team
            </Text>
          </Box>
          <Flex mt={{ base: "-5", md: "50px" }} justify="center" flexWrap="wrap">
            <Box
              bg="white"
              justifyContent="center"
              alignItems="center"
              padding={{ base: "10px", md: "20px" }}
              borderRadius="20px"
              flexDirection="row"
              data-aos="fade-up"
              data-aos-duration="10000"
              mt={{ base: "10px", md: "" }}
            >
              <Image
                src={Michael}
                alt="Logo"
                w={{ base: "280px", md: "462px" }}
                h={{ base: "400px", md: "422px" }}
              />
            </Box>

            <Box
              ml={{ base: "0", md: "80px" }}
              padding="20px"
              borderRadius="20px"
              flexDirection="row"
              w={{ base: "366px", md: "656px" }}
              h={{ base: "100px", md: "275px" }}
              mt={{ base: "-50px", md: "80px" }}
              data-aos="fade-up"
              data-aos-duration="10000"
            >
              <Text
                fontFamily="heading"
                fontSize="xl"
                fontWeight="bold"
                textAlign="left"
              >
                Michael Joshua. Co-founder, CEO
              </Text>
              <Text
                textAlign="left"
                marginTop="10px"
                fontSize={{ base: "16px", md: "18px" }}
                fontFamily="body"
              >
                Software Engineer & a licensed nurse in Nigeria with over 7
                years of clinical experience in general nursing care and patient
                management. Passionate about innovative revolution in the health
                industry, he has worked with two successful Health Tech
                startups. He is also the founder of an NGO, Rophe Global
                Foundation.
              </Text>
            </Box>
          </Flex>

          <Flex
            mt={{ base: "-40", md: "100px" }}
            justify="center"
            flexWrap="wrap"
          >
            <Box
              bg="white"
              justifyContent="center"
              alignItems="center"
              padding={{ base: "10px", md: "20px" }}
              borderRadius="20px"
              flexDirection="row"
              data-aos="fade-down"
              data-aos-duration="10000"
              mt={{ base: "350px", md: "0" }}
            >
              <Image
                src={Jim}
                alt="Logo"
                w={{ base: "280px", md: "462px" }}
                h={{ base: "400px", md: "422px" }}
              />
            </Box>

            <Box
              ml={{ base: "0", md: "80px" }}
              padding="20px"
              borderRadius="20px"
              flexDirection="row"
              w={{ base: "366px", md: "656px" }}
              h={{ base: "100px", md: "275px" }}
              mt={{ base: "-50px", md: "80px" }}
              data-aos="fade-up"
              data-aos-duration="10000"
            >
              <Text
                fontSize="xl"
                fontWeight="bold"
                fontFamily="heading"
                textAlign="left"
              >
                Jim Ofodum. Co-founder, Growth
              </Text>
              <Text
                textAlign="left"
                marginTop="10px"
                fontSize={{ base: "16px", md: "18px" }}
                fontFamily="body"
              >
                Ejimonye, popularly referred to as Jim, is a trained financial
                technology professional who has worked with top African payment
                & telecoms companies. She co-founded a technology-enabled home
                cleaning brand called FICHAYA and co-owns a young professional's
                group called Konnect'd by Professionals.
              </Text>
            </Box>
          </Flex>

          <Flex mt={{ base: "-40", md: "50px" }} justify="center" flexWrap="wrap">
            <Box
              bg="white"
              justifyContent="center"
              alignItems="center"
              padding={{ base: "10px", md: "20px" }}
              borderRadius="20px"
              flexDirection="row"
              data-aos="fade-up"
              data-aos-duration="10000"
              mt={{ base: "350px", md: "0" }}
            >
              <Image
                src={Hafsie}
                alt="Logo"
                w={{ base: "280px", md: "462px" }}
                h={{ base: "400px", md: "422px" }}
              />
            </Box>

            <Box
              ml={{ base: "0", md: "80px" }}
              padding="20px"
              borderRadius="20px"
              flexDirection="row"
              w={{ base: "366px", md: "656px" }}
              h={{ base: "100px", md: "275px" }}
              mt={{ base: "-50px", md: "80px" }}
              data-aos="fade-down"
              data-aos-duration="10000"
            >
              <Text
                fontFamily="heading"
                fontSize="xl"
                fontWeight="bold"
                textAlign="left"
              >
                Dr. Hafsat Jijiwa. Medical Director.
              </Text>
              <Text
                textAlign="left"
                marginTop="10px"
                fontSize={{ base: "16px", md: "18px" }}
                fontFamily="body"
              >
                She holds a Bachelor of Medicine, Bachelor of Surgery (M.B.B.S)
                from Gulf Medical University, U.A.E. Dr. Jijiwa is a board
                certified family medicine physician seasoned with exemplary
                patient care. She has vast experience working with Home care
                companies in the U.S and is also passionate about public health.
              </Text>
            </Box>
          </Flex>

          <Flex
            mt={{ base: "-40", md: "100px" }}
            justify="center"
            flexWrap="wrap"
          >
            <Box
              bg="white"
              justifyContent="center"
              alignItems="center"
              padding={{ base: "10px", md: "20px" }}
              borderRadius="20px"
              flexDirection="row"
              data-aos="fade-up"
              data-aos-duration="10000"
              mt={{ base: "350px", md: "0" }}
            >
              <Image
                src={Sylvia}
                alt="Logo"
                w={{ base: "280px", md: "462px" }}
                h={{ base: "400px", md: "422px" }}
              />
            </Box>

            <Box
              ml={{ base: "0", md: "80px" }}
              padding="20px"
              borderRadius="20px"
              flexDirection="row"
              w={{ base: "366px", md: "656px" }}
              h={{ base: "100px", md: "275px" }}
              mt={{ base: "-50px", md: "80px" }}
              data-aos="fade-down"
              data-aos-duration="10000"
            >
              <Text
                fontFamily="heading"
                fontSize="xl"
                fontWeight="bold"
                textAlign="left"
              >
                Dr. Sylvia Onoabhagbe. Product Designer
              </Text>
              <Text
                textAlign="left"
                marginTop="10px"
                fontSize={{ base: "16px", md: "18px" }}
                fontFamily="body"
              >
                She holds a Doctor of Optometry (O. D) degree, from the
                University of Benin, Edo state, Nigeria. She spent the first few
                years of her career working as a clinical optometrist, and has a
                lot of patient care experience. She is also a trained product
                designer and is very passionate about building healthcare
                solutions for everyone.
                <br></br>
              </Text>
            </Box>
          </Flex>
        </Box>

        <Box
          maxWidth="1280px"
          margin="0 auto"
          bg="white"
          mt={{ base: "300px", md: "150px" }}
        >
          <Box textAlign="center">
            <Text
              fontSize={{ base: "28px", md: "38px", lg: "64px" }}
              fontWeight="bold"
              fontFamily="heading"
              color="black"
            >
              Medics
            </Text>
          </Box>
          <Flex justify="center" align="center" wrap="wrap" p="20px">
            <Box
              bg="white"
              p="20px"
              borderRadius="20px"
              flexDirection="column"
              alignItems="center"
              maxW="300px"
            >
              <Image
                ml={{ base: "30px", md: "20px" }}
                src={Caregivers}
                alt="onboarded"
                w="200px"
                h="200px"
              />
              <Text
                fontSize="xl"
                fontFamily="heading"
                fontWeight="bold"
                textAlign="center"
              >
                1000+ Caregivers Onboarded
              </Text>
              <Text  fontSize={{ base: "16px", md: "18px" }} fontFamily="body" textAlign="center">
                Getting started is quick 
                and easy. Sign up with 
                us to receive premium 
                care
              </Text>
            </Box>
            <Box
              bg="white"
              p="20px"
              borderRadius="20px"
              flexDirection="column"
              alignItems="center"
              maxW="300px"
            >
              <Image src={Vetted} alt="vetted" w="200px" h="200px" />
              <Text
                fontFamily="heading"
                fontSize="xl"
                fontWeight="bold"
                textAlign="center"
              >
                500+ Vetted
              </Text>
              <Text  fontSize={{ base: "16px", md: "18px" }} fontFamily="body" textAlign="center">
                Now that you are a part 
                of our community, you 
                can find the kind of 
                service you need
              </Text>
            </Box>
          </Flex>
        </Box>

        {/* <Box bg="white">
          <Box>
            <Text
              fontSize="48px"
              fontWeight="bold"
              fontFamily="body"
              color="black"
            >
              Partners
            </Text>
          </Box>

          <Box display="flex">
            <Box
              bg="white"
              justifyContent="center"
              alignItems="center"
              padding="20px"
              borderRadius="20px"
              flexDirection="row"
            >
              <Box marginLeft="20px">
                <Image
                  //  src={SignUp}
                  alt="Logo"
                  w="200px"
                  h="200px"
                />
              </Box>

              <Text fontSize="xl" fontWeight="bold" textAlign="center">
                Over 1000 Medics Onboarderd
              </Text>
            </Box>

            <Box
              bg="white"
              justifyContent="center"
              alignItems="center"
              padding="20px"
              borderRadius="20px"
              flexDirection="row"
            >
              <Box marginLeft="20px">
                <Image
                  // src={SelectCare}
                  alt="Logo"
                  w="200px"
                  h="200px"
                />
              </Box>

              <Text fontSize="xl" fontWeight="bold" textAlign="center">
                Over 500 Vetted
              </Text>
            </Box>

            <Box
              bg="white"
              justifyContent="center"
              alignItems="center"
              padding="20px"
              borderRadius="20px"
              flexDirection="row"
            >
              <Box marginLeft="15px">
                <Image
                  // src={GetMatched}
                  alt="Logo"
                  w="200px"
                  h="200px"
                />
              </Box>

              <Text fontSize="xl" fontWeight="bold" textAlign="center">
                Get Matched
              </Text>
            </Box>

            <Box
              bg="white"
              justifyContent="center"
              alignItems="center"
              padding="20px"
              borderRadius="20px"
              flexDirection="row"
            >
              <Box marginLeft="15px">
                <Image
                  // src={ReceieveCare}
                  alt="Logo"
                  w="200px"
                  h="200px"
                />
              </Box>

              <Text fontSize="xl" fontWeight="bold" textAlign="center">
                Receive Care
              </Text>
            </Box>
          </Box>
        </Box> */}
        <Footer />
      </Box>
    </ChakraProvider>
  );
};

export default LandingPage;
