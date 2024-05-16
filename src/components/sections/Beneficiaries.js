import React, { useState, useEffect } from "react";
import {
  VStack,
  Text,
  Button,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  DrawerCloseButton,
  Box,
  Flex,
  Progress,
  Spinner,
  // useToast,
  extendTheme,
  Divider,
} from "@chakra-ui/react";
import axios from "axios";
import AddBeneficiaryForm from "./AddBeneficiaryFom";
import BookBeneficiaryAppointmentModal from "./BeneficiaryAppForm";
import { AddIcon } from "@chakra-ui/icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


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

const BeneficiariesModal = ({ isOpen, onClose }) => {
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [loading, setLoading] = useState(true);
  // const toast = useToast();
  const [isAddBeneficiaryFormOpen, setAddBeneficiaryFormOpen] = useState(false);
  const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [selectedBeneficiaryId, setSelectedBeneficiaryId] = useState(null);
  const [isBookAppointmentModalOpen, setBookAppointmentModalOpen] =
    useState(false);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);

  const handleRemoveBeneficiary = (beneficiaryId) => {
    setSelectedBeneficiaryId(beneficiaryId);
    setConfirmationModalOpen(true);
  };

  const handleOpenAddBeneficiaryForm = () => {
    setAddBeneficiaryFormOpen(true);
    // onClose();
  };

  const handleOpenBookAppointmentModal = (beneficiary) => {
    setSelectedBeneficiary(beneficiary);
    setBookAppointmentModalOpen(true);
  };

  useEffect(() => {
    const fetchBeneficiaries = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.get(
          // "http://localhost:8080/v1/appointment/findAllBeneficiaries",
          "https://backend-c1pz.onrender.com/v1/appointment/findAllBeneficiaries",
          config
        );

        if (response.data.success) {
          setBeneficiaries(response.data.data);
        } else {
          toast({
            title: "Request failed",
            description: response.message,
            status: "error",
            duration: 6000,
          });
          console.error("Failed to fetch beneficiaries");
        }
      } catch (error) {
        console.error("Error fetching beneficiaries:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchBeneficiaries();
    }
  }, [isOpen]);

  const formatDateTime = (dateTimeString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    return new Date(dateTimeString).toLocaleDateString(undefined, options);
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = new Date(dateString).toLocaleDateString(
      undefined,
      options
    );
    return formattedDate;
  };

  const handleConfirmRemoveBeneficiary = async () => {
    // Perform the remove beneficiary logic here
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.delete(
        // `http://localhost:8080/v1/appointment/removeBeneficiary/${selectedBeneficiaryId}`,
        `https://backend-c1pz.onrender.com/v1/appointment/removeBeneficiary/${selectedBeneficiaryId}`,

        config
      );

      if (response.data.success) {
        toast.success("Beneficiary removed");
        // Update the list of beneficiaries after removal
        const updatedBeneficiaries = beneficiaries.filter(
          (beneficiary) => beneficiary.id !== selectedBeneficiaryId
        );
        setBeneficiaries(updatedBeneficiaries);
      } else {
        toast.success("Request failed");
        console.error("Failed to remove beneficiary");
      }
    } catch (error) {
      toast.success("Request failed");
      console.error("Error removing beneficiary:", error);
    } finally {
      setConfirmationModalOpen(false);
      setSelectedBeneficiaryId(null);
    }
  };

  return (
    <>
      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        placement="right"
        size={{ base: "md", md: "lg" }}
        theme={customTheme}
      >
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
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader fontFamily="heading" fontSize="lg" fontWeight="bold" color="#A210C6">
            Beneficiaries
          </DrawerHeader>
          <DrawerCloseButton />
          <DrawerBody ml={{ md: "40px" }}>
            <Progress marginBottom="20px" size="xs" isIndeterminate />
            {loading ? (
              <Flex align="center" justify="center" height="200px">
                <Spinner size="xl" />
              </Flex>
            ) : (
              <VStack align="start" spacing={4}>
                {beneficiaries.length === 0 ? (
                  <Text fontWeight="bold" fontFamily="body">You have no beneficiaries yet.</Text>
                ) : (
                  beneficiaries.map((beneficiary) => (
                    <Box key={beneficiary.id}>
                      <Box>
                        <Flex>
                          <Text fontFamily="body" fontWeight="bold" color="black">
                            Beneficiary Name:{" "}
                          </Text>
                          <Text color="black" marginLeft="15px">
                            {`${
                              beneficiary.recipientFirstName || "Not available"
                            } ${
                              beneficiary.recipientLastName || "Not available"
                            }`}
                          </Text>
                        </Flex>
                        <Flex>
                          <Text fontFamily="body" fontWeight="bold" color="black">
                            Phone Number:{" "}
                          </Text>
                          <Text color="black" marginLeft="15px">
                            {beneficiary.recipientPhoneNumber ||
                              "Not available"}
                          </Text>
                        </Flex>
                        <Flex>
                          <Text fontFamily="body" fontWeight="bold" color="black">
                            Gender:{" "}
                          </Text>
                          <Text marginLeft="15px" color="black">
                            {beneficiary.recipientGender || "Not available"}
                          </Text>
                        </Flex>
                        <Flex>
                          <Text fontFamily="body"  fontWeight="bold" color="black">
                            Date of Birth:{" "}
                          </Text>
                          <Text marginLeft="15px" color="black">
                            {formatDate(beneficiary.recipientDOB) ||
                              "Not availabe"}
                          </Text>
                        </Flex>

                        <Flex fontFamily="body" marginTop="5px">
                          <Text fontWeight="bold" color="black">
                            Relationship:
                          </Text>
                          <Text marginLeft="15px" color="black">
                            {beneficiary.relationship || "Not availabe"}
                          </Text>
                        </Flex>
                        <Flex fontFamily="body" marginTop="5px">
                          <Text fontWeight="bold" color="black">
                            Added on:
                          </Text>
                          <Text marginLeft="15px" color="black">
                            {formatDateTime(beneficiary.createdAt) ||
                              "Not availabe"}
                          </Text>
                        </Flex>
                      </Box>
                      <Flex
                        fontSize={{ base: "10px" }}
                        ml={{ md: "200px" }}
                        justifyContent="space-between"
                        marginTop="5px"
                      >
                        <Box>
                          <Text
                            fontSize={{ base: "16px", md: "17px" }}
                            fontFamily="body"
                            style={{
                              color: "#A210C6",
                              fontStyle: "italic",
                              cursor: "pointer",
                            }}
                            _hover={{ color: "#510863" }}
                            onClick={() =>
                              handleOpenBookAppointmentModal(beneficiary)
                            }
                          >
                            Book appointment
                          </Text>
                        </Box>
                        <Box>
                          <Text
                            marginLeft="40px"
                            fontFamily="body"
                            fontSize={{ base: "16px", md: "17px" }}
                            onClick={() =>
                              handleRemoveBeneficiary(beneficiary.id)
                            }
                            style={{
                              // marginLeft: "250px",
                              color: "red",
                              fontStyle: "italic",
                              cursor: "pointer",
                            }}
                            _hover={{ color: "#A210C6" }}
                          >
                            Remove beneficiary
                          </Text>
                        </Box>
                      </Flex>

                      <Divider my={4} borderColor="gray.500" />
                    </Box>
                  ))
                )}
              </VStack>
            )}
          </DrawerBody>
          <DrawerFooter>
            <Button
              onClick={handleOpenAddBeneficiaryForm}
              color="white"
              bg="#A210C6"
              leftIcon={<AddIcon />}
              fontFamily="body"
            >
              Add Beneficiary
            </Button>

            {isAddBeneficiaryFormOpen && (
              <AddBeneficiaryForm
                isOpen={isAddBeneficiaryFormOpen}
                onClose={() => setAddBeneficiaryFormOpen(false)}
              />
            )}
            {isBookAppointmentModalOpen && (
              <BookBeneficiaryAppointmentModal
                isOpen={isBookAppointmentModalOpen}
                onClose={() => setBookAppointmentModalOpen(false)}
                selectedBeneficiary={selectedBeneficiary}
              />
            )}
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      {isConfirmationModalOpen && (
        <Drawer
          isOpen={isConfirmationModalOpen}
          onClose={() => setConfirmationModalOpen(false)}
          size="sm"
        >
          <DrawerOverlay />
          <DrawerContent maxH="30vh" overflowY="auto">
            <DrawerHeader fontFamily="heading" color="#510863">Confirmation</DrawerHeader>
            <DrawerBody>
              <Text fontFamily="body">Are you sure you want to remove this beneficiary?</Text>
            </DrawerBody>
            <DrawerFooter alignContent="space-between">
              <Button
                colorScheme="red"
                fontFamily="body"
                onClick={handleConfirmRemoveBeneficiary}
              >
                Confirm
              </Button>
              <Button
              fontFamily="body"
                marginLeft="5px"
                bg="#510863"
                color="white"
                onClick={() => setConfirmationModalOpen(false)}
              >
                Cancel
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
};
export default BeneficiariesModal;
