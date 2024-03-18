import React, { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import "react-datepicker/dist/react-datepicker.css";

import BookAppointmentModal from "../sections/BookAppointment";
import axios from "axios";
import { CheckIcon, AddIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  ChakraProvider,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  useToast,
  Image,
  Box,
  Text,
  Flex,
  Divider,
  extendTheme,
} from "@chakra-ui/react";

import LoadingSpinner from "../../utils/Spiner";
import HelppIcon from "../../assets/HelppIcon.svg";
import CustomizeServiceModal from "../sections/CustomizeServiceModal";

import NavBar from "../authLayouts/NavBar";
import LeftSideBar from "../authLayouts/LeftSideBar";
import MobileFooter from "../authLayouts/MobileFooter";
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

const CustomizeServicePage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [customizedServices, setCustomizedServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [deleteServiceId, setDeleteServiceId] = useState(null);
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);

  const help = () => {
    navigate("/help");
  };

  const handlebackToService = () => {
    navigate("/services");
  };

  const handleOpenAppointmentModal = () => {
    setShowAppointmentModal(true);
  };

  const handleCancelModalClose = () => {
    setConfirmationModalOpen(false);
  };

  const formattedCost = (cost) => {
    // Format the costOfService as naira with the last two zeros separated by a dot
    const formattedCost =
      "₦ " + cost.toLocaleString("en-NG", { maximumFractionDigits: 2 });

    return formattedCost;
  };

  const handleConfirmation = async () => {
    try {
      const token = localStorage.getItem("token");
      const apiUrl = `http://localhost:8080/v1/appointment/deleteService/${deleteServiceId}`;

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.post(apiUrl, {}, { headers });

      if (response.data.success) {
        toast({
          title: response.data.message,
          status: "success",
          duration: 6000,
        });
        fetchData();
      } else {
        toast({
          title: "Error canceling appointment",
          description: response.data.message,
          status: "error",
          duration: 6000,
        });
        console.error("Error canceling appointment");
      }
    } catch (error) {
      console.error("An error occurred while canceling appointment:", error);
    } finally {
      setConfirmationModalOpen(false);
    }
  };

  // const formatDate = (dateString) => {
  //   const options = { year: "numeric", month: "long", day: "numeric" };
  //   const formattedDate = new Date(dateString).toLocaleDateString(
  //     undefined,
  //     options
  //   );
  //   return formattedDate;
  // };

  const handleDeleteService = (serviceId) => {
    setDeleteServiceId(serviceId);
    setConfirmationModalOpen(true);
  };

  const formatDateTime = (dateTimeString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    };
    const formattedDateTime = new Date(dateTimeString).toLocaleDateString(
      undefined,
      options
    );
    return formattedDateTime;
  };

  const fetchData = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };

      const response = await axios.get(
        "http://localhost:8080/v1/appointment/all-customized-services",
        config
      );

      if (response.data.success) {
        setCustomizedServices(response.data.data);
      } else {
        console.error("Failed to fetch custom services");
      }
    } catch (error) {
      console.error("Error fetching custom services:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [toast]);

  const handleOpenCustomizePlanFormModal = () => {
    setShowCustomizeModal(true);
  };

  const handleCloseCustomizePlanFormModal = () => {
    setShowCustomizeModal(false);
  };

  const handleCloseAppointmentModal = () => {
    setShowAppointmentModal(false);
  };

  const settingsContainerStyle = {
    animation: "slideInUp 0.9s ease-in-out",
  };

  return (
    <ChakraProvider theme={customTheme}>
      <LeftSideBar />
      <VStack
        style={settingsContainerStyle}
        position="fixed"
        ml={{ md: "250px" }}
        w={{ base: "100%", md: "70%" }}
        h={{ base: "100%", md: "100%" }}
      >
        <NavBar />

        <Box
          overflow={{ base: "scroll", md: "none" }}
          w={{ base: "100%", md: "90%" }}
          h={{ base: "100%", md: "100%" }}
        >
          <Flex margin="20px">
            <Box>
              <Text
                textAlign="left"
                fontSize={{ base: "14px", md: "18px" }}
                marginTop="3px"
                marginBottom="20px"
              >
                Welcome to the custom service section! Here, you have the
                flexibility to tailor services according to your preferences.
              </Text>
            </Box>
            <Button
              onClick={handlebackToService}
              borderColor="#A210C6"
              borderWidth="1px"
              color="#A210C6"
              fontFamily="body"
              marginTop="10px"
              ml={{ base: "30px", md: "300px" }}
              fontSize={{ base: "12px" }}
              h={{ base: "3vh", md: "5vh" }}
              borderRadius="100px"
            >
              Back
            </Button>
          </Flex>
          <Divider my={4} borderColor="gray.500" />
          <Box
            className="all-customized-services"
            // marginLeft="2%"
            textAlign="left"
            w={{ base: "100%", md: "64vw" }}
            h={{ base: "100%", md: "75vh" }}
            overflow="scroll"
            marginTop="10px"
          >
            {loading ? (
              <LoadingSpinner />
            ) : customizedServices.length === 0 ? (
              <Flex alignItems="center">
                <Text
                  fontSize={{ base: "12px" }}
                  ml={{ base: "20px", md: "60px" }}
                  marginTop="30px"
                >
                  You have no customized plan yet. Click{" "}
                </Text>
                <Text
                  style={{
                    color: "#A210C6",
                    fontStyle: "italic",
                    textDecoration: "none",
                    cursor: "pointer",
                  }}
                  marginTop="30px"
                  fontSize={{ base: "12px" }}
                  ml={{ base: "5px", md: "5px" }}
                  onClick={handleOpenCustomizePlanFormModal}
                >
                  customize service
                </Text>
                <Text
                  fontSize={{ base: "12px" }}
                  ml={{ base: "5px", md: "5px" }}
                  marginTop="30px"
                >
                  to begin.
                </Text>
              </Flex>
            ) : (
              <VStack
                overflow="scroll"
                marginTop="10px"
                textAlign="left"
                align="start"
                w={{ base: "100%", md: "50vw" }}
                spacing={4}
              >
                {customizedServices.map((service) => (
                  <Box marginTop="20px" key={service.id}>
                    <Box
                      padding="20px"
                      borderColor="#A210C6"
                      borderWidth="2px"
                      p={4}
                      borderRadius="2xl"
                      // justify="center"
                      ml={{ base: "10px" }}
                      w={{ base: "70%", md: "30vw" }}
                    >
                      <Box>
                        <Box>
                          <Flex>
                            <Text fontWeight="bold" color="black">
                              Name:
                            </Text>
                            <Text
                              marginLeft="5px"
                              color="black"
                            >{`${service.name}`}</Text>
                            <Flex ml={{ base: "30px", md: "55px" }}>
                              <Text fontWeight="bold" color="black">
                                Frequency:
                              </Text>
                              <Text
                                ml={{ base: "5px", md: "5px" }}
                                color="black"
                              >
                                {`${service.frequency}`}
                              </Text>
                            </Flex>
                          </Flex>
                          <Flex>
                            <Text fontWeight="bold" color="black">
                              Preferred Caregiver:
                            </Text>
                            <Text
                              ml={{ base: "30px", md: "45px" }}
                              color="black"
                            >
                              {`${service.medicSpecialization}`}
                            </Text>
                          </Flex>
                          <Flex>
                            <Flex>
                              <Text fontWeight="bold" color="black">
                                Duration:
                              </Text>
                              <Text
                                ml={{ base: "5px", md: "5px" }}
                                color="black"
                              >{`${service.duration}`}</Text>
                            </Flex>
                            <Flex>
                              <Text
                                ml={{ base: "30px", md: "45px" }}
                                fontWeight="bold"
                                color="black"
                              >
                                Shift:
                              </Text>
                              <Text
                                marginLeft="5px"
                                color="black"
                              >{`${service.shift}`}</Text>
                            </Flex>
                          </Flex>
                          <Flex>
                            <Text fontWeight="bold" color="black">
                              Cost of service:
                            </Text>
                            <Text
                              ml={{ base: "50px", md: "90px" }}
                              color="black"
                            >
                              {`${formattedCost(service.costOfService)}`}
                            </Text>
                          </Flex>
                        </Box>
                      </Box>
                      <Box marginTop="3px">
                        <Flex direction="column">
                          <Text
                            fontWeight="bold"
                            color="black"
                            marginTop="10px"
                          >
                            Selected Services:
                          </Text>

                          {service.selectedServices.map((selectedService) => (
                            <Text ml="20px" key={selectedService} color="black">
                              {selectedService}
                            </Text>
                          ))}
                        </Flex>
                      </Box>

                      <Flex marginTop="10px">
                        <Text fontWeight="bold" color="black">
                          Created on:
                        </Text>
                        <Text marginLeft="5px" color="black">
                          {formatDateTime(service.createdAt)}
                        </Text>
                      </Flex>
                      <Flex
                        margin="20px"
                        justifyContent="space-between"
                        marginTop="20px"
                      >
                        <Button
                          fontSize="16px"
                          leftIcon={<CheckIcon />}
                          color="#A210C6"
                          onClick={handleOpenAppointmentModal}
                          style={{
                            fontStyle: "italic",
                            cursor: "pointer",
                          }}
                          _hover={{ color: "#A210C6" }}
                          bg="none"
                        >
                          Book plan
                        </Button>
                        <Button
                          marginLeft="120px"
                          fontSize="16px"
                          leftIcon={<DeleteIcon />}
                          color="red"
                          onClick={() => handleDeleteService(service.id)}
                          style={{
                            fontStyle: "italic",
                            cursor: "pointer",
                          }}
                          _hover={{ color: "" }}
                          bg="none"
                        >
                          Delete plan
                        </Button>
                      </Flex>
                    </Box>
                  </Box>
                ))}
                <Button
                  color="green"
                  marginTop="20px"
                  marginBottom="100px"
                  leftIcon={<AddIcon />}
                  onClick={handleOpenCustomizePlanFormModal}
                >
                  Add another plan
                </Button>
              </VStack>
            )}
          </Box>

          <Box marginLeft="910px" marginTop="-150px">
            <Image
              onClick={help}
              src={HelppIcon}
              alt="Logo"
              w="70px"
              h="70px"
              style={{
                cursor: "pointer",
                animation: "zoomInOut 2s infinite alternate",
              }}
            />

            <style>
              {`
          @keyframes zoomInOut {
            0% {
              transform: scale(1);
            }
            100% {
              transform: scale(1.2);
            }
          }
        `}
            </style>
          </Box>
        </Box>
        <Box />
        <MobileFooter />
      </VStack>

      {confirmationModalOpen && (
        <Modal
          isOpen={confirmationModalOpen}
          onClose={handleCancelModalClose}
          size="md"
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Confirmation</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              Are you sure you want to delete this service? <br></br> This
              action is irreversible.
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="red" onClick={handleCancelModalClose}>
                No
              </Button>
              <Button marginLeft="5px" onClick={handleConfirmation}>
                Yes
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
      <BookAppointmentModal
        isOpen={showAppointmentModal}
        onClose={handleCloseAppointmentModal}
      />
      <CustomizeServiceModal
        isOpen={showCustomizeModal}
        onClose={handleCloseCustomizePlanFormModal}
      />
    </ChakraProvider>
  );
};
export default CustomizeServicePage;
