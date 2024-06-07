import React, { useState, useEffect } from "react";
import { GetCurrentMedic } from "../../apiCalls/UserApis";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Medics from "../../assets/Medics.svg";
import { SetUser } from "../../redux/userSlice";
import {
  Box,
  Flex,
  VStack,
  extendTheme,
  ChakraProvider,
  Skeleton,
  Image,
  Text,
  Button,
} from "@chakra-ui/react";
import AOS from "aos";
import "../../styles/pages/LandingPage.css";
import NavBar from "../authLayouts/MedicNavBar";
import LeftSideBar from "../authLayouts/MedicSideBar";
import MobileFooter from "../authLayouts/MedicFooter";
import CalendarBox from "../../components/sections/CalenderBox";
import SummaryCards from "../sections/MobileBody";
import DesktopCards from "../sections/DesktopBody";

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

const MedicDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  //   const { user } = useSelector((state) => state.userReducer);
  //   const balance = user?.walletBalance;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init();
  }, []);

  //   const formatAmount = (amount) => {
  //     const num = Number(amount);
  //     return num.toLocaleString();
  //   };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      if (localStorage.getItem("token")) {
        try {
          const response = await GetCurrentMedic();

          if (response.success) {
            dispatch(SetUser(response.data));
          } else {
            console.error("API request failed:", response.error);
          }
        } catch (error) {
          console.error("Error in GetCurrentMedic API:", error);
          navigate("/login");
          window.location.reload();
        } finally {
          setLoading(false);
        }
      } else {
        navigate("/login");
        window.location.reload();
      }
    };

    fetchData();
  }, [navigate, dispatch]);

  const settingsContainerStyle = {
    animation: "slideInUp 0.9s ease-in-out",
  };

  return (
    <ChakraProvider theme={customTheme} overflow="hidden">
      <LeftSideBar />
      <VStack
        style={settingsContainerStyle}
        ml={{ md: "230px" }}
        w={{ base: "100%", md: "80%" }}
        h={{ base: "100%", md: "100%" }}
      >
        <NavBar />
        {loading ? (
          <Skeleton
            ml={{ base: "5px", md: "0" }}
            w={{ base: "375px", md: "70vw" }}
            h={{ base: "189px", md: "40vh" }}
            startColor="#E552FF"
            endColor="#870DA5"
            fadeDuration={0.6}
            borderRadius="20px"
          />
        ) : (
          <Flex
            mt={{ base: "0", md: "30px" }}
            mb={{ base: "150px", md: "0" }}
            flexDirection={{ base: "column", md: "row" }}
            alignItems={{ base: "center", md: "flex-start" }}
            justifyContent={{ base: "center", md: "flex-start" }}
          >
            <Box
              textAlign="center"
              w={{ base: "375px", md: "630px" }}
              h={{ base: "140px", md: "276px" }}
              mt={{ base: "4px", md: "0" }}
              mb={{ base: "5px", md: "30px" }}
              bg="#A210C6"
              borderRadius="10px"
            >
              <Flex>
                <Box justifyContent="left" p="20px">
                  <Text
                    fontSize={{ base: "12px", md: "16px" }}
                    textAlign="left"
                    fontFamily="body"
                    color="white"
                    mt={{ base: "5px", md: "40px" }}
                  >
                    Your time, your terms. <br /> Request appointments
                    seamlessly
                  </Text>
                  <Button
                    ml={{ base: "-25px", md: "0" }}
                    fontSize={{ base: "10px", md: "16px" }}
                    textAlign="center"
                    fontFamily="body"
                    color="#A210C6"
                    mt={{ base: "20px", md: "90px" }}
                    bg="white"
                    w={{ base: "150px", md: "240px" }}
                    h={{ base: "30px", md: "52px" }}
                    borderRadius="100px"
                  >
                    Request appointment
                  </Button>
                </Box>
                <Box>
                  <Image
                    src={Medics}
                    mt={{ base: "40px", md: "40px" }}
                    w={{ base: "160px", md: "340px" }}
                    h={{ base: "100px", md: "240px" }}
                  />
                </Box>
              </Flex>
              <DesktopCards />
              <SummaryCards />
            </Box>

            <Flex display={{ base: "none", md: "block" }}>
              <Box className="calendar-box">
                <CalendarBox />
              </Box>
              {/* <Box display={{ base: "none", md: "block" }} ml="-50px">
                <Help />
              </Box> */}
            </Flex>
          </Flex>
        )}
        <MobileFooter />
      </VStack>
    </ChakraProvider>
  );
};

export default MedicDashboard;
