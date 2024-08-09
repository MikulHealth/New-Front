import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Text,
  Input,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  InputGroup,
  InputLeftElement,
  Th,
  Td,
  Checkbox,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { SearchIcon } from "@chakra-ui/icons";

const PatientsManagement = () => {
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBeneficiaries = async () => {
      try {
        // Simulate a delay to show the spinner
        setTimeout(async () => {
          const response = await axios.get(
            "http://localhost:8080/v1/api/admin/beneficiaries"
          );
          const data = response.data.data
            .map((item) => ({
              id: item.policyNumber,
              name: `${item.recipientFirstName} ${item.recipientLastName}`,
              admit: new Date(item.createdAt).toLocaleDateString(),
              type: item.id,
              status: item.saved ? "Saved" : "Not Saved",
              statusColor: item.saved ? "green" : "red",
              details: "Details",
              createdAt: new Date(item.createdAt),
            }))
            .sort((a, b) => b.createdAt - a.createdAt); // Sort by createdAt to display the most recent first
          setBeneficiaries(data);
          setLoading(false);
        }, 3000);
      } catch (error) {
        console.error("Error fetching beneficiaries:", error);
        setLoading(false);
      }
    };

    fetchBeneficiaries();
  }, []);

  return (
    <Box bg="#4B4B4B" borderRadius="10px" p={4} color="white" w="100%">
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <Text fontSize="lg" fontWeight="bold">
          Patients Management
        </Text>
        <Text textAlign="left" fontSize="sm" color="#00C6F7" cursor="pointer">
          See All
        </Text>
      </Flex>
      <Flex mb={4}>
        <InputGroup>
          <Input
            placeholder="search patients name, policy number"
            backgroundColor="#4B4B4B"
            color="white"
            borderRadius="10px"
            width="500px"
          />
          <InputLeftElement
            children={<SearchIcon color="white" />}
            pointerEvents="none"
          />
        </InputGroup>
        {/* <Button bg="#4B4B4B" color="white" borderRadius="15px">
          Advance Filter
        </Button> */}
      </Flex>
      {loading ? (
        <Flex justifyContent="center" alignItems="center" h="200px">
          <ClipLoader color="#00C6F7" />
        </Flex>
      ) : (
        <Box maxH="400px" overflowY="auto">
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
                <Th color="#A210C6">
                  <Checkbox colorScheme="blue" />
                </Th>
                <Th color="#A210C6">MH Policy Number</Th>
                <Th color="#A210C6">Name</Th>
                <Th color="#A210C6">Created on</Th>
                <Th color="#A210C6">Appointment ID</Th>
                <Th color="#A210C6">Status</Th>
                <Th color="#A210C6">Details</Th>
              </Tr>
            </Thead>
            <Tbody>
              {beneficiaries.map((beneficiary, index) => (
                <Tr key={index}>
                  <Td>
                    <Checkbox colorScheme="blue" />
                  </Td>
                  <Td>{beneficiary.id}</Td>
                  <Td>{beneficiary.name}</Td>
                  <Td>{beneficiary.admit}</Td>
                  <Td>{beneficiary.type}</Td>
                  <Td color={beneficiary.statusColor}>{beneficiary.status}</Td>
                  <Td color="#00C6F7" cursor="pointer">
                    {beneficiary.details}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}
    </Box>
  );
};

export default PatientsManagement;
