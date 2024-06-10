import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Text,
  VStack,
  Badge,
  Avatar,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  extendTheme,
  ChakraProvider,
  useDisclosure,
  Image,
  Divider,
} from "@chakra-ui/react";
import axios from "axios";
import MedicSideBar from "../authLayouts/MedicSideBar";
import MedicNavBar from "../authLayouts/MedicNavBar";
import MobileFooter from "../authLayouts/MobileFooter";
import LoadingSpinner from "../../utils/Spiner";
import PatientReportDrawer from "../sections/PatientReportDrawer";
import Check from "../../assets/Check.svg";

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

  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "https://backend-c1pz.onrender.com/v1/appointment/get-active-patient",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.data.success) {
          setPatients(response.data.data.map((app) => app.appointment)); // Mapping only the appointment details
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
    setSelectedPatient(patient);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPatient(null);
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()}`;
  };

  return (
    <ChakraProvider theme={customTheme}>
      <Flex direction={{ base: "column", md: "row" }}>
        <Box w={{ base: "100%", md: "20%" }}>
          <MedicSideBar />
        </Box>
        <VStack w={{ base: "100%", md: "80%" }}>
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
                    >
                      <Text fontWeight="bold">Polify No.</Text>
                      <Text fontWeight="bold">Patient name</Text>
                      <Text fontWeight="bold">Appointment type</Text>
                      <Text fontWeight="bold">Status</Text>
                    </Flex>
                    <Divider my={1} borderColor="gray.500" />
                  </Box>

                  <VStack color="#212427B2" spacing={4} align="stretch">
                    {patients.map((patient) => (
                      <Flex
                        fontSize={{ base: "10px", md: "16px" }}
                        key={patient.id}
                        p={4}
                        borderRadius="md"
                        bg="#ECCFF4"
                        justifyContent="space-between"
                        alignItems="center"
                        w="full"
                        onClick={() => openModal(patient)}
                        cursor="pointer"
                        _hover={{ bg: "purple.100" }}
                      >
                        <Image
                          src={Check}
                          // mt={{ base: "40px", md: "40px" }}
                          w={{ base: "16px", md: "16px" }}
                          h={{ base: "16px", md: "16px" }}
                        />
                        {/* <Text>{patient.customerId}</Text> */}
                        <Flex
                          maxW={{ base: "60px", md: "150px" }}
                          color="#212427B2"
                          alignItems="center"
                        >
                          <Avatar
                            size="sm"
                            bg="#212427B2"
                            color="white"
                            name={`${patient.recipientFirstname} ${patient.recipientLastname}`}
                          />
                          <Text ml="2">{`${patient.recipientFirstname} ${patient.recipientLastname}`}</Text>
                        </Flex>
                        <Text maxW={{ base: "50px", md: "150px" }}>
                          {patient.servicePlan}
                        </Text>
                        <Badge
                          bg={patient.appointmentActive ? "#D087E2" : "#ACE1C1"}
                          p={2}
                          borderRadius="30px"
                          color={
                            patient.appointmentActive ? "#A210C6" : "#057B1F"
                          }
                          fontSize="11px"
                        >
                          {patient.appointmentActive ? "Completed" : "Ongoing"}
                        </Badge>
                      </Flex>
                    ))}
                  </VStack>
                  {selectedPatient && (
                    <Modal
                      isOpen={isModalOpen}
                      onClose={closeModal}
                      size={{ base: "sm", md: "md" }}
                    >
                      <ModalOverlay />
                      <ModalContent
                        borderRadius="20px"
                        border="3px solid #A210C6"
                      >
                        <ModalHeader color="#A210C6" textAlign="center">
                          Patient Details
                        </ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                          <Flex
                            direction="column"
                            align="center"
                            justify="center"
                            textAlign="center"
                          >
                            <Avatar
                              name={`${selectedPatient.recipientFirstname} ${selectedPatient.recipientLastname}`}
                              src={selectedPatient.picturePath}
                              bg="gray.500"
                              color="white"
                              w={{ base: "100px", md: "100px" }}
                              h={{ base: "100px", md: "100px" }}
                              border="3px solid #057B1F"
                            />
                            <Box textAlign="left" w="full">
                              <Flex wrap="wrap">
                                <Text fontWeight="bold" fontSize="lg" mt="2">
                                  Name:
                                </Text>
                                <Text ml="5px" fontSize="lg" mt="2">
                                  {selectedPatient.recipientFirstname}{" "}
                                  {selectedPatient.recipientLastname}
                                </Text>
                              </Flex>
                              <Flex wrap="wrap">
                                <Text fontWeight="bold" mt="2">
                                  Location:
                                </Text>
                                <Text ml="5px" mt="2">
                                  {selectedPatient.currentLocation}
                                </Text>
                              </Flex>
                              <Flex wrap="wrap">
                                <Text fontWeight="bold" mt="2">
                                  Phone number:
                                </Text>
                                <Text ml="5px" mt="2">
                                  {selectedPatient.recipientPhoneNumber}
                                </Text>
                              </Flex>
                              <Flex wrap="wrap">
                                <Text fontWeight="bold" mt="2">
                                  Gender:
                                </Text>
                                <Text ml="5px" mt="2">
                                  {selectedPatient.recipientGender}
                                </Text>
                              </Flex>
                              <Flex wrap="wrap">
                                <Text fontWeight="bold" mt="2">
                                  Date of Birth:
                                </Text>
                                <Text ml="5px" mt="2">
                                  {formatDateTime(selectedPatient.recipientDOB)}
                                </Text>
                              </Flex>

                              <Flex wrap="wrap">
                                <Text fontWeight="bold" mt="2">
                                  Service Plan:
                                </Text>
                                <Text ml="5px" mt="2">
                                  {selectedPatient.servicePlan}
                                </Text>
                              </Flex>
                              <Flex wrap="wrap">
                                <Text fontWeight="bold" mt="2">
                                  Shift:
                                </Text>
                                <Text ml="5px" mt="2">
                                  {selectedPatient.shift}
                                </Text>
                              </Flex>
                              <Flex wrap="wrap">
                                <Text fontWeight="bold" mt="2">
                                  Amount Payable:
                                </Text>
                                <Text ml="5px" mt="2">
                                  N{" "}
                                  {parseFloat(
                                    selectedPatient.costOfService
                                  ).toLocaleString()}
                                </Text>
                              </Flex>
                              <Flex wrap="wrap">
                                <Text fontWeight="bold" mt="2">
                                  Medical history:
                                </Text>
                                <Text
                                  maxW={{ base: "50px", md: "450px" }}
                                  ml="5px"
                                  mt="2"
                                >
                                  {selectedPatient.recipientHealthHistory}
                                </Text>
                              </Flex>
                            </Box>

                            <Button
                              mb="20px"
                              mt="4"
                              color="white"
                              bg="#A210C6"
                              borderRadius="50px"
                              onClick={onOpen}
                            >
                              Upload report
                            </Button>
                          </Flex>
                        </ModalBody>
                      </ModalContent>
                    </Modal>
                  )}
                </>
              )}
            </Flex>
          </Box>
          <MobileFooter />
        </VStack>
      </Flex>
      <PatientReportDrawer isOpen={isOpen} onClose={onClose} />
    </ChakraProvider>
  );
};

export default PatientsPage;
