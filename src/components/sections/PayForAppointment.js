import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { CheckIcon, WarningIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  useMediaQuery,
} from "@chakra-ui/react";

const PayForAppointmentModal = ({ isOpen, onClose, appointment }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.userReducer);
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");
  const modalWidth = isLargerThan768 ? "400px" : "90vw";

  const handlePayment = () => {
    const costOfService = appointment.costOfService;
    const appointmentId = appointment.id;
    const beneficiary =
      appointment.recipientFirstname + " " + appointment.recipientLastname;
    navigate("/make-payment", {
      state: { costOfService, appointmentId, beneficiary },
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent
        // border="5px solid white"
        borderRadius="25px 25px 25px 0px"
        bg="white"
        width={modalWidth}
      >
        <ModalHeader>
          <WarningIcon w={10} h={10} color="yellow.400" />
        </ModalHeader>
        <ModalBody>
          <Text color="black">
            Hello {user?.firstName}, We notice your pending appointment has not
            been paid for, kindly make payment to get matched with a caregiver.
          </Text>
        </ModalBody>
        <ModalFooter justifyContent="center">
          <Button
            leftIcon={<CheckIcon />}
            bg="green.400"
            color="white"
            onClick={handlePayment}
            marginBottom="10px"
          >
            Pay for appointment
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PayForAppointmentModal;
