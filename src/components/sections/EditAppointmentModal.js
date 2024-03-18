import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import {
  VStack,
  Text,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Box,
  Flex,
  Input,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  FormControl,
  FormLabel,
  Textarea,
  Select,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";

const EditAppointmentModal = ({ isOpen, onClose, appointmentId, onSave }) => {
  const [formData, setFormData] = useState({
    recipientFirstname: "",
    recipientLastname: "",
    recipientPhoneNumber: "",
    recipientGender: "",
    DOB: "",
    currentLocation: "",
    shift: "",
    recipientDoctor: "",
    recipientDoctorNumber: "",
    recipientHospital: "",
    recipientHealthHistory: "",
    servicePlan: "",
    costOfService: "",
    startDate: "",
    endDate: "",
    medicalReport: "",
  });

  const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const cancelRef = React.useRef();
  const toast = useToast();

//   useEffect(() => {
//     const fetchAppointmentDetails = async () => {
//       try {
//         const token = localStorage.getItem("token");
  
//         const response = await axios.get(
//           `http://localhost:8080/v1/appointment/findAppointmentDetails/${appointmentId}`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
  
//         if (response.data.success) {
//           const appointmentDetails = response.data.data;
//           setFormData({
//             recipientFirstname: appointmentDetails.recipientFirstname,
//             recipientLastname: appointmentDetails.recipientLastname,
//             recipientPhoneNumber: appointmentDetails.recipientPhoneNumber,
//             recipientGender: appointmentDetails.recipientGender || "",
//             DOB: appointmentDetails.DOB || "",
//             currentLocation: appointmentDetails.currentLocation || "",
//             shift: appointmentDetails.shift || "",
//             recipientDoctor: appointmentDetails.recipientDoctor || "",
//             recipientDoctorNumber:
//               appointmentDetails.recipientDoctorNumber || "",
//             recipientHospital: appointmentDetails.recipientHospital || "",
//             recipientHealthHistory:
//               appointmentDetails.recipientHealthHistory || "",
//             servicePlan: appointmentDetails.servicePlan || "",
//             costOfService: appointmentDetails.costOfService || "",
//             startDate: appointmentDetails.startDate || "",
//             endDate: appointmentDetails.endDate || "",
//             medicalReport: appointmentDetails.medicalReport || "",
//           });
//         } else {
//           console.error("Error fetching appointment details");
//         }
//       } catch (error) {
//         console.error("Error fetching appointment details:", error);
//       }
//     };
  
//     if (isOpen) {
//       fetchAppointmentDetails();
//     }
//   }, [appointmentId, isOpen]);
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleStartDateChange = (date) => {
    setFormData({
      ...formData,
      startDate: date,
    });
  };

  const handleEndDateChange = (date) => {
    setFormData({
      ...formData,
      endDate: date,
    });
  };

  const handleSaveChanges = (e) => {
    e.preventDefault(); 
  
    setConfirmationModalOpen(true);
  };

  const handleConfirmationCancel = () => {
    setConfirmationModalOpen(false);
  };

  const handleConfirmationConfirm = async () => {
    try {
      const token = localStorage.getItem("token");
  
      // Get the initial appointment details from the server
      const initialResponse = await axios.get(
        // `http://localhost:8080/v1/appointment/findAppointmentDetails/${appointmentId}`,
        `https://backend-c1pz.onrender.com/v1/appointment/findAppointmentDetails/${appointmentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (!initialResponse.data.success) {
        console.error("Error fetching initial appointment details");
        return;
      }
  
      const initialAppointmentDetails = initialResponse.data.data;
  
      // Create an object to store only the changed fields
      const changedFields = {};
  
      // Check each field against the initial details
      for (const key in formData) {
        if (formData[key] !== initialAppointmentDetails[key]) {
          changedFields[key] = formData[key];
        }
      }
  
      // Send only the changed fields to the server
      const response = await axios.post(
        // `http://localhost:8080/v1/appointment/editAppointmentDetails/${appointmentId}`,
        `https://backend-c1pz.onrender.com/v1/appointment/editAppointmentDetails/${appointmentId}`,
        changedFields,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.data.success) {
        toast({
          title: "Appointment changed successfully",
          status: "success",
          duration: 6000,
        });
        onSave(response.data.data);
        onClose();
      } else {
        console.error("Error updating appointment details");
        const errorMessage = response.data ? response.data.message : "Unknown error";
        toast({
          title: "Update failed",
          description: errorMessage,
          status: "error",
          duration: 6000,
        });
      }
    } catch (error) {
      console.error("Error updating appointment details:", error);
    } finally {
      setConfirmationModalOpen(false);
    }
  };
  
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="xl" overflowY="auto">
        <ModalOverlay />
        <ModalContent maxH="85vh" overflowY="auto">
        <form onSubmit={handleSaveChanges}>
            <ModalHeader color="#A210C6">Edit Appointment Details</ModalHeader>
            <Text marginLeft="25px" marginBottom="10px">
                Kindly edit only the input field(s) <br></br>you want to update and save the changes</Text>
            <ModalCloseButton />
            <ModalBody overflowY="auto">
              <VStack spacing={4} align="start">
                <Flex>
                  <FormControl>
                    <FormLabel fontWeight="bold" color="black">
                      Phone Number:
                    </FormLabel>
                    <Input
                      name="recipientPhoneNumber"
                      value={formData.recipientPhoneNumber}
                      onChange={handleInputChange}
                      type="tel"
                      w="255px"
                    />
                  </FormControl>

                  <FormControl marginLeft="5px">
                    <FormLabel fontWeight="bold" color="black">
                      Current Location:
                    </FormLabel>
                    <Input
                      name="currentLocation"
                      value={formData.currentLocation}
                      onChange={handleInputChange}
                      w="255px"
                    />
                  </FormControl>
                </Flex>
                <Flex>
                <FormControl>
                    <FormLabel fontWeight="bold" color="black">
                      Personal Doctor's name:
                    </FormLabel>
                    <Input
                      name="recipientDoctor"
                      value={formData.recipientDoctor}
                      onChange={handleInputChange}
                      w="255px"
                    />
                  </FormControl>

                  <FormControl marginLeft="5px">
                    <FormLabel fontWeight="bold" color="black">
                      Doctor's phone number:
                    </FormLabel>
                    <Input
                      name="recipientDoctorNumber"
                      value={formData.recipientDoctorNumber}
                      onChange={handleInputChange}
                      w="255px"
                    />
                  </FormControl>
                </Flex>

                <FormControl  marginLeft="5px">
                  <FormLabel fontWeight="bold" color="black">
                    Hospital:
                  </FormLabel>
                  <Input
                    name="recipientHospital"
                    value={formData.recipientHospital}
                    onChange={handleInputChange}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel fontWeight="bold" color="black">
                    Health History:
                  </FormLabel>
                  <Textarea
                    name="recipientHealthHistory"
                    value={formData.recipientHealthHistory}
                    onChange={handleInputChange}
                  />
                </FormControl>

                <Flex marginTop="1px">
                  <Box>
                    <FormLabel marginTop="20px">Preferred Shift </FormLabel>
                    <Select
                      name="shift"
                      placeholder="Select preferred shift"
                      w="250px"
                      onChange={handleInputChange}
                    >
                      <option value="Day Shift">Day Shift (8hrs)</option>
                      <option value="Night Shift">Night Shift (12hrs)</option>
                      <option value="Live in">Live in (24hrs)</option>
                    </Select>
                  </Box>
                  <Box marginLeft="5px">
                    <FormLabel marginTop="20px">Service Plan </FormLabel>
                    <Select
                      name="servicePlan"
                      placeholder="preferred service plan"
                      w="250px"
                      onChange={handleInputChange}
                    >
                      <option value="Elderly care">Elderly care</option>
                      <option value="Postpartum care">Postpartum care</option>
                      <option value="Recovery care">Recovery care</option>
                    </Select>
                  </Box>
                </Flex>

                <Flex marginTop="1px">
                  <Box w="250px">
                    <FormLabel marginTop="20px">Start Date</FormLabel>
                    <DatePicker
                      selected={formData.startDate}
                      onChange={handleStartDateChange}
                      peekNextMonth
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      dateFormat="yyyy-MM-dd"
                      placeholderText="Preferred start date"
                    />
                  </Box>
                  <Box w="250px" marginLeft="5px">
                    <FormLabel marginTop="20px">End Date</FormLabel>
                    <DatePicker
                      selected={formData.endDate}
                      onChange={handleEndDateChange}
                      peekNextMonth
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      dateFormat="yyyy-MM-dd"
                      placeholderText="Preferred end date"
                    />
                  </Box>
                </Flex>

                <FormControl>
                  <FormLabel fontWeight="bold" color="black">
                    Medical Report:
                  </FormLabel>
                  <Input
                    name="medicalReport"
                    type="file"
                    onChange={handleInputChange}
                    w="250px"
                  />
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button type="submit" colorScheme="blue">
                Save Changes
              </Button>
              <Button marginLeft="2" colorScheme="red" onClick={onClose}>
                Cancel
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      {/* Confirmation Modal */}
      <AlertDialog
        isOpen={isConfirmationModalOpen}
        leastDestructiveRef={cancelRef}
        onClose={handleConfirmationCancel}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Confirm Save Changes
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to save changes to this appointment?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={handleConfirmationCancel}>
                Cancel
              </Button>
              <Button
                colorScheme="blue"
                onClick={handleConfirmationConfirm}
                ml={3}
              >
                Confirm
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default EditAppointmentModal;
