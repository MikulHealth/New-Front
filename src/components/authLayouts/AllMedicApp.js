import React, { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../../apiCalls/config";
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
  useToast,
  useMediaQuery,
  Button,
  // Divider,
} from "@chakra-ui/react";
import EditPendingMediRequest from "../sections/EditPendingMedicRequest";
import { WarningIcon } from "@chakra-ui/icons";

const AllMedicAppTab = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");
  const modalWidth = isLargerThan768 ? "400px" : "90vw";

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
  };

  const fetchAppointments = async () => {
    setLoading(true);
    if (localStorage.getItem("token")) {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${baseUrl}/appointment/all`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          setLoading(false);
          const sortedAppointments = response.data.data.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          setAppointments(sortedAppointments);
        } else {
          setLoading(false);
          console.error("Failed to fetch appointments:", response.data.message);
        }
      } catch (error) {
        setLoading(false);
        console.error("Error fetching appointments:", error);
      }
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleDetailsClick = (appointment) => {
    setSelectedAppointment(appointment);
    onOpen();
  };

  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [requestId, setCancellingAppointmentId] = useState(null);

  const handleCancelAppointment = (appointmentId) => {
    setCancellingAppointmentId(appointmentId);
    setConfirmationModalOpen(true);
  };

  const handleCancelModalClose = () => {
    setConfirmationModalOpen(false);
  };

  const handleConfirmation = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${baseUrl}/appointment/cancel-request/${requestId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast({
          description: response.data.message,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        fetchAppointments();
        setConfirmationModalOpen(false);
      } else {
        toast({
          description: "Failed to cancel request:",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        console.error("Error canceling appointment:", response.data.message);
      }
    } catch (error) {
      console.error("An error occurred while canceling request:", error);
      toast({
        description: "An error occurred while canceling request:",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setConfirmationModalOpen(false);
    }
  };

  const handleEditAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setEditModalOpen(true);
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
      <VStack
        fontSize={{ base: "12px", md: "16px" }}
        ml={{ base: "50", md: "200px" }}
        spacing={4}
        align="stretch"
      >
        <Text>
          You have no appointment yet. Would you like to request one?
        </Text>
      </VStack>
    );
  }

  return (
    <VStack  spacing={4} align="stretch">
      {appointments.map((appointment, index) => {
        let borderColor = "gray.200";
        if (appointment.active) {
          borderColor = "#ACE1C1";
        } else if (appointment.pending) {
          borderColor = "#F4DDA2";
        } else if (appointment.matched) {
          borderColor = "#F4DDA2";
        } else if (appointment.completed) {
          borderColor = "#A210C6";
        }

        return (
          <Flex
            key={index}
            p={2}
            borderRadius="lg"
            justify="space-between"
            align="center"
            
            border={`1px solid ${borderColor}`}
            w="full"
          >
            <Flex direction="column" flex="1">
              {appointment.pending || appointment.matched ? (
                <>
                  <Flex>
                    <Box>
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
                      <Flex mr="30px" mt={{ base: "30px", md: "50px" }}>
                        <Text
                          ml="-10px"
                          fontSize={{ base: "10px", md: "16px" }}
                          cursor="pointer"
                          fontStyle="italic"
                          color="#C21111B2"
                          onClick={() =>
                            handleCancelAppointment(appointment.id)
                          }
                        >
                          Cancel
                        </Text>
                        <Text
                          ml="15px"
                          fontSize={{ base: "10px", md: "16px" }}
                          cursor="pointer"
                          fontStyle="italic"
                          color="#107AC6"
                          onClick={() => handleEditAppointment(appointment)}
                        >
                          Edit
                        </Text>
                      </Flex>
                    </Box>
                  </Flex>
                </>
              ) : (
                <>
                  {appointment.customerAppointment && (
                    <>
                      <Flex>
                        <Text
                          fontWeight="bold"
                          fontSize={{ base: "10px", md: "16px" }}
                        >
                          Patient name:
                        </Text>
                        <Text ml="1" fontSize={{ base: "10px", md: "16px" }}>
                          {appointment.customerAppointment.recipientFirstname}{" "}
                          {appointment.customerAppointment.recipientLastname}
                        </Text>
                      </Flex>

                      <Flex>
                        <Text
                          fontWeight="bold"
                          fontSize={{ base: "10px", md: "16px" }}
                        >
                          Service plan:
                        </Text>
                        <Text ml="1" fontSize={{ base: "10px", md: "16px" }}>
                          {appointment.customerAppointment.servicePlan}
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
                          {appointment.customerAppointment.currentLocation}
                        </Text>
                      </Flex>
                    </>
                  )}
                </>
              )}
            </Flex>
            {appointment.active || appointment.completed ? (
              <Box ml={{ base: "50", md: "310px" }}>
                <Badge
                  mb="20px"
                  bg={
                    appointment.active
                      ? "#057B1FC6"
                      : appointment.completed
                      ? "#A210C6"
                      : "black"
                  }
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
            ) : null}
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
              {selectedAppointment.customerAppointment && (
                <Flex align="center" mb={4}>
                  <Avatar
                    name={`${selectedAppointment.customerAppointment.recipientFirstname} ${selectedAppointment.customerAppointment.recipientLastname}`}
                    src={selectedAppointment.customerAppointment.image}
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
                      <Text ml="1">
                        {
                          selectedAppointment.customerAppointment
                            .recipientFirstname
                        }{" "}
                        {
                          selectedAppointment.customerAppointment
                            .recipientLastname
                        }
                      </Text>
                    </Flex>
                    <Flex>
                      <Text fontWeight="bold" fontSize="md">
                        Location:
                      </Text>
                      <Text ml="5px" fontSize="md">
                        {
                          selectedAppointment.customerAppointment
                            .currentLocation
                        }
                      </Text>
                    </Flex>

                    <Flex>
                      <Text fontWeight="bold" fontSize="md">
                        Plan:
                      </Text>
                      <Text ml="5px" fontSize="md">
                        {selectedAppointment.customerAppointment.servicePlan}
                      </Text>
                    </Flex>
                    <Flex>
                      <Text fontWeight="bold" fontSize="md">
                        Shift:
                      </Text>
                      <Text ml="5px" fontSize="md">
                        {selectedAppointment.customerAppointment.shift}
                      </Text>
                    </Flex>
                    {/* <Flex>
                      <Text fontWeight="bold" fontSize="md">
                        Contact details:
                      </Text>
                      <Text ml="5px" fontSize="md">
                        {selectedAppointment.customerAppointment.customerPhoneNumber}
                      </Text>
                    </Flex> */}
                  </Box>
                </Flex>
              )}

              <Progress
                value={100}
                size="md"
                colorScheme="purple"
                hasStripe
                isAnimated
                mt={4}
                borderRadius="20px"
              />
              <Text fontSize="sm" color="gray.500" mt={2}>
                100% completed
              </Text>
            </ModalBody>
            <ModalFooter></ModalFooter>
          </ModalContent>
        </Modal>
      )}
      {confirmationModalOpen && (
        <Modal
          isOpen={confirmationModalOpen}
          onClose={handleCancelModalClose}
          size="md"
        >
          <ModalOverlay />
          <ModalContent width={modalWidth} borderRadius="25px 25px 25px 0px">
            <ModalHeader>
              {" "}
              <WarningIcon w={10} h={10} color="yellow.400" />
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              Are you sure you want to cancel this request? <br />
              This action is irreversible.
            </ModalBody>
            <ModalFooter>
              <Button
                bg="#A210C6"
                color="white"
                onClick={handleCancelModalClose}
              >
                No
              </Button>
              <Button
                bg="#E1ACAE"
                color="red.500"
                marginLeft="5px"
                onClick={handleConfirmation}
              >
                Yes
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
      <EditPendingMediRequest
        isOpen={editModalOpen}
        onClose={handleCloseEditModal}
        appointmentDetails={selectedAppointment}
      />
    </VStack>
  );
};

export default AllMedicAppTab;
