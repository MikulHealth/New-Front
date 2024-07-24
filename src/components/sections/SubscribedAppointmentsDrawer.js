import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerCloseButton,
  DrawerBody,
  DrawerFooter,
  Text,
  Spinner,
  extendTheme,
  Stack,
  ModalHeader,
  ModalBody,
  ModalContent,
  Modal,
  ModalOverlay,
  ModalCloseButton,
  ModalFooter,
} from "@chakra-ui/react";
import axios from "axios";
import { baseUrl } from "../../apiCalls/config";
import { AppointmentDetails, MedicDetailsDrawer } from "../authLayouts/AppointmentsComponents";
import EditPendingAppointmentModal from "./EditPendingAppointmentModal";

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

const SubscribedAppointmentsDrawer = ({
  isOpen,
  onClose,
  user,
}) => {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [medicDetailsOpen, setMedicDetailsOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [cancellingAppointmentId, setCancellingAppointmentId] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  
  

  useEffect(() => {
    if (isOpen) {
      const fetchSubscribedAppointments = async () => {
        setIsLoading(true);
        try {
          const response = await axios.get(
            `${baseUrl}/appointment/subscriptions/${user.userId}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          if (response.data.success) {
            setAppointments(response.data.data);
          } else {
            console.error("Failed to fetch subscribed appointments");
          }
        } catch (error) {
          console.error("Error fetching subscribed appointments:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchSubscribedAppointments();
    }
  }, [isOpen, user.userId]);

  const handleConfirmAction = async () => {
    if (!selectedAppointment) return;
    const { pvbSubId, active } = selectedAppointment;
    const url = active
      ? `${baseUrl}/wallets/schedule-payment/cancel`
      : `${baseUrl}/wallets/schedule-payment/reactivate`;
    const payload = {
      is_active: !active,
      next_charge_attempt: selectedAppointment.endDate,
    };

    try {
      const response = await axios.patch(url, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.status) {
        setAppointments((prevAppointments) =>
          prevAppointments.map((appointment) =>
            appointment.pvbSubId === pvbSubId
              ? { ...appointment, active: !active }
              : appointment
          )
        );
      } else {
        console.error("Failed to update subscription status");
      }
    } catch (error) {
      console.error("Error updating subscription status:", error);
    } finally {
      setIsConfirmModalOpen(false);
      setSelectedAppointment(null);
    }
  };

  const handleActionClick = (appointment) => {
    setSelectedAppointment(appointment);
    setIsConfirmModalOpen(true);
  };

  const handleDetailsClick = (appointment) => {
    setSelectedAppointment(appointment);
  };

  const handleViewMedicDetails = () => {
    setMedicDetailsOpen(true);
  };

  const closeMedicDetailsDrawer = () => {
    setMedicDetailsOpen(false);
  };

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
    <>
      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        theme={customTheme}
        size="md"
        placement="right"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader fontFamily="heading" color="#A210C6">
            {selectedAppointment ? "Appointment Details" : "Subscribed Appointments"}
          </DrawerHeader>
          <DrawerCloseButton />
          <DrawerBody fontFamily="body">
            {isLoading ? (
              <Spinner size="xl" color="#A210C6" />
            ) : selectedAppointment ? (
              <AppointmentDetails
                isOpen={true}
                onClose={() => setSelectedAppointment(null)}
                appointment={selectedAppointment.customerAppointment}
                handleViewMedicDetails={handleViewMedicDetails}
                handleEditAppointment={handleEditAppointment}
                handleCancelAppointment={handleCancelAppointment}
            
              />
            ) : appointments?.length > 0 ? (
              appointments?.map((appointment) => {
                const {
                  customerAppointment: {
                    recipientFirstname,
                    recipientLastname,
                    startDate,
                    endDate,
                    servicePlan,
                    costOfService,
                  },
                  active,
                } = appointment;

                return (
                  <Box
                    key={appointment.customerAppointment.id}
                    mb="10px"
                    p="5px"
                    border="1px solid #E2E8F0"
                    borderRadius="5px"
                  >
                    <Text>
                      Beneficiary Name: {recipientFirstname} {recipientLastname}
                    </Text>
                    <Text>
                      Start Date: {new Date(startDate).toLocaleDateString()}
                    </Text>
                    <Text>
                      Next Renewal Date:{" "}
                      {new Date(endDate).toLocaleDateString()}
                    </Text>
                    <Text>Service Plan: {servicePlan}</Text>
                    <Text>
                      Cost of Service: ₦{Number(costOfService).toLocaleString()}
                    </Text>
                    <Text>Status: {active ? "Active" : "Inactive"}</Text>
                    <Stack
                      justifyContent="space-between"
                      direction="row"
                      spacing={4}
                      mt={2}
                    >
                      <Button
                        bg="linear-gradient(80deg, #A210C6, #E552FF)"
                        color="white"
                        onClick={() => handleDetailsClick(appointment)}
                      >
                        Details
                      </Button>
                      <Button
                        bg={active ? "red.500" : "green.500"}
                        color="white"
                        onClick={() => handleActionClick(appointment)}
                      >
                        {active
                          ? "Cancel Subscription"
                          : "Reactivate Subscription"}
                      </Button>
                    </Stack>
                  </Box>
                );
              })
            ) : (
              <Text fontFamily="body">
                You have no subscribed plan yet. Book an appointment to begin.
              </Text>
            )}
          </DrawerBody>
          <DrawerFooter>
            <Button
              mr={3}
              bg="gray.500"
              color="white"
              onClick={onClose}
            >
              Close
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <Modal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontFamily="heading" color="#A210C6">
            {selectedAppointment?.active
              ? "Cancel Subscription"
              : "Reactivate Subscription"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Are you sure you want to{" "}
              {selectedAppointment?.active ? "cancel" : "reactivate"} this
              subscription?
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button
              mr={3}
              bg="gray.500"
              color="white"
              onClick={handleConfirmAction}
            >
              Yes
            </Button>
            <Button
              bg="linear-gradient(80deg, #A210C6, #E552FF)"
              color="white"
              onClick={() => setIsConfirmModalOpen(false)}
            >
              No
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {selectedAppointment && selectedAppointment.matchedMedic && (
        <MedicDetailsDrawer
          isOpen={medicDetailsOpen}
          onClose={closeMedicDetailsDrawer}
          medic={selectedAppointment.matchedMedic}
          
        />
      )}
       <EditPendingAppointmentModal
        isOpen={editModalOpen}
        onClose={handleCloseEditModal}
        appointmentDetails={selectedAppointment}
      />
    </>
  );
};

export default SubscribedAppointmentsDrawer;
