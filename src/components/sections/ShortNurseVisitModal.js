import React, { useState} from "react";
import { CheckIcon} from "@chakra-ui/icons";
import BookAppointmentModal from "../sections/BookAppointment";
import {
  Modal,
  ModalOverlay,
  Box,
  Flex,
  ModalContent,
  ModalHeader,
  Divider,
  ModalBody,
  ModalCloseButton,
  Text,
  Button,
} from "@chakra-ui/react";

const ShortNurseVisitModal = ({ isOpen, onClose }) => {
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);

  const handleCloseAppointmentModal = () => {
    setShowAppointmentModal(false);
  };

  const handleOpenAppointmentModal = () => {
    setShowAppointmentModal(true);
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl">
      <ModalOverlay />
      <ModalContent marginTop="30px">
        <ModalHeader textAlign="center">SHORT HOME VISIT</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text fontWeight="bold" textAlign="center" color="#A210C6">
            MIKUL HEALTH SHORT NURSING-CARE SERVICE (3 HOURS MAXIMUM)
          </Text>
          <Text
            fontSize="16px"
            fontStyle="italic"
            fontWeight="bold"
            textAlign="center"
            color="#A210C6"
          >
            Exclusively provided by a licensed nurse
          </Text>
          <Flex
            marginBottom="30px"
            mt={{base: "20px", md: "50px" }}
            ml={{ md: "15px" }}
            alignItems="center"
          >
            <Box
              style={{
                cursor: "pointer",
                boxShadow: "0px 4px 8px rgba(162, 16, 198, 0.4)",
                transition: "transform 0.3s ease-in-out",
              }}
              mt={{base: "5px", md: "-15px" }}
              borderRadius="10px"
              ml={{md: "100px" }}
              bg="#A210C6"
              w={{ base: "100vw", md: "35vw" }}
              h={{ base: "60vh", md: "67vh" }}
              _hover={{
                transform: "translateY(-10px)",
              }}
            >
              <Text
                color="white"
                fontWeight="bold"
                marginTop="30px"
                textAlign="center"
                fontSize="18px"
              >
                DAILY
              </Text>
              <Divider my={1} borderColor="white" />
              <Text color="white" ml="15px" fontSize="16px" mt="5px">
                Professional nursing care provided for short-term visits to
                address specific healthcare needs.
              </Text>
              <Flex mt="15px" direction="column">
                <Box mb="10px" color="white" ml="20px" fontSize="16px">
                  <Text>- Wound dressing/Wound care</Text>
                  <Text>- Vital signs check</Text>
                  <Text>- Injection administration</Text>
                  <Text>- Health assessment</Text>
                  <Text>- Patient education</Text>
                  <Text>- Catheter care</Text>
                  <Text>- Ostomy care</Text>
                  <Text>- IV therapy</Text>
                  <Text>- Blood glucose monitoring</Text>
                </Box>
              </Flex>
              <Divider my={1} borderColor="white" />
              <Flex justifyContent="space-between">
                <Text
                  color="white"
                  fontWeight="bold"
                  marginTop="10px"
                  marginLeft="20px"
                  fontSize="24px"
                >
                  ₦15,000
                </Text>

                <Button
                  marginTop="10px"
                  borderRadius="100px"
                  fontSize="16px"
                  bg="white"
                  marginRight="20px"
                  leftIcon={<CheckIcon />}
                  color="#A210C6"
                  onClick={handleOpenAppointmentModal}
                  style={{
                    fontStyle: "italic",
                    cursor: "pointer",
                  }}
                  _hover={{ color: "#A210C6" }}
                >
                  Book plan
                </Button>
              </Flex>
            </Box>
          </Flex>
        </ModalBody>
      </ModalContent>
      <BookAppointmentModal
        isOpen={showAppointmentModal}
        onClose={handleCloseAppointmentModal}
      />
    </Modal>
  );
};

export default ShortNurseVisitModal;
