import React, { useState, useEffect } from "react";
import axios from "axios";
import { GetCurrentUser } from "../../apiCalls/UserApis";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { SetUser } from "../../redux/userSlice";
import { baseUrl } from "../../apiCalls/config";
import {
  Box,
  Flex,
  useClipboard,
  VStack,
  extendTheme,
  ChakraProvider,
  Skeleton,
} from "@chakra-ui/react";
import AOS from "aos";
import "../../styles/pages/LandingPage.css";

import LeftSideBar from "../authLayouts/LeftSideBar";
import NavBar from "../authLayouts/NavBar";
import MobileFooter from "../authLayouts/MobileFooter";
import WalletComponent from "../sections/WalletComponent";
import DashboardButtons from "../sections/DashboardButtons";
import AppointmentsSidebar from "../sections/AppointmentsSidebar";
import BeneficiariesModal from "../sections/Beneficiaries";
import BookAppointmentModal from "../sections/BookAppointment";
import MatchedAppointmentsModal from "../sections/MatchedAppointmentsModal";
import PayForAppointmentModal from "../sections/PayForAppointment";
import MedicalReportsModal from "../sections/MedicalReportsModal";

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
  const [showPayAppointmentModal, setShowPayAppointmentModal] = useState(false);
  const [showMatchedAppointmentsModal, setShowMatchedAppointmentsModal] =
    useState(false);
  const [isMedicalReportsModalOpen, setMedicalReportsModalOpen] =
    useState(false);
  const [pendingAppointment, setPendingAppointment] = useState(null);
  const [matchedAppointments, setMatchedAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.userReducer);
  const noPendingAppointments = user?.numberOfPendingAppointments;
  const activeAppointments = user?.numberOfActiveAppointments;
  const completedAppointments = user?.numberOfCompletedAppointments;
  const walletAccountNumber = user?.walletAccountNumber;
  const subscriptionsCount = user?.subscriptionsCount;
  const subscribedAppointments = user?.subscribedAppointments;
  const { hasCopied, onCopy } = useClipboard(walletAccountNumber);
  const walletBankName = user?.walletBankName;

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
          `${baseUrl}/appointment/pendingAppointments`,
          config
        );

        if (response.data.success) {
          checkUnpaidAppointments(response.data.data);
        } else {
        }
      } catch (error) {}
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

  useEffect(() => {
    const fetchMatchedAppointments = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${baseUrl}/appointment/match-appointment`,
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
          }
        }
      } catch (error) {}
    };

    fetchMatchedAppointments();

    const intervalId = setInterval(fetchMatchedAppointments, 15 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

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

  const handleOpenAppointmentModal = () => setShowAppointmentModal(true);
  const handleCloseAppointmentModal = () => setShowAppointmentModal(false);
  const handleOpenMedicalReportsModal = () => setMedicalReportsModalOpen(true);
  const handleBeneficiariesButtonClick = () => setBeneficiariesModalOpen(true);
  const handleOpenWalletModal = () => navigate("/wallet");

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
            ml={{ md: "50px" }}
            mt={{ base: "0", md: "30px" }}
            mb={{ base: "150px", md: "0" }}
            flexDirection={{ base: "column", md: "row" }}
            alignItems={{ base: "center", md: "flex-start" }}
            justifyContent={{ base: "center", md: "flex-start" }}
          >
            <Box>
              <WalletComponent
                user={user}
                accountNumber={walletAccountNumber}
                handleOpenWalletModal={handleOpenWalletModal}
                hasCopied={hasCopied}
                onCopy={onCopy}
                walletBankName={walletBankName}
                subscribedAppointments={subscribedAppointments}
                subscriptionsCount={subscriptionsCount}
              />
              <DashboardButtons
                handleOpenAppointmentModal={handleOpenAppointmentModal}
                handleBeneficiariesButtonClick={handleBeneficiariesButtonClick}
                handleOpenMedicalReportsModal={handleOpenMedicalReportsModal}
                noPendingAppointments={noPendingAppointments}
                activeAppointments={activeAppointments}
                completedAppointments={completedAppointments}
              />
            </Box>
            <AppointmentsSidebar
              noPendingAppointments={noPendingAppointments}
              activeAppointments={activeAppointments}
              completedAppointments={completedAppointments}
            />
            {/* <Help /> */}
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
