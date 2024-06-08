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
  Button,
  VStack,
  Avatar,
  extendTheme,
  ChakraProvider,
  Badge,
  Checkbox,
} from "@chakra-ui/react";
// import { AddIcon } from '@chakra-ui/icons';
import LeftSideBar from "../authLayouts/MedicSideBar";
import NavBar from "../authLayouts/MedicNavBar";
import MobileFooter from "../authLayouts/MedicFooter";
import RequestAppointmentModal from "../sections/RequestAppModal";
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
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  useEffect(() => {
    // Fetch patients data from the backend
    const fetchPatients = async () => {
      try {
        // Replace this with your API call
        const response = await fetch("https://your-backend-api.com/patients");
        const data = await response.json();
        setPatients(data);
      } catch (error) {
        console.error("Error fetching patients:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const handlePatientClick = (patient) => {
    setSelectedPatient(patient);
  };

  const settingsContainerStyle = {
    animation: "slideInUp 0.9s ease-in-out",
  };

  return (
    <ChakraProvider theme={customTheme} overflow="hidden">
      <LeftSideBar />
      <VStack
        style={settingsContainerStyle}
        ml={{ md: "170px" }}
        w={{ base: "100%", md: "70%" }}
        h={{ base: "100%", md: "100%" }}
      >
          <NavBar />
        

        <Box  mt="150px" p="20px">
          {loading ? (
            <Text>Loading...</Text>
          ) : patients.length === 0 ? (
            <Text>
              No patients seen yet. Click{" "}
              <Text
                as="span"
                color="#A210C6"
                onClick={openModal}
                cursor="pointer"
              >
                request appointment
              </Text>{" "}
              to begin.
            </Text>
          ) : (
            <Flex>
              <Table variant="simple" w="60%">
                <Thead>
                  <Tr>
                    <Th>RN</Th>
                    <Th>Patient name</Th>
                    <Th>Appointment type</Th>
                    <Th>Status</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {patients.map((patient) => (
                    <Tr
                      key={patient.id}
                      onClick={() => handlePatientClick(patient)}
                      cursor="pointer"
                    >
                      <Td>
                        <Checkbox value={patient.id} />
                        {patient.rn}
                      </Td>
                      <Td>
                        <Flex alignItems="center">
                          <Avatar
                            size="sm"
                            name={patient.name}
                            src={patient.imageUrl}
                          />
                          <Text ml="3">{patient.name}</Text>
                        </Flex>
                      </Td>
                      <Td>{patient.appointmentType}</Td>
                      <Td>
                        <Badge
                          colorScheme={
                            patient.status === "Ongoing" ? "green" : "purple"
                          }
                          variant="solid"
                          px="4"
                          py="1"
                          borderRadius="20px"
                        >
                          {patient.status}
                        </Badge>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
              {selectedPatient && (
                <Box w="40%" p="20px">
                  <Box
                    borderWidth="1px"
                    borderRadius="lg"
                    overflow="hidden"
                    p="6"
                  >
                    <Text
                      fontSize="xl"
                      fontWeight="bold"
                      mb="4"
                      textAlign="center"
                      color="#A210C6"
                    >
                      PATIENT INFO
                    </Text>
                    <Flex justifyContent="center" mb="4">
                      <Avatar
                        size="2xl"
                        name={selectedPatient.name}
                        src={selectedPatient.imageUrl}
                      />
                    </Flex>
                    <Text mb="2">
                      <strong>Name:</strong> {selectedPatient.name}
                    </Text>
                    <Text mb="2">
                      <strong>Location:</strong> {selectedPatient.location}
                    </Text>
                    <Text mb="2">
                      <strong>RN:</strong> {selectedPatient.rn}
                    </Text>
                    <Text mb="2">
                      <strong>Plan:</strong> {selectedPatient.plan}
                    </Text>
                    <Text mb="2">
                      <strong>Shift:</strong> {selectedPatient.shift}
                    </Text>
                    <Text mb="2">
                      <strong>Amount payable:</strong>{" "}
                      {selectedPatient.amountPayable}
                    </Text>
                    <Button
                      mt="4"
                      bg="#A210C6"
                      color="white"
                      w="100%"
                      onClick={openDrawer}
                    >
                      Upload report
                    </Button>
                  </Box>
                </Box>
              )}
            </Flex>
          )}
        </Box>
        <RequestAppointmentModal isOpen={isModalOpen} onClose={closeModal} />
        <PatientReportDrawer isOpen={isDrawerOpen} onClose={closeDrawer} />
        <MobileFooter />
      </VStack>
    </ChakraProvider>
  );
};

export default PatientsPage;
