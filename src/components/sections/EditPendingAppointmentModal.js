import React, { useState, useEffect } from "react";
import CalenderIcon from "../../assets/CalenderIcon.svg";
import DatePicker from "react-datepicker";
import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerBody,
  Button,
  FormControl,
  FormLabel,
  useToast,
  Box,
  Image,
  Textarea,
  Flex,
  Input,
} from "@chakra-ui/react";
import axios from "axios";

const EditPendingAppointment = ({
  isOpen,
  onClose,
  appointmentDetails,
  onSubmit,
}) => {
  const toast = useToast();
  const [formData, setFormData] = useState(appointmentDetails);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // const handleSubmit = () => {
  //   onSubmit(formData);
  //   onClose();
  // };

  useEffect(() => {
    setFormData(appointmentDetails);
  }, [appointmentDetails]);

  const handleStartDateChange = (date) => {
    setSelectedStartDate(date);
    setFormData({ ...formData, startDate: date });
  };

  const handleEndDateChange = (date) => {
    setSelectedEndDate(date);
    setFormData({ ...formData, endDate: date });
  };

  const handleConfirmationCancel = () => {
    setConfirmationModalOpen(false);
  };

  const formatDateToUTC = (selectedDate) => {
    if (!selectedDate) return "";

    if (isNaN(new Date(selectedDate))) {
      console.error("Invalid date:", selectedDate);
      return "";
    }

    const adjustedDate = new Date(selectedDate);
    adjustedDate.setDate(adjustedDate.getDate() + 1);

    return adjustedDate.toISOString().split("T")[0];
  };

  const handleConfirmationConfirm = async () => {
    try {
      const token = localStorage.getItem("token");

      const formatDateWithDayAdjustment = (selectedDate) =>
        formatDateToUTC(new Date(selectedDate));

      const formDataWithDates = {
        ...formData,
        startDate: formatDateWithDayAdjustment(formData.startDate),
        endDate: formatDateWithDayAdjustment(formData.endDate),
      };

      const requestBody = formDataWithDates;

      const response = await axios.post(
        // `http://localhost:8080/v1/appointment/editAppointmentDetails/${formData.id}`,
        `https://backend-c1pz.onrender.com/v1/appointment/editAppointmentDetails/${formData.id}`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast({
          title: "Appointment Updated",
          status: "success",
          duration: 6000,
        });
        onClose();
      } else {
        console.error("Error updating appointment details");
        const errorMessage = response.data
          ? response.data.message
          : "Unknown error";
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

  const handleSaveChanges = (e) => {
    e.preventDefault();

    setConfirmationModalOpen(true);
  };

  return (
    <>
      <Drawer isOpen={isOpen} onClose={onClose} size="md">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader color="#A210C6">Edit appointment</DrawerHeader>
          <DrawerBody>
            <Box>
              <FormControl marginTop="5px">
                <FormLabel fontWeight="bold" color="black">
                  Current Location:
                </FormLabel>
                <Input
                  name="currentLocation"
                  value={formData?.currentLocation}
                  onChange={handleChange}
                  w={{ base: "90%", md: "450px" }}
                />
              </FormControl>
              <FormControl marginTop="5px">
                <FormLabel fontWeight="bold" color="black">
                  Phone Number:
                </FormLabel>
                <Input
                  name="recipientPhoneNumber"
                  value={formData?.recipientPhoneNumber}
                  onChange={handleChange}
                  type="tel"
                  w={{ base: "90%", md: "450px" }}
                />
              </FormControl>

              <Box w={{ base: "90%", md: "450px" }}>
                <FormLabel fontWeight="bold" marginTop="20px">
                  Start Date
                </FormLabel>
                <Flex
                  h="6vh"
                  padding="5px"
                  paddingLeft="15px"
                  style={{ border: "1px solid #ccc", borderRadius: "5px" }}
                >
                  <DatePicker
                    selected={selectedStartDate}
                    onChange={handleStartDateChange}
                    peekNextMonth
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    dateFormat="dd-MM-yyyy"
                    placeholderText="preferred date to start"
                    className="form-control"
                    minDate={new Date()}
                    value={formData?.startDate}
                  />
                  <Image
                    marginLeft="205px"
                    w="24px"
                    h="24px"
                    src={CalenderIcon}
                    alt="CalenderIcon"
                  />
                </Flex>
              </Box>
              <Box w={{ base: "90%", md: "450px" }}>
                <FormLabel fontWeight="bold" marginTop="20px">
                  End Date
                </FormLabel>
                <Flex
                  h="6vh"
                  padding="5px"
                  paddingLeft="15px"
                  style={{ border: "1px solid #ccc", borderRadius: "5px" }}
                >
                  <DatePicker
                    selected={selectedEndDate}
                    onChange={handleEndDateChange}
                    peekNextMonth
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    dateFormat="dd-MM-yyyy"
                    placeholderText="preferred date to end"
                    className="form-control"
                    minDate={new Date()}
                    style={{ border: "none" }}
                    value={formData?.endDate}
                  />
                  <Image
                    marginLeft="205px"
                    w="24px"
                    h="24px"
                    src={CalenderIcon}
                    alt="CalenderIcon"
                  />
                </Flex>
              </Box>

              <FormControl marginTop="20px">
                <FormLabel fontWeight="bold" color="black">
                  Medical Report:
                </FormLabel>
                <Input
                  name="medicalReport"
                  type="file"
                  onChange={handleChange}
                  w={{ base: "90%", md: "450px" }}
                />
              </FormControl>
              <FormControl marginTop="20px">
                <FormLabel fontWeight="bold" color="black">
                  Health History:
                </FormLabel>
                <Textarea
                  w={{ base: "90%", md: "450px" }}
                  name="recipientHealthHistory"
                  value={formData?.recipientHealthHistory}
                  onChange={handleChange}
                />
              </FormControl>
            </Box>
          </DrawerBody>

          <DrawerFooter>
            <Button
              color="white"
              bg="#A210C6"
              mr={3}
              onClick={handleSaveChanges}
            >
              Save
            </Button>
            <Button color="red.500" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <Drawer isOpen={isConfirmationModalOpen} onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent h="30vh">
          <DrawerHeader fontSize="lg" fontWeight="bold">
            Confirm Changes
          </DrawerHeader>
          <DrawerBody>Are you sure you want to save the changes?</DrawerBody>
          <DrawerFooter>
            <Button onClick={handleConfirmationCancel}>Cancel</Button>
            <Button
              bg="#A210C6"
              color="white"
              onClick={handleConfirmationConfirm}
              ml={3}
            >
              Confirm
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default EditPendingAppointment;
