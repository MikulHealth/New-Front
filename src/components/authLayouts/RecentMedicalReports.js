import React, { useEffect, useState } from "react";
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
  VStack,
} from "@chakra-ui/react";
import axios from "axios";

import {
  formatDistanceToNow,
} from "date-fns";

const RecentMedicalReports = () => {
  const [medicalReportsData, setMedicalReportsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:8080/v1/api/admin/medical-reports")
      .then((response) => {
        if (response.data.success) {
          const sortedData = response.data.data.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          setMedicalReportsData(sortedData);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);
  
  return (
    <Box bg="#4B4B4B" borderRadius="10px" p={4} color="white" w="100%">
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <Text fontSize="lg" fontWeight="bold">
          Recent Medical Reports
        </Text>
        <Text fontSize="sm" color="#00C6F7" cursor="pointer">
          See All
        </Text>
      </Flex>
      {loading ? (
        <Flex justifyContent="center" alignItems="center" h="200px">
          <Spinner size="xl" />
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
                <Th color="#A210C6">Medic Full Name</Th>
                <Th color="#A210C6">Recipient Full Name</Th>
                <Th color="#A210C6">Service Plan</Th>
                <Th color="#A210C6">Timestamp</Th>
              </Tr>
            </Thead>
            <Tbody>
              {medicalReportsData.map((report) => (
                <Tr key={report.id}>
                  <Td>{report.medicFullName}</Td>
                  <Td>{report.recipientFullName}</Td>
                  <Td>{report.servicePlan}</Td>
                  <Td> {formatDistanceToNow(new Date(report.createdAt), {
                      addSuffix: true,
                    })}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}
    </Box>
  );
};

export default RecentMedicalReports;
