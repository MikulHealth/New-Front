import React, { useState, useEffect } from "react";
import axios from "axios";
import LoadingSpinner from "../../utils/Spiner";
import BookAppointmentModal from "../sections/BookAppointment";
import { EditIcon, CheckIcon, CloseIcon, WarningIcon } from "@chakra-ui/icons";
import PaymentModal from "../sections/PaymentMethod";
import EditPendingAppointmentModal from "../sections/EditPendingAppointmentModal";
import { ToastContainer } from "react-toastify";
import {
  VStack,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  DrawerHeader,
  DrawerBody,
  Button,
  Box,
  Text,
  Flex,
  Divider,
  useMediaQuery,
  useToast,
  DrawerFooter,
} from "@chakra-ui/react";

export default function AppointmentTab() {
  const [appointments, setAppointments] = useState([]);
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentData, setPaymentData] = useState({});
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [cancellingAppointmentId, setCancellingAppointmentId] = useState(null);

  const handleCancelModalClose = () => {
    setConfirmationModalOpen(false);
  };

  const fetchData = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };

      const response = await axios.get(
       // "https://backend-c1pz.onrender.com/v1/appointment/allAppointments",
       "http://localhost:8080/v1/appointment/allAppointments",
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

  useEffect(() => {
    fetchData();
  }, []);

  const handleConfirmation = async () => {
    try {
      const token = localStorage.getItem("token");
      const apiUrl = `https://backend-c1pz.onrender.com/v1/appointment/cancelAppointment/${cancellingAppointmentId}`;

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.post(apiUrl, {}, { headers });

      if (response.data.success) {
        toast({
          description: response.data.message,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        fetchData();
        setDetailsModalOpen(false);
      } else {
        toast.error("Error canceling appointment");
        console.error("Error canceling appointment");
      }
    } catch (error) {
      console.error("An error occurred while canceling appointment:", error);
    } finally {
      setConfirmationModalOpen(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };

    const date = new Date(dateString);
    date.setHours(date.getHours() + 1);

    const formattedDate = date.toLocaleDateString(undefined, options);

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

  const handleViewMore = (appointment) => {
    setSelectedAppointment(appointment);
    setDetailsModalOpen(true);
  };

  const handleOpenAppointmentModal = () => {
    setShowAppointmentModal(true);
  };

  const handleCloseAppointmentModal = () => {
    setShowAppointmentModal(false);
  };

  const closeDetailsDrawer = () => {
    setDetailsModalOpen(false);
    setSelectedAppointment(null);
  };

  const formattedCost = (amount) => {
    const num = Number(amount);
    return "₦ " + num.toLocaleString();
  };

  const handlePayment = (selectedAppointment) => {
    setPaymentData({
      costOfService: selectedAppointment.costOfService,
      appointmentId: selectedAppointment.id,
      beneficiary: `${selectedAppointment.recipientFirstname} ${selectedAppointment.recipientLastname}`,
    });
    setTimeout(() => {
      setIsPaymentModalOpen(true);
    }, 1000);
  };

  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");
  const modalWidth = isLargerThan768 ? "400px" : "90vw";

  const handleEditAppointment = (id) => {
    setEditModalOpen(true);
    setDetailsModalOpen(false);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
  };

  const handleCancelAppointment = (appointmentId) => {
    setCancellingAppointmentId(appointmentId);
    setConfirmationModalOpen(true);
  };

  return (
    <Box
      className="all-appointment"
      w={{ base: "100%", md: "100%" }}
      h={{ base: "60vh", md: "60vh" }}
      overflowY="scroll"
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
        ) : appointments.length === 0 ? (
          <Text
            w={{ base: "90vw", md: "60vw" }}
            ml={{ base: "-8px", md: "-20px" }}
            fontSize={{ base: "10px", md: "16px" }}
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
          <Box>
            <Flex
              mt={{ base: "-10px", md: "-10px" }}
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
              {appointments.map((appointment) => (
                <Box
                  ml={{ base: "10px" }}
                  onClick={() => handleViewMore(appointment)}
                  key={appointment.id}
                  style={{
                    cursor: "pointer",
                  }}
                  w={{ base: "85vw", md: "57vw" }}
                  p={4}
                  borderBottom="1px solid #e2e8f0"
                >
                  <Flex
                    fontSize={{ base: "10px", md: "14px" }}
                    textAlign="left"
                    ml={{ base: "-15px", md: "-16px" }}
                    justifyContent="space-between"
                  >
                    <Text
                      textAlign="left"
                      maxW={{ base: "80px", md: "100px" }}
                      wordWrap="break-word"
                    >
                      {`${appointment.recipientFirstname} ${appointment.recipientLastname}`}
                    </Text>
                    <Text
                      textAlign="left"
                      maxW={{ base: "50px", md: "100px" }}
                    >{`${appointment.shift} `}</Text>
                    <Text
                      textAlign="left"
                      maxW={{ base: "60px", md: "100px" }}
                      wordWrap="break-word"
                    >{`${appointment.servicePlan} `}</Text>
                    <Box
                      w={{ base: "60px", md: "97px" }}
                      h={{ base: "25px", md: "33px" }}
                      textAlign="center"
                      borderRadius="10px"
                      p="5px"
                      bg={
                        appointment.appointmentCompleted
                          ? "#D087E2"
                          : appointment.appointmentActive
                          ? "#ACE1C1"
                          : appointment.appointmentMatched
                          ? "#F4DDA2"
                          : appointment.appointmentPending
                          ? "#F4DDA2"
                          : "black"
                      }
                    >
                      <Text
                        textAlign="center"
                        fontSize={{ base: "10px", md: "14px" }}
                        color={
                          appointment.appointmentCompleted
                            ? "#A210C6"
                            : appointment.appointmentActive
                            ? "#057B1F"
                            : appointment.appointmentMatched
                            ? "#B48B25"
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
                      h={{ base: "25px", md: "33px" }}
                      borderRadius="10px"
                      p="5px"
                    >
                      <Text
                        fontSize={{ base: "10px", md: "14px" }}
                        fontWeight="bold"
                        textAlign="center"
                        color={appointment?.paid ? "#057B1F" : "red.500"}
                      >
                        {appointment?.paid ? "Paid" : "Unpaid"}
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
                onClick={closeDetailsDrawer}
                leftIcon={<CloseIcon />}
              />
            </DrawerHeader>
            {!selectedAppointment.paid && (
              <Button
                ml={{ base: "5px" }}
                bg="green.400"
                color="white"
                _hover={{ color: "" }}
                onClick={() => handlePayment(selectedAppointment)}
                leftIcon={<CheckIcon />}
              >
                Pay for appointment
              </Button>
            )}
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
                    Town:
                  </Text>
                  <Text marginLeft="20px" color="black">
                    {selectedAppointment.recipientTown || "Not available"}
                  </Text>
                </Flex>
                <Divider my={4} borderColor="gray.500" />
                <Flex marginTop="5px">
                  <Text fontWeight="bold" color="black">
                    Preferred Gender:
                  </Text>
                  <Text marginLeft="20px" color="black">
                    {selectedAppointment.preferredMedicGender || "Not available"}
                  </Text>
                </Flex>
                <Divider my={4} borderColor="gray.500" />
                <Flex marginTop="5px">
                  <Text fontWeight="bold" color="black">
                    Preferred Language:
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
              <Box>
                <Flex marginTop="5px">
                  <Text marginLeft="20px" fontWeight="bold" color="black">
                    Special Needs:
                  </Text>
                  <Text
                    marginLeft="10px"
                    color="black"
                    maxW="600px"
                    maxH="1000px"
                  >
                    {selectedAppointment.specialNeeds && selectedAppointment.specialNeeds.length > 0
                      ? selectedAppointment.specialNeeds.join(", ")
                      : "Not available"}
                  </Text>
                </Flex>
                <Divider my={4} borderColor="gray.500" />
              </Box>
            </DrawerBody>
            <DrawerFooter justifyContent="space-between">
              {selectedAppointment.appointmentPending && (
                <Button
                  bg="#A210C6"
                  color="white"
                  _hover={{ color: "" }}
                  leftIcon={<EditIcon />}
                  onClick={handleEditAppointment}
                >
                  Edit
                </Button>
              )}
              {selectedAppointment.appointmentPending && (
                <Button
                  bg="#E1ACAE"
                  color="red.500"
                  _hover={{ color: "" }}
                  onClick={() =>
                    handleCancelAppointment(selectedAppointment.id)
                  }
                >
                  Cancel
                </Button>
              )}
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
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
              Are you sure you want to cancel this appointment? <br></br>
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
      <BookAppointmentModal
        isOpen={showAppointmentModal}
        onClose={handleCloseAppointmentModal}
      />
      <EditPendingAppointmentModal
        isOpen={editModalOpen}
        onClose={handleCloseEditModal}
        appointmentDetails={selectedAppointment}
      />
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        paymentData={paymentData}
      />
    </Box>
  );
}
