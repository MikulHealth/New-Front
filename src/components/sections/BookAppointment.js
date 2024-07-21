import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  extendTheme,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  VStack,
  Box,
} from "@chakra-ui/react";
import SelfAppointmentModal from "./SelfAppointmentForm";
import OthersAppointmentModal from "./OthersAppForm";
import BeneficiariesModal from "./Beneficiaries";

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

  // const openReportDrawer = () => {
  //   closeModal(); 
  //   onOpen(); 
  // };

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
    <Modal theme={customTheme} isOpen={isOpen} onClose={onClose} size="xs">
      <ModalOverlay />
      <ModalContent  borderRadius="25px 25px 25px 0px">
        <ModalHeader fontFamily="heading" textAlign="center" color="#A210C6" fontWeight="bold">
          Book appointment
        </ModalHeader>
        <ModalCloseButton color="#510863" />
        <ModalBody>
          <VStack spacing={4}>
            <Box
              onClick={() => handleOpenSelfAppointmentModal(2)}
              // bg="#A210C6"
              bg="linear-gradient(80deg, #A210C6, #E552FF)"
              color="white"
              fontWeight="bold"
              borderRadius="8px"
              cursor="pointer"
              p="2"
              textAlign="center"
              fontFamily="body"
              // w="100%"
              // _hover={{ bg: "gray" }}
            >
              Book for yourself
            </Box>
            <Box
              onClick={() => setBookAppointmentModalOpen(true)}
              // bg="#A210C6"
              bg="linear-gradient(80deg, #A210C6, #E552FF)"
              color="white"
              fontWeight="bold"
              borderRadius="8px"
              cursor="pointer"
              p="2"
              textAlign="center"
              fontFamily="body"
              // w="100%"
              // _hover={{ bg: "gray" }}
            >
              Book for a beneficiary
            </Box>
            <Box
              onClick={() => handleOpenBeneficiaryAppointmentModal(3)}
              // bg="#A210C6"
              bg="linear-gradient(80deg, #A210C6, #E552FF)"
              color="white"
              fontWeight="bold"
              borderRadius="8px"
              cursor="pointer"
              p="2"
              textAlign="center"
              fontFamily="body"
              // w="100%"
              // _hover={{ bg: "gray.500" }}
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
          <OthersAppointmentModal
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
