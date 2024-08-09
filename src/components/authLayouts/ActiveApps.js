import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Text,
  Spinner,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import axios from "axios";

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const ActiveAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/v1/api/admin/active-appointments"
        );
        setAppointments(response.data.data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <Box
      maxH="480px"
      h="500px"
      overflowY="auto"
      css={{
        "&::-webkit-scrollbar": { display: "none" },
        "-ms-overflow-style": "none" /* IE and Edge */,
        "scrollbar-width": "none" /* Firefox */,
      }}
    >
      <Box bg="#4B4B4B" borderRadius="10px" p={4} color="white" w="650px">
        <Flex justifyContent="space-between" alignItems="center" mb={4}>
          <Text fontSize="lg" fontWeight="bold">
            Active Appointments
          </Text>

          <Text textAlign="left" fontSize="sm" color="#00C6F7" cursor="pointer">
            See All
          </Text>
        </Flex>
        {loading ? (
          <Flex justifyContent="center" alignItems="center" h="200px">
            <Spinner size="xl" />
          </Flex>
        ) : appointments.length > 0 ? (
          <Box maxH="480px" w="650px">
            <Table variant="simple" colorScheme="whiteAlpha">
              <Thead
                css={{
                  position: "sticky",
                  top: 0,
                  background: "#4B4B4B",
                  zIndex: 1,
                }}
              >
                <Tr>
                  <Th color="#A210C6">Recipient Name</Th>
                  <Th color="#A210C6">Medic Name</Th>
                  <Th color="#A210C6">Start Date</Th>
                  <Th color="#A210C6">End Date</Th>
                  <Th color="#A210C6">Subscription</Th>
                </Tr>
              </Thead>
              <Tbody>
                {appointments.map((appointment) => (
                  <Tr key={appointment.id}>
                    <Td>
                      {appointment.recipientFirstname}{" "}
                      {appointment.recipientLastname}
                    </Td>
                    <Td>{appointment.matchedMedic?.fullName || "N/A"}</Td>
                    <Td>{formatDate(appointment.actualStartDate)}</Td>
                    <Td>{formatDate(appointment.actualEndDate)}</Td>
                    <Td>{appointment.isSubscription ? "Yes" : "No"}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        ) : (
          <Text>No active appointments at the moment</Text>
        )}
      </Box>
    </Box>
  );
};

export default ActiveAppointments;
