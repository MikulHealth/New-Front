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
  useToast,
  Divider,
} from "@chakra-ui/react";
import axios from "axios";
import AddBeneficiaryForm from "./AddBeneficiaryFom";
import BookBeneficiaryAppointmentModal from "./BeneficiaryAppForm";
import { AddIcon } from "@chakra-ui/icons";
const BeneficiariesModal = ({ isOpen, onClose }) => {
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
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
  }, [isOpen, toast]);
  
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
        toast({
          title: response.data.message,
          status: "success",
          duration: 6000,
        });
        // Update the list of beneficiaries after removal
        const updatedBeneficiaries = beneficiaries.filter(
          (beneficiary) => beneficiary.id !== selectedBeneficiaryId
        );
        setBeneficiaries(updatedBeneficiaries);
      } else {
        toast({
          title: "Request failed",
          description: response.message,
          status: "error",
          duration: 6000,
        });
        console.error("Failed to remove beneficiary");
      }
    } catch (error) {
      toast({
        title: "Request failed",
        description: "Error removing beneficiary:",
        status: "error",
        duration: 6000,
      });
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
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader fontSize="lg" fontWeight="bold" color="#A210C6">
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
                  <Text fontWeight="bold">You have no beneficiaries yet.</Text>
                ) : (
                  beneficiaries.map((beneficiary) => (
                    <Box key={beneficiary.id}>
                      <Box>
                        <Flex>
                          <Text fontWeight="bold" color="black">
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
                          <Text fontWeight="bold" color="black">
                            Phone Number:{" "}
                          </Text>
                          <Text color="black" marginLeft="15px">
                            {beneficiary.recipientPhoneNumber ||
                              "Not available"}
                          </Text>
                        </Flex>
                        <Flex>
                          <Text fontWeight="bold" color="black">
                            Gender:{" "}
                          </Text>
                          <Text marginLeft="15px" color="black">
                            {beneficiary.recipientGender || "Not available"}
                          </Text>
                        </Flex>
                        <Flex>
                          <Text fontWeight="bold" color="black">
                            Date of Birth:{" "}
                          </Text>
                          <Text marginLeft="15px" color="black">
                            {formatDate(beneficiary.recipientDOB) ||
                              "Not availabe"}
                          </Text>
                        </Flex>

                        <Flex marginTop="5px">
                          <Text fontWeight="bold" color="black">
                            Relationship:
                          </Text>
                          <Text marginLeft="15px" color="black">
                            {beneficiary.relationship || "Not availabe"}
                          </Text>
                        </Flex>
                        <Flex marginTop="5px">
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
                        ml={{ md: "250px" }}
                        justifyContent="space-between"
                        marginTop="5px"
                      >
                        <Box>
                          <Text
                            fontSize={{ base: "16px", md: "17px" }}
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
            <DrawerHeader color="#510863">Confirmation</DrawerHeader>
            <DrawerBody>
              <Text>Are you sure you want to remove this beneficiary?</Text>
            </DrawerBody>
            <DrawerFooter alignContent="space-between">
              <Button
                colorScheme="red"
                onClick={handleConfirmRemoveBeneficiary}
              >
                Confirm
              </Button>
              <Button
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
