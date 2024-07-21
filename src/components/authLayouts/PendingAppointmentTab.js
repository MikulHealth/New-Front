import React, { useState, useEffect } from "react";
import LoadingSpinner from "../../utils/Spiner";
import axios from "axios";
import { EditIcon, CheckIcon, CloseIcon, WarningIcon } from "@chakra-ui/icons";
import EditPendingAppointmentModal from "../sections/EditPendingAppointmentModal";
import { baseUrl } from "../../apiCalls/config";
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
  useToast,
  Box,
  Text,
  Flex,
  Divider,
} from "@chakra-ui/react";
import PaymentModal from "../sections/PaymentMethod";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function PendingApp() {
  const toast = useToast();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentData, setPaymentData] = useState({});
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
      costOfService: selectedAppointment.customerAppointment.costOfService,
      appointmentId: selectedAppointment.customerAppointment.id,
      beneficiary: `${selectedAppointment.customerAppointment.recipientFirstname} ${selectedAppointment.customerAppointment.recipientLastname}`,
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
    setSelectedAppointment(null);
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
        `${baseUrl}/appointment/pendingAppointments`,
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

    const date = new Date(dateString);
    date.setHours(date.getHours() + 1);

    const formattedDate = date.toLocaleDateString(undefined, options);

    return formattedDate;
  };

  const handleViewMore = (appointmentId) => {
    const appointment = pendingAppointments.find(
      (app) => app.id === appointmentId
    );
    setSelectedAppointment(appointment || null);
    setDetailsModalOpen(true);
  };

  const handleConfirmation = async () => {
    try {
      const token = localStorage.getItem("token");
      const apiUrl = `${baseUrl}/appointment/cancelAppointment/${cancellingAppointmentId}`;

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
      className="pending-appointment"
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
        ) : pendingAppointments.length === 0 ? (
          <Text
            w={{ base: "90vw", md: "60vw" }}
            ml={{ base: "-8px", md: "-20px" }}
            fontSize={{ base: "12px", md: "16px" }}
          >
            No pending appointments.
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
              {pendingAppointments.map((appointment) => (
                <Box
                  style={{ cursor: "pointer" }}
                  key={appointment.id}
                  onClick={() => handleViewMore(appointment.id)}
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
                      {`${appointment.customerAppointment.recipientFirstname} ${appointment.customerAppointment.recipientLastname}`}
                    </Text>
                    <Text maxW={{ base: "50px", md: "120px" }}>
                      {`${appointment.customerAppointment.shift} `}
                    </Text>
                    <Text
                      maxW={{ base: "60px", md: "120px" }}
                      wordWrap="break-word"
                    >
                      {`${appointment.customerAppointment.servicePlan} `}
                    </Text>
                    <Box
                      w={{ base: "50px", md: "97px" }}
                      h={{ base: "25px", md: "33px" }}
                      textAlign="center"
                      borderRadius="10px"
                      p="5px"
                      bg={
                        appointment.customerAppointment.appointmentPending
                          ? "#F4DDA2"
                          : "#F4DDA2"
                      }
                    >
                      <Text
                        fontSize={{ base: "10px", md: "14px" }}
                        color={
                          appointment.customerAppointment?.appointmentPending
                            ? "#B48B25"
                            : "#B48B25"
                        }
                      >
                        {appointment.customerAppointment?.appointmentPending
                          ? "Pending"
                          : "Paired"}
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
                        color={
                          appointment.customerAppointment?.paid
                            ? "#057B1F"
                            : "red.500"
                        }
                      >
                        {appointment.customerAppointment?.paid
                          ? "Paid"
                          : "Unpaid"}
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
            {!selectedAppointment.customerAppointment.paid && (
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
            <DrawerBody>
              <Flex flexDirection="column">
                <Flex justifyContent="space-between" alignItems="center">
                  <Text fontWeight="bold">Status</Text>
                  <Text
                    fontSize="16px"
                    color={
                      selectedAppointment?.customerAppointment
                        ?.appointmentCompleted
                        ? "green.500"
                        : selectedAppointment?.customerAppointment
                            ?.appointmentActive
                        ? "blue.500"
                        : selectedAppointment?.customerAppointment
                            ?.appointmentMatched
                        ? "yellow.500"
                        : selectedAppointment?.customerAppointment
                            ?.appointmentPending
                        ? "yellow.500"
                        : "black"
                    }
                  >
                    {selectedAppointment?.customerAppointment
                      ?.appointmentCompleted
                      ? "Completed"
                      : selectedAppointment?.customerAppointment
                          ?.appointmentActive
                      ? "Active"
                      : selectedAppointment?.customerAppointment
                          ?.appointmentMatched
                      ? "Paired"
                      : selectedAppointment?.customerAppointment
                          ?.appointmentPending
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
                    {selectedAppointment?.customerAppointment
                      ?.recipientFirstname &&
                    selectedAppointment?.customerAppointment?.recipientLastname
                      ? `${selectedAppointment?.customerAppointment?.recipientFirstname} ${selectedAppointment?.customerAppointment?.recipientLastname}`
                      : "Not available"}
                  </Text>
                </Flex>
                <Divider my={4} borderColor="gray.500" />
                <Flex marginTop="5px">
                  <Text fontWeight="bold" color="black">
                    Phone Number:
                  </Text>
                  <Text marginLeft="20px" color="black">
                    {selectedAppointment?.customerAppointment
                      ?.recipientPhoneNumber || "Not available"}
                  </Text>
                </Flex>
                <Divider my={4} borderColor="gray.500" />
                <Flex marginTop="5px">
                  <Text fontWeight="bold" color="black">
                    Gender:
                  </Text>
                  <Text marginLeft="20px" color="black">
                    {selectedAppointment?.customerAppointment
                      ?.recipientGender || "Not available"}
                  </Text>
                </Flex>
                <Divider my={4} borderColor="gray.500" />
                <Flex marginTop="5px">
                  <Text fontWeight="bold" color="black">
                    Date of Birth:
                  </Text>
                  <Text marginLeft="20px" color="black">
                    {formatDate(
                      selectedAppointment?.customerAppointment?.recipientDOB
                    ) || "Not available"}
                  </Text>
                </Flex>
                <Divider my={4} borderColor="gray.500" />
                <Flex marginTop="5px">
                  <Text fontWeight="bold" color="black">
                    Current Location:
                  </Text>
                  <Text marginLeft="20px" color="black">
                    {selectedAppointment?.customerAppointment
                      ?.currentLocation || "Not availabe"}
                  </Text>
                </Flex>
                <Divider my={4} borderColor="gray.500" />
                <Flex marginTop="5px">
                  <Text fontWeight="bold" color="black">
                    City/Town:
                  </Text>
                  <Text marginLeft="20px" color="black">
                    {selectedAppointment?.customerAppointment.recipientTown ||
                      "Not available"}
                  </Text>
                </Flex>
                <Divider my={4} borderColor="gray.500" />
                <Flex marginTop="5px">
                  <Text fontWeight="bold" color="black">
                    Preferred Caregiver Gender:
                  </Text>
                  <Text marginLeft="20px" color="black">
                    {selectedAppointment?.customerAppointment
                      .preferredMedicGender || "Not available"}
                  </Text>
                </Flex>
                <Divider my={4} borderColor="gray.500" />
                <Flex marginTop="5px">
                  <Text fontWeight="bold" color="black">
                    Preferred Cargiver Language:
                  </Text>
                  <Text marginLeft="20px" color="black">
                    {selectedAppointment?.customerAppointment
                      .preferredLanguage || "Not available"}
                  </Text>
                </Flex>
                <Divider my={4} borderColor="gray.500" />

                <Flex marginTop="5px">
                  <Text fontWeight="bold" color="black">
                    Relationship:
                  </Text>
                  <Text marginLeft="20px" color="black">
                    {selectedAppointment?.customerAppointment?.relationship ||
                      "Nil"}
                  </Text>
                </Flex>
                <Divider my={4} borderColor="gray.500" />
                <Flex marginTop="5px" marginBottom="10px">
                  <Text fontWeight="bold" color="black">
                    Booked on:
                  </Text>
                  <Text marginLeft="20px" color="black">
                    {formatDateTime(
                      selectedAppointment?.customerAppointment?.createdAt
                    )}
                  </Text>
                </Flex>
                <Divider my={4} borderColor="gray.500" />
                <Box marginRight="20px">
                  <Flex>
                    <Text fontWeight="bold" color="black">
                      Shift:
                    </Text>
                    <Text marginLeft="20px" color="black">
                      {selectedAppointment?.customerAppointment?.shift ||
                        "Not availabe"}
                    </Text>
                  </Flex>
                  <Divider my={4} borderColor="gray.500" />
                  <Flex marginTop="5px">
                    <Text fontWeight="bold" color="black">
                      Service Plan:
                    </Text>
                    <Text marginLeft="20px" color="black">
                      {selectedAppointment?.customerAppointment?.servicePlan ||
                        "Not availabe"}
                    </Text>
                  </Flex>
                  <Divider my={4} borderColor="gray.500" />
                  <Flex marginTop="5px">
                    <Text fontWeight="bold" color="black">
                      Type of caregiver:
                    </Text>
                    <Text marginLeft="20px" color="black">
                      {selectedAppointment?.customerAppointment
                        ?.medicSpecialization || "Not availabe"}
                    </Text>
                  </Flex>
                  <Divider my={4} borderColor="gray.500" />
                  <Flex marginTop="5px">
                    <Text fontWeight="bold" color="black">
                      Cost of service:
                    </Text>
                    <Text marginLeft="20px" color="black">
                      {formattedCost(
                        selectedAppointment?.customerAppointment?.costOfService
                      ) || "Not availabe"}
                    </Text>
                  </Flex>
                  <Divider my={4} borderColor="gray.500" />
                  <Flex marginTop="5px">
                    <Text fontWeight="bold" color="black">
                      Start Date:
                    </Text>
                    <Text marginLeft="20px" color="black">
                      {formatDate(
                        selectedAppointment?.customerAppointment?.startDate
                      ) || "Not availabe"}
                    </Text>
                  </Flex>
                  <Divider my={4} borderColor="gray.500" />
                  <Flex marginTop="5px">
                    <Text fontWeight="bold" color="black">
                      Medical Report:
                    </Text>
                    <Text marginLeft="20px" color="black">
                      {selectedAppointment?.customerAppointment
                        ?.medicalReport || "Not availabe"}
                    </Text>
                  </Flex>
                  <Divider my={4} borderColor="gray.500" />
                  <Flex marginTop="5px">
                    <Text fontWeight="bold" color="black">
                      Paid:
                    </Text>
                    <Text marginLeft="20px" color="black">
                      {selectedAppointment?.customerAppointment?.paid
                        ? "Yes"
                        : "No"}
                    </Text>
                  </Flex>
                  <Divider my={4} borderColor="gray.500" />
                </Box>
              </Flex>
              <Box>
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
                    {selectedAppointment?.customerAppointment
                      .recipientHealthHistory || "Not available"}
                  </Text>
                </Flex>
                <Divider my={4} borderColor="gray.500" />
              </Box>
              <Box>
                <Flex marginTop="5px">
                  <Text fontWeight="bold" color="black">
                    Special Needs:
                  </Text>
                  <Text
                    marginLeft="10px"
                    color="black"
                    maxW="600px"
                    maxH="1000px"
                  >
                    {selectedAppointment?.customerAppointment.specialNeeds &&
                    selectedAppointment?.customerAppointment.specialNeeds
                      .length > 0
                      ? selectedAppointment?.customerAppointment.specialNeeds.join(
                          ", "
                        )
                      : "Not available"}
                  </Text>
                </Flex>
                <Divider my={4} borderColor="gray.500" />
              </Box>
            </DrawerBody>
            <DrawerFooter justifyContent="space-between">
              <Button
                bg="gray.500"
                color="white"
                _hover={{ color: "" }}
                onClick={closeDetailsDrawer}
              >
                Cancel
              </Button>

              <Box>
                <Button
                  // bg="#A210C6"
                  bg="linear-gradient(80deg, #A210C6, #E552FF)"
                  color="white"
                  _hover={{ color: "" }}
                  leftIcon={<EditIcon />}
                  onClick={handleEditAppointment}
                >
                  Edit
                </Button>
                <Button
                  ml="10px"
                  bg="#E1ACAE"
                  color="red.500"
                  _hover={{ color: "" }}
                  onClick={() =>
                    handleCancelAppointment(
                      selectedAppointment?.customerAppointment.id
                    )
                  }
                >
                  Delete
                </Button>
              </Box>
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
                // bg="#A210C6"
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
