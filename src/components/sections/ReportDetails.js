import React, { useState } from "react";
import { Flex, Text, Box, Image, VStack, Button, Tooltip, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter } from "@chakra-ui/react";
import { DownloadIcon } from "@chakra-ui/icons";

const ReportDetails = ({
  selectedReport,
  setSelectedReport,
  openPasswordModal,
  handleViewRecommendations,
  isDownloading,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()}, ${date.toLocaleTimeString()}`;
  };

  const formatMedicationTime = (medication) => {
    const parts = medication.split(",");
    const timePart = parts.find((part) => part.startsWith("Time:"));
    const time = timePart
      ? new Date(timePart.replace("Time:", ""))
      : new Date(NaN);
    return `${parts[0]}, ${parts[1]}, ${parts[2]}, ${
      !isNaN(time.getTime())
        ? `Time:${time.toLocaleString()}`
        : "Time:Invalid Date"
    }`;
  };

  const handleImageClick = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <VStack mb="50px" spacing={4} align="start" w="100%">
        <Flex justifyContent="space-between" w="100%">
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
          <Flex>
            <Text fontWeight="bold">Pain Location: </Text>
            <Text ml="5px">{selectedReport.painLocation}</Text>
          </Flex>
          <Flex>
            <Text fontWeight="bold">Skin Integrity: </Text>
            <Text ml="5px">{selectedReport.skinIntegrity}</Text>
          </Flex>
          <Flex>
            <Text fontWeight="bold">Appetite: </Text>
            <Text ml="5px">{selectedReport.appetite}</Text>
          </Flex>
          <Flex>
            <Text fontWeight="bold">Fluid Intake: </Text>
            <Text ml="5px">{selectedReport.fluidIntake}</Text>
          </Flex>
          <Flex>
            <Text fontWeight="bold">Urinary Elimination: </Text>
            <Text ml="5px">{selectedReport.urinaryElimination}</Text>
          </Flex>
          <Flex>
            <Text fontWeight="bold">Bowel Elimination: </Text>
            <Text ml="5px">{selectedReport.bowelElimination}</Text>
          </Flex>
          <Flex>
            <Text fontWeight="bold">Sleep Quality: </Text>
            <Text ml="5px">{selectedReport.sleepQuality}</Text>
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
          <Text mt="5px" fontWeight="bold" maxWidth="100%">
            Picture report
          </Text>
          {selectedReport.image && (
            <Tooltip label="Enlarge" aria-label="A tooltip">
              <Image
                src={selectedReport.image}
                alt="Image"
                boxSize="150px"
                objectFit="cover"
                borderRadius="md"
                cursor="pointer"
                onClick={handleImageClick}
              />
            </Tooltip>
          )}
          <Flex mt="10px">
            <Text fontStyle="italic" fontWeight="bold">
              Submitted by:
            </Text>
            <Text ml="10px" fontStyle="italic">
              {selectedReport.medicFullName}
            </Text>
          </Flex>
        </Box>
        <Button color="white" bg="linear-gradient(80deg, #A210C6, teal)" onClick={handleViewRecommendations} w="100%">
          View Recommended Interventions
        </Button>
      </VStack>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader></ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Image
              src={selectedReport.image}
              alt="Enlarged Image"
              objectFit="contain"
              maxH="80vh"
              maxW="100%"
            />
          </ModalBody>
          <ModalFooter>
            {/* <Button colorScheme="blue" onClick={() => setIsModalOpen(false)}>
              Close
            </Button> */}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ReportDetails;
