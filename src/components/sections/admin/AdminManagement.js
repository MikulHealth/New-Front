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
import AdminDetailsDrawer from "./AdminDetailsDrawer"; // Import your AdminDetailsDrawer component

const getInitials = (name) => {
  const names = name.split(" ");
  const initials = names.map((n) => n[0]).join("");
  return initials.toUpperCase();
};

const AdminManagement = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchEmail, setSearchEmail] = useState("");
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const fetchAdmins = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/v1/api/admin/admin-user/all"
      );
      const data = response.data.data.map((item) => ({
        id: item.id,
        name: `${item.bioData.firstName} ${item.bioData.lastName}`,
        phoneNumber: item.bioData.phoneNumber,
        email: item.bioData.email,
        dob: item.bioData.dob ? new Date(item.bioData.dob).toLocaleDateString() : "N/A",
        createdDate: new Date(item.bioData.createdAt).toLocaleDateString(),
        updatedDate: item.bioData.updatedAt ? new Date(item.bioData.updatedAt).toLocaleDateString() : "N/A",
        role: item.bioData.roles.join(", "),
        image: item.bioData.image,
        fullDetails: item, // Store the full admin details
      }));
      setAdmins(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching admins:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  useEffect(() => {
    if (searchEmail.trim() === "") {
      fetchAdmins(); // Re-fetch initial admins if searchEmail is cleared
    }
  }, [searchEmail]);

  const handleSearch = async () => {
    if (searchEmail.trim() === "") return;

    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/v1/api/admin/admin-user/search?email=${searchEmail}`
      );
      const data = response.data.data;
      const admin = {
        id: data.id,
        name: `${data.bioData.firstName} ${data.bioData.lastName}`,
        phoneNumber: data.bioData.phoneNumber,
        email: data.bioData.email,
        dob: data.bioData.dob ? new Date(data.bioData.dob).toLocaleDateString() : "N/A",
        createdDate: new Date(data.bioData.createdAt).toLocaleDateString(),
        updatedDate: data.bioData.updatedAt ? new Date(data.bioData.updatedAt).toLocaleDateString() : "N/A",
        role: data.bioData.roles.join(", "),
        image: data.bioData.image,
        fullDetails: data, // Store the full admin details
      };
      setAdmins([admin]);
      setLoading(false);
    } catch (error) {
      console.error("Error searching admin:", error);
      setLoading(false);
    }
  };

  const openDrawer = (admin) => {
    setSelectedAdmin(admin);
    setIsDrawerOpen(true);
  };

  return (
    <Box bg="#4B4B4B" borderRadius="10px" p={4} color="white" w="100%">
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <Text fontSize="lg" fontWeight="bold">
          Admin Management
        </Text>
        <Text textAlign="left" fontSize="sm" color="#00C6F7" cursor="pointer">
          See All
        </Text>
      </Flex>
      <Flex mb={4}>
        <InputGroup>
          <Input
            placeholder="Search admin by email"
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
            onClick={handleSearch}
          >
            {searchEmail.trim() === "" ? "Search" : "Clear"}
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
                <Th color="#A210C6">Date of Birth</Th>
                <Th color="#A210C6">Role</Th>
                <Th color="#A210C6">Details</Th>
              </Tr>
            </Thead>
            <Tbody>
              {admins.map((admin, index) => (
                <Tr key={index}>
                  <Td>
                    {admin.image ? (
                      <Avatar
                        borderRadius="full"
                        boxSize="40px"
                        src={admin.image}
                        alt={admin.name}
                      />
                    ) : (
                      <Center
                        borderRadius="full"
                        boxSize="40px"
                        bg="white"
                        color="black"
                        fontWeight="bold"
                      >
                        {getInitials(admin.name)}
                      </Center>
                    )}
                  </Td>
                  <Td>{admin.name}</Td>
                  <Td>{admin.phoneNumber}</Td>
                  <Td>{admin.email}</Td>
                  <Td>{admin.dob}</Td>
                  <Td>{admin.role}</Td>
                  <Td>
                    <Link
                      color="#00C6F7"
                      onClick={() => openDrawer(admin.fullDetails)}
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
      {selectedAdmin && (
        <AdminDetailsDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          admin={selectedAdmin}
        />
      )}
    </Box>
  );
};

export default AdminManagement;
