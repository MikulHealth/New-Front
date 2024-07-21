import React, { useState, useEffect } from "react";
import LoadingSpinner from "../../utils/Spiner";
import axios from "axios";
import { CloseIcon } from "@chakra-ui/icons";
import { baseUrl } from "../../apiCalls/config";
import {
  VStack,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
  // useToast,
  Box,
  Text,
  Flex,
  Divider,
} from "@chakra-ui/react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CompletedApp() {
  // const toast = useToast();
  const [completedAppointments, setCompletedAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const closeDetailsDrawer = () => {
    setDetailsModalOpen(false);
    setSelectedAppointment(null);
  };

  const fetchData = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };

      const response = await axios.get(
        `${baseUrl}/appointment/findCompletedAppointments`,
        config
      );

      if (response.data.success) {
        const sortedAppointments = response.data.data.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setCompletedAppointments(sortedAppointments);
      } else {
        console.error("Failed to fetch appointments");
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const date = new Date(dateString);
    date.setHours(date.getHours() + 1);
    const formattedDate = date.toLocaleDateString(undefined, options);
    return formattedDate;
  };

  const handleViewMore = (appointment) => {
    setSelectedAppointment(appointment);
    setDetailsModalOpen(true);
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

  const formattedCost = (amount) => {
    const num = Number(amount);
    return "₦ " + num.toLocaleString();
  };

  return (
    <Box
      className="completed-appointment"
      overflow="scroll"
      w={{ base: "100%", md: "100%" }}
      h={{ base: "60vh", md: "60vh" }}
    >
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <VStack align="start" spacing={4}>
        {loading ? (
          <LoadingSpinner />
        ) : completedAppointments.length === 0 ? (
          <Text
            w={{ base: "90vw", md: "60vw" }}
            ml={{ base: "-8px", md: "-20px" }}
            fontSize={{ base: "12px", md: "16px" }}
          >
            No completed appointments yet.
          </Text>
        ) : (
          <Box>
            <Flex
              mt="-10px"
              mb="50px"
              w={{ base: "90vw", md: "60vw" }}
              position="fixed"
              ml={{ base: "-8px", md: "-20px" }}
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
              {completedAppointments.map((appointment) => (
                <Box
                  style={{
                    cursor: "pointer",
                  }}
                  key={appointment.id}
                  onClick={() => handleViewMore(appointment)}
                  w={{ base: "85vw", md: "57vw" }}
                  p={4}
                  borderBottom="1px solid #e2e8f0"
                  ml={{ base: "10px" }}
                >
                  <Flex
                    fontSize={{ base: "10px", md: "14px" }}
                    textAlign="left"
                    ml={{ base: "-15px", md: "-16px" }}
                    justifyContent="space-between"
                  >
                    <Text
                      maxW={{ base: "80px", md: "100px" }}
                      wordWrap="break-word"
                    >
                      {`${appointment.recipientFirstname} ${appointment.recipientLastname}`}
                    </Text>
                    <Text maxW={{ base: "50px", md: "120px" }}>
                      {`${appointment.shift} `}
                    </Text>
                    <Text
                      maxW={{ base: "60px", md: "120px" }}
                      wordWrap="break-word"
                    >
                      {`${appointment.servicePlan} `}
                    </Text>
                    <Box
                      w={{ base: "60px", md: "97px" }}
                      h={{ base: "25px", md: "33px" }}
                      textAlign="center"
                      borderRadius="10px"
                      p="5px"
                      bg="#D087E2"
                    >
                      <Text
                        fontSize={{ base: "10px", md: "14px" }}
                        color="#A210C6"
                      >
                        Completed
                      </Text>
                    </Box>
                    <Box
                      w={{ base: "50px", md: "97px" }}
                      h={{ base: "25px", md: "33px" }}
                      borderRadius="10px"
                      p="5px"
                    >
                      <Text
                        fontSize={{ base: "10px", md: "14px" }}
                        fontWeight="bold"
                        textAlign="center"
                        color={appointment.paid ? "#057B1F" : "black.500"}
                      >
                        {appointment.paid ? "Paid" : "Unpaid"}
                      </Text>
                    </Box>
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
          onClose={closeDetailsDrawer}
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
                onClick={closeDetailsDrawer}
                leftIcon={<CloseIcon />}
              />
            </DrawerHeader>

            <DrawerBody>
              <Flex flexDirection="column">
                <Flex justifyContent="space-between" alignItems="center">
                  <Text fontWeight="bold">Status</Text>
                  <Text fontSize="16px" color="#A210C6">
                    Completed
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
                   MH Policy No.:
                  </Text>
                  <Text marginLeft="20px" color="black">
                    {selectedAppointment?.policyNumber || "Not available"}
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
                  City/Town:
                  </Text>
                  <Text marginLeft="20px" color="black">
                    {selectedAppointment.recipientTown || "Not available"}
                  </Text>
                </Flex>
                <Divider my={4} borderColor="gray.500" />
                <Flex marginTop="5px">
                  <Text fontWeight="bold" color="black">
                    Preferred Caregiver Gender:
                  </Text>
                  <Text marginLeft="20px" color="black">
                    {selectedAppointment.preferredMedicGender ||
                      "Not available"}
                  </Text>
                </Flex>
                <Divider my={4} borderColor="gray.500" />
                <Flex marginTop="5px">
                  <Text fontWeight="bold" color="black">
                    Preferred Cargiver Language:
                  </Text>
                  <Text marginLeft="20px" color="black">
                    {selectedAppointment.preferredLanguage || "Not available"}
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

                <Box marginRight="20px">
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
                      Service Plan:
                    </Text>
                    <Text marginLeft="20px" color="black">
                      {selectedAppointment.servicePlan || "Not available"}
                    </Text>
                  </Flex>
                  <Divider my={4} borderColor="gray.500" />
                  <Flex marginTop="5px">
                    <Text fontWeight="bold" color="black">
                      Type of caregiver:
                    </Text>
                    <Text marginLeft="20px" color="black">
                      {selectedAppointment.medicSpecialization ||
                        "Not available"}
                    </Text>
                  </Flex>
                  <Divider my={4} borderColor="gray.500" />
                  <Flex marginTop="5px">
                    <Text fontWeight="bold" color="black">
                      Cost of service:
                    </Text>
                    <Text marginLeft="20px" color="black">
                      {formattedCost(selectedAppointment.costOfService) ||
                        "Not available"}
                    </Text>
                  </Flex>
                  <Divider my={4} borderColor="gray.500" />
                  <Flex marginTop="5px">
                    <Text fontWeight="bold" color="black">
                      Start Date:
                    </Text>
                    <Text marginLeft="20px" color="black">
                      {formatDate(selectedAppointment.startDate) ||
                        "Not available"}
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
                </Box>
              </Flex>
              <Box>
                <Flex marginTop="5px">
                  <Text  fontWeight="bold" color="black">
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
              <Box>
                <Flex marginTop="5px">
                  <Text  fontWeight="bold" color="black">
                    Special Needs:
                  </Text>
                  <Text
                    marginLeft="10px"
                    color="black"
                    maxW="600px"
                    maxH="1000px"
                  >
                    {selectedAppointment.specialNeeds &&
                    selectedAppointment.specialNeeds.length > 0
                      ? selectedAppointment.specialNeeds.join(", ")
                      : "Not available"}
                  </Text>
                </Flex>
                <Divider my={4} borderColor="gray.500" />
              </Box>
            </DrawerBody>
            <DrawerFooter justifyContent="space-between"></DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}
    </Box>
  );
}
