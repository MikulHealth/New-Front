import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Text, VStack, Flex, Spinner, Badge } from "@chakra-ui/react";

const CompletedMedicAppTab = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      if (localStorage.getItem("token")) {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get(
            // "http://localhost:8080/v1/appointment/completed",
            "https://backend-c1pz.onrender.com/v1/appointment/completed",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.data.success) {
            setLoading(false);
            const sortedAppointments = response.data.data.sort(
              (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );
            setAppointments(sortedAppointments);
            // setAppointments(response.data.data);
          } else {
            setLoading(false);
            console.error(
              "Failed to fetch appointments:",
              response.data.message
            );
          }
        } catch (error) {
          setLoading(false);
          console.error("Error fetching appointments:", error);
        }
      }
    };

    fetchAppointments();
  }, []);

  if (loading) {
    return (
      <Flex justifyContent="center" alignItems="center" height="100%">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (appointments.length === 0) {
    return (
      <VStack ml={{ base: "50", md: "300px" }} spacing={4} align="stretch">
        <Text fontStyle="italic" fontSize={{ base: "12px", md: "16px" }}>
          You have no completed appointment.
        </Text>
      </VStack>
    );
  }

  return (
    <VStack spacing={4} align="stretch">
      {appointments.map((appointment, index) => {
        return (
          <Flex
            key={index}
            p={2}
            borderRadius="lg"
            justify="space-between"
            align="center"
            border="1px solid #A210C6"
            w="full"
          >
            <Flex>
              <Box textAlign="left">
                <Flex>
                  <Text
                    fontSize={{ base: "10px", md: "16px" }}
                    fontWeight="bold"
                  >
                    Patient name:
                  </Text>
                  <Text ml="1" fontSize={{ base: "10px", md: "16px" }}>
                    {appointment.customerAppointment.recipientFirstname}{" "}
                    {appointment.customerAppointment.recipientLastname}
                  </Text>
                </Flex>
                <Flex>
                  <Text
                    fontWeight="bold"
                    fontSize={{ base: "10px", md: "16px" }}
                  >
                    Appointment type:
                  </Text>
                  <Text ml="1" fontSize={{ base: "10px", md: "16px" }}>
                    {appointment.customerAppointment.medicSpecialization}
                  </Text>
                </Flex>

                <Flex>
                  <Text
                    fontWeight="bold"
                    fontSize={{ base: "10px", md: "16px" }}
                  >
                    Location:
                  </Text>
                  <Text ml="1" fontSize={{ base: "10px", md: "16px" }}>
                    {appointment.customerAppointment.currentLocation}
                  </Text>
                </Flex>
              </Box>
              <Box ml={{ base: "50", md: "250px" }}>
                <Badge
                  mb="20px"
                  bg="#A210C6"
                  p={2}
                  borderRadius="5px"
                  color="white"
                  fontSize={{ base: "10px", md: "12px" }}
                >
                  Policy No.
                </Badge>
              </Box>
            </Flex>
          </Flex>
        );
      })}
    </VStack>
  );
};

export default CompletedMedicAppTab;
