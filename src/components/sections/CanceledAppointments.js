import React, { useState, useEffect } from "react";
import {
  VStack,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Box,
  Flex,
  Spinner,
  useToast,
  Progress,
  Divider,
} from "@chakra-ui/react";
import axios from "axios";

const CanceledAppointmentsModal = ({ isOpen, onClose }) => {
  const [canceledAppointments, setCanceledAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchCanceledAppointments = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        };

        const response = await axios.get(
          "http://localhost:8080/v1/appointment/canceledAppointments",
          config
        );

        if (response.data.success) {
          toast({
            title: response.data.message,
            status: "success",
            duration: 6000,
          });
          setCanceledAppointments(response.data.data);
        } else {
          toast({
            title: "Request failed",
            description: response.message,
            status: "error",
            duration: 6000,
          });
          console.error("Failed to fetch canceled appointments");
        }
      } catch (error) {
        console.error("Error fetching canceled appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchCanceledAppointments();
    }
  });

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="md" borderRadius="0px">
        <ModalOverlay />
        <ModalContent maxH="80vh" overflowY="auto">
          <ModalHeader color="#A210C6">Canceled Appointments</ModalHeader>
          <ModalCloseButton />
          <ModalBody marginLeft="40px">
          <Progress size='xs' isIndeterminate />
            {loading ? (
              <Flex align="center" justify="center" height="200px">
                <Spinner size="xl" />
              </Flex>
            ) : (
              <VStack align="start" spacing={4}>
                {canceledAppointments.map((appointment) => (
                  <Box key={appointment.id}>
                    <Flex>
                      <Text fontWeight="bold" color="black">
                        Care beneficiary:
                      </Text>
                      <Text marginLeft="5px" color="black">
                        {`${appointment.recipientFirstname} ${appointment.recipientLastname}`}
                      </Text>
                    </Flex>
                    <Flex>
                      <Text fontWeight="bold" color="black">
                        Canceled on:
                      </Text>
                      <Text marginLeft="5px" color="black">
                        {formatDateTime(appointment.canceledAt)}
                      </Text>
                    </Flex>
                    <Flex>
        
                    </Flex>
                    <Divider my={4} borderColor="gray.500" /> 
                  </Box>
                ))}
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
  
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CanceledAppointmentsModal;

// Helper function to format date and time
const formatDateTime = (dateTimeString) => {
  const options = { year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric" };
  return new Date(dateTimeString).toLocaleDateString(undefined, options);
};
