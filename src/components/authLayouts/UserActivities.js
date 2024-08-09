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
  InputLeftElement,
  InputGroup,
  Spinner,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import { SearchIcon, ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import {
  format,
  startOfWeek,
  addDays,
  isToday,
  formatDistanceToNow,
} from "date-fns";

const UserActivities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/v1/api/log/activities/past-three-days"
        );
        const sortedActivities = response.data.sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );
        setActivities(sortedActivities);
      } catch (error) {
        console.error("Error fetching activities:", error);
      } finally {
        setLoading(false);
      }
    };

    setTimeout(() => {
      fetchActivities();
    }, 3000);

    // Update current time every second
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Clear interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Week starts on Monday

  return (
    <Box
     
      bg="#4B4B4B"
      borderRadius="10px"
      p={4}
      color="white"
      w="350px"
      maxH="450px"
    >
      <Flex justifyContent="space-between">
        <Text textAlign="left" fontSize="lg" fontWeight="bold">
          Recent Activity Log
        </Text>

        <Text textAlign="left" fontSize="sm" color="#00C6F7" cursor="pointer">
          See All
        </Text>
      </Flex>

      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <InputGroup>
          <Input
            placeholder="Search by date"
            backgroundColor="#4B4B4B"
            color="white"
            borderRadius="10px"
            width="200px"
          />
          <InputLeftElement
            children={<SearchIcon color="white" />}
            pointerEvents="none"
          />
        </InputGroup>
        <Text fontSize="md" fontWeight="bold">
          {format(currentTime, "MMMM yyyy, hh:mm:ss a")}
        </Text>
      </Flex>
      {/* <HStack spacing={4} mb={4}>
        <IconButton
          aria-label="Previous week"
          icon={<ArrowBackIcon />}
          bg="transparent"
          color="white"
        />
        {Array.from({ length: 5 }).map((_, index) => {
          const day = addDays(weekStart, index);
          const isCurrentDay = isToday(day);
          return (
            <VStack key={index}>
              <Button
                borderRadius="10px"
                bg={isCurrentDay ? "#00C6F7" : "#4A4A4A"}
                color={isCurrentDay ? "white" : "#A0A0A0"}
                w="50px"
                h="50px"
              >
                {format(day, "EEE")}
              </Button>
              <Text color="white">{format(day, "dd")}</Text>
            </VStack>
          );
        })}
        <IconButton
          aria-label="Next week"
          icon={<ArrowForwardIcon />}
          bg="transparent"
          color="white"
        />
      </HStack> */}

      <Box
        className="activities"
        maxH="300px"
        w="100%"
        overflowY="auto"
        css={{
          "&::-webkit-scrollbar": { display: "none" },
          "-ms-overflow-style": "none" /* IE and Edge */,
          "scrollbar-width": "none" /* Firefox */,
        }}
      >
        {loading ? (
          <Flex justifyContent="center" alignItems="center" height="100%">
            <Spinner size="xl" color="white" />
          </Flex>
        ) : (
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
                <Th color="#A210C6">Name</Th>
                <Th color="#A210C6">Action</Th>
                <Th color="#A210C6">Timestamp</Th>
                <Th color="#A210C6">User ID</Th>
              </Tr>
            </Thead>
            <Tbody fontSize="12px" fontStyle="italic" fontWeight="bold">
              {activities.map((activity) => (
                <Tr key={activity.id}>
                  <Td>{activity.name}</Td>
                  <Td>{activity.action}</Td>
                  <Td>
                    {formatDistanceToNow(new Date(activity.timestamp), {
                      addSuffix: true,
                    })}
                  </Td>
                  <Td>{activity.userId}</Td>
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
