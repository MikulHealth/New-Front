import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Text,
  VStack,
  Spinner,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import axios from "axios";

const PendingCustomerAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/v1/api/admin/pending-customer-appointments"
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
    <Box maxH="400px" overflowY="auto">
      <Box bg="#4B4B4B" borderRadius="10px" p={4} color="white" w="100%">
        <Flex justifyContent="space-between" alignItems="center" mb={4}>
          <Text fontSize="lg" fontWeight="bold">
            Pending Customer Appointments
          </Text>
        </Flex>
        {loading ? (
          <Flex justifyContent="center" alignItems="center" h="200px">
            <Spinner size="xl" />
          </Flex>
        ) : appointments.length > 0 ? (
          <Table variant="simple" colorScheme="whiteAlpha">
            <Thead>
              <Tr>
                <Th color="#A210C6">Recipient Name</Th>
                <Th color="#A210C6">Service Plan</Th>
                <Th color="#A210C6">Start Date</Th>
                <Th color="#A210C6">Current Location</Th>
                <Th color="#A210C6">Payment Status</Th>
              </Tr>
            </Thead>
            <Tbody>
              {appointments.map((appointment) => (
                <Tr key={appointment.id}>
                  <Td>
                    {appointment.customerAppointment.recipientFirstname}{" "}
                    {appointment.customerAppointment.recipientLastname}
                  </Td>
                  <Td>{appointment.customerAppointment.servicePlan}</Td>
                  <Td>{appointment.customerAppointment.startDate}</Td>
                  <Td>{appointment.customerAppointment.currentLocation}</Td>
                  <Td>
                    {appointment.customerAppointment.paid ? "Paid" : "Not Paid"}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        ) : (
          <Text>No available customer appointments at the moment</Text>
        )}
      </Box>
    </Box>
  );
};

export default PendingCustomerAppointments;
