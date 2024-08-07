import React, { useState, useEffect } from "react";
import axios from "axios";
import LoadingSpinner from "../../utils/Spiner";
import BookAppointmentModal from "../sections/BookAppointment";
import { ToastContainer } from "react-toastify";
import { VStack, Box, useToast, Text } from "@chakra-ui/react";
import PaymentModal from "../sections/PaymentMethod";
import EditPendingAppointmentModal from "../sections/EditPendingAppointmentModal";
import { baseUrl } from "../../apiCalls/config";
import {
  AppointmentList,
  AppointmentDetails,
  CancelAppointmentModal,
  MedicDetailsDrawer,
} from "./AppointmentsComponents";

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
  const [medicDetailsOpen, setMedicDetailsOpen] = useState(false);

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
        `${baseUrl}/appointment/allAppointments`,
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

  const handleConfirmation = async (reason) => {
    try {
      const token = localStorage.getItem("token");
      const apiUrl = `${baseUrl}/appointment/cancelAppointment/${cancellingAppointmentId}`;
  
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
  
      const response = await axios.post(apiUrl, { reason }, { headers });
  
      if (response.data.success) {
        toast({
          description: response.data.message,
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
        fetchData();
        setDetailsModalOpen(false);
      } else {
        toast({
          description: "Error canceling appointment",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        console.error("Error canceling appointment");
      }
    } catch (error) {
      console.error("An error occurred while canceling appointment:", error);
    } finally {
      setConfirmationModalOpen(false);
    }
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

  const handlePayment = (selectedAppointment) => {
    setPaymentData({
      costOfService: selectedAppointment.costOfService,
      appointmentId: selectedAppointment.id,
      endDate: selectedAppointment.endDate,
      startDate: selectedAppointment.startDate,
      beneficiary: `${selectedAppointment.recipientFirstname} ${selectedAppointment.recipientLastname}`,
    });
    setTimeout(() => {
      setIsPaymentModalOpen(true);
    }, 1000);
  };

  const handleViewMedicDetails = () => {
    setMedicDetailsOpen(true);
  };

  const closeMedicDetailsDrawer = () => {
    setMedicDetailsOpen(false);
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
          <AppointmentList
            appointments={appointments}
            handleViewMore={handleViewMore}
          />
        )}
      </VStack>
      {detailsModalOpen && selectedAppointment && (
        <AppointmentDetails
          isOpen={detailsModalOpen}
          onClose={() => setDetailsModalOpen(false)}
          appointment={selectedAppointment}
          handlePayment={handlePayment}
          handleEditAppointment={handleEditAppointment}
          handleCancelAppointment={handleCancelAppointment}
          handleViewMedicDetails={handleViewMedicDetails}
        />
      )}
      {confirmationModalOpen && (
        <CancelAppointmentModal
          isOpen={confirmationModalOpen}
          onClose={handleCancelModalClose}
          handleConfirmation={handleConfirmation}
        />
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
      {selectedAppointment && selectedAppointment.matchedMedic && (
        <MedicDetailsDrawer
          isOpen={medicDetailsOpen}
          onClose={closeMedicDetailsDrawer}
          medic={selectedAppointment.matchedMedic}
        />
      )}
    </Box>
  );
}
