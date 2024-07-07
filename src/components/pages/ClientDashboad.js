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
import { CopyIcon, CheckIcon } from "@chakra-ui/icons";
import MedicalReportsModal from "../sections/MedicalReportsModal";
import {
  Box,
  Button,
  Flex,
  useClipboard,
  IconButton,
  VStack,
  Image,
  extendTheme,
  ChakraProvider,
  Text,
  Skeleton,
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
  const [isBeneficiariesModalOpen, setBeneficiariesModalOpen] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.userReducer);
  const balance = user?.walletBalance;
  const noPendingAppointments = user?.numberOfPendingAppointments;
  const activeAppointments = user?.numberOfActiveAppointments;
  const completedAppointments = user?.numberOfCompletedAppointments;
  const [pendingAppointment, setPendingAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const accountNumber = "0124536789";
  const { hasCopied, onCopy } = useClipboard(accountNumber);
  const [apiMessage] = useState("");
  const [showPayAppointmentModal, setShowPayAppointmentModal] = useState(false);
  const [matchedAppointments, setMatchedAppointments] = useState([]);
  const [isMedicalReportsModalOpen, setMedicalReportsModalOpen] =
    useState(false);
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
          "https://backend-c1pz.onrender.com/v1/appointment/pendingAppointments",
          config
        );

        if (response.data.success) {
          checkUnpaidAppointments(response.data.data);
        } else {
        }
      } catch (error) {
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
        setPendingAppointment(appointment);
        setTimeout(() => {
          setShowPayAppointmentModal(true);
        }, 3000);
      }
    });
  };

  const formatAmount = (amount) => {
    const num = Number(amount);
    return num.toLocaleString();
  };

  const handleOpenMedicalReportsModal = () => {
    setMedicalReportsModalOpen(true);
  };

  useEffect(() => {
    const fetchMatchedAppointments = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          // `http://localhost:8080/v1/appointment/match-appointment`,
          "https://backend-c1pz.onrender.com/v1/appointment/match-appointment",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        if (response.ok) {
          setMatchedAppointments(data.data);
          if (data.data && Array.isArray(data.data) && data.data.length > 0) {
            setShowMatchedAppointmentsModal(true);
          } else {
          }
        } else {
        }
      } catch (error) {}
    };

    fetchMatchedAppointments();

    const intervalId = setInterval(fetchMatchedAppointments, 15 * 60 * 1000);

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

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
      setLoading(true);

      if (localStorage.getItem("token")) {
        try {
          const response = await GetCurrentUser();

          if (response.success) {
            dispatch(SetUser(response.data));
          } else {
          }
        } catch (error) {
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
            <Box>
              <Box
                textAlign="center"
                w={{ base: "375px", md: "100%" }}
                h={{ base: "140px", md: "30%" }}
                mt={{ base: "4px", md: "0" }}
                mb={{ base: "5px", md: "30" }}
                paddingBottom={{ base: "20px", md: "" }}
                bg="#A210C6"
                borderRadius="20px"
              >
                <Flex>
                  <Box marginLeft="20px" paddingTop="5px">
                    <Text
                      fontSize="16px"
                      textAlign="left"
                      fontFamily="body"
                      color="white"
                      marginTop="20px"
                    >
                      Mikul Health Wallet
                    </Text>
                    <Flex>
                      <Text
                        marginTop="2px"
                        color="white"
                        fontSize={{ base: "18px", md: "22px" }}
                        textAlign="left"
                      >
                        ₦{formatAmount(balance)}.00
                      </Text>
                    </Flex>
                  </Box>
                  <VStack>
                    <Button
                      padding={{ base: "5px", md: "0" }}
                      ml={{ base: "90px", md: "360px" }}
                      w={{ base: "100px", md: "35%" }}
                      h={{ base: "30px", md: "50%" }}
                      fontSize={{ base: "12px", md: "16px" }}
                      borderRadius="15px"
                      color="#A210C6"
                      marginTop="20px"
                      fontFamily="body"
                      onClick={handleOpenWalletModal}
                      bg="white"
                    >
                      Open wallet
                    </Button>
                  </VStack>
                </Flex>
                <VStack
                  mb={{ base: "20px", md: "0" }}
                  mt={{ base: "20px", md: "20px" }}
                  color="white"
                >
                  <Box ml={{ base: "-160px", md: "-430px" }}>
                    <Flex>
                      <Text
                        textAlign="left"
                        fontFamily="body"
                        fontSize={{ base: "12px", md: "16px" }}
                      >
                        Wema Bank
                      </Text>
                      <Text
                        ml="10px"
                        textAlign="left"
                        fontSize={{ base: "12px", md: "16px" }}
                      >
                        {accountNumber}
                      </Text>
                      <IconButton
                        icon={hasCopied ? <CheckIcon /> : <CopyIcon />}
                        onClick={onCopy}
                        mt="-2px"
                        size="sm"
                        aria-label="Copy account number"
                        color="white"
                        bg={hasCopied ? "#A210C6" : "#A210C6"}
                        _hover={{ bg: "transparent" }}
                      />
                    </Flex>
                  </Box>
                </VStack>
              </Box>

              <Box marginTop="-10px">
                <Flex>
                  <Box
                    style={{
                      boxShadow: "0px 4px 8px rgba(162, 16, 198, 0.4)",
                    }}
                    bg="#DCFFEB"
                    h={{ base: "125px", md: "150px" }}
                    mt={{ base: "4", md: "0" }}
                    w={{ base: "180px", md: "340px" }}
                    borderRadius="10px"
                  >
                    <Box
                      pt={{ base: "10px", md: "" }}
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
                      <Box
                        mt={{ base: "-35px", md: "0" }}
                        ml={{ base: "45px", md: "0" }}
                        justifyItems="center"
                      >
                        <Text
                          textAlign="left"
                          fontSize={{ base: "14px", md: "20px" }}
                          fontFamily="heading"
                          color="black"
                        >
                          Book appointment
                        </Text>
                        <Text
                          textAlign="left"
                          fontSize={{ base: "10px", md: "14px" }}
                          fontFamily="body"
                        >
                          Schedule your appointment
                        </Text>
                      </Box>
                    </Box>

                    <Text
                      fontSize={{ base: "12px", md: "14px" }}
                      fontWeight="bold"
                      fontFamily="body"
                      textAlign="center"
                      style={{
                        marginTop: "15px",
                        fontStyle: "italic",
                        cursor: "pointer",
                        transition: "transform 0.3s ease-in-out",
                      }}
                      color="#27AE60"
                      onClick={handleOpenAppointmentModal}
                      _hover={{
                        color: "#A210C6",
                        transform: "translateY(-10px)",
                      }}
                    >
                      Book now
                    </Text>
                  </Box>

                  <Box
                    style={{
                      boxShadow: "0px 4px 8px rgba(162, 16, 198, 0.4)",
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
                      <Box
                        mt={{ base: "-35px", md: "15px" }}
                        ml={{ base: "45px", md: "0" }}
                      >
                        <Text
                          textAlign="left"
                          fontSize={{ base: "14px", md: "20px" }}
                          fontFamily="heading"
                          color="black"
                        >
                          Beneficiaries
                        </Text>
                        <Text
                          textAlign="left"
                          fontFamily="body"
                          fontSize={{ base: "10px", md: "14px" }}
                        >
                          Your friends and family as Beneficiaries
                        </Text>
                      </Box>
                    </Box>

                    <Text
                      fontSize={{ base: "12px", md: "14px" }}
                      textAlign="center"
                      fontWeight="bold"
                      fontFamily="body"
                      style={{
                        marginTop: "10px",
                        fontStyle: "italic",
                        cursor: "pointer",
                        transition: "transform 0.3s ease-in-out",
                      }}
                      color="#2295F2"
                      _hover={{
                        color: "#A210C6",
                        transform: "translateY(-10px)",
                      }}
                    >
                      View all
                    </Text>
                  </Box>
                </Flex>
                <Flex mt={{ base: "", md: "20px" }}>
                  <Box
                    style={{
                      boxShadow: "0px 4px 8px rgba(162, 16, 198, 0.4)",
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
                      <Box
                        pt={{ base: "10px", md: "0" }}
                        mt={{ base: "-35px", md: "0" }}
                        ml={{ base: "45px", md: "0" }}
                      >
                        <Text
                          textAlign="left"
                          fontSize={{ base: "14px", md: "20px" }}
                          fontFamily="heading"
                          color="black"
                        >
                          Our services
                        </Text>
                        <Text
                          textAlign="left"
                          fontFamily="body"
                          fontSize={{ base: "10px", md: "14px" }}
                        >
                          Explore a variety of our services
                        </Text>
                      </Box>
                    </Box>

                    <NavLink to="/services">
                      <Text
                        fontSize={{ base: "12px", md: "14px" }}
                        fontWeight="bold"
                        fontFamily="body"
                        textAlign="center"
                        style={{
                          marginTop: "10px",
                          fontStyle: "italic",
                          cursor: "pointer",
                          transition: "transform 0.3s ease-in-out",
                        }}
                        color="#2295F2"
                        _hover={{
                          color: "#A210C6",
                          transform: "translateY(-10px)",
                        }}
                      >
                        View services
                      </Text>
                    </NavLink>
                  </Box>
                  <Box
                    style={{
                      boxShadow: "0px 4px 8px rgba(162, 16, 198, 0.4)",
                    }}
                    bg="#F1ECFE"
                    h={{ base: "125px", md: "150px" }}
                    mt={{ base: "4", md: "0" }}
                    w={{ base: "180px", md: "340px" }}
                    marginLeft="10px"
                    borderRadius="10px"
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
                      <Box
                        mt={{ base: "-35px", md: "10px" }}
                        ml={{ base: "45px", md: "0" }}
                      >
                        <Text
                          mt={{ base: "2px", md: "5px" }}
                          textAlign="left"
                          fontSize={{ base: "14px", md: "20px" }}
                          fontFamily="heading"
                          color="black"
                        >
                          Custom plans
                        </Text>
                        <Text
                          textAlign="left"
                          fontSize={{ base: "10px", md: "14px" }}
                          fontFamily="body"
                        >
                          Choose a service you want, how and when you want it
                        </Text>
                      </Box>
                    </Box>
                    <NavLink to="/customize-service">
                      <Text
                        fontSize={{ base: "12px", md: "14px" }}
                        fontWeight="bold"
                        fontFamily="body"
                        textAlign="center"
                        style={{
                          marginTop: "10px",
                          fontStyle: "italic",
                          cursor: "pointer",
                          transition: "transform 0.3s ease-in-out",
                        }}
                        color="#753FF6"
                        _hover={{
                          color: "#A210C6",
                          transform: "translateY(-10px)",
                        }}
                      >
                        Customize service
                      </Text>
                    </NavLink>
                  </Box>
                </Flex>
                <Box
                  style={{
                    boxShadow: "0px 4px 8px rgba(162, 16, 198, 0.4)",
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
                    pt={{ base: "10px", md: "" }}
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
                    <Box
                      mt={{ base: "-35px", md: "5px" }}
                      ml={{ base: "45px", md: "0" }}
                    >
                      <Text
                        textAlign="left"
                        fontSize={{ base: "14px", md: "20px" }}
                        fontFamily="heading"
                        color="black"
                      >
                        My medical report
                      </Text>
                      <Text
                        textAlign="left"
                        fontFamily="body"
                        fontSize={{ base: "10px", md: "14px" }}
                      >
                        All your medical reports
                      </Text>
                    </Box>
                  </Box>

                  <Text
                    fontSize={{ base: "12px", md: "14px" }}
                    fontWeight="bold"
                    fontFamily="body"
                    textAlign="center"
                    onClick={handleOpenMedicalReportsModal}
                    style={{
                      marginTop: "15px",
                      fontStyle: "italic",
                      cursor: "pointer",
                      transition: "transform 0.3s ease-in-out",
                    }}
                    color="#753FF6"
                    _hover={{
                      color: "#A210C6",
                      transform: "translateY(-10px)",
                    }}
                  >
                    View reports
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
                <Box textAlign="center">
                  <Text
                    fontSize={{ base: "16", md: "20px" }}
                    fontFamily="body"
                    pt="25px"
                  >
                    My Appointments
                  </Text>
                  <Flex flexDirection="column" mt="15px">
                    <Text
                      fontFamily="body"
                      textAlign="left"
                      pl="50px"
                      fontSize={{ base: "12", md: "16px" }}
                      style={{
                        cursor: "pointer",
                      }}
                      _hover={{ color: "" }}
                    >
                      Pending: {noPendingAppointments}
                    </Text>
                    <Text
                      marginTop="15px"
                      textAlign="left"
                      pl="50px"
                      fontSize={{ base: "12", md: "16px" }}
                      fontFamily="body"
                      style={{
                        cursor: "pointer",
                      }}
                      _hover={{ color: "" }}
                    >
                      Active: {activeAppointments}
                    </Text>
                    <Text
                      marginTop="15px"
                      textAlign="left"
                      pl="50px"
                      fontSize={{ base: "12", md: "16px" }}
                      fontFamily="body"
                      style={{
                        cursor: "pointer",
                      }}
                      _hover={{ color: "" }}
                    >
                      Completed: {completedAppointments}
                    </Text>
                  </Flex>
                </Box>
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
        )}
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
        matchedAppointments={matchedAppointments}
        apiResponseMessage={apiMessage}
      />

      <PayForAppointmentModal
        isOpen={showPayAppointmentModal}
        onClose={() => setShowPayAppointmentModal(false)}
        appointment={pendingAppointment}
      />
      <MedicalReportsModal
        isOpen={isMedicalReportsModalOpen}
        onClose={() => setMedicalReportsModalOpen(false)}
      />
    </ChakraProvider>
  );
};

export default ClientDash;
