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
import MedicDetailsDrawer from "./MedicDetailsDrawer ";

const getInitials = (name) => {
  const names = name.split(" ");
  const initials = names.map((n) => n[0]).join("");
  return initials.toUpperCase();
};

const VerifiedMedics = () => {
  const [medics, setMedics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchEmail, setSearchEmail] = useState("");
  const [selectedMedic, setSelectedMedic] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const fetchMedics = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/v1/api/admin/medics/verified"
      );
      const data = response.data.data.content.map((item) => ({
        id: item.id,
        name: `${item.bioData.firstName} ${item.bioData.lastName}`,
        phoneNumber: item.bioData.phoneNumber,
        email: item.bioData.email,
        gender: item.bioData.gender,
        medicType: item.medicType,
        image: item.bioData.image,
        fullDetails: item, // Store the full medic details
      }));
      setMedics(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching medics:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedics();
  }, []);

  useEffect(() => {
    if (searchEmail.trim() === "") {
      fetchMedics(); // Re-fetch initial medics if searchEmail is cleared
    }
  }, [searchEmail]);

  const handleSearch = async () => {
    if (searchEmail.trim() === "") return;

    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/v1/api/admin/medics/search?email=${searchEmail}`
      );
      const data = response.data.data;
      const medic = {
        id: data.id,
        name: `${data.bioData.firstName} ${data.bioData.lastName}`,
        phoneNumber: data.bioData.phoneNumber,
        email: data.bioData.email,
        gender: data.bioData.gender,
        medicType: data.medicType,
        image: data.bioData.image,
        fullDetails: data, // Store the full medic details
      };
      setMedics([medic]);
      setLoading(false);
    } catch (error) {
      console.error("Error searching medic:", error);
      setLoading(false);
    }
  };

  const openDrawer = (medic) => {
    setSelectedMedic(medic);
    setIsDrawerOpen(true);
  };

  return (
    <Box bg="#4B4B4B" borderRadius="10px" p={4} color="white" w="100%">
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <Text fontSize="lg" fontWeight="bold">
          Verified Medics
        </Text>
        <Text textAlign="left" fontSize="sm" color="#00C6F7" cursor="pointer">
          See All
        </Text>
      </Flex>
      <Flex mb={4}>
        <InputGroup>
          <Input
            placeholder="Search medic by email"
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
                <Th color="#A210C6">Gender</Th>
                <Th color="#A210C6">Medic Type</Th>
                <Th color="#A210C6">Details</Th>
              </Tr>
            </Thead>
            <Tbody>
              {medics.map((medic, index) => (
                <Tr key={index}>
                  <Td>
                    {medic.image ? (
                      <Avatar
                        borderRadius="full"
                        boxSize="40px"
                        src={medic.image}
                        alt={medic.name}
                      />
                    ) : (
                      <Center
                        borderRadius="full"
                        boxSize="40px"
                        bg="white"
                        color="black"
                        fontWeight="bold"
                      >
                        {getInitials(medic.name)}
                      </Center>
                    )}
                  </Td>
                  <Td>{medic.name}</Td>
                  <Td>{medic.phoneNumber}</Td>
                  <Td>{medic.email}</Td>
                  <Td>{medic.gender}</Td>
                  <Td>{medic.medicType}</Td>
                  <Td>
                    <Link
                      color="#00C6F7"
                      onClick={() => openDrawer(medic.fullDetails)}
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
      {selectedMedic && (
       <MedicDetailsDrawer
       isOpen={isDrawerOpen}
       onClose={() => setIsDrawerOpen(false)}
       medic={selectedMedic}/>
      )}
    </Box>
  );
};

export default VerifiedMedics;
