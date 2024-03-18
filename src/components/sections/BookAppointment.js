import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  VStack,
  Box,
} from "@chakra-ui/react";
import SelfAppointmentModal from "./SelfAppointmentForm";
import BeneficiaryAppointmentModal from "./OthersAppForm";
import BeneficiariesModal from "./Beneficiaries";

const BookAppointmentModal = ({ isOpen, onClose }) => {
  const [isSelfAppointmentModalOpen, setSelfAppointmentModalOpen] =
    useState(false);
  const [isBeneficiaryAppointmentModalOpen, setBeneficiaryAppointmentModalOpen] =
    useState(false);
  const [isBookAppointmentModalOpen, setBookAppointmentModalOpen] = useState(false);
  const [pages, setPages] = useState(null);

  const handleOpenSelfAppointmentModal = (numPages) => {
    setPages(numPages);
    setSelfAppointmentModalOpen(true);
  };

  const handleCloseSelfAppointmentModal = () => {
    setSelfAppointmentModalOpen(false);
    setPages(null);
  };

  const handleOpenBeneficiaryAppointmentModal = (numPages) => {
    setPages(numPages);
    setBeneficiaryAppointmentModalOpen(true);
  };

  const handleCloseBeneficiaryAppointmentModal = () => {
    setBeneficiaryAppointmentModalOpen(false);
    setPages(null);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xs">
      <ModalOverlay />
      <ModalContent  borderRadius="25px 25px 25px 0px">
        <ModalHeader textAlign="center" color="#A210C6" fontWeight="bold">
          Book appointment
        </ModalHeader>
        <ModalCloseButton color="#510863" />
        <ModalBody>
          <VStack spacing={4}>
            <Box
              onClick={() => handleOpenSelfAppointmentModal(2)}
              bg="#A210C6"
              color="white"
              fontWeight="bold"
              borderRadius="8px"
              cursor="pointer"
              p="2"
              textAlign="center"
              // w="100%"
              _hover={{ bg: "gray" }}
            >
              Book for yourself
            </Box>
            <Box
              onClick={() => setBookAppointmentModalOpen(true)}
              bg="#A210C6"
              color="white"
              fontWeight="bold"
              borderRadius="8px"
              cursor="pointer"
              p="2"
              textAlign="center"
              // w="100%"
              _hover={{ bg: "gray" }}
            >
              Book for a beneficiary
            </Box>
            <Box
              onClick={() => handleOpenBeneficiaryAppointmentModal(3)}
              bg="#A210C6"
              color="white"
              fontWeight="bold"
              borderRadius="8px"
              cursor="pointer"
              p="2"
              textAlign="center"
              // w="100%"
              _hover={{ bg: "gray" }}
              marginBottom="20px"
            >
              Book for others
            </Box>
          </VStack>
        </ModalBody>
        {isSelfAppointmentModalOpen && (
          <SelfAppointmentModal
            isOpen={isSelfAppointmentModalOpen}
            onClose={handleCloseSelfAppointmentModal}
            pages={pages}
          />
        )}
        {isBeneficiaryAppointmentModalOpen && (
          <BeneficiaryAppointmentModal
            isOpen={isBeneficiaryAppointmentModalOpen}
            onClose={handleCloseBeneficiaryAppointmentModal}
            pages={pages}
          />
        )}
        {isBookAppointmentModalOpen && (
          <BeneficiariesModal
            isOpen={isBookAppointmentModalOpen}
            onClose={() => setBookAppointmentModalOpen(false)}
          />
        )}
      </ModalContent>
    </Modal>
  );
};

export default BookAppointmentModal;
