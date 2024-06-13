import React, { useState } from "react";
import axios from "axios";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Text,
  Box,
  Button,
  Flex,
  Divider,
  Image,
  extendTheme,
  useToast,
  useBreakpointValue,
} from "@chakra-ui/react";
import { FaStar } from "react-icons/fa";
// import { PhoneIcon } from "@chakra-ui/icons";
// import { motion } from "framer-motion";
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

const MatchedAppointmentsModal = ({ isOpen, onClose, matchedAppointments }) => {
  const toast = useToast();
  const modalSize = useBreakpointValue({ base: "full", md: "3xl" });
  const [appointmentDetails, setAppointmentDetails] = useState(null);

  const handleAcceptAppointment = async (appointmentId, medicId) => {
    try {
      const token = localStorage.getItem("token");
      const apiUrl = "https://backend-c1pz.onrender.com/v1/appointment/accept";
      // `http://localhost:8080/v1/appointment/accept`;
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.post(
        apiUrl,
        { appointmentId, medicId },
        { headers }
      );

      if (response.data.success) {
        toast({
          title: response.data.message,
          status: "success",
          duration: 6000,
        });
        setAppointmentDetails(response.data.data);
        onClose();
      } else {
        toast({
          title: "Error accepting appointment",
          description: response.data.message,
          status: "error",
          duration: 6000,
        });
      }
    } catch (error) {
      console.error("An error occurred while accepting appointment:", error);
      toast({
        title: "Error accepting appointment",
        description: "An error occurred. Please try again.",
        status: "error",
        duration: 6000,
      });
    }
  };

  return (
    <>
      <Modal
        theme={customTheme}
        isOpen={isOpen}
        onClose={onClose}
        size={modalSize}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center">Matched Appointment(s)</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {matchedAppointments &&
              matchedAppointments.length > 0 &&
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
                          {`${appointmentWrapper.appointment.appointment.recipientFirstname} ${appointmentWrapper.appointment.appointment.recipientLastname}`}
                        </Text>
                      </Flex>
                      {/* <Flex marginTop="5px">
                        <Text
                          maxW={{ base: "60px", md: "120px" }}
                          wordWrap="break-word"
                          fontWeight="bold"
                          color="black"
                        >
                          Medic Type:
                        </Text>
                        <Text marginLeft="5px" color="black">
                          {
                            appointmentWrapper.appointment.appointment
                              .medicSpecialization
                          }
                        </Text>
                      </Flex> */}
                      <Flex marginTop="5px">
                        <Text fontWeight="bold" color="black">
                          Service Plan:
                        </Text>
                        <Text marginLeft="5px" color="black">
                          {
                            appointmentWrapper.appointment.appointment
                              .servicePlan
                          }
                        </Text>
                      </Flex>
                      <Flex marginTop="5px">
                        <Text fontWeight="bold" color="black">
                          Shift:
                        </Text>
                        <Text marginLeft="5px" color="black">
                          {appointmentWrapper.appointment.appointment.shift}
                        </Text>
                      </Flex>
                      <Flex marginTop="5px">
                        <Text fontWeight="bold" color="black">
                          Booked on:
                        </Text>
                        <Text marginLeft="5px" color="black">
                          {new Date(
                            appointmentWrapper.appointment.appointment.createdAt
                          ).toLocaleString()}
                        </Text>
                      </Flex>
                    </Box>
                  </Flex>
                  <Divider my={4} borderColor="gray.500" />
                  <Text fontWeight="bold" color="black" marginTop="5px">
                    Matched Caregiver(s):
                  </Text>
                  {appointmentWrapper.matchedMedics.map((medic) => (
                    <Box
                      key={medic.id}
                      p="4"
                      borderWidth="1px"
                      borderRadius="md"
                      mt="5px"
                    >
                      <Flex
                        direction={{ base: "column", md: "row" }}
                        alignItems="center"
                      >
                        <Box flex="1">
                          <Flex marginTop="5px">
                            <Text fontWeight="bold" color="black">
                              Full Name:
                            </Text>
                            <Text marginLeft="5px" color="black">
                              {medic.fullName}
                            </Text>
                          </Flex>
                          <Flex marginTop="5px">
                            <Text fontWeight="bold" color="black">
                              Caregiver Type:
                            </Text>
                            <Text marginLeft="5px" color="black">
                              {medic.specialization}
                            </Text>
                          </Flex>
                          <Flex marginTop="5px">
                            <Text fontWeight="bold" color="black">
                              Location:
                            </Text>
                            <Text marginLeft="5px" color="black">
                              {medic.currentLocation}
                            </Text>
                          </Flex>
                          <Flex marginTop="5px">
                            <Text fontWeight="bold" color="black">
                              Shift:
                            </Text>
                            <Text marginLeft="5px" color="black">
                              {medic.shift}
                            </Text>
                          </Flex>
                          <Flex marginTop="5px">
                            <Text fontWeight="bold" color="black">
                              Years of Experience:
                            </Text>
                            <Text marginLeft="5px" color="black">
                              {medic.yearsOfExp}
                            </Text>
                          </Flex>
                          <Flex marginTop="5px" alignItems="center">
                            <Text fontWeight="bold" color="black">
                              Rating:
                            </Text>
                            <Flex marginLeft="5px" color="gold">
                              {[...Array(5)].map((_, i) => (
                                <FaStar key={i} />
                              ))}
                            </Flex>
                          </Flex>
                        </Box>
                        <Box textAlign="center">
                          <Image
                            src={medic.image}
                            alt={medic.fullName}
                            boxSize={{ base: "100px", md: "150px" }}
                            borderRadius="10px"
                            mt={{ base: "10px", md: "0" }}
                          />
                          <Button
                            colorScheme="green"
                            onClick={() =>
                              handleAcceptAppointment(
                                appointmentWrapper.appointment.id,
                                medic.medicId
                              )
                            }
                            mt="10px"
                          >
                            Accept
                          </Button>
                        </Box>
                      </Flex>
                    </Box>
                  ))}
                </Box>
              ))}
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Modal for displaying accepted appointment details */}
      {appointmentDetails && (
        <Modal
          isOpen={true}
          onClose={() => setAppointmentDetails(null)}
          size={modalSize}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader
              color="#A210C6"
              fontFamily="heading"
              textAlign="center"
            >
              Notice
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text
                textAlign="center"
                fontSize="lg"
                fontWeight="bold"
                fontFamily="body"
                color="green.500"
              >
                Congratulations! You have accepted a Cargeiver.
              </Text>
              <Text
                fontFamily="body"
                textAlign="center"
                fontSize="md"
                color="gray.700"
                mt="2"
              >
                Please wait while the caregiver confirms the appointment.
              </Text>
              {/* <Flex mt="2" alignItems="center">
                <motion.div
                  animate={{ rotate: [0, 20, -20, 0] }}
                  transition={{ repeat: Infinity, duration: 0.6 }}
                >
                  <PhoneIcon color="green.500" ml="2" />
                </motion.div>
                <Text
                  ml="2"
                  fontSize="lg"
                  fontWeight="bold"
                  color="blue.500"
                  as="a"
                  href={`tel:${appointmentDetails.appointment.recipientPhoneNumber}`}
                >
                  {appointmentDetails.appointment.recipientPhoneNumber}
                </Text>
              </Flex> */}
              <Divider my={4} borderColor="gray.500" />

              {/* <Flex
                direction={{ base: "column", md: "row" }}
                justifyContent="space-between"
              >
                <Box>
                  <Text fontWeight="bold" color="black" marginTop="5px">
                    Beneficiary Details:
                  </Text>
              
                  <Flex marginTop="5px">
                    <Text fontWeight="bold" color="black">
                      Beneficiary:
                    </Text>
                    <Text marginLeft="5px" color="black">
                      {`${appointmentDetails.appointment.recipientFirstname} ${appointmentDetails.appointment.recipientLastname}`}
                    </Text>
                  </Flex>
                  <Flex marginTop="5px">
                    <Text fontWeight="bold" color="black">
                      Appointment Type:
                    </Text>
                    <Text marginLeft="5px" color="black">
                      {appointmentDetails.appointment.medicSpecialization}
                    </Text>
                  </Flex>
                  <Flex marginTop="5px">
                    <Text fontWeight="bold" color="black">
                      Service Plan:
                    </Text>
                    <Text marginLeft="5px" color="black">
                      {appointmentDetails.appointment.servicePlan}
                    </Text>
                  </Flex>
                  <Flex marginTop="5px">
                    <Text fontWeight="bold" color="black">
                      Shift:
                    </Text>
                    <Text marginLeft="5px" color="black">
                      {appointmentDetails.appointment.shift}
                    </Text>
                  </Flex>
                  <Flex marginTop="5px">
                    <Text fontWeight="bold" color="black">
                      Booked on:
                    </Text>
                    <Text marginLeft="5px" color="black">
                      {new Date(
                        appointmentDetails.appointment.createdAt
                      ).toLocaleString()}
                    </Text>
                  </Flex>
                </Box>
              </Flex> */}

              {/* <Divider my={4} borderColor="gray.500" />
              <Text fontWeight="bold" color="black" marginTop="5px">
                Caregiver Details:
              </Text> */}
              {/* 

              <Box p="4" borderWidth="1px" borderRadius="md" mt="5px">
                <Flex
                  direction={{ base: "column", md: "row" }}
                  alignItems="center"
                >
                  <Box flex="1">
                    <Flex marginTop="5px">
                      <Text fontWeight="bold" color="black">
                        Full Name:
                      </Text>
                      <Text marginLeft="5px" color="black">
                        {appointmentDetails.medic.fullName}
                      </Text>
                    </Flex>
                    <Flex marginTop="5px">
                      <Text fontWeight="bold" color="black">
                        Caregiver Type:
                      </Text>
                      <Text marginLeft="5px" color="black">
                        {appointmentDetails.medic.specialization}
                      </Text>
                    </Flex>
                    <Flex marginTop="5px">
                      <Text fontWeight="bold" color="black">
                        Location:
                      </Text>
                      <Text marginLeft="5px" color="black">
                        {appointmentDetails.medic.currentLocation}
                      </Text>
                    </Flex>
                    <Flex marginTop="5px">
                      <Text fontWeight="bold" color="black">
                        Shift:
                      </Text>
                      <Text marginLeft="5px" color="black">
                        {appointmentDetails.medic.shift}
                      </Text>
                    </Flex>
                    <Flex marginTop="5px">
                      <Text fontWeight="bold" color="black">
                        Years of Experience:
                      </Text>
                      <Text marginLeft="5px" color="black">
                        {appointmentDetails.medic.yearsOfExp}
                      </Text>
                    </Flex>
                    <Flex marginTop="5px" alignItems="center">
                      <Text fontWeight="bold" color="black">
                        Rating:
                      </Text>
                      <Flex marginLeft="5px" color="gold">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} />
                        ))}
                      </Flex>
                    </Flex>
                  </Box>
                  <Box textAlign="center">
                    <Image
                      src={appointmentDetails.medic.image}
                      alt={appointmentDetails.medic.fullName}
                      boxSize={{ base: "100px", md: "150px" }}
                      borderRadius="10px"
                      mt={{ base: "10px", md: "0" }}
                    />
                  </Box>
                </Flex>
              </Box> */}
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default MatchedAppointmentsModal;
