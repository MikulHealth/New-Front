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
  Avatar,
} from "@chakra-ui/react";
import axios from "axios";

const ActiveMedics = () => {
  const [medicsData, setMedicsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMedics = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/v1/api/admin/pending-medic-appointments"
        );
        setMedicsData(response.data.data);
      } catch (error) {
        console.error("Error fetching medics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMedics();
  }, []);

  return (
    <Box bg="#4B4B4B" borderRadius="10px" p={4} color="white" w="100%">
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <Text fontSize="lg" fontWeight="bold">
          Available Medics
        </Text>
        <Text fontSize="sm" color="#00C6F7" cursor="pointer">
          See All
        </Text>
      </Flex>
      {loading ? (
        <Flex justifyContent="center" alignItems="center" h="200px">
          <Spinner size="xl" />
        </Flex>
      ) : medicsData.length > 0 ? (
        <Table variant="simple" colorScheme="whiteAlpha">
          <Thead>
            <Tr>
              <Th color="#A210C6">Avatar</Th>
              <Th color="#A210C6">Medic Full Name</Th>
              <Th color="#A210C6">Service Plan</Th>
              <Th color="#A210C6">Current Location</Th>
              <Th color="#A210C6">Status</Th>
            </Tr>
          </Thead>
          <Tbody>
            {medicsData.map((medic) => (
              <Tr key={medic.id}>
                <Td>
                  <Avatar
                    src={medic.image || "https://bit.ly/dan-abramov"}
                    size="md"
                  />
                </Td>
                <Td>{medic.medicFullName}</Td>
                <Td>{medic.servicePlan}</Td>
                <Td>{medic.currentLocation}</Td>
                <Td color="green">Pending</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      ) : (
        <Text>No available medics at the moment</Text>
      )}
    </Box>
  );
};

export default ActiveMedics;
