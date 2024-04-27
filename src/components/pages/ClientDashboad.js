import React, { useState, useEffect } from "react";
import axios from "axios";
import { GetCurrentUser } from "../../apiCalls/UserApis";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { SetUser } from "../../redux/userSlice";
import BookAppointmentModal from "../sections/BookAppointment";
import MatchedAppointmentsModal from "../sections/MatchedAppointmentsModal";
import PayForAppointmentModal from "../sections/PayForAppointment";
import Help from "../authLayouts/Help";

import {
  Box,
  Button,
  Flex,
  VStack,
  Image,
  extendTheme,
  ChakraProvider,
  Text,
} from "@chakra-ui/react";
import AOS from "aos";
import "../../styles/pages/LandingPage.css";
import BeneficiariesModal from "../sections/Beneficiaries";
import Tele from "../../assets/Telemed.svg";
import NavBar from "../authLayouts/NavBar";
import Services from "../../assets/Services.svg";
import BookIcon from "../../assets/BookIcon.svg";
import Beneficiary from "../../assets/Beneficiaries.svg";
import Report from "../../assets/MedicalReport.svg";
import CustomService from "../../assets/CustomizeService.svg";
import LeftSideBar from "../authLayouts/LeftSideBar";
import MobileFooter from "../authLayouts/MobileFooter";
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

