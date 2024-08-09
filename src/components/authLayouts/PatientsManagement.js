import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Text,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  InputGroup,
  InputLeftElement,
  Th,
  Td,
  Checkbox,
} from "@chakra-ui/react";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { SearchIcon } from "@chakra-ui/icons";
import PatientDetailsDrawer from "../sections/admin/PatientDetailsDrawer";

const PatientsManagement = () => {
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false); // New state to track if a search was made
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    fetchBeneficiaries();
  }, []);

  const fetchBeneficiaries = async () => {
    try {
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
          details: item, // Store the full patient details
          createdAt: new Date(item.createdAt),
        }))
        .sort((a, b) => b.createdAt - a.createdAt); // Sort by createdAt to display the most recent first
      setBeneficiaries(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching beneficiaries:", error);
      setLoading(false);
    }
  };

  const handleSearchOrClear = async () => {
    if (hasSearched) {
      setSearchQuery(""); // Clear the input field
      setHasSearched(false); // Reset search state
      fetchBeneficiaries(); // Re-fetch all beneficiaries
    } else {
      if (searchQuery.trim() === "") return;

      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:8080/v1/api/admin/searchBeneficiaryByPolicyNumber?policyNumber=${searchQuery}`
        );
        const data = response.data.data;
        const beneficiary = {
          id: data.policyNumber,
          name: `${data.recipientFirstName} ${data.recipientLastName}`,
          admit: new Date(data.createdAt).toLocaleDateString(),
          type: data.id,
          status: data.saved ? "Saved" : "Not Saved",
          statusColor: data.saved ? "green" : "red",
          details: data, // Store the full patient details
          createdAt: new Date(data.createdAt),
        };
        setBeneficiaries([beneficiary]);
        setHasSearched(true); // Set search state to true
        setLoading(false);
      } catch (error) {
        console.error("Error searching beneficiary:", error);
        setLoading(false);
      }
    }
  };

  const openDrawer = (patient) => {
    setSelectedPatient(patient);
    setIsDrawerOpen(true);
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

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
            placeholder="Search patients by name, policy number"
            backgroundColor="#4B4B4B"
            color="white"
            borderRadius="10px"
            width="500px"
            value={searchQuery}
            onChange={handleInputChange}
          />
          <InputLeftElement
            children={<SearchIcon color="white" />}
            pointerEvents="none"
          />
        </InputGroup>
        <Box ml={4}>
          <Text
            as="button"
            bg="#00C6F7"
            color="white"
            borderRadius="10px"
            p={2}
            onClick={handleSearchOrClear}
          >
            {hasSearched ? "Clear" : "Search"}
          </Text>
        </Box>
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
                  <Td
                    color="#00C6F7"
                    cursor="pointer"
                    onClick={() => openDrawer(beneficiary.details)}
                  >
                    Details
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}
      {selectedPatient && (
        <PatientDetailsDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          patient={selectedPatient}
        />
      )}
    </Box>
  );
};

export default PatientsManagement;
