import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Text,
  VStack,
  Flex,
  Spinner,
  Modal,
  Avatar,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Progress,
  useDisclosure,
  Badge,
} from "@chakra-ui/react";

const ActiveMedicAppTab = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      if (localStorage.getItem("token")) {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get(
            // "http://localhost:8080/v1/appointment/active",
            "https://backend-c1pz.onrender.com/v1/appointment/active",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.data.success) {
            setLoading(false);
            setAppointments(response.data.data);
          } else {
            setLoading(false);
            console.error(
              "Failed to fetch appointments:",
              response.data.message
            );
          }
        } catch (error) {
          setLoading(false);
          console.error("Error fetching appointments:", error);
        }
      }
    };

    fetchAppointments();
  }, []);

  const handleDetailsClick = (appointment) => {
    setSelectedAppointment(appointment);
    onOpen();
  };

  if (loading) {
    return (
      <Flex justifyContent="center" alignItems="center" height="100%">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (appointments.length === 0) {
    return (
      <VStack spacing={4} align="stretch">
        <Text fontSize={{ base: "12px", md: "16px" }}>
          You have no active appointments yet.
        </Text>
      </VStack>
    );
  }

  return (
    <VStack spacing={4} align="stretch">
      {appointments.map((appointment, index) => {
        return (
          <Flex
            key={index}
            p={2}
            borderRadius="lg"
            justify="space-between"
            align="center"
            border="1px solid #ACE1C1"
            w="full"
          >
            <Flex>
              <Box textAlign="left">
                <Flex>
                  <Text
                    fontSize={{ base: "10px", md: "16px" }}
                    fontWeight="bold"
                  >
                    Patient name:
                  </Text>
                  <Text ml="1" fontSize={{ base: "10px", md: "16px" }}>
                    {appointment.appointment.recipientFirstname}{" "}
                    {appointment.appointment.recipientLastname}
                  </Text>
                </Flex>
                <Flex>
                  <Text
                    fontWeight="bold"
                    fontSize={{ base: "10px", md: "16px" }}
                  >
                    Appointment type:
                  </Text>
                  <Text ml="1" fontSize={{ base: "10px", md: "16px" }}>
                    {appointment.appointment.medicSpecialization}
                  </Text>
                </Flex>

                <Flex>
                  <Text
                    fontWeight="bold"
                    fontSize={{ base: "10px", md: "16px" }}
                  >
                    Location:
                  </Text>
                  <Text ml="1" fontSize={{ base: "10px", md: "16px" }}>
                    {appointment.appointment.currentLocation}
                  </Text>
                </Flex>
              </Box>
              <Box ml={{ base: "50", md: "300px" }}>
                <Badge
                  mb="20px"
                  bg="#057B1FC6"
                  p={2}
                  borderRadius="5px"
                  color="white"
                  fontSize={{ base: "10px", md: "12px" }}
                >
                  Policy No.
                </Badge>
                <Text
                  fontSize={{ base: "10px", md: "16px" }}
                  cursor="pointer"
                  fontStyle="italic"
                  color="#107AC6"
                  onClick={() => handleDetailsClick(appointment)}
                >
                  Details
                </Text>
              </Box>
            </Flex>
          </Flex>
        );
      })}

      {selectedAppointment && (
        <Modal
          isOpen={isOpen}
          onClose={onClose}
          size={{ base: "sm", md: "md" }}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader color="#A210C6">Appointment details</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Flex align="center" mb={4}>
                <Avatar
                  name={`${selectedAppointment.appointment.recipientFirstname} ${selectedAppointment.appointment.recipientLastname}`}
                  src={selectedAppointment.appointment.image}
                  bg="gray.500"
                  color="white"
                  w={{ base: "100px", md: "100px" }}
                  h={{ base: "100px", md: "100px" }}
                  border="3px solid #057B1F"
                  mt="-60px"
                />
                <Box ml="20px">
                  <Flex>
                    <Text fontWeight="bold">Name</Text>
                    <Text ml="5px" fontSize="md">
                      {selectedAppointment.appointment.recipientFirstname}{" "}
                      {selectedAppointment.appointment.recipientLastname}
                    </Text>
                  </Flex>
                  <Flex>
                    <Text fontWeight="bold" fontSize="md">
                      Location:
                    </Text>
                    <Text ml="5px" fontSize="md">
                      {selectedAppointment.appointment.currentLocation}
                    </Text>
                  </Flex>

                  <Flex>
                    <Text fontWeight="bold" fontSize="md">
                      Plan:
                    </Text>
                    <Text ml="5px" fontSize="md">
                      {selectedAppointment.appointment.servicePlan}
                    </Text>
                  </Flex>
                  <Flex>
                    <Text fontWeight="bold" fontSize="md">
                      Shift:
                    </Text>
                    <Text ml="5px" fontSize="md">
                      {selectedAppointment.appointment.shift}
                    </Text>
                  </Flex>
                  <Flex>
                    <Text fontWeight="bold" fontSize="md">
                      Contact details:
                    </Text>
                    <Text ml="5px" fontSize="md">
                      {selectedAppointment.appointment.customerPhoneNumber}
                    </Text>
                  </Flex>
                </Box>
              </Flex>

              <Progress
                value={33}
                size="md"
                colorScheme="purple"
                hasStripe
                isAnimated
                mt={4}
                borderRadius="20px"
              />
              <Text fontSize="sm" color="gray.500" mt={2}>
                33% completed
              </Text>
            </ModalBody>
            <ModalFooter></ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </VStack>
  );
};

export default ActiveMedicAppTab;
