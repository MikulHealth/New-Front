import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Text,
  VStack,
  Badge,
  Avatar,
  Image,
  Divider,
  Link,
  ChakraProvider,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import MedicSideBar from "../authLayouts/MedicSideBar";
import MedicNavBar from "../authLayouts/MedicNavBar";
import MobileFooter from "../authLayouts/MedicFooter";
import LoadingSpinner from "../../utils/Spiner";
import PatientReportDrawer from "../sections/PatientReportDrawer";
import Check from "../../assets/Check.svg";
import RequestAppointmentModal from "../sections/RequestAppModal";
import PatientDetailsModal from "../sections/PatientDetailsModal";
import { extendTheme } from "@chakra-ui/react";
import { baseUrl } from "../../apiCalls/config";

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

const PatientsPage = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);

  const handleOpenAppointmentModal = () => {
    setShowAppointmentModal(true);
  };

  const handleCloseAppointmentModal = () => {
    setShowAppointmentModal(false);
  };

  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${baseUrl}/appointment/get-active-patient`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.data.success) {
          setPatients(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching patients:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const openModal = (patient) => {
    if (!patient.completed) {
      setSelectedPatient(patient);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPatient(null);
  };

  const openReportDrawer = () => {
    closeModal();
    onOpen();
  };

  // const formatDateTime = (dateString) => {
  //   const date = new Date(dateString);
  //   return `${date.toLocaleDateString()}`;
  // };

  const settingsContainerStyle = {
    animation: "slideInUp 0.9s ease-in-out",
  };

  return (
    <ChakraProvider theme={customTheme}>
      <Flex direction={{ base: "column", md: "row" }}>
        <Box w={{ base: "100%", md: "20%" }}>
          <MedicSideBar />
        </Box>
        <VStack style={settingsContainerStyle} w={{ base: "100%", md: "80%" }}>
          <MedicNavBar />
          <Box p="4" w="full" overflowY="auto">
            <Flex direction="column" p="4">
              {loading ? (
                <LoadingSpinner />
              ) : (
                <>
                  <Box mb="20px">
                    <Flex
                      w="full"
                      p={4}
                      borderRadius="md"
                      justifyContent="space-between"
                      color="#212427B2"
                      fontSize={{ base: "10px", md: "16px" }}
                      fontFamily="body"
                    >
                      <Text fontWeight="bold">Policy No.</Text>
                      <Text fontWeight="bold">Patient name</Text>
                      <Text fontWeight="bold">Appointment type</Text>
                      <Text fontWeight="bold">Status</Text>
                    </Flex>
                    <Divider my={1} borderColor="gray.500" />
                  </Box>

                  {patients.length === 0 ? (
                    <Text
                      fontSize={{ base: "12px", md: "16px" }}
                      fontFamily="body"
                      fontStyle="italic"
                    >
                      No patient seen yet, click{" "}
                      <Link onClick={handleOpenAppointmentModal} color="#A210C6">
                        "request appointment to begin"
                      </Link>{" "}
                      to begin.
                    </Text>
                  ) : (
                    <VStack color="#212427B2" spacing={4} align="stretch">
                      {patients.map((patient) => (
                        <Flex
                          fontSize={{ base: "10px", md: "16px" }}
                          key={patient.id}
                          p={3}
                          borderRadius="md"
                          bg="#ECCFF4"
                          justifyContent="space-between"
                          alignItems="center"
                          w="full"
                          onClick={() => openModal(patient)}
                          cursor={patient.completed ? "not-allowed" : "pointer"}
                          _hover={patient.completed ? {} : { bg: "purple.100" }}
                        >
                          <Image
                            src={Check}
                            w={{ base: "16px", md: "16px" }}
                            h={{ base: "16px", md: "16px" }}
                          />
                          <Flex
                            maxW={{ base: "60px", md: "170px" }}
                            color="#212427B2"
                            alignItems="center"
                          >
                            <Avatar
                              size="sm"
                              bg="#212427B2"
                              color="white"
                              name={`${patient.customerAppointment.recipientFirstname} ${patient.customerAppointment.recipientLastname}`}
                            />
                            <Text ml="2">{`${patient.customerAppointment.recipientFirstname} ${patient.customerAppointment.recipientLastname}`}</Text>
                          </Flex>
                          <Text maxW={{ base: "50px", md: "150px" }}>
                            {patient.customerAppointment.servicePlan}
                          </Text>
                          <Badge
                            bg={
                              patient.active
                                ? "#ACE1C1"
                                : patient.completed
                                ? "#D087E2"
                                : "gray"
                            }
                            p={2}
                            borderRadius="30px"
                            color={
                              patient.active
                                ? "#057B1F"
                                : patient.completed
                                ? "#A210C6"
                                : "white"
                            }
                            fontSize="11px"
                          >
                            {patient.active
                              ? "Ongoing"
                              : patient.completed
                              ? "Completed"
                              : "Unknown"}
                          </Badge>
                        </Flex>
                      ))}
                    </VStack>
                  )}

                  {selectedPatient && (
                    <PatientDetailsModal
                      patient={selectedPatient}
                      isOpen={isModalOpen}
                      onClose={closeModal}
                      openReportDrawer={openReportDrawer}
                    />
                  )}
                </>
              )}
            </Flex>
          </Box>
          <MobileFooter />
        </VStack>
      </Flex>
      <PatientReportDrawer isOpen={isOpen} onClose={onClose} />
      <RequestAppointmentModal isOpen={showAppointmentModal} onClose={handleCloseAppointmentModal} />
    </ChakraProvider>
  );
};

export default PatientsPage;
