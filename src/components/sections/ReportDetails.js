import React from "react";
import {
  Flex,
  Text,
  Box,
  Image,
  VStack,
  Button,
} from "@chakra-ui/react";
import { DownloadIcon } from "@chakra-ui/icons";

const ReportDetails = ({
  selectedReport,
  setSelectedReport,
  openPasswordModal,
  handleViewRecommendations,
  isDownloading,
}) => {
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()}, ${date.toLocaleTimeString()}`;
  };

  const formatMedicationTime = (medication) => {
    const parts = medication.split(",");
    const timePart = parts.find((part) => part.startsWith("Time:"));
    const time = timePart ? new Date(timePart.replace("Time:", "")) : new Date(NaN);
    return `${parts[0]}, ${parts[1]}, ${parts[2]}, ${
      !isNaN(time.getTime()) ? `Time:${time.toLocaleString()}` : "Time:Invalid Date"
    }`;
  };

  return (
    <VStack mb="50px" spacing={4} align="start" w="100%">
      <Flex justifyContent="space-between" w="100%">
        <Button colorScheme="blue" onClick={() => setSelectedReport(null)}>
          Back
        </Button>
        <Button
          mb="10px"
          bg="green.500"
          color="white"
          leftIcon={<DownloadIcon />}
          onClick={openPasswordModal}
          isLoading={isDownloading}
          loadingText="Downloading..."
        >
          PDF
        </Button>
      </Flex>
      <Flex
        justifyContent="space-between"
        flexDirection={{ base: "column", md: "row" }}
        w="100%"
        fontFamily="body"
      >
        <Flex mb={{ base: 1, md: 0 }}>
          <Text fontWeight="bold">Beneficiary name:</Text>
          <Text ml={2}>{selectedReport.recipientFullName}</Text>
        </Flex>

        <Flex mb={{ base: 1, md: 0 }}>
          <Text ml={{ base: 0, md: "10px" }} fontWeight="bold">
            Service Plan:
          </Text>
          <Text ml="10px">{selectedReport.servicePlan}</Text>
        </Flex>
      </Flex>
      <Flex fontFamily="body">
        <Text fontWeight="bold">Report date and time:</Text>
        <Text ml="10px">{formatDateTime(selectedReport.createdAt)}</Text>
      </Flex>
      <Box fontFamily="body">
        <Text fontWeight="bold">Vital Signs:</Text>
        <Text>Temperature: {selectedReport.temperature}°C</Text>
        <Text>Blood Pressure: {selectedReport.bloodPressure}</Text>
        <Text>Pulse: {selectedReport.pulse} bpm</Text>
        <Text>Blood Sugar: {selectedReport.bloodSugar}</Text>
        <Text>SpO2: {selectedReport.sp02}%</Text>
        <Text>Respiration: {selectedReport.respiration} c/m</Text>
        <Flex mt="5px">
          <Text fontWeight="bold">Mood:</Text>
          <Text ml="5px">{selectedReport.mood}</Text>
        </Flex>
        <Flex>
          <Text fontWeight="bold">Emotional State: </Text>
          <Text ml="5px">{selectedReport.emotionalState}</Text>
        </Flex>
        <Flex>
          <Text fontWeight="bold">Physical State: </Text>
          <Text ml="5px">{selectedReport.physicalState}</Text>
        </Flex>
        <Flex>
          <Text fontWeight="bold">Pain Level: </Text>
          <Text ml="5px">{selectedReport.painLevel}</Text>
        </Flex>
        <Text mt="5px" fontWeight="bold">
          Medications:
        </Text>
        <VStack align="start" spacing={1}>
          {selectedReport.medications.map((medication, index) => (
            <Text key={index}>{formatMedicationTime(medication)}</Text>
          ))}
        </VStack>
        <Text mt="5px" fontWeight="bold" maxWidth="100%">
          Activities:
        </Text>
        <VStack align="start" spacing={1}>
          {selectedReport.activities.map((activity, index) => (
            <Text key={index}>{activity}</Text>
          ))}
        </VStack>
        <Text mt="5px" fontWeight="bold" maxWidth="100%">
          Comments/Observation:
        </Text>
        <Text maxWidth="100%">{selectedReport.comments}</Text>
        <Text mt="5px" fontWeight="bold" maxWidth="100%">
          Recommendations/Requests:
        </Text>
        <Text maxWidth="100%">{selectedReport.recommendations}</Text>
        <Flex mt="5px">
          <Text fontStyle="italic" fontWeight="bold">
            Submitted by:
          </Text>
          <Text ml="10px" fontStyle="italic">
            {selectedReport.medicFullName}
          </Text>
        </Flex>

        {selectedReport.picturePath && (
          <Image src={selectedReport.picturePath} alt="Medical Image" />
        )}
      </Box>
      <Button colorScheme="teal" onClick={handleViewRecommendations} w="100%">
        View Recommended Interventions
      </Button>
    </VStack>
  );
};

export default ReportDetails;