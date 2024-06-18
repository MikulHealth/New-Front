import React, { useState, useEffect } from "react";
import { MdLocationOn } from "react-icons/md";
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
  Select,
  InputGroup,
  InputRightElement,
  Icon,
  Input,
} from "@chakra-ui/react";
import axios from "axios";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditPendingMediRequest = ({ isOpen, onClose, appointmentDetails }) => {
  // const toast = useToast();
  const [id, setFormData] = useState(appointmentDetails);
  const [appointmentType, setAppointmentType] = useState("");
  const [shift, setShift] = useState("");
  const [currentLocation, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);

  useEffect(() => {
    setFormData(appointmentDetails);
  }, [appointmentDetails]);

  const handleConfirmationCancel = () => {
    setConfirmationModalOpen(false);
  };

  const handleConfirmationConfirm = async () => {
    setLoading(true);
    const requestData = {
      appointmentType,
      shift,
      currentLocation,
    };
    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        // `http://localhost:8080/v1/appointment/edit-request/${id}`,
        `https://backend-c1pz.onrender.com/v1/appointment/edit-request/${id}`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setLoading(false);
        toast.success("Request updated");
        setTimeout(() => {
          onClose();
        }, 4000);
      } else {
        setLoading(false);
        console.error("Error updating request details");
        const errorMessage = response.data
          ? response.data.message
          : "Unknown error";
        toast.error(errorMessage);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error updating request details:", error);
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
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader color="#A210C6">Edit Request</DrawerHeader>
          <DrawerBody>
            <FormControl isRequired>
              <FormLabel fontFamily="body">Appointment Type</FormLabel>
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
              <FormLabel fontFamily="body">Shift</FormLabel>
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
          </DrawerBody>

          <DrawerFooter>
            <Button
              bg="#A210C6"
              color="white"
              mr={3}
              onClick={handleSaveChanges}
            >
              Save
            </Button>
            <Button
              bg="#E1ACAE"
              color="red.500"
              variant="ghost"
              onClick={onClose}
            >
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
            <Button
              bg="#E1ACAE"
              color="red.500"
              onClick={handleConfirmationCancel}
            >
              Cancel
            </Button>
            <Button
              isLoading={loading}
              loadingText="Loading..."
              fontFamily="body"
              color="white"
              w={{ base: "auto", md: "200px" }}
              bg="#A210C6"
              onClick={handleConfirmationConfirm}
              ml={3}
            >
              {loading ? "Loading..." : "Confirm"}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default EditPendingMediRequest;
