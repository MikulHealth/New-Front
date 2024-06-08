import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Text,
  Box,
  Flex,
  extendTheme,
//   Divider,
//   useToast,
  useBreakpointValue,
} from "@chakra-ui/react";
import { PhoneIcon } from "@chakra-ui/icons";
import { motion } from "framer-motion";

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

const MatchedMedicAppointmentsModal = ({
  isOpen,
  onClose,
  matchedAppointments,
}) => {
//   const toast = useToast();
  const modalSize = useBreakpointValue({ base: "full", md: "3xl" });

  return (
    <Modal
      theme={customTheme}
      isOpen={isOpen}
      onClose={onClose}
      size={modalSize}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader color="#A210C6" fontFamily="heading" textAlign="center">
          Congratulations!
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text  fontSize="18px" fontFamily="body" textAlign="center" mb={2}>
            You have been matched with the following appointment.
          </Text>
          <Text  fontSize="18px" fontFamily="body" mb={2} textAlign="center">
            {" "}
            Please "call the client" to confirm the details.
          </Text>
          {matchedAppointments && matchedAppointments.length > 0 ? (
            matchedAppointments.map((appointmentWrapper) => (
              <Box
                key={appointmentWrapper.appointment.id}
                p="5"
                borderWidth="1px"
                borderRadius="md"
                mb="4"
              >
                <Flex
                  direction={{ base: "column", md: "row" }}
                  justifyContent="space-between"
                >
                  <Box>
                    <Flex marginTop="5px">
                      <Text fontWeight="bold" color="black">
                        Beneficiary:
                      </Text>
                      <Text marginLeft="5px" color="black">
                        {`${appointmentWrapper.appointment.recipientFirstname} ${appointmentWrapper.appointment.recipientLastname}`}
                      </Text>
                    </Flex>
                    {/* <Flex marginTop="5px">
                      <Text fontWeight="bold" color="black">
                        Appointment Type:
                      </Text>
                      <Text marginLeft="5px" color="black">
                        {appointmentWrapper.appointment.servicePlan}
                      </Text>
                    </Flex> */}
                    <Flex marginTop="5px">
                      <Text fontWeight="bold" color="black">
                        Service Plan:
                      </Text>
                      <Text marginLeft="5px" color="black">
                        {appointmentWrapper.appointment.servicePlan}
                      </Text>
                    </Flex>
                    <Flex marginTop="5px">
                      <Text fontWeight="bold" color="black">
                        Shift:
                      </Text>
                      <Text marginLeft="5px" color="black">
                        {appointmentWrapper.appointment.shift}
                      </Text>
                    </Flex>
                    <Flex marginTop="5px">
                      <Text fontWeight="bold" color="black">
                        Location:
                      </Text>
                      <Text marginLeft="5px" color="black">
                        {appointmentWrapper.appointment.currentLocation}
                      </Text>
                    </Flex>
                    <Flex marginTop="5px">
                      <Text fontWeight="bold" color="black">
                        Client Phone Number:
                      </Text>
                      <Flex marginLeft="5px" color="black" alignItems="center">
                        <a
                          href={`tel:${appointmentWrapper.appointment.customerPhoneNumber}`}
                        >
                          {appointmentWrapper.appointment.customerPhoneNumber}
                        </a>
                        <motion.div
                          animate={{ rotate: [0, 20, -20, 0] }}
                          transition={{ repeat: Infinity, duration: 0.6 }}
                        >
                          <PhoneIcon color="green.500" ml="2" />
                        </motion.div>
                      </Flex>
                    </Flex>
                  </Box>
                </Flex>
                {/* <Divider my={4} borderColor="gray.500" /> */}
              </Box>
            ))
          ) : (
            <Text>No matched caregivers found.</Text>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default MatchedMedicAppointmentsModal;
