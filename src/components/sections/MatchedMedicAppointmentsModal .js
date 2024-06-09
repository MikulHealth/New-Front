import React, { useEffect, useState } from "react";
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
  Button,
  Progress,
  extendTheme,
  useBreakpointValue,
} from "@chakra-ui/react";
import { PhoneIcon } from "@chakra-ui/icons";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";

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

const urgencyDurations = {
  High: 4 * 60 * 60 * 1000, // 4 hours in milliseconds
  Medium: 8 * 60 * 60 * 1000, // 8 hours in milliseconds
  Normal: 16 * 60 * 60 * 1000, // 16 hours in milliseconds
  Flexible: 48 * 60 * 60 * 1000, // 48 hours in milliseconds
};

const MatchedMedicAppointmentsModal = ({
  isOpen,
  onClose,
  matchedAppointments,
}) => {
  const modalSize = useBreakpointValue({ base: "full", md: "3xl" });
  const { user } = useSelector((state) => state.userReducer);
  const [timeLeft, setTimeLeft] = useState({});
  const [progress, setProgress] = useState({});
  const [acceptedAppointment, setAcceptedAppointment] = useState(null);

  useEffect(() => {
    if (matchedAppointments) {
      const timers = {};
      const progresses = {};
      matchedAppointments.forEach((appointmentWrapper) => {
        const urgency = appointmentWrapper.appointment.priority;
        const duration = urgencyDurations[urgency] || 0;
        const createdAt = new Date(
          appointmentWrapper.appointment.createdAt
        ).getTime();
        const endTime = createdAt + duration;
        const now = Date.now();
        const timeLeft = Math.max(endTime - now, 0);

        timers[appointmentWrapper.appointment.id] = timeLeft;
        progresses[appointmentWrapper.appointment.id] =
          (timeLeft / duration) * 100;
      });

      setTimeLeft(timers);
      setProgress(progresses);
    }
  }, [matchedAppointments]);

  useEffect(() => {
    const interval = setInterval(() => {
      const updatedTimers = { ...timeLeft };
      const updatedProgresses = { ...progress };

      Object.keys(timeLeft).forEach((appointmentId) => {
        const timeLeftForAppointment = timeLeft[appointmentId] - 1000;
        updatedTimers[appointmentId] = Math.max(timeLeftForAppointment, 0);
        const urgency = matchedAppointments.find(
          (app) => app.appointment.id === appointmentId
        ).appointment.priority;
        const duration = urgencyDurations[urgency];
        updatedProgresses[appointmentId] =
          (timeLeftForAppointment / duration) * 100;
      });

      setTimeLeft(updatedTimers);
      setProgress(updatedProgresses);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, progress, matchedAppointments]);

  const handleAccept = async (appointmentId) => {
    try {
      const acceptData = {
        appointmentId,
        medicId: user.userId,
      };

      const response = await axios.post(
        `http://localhost:8080/v1/appointment/accept-appointment`,
        acceptData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setAcceptedAppointment(response.data.data);
      } else {
        toast.error("Error accepting appointment");
      }
    } catch (error) {
      toast.error("Error accepting appointment");
    }
  };

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
          Notice!
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {acceptedAppointment ? (
            <Box p="5" borderWidth="1px" borderRadius="md" mb="4">
              <Text fontSize="18px" fontFamily="body" textAlign="left" mb={2}>
                Welldone, you have accepted the appointment.
              </Text>
              <Text fontSize="18px" fontFamily="body" textAlign="left" mb={2}>
                Please call the client to confirm the details.
              </Text>
              <Flex direction="column" alignItems="center">
                <Box alignItems="left">
                  <Text fontWeight="bold" color="black" mb={2}>
                    {`${acceptedAppointment.appointment.recipientFirstname} ${acceptedAppointment.appointment.recipientLastname}`}
                  </Text>
                  <Text fontWeight="bold" color="black" mb={2}>
                    Phone Number:{" "}
                    <a
                      href={`tel:${acceptedAppointment.appointment.recipientPhoneNumber}`}
                    >
                      {acceptedAppointment.appointment.recipientPhoneNumber}
                    </a>
                  </Text>
                  <Text fontWeight="bold" color="black" mb={2}>
                    Gender: {acceptedAppointment.appointment.recipientGender}
                  </Text>
                  <Text fontWeight="bold" color="black" mb={2}>
                    Date of Birth:{" "}
                    {new Date(
                      acceptedAppointment.appointment.recipientDOB
                    ).toLocaleDateString()}
                  </Text>

                  <Text fontWeight="bold" color="black" mb={2}>
                    Location: {acceptedAppointment.appointment.currentLocation}
                  </Text>

                  <Text fontWeight="bold" color="black" mb={2}>
                    Shift: {acceptedAppointment.appointment.shift}
                  </Text>

                  <Text fontWeight="bold" color="black" mb={2}>
                    Service Plan: {acceptedAppointment.appointment.servicePlan}
                  </Text>

                  <Text fontWeight="bold" color="black" mb={2}>
                    Start Date:{" "}
                    {new Date(
                      acceptedAppointment.appointment.startDate
                    ).toLocaleDateString()}
                  </Text>
                  <Text fontWeight="bold" color="black" mb={2}>
                    Priority: {acceptedAppointment.appointment.priority}
                  </Text>
                  <Text fontWeight="bold" color="black" mb={2}>
                    Health History:{" "}
                    {acceptedAppointment.appointment.recipientHealthHistory}
                  </Text>
                </Box>
                <motion.div
                  alignItems="center"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <Button
                    // justify="center"
                    colorScheme="green"
                    as="a"
                    href={`tel:${acceptedAppointment.appointment.recipientPhoneNumber}`}
                    leftIcon={<PhoneIcon />}
                  >
                    Call Patient
                  </Button>
                </motion.div>
              </Flex>
            </Box>
          ) : (
            <>
              <Text fontSize="18px" fontFamily="body" textAlign="center" mb={2}>
                You have been matched with the following appointment.
              </Text>
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
                            Health history:
                          </Text>
                          <Text
                            maxW={{ base: "50px", md: "450px" }}
                            marginLeft="5px"
                            color="black"
                          >
                            {`${appointmentWrapper.appointment.recipientHealthHistory}`}
                          </Text>
                        </Flex>
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
                            Urgency:
                          </Text>
                          <Text marginLeft="5px" color="black">
                            {appointmentWrapper.appointment.priority}
                          </Text>
                        </Flex>
                        <Flex marginTop="5px" direction="column">
                          <Text fontWeight="bold" color="black">
                            Time left to accept:
                          </Text>

                          <Progress
                            value={progress[appointmentWrapper.appointment.id]}
                            size="md"
                            colorScheme="red"
                          />

                          <Text marginLeft="5px" color="black">
                            {Math.floor(
                              timeLeft[appointmentWrapper.appointment.id] /
                                3600000
                            )}
                            :
                            {Math.floor(
                              (timeLeft[appointmentWrapper.appointment.id] %
                                3600000) /
                                60000
                            )}{" "}
                            hrs
                          </Text>
                        </Flex>
                      </Box>
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 4.5 }}
                      >
                        <Button
                          colorScheme="green"
                          onClick={() =>
                            handleAccept(appointmentWrapper.appointment.id)
                          }
                          mt={{ base: "50px", md: "0" }}
                        >
                          Accept
                        </Button>
                      </motion.div>
                    </Flex>
                  </Box>
                ))}
            </>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default MatchedMedicAppointmentsModal;
