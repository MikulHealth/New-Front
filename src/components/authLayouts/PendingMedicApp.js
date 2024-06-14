import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Text,
  VStack,
  Flex,
  Spinner,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";

const PendingMedicAppTab = () => {
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
            // "http://localhost:8080/v1/appointment/pending",
            "https://backend-c1pz.onrender.com/v1/appointment/pending",
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
      <VStack  ml={{ base: "50", md: "300px" }} spacing={4} align="stretch">
        <Text fontStyle="italic"  fontSize={{ base: "12px", md: "16px" }}>
          You have no pending appointment.
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
            border="1px solid #F4DDA2"
            w="full"
          >
            <Flex>
              <Box textAlign="left">
              
                <Flex>
                  <Text
                    fontWeight="bold"
                    fontSize={{ base: "10px", md: "16px" }}
                  >
                   Preferred service plan:
                  </Text>
                  <Text ml="1" fontSize={{ base: "10px", md: "16px" }}>
                    {appointment.appointmentType}
                  </Text>
                </Flex>
                <Flex>
                  <Text
                    fontWeight="bold"
                    fontSize={{ base: "10px", md: "16px" }}
                  >
                   Preferred shift:
                  </Text>
                  <Text ml="1" fontSize={{ base: "10px", md: "16px" }}>
                    {appointment.shift}
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
                    {appointment.currentLocation}
                  </Text>
                </Flex>
              </Box>
              <Box ml={{ base: "50", md: "280px" }}>
                {/* <Badge
                  mb="20px"
                  bg="white"
                  p={2}
                  borderRadius="5px"
                  color="white"
                  fontSize={{ base: "10px", md: "12px" }}
                ></Badge> */}
                <Flex  mr="30px" mt={{base: "30px", md: "50px"}}>
                  <Text
                    ml="-10px"
                    fontSize={{ base: "10px", md: "16px" }}
                    cursor="pointer"
                    fontStyle="italic"
                    color="#C21111B2"
                    onClick={() => handleDetailsClick(appointment)}
                  >
                    Cancel
                  </Text>
                  <Text
                    ml="15px"
                    fontSize={{ base: "10px", md: "16px" }}
                    cursor="pointer"
                    fontStyle="italic"
                    color="#107AC6"
                    onClick={() => handleDetailsClick(appointment)}
                   
                  >
                    Edit
                  </Text>
                 
                </Flex>
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
            <ModalHeader color="#A210C6">Edit Request</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {/* <Flex align="center" mb={4}>
                <Avatar
                  name={`${selectedAppointment.recipientFirstname} ${selectedAppointment.recipientLastname}`}
                  src={selectedAppointment.image}
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
              </Text> */}
            </ModalBody>
            <ModalFooter></ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </VStack>
  );
};

export default PendingMedicAppTab;