const ClientDash = () => {
  // const [loading, setLoading] = useState(false);
  const [isBeneficiariesModalOpen, setBeneficiariesModalOpen] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.userReducer);
  const balance = 0.0;
  const noPendingAppointments = user?.numberOfPendingAppointments;
  const activeAppointments = user?.numberOfActiveAppointments;
  const completedAppointments = user?.numberOfCompletedAppointments;
  const [pendingAppointment, setPendingAppointment] = useState(null);
  // const [setShowSkeleton] = useState(true);
  const [apiMessage] = useState("");
  const [showPayAppointmentModal, setShowPayAppointmentModal] = useState(false);
  // const [matchedAppointments, setMatchedAppointments] = useState([]);
  const [showMatchedAppointmentsModal, setShowMatchedAppointmentsModal] =
    useState(false);

  useEffect(() => {
    AOS.init();
  }, []);

  useEffect(() => {
    const fetchPendingData = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        };

        const response = await axios.get(
          // "http://localhost:8080/v1/appointment/pendingAppointments",
          "https://backend-c1pz.onrender.com/v1/appointment/pendingAppointments",
          config
        );

        if (response.data.success) {
          checkUnpaidAppointments(response.data.data);
          console.log("This are pending appointments:", response.data.data);
        } else {
          console.error("Failed to fetch appointments");
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        // setLoading(false);
      }
    };

    fetchPendingData();
  }, []);

  const checkUnpaidAppointments = (appointments) => {
    appointments.forEach((appointmentData) => {
      const appointment = appointmentData.appointment;
      if (!appointment.paid) {
        console.log("This is the un-paid appointment:", appointment);
        setPendingAppointment(appointment);
        setTimeout(() => {
          setShowPayAppointmentModal(true);
        }, 3000);
      }
    });
  };

  // useEffect(() => {
  //   const fetchMatchedAppointments = async () => {
  //     try {
  //       const appointmentId = localStorage.getItem("appointmentId");
  //       if (appointmentId) {
  //         const token = localStorage.getItem("token");
  //         const response = await fetch(
  //           `http://localhost:8080/v1/appointment/match-appointment/${appointmentId}`,
  //           {
  //             method: "POST",
  //             headers: {
  //               "Content-Type": "application/json",
  //               Authorization: `Bearer ${token}`,
  //             },
  //           }
  //         );
  //         const data = await response.json();
  //         if (response.ok) {
  //           console.log("Response from matched appointments:", data);
  //           setMatchedAppointments(data.data);
  //           console.log("Response from api message", data.message);

  //           // Check if data.data exists and is an array with length > 0
  //           if (data.data && Array.isArray(data.data) && data.data.length > 0) {
  //             setShowMatchedAppointmentsModal(true);
  //           } else {
  //             console.log("No matched appointments found in data.");
  //           }
  //         } else {
  //           console.error("Failed to fetch matched appointments:", data.error);
  //         }
  //       } else {
  //         console.log("No appointment ID found in local storage.");
  //       }
  //     } catch (error) {
  //       console.error("Error fetching matched appointments:", error);
  //     }
  //   };

  //   // Fetch matched appointments initially
  //   setTimeout(fetchMatchedAppointments, 5000);

  //   const intervalId = setInterval(fetchMatchedAppointments, 15 * 60 * 1000);

  //   // Clear interval on component unmount
  //   return () => clearInterval(intervalId);
  // }, []);

  const handleOpenAppointmentModal = () => {
    setShowAppointmentModal(true);
  };

  const handleCloseAppointmentModal = () => {
    setShowAppointmentModal(false);
  };

  const handleBeneficiariesButtonClick = () => {
    setBeneficiariesModalOpen(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      // setLoading(true);

      if (localStorage.getItem("token")) {
        try {
          console.log("Calling GetCurrentUser API");
          const response = await GetCurrentUser();

          if (response.success) {
            console.log("API response:", response.data);
            dispatch(SetUser(response.data));
          } else {
            console.error("API request failed:", response.error);
          }
        } catch (error) {
          console.error("Error in GetCurrentUser API:", error);
        } finally {
          // setLoading(false);
          // setShowSkeleton(false);
        }
      } else {
        navigate("/login");
      }
    };

    fetchData();
  }, [navigate, dispatch]);

  const handleOpenWalletModal = () => {
    navigate("/wallet");
  };

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
        <Flex
          // overflow={{base: "scroll", md: ""}}
          mt={{ base: "0", md: "30px" }}
          mb={{ base: "150px", md: "0" }}
          flexDirection={{ base: "column", md: "row" }}
          alignItems={{ base: "center", md: "flex-start" }}
          justifyContent={{ base: "center", md: "flex-start" }}
        >
          <Box>
            <Box
              textAlign="center"
              w={{ base: "375px", md: "100%" }}
              h={{ base: "130px", md: "30%" }}
              mt={{ base: "4px", md: "0" }}
              mb={{ base: "5px", md: "30" }}
              paddingBottom={{ base: "20px", md: "" }}
              bg="#A210C6"
              borderRadius="20px"
            >
              {" "}
              <Flex>
                <VStack marginLeft="20px" paddingTop="5px">
                  <Text
                    fontSize="16px"
                    fontFamily="body"
                    color="white"
                    marginTop="20px"
                  >
                    Mikul Health Savings Account
                  </Text>
                  <Text
                    marginTop="-10px"
                    color="white"
                    fontSize="22px"
                    marginLeft="-70%"
                  >
                    ₦{balance.toFixed(2)}
                  </Text>
                </VStack>
                <VStack>
                  <Button
                    padding={{ base: "5px", md: "0" }}
                    ml={{ base: "25px", md: "320px" }}
                    w={{ base: "100px", md: "35%" }}
                    h={{ base: "30px", md: "50%" }}
                    fontSize={{ base: "12px", md: "16px" }}
                    borderRadius="15px"
                    color="#A210C6"
                    marginTop="20px"
                    onClick={handleOpenWalletModal}
                    bg="white"
                    // leftIcon={<ExternalLinkIcon />}
                  >
                    fund wallet
                  </Button>
                </VStack>
              </Flex>
              <VStack
                mb={{ base: "20px", md: "0" }}
                mt={{ base: "20px", md: "20px" }}
                color="white"
              >
                <Box ml={{ base: "-170px", md: "-490px" }}>
                  <Text
                    display={{ base: "none", md: "block" }}
                    justify="left"
                    ml={{ base: "5px", md: "-95px" }}
                    fontSize={{ base: "10px", md: "14px" }}
                  >
                    Wallet ID:
                  </Text>
                  <Text
                    // marginBottom={{ base: "10px", md: "0" }}
                    justify="left"
                    fontSize={{ base: "14px", md: "14px" }}
                  >
                    Wema Bank 0124536789
                  </Text>
                </Box>
              </VStack>
            </Box>

            <Box marginTop="-10px">
              <Flex>
                <Box
                  style={{
                    boxShadow: "0px 4px 8px rgba(162, 16, 198, 0.4)",
                    transition: "transform 0.3s ease-in-out",
                  }}
                  bg="#DCFFEB"
                  h={{ base: "125px", md: "150px" }}
                  mt={{ base: "4", md: "0" }}
                  w={{ base: "180px", md: "340px" }}
                  borderRadius="10px"
                  _hover={{
                    transform: "translateY(-10px)",
                  }}
                >
                  <Box
                    display={{ base: "block", md: "flex" }}
                    alignItems="center"
                  >
                    <Image
                      src={BookIcon}
                      margin={{ base: "10px", md: "15px" }}
                      w={{ base: "25px", md: "60px" }}
                      h={{ base: "25px", md: "60px" }}
                      borderRadius="100px"
                    />
                    <VStack
                      mt={{ base: "-5", md: "20px" }}
                      justifyItems="center"
                    >
                      <Text
                        textAlign="center"
                        fontSize={{ base: "14px", md: "20px" }}
                        fontFamily="heading"
                        ml={{ md: "30px" }}
                        color="black"
                      >
                        Book appointment
                      </Text>
                      <Text
                        // display={{ base: "none", lg: "block" }}
                        textAlign="center"
                        fontSize={{ base: "12px", md: "16px" }}
                      >
                        Schedule your appointment
                      </Text>
                    </VStack>
                  </Box>

                  <Text
                    fontSize={{ base: "12px", md: "14px" }}
                    fontWeight="bold"
                    textAlign="center"
                    style={{
                      marginTop: "15px",
                      fontStyle: "italic",
                      cursor: "pointer",
                    }}
                    color="#27AE60"
                    onClick={handleOpenAppointmentModal}
                    _hover={{ color: "#A210C6" }}
                  >
                    book Now
                  </Text>
                </Box>

                <Box
                  style={{
                    boxShadow: "0px 4px 8px rgba(162, 16, 198, 0.4)",
                    transition: "transform 0.3s ease-in-out",
                  }}
                  _hover={{
                    transform: "translateY(-10px)",
                  }}
                  bg="#E7F6FF"
                  h={{ base: "125px", md: "150px" }}
                  mt={{ base: "4", md: "0" }}
                  w={{ base: "180px", md: "340px" }}
                  marginLeft="10px"
                  borderRadius="10px"
                  onClick={handleBeneficiariesButtonClick}
                >
                  <Box
                    display={{ base: "block", md: "flex" }}
                    alignItems="center"
                  >
                    <Image
                      src={Beneficiary}
                      margin={{ base: "10px", md: "15px" }}
                      w={{ base: "25px", md: "60px" }}
                      h={{ base: "25px", md: "60px" }}
                      borderRadius="100px"
                    />
                    <VStack mt={{ base: "-20px" }}>
                      <Text
                        textAlign="left"
                        fontSize={{ base: "14px", md: "20px" }}
                        fontFamily="heading"
                        color="black"
                      >
                        Beneficiaries
                      </Text>
                      <Text
                        textAlign="center"
                        fontSize={{ base: "12px", md: "16px" }}
                      >
                        Your friends and loved ones
                      </Text>
                    </VStack>
                  </Box>

                  <Text
                    fontSize={{ base: "12px", md: "14px" }}
                    textAlign="center"
                    fontWeight="bold"
                    style={{
                      marginTop: "15px",
                      fontStyle: "italic",
                      cursor: "pointer",
                    }}
                    color="#2295F2"
                    _hover={{ color: "#A210C6" }}
                  >
                    view all
                  </Text>
                </Box>
              </Flex>
              <Flex mt={{ base: "", md: "20px" }}>
                <Box
                  style={{
                    boxShadow: "0px 4px 8px rgba(162, 16, 198, 0.4)",
                    transition: "transform 0.3s ease-in-out",
                  }}
                  _hover={{
                    transform: "translateY(-10px)",
                  }}
                  bg="#CCF0FE"
                  h={{ base: "125px", md: "150px" }}
                  mt={{ base: "3", md: "0" }}
                  w={{ base: "180px", md: "340px" }}
                  borderRadius="10px"
                >
                  <Box
                    display={{ base: "block", md: "flex" }}
                    alignItems="center"
                  >
                    <Image
                      src={Services}
                      margin={{ base: "10px", md: "15px" }}
                      w={{ base: "25px", md: "60px" }}
                      h={{ base: "25px", md: "60px" }}
                      borderRadius="100px"
                    />
                    <VStack mt={{ base: "-20px" }}>
                      <Text
                        textAlign="center"
                        fontSize={{ base: "14px", md: "20px" }}
                        fontFamily="heading"
                        color="black"
                      >
                        Our services
                      </Text>
                      <Text
                        textAlign="center"
                        fontSize={{ base: "12px", md: "16px" }}
                      >
                        Explore a variety of our services
                      </Text>
                    </VStack>
                  </Box>

                  <NavLink to="/services">
                    <Text
                      fontSize={{ base: "12px", md: "14px" }}
                      fontWeight="bold"
                      textAlign="center"
                      style={{
                        marginTop: "15px",
                        fontStyle: "italic",
                        cursor: "pointer",
                      }}
                      color="#2295F2"
                      _hover={{ color: "#A210C6" }}
                    >
                      view services
                    </Text>
                  </NavLink>
                </Box>
                <Box
                  style={{
                    boxShadow: "0px 4px 8px rgba(162, 16, 198, 0.4)",
                    transition: "transform 0.3s ease-in-out",
                  }}
                  _hover={{
                    transform: "translateY(-10px)",
                  }}
                  bg="#F1ECFE"
                  h={{ base: "125px", md: "150px" }}
                  mt={{ base: "4", md: "0" }}
                  w={{ base: "180px", md: "340px" }}
                  marginLeft="10px"
                  borderRadius="10px"
                  // marginLeft="10px"
                >
                  <Box
                    display={{ base: "block", md: "flex" }}
                    alignItems="center"
                  >
                    <Image
                      src={CustomService}
                      margin={{ base: "10px", md: "15px" }}
                      w={{ base: "25px", md: "60px" }}
                      h={{ base: "25px", md: "60px" }}
                      borderRadius="100px"
                    />
                    <VStack
                      mt={{ base: "-25px", md: "10px" }}
                      ml={{ base: "5px", md: "0" }}
                    >
                      <Text
                        mt={{ base: "2px", md: "" }}
                        textAlign="center"
                        fontSize={{ base: "14px", md: "20px" }}
                        fontFamily="heading"
                        color="black"
                      >
                        Custom plans
                      </Text>
                      <Text
                        textAlign="center"
                        fontSize={{ base: "12px", md: "14px" }}
                        mt={{ base: "-15px", md: "0px" }}
                      >
                        The service you want, <br></br>how and when you want it.
                      </Text>
                    </VStack>
                  </Box>
                  <NavLink to="/customize-service">
                    <Text
                      fontSize={{ base: "12px", md: "14px" }}
                      fontWeight="bold"
                      textAlign="center"
                      style={{
                        marginTop: "15px",
                        fontStyle: "italic",
                        cursor: "pointer",
                      }}
                      color="#753FF6"
                      _hover={{ color: "#A210C6" }}
                    >
                      customize service
                    </Text>
                  </NavLink>
                </Box>
              </Flex>
              <Box
                style={{
                  boxShadow: "0px 4px 8px rgba(162, 16, 198, 0.4)",
                  transition: "transform 0.3s ease-in-out",
                }}
                _hover={{
                  transform: "translateY(-10px)",
                }}
                bg="#F1ECFE"
                h={{ base: "125px", md: "150px" }}
                mt={{ base: "20px", md: "20px" }}
                mb={{ base: "-10px", md: "30px" }}
                w={{ base: "180px", md: "340px" }}
                borderRadius="10px"
              >
                <Box
                  display={{ base: "block", md: "flex" }}
                  alignItems="center"
                >
                  <Image
                    src={Report}
                    margin={{ base: "10px", md: "15px" }}
                    paddingTopt={{ base: "20px", md: "" }}
                    w={{ base: "25px", md: "60px" }}
                    h={{ base: "25px", md: "60px" }}
                    borderRadius="100px"
                  />
                  <VStack mt={{ base: "-5px" }}>
                    <Text
                      textAlign="center"
                      fontSize={{ base: "14px", md: "20px" }}
                      fontFamily="heading"
                      color="black"
                    >
                      Medical reports
                    </Text>
                    <Text
                      textAlign="center"
                      fontSize={{ base: "12px", md: "16px" }}
                    >
                      Access and view your reports
                    </Text>
                  </VStack>
                </Box>

                <Text
                  fontSize={{ base: "12px", md: "14px" }}
                  fontWeight="bold"
                  textAlign="center"
                  style={{
                    marginTop: "15px",
                    fontStyle: "italic",
                    cursor: "pointer",
                  }}
                  color="#753FF6"
                  _hover={{ color: "#A210C6" }}
                >
                  view reports
                </Text>
              </Box>
            </Box>
          </Box>

          <Box display={{ base: "none", md: "block" }} marginLeft="30px">
            <Box
              color="white"
              borderRadius="10px"
              h="40vh"
              w="20vw"
              bg="#A210C6"
            >
              <VStack justify="left" textAlign="left">
                <Text
                  fontSize="16px"
                  fontFamily="body"
                  fontWeight="bold"
                  marginTop="20px"
                  textAlign="left"
                >
                  My Appointments
                </Text>
                <Flex flexDirection="column" marginTop="7px">
                  <Text
                    style={{
                      cursor: "pointer",
                      fontSize: "14px",
                    }}
                    _hover={{ color: "" }}
                  >
                    Pending: {noPendingAppointments}
                  </Text>
                  <Text
                    marginTop="15px"
                    marginLeft=""
                    style={{
                      cursor: "pointer",
                      fontSize: "14px",
                    }}
                    _hover={{ color: "" }}
                  >
                    Active: {activeAppointments}
                  </Text>
                  <Text
                    marginTop="15px"
                    style={{
                      cursor: "pointer",
                      fontSize: "14px",
                    }}
                    _hover={{ color: "" }}
                  >
                    Completed: {completedAppointments}
                  </Text>
                </Flex>
              </VStack>
            </Box>

            <Box align="center" bg="#F6E4FC" borderRadius="10" h="30vh">
              <Image
                src={Tele}
                alt="Nurse and Patient"
                w="150px"
                h="150px"
                marginTop="20px"
                paddingTop="40px"
              />
            </Box>
            <Help />
          </Box>
        </Flex>
        <MobileFooter />
      </VStack>

      <BeneficiariesModal
        isOpen={isBeneficiariesModalOpen}
        onClose={() => setBeneficiariesModalOpen(false)}
      />

      <BookAppointmentModal
        isOpen={showAppointmentModal}
        onClose={handleCloseAppointmentModal}
      />
      <MatchedAppointmentsModal
        isOpen={showMatchedAppointmentsModal}
        onClose={() => setShowMatchedAppointmentsModal(false)}
        // matchedAppointments={matchedAppointments}
        apiResponseMessage={apiMessage}
      />

      <PayForAppointmentModal
        isOpen={showPayAppointmentModal}
        onClose={() => setShowPayAppointmentModal(false)}
        appointment={pendingAppointment}
      />
    </ChakraProvider>
  );
};

export default ClientDash;
