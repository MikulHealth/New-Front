import React, { useState, useEffect } from "react";
import axios from "axios";
import { GetCurrentMedic } from "../../apiCalls/UserApis";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { SetUser } from "../../redux/userSlice";
import {
  Box,
  Flex,
  VStack,
  extendTheme,
  ChakraProvider,
  Skeleton,
  useToast,
} from "@chakra-ui/react";
import AOS from "aos";
import "../../styles/pages/LandingPage.css";
import NavBar from "../authLayouts/AdminNavBar";
import LeftSideBar from "../authLayouts/AdminSideBar";
import { baseUrl } from "../../apiCalls/config";
import StatisticsBar from "../authLayouts/StatisticsBar";
import StatisticsSection from "../authLayouts/StatisticsSection";
import UserActivities from "../authLayouts/UserActivities";
import PatientsManagement from "../authLayouts/PatientsManagement";
import RecentMedicalReports from "../authLayouts/RecentMedicalReports";
import ActiveMedics from "../authLayouts/ActiveMedics";
import PendingCustomerAppointments from "../authLayouts/PendingApps";
import ActiveAppointments from "../authLayouts/ActiveApps";

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

const AdminDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  useState(false);

  useEffect(() => {
    AOS.init();
  }, []);

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

  return (
    <ChakraProvider theme={customTheme} overflow="hidden">
      <Box bg="#2C2C2C" minH="100vh">
        {/* <Box bg="white" minH="100vh"> */}
        <LeftSideBar />
        <VStack
          ml={{ md: "260px" }}
          w={{ base: "100%", md: "80%" }}
          h={{ base: "100%", md: "100%" }}
        >
          <NavBar />
          {loading ? (
            <Skeleton
              ml={{ base: "5px", md: "0" }}
              w={{ base: "375px", md: "70vw" }}
              h={{ base: "189px", md: "80vh" }}
              startColor="#E552FF"
              endColor="#870DA5"
              fadeDuration={0.6}
              borderRadius="20px"
            />
          ) : (
            <Box>
              <Box w="100%" p={4}>
                <StatisticsBar />
              </Box>
              <Box w="100%" p={4}>
              <Box>
                  <StatisticsSection />
                </Box>
                <Flex p={4} justifyContent="space-between" flexWrap="wrap">
                  <UserActivities />
                  <ActiveAppointments/>
                </Flex>
                <Box p={4}>
                  <PatientsManagement />
                </Box>
                <Box p={4}>
                  <RecentMedicalReports />
                </Box>
                <Box p={4}>
                  <PendingCustomerAppointments />
                </Box>
                <Box p={4}>
                  <ActiveMedics />
                </Box>
              </Box>
            </Box>
          )}
        </VStack>
      </Box>
    </ChakraProvider>
  );
};

export default AdminDashboard;
