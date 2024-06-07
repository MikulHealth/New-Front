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
  Checkbox,
  FormControl,
  FormLabel,
  Input,
  Select,
  Flex,
  InputGroup,
  InputRightElement,
  Icon,
} from "@chakra-ui/react";
import axios from "axios";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { MdLocationOn } from "react-icons/md";

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
  const [appointments, setAppointments] = useState([]);
  const [shift, setShift] = useState("");
  const [location, setLocation] = useState("");

  const handleCheckboxChange = (e) => {
    const { value } = e.target;
    setAppointments((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const handleSubmit = async () => {
    const requestData = {
      appointments,
      shift,
      location,
    };

    try {
      const response = await axios.post(
        "https://your-backend-api.com/appointments",
        requestData
      );
      console.log("Appointment requested successfully:", response.data);
      onClose(); // Close the modal on success
    } catch (error) {
      console.error("Error requesting appointment:", error);
    }
  };

  return (
    <Modal theme={customTheme} isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent borderRadius="20px">
        <ModalHeader fontFamily="heading" color="#A210C6">Request Appointment</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl isRequired>
            <FormLabel fontFamily="body">Choose Appointment(s)</FormLabel>
            <Flex flexWrap="wrap">
              <Checkbox
                value="Elderly care"
                fontFamily="body"
                mr="10px"
                mb="10px"
                onChange={handleCheckboxChange}
              >
                Elderly care
              </Checkbox>
              <Checkbox
                value="Recovery care"
                fontFamily="body"
                mr="10px"
                mb="10px"
                onChange={handleCheckboxChange}
              >
                Recovery care
              </Checkbox>
              <Checkbox
                value="Short home visit"
                fontFamily="body"
                mr="10px"
                mb="10px"
                onChange={handleCheckboxChange}
              >
                Short home visit
              </Checkbox>
              <Checkbox
                value="Postpartum care"
                fontFamily="body"
                mr="10px"
                mb="10px"
                onChange={handleCheckboxChange}
              >
                Postpartum care
              </Checkbox>
              <Checkbox
                value="Nanny services"
                fontFamily="body"
                mr="10px"
                mb="10px"
                onChange={handleCheckboxChange}
              >
                Nanny services
              </Checkbox>
            </Flex>
          </FormControl>
          <FormControl isRequired mt="4">
            <FormLabel fontFamily="body">Choose shift</FormLabel>
            <InputGroup>
              <Select
                placeholder="Select shift"
                value={shift}
                onChange={(e) => setShift(e.target.value)}
              >
                <option value="morning">Day Shift(8hrs)</option>
                <option value="afternoon">Night Shift (12hrs)</option>
                <option value="night">Live-in (24hrs)</option>
                <option value="any">Any of the above</option>
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
                value={location}
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
            bg="#A210C6"
            fontFamily="body"
            color="white"
            w={{ base: "auto", md: "200px" }}
            borderRadius="100px"
            mr={3}
            onClick={handleSubmit}
          >
            Request
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default RequestAppointmentModal;
