import React, { useState, useEffect } from "react";
import axios from "axios";
import LoadingSpinner from "../../utils/Spiner";
import BookAppointmentModal from "../sections/BookAppointment";
import { CloseIcon } from "@chakra-ui/icons";
import {
  VStack,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Button,
  useToast,
  Box,
  Text,
  Flex,
  Divider,
} from "@chakra-ui/react";

export default function AppointmentTab() {
  const toast = useToast();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        };

        const response = await axios.get(
          "https://backend-c1pz.onrender.com/v1/appointment/allAppointments",
          config
        );

        if (response.data.success) {
          const sortedAppointments = response.data.data.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          setAppointments(sortedAppointments);
        } else {
          console.error("Failed to fetch appointments");
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

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
      const apiUrl = `https://backend-c1pz.onrender.com/v1/appointment/findAppointmentDetails/${appointmentId}`;

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.get(apiUrl, { headers });

      if (response && response.data && response.data.success) {
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

  const handleViewMore = async (id) => {
    await fetchAndDisplayAppointmentDetails(id);
    console.log(`View more details for appointment with ID: ${id}`);
  };

  const handleOpenAppointmentModal = () => {
    setShowAppointmentModal(true);
  };

  const handleCloseAppointmentModal = () => {
    setShowAppointmentModal(false);
  };

  return (
    <Box
      className="all-appointment"
      w={{ base: "100%", md: "100%" }}
      h={{ base: "60vh", md: "60vh" }}
      overflowY="scroll"
    >
      <VStack align="start" spacing={4}>
        {loading ? (
          <LoadingSpinner />
        ) : appointments.length === 0 ? (
          <Text
            fontSize={{ base: "10px", md: "16px" }}
            ml={{ base: "10px", md: "35px" }}
          >
            No appointments yet. Click{" "}
            <button
              style={{
                color: "#A210C6",
                fontStyle: "italic",
                textDecoration: "none",
                cursor: "pointer",
                border: "none",
                background: "none",
                padding: "0",
                font: "inherit",
              }}
              onClick={handleOpenAppointmentModal}
            >
              book appointment
            </button>{" "}
            to begin.
          </Text>
        ) : (
          <Box w={{ base: "90vw", md: "60vw" }}>
            <Flex
              mt="-10px"
              mb="50px"
              w={{ base: "90vw", md: "60vw" }}
              position="fixed"
              ml={{ md: "-20px" }}
              bg="#D087E2"
              p={4}
              borderRadius="md"
              justifyContent="space-between"
              color="white"
              fontSize={{ base: "10px", md: "16px" }}
            >
              <Text fontWeight="bold">Name</Text>
              <Text fontWeight="bold">Type</Text>
              <Text fontWeight="bold">Plan</Text>
              <Text fontWeight="bold">Status</Text>
              <Text fontWeight="bold">Payment</Text>
            </Flex>
            <VStack
              mb={{ base: "150", md: "250" }}
              overflow="scroll"
              justifyContent="space-between"
              mt={{ base: 10, md: 16 }}
              align="start"
              spacing={4}
            >
              {appointments.map((appointment) => (
                <Box
                  ml={{ base: "10px" }}
                  onClick={() => handleViewMore(appointment.id)}
                  key={appointment.id}
                  style={{
                    cursor: "pointer",
                  }}
                  w={{ base: "85vw", md: "57vw" }}
                  p={4}
                  borderBottom="1px solid #e2e8f0"
                >
                  <Flex
                    _hover={
                      {
                        // transform: "translateY(-10px)",
                      }
                    }
                    fontSize={{ base: "10px", md: "16px" }}
                    textAlign="left"
                    ml={{ base: "-15px", md: "-16px" }}
                    justifyContent="space-between"
                  >
                    <Text>
                      {`${appointment.recipientFirstname} ${appointment.recipientLastname}`}
                    </Text>
                    <Text>{`${appointment.shift} `}</Text>
                    <Text>{`${appointment.servicePlan} `}</Text>
                    <Box
                      w={{ base: "50px", md: "97px" }}
                      textAlign="center"
                      borderRadius="10px"
                      p="5px"
                      bg={
                        appointment.appointmentCompleted
                          ? "green.500"
                          : appointment.appointmentActive
                          ? "blue.500"
                          : appointment.appointmentMatched
                          ? "yellow.500"
                          : appointment.appointmentPending
                          ? "#F4DDA2"
                          : "black"
                      }
                    >
                      <Text
                        fontSize={{ base: "10px", md: "14px" }}
                        color={
                          appointment.appointmentCompleted
                            ? "green.500"
                            : appointment.appointmentActive
                            ? "blue.500"
                            : appointment.appointmentMatched
                            ? "yellow.500"
                            : appointment.appointmentPending
                            ? "#B48B25"
                            : "black"
                        }
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
                    </Box>
                    <Box
                      w={{ base: "50px", md: "97px" }}
                      borderRadius="10px"
                      p="5px"
                      bg={appointment?.paid ? "#ACE1C1" : "red.200"}
                    >
                      <Text
                        fontSize={{ base: "10px", md: "14px" }}
                        textAlign="center"
                        color={appointment?.paid ? "#057B1F" : "red.300"}
                      >
                        {appointment?.paid ? "Paid" : "Not paid"}
                      </Text>
                    </Box>

                    {/* <Text ml={{ md: "60px" }} color="black">
                      {appointment?.paid ? "Paid" : "Not paid"}
                    </Text> */}
                  </Flex>
                </Box>
              ))}
            </VStack>
          </Box>
        )}
      </VStack>
      {detailsModalOpen && selectedAppointment && (
        <Drawer
          isOpen={detailsModalOpen}
          onClose={() => setDetailsModalOpen(false)}
          placement="right"
          size="md"
        >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerHeader
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottomWidth="1px"
              fontSize="lg"
              fontWeight="bold"
              color="#A210C6"
            >
              Appointment Details
              <Button
                variant="ghost"
                onClick={() => setDetailsModalOpen(false)}
                leftIcon={<CloseIcon />}
              />
            </DrawerHeader>
            <DrawerBody overflowY="auto">
              <Flex
                flexDirection="column"
                alignItems="start"
                justifyContent="flex-start"
                marginLeft="20px"
              >
                <Flex>
                  <Text fontWeight="bold">Status:</Text>
                  <Text
                    fontSize="16px"
                    marginLeft="20px"
                    color={
                      selectedAppointment.appointmentCompleted
                        ? "green.500"
                        : selectedAppointment.appointmentActive
                        ? "blue.500"
                        : selectedAppointment.appointmentMatched
                        ? "yellow.500"
                        : selectedAppointment.appointmentPending
                        ? "yellow.500"
                        : "black"
                    }
                  >
                    {selectedAppointment.appointmentCompleted
                      ? "Completed"
                      : selectedAppointment.appointmentActive
                      ? "Active"
                      : selectedAppointment.appointmentMatched
                      ? "Paired"
                      : selectedAppointment.appointmentPending
                      ? "Pending"
                      : "Unknown"}
                  </Text>
                </Flex>
                <Divider my={4} borderColor="gray.500" />
                <Flex>
                  <Text fontWeight="bold" color="black">
                    Beneficiary name:
                  </Text>
                  <Text marginLeft="20px" color="black">
                    {selectedAppointment.recipientFirstname &&
                    selectedAppointment.recipientLastname
                      ? `${selectedAppointment.recipientFirstname} ${selectedAppointment.recipientLastname}`
                      : "Not available"}
                  </Text>
                </Flex>
                <Divider my={4} borderColor="gray.500" />
                <Flex marginTop="5px">
                  <Text fontWeight="bold" color="black">
                    Phone Number:
                  </Text>
                  <Text marginLeft="20px" color="black">
                    {selectedAppointment.recipientPhoneNumber ||
                      "Not available"}
                  </Text>
                </Flex>
                <Divider my={4} borderColor="gray.500" />
                <Flex marginTop="5px">
                  <Text fontWeight="bold" color="black">
                    Gender:
                  </Text>
                  <Text marginLeft="20px" color="black">
                    {selectedAppointment.recipientGender || "Not available"}
                  </Text>
                </Flex>
                <Divider my={4} borderColor="gray.500" />
                <Flex marginTop="5px">
                  <Text fontWeight="bold" color="black">
                    Date of Birth:
                  </Text>
                  <Text marginLeft="20px" color="black">
                    {formatDate(selectedAppointment.recipientDOB) ||
                      "Not available"}
                  </Text>
                </Flex>
                <Divider my={4} borderColor="gray.500" />
                <Flex marginTop="5px">
                  <Text fontWeight="bold" color="black">
                    Current Location:
                  </Text>
                  <Text marginLeft="20px" color="black">
                    {selectedAppointment.currentLocation || "Not available"}
                  </Text>
                </Flex>

                <Divider my={4} borderColor="gray.500" />

                <Flex marginTop="5px">
                  <Text fontWeight="bold" color="black">
                    Relationship:
                  </Text>
                  <Text marginLeft="20px" color="black">
                    {selectedAppointment.relationship || "Nil"}
                  </Text>
                </Flex>
                <Divider my={4} borderColor="gray.500" />
                <Flex marginTop="5px" marginBottom="10px">
                  <Text fontWeight="bold" color="black">
                    Booked on:
                  </Text>
                  <Text marginLeft="20px" color="black">
                    {formatDateTime(selectedAppointment.createdAt)}
                  </Text>
                </Flex>
                <Divider my={4} borderColor="gray.500" />

                <Flex>
                  <Text fontWeight="bold" color="black">
                    Shift:
                  </Text>
                  <Text marginLeft="20px" color="black">
                    {selectedAppointment.shift || "Not available"}
                  </Text>
                </Flex>
                <Divider my={4} borderColor="gray.500" />

                <Flex marginTop="5px">
                  <Text fontWeight="bold" color="black">
                    Service Plan
                  </Text>
                  <Text marginLeft="20px" color="black">
                    {selectedAppointment.servicePlan || "Not available"}
                  </Text>
                </Flex>
                <Divider my={4} borderColor="gray.500" />
                <Flex marginTop="5px">
                  <Text fontWeight="bold" color="black">
                    Type of caregiver
                  </Text>
                  <Text marginLeft="20px" color="black">
                    {selectedAppointment.medicSpecialization || "Not available"}
                  </Text>
                </Flex>
                <Divider my={4} borderColor="gray.500" />
                <Flex marginTop="5px">
                  <Text fontWeight="bold" color="black">
                    Cost of service
                  </Text>
                  <Text marginLeft="20px" color="black">
                    ₦{selectedAppointment.costOfService || "Not available"}.00
                  </Text>
                </Flex>
                <Divider my={4} borderColor="gray.500" />
                <Flex marginTop="5px">
                  <Text fontWeight="bold" color="black">
                    Start Date:
                  </Text>
                  <Text marginLeft="20px" color="black">
                    {selectedAppointment.startDate || "Not available"}
                  </Text>
                </Flex>

                <Divider my={4} borderColor="gray.500" />
                <Flex marginTop="5px">
                  <Text fontWeight="bold" color="black">
                    Medical Report:
                  </Text>
                  <Text marginLeft="20px" color="black">
                    {selectedAppointment.medicalReport || "Not available"}
                  </Text>
                </Flex>
                <Divider my={4} borderColor="gray.500" />
                <Flex marginTop="5px">
                  <Text fontWeight="bold" color="black">
                    Paid:
                  </Text>
                  <Text marginLeft="20px" color="black">
                    {selectedAppointment.paid ? "Yes" : "No"}
                  </Text>
                </Flex>
                <Divider my={4} borderColor="gray.500" />
              </Flex>
              <Box>
                <Flex marginTop="5px">
                  <Text marginLeft="20px" fontWeight="bold" color="black">
                    Health History:
                  </Text>
                  <Text
                    marginLeft="10px"
                    color="black"
                    maxW="600px"
                    maxH="1000px"
                  >
                    {selectedAppointment.recipientHealthHistory ||
                      "Not available"}
                  </Text>
                </Flex>
                <Divider my={4} borderColor="gray.500" />
              </Box>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      )}
      <BookAppointmentModal
        isOpen={showAppointmentModal}
        onClose={handleCloseAppointmentModal}
      />
    </Box>
  );
}
