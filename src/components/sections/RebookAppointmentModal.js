import React, { useState } from "react";
import axios from "axios";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";

import { useSelector } from "react-redux";
import { baseUrl } from "../../apiCalls/config";
import PaymentModal from "./PaymentMethod";
import { formatDateToUTC, calculateUrgency } from "./helpers";

import { ToastContainer, toast } from "react-toastify";

const RebookAppointmentModal = ({ isOpen, onClose, appointment }) => {
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [endDate, setEndDate] = React.useState("");
  const [loading, setLoading] = useState(false);

  const { user } = useSelector((state) => state.userReducer);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentData, setPaymentData] = useState({});
  const [priority, setPriority] = useState("");

  const calculateEndDate = (startDate, duration) => {
    const start = new Date(startDate);
    start.setDate(start.getDate() + duration);
    return start.toISOString().split("T")[0];
  };

  const handleStartDateChange = (event) => {
    const date = event.target.value;
    setSelectedStartDate(date);
    console.log("date: ", date)
    formatDateToUTC(new Date(date));
    calculateUrgency(date, setPriority);
    if (appointment.duration) {
      const estimatedEndDate = calculateEndDate(date, appointment.duration);
      setEndDate(estimatedEndDate);
    }
  };

  const handleRebook = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const apiUrl = `${baseUrl}/appointment/rebook`;

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const formDataWithDates = {
        startDate: selectedStartDate,
        endDate: endDate,
        customerId: user?.userId,
        appointmentId: appointment?.id,
        priority,
      };

      const requestBody = JSON.stringify(formDataWithDates);
      const response = await axios.post(apiUrl, requestBody, { headers });

      if (response.data.success) {
        setLoading(false);
        toast.success("Appointment rebooked");
        setPaymentData({
          costOfService: response.data.data.costOfService,
          appointmentId: response.data.data.id,
          startDate: response.data.data.startDate,
          endDate: response.data.data.endDate,
          beneficiary: `${response.data.data.recipientFirstname} ${response.data.data.recipientLastname}`,
        });

        setTimeout(() => {
          setIsPaymentModalOpen(true);
        }, 4000);
      } else {
        setLoading(false);
        console.error(response.data.message);
        toast.error(response.data.message);
      }
    } catch (error) {
      setLoading(false);
      console.error("An error occurred:", error);
      toast.error("Error booking appointment");
    }
  };

  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size={{ base: "sm", sm: "md", md: "lg" }}
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
        <ModalOverlay />
        <ModalContent mx={{ base: 4, sm: 0 }}>
          <ModalHeader textAlign="center" color="#A210C6">
            Rebook Appointment <br></br> for {appointment?.recipientFirstname}{" "}
            {appointment?.recipientLastname}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody textAlign="left">
            <Text mb="20px">
              To rebook the appointment you would have to enter a new start
              date, the end date would be determined by the service plan in the
              appointment.
            </Text>
            <FormControl>
              <FormLabel>Start Date</FormLabel>
              <Input
                type="date"
                value={selectedStartDate}
                onChange={handleStartDateChange}
                min={getCurrentDate()}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>End Date</FormLabel>
              <Input
                type="date"
                disabled
                value={endDate}
                placeholder="estimated end date"
                dateFormat="dd-MM-yyyy"
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              isLoading={loading}
              loadingText="Loading..."
              bg="linear-gradient(80deg, #A210C6, #E552FF)"
              color="white"
              mr={3}
              onClick={handleRebook}
            >
              {loading ? "Loading..." : "Rebook"}
            </Button>
            <Button bg="gray.500" color="white" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        paymentData={paymentData}
      />
    </>
  );
};

export default RebookAppointmentModal;
