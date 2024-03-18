import React, { useState, useEffect } from "react";
import userImageIcon from "../../assets/userImage.svg";
import {
  VStack,
  Text,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Box,
  Flex,
  Spinner,
  Progress,
  useToast,
  Image,
  Divider,
} from "@chakra-ui/react";
import axios from "axios";

const AppointmentModal = ({ isOpen, onClose }) => {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        };

        const response = await axios.get(
          // "http://localhost:8080/v1/appointment/allAppointments",
          "https://backend-c1pz.onrender.com/v1/appointment/allAppointments",
          config
        );

        if (response.data.success) {
          toast({
            title: response.data.message,
            status: "success",
            duration: 6000,
          });
          console.log("appointment status",  response.data.data)
          setAppointments(response.data.data);
        
        } else {
          toast({
            title: "Request failed",
            description: response.message,
            status: "error",
            duration: 6000,
          });
          console.error("Failed to fetch appointments");
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = new Date(dateString).toLocaleDateString(
      undefined,
      options
    );
    return formattedDate;
  };

  const fetchAndDisplayAppointmentDetails = async (appointmentId) => {
    try {
      const token = localStorage.getItem("token");
      // const apiUrl = `http://localhost:8080/v1/appointment/findAppointmentDetails/${appointmentId}`;
      const apiUrl = `https://backend-c1pz.onrender.com/v1/appointment/findAppointmentDetails/${appointmentId}`;

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
  const handleViewMore = async (id) => {
    await fetchAndDisplayAppointmentDetails(id);
    // onClose();
    console.log(`View more details for appointment with ID: ${id}`);
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
  console.log("appointment status",  appointments.appointmentPending)

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="xl" borderRadius="0px">
        <ModalOverlay />
        <ModalContent maxH="80vh" overflowY="auto">
          <ModalHeader color="#A210C6">All your appointments.</ModalHeader>
          <ModalCloseButton />
          <ModalBody marginLeft="45px">
            <Progress size="xs" isIndeterminate />
            {loading ? (
              <Flex align="center" justify="center" height="200px">
                <Spinner size="xl" />
              </Flex>
            ) : (
              <VStack align="start" spacing={4}>
                {appointments.map((appointment) => (
                  <Box key={appointment.id}>
                    <Flex>
                      <Text fontWeight="bold" color="black">
                        Care beneficiary:
                      </Text>
                      <Text marginLeft="5px" color="black">
                        {`${appointment.recipientFirstname} ${appointment.recipientLastname}`}
                      </Text>
                    </Flex>
                    <Flex>
                      <Text fontWeight="bold" color="black">
                        Booked on:
                      </Text>
                      <Text marginLeft="5px" color="black">
                        {formatDateTime(appointment.createdAt)}
                      </Text>

                      <Text
                        fontSize="16px"
                        onClick={() => handleViewMore(appointment.id)}
                        style={{
                          marginLeft: "60px",
                          color: "#A210C6",
                          fontStyle: "italic",
                          cursor: "pointer",
                        }}
                        _hover={{ color: "#A210C6" }}
                      >
                        Details
                      </Text>
                      <Text
                        fontSize="16px"
                        marginLeft="60px"
                        color={
                          appointment.appointmentCompleted
                            ? "green.500"
                            : appointment.appointmentActive
                            ? "blue.500"
                            : appointment.appointmentMatched
                            ? "yellow.500"
                            : appointment.appointmentPending
                            ? "yellow.500"
                            : "black"
                        }
                        fontStyle="italic"
                      >
                        {appointment.appointmentCompleted
                          ? "Completed"
                          : appointment.appointmentActive
                          ? "Active"
                          : appointment.appointmentMatched
                          ? "Paired"
                          : appointment.appointmentPending
                          ? "Pending"
                          : "Unknown"}
                      </Text>
                    </Flex>

                    <Divider my={4} borderColor="gray.500" />
                  </Box>
                ))}
              </VStack>
            )}
          </ModalBody>
          <ModalFooter></ModalFooter>
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
                      <Flex marginTop="2px">
                        <Text fontWeight="bold" color="black">
                          Type of Caregiver:
                        </Text>
                        <Text marginLeft="5px" color="black">
                          {selectedAppointment.medicSpecialization ||
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
                          {console.log("Is paid is", selectedAppointment.paid)}
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
    </>
  );
};

export default AppointmentModal;
