import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
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
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import MedicSideBar from "../authLayouts/MedicSideBar";
import MedicNavBar from "../authLayouts/MedicNavBar";
import MobileFooter from "../authLayouts/MobileFooter";
import LoadingSpinner from "../../utils/Spiner";
import PatientReportDrawer from "../sections/PatientReportDrawer";

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
          // "http://localhost:8080/v1/appointment/get-active-patient",
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

  const tableSize = useBreakpointValue({ base: "sm", md: "md" });

  const settingsContainerStyle = {
    animation: "slideInUp 0.9s ease-in-out",
  };

  return (
    <ChakraProvider theme={customTheme}>
      <Flex
        style={settingsContainerStyle}
        direction={{ base: "column", md: "row" }}
      >
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
                  <Table variant="simple" size={tableSize}>
                    <Thead>
                      <Tr>
                        <Th>RN</Th>
                        <Th>Patient Name</Th>
                        <Th>Appointment Type</Th>
                        <Th>Status</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {patients.map((patient) => (
                        <Tr
                          key={patient.id}
                          onClick={() => openModal(patient)}
                          cursor="pointer"
                        >
                          <Td>{patient.customerId}</Td>
                          <Td>
                            <Flex alignItems="center">
                              <Avatar
                                w="30px"
                                h="30px"
                                bg="gray.500"
                                color="white"
                                name={`${patient.recipientFirstname} ${patient.recipientLastname}`}
                              />
                              <Text ml="2">{`${patient.recipientFirstname} ${patient.recipientLastname}`}</Text>
                            </Flex>
                          </Td>
                          <Td>{patient.servicePlan}</Td>
                          <Td>
                            <Badge
                              borderRadius="5px"
                              color="#057B1F"
                              p="4px"
                              bg={
                                patient.appointmentActive ? "green" : "#ACE1C1"
                              }
                            >
                              {patient.appointmentActive
                                ? "Completed"
                                : "Ongoing"}
                            </Badge>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                  {selectedPatient && (
                    <Modal isOpen={isModalOpen} onClose={closeModal}>
                      <ModalOverlay />
                      <ModalContent>
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
                            />
                            <Box textAlign="left" w="full">
                              <Flex>
                                <Text fontWeight="bold" fontSize="lg" mt="2">
                                  Name:
                                </Text>
                                <Text ml="5px" fontSize="lg" mt="2">
                                  {selectedPatient.recipientFirstname}{" "}
                                  {selectedPatient.recipientLastname}
                                </Text>
                              </Flex>
                              <Flex>
                                <Text fontWeight="bold" mt="2">
                                  Location:
                                </Text>
                                <Text ml="5px" mt="2">
                                  {selectedPatient.currentLocation}
                                </Text>
                              </Flex>
                              <Flex>
                                <Text fontWeight="bold" mt="2">
                                  Phone number:
                                </Text>
                                <Text ml="5px" mt="2">
                                  {selectedPatient.recipientPhoneNumber}
                                </Text>
                              </Flex>
                              <Flex>
                                <Text fontWeight="bold" mt="2">
                                  Gender:
                                </Text>
                                <Text ml="5px" mt="2">
                                  {selectedPatient.recipientGender}
                                </Text>
                              </Flex>
                              <Flex>
                                <Text fontWeight="bold" mt="2">
                                  Date of Birth:
                                </Text>
                                <Text ml="5px" mt="2">
                                  {formatDateTime(selectedPatient.recipientDOB)}
                                </Text>
                              </Flex>
                              <Flex>
                                <Text fontWeight="bold" mt="2">
                                  Medical history:
                                </Text>
                                <Text ml="5px" mt="2">
                                  {selectedPatient.recipientHealthHistory}
                                </Text>
                              </Flex>
                              <Flex>
                                <Text fontWeight="bold" mt="2">
                                  Service Plan:
                                </Text>
                                <Text ml="5px" mt="2">
                                  {selectedPatient.servicePlan}
                                </Text>
                              </Flex>
                              <Flex>
                                <Text fontWeight="bold" mt="2">
                                  Shift:
                                </Text>
                                <Text ml="5px" mt="2">
                                  {selectedPatient.shift}
                                </Text>
                              </Flex>
                              <Flex>
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
