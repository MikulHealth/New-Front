import React, { useState } from "react";
import axios from "axios";
// import { useNavigate } from "react-router-dom";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Text,
  Box,
  useToast,
  Progress,
  Button,
  Flex,
  Divider,
  extendTheme,
} from "@chakra-ui/react";

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

const MatchedAppointmentsModal = ({
  isOpen,
  onClose,
  matchedAppointments,
  apiMessage,
}) => {
  const toast = useToast();
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [cancellingAppointmentId, setCancellingAppointmentId] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  // const navigate = useNavigate();
  // const { user } = useSelector((state) => state.userReducer);
  const noMatchedCaregiver =
    !matchedAppointments ||
    !Array.isArray(matchedAppointments) ||
    matchedAppointments.length === 0;

  console.log("Response from Matched modal", apiMessage);

  const handleViewMore = async (id) => {
    await fetchAndDisplayAppointmentDetails(id);
    console.log(`View more details for appointment with ID: ${id}`);
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = new Date(dateString).toLocaleDateString(
      undefined,
      options
    );
    return formattedDate;
  };

  const formatDateTime = (dateTimeString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    };
    const formattedDateTime = new Date(dateTimeString).toLocaleDateString(
      undefined,
      options
    );
    return formattedDateTime;
  };

  const handleConfirmation = async () => {
    try {
      const token = localStorage.getItem("token");
      const apiUrl = `http://localhost:8080/v1/appointment/cancelAppointment/${cancellingAppointmentId}`;

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.post(apiUrl, {}, { headers });

      if (response.data.success) {
        toast({
          title: response.data.message,
          status: "success",
          duration: 6000,
        });
      } else {
        toast({
          title: "Error canceling appointment",
          description: response.data.message,
          status: "error",
          duration: 6000,
        });
        console.error("Error canceling appointment");
      }
    } catch (error) {
      console.error("An error occurred while canceling appointment:", error);
    } finally {
      setConfirmationModalOpen(false);
    }
  };

  const fetchAndDisplayAppointmentDetails = async (appointmentId) => {
    try {
      const token = localStorage.getItem("token");
      const apiUrl = `http://localhost:8080/v1/appointment/findMatchedAppointmentDetails/${appointmentId}`;

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.get(apiUrl, { headers });

      if (response && response.data && response.data.success) {
        console.log("Appointment details:", response.data.data);
        setSelectedAppointment(response.data.data.data);
        setDetailsModalOpen(true);
      } else {
        console.error("Error fetching appointment details");
      }
    } catch (error) {
      console.error(
        "An error occurred while fetching appointment details:",
        error
      );
    }
  };

  const handleCancelAppointment = (appointmentId) => {
    setCancellingAppointmentId(appointmentId);
    setConfirmationModalOpen(true);
  };


  return (
    <>
      <Modal theme={customTheme} isOpen={isOpen} onClose={onClose} size="3xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontStyle="header">Appointment Status</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {!noMatchedCaregiver &&
              matchedAppointments.map((appointment) => (
                <Box key={appointment.id}>
                  <Flex marginTop="5px">
                    <Text fontWeight="bold" color="black">
                      Care beneficiary:
                    </Text>
                    <Text marginLeft="5px" color="black">
                      {`${appointment.appointment.recipientFirstname} ${appointment.appointment.recipientLastname}`}
                    </Text>
                  </Flex>
                  <Flex marginTop="5px">
                    <Text fontWeight="bold" color="black">
                      Caregiver name:
                    </Text>
                    <Text marginLeft="5px" color="black"></Text>
                  </Flex>
                  <Flex marginTop="5px">
                    <Text fontWeight="bold" color="black">
                      Caregiver type:
                    </Text>
                    <Text marginLeft="5px" color="black">
                      {appointment.appointment.medicSpecialization}
                    </Text>
                  </Flex>
                  <Flex marginTop="5px" marginLeft="1px">
                    <Text fontWeight="bold" color="black">
                      Booked on:
                    </Text>
                    <Text marginLeft="5px" color="black">
                      {formatDateTime(appointment.appointment.createdAt)}
                    </Text>
                    <Text
                      marginLeft="40px"
                      fontSize="16px"
                      onClick={() => handleViewMore(appointment.id)}
                      style={{
                        color: "#A210C6",
                        fontStyle: "italic",
                        cursor: "pointer",
                      }}
                      _hover={{ color: "#A210C6" }}
                    >
                      Details of caregiver
                    </Text>
                    <Text
                      marginLeft="40px"
                      fontSize="16px"
                      onClick={() => handleCancelAppointment(appointment.id)}
                      style={{
                        color: "red",
                        fontStyle: "italic",
                        cursor: "pointer",
                      }}
                      _hover={{ color: "#A210C6" }}
                    >
                      Cancel appointment
                    </Text>
                  </Flex>

                  <Divider my={4} borderColor="gray.500" />
                </Box>
              ))}
          </ModalBody>
        </ModalContent>
      </Modal>

      {detailsModalOpen && selectedAppointment && (
        <Modal
          isOpen={detailsModalOpen}
          onClose={() => setDetailsModalOpen(false)}
          size="3xl"
        >
          <ModalOverlay />
          <ModalContent overflowY="auto">
            <ModalHeader color="#A210C6">Appointment Details</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Progress size="xs" isIndeterminate />
              <Flex marginLeft="30px">
                <Box>
                  <Flex>
                    <Box marginRight="20px">
                      <Flex>
                        <Text fontWeight="bold" color="black">
                          Care beneficiary:
                        </Text>
                        <Text marginLeft="5px" color="black">
                          {selectedAppointment.recipientFirstname &&
                          selectedAppointment.recipientLastname
                            ? `${selectedAppointment.recipientFirstname} ${selectedAppointment.recipientLastname}`
                            : "Not available"}
                        </Text>
                      </Flex>

                      <Flex marginTop="5px">
                        <Text fontWeight="bold" color="black">
                          Phone Number:
                        </Text>
                        <Text marginLeft="5px" color="black">
                          {selectedAppointment.recipientPhoneNumber ||
                            "Not available"}
                        </Text>
                      </Flex>

                      <Flex marginTop="5px">
                        <Text fontWeight="bold" color="black">
                          Gender:
                        </Text>
                        <Text marginLeft="5px" color="black">
                          {selectedAppointment.recipientGender ||
                            "Not available"}
                        </Text>
                      </Flex>

                      <Flex marginTop="5px">
                        <Text fontWeight="bold" color="black">
                          Date of Birth:
                        </Text>
                        <Text marginLeft="5px" color="black">
                          {formatDate(selectedAppointment.recipientDOB) ||
                            "Not available"}
                        </Text>
                      </Flex>

                      <Flex marginTop="5px">
                        <Text fontWeight="bold" color="black">
                          Current Location:
                        </Text>
                        <Text marginLeft="5px" color="black">
                          {selectedAppointment.currentLocation ||
                            "Not availabe"}
                        </Text>
                      </Flex>

                      <Flex marginTop="5px">
                        <Text fontWeight="bold" color="black">
                          Next of kin name:
                        </Text>
                        <Text marginLeft="5px" color="black">
                          {selectedAppointment.kinName || "Not available"}
                        </Text>
                      </Flex>

                      <Flex marginTop="5px">
                        <Text fontWeight="bold" color="black">
                          Next of kin number:
                        </Text>
                        <Text marginLeft="5px" color="black">
                          {selectedAppointment.kinNumber || "Not availabe"}
                        </Text>
                      </Flex>

                      <Flex marginTop="5px">
                        <Text fontWeight="bold" color="black">
                          Language:
                        </Text>
                        <Text marginLeft="5px" color="black">
                          {selectedAppointment.language || "Not available"}
                        </Text>
                      </Flex>

                      <Flex marginTop="5px">
                        <Text fontWeight="bold" color="black">
                          Relationship:
                        </Text>
                        <Text marginLeft="5px" color="black">
                          {selectedAppointment.relationship || "Not availabe"}
                        </Text>
                      </Flex>
                      <Flex marginTop="5px" marginBottom="10px">
                        <Text fontWeight="bold" color="black">
                          Booked on:
                        </Text>
                        <Text marginLeft="5px" color="black">
                          {formatDateTime(selectedAppointment.createdAt)}
                        </Text>
                      </Flex>
                    </Box>

                    <Box marginLeft="30px">
                      <Flex marginTop="2px">
                        <Text fontWeight="bold" color="black">
                          Shift:
                        </Text>
                        <Text marginLeft="5px" color="black">
                          {selectedAppointment.shift || "Not availabe"}
                        </Text>
                      </Flex>
                      <Flex marginTop="5px">
                        <Text fontWeight="bold" color="black">
                          Type of caregiver
                        </Text>
                        <Text marginLeft="5px" color="black">
                          {selectedAppointment.medicSpecialization ||
                            "Not availabe"}
                        </Text>
                      </Flex>
                      <Flex marginTop="5px">
                        <Text fontWeight="bold" color="black">
                          Hospital:
                        </Text>
                        <Text marginLeft="5px" color="black">
                          {selectedAppointment.recipientHospital ||
                            "Not availabe"}
                        </Text>
                      </Flex>

                      <Flex marginTop="5px">
                        <Text fontWeight="bold" color="black">
                          Service Plan
                        </Text>
                        <Text marginLeft="5px" color="black">
                          {selectedAppointment.servicePlan || "Not availabe"}
                        </Text>
                      </Flex>
                      <Flex marginTop="5px">
                        <Text fontWeight="bold" color="black">
                          Cost of service
                        </Text>
                        <Text marginLeft="5px" color="black">
                          {selectedAppointment.costOfService || "Not availabe"}
                        </Text>
                      </Flex>
                      <Flex marginTop="5px">
                        <Text fontWeight="bold" color="black">
                          Start Date:
                        </Text>
                        <Text marginLeft="5px" color="black">
                          {formatDate(selectedAppointment.startDate) ||
                            "Not availabe"}
                        </Text>
                      </Flex>
                      <Flex marginTop="5px">
                        <Text fontWeight="bold" color="black">
                          End Date:
                        </Text>
                        <Text marginLeft="5px" color="black">
                          {formatDate(selectedAppointment.endDate) ||
                            "Not availabe"}
                        </Text>
                      </Flex>
                      <Flex marginTop="5px">
                        <Text fontWeight="bold" color="black">
                          Medical Report:
                        </Text>
                        <Text marginLeft="5px" color="black">
                          {selectedAppointment.medicalReport || "Not availabe"}
                        </Text>
                      </Flex>
                      <Flex marginTop="5px">
                        <Text fontWeight="bold" color="black">
                          Paid:
                        </Text>
                        <Text marginLeft="5px" color="black">
                          {selectedAppointment.paid ? "Yes" : "No"}
                        </Text>
                      </Flex>

                      <Flex marginTop="5px">
                        <Text fontWeight="bold" color="black">
                          Health History:
                        </Text>
                        <Text
                          marginLeft="5px"
                          color="black"
                          maxW="300px"
                          maxH="1000px"
                        >
                          {selectedAppointment.recipientHealthHistory ||
                            "Not available"}
                        </Text>
                      </Flex>
                    </Box>
                  </Flex>
                </Box>
              </Flex>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}

      {confirmationModalOpen && (
        <Modal
          isOpen={confirmationModalOpen}
          onClose={() => setConfirmationModalOpen(false)}
          size="md"
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Confirmation</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              Are you sure you want to cancel this appointment?
            </ModalBody>
            <ModalFooter>
              <Button
                colorScheme="red"
                onClick={() => setConfirmationModalOpen(false)}
              >
                No
              </Button>
              <Button marginLeft="5px" onClick={handleConfirmation}>
                Yes
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default MatchedAppointmentsModal;
