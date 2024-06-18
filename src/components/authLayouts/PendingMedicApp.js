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
  useMediaQuery,
  useToast,
  Button,
} from "@chakra-ui/react";
import { WarningIcon } from "@chakra-ui/icons";
import EditPendingMediRequest from "../sections/EditPendingMedicRequest";

const PendingMedicAppTab = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const toast = useToast();
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
          "http://localhost:8080/v1/appointment/pending",
          // "https://backend-c1pz.onrender.com/v1/appointment/pending",
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
          // `http://localhost:8080/v1/appointment/cancel-request/${requestId}`,
          `https://backend-c1pz.onrender.com/v1/appointment/cancel-request/${requestId}`,
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
          position: "top-right"
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

  const handleEditAppointment = (id) => {
    setSelectedAppointment(id);
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
      <VStack ml={{ base: "50", md: "300px" }} spacing={4} align="stretch">
        <Text fontStyle="italic" fontSize={{ base: "12px", md: "16px" }}>
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
                <Flex mr="30px" mt={{ base: "30px", md: "50px" }}>
                  <Text
                    ml="-10px"
                    fontSize={{ base: "10px", md: "16px" }}
                    cursor="pointer"
                    fontStyle="italic"
                    color="#C21111B2"
                    onClick={() => handleCancelAppointment(appointment.id)}
                  >
                    Cancel
                  </Text>
                  <Text
                    ml="15px"
                    fontSize={{ base: "10px", md: "16px" }}
                    cursor="pointer"
                    fontStyle="italic"
                    color="#107AC6"
                    onClick={() => handleEditAppointment(appointment.id)}
                  >
                    Edit
                  </Text>
                </Flex>
              </Box>
            </Flex>
          </Flex>
        );
      })}

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
              Are you sure you want to cancel this request? <br></br>
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

export default PendingMedicAppTab;
