import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  extendTheme,
  FormControl,
  FormLabel,
  Input,
  Select,
  InputGroup,
  InputRightElement,
  Icon,
} from "@chakra-ui/react";
import axios from "axios";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { MdLocationOn } from "react-icons/md";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

const RequestAppointmentModal = ({ isOpen, onClose }) => {
  const [appointmentType, setAppointmentType] = useState("");
  const [shift, setShift] = useState("");
  const [currentLocation, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => state.userReducer);
  const specialization = user?.medicType;
  const medicId = user?.userId;

  const handleSubmit = async () => {
    // Validate all fields
    if (!appointmentType || !shift || !currentLocation) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    const requestData = {
      appointmentType,
      shift,
      currentLocation,
      specialization,
      medicId,
    };

    try {
      const token = localStorage.getItem("token");

      // const apiUrl = "http://localhost:8080/v1/appointment/request";
      const apiUrl = "https://backend-c1pz.onrender.com/v1/appointment/request";

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.post(apiUrl, requestData, { headers });

      if (response.data.success) {
        toast.success(response.data.message);
        setLoading(false);
        console.log("Appointment requested successfully:", response.data);
        onClose();
      } else {
        toast.error(response.data.message);
        console.error("Appointment request failed:", response.data.message);
        setLoading(false);
      }
    } catch (error) {
      toast.error("Error requesting appointment");
      console.error("Error requesting appointment:", error);
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={8000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Modal
        theme={customTheme}
        isOpen={isOpen}
        onClose={onClose}
        size={{ base: "sm", md: "md" }}
      >
        <ModalOverlay />
        <ModalContent borderRadius="20px">
          <ModalHeader fontFamily="heading" color="#A210C6">
            Request Appointment
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isRequired>
              <FormLabel fontFamily="body">Choose Appointment Type</FormLabel>
              <InputGroup>
                <Select
                  placeholder="Select appointment type"
                  value={appointmentType}
                  onChange={(e) => setAppointmentType(e.target.value)}
                >
                  <option value="Elderly care">Elderly care</option>
                  <option value="Recovery care">Recovery care</option>
                  <option value="Short home visit">Short home visit</option>
                  <option value="Postpartum care">Postpartum care</option>
                  <option value="Nanny services">Nanny services</option>
                </Select>
                <InputRightElement pointerEvents="none">
                  <ChevronDownIcon color="gray.300" />
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <FormControl isRequired mt="4">
              <FormLabel fontFamily="body">Choose Shift</FormLabel>
              <InputGroup>
                <Select
                  placeholder="Select shift"
                  value={shift}
                  onChange={(e) => setShift(e.target.value)}
                >
                  <option value="Day Shift(8hrs)">Day Shift(8hrs)</option>
                  <option value="Night Shift(12hrs)">
                    Night Shift (12hrs)
                  </option>
                  <option value="Live-in(24hrs)">Live-in (24hrs)</option>
                  <option value="Any">Any of the above</option>
                </Select>
                <InputRightElement pointerEvents="none">
                  <ChevronDownIcon color="gray.300" />
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <FormControl isRequired mt="4">
              <FormLabel fontFamily="body">Location</FormLabel>
              <InputGroup>
                <Input
                  placeholder="Select preferred location"
                  value={currentLocation}
                  onChange={(e) => setLocation(e.target.value)}
                />
                <InputRightElement pointerEvents="none">
                  <Icon as={MdLocationOn} color="gray.300" />
                </InputRightElement>
              </InputGroup>
            </FormControl>
          </ModalBody>
          <ModalFooter justifyContent="center">
            <Button
              isLoading={loading}
              loadingText="Loading..."
              bg="#A210C6"
              fontFamily="body"
              color="white"
              w={{ base: "auto", md: "200px" }}
              borderRadius="100px"
              mr={3}
              onClick={handleSubmit}
            >
              {loading ? "Loading..." : "Request"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default RequestAppointmentModal;
