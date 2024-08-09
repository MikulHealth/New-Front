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
  VStack,
  Center,
  Avatar,
  Link,
} from "@chakra-ui/react";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { SearchIcon } from "@chakra-ui/icons";
import CustomerDetailsDrawer from "../sections/admin/CustomerDetailsDrawer";

const getInitials = (name) => {
  const names = name.split(" ");
  const initials = names.map((n) => n[0]).join("");
  return initials.toUpperCase();
};

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchEmail, setSearchEmail] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [hasSearched, setHasSearched] = useState(false); // New state to track if a search was made

  const fetchCustomers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/v1/api/admin/customers?page=0&size=50"
      );
      const data = response.data.data.map((item) => ({
        id: item.id,
        name: `${item.bioData.firstName} ${item.bioData.lastName}`,
        phoneNumber: item.bioData.phoneNumber,
        email: item.bioData.email,
        gender: item.bioData.gender,
        dob: new Date(item.bioData.dob).toLocaleDateString(),
        image: item.bioData.image,
        fullDetails: item, // Store the full customer details
      }));
      setCustomers(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching customers:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSearchOrClear = async () => {
    if (hasSearched) {
      setSearchEmail(""); // Clear the input field
      setHasSearched(false); // Reset search state
      fetchCustomers(); // Re-fetch all customers
    } else {
      if (searchEmail.trim() === "") return;

      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:8080/v1/api/admin/get-customer?email=${searchEmail}`
        );
        const data = response.data.data;
        const customer = {
          id: data.id,
          name: `${data.bioData.firstName} ${data.bioData.lastName}`,
          phoneNumber: data.bioData.phoneNumber,
          email: data.bioData.email,
          gender: data.bioData.gender,
          dob: new Date(data.bioData.dob).toLocaleDateString(),
          image: data.bioData.image,
          fullDetails: data, // Store the full customer details
        };
        setCustomers([customer]);
        setHasSearched(true); // Set search state to true
        setLoading(false);
      } catch (error) {
        console.error("Error searching customer:", error);
        setLoading(false);
      }
    }
  };

  const openDrawer = (customer) => {
    setSelectedCustomer(customer);
    setIsDrawerOpen(true);
  };

  return (
    <Box bg="#4B4B4B" borderRadius="10px" p={4} color="white" w="100%">
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <Text fontSize="lg" fontWeight="bold">
          Customer Management
        </Text>
        <Text textAlign="left" fontSize="sm" color="#00C6F7" cursor="pointer">
          See All
        </Text>
      </Flex>
      <Flex mb={4}>
        <InputGroup>
          <Input
            placeholder="Search customer by email"
            backgroundColor="#4B4B4B"
            color="white"
            borderRadius="10px"
            width="500px"
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
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
                <Th color="#A210C6">Avatar</Th>
                <Th color="#A210C6">Name</Th>
                <Th color="#A210C6">Phone Number</Th>
                <Th color="#A210C6">Email</Th>
                <Th color="#A210C6">Gender</Th>
                <Th color="#A210C6">Date of Birth</Th>
                <Th color="#A210C6">Details</Th>
              </Tr>
            </Thead>
            <Tbody>
              {customers.map((customer, index) => (
                <Tr key={index}>
                  <Td>
                    {customer.image ? (
                      <Avatar
                        borderRadius="full"
                        boxSize="40px"
                        src={customer.image}
                        alt={customer.name}
                      />
                    ) : (
                      <Center
                        borderRadius="full"
                        boxSize="40px"
                        bg="white"
                        color="black"
                        fontWeight="bold"
                      >
                        {getInitials(customer.name)}
                      </Center>
                    )}
                  </Td>
                  <Td>{customer.name}</Td>
                  <Td>{customer.phoneNumber}</Td>
                  <Td>{customer.email}</Td>
                  <Td>{customer.gender}</Td>
                  <Td>{customer.dob}</Td>
                  <Td>
                    <Link
                      color="#00C6F7"
                      onClick={() => openDrawer(customer.fullDetails)}
                    >
                      Details
                    </Link>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}
      {selectedCustomer && (
        <CustomerDetailsDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          customer={selectedCustomer}
        />
      )}
    </Box>
  );
};

export default CustomerManagement;
