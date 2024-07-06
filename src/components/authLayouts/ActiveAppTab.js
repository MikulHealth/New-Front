import React, { useState, useEffect } from "react";
import axios from "axios";
import LoadingSpinner from "../../utils/Spiner";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { VStack, Box, Text } from "@chakra-ui/react";
import { AppointmentList, AppointmentDetails, MedicDetailsDrawer } from "./AppointmentsComponents";

export default function ActiveApp() {
  const [pendingAppointments, setPendingAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [medicDetailsOpen, setMedicDetailsOpen] = useState(false);

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
        "https://backend-c1pz.onrender.com/v1/appointment/matchedAppointments",
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

  const handleViewMore = (appointment) => {
    setSelectedAppointment(appointment);
    setDetailsModalOpen(true);
  };

  const handleViewMedicDetails = () => {
    setMedicDetailsOpen(true);
  };

  const closeMedicDetailsDrawer = () => {
    setMedicDetailsOpen(false);
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
            No active appointment.
          </Text>
        ) : (
          <AppointmentList
            appointments={pendingAppointments}
            handleViewMore={handleViewMore}
          />
        )}
      </VStack>
      {detailsModalOpen && selectedAppointment && (
        <AppointmentDetails
          isOpen={detailsModalOpen}
          onClose={closeDetailsDrawer}
          appointment={selectedAppointment}
          handleViewMedicDetails={handleViewMedicDetails}
        />
      )}
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
