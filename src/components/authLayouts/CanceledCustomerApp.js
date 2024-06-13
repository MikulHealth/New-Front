import React, { useState, useEffect } from "react";
import LoadingSpinner from "../../utils/Spiner";
// import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  VStack,
//   useMediaQuery,
  Box,
  Text,
  Flex,
  // extendTheme,
} from "@chakra-ui/react";

export default function CancelledApp() {
  const [pendingAppointments, setPendingAppointments] = useState([]);
  const [loading, setLoading] = useState(true);


//   const [isLargerThan768] = useMediaQuery("(min-width: 768px)");
//   const modalWidth = isLargerThan768 ? "400px" : "90vw";
 

  const fetchData = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };

      const response = await axios.get(
        // "http://localhost:8080/v1/appointment/canceledAppointments",
        "https://backend-c1pz.onrender.com/v1/appointment/canceledAppointments",
        config
      );

      if (response.data.success) {
        const sortedAppointments = response.data.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setPendingAppointments(sortedAppointments);
      } else {
        console.error("Failed to fetch appointments");
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Box
      className="canceled-appointment"
      overflow="scroll"
      w={{ base: "100%", md: "100%" }}
      h={{ base: "60vh", md: "60vh" }}
    >
      <VStack align="start" spacing={4}>
        {loading ? (
          <LoadingSpinner />
        ) : pendingAppointments.length === 0 ? (
          <Text
            w={{ base: "90vw", md: "60vw" }}
            ml={{ base: "-8px", md: "-20px" }}
            fontSize={{ base: "12px", md: "16px" }}
          >
            No cancelled appointments yet.
          </Text>
        ) : (
          <Box>
            <Flex
              mt="-10px"
              mb="50px"
              w={{ base: "90vw", md: "60vw" }}
              position="fixed"
              ml={{ base: "-8px", md: "-20px" }}
              bg="#D087E2"
              p={4}
              borderRadius="md"
              justifyContent="space-between"
              color="white"
              fontSize={{ base: "10px", md: "16px" }}
            >
              <Text fontWeight="bold">Name</Text>
              <Text fontWeight="bold">Type</Text>
              <Text fontWeight="bold">Plan</Text>
              <Text fontWeight="bold">Status</Text>
              <Text fontWeight="bold">Payment</Text>
            </Flex>
            <VStack
              mb={{ base: "150", md: "250" }}
              overflow="scroll"
              justifyContent="space-between"
              mt={{ base: 10, md: 16 }}
              align="start"
              spacing={4}
            >
              {pendingAppointments.map((appointment) => (
                <Box
                  style={{
                    cursor: "pointer",
                  }}
                  key={appointment.id}
                //   onClick={() => handleViewMore(appointment.id)}
                  w={{ base: "85vw", md: "57vw" }}
                  p={4}
                  borderBottom="1px solid #e2e8f0"
                  ml={{ base: "10px" }}
                >
                  <Flex
                    fontSize={{ base: "10px", md: "14px" }}
                    textAlign="left"
                    ml={{ base: "-15px", md: "-16px" }}
                    justifyContent="space-between"
                  >
                    <Text
                      maxW={{ base: "80px", md: "100px" }}
                      wordWrap="break-word"
                    >
                      {`${appointment.appointment.recipientFirstname} ${appointment.appointment.recipientLastname}`}
                    </Text>
                    <Text
                      maxW={{ base: "50px", md: "120px" }}
                    >{`${appointment.appointment.shift} `}</Text>
                    <Text
                      maxW={{ base: "60px", md: "120px" }}
                      wordWrap="break-word"
                    >{`${appointment.appointment.servicePlan} `}</Text>
                    <Box
                      w={{ base: "50px", md: "97px" }}
                      h={{ base: "25px", md: "33px" }}
                      textAlign="center"
                      borderRadius="10px"
                      p="5px"
                      bg={
                        appointment.appointment.appointmentPending
                          ? "#F4DDA2"
                          : "#F4DDA2"
                      }
                    >
                      <Text
                        fontSize={{ base: "10px", md: "14px" }}
                        color={
                          appointment.appointment?.appointmentPending
                            ? "#B48B25"
                            : "#B48B25"
                        }
                      >
                        {appointment.appointment?.appointmentPending
                          ? "Pending"
                          : "Paired"}
                      </Text>
                    </Box>
                    <Box
                      w={{ base: "50px", md: "97px" }}
                      h={{ base: "25px", md: "33px" }}
                      borderRadius="10px"
                      p="5px"
                      // bg={appointment.appointment?.paid ? "#ACE1C1" : "red.200"}
                    >
                      <Text
                        fontSize={{ base: "10px", md: "14px" }}
                        fontWeight="bold"
                        textAlign="center"
                        color={
                          appointment.appointment?.paid
                            ? "#057B1F"
                            : "black.500"
                        }
                      >
                        {appointment?.appointment.paid ? "Paid" : "Unpaid"}
                      </Text>
                    </Box>
                  </Flex>
                </Box>
              ))}
            </VStack>
          </Box>
        )}
      </VStack> 
    </Box>
  );
}
