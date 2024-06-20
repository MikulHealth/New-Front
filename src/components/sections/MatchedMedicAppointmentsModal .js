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

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (matchedAppointments && matchedAppointments.length > 0) {
      const timers = {};
      const progresses = {};

      matchedAppointments.forEach((appointmentWrapper) => {
        appointmentWrapper.customerAppointments.forEach((appointment) => {
          const urgency = appointment.priority;
          const duration = urgencyDurations[urgency] || 0;
          const createdAt = new Date(appointment.createdAt).getTime();
          const endTime = createdAt + duration;
          const now = Date.now();
          const timeLeft = Math.max(endTime - now, 0);

          timers[appointment.id] = timeLeft;
          progresses[appointment.id] = (timeLeft / duration) * 100;
        });
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
        const urgency = matchedAppointments
          .flatMap((app) => app.customerAppointments)
          .find((app) => app.id === appointmentId).priority;
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
    setLoading(true);
    try {
      const acceptData = {
        appointmentId,
        medicId: user.userId,
      };

      const response = await axios.post(
        // `http://localhost:8080/v1/appointment/accept-appointment`,
        "https://backend-c1pz.onrender.com/v1/appointment/accept-appointment",
        acceptData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        setLoading(false);
        toast.success(response.data.message);
        setAcceptedAppointment(response.data.data);
      } else {
        toast.error("Error accepting appointment");
      }
    } catch (error) {
      setLoading(false);
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
          Notification!
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {acceptedAppointment ? (
            <Box p="5" borderWidth="1px" borderRadius="md" mb="4">
              <Text
                fontSize="18px"
                fontFamily="heading"
                fontWeight="bold"
                // textAlign="left"
                textAlign={{base: "left", md: "center"}}
                mb={2}
              >
                Welldone, appointment accepted.
              </Text>
              <Text
                fontSize="14px"
                fontStyle="italic"
                fontFamily="body"
                fontWeight="bold"
                textAlign="left"
                mb={2}
              >
                Please call the client to confirm the details and start care.
              </Text>
              <Flex direction="column" alignItems="left">
                <Box alignItems="left">
                  <Flex>
                    <Text fontWeight="bold" color="black" mb={2}>
                      Name
                    </Text>
                    <Text ml="10px" color="black" mb={2}>
                      {`${acceptedAppointment.appointment.recipientFirstname} ${acceptedAppointment.appointment.recipientLastname}`}
                    </Text>
                  </Flex>
                  <Flex>
                    <Text fontWeight="bold" color="black" mb={2}>
                      Phone Number:
                    </Text>
                    <Text ml="10px" color="black" mb={2}>
                      <a
                        href={`tel:${acceptedAppointment.appointment.recipientPhoneNumber}`}
                      >
                        {acceptedAppointment.appointment.recipientPhoneNumber}
                      </a>
                    </Text>
                  </Flex>
                  <Flex>
                    <Text fontWeight="bold" color="black" mb={2}>
                      Gender:
                    </Text>
                    <Text ml="10px" color="black" mb={2}>
                      {acceptedAppointment.appointment.recipientGender}
                    </Text>
                  </Flex>
                  <Flex>
                    <Text fontWeight="bold" color="black" mb={2}>
                      Date of Birth:{" "}
                    </Text>
                    <Text ml="10px" color="black" mb={2}>
                      {new Date(
                        acceptedAppointment.appointment.recipientDOB
                      ).toLocaleDateString()}
                    </Text>
                  </Flex>
                  <Flex>
                    <Text fontWeight="bold" color="black" mb={2}>
                      City/Town:
                    </Text>
                    <Text ml="10px" color="black" mb={2}>
                      {acceptedAppointment.appointment.recipientTown}
                    </Text>
                  </Flex>
                  <Flex>
                    <Text fontWeight="bold" color="black" mb={2}>
                      Location:{" "}
                    </Text>
                    <Text
                      ml="10px"
                      maxW="600px"
                      maxH="1000px"
                      color="black"
                      mb={2}
                    >
                      {acceptedAppointment.appointment.currentLocation}
                    </Text>
                  </Flex>
                  <Flex>
                    <Text fontWeight="bold" color="black" mb={2}>
                      Shift:
                    </Text>
                    <Text ml="10px" color="black" mb={2}>
                      {acceptedAppointment.appointment.shift}
                    </Text>
                  </Flex>
                  <Flex>
                    <Text fontWeight="bold" color="black" mb={2}>
                      Service Plan:
                    </Text>
                    <Text ml="10px" color="black" mb={2}>
                      {acceptedAppointment.appointment.servicePlan}
                    </Text>
                  </Flex>
                  <Flex>
                    <Text fontWeight="bold" color="black" mb={2}>
                      Start Date:{" "}
                    </Text>
                    <Text ml="10px" color="black" mb={2}>
                      {new Date(
                        acceptedAppointment.appointment.startDate
                      ).toLocaleDateString()}
                    </Text>
                  </Flex>
                  <Flex>
                    <Text fontWeight="bold" color="black" mb={2}>
                      Priority:
                    </Text>
                    <Text ml="10px" color="black" mb={2}>
                      {acceptedAppointment.appointment.priority}
                    </Text>
                  </Flex>

                  <Flex>
                    <Text fontWeight="bold" color="black" mb={2}>
                      Health History:{" "}
                    </Text>
                    <Text
                      ml="10px"
                      maxW="600px"
                      maxH="1000px"
                      color="black"
                      mb={2}
                    >
                      {acceptedAppointment.appointment.recipientHealthHistory}
                    </Text>
                  </Flex>
                  <Flex marginTop="5px">
                    <Text fontWeight="bold" color="black">
                      Special Needs:
                    </Text>
                    <Text
                      marginLeft="10px"
                      color="black"
                      maxW="600px"
                      maxH="1000px"
                    >
                      {acceptedAppointment.appointment.specialNeeds &&
                      acceptedAppointment.appointment.specialNeeds.length > 0
                        ? acceptedAppointment.appointment.specialNeeds.join(
                            ", "
                          )
                        : "Not available"}
                    </Text>
                  </Flex>
                </Box>
                <Button
                  mt="10px"
                  colorScheme="green"
                  as="a"
                  href={`tel:${acceptedAppointment.appointment.recipientPhoneNumber}`}
                  leftIcon={<PhoneIcon />}
                >
                  Call
                </Button>
              </Flex>
            </Box>
          ) : (
            <>
              <Text
                fontSize="18px"
                fontFamily="heading"
                textAlign="center"
                mb={2}
              >
                You have been matched with the following appointment(s).
              </Text>
              {matchedAppointments &&
                matchedAppointments.length > 0 &&
                matchedAppointments.map((appointmentWrapper) =>
                  appointmentWrapper.customerAppointments.map((appointment) => (
                    <Box
                      key={appointment.id}
                      p="5"
                      borderWidth="1px"
                      borderRadius="md"
                      mb="4"
                      bg="#A210C6"
                      color="white"
                    >
                      <Flex
                        direction={{ base: "column", md: "row" }}
                        justifyContent="space-between"
                      >
                        <Box color="white">
                          <Flex color="white" marginTop="5px">
                            <Text fontWeight="bold">Health history:</Text>
                            <Text
                              maxW={{ base: "300px", md: "450px" }}
                              marginLeft="5px"
                            >
                              {appointment.recipientHealthHistory || "N/A"}
                            </Text>
                          </Flex>
                          <Flex marginTop="5px">
                            <Text fontWeight="bold">Service Plan:</Text>
                            <Text marginLeft="5px">
                              {appointment.servicePlan}
                            </Text>
                          </Flex>
                          <Flex marginTop="5px">
                            <Text fontWeight="bold">Shift:</Text>
                            <Text marginLeft="5px">{appointment.shift}</Text>
                          </Flex>
                          <Flex marginTop="5px">
                            <Text fontWeight="bold">City/Town:</Text>
                            <Text marginLeft="5px">
                              {appointment.recipientTown}
                            </Text>
                          </Flex>
                          <Flex marginTop="5px">
                            <Text fontWeight="bold">Urgency:</Text>
                            <Text marginLeft="5px">{appointment.priority}</Text>
                          </Flex>
                          <Text fontWeight="bold" mb={2}>
                            Start Date:{" "}
                            {new Date(
                              appointment.startDate
                            ).toLocaleDateString()}
                          </Text>
                          <Flex marginTop="5px" direction="column">
                            <Text fontWeight="bold">Time left to accept:</Text>

                            <Progress
                              border="1px solid white"
                              value={progress[appointment.id]}
                              size="md"
                              colorScheme="red"
                            />

                            <Text marginLeft="5px">
                              {Math.floor(timeLeft[appointment.id] / 3600000)}:
                              {Math.floor(
                                (timeLeft[appointment.id] % 3600000) / 60000
                              )}{" "}
                              hours/minutes
                            </Text>
                          </Flex>
                          <Flex marginTop="5px">
                            <Text fontWeight="bold">Special Needs:</Text>
                            <Text marginLeft="10px" maxW="600px" maxH="1000px">
                              {appointment.specialNeeds &&
                              appointment.specialNeeds.length > 0
                                ? appointment.specialNeeds.join(", ")
                                : "Not available"}
                            </Text>
                          </Flex>
                        </Box>
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ repeat: Infinity, duration: 4.5 }}
                        >
                          <Button
                            isLoading={loading}
                            loadingText="Loading..."
                            border="2px solid white"
                            colorScheme="green"
                            onClick={() => handleAccept(appointment.id)}
                            mt={{ base: "20px", md: "20px" }}
                            ml={{ base: "30px", md: "0" }}
                          >
                            {loading ? "Loading..." : "Accept"}
                          </Button>
                        </motion.div>
                      </Flex>
                    </Box>
                  ))
                )}
            </>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default MatchedMedicAppointmentsModal;
