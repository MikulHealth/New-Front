import React, { useState, useEffect } from "react";
import LoadingSpinner from "../../utils/Spiner";
// import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
import axios from "axios";
import BookAppointmentModal from "../sections/BookAppointment";
import { EditIcon, CheckIcon, CloseIcon } from "@chakra-ui/icons";
import EditPendingAppointmentModal from "../sections/EditPendingAppointmentModal";
import { WarningIcon } from "@chakra-ui/icons";
import {
  VStack,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useMediaQuery,
  Button,
  // useToast,
  Box,
  Text,
  Flex,
  // extendTheme,
  Divider,
} from "@chakra-ui/react";
import PaymentModal from "../sections/PaymentMethod";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function PendingApp() {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentData, setPaymentData] = useState({});
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [pendingAppointments, setPendingAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [cancellingAppointmentId, setCancellingAppointmentId] = useState(null);
  const handleCancelAppointment = (appointmentId) => {
    setCancellingAppointmentId(appointmentId);
    setConfirmationModalOpen(true);
  };

  const handleCancelModalClose = () => {
    setConfirmationModalOpen(false);
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

  const closeDetailsDrawer = () => {
    setDetailsModalOpen(false);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
  };

  const fetchData = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };

      const response = await axios.get(
        // "http://localhost:8080/v1/appointment/pendingAppointments",
        "https://backend-c1pz.onrender.com/v1/appointment/pendingAppointments",
        config
      );

      if (response.data.success) {
        const sortedAppointments = response.data.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setPendingAppointments(sortedAppointments);
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
    const formattedDate = new Date(dateString).toLocaleDateString(
      undefined,
      options
    );
    return formattedDate;
  };

  const fetchAndDisplayAppointmentDetails = async (appointmentId) => {
    try {
      const token = localStorage.getItem("token");
      // const apiUrl = `http://localhost:8080/v1/appointment/findPendingAppointmentDetails/${appointmentId}`;
      const apiUrl = `https://backend-c1pz.onrender.com/v1/appointment/findPendingAppointmentDetails/${appointmentId}`;

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.get(apiUrl, { headers });

      if (response && response.data && response.data.success) {
        setSelectedAppointment(response.data.data.data);
        console.log("apps " + response.data.data.data);
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

  const handleOpenAppointmentModal = () => {
    setShowAppointmentModal(true);
  };

  const handleCloseAppointmentModal = () => {
    setShowAppointmentModal(false);
  };

  const handleConfirmation = async () => {
    try {
      const token = localStorage.getItem("token");
      // const apiUrl = `http://localhost:8080/v1/appointment/cancelAppointment/${cancellingAppointmentId}`;
      const apiUrl = `https://backend-c1pz.onrender.com/v1/appointment/cancelAppointment/${cancellingAppointmentId}`;

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.post(apiUrl, {}, { headers });

      if (response.data.success) {
        toast.success(response.data.message);

        localStorage.removeItem("appointmentId");
        fetchData();
      } else {
        toast.error("error canceling appointment");

        console.error("Error canceling appointment");
      }
    } catch (error) {
      console.error("An error occurred while canceling appointment:", error);
    } finally {
      setConfirmationModalOpen(false);
    }
  };

  const handleViewMore = async (id) => {
    await fetchAndDisplayAppointmentDetails(id);
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

  return (
    <Box
      className="pending-appointment"
      overflow="scroll"
      w={{ base: "100%", md: "100%" }}
      h={{ base: "60vh", md: "60vh" }}
    >
      <ToastContainer
        position="top-right"
        autoClose={5000}
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
        ) : pendingAppointments.length === 0 ? (
          <Text
          w={{ base: "90vw", md: "60vw" }}
          ml={{ base: "-8px", md: "-20px" }}
          fontSize={{ base: "10px", md: "16px" }}
          >
            No pending appointments yet. Click{" "}
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
          <Box >
            <Flex
              mt="-10px"
              mb="50px"
              w={{ base: "90vw", md: "60vw" }}
              position="fixed"
              ml={{base: "-8px", md: "-20px" }}
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
              {pendingAppointments.map((appointment) => (
               
                <Box
                  style={{
                    cursor: "pointer",
                  }}
                  key={appointment.id}
                  onClick={() => handleViewMore(appointment.id)}
                  w={{ base: "85vw", md: "57vw" }}
                
                  p={4}
                  borderBottom="1px solid #e2e8f0"
                  ml={{ base: "10px" }}
                >
                  <Flex
                 
                    fontSize={{ base: "10px", md: "16px" }}
                    textAlign="left"
                    ml={{ base: "-15px", md: "-16px" }}
                    justifyContent="space-between"
                  >
                    <Text>
                      {`${appointment.appointment.recipientFirstname} ${appointment.appointment.recipientLastname}`}
                    </Text>
                    <Text>{`${appointment.appointment.shift} `}</Text>
                    <Text>{`${appointment.appointment.servicePlan} `}</Text>
                    <Box
                      w={{ base: "50px", md: "97px" }}
                      textAlign="center"
                      borderRadius="10px"
                      p="5px"
                      bg={
                        appointment.appointment.appointmentPending
                          ? "#F4DDA2"
                          : "black"
                      }
                    >
                      <Text
                        fontSize={{ base: "10px", md: "14px" }}
                        color={
                          appointment.appointment?.appointmentPending
                            ? "#B48B25"
                            : "black"
                        }
                      >
                        {appointment.appointment?.appointmentPending
                          ? "Pending"
                          : "Unknown"}
                      </Text>
                    </Box>
                    <Box
                      w={{ base: "50px", md: "97px" }}
                      borderRadius="10px"
                      p="5px"
                      bg={appointment.appointment?.paid ? "#ACE1C1" : "red.200"}
                    >
                      <Text
                        fontSize={{ base: "10px", md: "14px" }}
                        textAlign="center"
                        color={
                          appointment.appointment?.paid ? "#057B1F" : "black.500"
                        }
                      >
                        {appointment?.appointment.paid ? "Paid" : "Unpaid"}
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
              Details
              {!selectedAppointment.paid && (
                <Button
                  fontSize={{ base: "12px", md: "14px" }}
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
                  <Text
                    fontSize="16px"
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
                {/* <Flex marginTop="5px">
                  <Text fontWeight="bold" color="black">
                    Phone Number:
                  </Text>
                  <Text marginLeft="20px" color="black">
                    {selectedAppointment.recipientPhoneNumber ||
                      "Not available"}
                  </Text>
                </Flex> */}
                {/* <Divider my={4} borderColor="gray.500" /> */}
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

                <Box marginRight="20px">
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
                      Service Plan:
                    </Text>
                    <Text marginLeft="20px" color="black">
                      {selectedAppointment.servicePlan || "Not availabe"}
                    </Text>
                  </Flex>
                  <Divider my={4} borderColor="gray.500" />
                  <Flex marginTop="5px">
                    <Text fontWeight="bold" color="black">
                      Type of caregiver:
                    </Text>
                    <Text marginLeft="20px" color="black">
                      {selectedAppointment.medicSpecialization ||
                        "Not availabe"}
                    </Text>
                  </Flex>
                  <Divider my={4} borderColor="gray.500" />
                  <Flex marginTop="5px">
                    <Text fontWeight="bold" color="black">
                      Cost of service:
                    </Text>
                    <Text marginLeft="20px" color="black">
                      ₦{selectedAppointment.costOfService || "Not availabe"}.00
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
                </Box>

                <Flex marginTop="5px">
                  <Text fontWeight="bold" color="black">
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
              </Flex>
            </DrawerBody>
            <DrawerFooter justifyContent="space-between">
              <Button
                bg="#A210C6"
                color="white"
                _hover={{ color: "" }}
                leftIcon={<EditIcon />}
                fontSize={{ base: "12px", md: "14px" }}
                onClick={handleEditAppointment}
              >
                Edit appointment
              </Button>
              <Button
                fontSize={{ base: "13px", md: "14px" }}
                bg="white"
                color="red.500"
                border="2px solid red"
                _hover={{ color: "" }}
                onClick={() => handleCancelAppointment(selectedAppointment.id)}
              >
                Cancel appointment
              </Button>
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
                bg="red.500"
                color="white"
                marginLeft="5px"
                onClick={handleConfirmation}
              >
                Yes
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
      <EditPendingAppointmentModal
        isOpen={editModalOpen}
        onClose={handleCloseEditModal}
        appointmentDetails={selectedAppointment}
      />
      <BookAppointmentModal
        isOpen={showAppointmentModal}
        onClose={handleCloseAppointmentModal}
      />
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        paymentData={paymentData}
      />
    </Box>
  );
}
