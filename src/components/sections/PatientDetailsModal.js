import React, { useState } from "react";
import {
  Box,
  Flex,
  Text,
  VStack,
  Avatar,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  extendTheme,
} from "@chakra-ui/react";
import { generateNursingCarePlan } from "./generateNursingCarePlan";

const customTheme = extendTheme({
  components: {
    Link: {
      baseStyle: {
        _focus: {
          boxShadow: "none",
        },
      },
    },
  },
  fonts: {
    body: "Montserrat, sans-serif",
    heading: "Gill Sans MT, sans-serif",
  },
});

const PatientDetailsModal = ({ patient, isOpen, onClose }) => {
  const [carePlan, setCarePlan] = useState([]);
  const [isViewingCarePlan, setIsViewingCarePlan] = useState(false);

  const handleViewCarePlan = () => {
    const plan = generateNursingCarePlan(patient.customerAppointment.specialNeeds);
    setCarePlan(plan);
    setIsViewingCarePlan(true);
   
  };

  const handleBackToDetails = () => {
    setIsViewingCarePlan(false);
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()}`;
  };

  return (
    <Modal  theme={customTheme} isOpen={isOpen} onClose={onClose} size={{ base: "sm", md: "2xl" }}>
      <ModalOverlay />
      <ModalContent borderRadius="20px" border="3px solid #A210C6">
        <ModalHeader fontFamily="heading" color="#A210C6" textAlign="center">
          {isViewingCarePlan ? "Recommended Care Plan" : "Patient Details"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {isViewingCarePlan ? (
            <Flex direction="column" align="center" justify="center" textAlign="center">
              <VStack fontFamily="body" textAlign="left" align="start" spacing={3} mt="2">
                {carePlan.map((item, index) => (
                  <Text key={index}>
                    <Text as="span" fontWeight="bold">
                      {index + 1}.
                    </Text>{" "}
                    <Text as="span" fontWeight="bold">
                      {item.category}:
                    </Text>{" "}
                    {item.plan}
                  </Text>
                ))}
              </VStack>
              <Button
                mt="4"
                color="white"
                bg="#A210C6"
                borderRadius="50px"
                onClick={handleBackToDetails}
                fontFamily="body"
              >
                Back to Patient Details
              </Button>
            </Flex>
          ) : (
            <Flex direction="column" align="center" justify="center" textAlign="center">
              <Avatar
                name={`${patient.customerAppointment.recipientFirstname} ${patient.customerAppointment.recipientLastname}`}
                src={patient.customerAppointment.picturePath}
                bg="gray.500"
                color="white"
                w={{ base: "100px", md: "100px" }}
                h={{ base: "100px", md: "100px" }}
                border="3px solid #057B1F"
              />
              <Box fontFamily="body" textAlign="left" w="full">
                <Flex wrap="wrap">
                  <Text fontWeight="bold" fontSize="lg" mt="2">
                    Name:
                  </Text>
                  <Text ml="5px" fontSize="lg" mt="2">
                    {patient.customerAppointment.recipientFirstname} {patient.customerAppointment.recipientLastname}
                  </Text>
                </Flex>
                <Flex wrap="wrap">
                  <Text fontWeight="bold" mt="2">
                    Location:
                  </Text>
                  <Text ml="5px" mt="2">
                    {patient.customerAppointment.currentLocation}
                  </Text>
                </Flex>
                <Flex wrap="wrap">
                  <Text fontWeight="bold" mt="2">
                    City/Town:
                  </Text>
                  <Text ml="5px" mt="2">
                    {patient.customerAppointment.recipientTown}
                  </Text>
                </Flex>
                <Flex wrap="wrap">
                  <Text fontWeight="bold" mt="2">
                    Phone number:
                  </Text>
                  <Text ml="5px" mt="2">
                    {patient.customerAppointment.recipientPhoneNumber}
                  </Text>
                </Flex>
                <Flex wrap="wrap">
                  <Text fontWeight="bold" mt="2">
                    Gender:
                  </Text>
                  <Text ml="5px" mt="2">
                    {patient.customerAppointment.recipientGender}
                  </Text>
                </Flex>
                <Flex wrap="wrap">
                  <Text fontWeight="bold" mt="2">
                    Date of Birth:
                  </Text>
                  <Text ml="5px" mt="2">
                    {formatDateTime(patient.customerAppointment.recipientDOB)}
                  </Text>
                </Flex>
                <Flex wrap="wrap">
                  <Text fontWeight="bold" mt="2">
                    Service Plan:
                  </Text>
                  <Text ml="5px" mt="2">
                    {patient.customerAppointment.servicePlan}
                  </Text>
                </Flex>
                <Flex wrap="wrap">
                  <Text fontWeight="bold" mt="2">
                    Shift:
                  </Text>
                  <Text ml="5px" mt="2">
                    {patient.customerAppointment.shift}
                  </Text>
                </Flex>
                <Flex wrap="wrap">
                  <Text fontWeight="bold" mt="2">
                    Amount Payable:
                  </Text>
                  <Text ml="5px" mt="2">
                    N {parseFloat(patient.customerAppointment.costOfService).toLocaleString()}
                  </Text>
                </Flex>
                <Flex wrap="wrap">
                  <Text fontWeight="bold" mt="2">
                    Medical history:
                  </Text>
                  <Text maxW={{ base: "50px", md: "450px" }} ml="5px" mt="2">
                    {patient.customerAppointment.recipientHealthHistory}
                  </Text>
                </Flex>
                <Flex wrap="wrap">
                  <Text fontWeight="bold" mt="2">
                    Special Needs:
                  </Text>
                  <Text marginLeft="10px" mt="2" color="black" maxW="600px" maxH="1000px">
                    {patient?.customerAppointment?.specialNeeds && patient?.customerAppointment?.specialNeeds.length > 0
                      ? patient.customerAppointment.specialNeeds.join(", ")
                      : "Not available"}
                  </Text>
                </Flex>
              </Box>

              <Button
                mb="20px"
                mt="4"
                color="white"
                bg="#A210C6"
                borderRadius="50px"
                onClick={handleViewCarePlan}
                fontFamily="body"
              >
                Recommended Care Plan
              </Button>
            </Flex>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default PatientDetailsModal;
