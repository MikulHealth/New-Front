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
          // "http://localhost:8080/v1/appointment/allAppointments",
          "https://backend-c1pz.onrender.com/v1/appointment/allAppointments",
          config
        );

        if (response.data.success) {
          setAppointments(response.data.data);
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

  const formattedCost = (cost) => {
    const costInNaira = cost / 100;

    const formattedCost =
      "₦ " + costInNaira.toLocaleString("en-NG", { maximumFractionDigits: 2 });

    return formattedCost;
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
      overflow="scroll"
      marginLeft="2%"
      w={{ base: "100%", md: "45vw" }}
      h={{ base: "60vh", md: "28vh" }}
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
          <VStack align="start" spacing={4}>
            {appointments.map((appointment) => (
              <Box fontSize={{ base: "12px", md: "16px" }} key={appointment.id}>
                <Flex>
                  <Text fontWeight="bold" color="black">
                    Care beneficiary:
                  </Text>
                  <Text ml={{ base: "10px", md: "5px" }} color="black">
                    {`${appointment.recipientFirstname} ${appointment.recipientLastname}`}
                  </Text>
                </Flex>
                <Flex>
                  <Text fontWeight="bold" color="black">
                    Booked on:
                  </Text>
                  <Text ml={{ base: "10px", md: "5px" }} color="black">
                    {formatDateTime(appointment.createdAt)}
                  </Text>
                  <Flex display={{ base: "none", md: "flex" }}>
                    <Text
                      fontSize={{ base: "12px", md: "16px" }}
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
                </Flex>
                <Flex
                  fontSize={{ base: "12px", md: "16px" }}
                  display={{ base: "flex", md: "none" }}
                >
                  <Text
                    onClick={() => handleViewMore(appointment.id)}
                    style={{
                      color: "#A210C6",
                      fontStyle: "italic",
                      cursor: "pointer",
                    }}
                    _hover={{ color: "#A210C6" }}
                  >
                    Details
                  </Text>
                  <Text
                    ml={{ base: "150px" }}
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
                    {selectedAppointment.currentLocation || "Not availabe"}
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
                    {selectedAppointment.shift || "Not availabe"}
                  </Text>
                </Flex>
                <Divider my={4} borderColor="gray.500" />

                <Flex marginTop="5px">
                  <Text fontWeight="bold" color="black">
                    Service Plan
                  </Text>
                  <Text marginLeft="20px" color="black">
                    {selectedAppointment.servicePlan || "Not availabe"}
                  </Text>
                </Flex>
                <Divider my={4} borderColor="gray.500" />
                <Flex marginTop="5px">
                  <Text fontWeight="bold" color="black">
                    Type of caregiver
                  </Text>
                  <Text marginLeft="20px" color="black">
                    {selectedAppointment.medicSpecialization || "Not availabe"}
                  </Text>
                </Flex>
                <Divider my={4} borderColor="gray.500" />
                <Flex marginTop="5px">
                  <Text fontWeight="bold" color="black">
                    Cost of service
                  </Text>
                  <Text marginLeft="20px" color="black">
                    {formattedCost(selectedAppointment.costOfService) ||
                      "Not availabe"}
                  </Text>
                </Flex>
                <Divider my={4} borderColor="gray.500" />
                <Flex marginTop="5px">
                  <Text fontWeight="bold" color="black">
                    Start Date:
                  </Text>
                  <Text marginLeft="20px" color="black">
                    {formatDate(selectedAppointment.startDate) ||
                      "Not availabe"}
                  </Text>
                </Flex>
                <Divider my={4} borderColor="gray.500" />
                <Flex marginTop="5px">
                  <Text fontWeight="bold" color="black">
                    End Date:
                  </Text>
                  <Text marginLeft="20px" color="black">
                    {formatDate(selectedAppointment.endDate) || "Not availabe"}
                  </Text>
                </Flex>
                <Divider my={4} borderColor="gray.500" />
                <Flex marginTop="5px">
                  <Text fontWeight="bold" color="black">
                    Medical Report:
                  </Text>
                  <Text marginLeft="20px" color="black">
                    {selectedAppointment.medicalReport || "Not availabe"}
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