import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Flex,
  Text,
  VStack,
  HStack,
  Button,
  Input,
  Divider,
  IconButton,
  Spinner,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import { format } from "date-fns";

const today = new Date();

const UserActivities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/v1/api/log/activities/past-three-days"
        );
        setActivities(response.data);
      } catch (error) {
        console.error("Error fetching activities:", error);
      } finally {
        setLoading(false);
      }
    };

    setTimeout(() => {
      fetchActivities();
    }, 3000);
  }, []);

  return (
    <Box
      mt="15px"
      bg="#4B4B4B"
      borderRadius="10px"
      p={4}
      color="white"
      w="450px"
      maxH="626px"
    >
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <Text fontSize="lg" fontWeight="bold">
          {format(today, "MMMM yyyy")}
        </Text>
        <Input
          placeholder="Search by date"
          backgroundColor="white"
          color="black"
          borderRadius="15px"
          width="200px"
        />
      </Flex>
      <HStack spacing={4} mb={4}>
        <IconButton
          aria-label="Previous week"
          icon={<ArrowBackIcon />}
          bg="transparent"
          color="white"
        />
        {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day, index) => (
          <VStack key={index}>
            <Button
              borderRadius="10px"
              bg={index === 0 ? "#00C6F7" : "#4A4A4A"}
              color={index === 0 ? "white" : "#A0A0A0"}
              w="50px"
              h="50px"
            >
              {day}
            </Button>
            <Text color="white">{11 + index}</Text>
          </VStack>
        ))}
        <IconButton
          aria-label="Next week"
          icon={<ArrowForwardIcon />}
          bg="transparent"
          color="white"
        />
      </HStack>
      <Flex justifyContent="space-between" alignItems="center" mb={2}>
        <Text fontSize="md" fontWeight="bold">
          Recent User Activity
        </Text>
        <Text fontSize="sm" color="#00C6F7" cursor="pointer">
          See All
        </Text>
      </Flex>
      <Box className="activities" maxH="400px" w="100%" overflowY="auto">
        {loading ? (
          <Flex justifyContent="center" alignItems="center" height="100%">
            <Spinner size="xl" color="white" />
          </Flex>
        ) : (
          <Table variant="simple" colorScheme="whiteAlpha">
            <Thead>
              <Tr>
                <Th color="#A210C6">User ID</Th>
                <Th color="#A210C6">Action</Th>
                <Th color="#A210C6">Timestamp</Th>
              </Tr>
            </Thead>
            <Tbody>
              {activities.map((activity) => (
                <Tr key={activity.id}>
                  <Td>{activity.userId}</Td>
                  <Td>{activity.action}</Td>
                  <Td>{new Date(activity.timestamp).toLocaleString()}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Box>
      <Divider />
    </Box>
  );
};

export default UserActivities;
