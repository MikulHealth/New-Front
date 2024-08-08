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
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
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
    <Box maxH="626px" h="626px" overflowY="auto">
      <Box bg="#4B4B4B" borderRadius="10px" p={4} color="white" w="550px">
        <Flex justifyContent="space-between" alignItems="center" mb={4}>
          <Text fontSize="lg" fontWeight="bold">
            Active Appointments
          </Text>
        </Flex>
        {loading ? (
          <Flex justifyContent="center" alignItems="center" h="200px">
            <Spinner size="xl" />
          </Flex>
        ) : appointments.length > 0 ? (
            <Box maxH="626px" w="540px">
          <Table variant="simple" colorScheme="whiteAlpha">
            <Thead>
              <Tr>
                <Th color="#A210C6">Recipient Name</Th>
                <Th color="#A210C6">Medic Name</Th>
                <Th color="#A210C6">Actual Start Date</Th>
                <Th color="#A210C6">Actual End Date</Th>
              </Tr>
            </Thead>
            <Tbody>
              {appointments.map((appointment) => (
                <Tr key={appointment.id}>
                  <Td>
                    {appointment.recipientFirstname} {appointment.recipientLastname}
                  </Td>
                  <Td>{appointment.matchedMedic?.fullName || "N/A"}</Td>
                  <Td>{formatDate(appointment.actualStartDate)}</Td>
                  <Td>{formatDate(appointment.actualEndDate)}</Td>
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
