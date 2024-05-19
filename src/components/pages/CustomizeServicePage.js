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
  useMediaQuery,
  // useToast,
  Image,
  Box,
  Text,
  Flex,
  extendTheme,
} from "@chakra-ui/react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import LoadingSpinner from "../../utils/Spiner";
// import HelppIcon from "../../assets/HelppIcon.svg";
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
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");
  const modalWidth = isLargerThan768 ? "400px" : "90vw";
  // const toast = useToast();
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

  const formattedCost = (amount) => {
    const num = Number(amount);
    return "₦ " + num.toLocaleString();
  };

  const handleConfirmation = async () => {
    try {
      const token = localStorage.getItem("token");
      // const apiUrl = `http://localhost:8080/v1/appointment/deleteService/${deleteServiceId}`;
      const apiUrl = `https://backend-c1pz.onrender.com/v1/appointment/deleteService/${deleteServiceId}`;
      // "https://backend-c1pz.onrender.com/v1/appointment/all-customized-services",
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.post(apiUrl, {}, { headers });

      if (response.data.success) {
        toast.success("Plan removed");
        fetchData();
      } else {
        toast.error("Erroe removing plan");
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
        // "http://localhost:8080/v1/appointment/all-customized-services",
        "https://backend-c1pz.onrender.com/v1/appointment/all-customized-services",
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
  }, []);

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
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <LeftSideBar />
      <VStack
        style={settingsContainerStyle}
        overflow={{ base: "hidden", md: "scroll" }}
        ml={{ md: "250px" }}
        w={{ base: "100%", md: "70%" }}
        h={{ base: "100%", md: "100%" }}
      >
        <NavBar />
        <Button
          onClick={handlebackToService}
          borderColor="#A210C6"
          borderWidth="1px"
          color="#A210C6"
          fontFamily="body"
          marginTop="10px"
          ml={{ base: "-280px", md: "-830px" }}
          fontSize={{ base: "12px" }}
          // h={{ base: "3vh", md: "5vh" }}
          borderRadius="100px"
        >
          Back
        </Button>
        <Box
          w={{ base: "100%", md: "90%" }}
          h={{ base: "100%", md: "100%" }}
          ml={{ base: "40px", md: "0" }}
        >
          <Box
            className="all-customized-services"
            textAlign="left"
            h={{ base: "100%", md: "75vh" }}
            marginTop="10px"
          >
            {loading ? (
              <LoadingSpinner />
            ) : customizedServices.length === 0 ? (
              <Flex alignItems="center">
                <Text
                  fontSize={{ base: "12px" }}
                  fontFamily="body"
                  ml={{ base: "20px", md: "60px" }}
                  marginTop="30px"
                >
                  You have no customized plan yet. Click{" "}
                </Text>
                <Text
                  fontFamily="body"
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
                marginTop="10px"
                textAlign="left"
                align="start"
                // w={{ base: "50vh", md: "50vw" }}
                overflow="hidden"
                spacing={4}
              >
                {customizedServices.map((service) => (
                  <Box
                    w={{ base: "120%", md: "" }}
                    marginTop="20px"
                    key={service.id}
                  >
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
                          <Text
                            fontFamily="heading"
                            fontSize={{ base: "22px", md: "28px" }}
                            fontWeight="bold"
                            color="#A210C6"
                          >
                            {`${service.name}`}
                          </Text>

                          <Flex fontFamily="body">
                            <Text fontWeight="bold" color="black">
                              Frequency:
                            </Text>
                            <Text ml={{ base: "5px", md: "5px" }} color="black">
                              {`${service.frequency}`}
                            </Text>
                          </Flex>

                          <Flex fontFamily="body">
                            <Text fontWeight="bold" color="black">
                              Preferred Caregiver:
                            </Text>
                            <Text ml={{ base: "5px", md: "5px" }} color="black">
                              {`${service.medicSpecialization}`}
                            </Text>
                          </Flex>

                          <Flex fontFamily="body">
                            <Text fontWeight="bold" color="black">
                              Duration:
                            </Text>
                            <Text
                              ml={{ base: "5px", md: "5px" }}
                              color="black"
                            >{`${service.duration}`}</Text>
                          </Flex>
                          <Flex fontFamily="body">
                            <Text fontWeight="bold" color="black">
                              Shift:
                            </Text>
                            <Text
                              marginLeft="5px"
                              color="black"
                            >{`${service.shift}`}</Text>
                          </Flex>

                          <Flex fontFamily="body">
                            <Text fontWeight="bold" color="black">
                              Cost of service:
                            </Text>
                            <Text ml={{ base: "5px", md: "5px" }} color="black">
                              {`${formattedCost(service.costOfService)}`}
                            </Text>
                          </Flex>
                        </Box>
                      </Box>
                      <Box fontFamily="body" marginTop="3px">
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

                      <Flex fontFamily="body" marginTop="10px">
                        <Text
                          fontSize={{ base: "14", md: "16px" }}
                          fontWeight="bold"
                          color="black"
                        >
                          Created on:
                        </Text>
                        <Text
                          fontSize={{ base: "14", md: "16px" }}
                          marginLeft="5px"
                          color="black"
                        >
                          {formatDateTime(service.createdAt)}
                        </Text>
                      </Flex>
                      <Flex
                        // margin="20px"
                        justifyContent="space-between"
                        marginTop="20px"
                      >
                        <Button
                          // w={{ base: "50px", md: "120px" }}
                          fontFamily="body"
                          border="2px solid red"
                          fontSize="16px"
                          leftIcon={<DeleteIcon />}
                          color="red"
                          onClick={() => handleDeleteService(service.id)}
                          style={{
                            // fontStyle: "italic",
                            cursor: "pointer",
                          }}
                          _hover={{ color: "" }}
                          bg="none"
                        >
                          Delete plan
                        </Button>
                        <Button
                          fontFamily="body"
                          //  w={{ base: "50px", md: "120px" }}
                          fontSize="16px"
                          leftIcon={<CheckIcon />}
                          color="white"
                          onClick={handleOpenAppointmentModal}
                          style={{
                            // fontStyle: "italic",
                            cursor: "pointer",
                          }}
                          _hover={{ color: "#A210C6" }}
                          bg="#A210C6"
                        >
                          Book plan
                        </Button>
                      </Flex>
                    </Box>
                  </Box>
                ))}
                <Button
                  color="green"
                  marginTop="20px"
                  mb={{ base: "150px", md: "60px" }}
                  ml={{ base: "10px", md: "10px" }}
                  leftIcon={<AddIcon />}
                  onClick={handleOpenCustomizePlanFormModal}
                >
                  Create another plan
                </Button>
              </VStack>
            )}
          </Box>

          <Box
            display={{ base: "none", md: "none" }}
            marginLeft="910px"
            marginTop="-150px"
          >
            <Image
              onClick={help}
              // src={HelppIcon}
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
        theme={customTheme}
          isOpen={confirmationModalOpen}
          onClose={handleCancelModalClose}
          size="md"
        >
          <ModalOverlay />
          <ModalContent width={modalWidth}
          borderRadius="25px 25px 25px 0px">
            <ModalHeader fontFamily="heading" color="#A210C6">Confirmation</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              Are you sure you want to delete this service? <br></br> This
              action is irreversible.
            </ModalBody>
            <ModalFooter>
              <Button
                bg="#E1ACAE"
                color="red.500"
                onClick={handleCancelModalClose}
              >
                No
              </Button>
              <Button
                 bg="#A210C6"
                 color="white"
                marginLeft="5px"
                onClick={handleConfirmation}
              >
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
