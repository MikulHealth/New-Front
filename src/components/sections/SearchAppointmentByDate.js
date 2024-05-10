import React, { useState, useEffect } from "react";
import {
  VStack,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Box,
  Flex,
  Progress,
} from "@chakra-ui/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SearchAppointmentsModal = ({ isOpen, onClose }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [noAppointmentsFound, setNoAppointmentsFound] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [searchTrigger, setSearchTrigger] = useState(false);

  const formatDateToUTC = (selectedDate) => {
    if (!selectedDate) return "";

    // Add one day to the selected date
    const adjustedDate = new Date(selectedDate);
    adjustedDate.setDate(adjustedDate.getDate() + 1);

    return adjustedDate.toISOString().split("T")[0];
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        if (!searchTrigger) return;

        const token = localStorage.getItem("token");
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.get(
          `http://localhost:8080/v1/appointment/customerAppointmentsByDate?date=${formatDateToUTC(
            selectedDate
          )}`,
          // "https://backend-c1pz.onrender.comhttps://backend-c1pz.onrender.com/v1/appointment/pendingAppointments",
          config
        );

        if (response.data.success) {
          toast.success(response.data.message);
          setAppointments(response.data.data);
          setNoAppointmentsFound(response.data.data.length === 0);
        } else {
          toast.success(response.data.message);
          setAppointments([]);
          console.error("Failed to fetch appointments");
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
        setSearchTrigger(false);
      }
    };

    if (searchTrigger) {
      setLoading(true);
      fetchAppointments();
    }
  }, [selectedDate, searchTrigger, isOpen]);

  const fetchAndDisplayAppointmentDetails = async (appointmentId) => {
    try {
      const token = localStorage.getItem("token");
      const apiUrl = `https://backend-c1pz.onrender.com/v1/appointment/findAppointmentDetails/${appointmentId}`;
      // const apiUrl = `http://localhost:8080/v1/appointment/findAppointmentDetails/${appointmentId}`;

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
  const handleDateChange = (date) => {
    // const nextDay = new Date(date);
    // nextDay.setDate(date.getDate());
    setSelectedDate(date);
    setSearchTrigger(true);
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

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = new Date(dateString).toLocaleDateString(
      undefined,
      options
    );
    return formattedDate;
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          setSelectedDate(null);
          setAppointments([]);
        }}
        size="xl"
        isCentered
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
        <ModalContent>
          <ModalHeader color="#A210C6">Search appointments</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {loading ? (
              <Progress size="xs" isIndeterminate />
            ) : (
              <Box mb="40px">
                <DatePicker
                  _hover={{ color: "#A210C6" }}
                  selected={selectedDate}
                  onChange={handleDateChange}
                  maxDate={new Date()}
                  peekNextMonth
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  dateFormat="dd-MM-yyyy"
                  placeholderText="Select a date"
                  className="form-control"
                  // style={{
                  //   border: "1px solid #ced4da",
                  //   borderRadius: "4px",
                  //   marginLeft: "10px",
                  //   cursor: "pointer",
                  //   // marginBottom: "40px",
                  // }}
                />

                <Flex mt="20px">
                  {noAppointmentsFound ? (
                    <Text>No appointments found for the selected date.</Text>
                  ) : (
                    <VStack spacing={4} width="100%">
                      {appointments.map((appointment) => (
                        <Box
                          style={{
                            boxShadow: "0px 4px 8px rgba(162, 16, 198, 0.4)",
                            transition: "transform 0.3s ease-in-out",
                          }}
                          key={appointment.id}
                          p={4}
                          shadow="md"
                          borderWidth="1px"
                        >
                          <Flex flexDirection={{base: "column", md: "row"}}>
                            <Text fontWeight="bold" color="black">
                              Care beneficiary:
                            </Text>
                            <Text ml={{md: "5px"}} color="black">
                              {`${appointment.recipientFirstname} ${appointment.recipientLastname}`}
                            </Text>
                          </Flex>
                            <Flex flexDirection={{base: "column", md: "row"}}>
                              <Text fontWeight="bold" color="black">
                                Booked on:
                              </Text>
                              <Text ml={{md: "5px"}} color="black">
                                {formatDateTime(appointment.createdAt)}
                              </Text>
                              <Text
                                fontSize="16px"
                                ml={{md: "60px"}}
                                mt={{base: "10px", md: "0"}}
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
                            </Flex>
                        </Box>
                      ))}
                    </VStack>
                  )}
                </Flex>
              </Box>
            )}
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
      {detailsModalOpen && selectedAppointment && (
        <Modal
          isOpen={detailsModalOpen}
          onClose={() => {
            setDetailsModalOpen(false);
            handleDateChange(null);
          }}
          size="3xl"
        >
          <ModalOverlay />
          <ModalContent overflowY="auto">
            <ModalHeader color="#A210C6">Appointment Details</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Flex marginLeft="30px">
                <Box>
                  <Flex>
                    <Box>
                      <Flex>
                        <Text fontWeight="bold" color="black">
                          Care beneficiary:
                        </Text>
                        <Text marginLeft="5px" color="black">
                          {selectedAppointment.recipientFirstname &&
                          selectedAppointment.recipientLastname
                            ? `${selectedAppointment.recipientFirstname} ${selectedAppointment.recipientLastname}`
                            : "Not available"}
                        </Text>
                      </Flex>

                      <Flex marginTop="5px">
                        <Text fontWeight="bold" color="black">
                          Gender:
                        </Text>
                        <Text marginLeft="5px" color="black">
                          {selectedAppointment.recipientGender ||
                            "Not available"}
                        </Text>
                      </Flex>

                      <Flex marginTop="5px">
                        <Text fontWeight="bold" color="black">
                          Date of Birth:
                        </Text>
                        <Text marginLeft="5px" color="black">
                          {formatDate(selectedAppointment.recipientDOB) ||
                            "Not available"}
                        </Text>
                      </Flex>

                      <Flex marginTop="5px">
                        <Text fontWeight="bold" color="black">
                          Current Location:
                        </Text>
                        <Text marginLeft="5px" color="black">
                          {selectedAppointment.currentLocation ||
                            "Not availabe"}
                        </Text>
                      </Flex>

                      <Flex marginTop="5px">
                        <Text fontWeight="bold" color="black">
                          Next of kin name:
                        </Text>
                        <Text marginLeft="5px" color="black">
                          {selectedAppointment.kinName || "Not available"}
                        </Text>
                      </Flex>

                      <Flex marginTop="5px">
                        <Text fontWeight="bold" color="black">
                          Next of kin number:
                        </Text>
                        <Text marginLeft="5px" color="black">
                          {selectedAppointment.kinNumber || "Not availabe"}
                        </Text>
                      </Flex>

                      <Flex marginTop="5px">
                        <Text fontWeight="bold" color="black">
                          Language:
                        </Text>
                        <Text marginLeft="5px" color="black">
                          {selectedAppointment.language || "Not available"}
                        </Text>
                      </Flex>

                      <Flex marginTop="5px">
                        <Text fontWeight="bold" color="black">
                          Relationship:
                        </Text>
                        <Text marginLeft="5px" color="black">
                          {selectedAppointment.relationship || "Not availabe"}
                        </Text>
                      </Flex>
                      <Flex marginTop="5px" marginBottom="10px">
                        <Text fontWeight="bold" color="black">
                          Booked on:
                        </Text>
                        <Text marginLeft="5px" color="black">
                          {formatDateTime(selectedAppointment.createdAt)}
                        </Text>
                      </Flex>
                    </Box>

                    <Box marginLeft="30px">
                      <Flex marginTop="2px">
                        <Text fontWeight="bold" color="black">
                          Shift:
                        </Text>
                        <Text marginLeft="5px" color="black">
                          {selectedAppointment.shift || "Not availabe"}
                        </Text>
                      </Flex>
                      <Flex marginTop="5px">
                        <Text fontWeight="bold" color="black">
                          Contact number:
                        </Text>
                        <Text marginLeft="5px" color="black">
                          {selectedAppointment.recipientPhoneNumber ||
                            "Not availabe"}
                        </Text>
                      </Flex>
                      <Flex marginTop="5px">
                        <Text fontWeight="bold" color="black">
                          Hospital:
                        </Text>
                        <Text marginLeft="5px" color="black">
                          {selectedAppointment.recipientHospital ||
                            "Not availabe"}
                        </Text>
                      </Flex>

                      <Flex marginTop="5px">
                        <Text fontWeight="bold" color="black">
                          Service Plan
                        </Text>
                        <Text marginLeft="5px" color="black">
                          {selectedAppointment.servicePlan || "Not availabe"}
                        </Text>
                      </Flex>
                      <Flex marginTop="5px">
                        <Text fontWeight="bold" color="black">
                          Cost of service
                        </Text>
                        <Text marginLeft="5px" color="black">
                          {selectedAppointment.costOfService || "Not availabe"}
                        </Text>
                      </Flex>
                      <Flex marginTop="5px">
                        <Text fontWeight="bold" color="black">
                          Start Date:
                        </Text>
                        <Text marginLeft="5px" color="black">
                          {formatDateTime(selectedAppointment.startDate) ||
                            "Not availabe"}
                        </Text>
                      </Flex>
                      <Flex marginTop="5px">
                        <Text fontWeight="bold" color="black">
                          End Date:
                        </Text>
                        <Text marginLeft="5px" color="black">
                          {formatDateTime(selectedAppointment.endDate) ||
                            "Not availabe"}
                        </Text>
                      </Flex>
                      <Flex marginTop="5px">
                        <Text fontWeight="bold" color="black">
                          Medical Report:
                        </Text>
                        <Text marginLeft="5px" color="black">
                          {selectedAppointment.medicalReport || "Not availabe"}
                        </Text>
                      </Flex>
                    </Box>
                  </Flex>
                  <Text fontWeight="bold" color="black">
                    Health History:
                  </Text>
                  <Text marginLeft="5px" color="black">
                    {selectedAppointment.recipientHealthHistory ||
                      "Not availabe"}
                  </Text>
                </Box>
              </Flex>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default SearchAppointmentsModal;
