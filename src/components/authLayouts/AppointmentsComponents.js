import React from "react";
import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Box,
  Text,
  Flex,
  VStack,
  Divider,
  useMediaQuery,
} from "@chakra-ui/react";
import { EditIcon, CheckIcon, CloseIcon, WarningIcon } from "@chakra-ui/icons";
import { PhoneIcon } from "@chakra-ui/icons";

export const AppointmentList = ({ appointments, handleViewMore }) => {
  return (
    <Box>
      <Flex
        mt={{ base: "-10px", md: "-10px" }}
        mb="50px"
        w={{ base: "90vw", md: "60vw" }}
        position="fixed"
        ml={{ base: "-8px", md: "-20px" }}
        bg="#D087E2"
        p={4}
        borderRadius="md"
        justifyContent="space-between"
        color="white"
        fontSize={{ base: "10px", md: "16px" }}
      >
        <Text fontWeight="bold">Name</Text>
        <Text fontWeight="bold">Type</Text>
        <Text fontWeight="bold">Plan</Text>
        <Text fontWeight="bold">Status</Text>
        <Text fontWeight="bold">Payment</Text>
      </Flex>
      <VStack
        mb={{ base: "150", md: "250" }}
        overflow="scroll"
        justifyContent="space-between"
        mt={{ base: 10, md: 16 }}
        align="start"
        spacing={4}
      >
        {appointments.map((appointment) => (
          <Box
            ml={{ base: "10px" }}
            onClick={() => handleViewMore(appointment)}
            key={appointment.id}
            style={{ cursor: "pointer" }}
            w={{ base: "85vw", md: "57vw" }}
            p={4}
            borderBottom="1px solid #e2e8f0"
          >
            <Flex
              fontSize={{ base: "10px", md: "14px" }}
              textAlign="left"
              ml={{ base: "-15px", md: "-16px" }}
              justifyContent="space-between"
            >
              <Text
                textAlign="left"
                maxW={{ base: "80px", md: "100px" }}
                wordWrap="break-word"
              >
                {`${appointment.recipientFirstname} ${appointment.recipientLastname}`}
              </Text>
              <Text
                textAlign="left"
                maxW={{ base: "50px", md: "100px" }}
              >{`${appointment.shift} `}</Text>
              <Text
                textAlign="left"
                maxW={{ base: "60px", md: "100px" }}
                wordWrap="break-word"
              >{`${appointment.servicePlan} `}</Text>
              <Box
                w={{ base: "60px", md: "97px" }}
                h={{ base: "25px", md: "33px" }}
                textAlign="center"
                borderRadius="10px"
                p="5px"
                bg={
                  appointment.appointmentCompleted
                    ? "#D087E2"
                    : appointment.appointmentActive
                    ? "#ACE1C1"
                    : appointment.appointmentMatched
                    ? "#F4DDA2"
                    : appointment.appointmentPending
                    ? "#F4DDA2"
                    : "black"
                }
              >
                <Text
                  textAlign="center"
                  fontSize={{ base: "10px", md: "14px" }}
                  color={
                    appointment.appointmentCompleted
                      ? "#A210C6"
                      : appointment.appointmentActive
                      ? "#057B1F"
                      : appointment.appointmentMatched
                      ? "#B48B25"
                      : appointment.appointmentPending
                      ? "#B48B25"
                      : "black"
                  }
                >
                  {appointment.appointmentCompleted
                    ? "Completed"
                    : appointment.appointmentActive
                    ? "Active"
                    : appointment.appointmentMatched
                    ? "Paired"
                    : appointment.appointmentPending
                    ? "Pending"
                    : "Unknown"}
                </Text>
              </Box>
              <Box
                w={{ base: "50px", md: "97px" }}
                h={{ base: "25px", md: "33px" }}
                borderRadius="10px"
                p="5px"
              >
                <Text
                  fontSize={{ base: "10px", md: "14px" }}
                  fontWeight="bold"
                  textAlign="center"
                  color={appointment?.paid ? "#057B1F" : "red.500"}
                >
                  {appointment?.paid ? "Paid" : "Unpaid"}
                </Text>
              </Box>
            </Flex>
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export const AppointmentDetails = ({
  isOpen,
  onClose,
  appointment,
  handlePayment,
  handleEditAppointment,
  handleCancelAppointment,
  handleViewMedicDetails,
}) => {
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const date = new Date(dateString);
    date.setHours(date.getHours() + 1);
    return date.toLocaleDateString(undefined, options);
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
    return new Date(dateTimeString).toLocaleDateString(undefined, options);
  };

  const formattedCost = (amount) => {
    const num = Number(amount);
    return "₦ " + num.toLocaleString();
  };

  return (
    <Drawer isOpen={isOpen} onClose={onClose} placement="right" size="md">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          borderBottomWidth="1px"
          fontSize="lg"
          fontWeight="bold"
          color="#A210C6"
        >
          Appointment Details
          <Button variant="ghost" onClick={onClose} leftIcon={<CloseIcon />} />
        </DrawerHeader>
        {appointment.appointmentActive && (
          <Button
            ml={{ base: "5px" }}
            bg="blue.400"
            color="white"
            _hover={{ color: "" }}
            onClick={handleViewMedicDetails}
          >
            View Medic Details
          </Button>
        )}
        {!appointment.paid && (
          <Button
            ml={{ base: "5px" }}
            bg="green.400"
            color="white"
            _hover={{ color: "" }}
            onClick={() => handlePayment(appointment)}
            leftIcon={<CheckIcon />}
          >
            Pay for appointment
          </Button>
        )}
        <DrawerBody overflowY="auto">
          <Flex
            flexDirection="column"
            alignItems="start"
            justifyContent="flex-start"
            marginLeft="20px"
          >
            <Flex>
              <Text fontWeight="bold">Status:</Text>
              <Text
                fontSize="16px"
                marginLeft="20px"
                color={
                  appointment.appointmentCompleted
                    ? "green.500"
                    : appointment.appointmentActive
                    ? "blue.500"
                    : appointment.appointmentMatched
                    ? "yellow.500"
                    : appointment.appointmentPending
                    ? "yellow.500"
                    : "black"
                }
              >
                {appointment.appointmentCompleted
                  ? "Completed"
                  : appointment.appointmentActive
                  ? "Active"
                  : appointment.appointmentMatched
                  ? "Paired"
                  : appointment.appointmentPending
                  ? "Pending"
                  : "Unknown"}
              </Text>
            </Flex>
            <Divider my={4} borderColor="gray.500" />
            <Flex>
              <Text fontWeight="bold" color="black">
                Beneficiary name:
              </Text>
              <Text marginLeft="20px" color="black">
                {appointment.recipientFirstname && appointment.recipientLastname
                  ? `${appointment.recipientFirstname} ${appointment.recipientLastname}`
                  : "Not available"}
              </Text>
            </Flex>
            <Divider my={4} borderColor="gray.500" />
            <Flex marginTop="5px">
              <Text fontWeight="bold" color="black">
                MH Policy No:
              </Text>
              <Text marginLeft="20px" color="black">
                {appointment?.policyNumber || "Not available"}
              </Text>
            </Flex>
            <Divider my={4} borderColor="gray.500" />
            <Flex marginTop="5px">
              <Text fontWeight="bold" color="black">
                Phone Number:
              </Text>
              <Text marginLeft="20px" color="black">
                {appointment.recipientPhoneNumber || "Not available"}
              </Text>
            </Flex>
            <Divider my={4} borderColor="gray.500" />
            <Flex marginTop="5px">
              <Text fontWeight="bold" color="black">
                Gender:
              </Text>
              <Text marginLeft="20px" color="black">
                {appointment.recipientGender || "Not available"}
              </Text>
            </Flex>
            <Divider my={4} borderColor="gray.500" />
            <Flex marginTop="5px">
              <Text fontWeight="bold" color="black">
                Date of Birth:
              </Text>
              <Text marginLeft="20px" color="black">
                {formatDate(appointment.recipientDOB) || "Not available"}
              </Text>
            </Flex>
            <Divider my={4} borderColor="gray.500" />
            <Flex marginTop="5px">
              <Text fontWeight="bold" color="black">
                Current Location:
              </Text>
              <Text marginLeft="20px" color="black">
                {appointment.currentLocation || "Not available"}
              </Text>
            </Flex>
            <Divider my={4} borderColor="gray.500" />
            <Flex marginTop="5px">
              <Text fontWeight="bold" color="black">
                City/Town:
              </Text>
              <Text marginLeft="20px" color="black">
                {appointment.recipientTown || "Not available"}
              </Text>
            </Flex>
            <Divider my={4} borderColor="gray.500" />
            <Flex marginTop="5px">
              <Text fontWeight="bold" color="black">
                Preferred Caregiver Gender:
              </Text>
              <Text marginLeft="20px" color="black">
                {appointment.preferredMedicGender || "Not available"}
              </Text>
            </Flex>
            <Divider my={4} borderColor="gray.500" />
            <Flex marginTop="5px">
              <Text fontWeight="bold" color="black">
                Preferred Cargiver Language:
              </Text>
              <Text marginLeft="20px" color="black">
                {appointment.preferredLanguage || "Not available"}
              </Text>
            </Flex>
            <Divider my={4} borderColor="gray.500" />

            <Flex marginTop="5px">
              <Text fontWeight="bold" color="black">
                Relationship:
              </Text>
              <Text marginLeft="20px" color="black">
                {appointment.relationship || "Nil"}
              </Text>
            </Flex>
            <Divider my={4} borderColor="gray.500" />
            <Flex marginTop="5px" marginBottom="10px">
              <Text fontWeight="bold" color="black">
                Booked on:
              </Text>
              <Text marginLeft="20px" color="black">
                {formatDateTime(appointment.createdAt)}
              </Text>
            </Flex>
            <Divider my={4} borderColor="gray.500" />

            <Flex>
              <Text fontWeight="bold" color="black">
                Shift:
              </Text>
              <Text marginLeft="20px" color="black">
                {appointment.shift || "Not available"}
              </Text>
            </Flex>
            <Divider my={4} borderColor="gray.500" />

            <Flex marginTop="5px">
              <Text fontWeight="bold" color="black">
                Service Plan
              </Text>
              <Text marginLeft="20px" color="black">
                {appointment.servicePlan || "Not available"}
              </Text>
            </Flex>
            <Divider my={4} borderColor="gray.500" />
            <Flex marginTop="5px">
              <Text fontWeight="bold" color="black">
                Type of caregiver
              </Text>
              <Text marginLeft="20px" color="black">
                {appointment.medicSpecialization || "Not available"}
              </Text>
            </Flex>
            <Divider my={4} borderColor="gray.500" />
            <Flex marginTop="5px">
              <Text fontWeight="bold" color="black">
                Cost of service
              </Text>
              <Text marginLeft="20px" color="black">
                {formattedCost(appointment.costOfService) || "Not available"}
              </Text>
            </Flex>
            <Divider my={4} borderColor="gray.500" />
            <Flex marginTop="5px">
              <Text fontWeight="bold" color="black">
                Start Date:
              </Text>
              <Text marginLeft="20px" color="black">
                {appointment.startDate || "Not available"}
              </Text>
            </Flex>

            <Divider my={4} borderColor="gray.500" />
            <Flex marginTop="5px">
              <Text fontWeight="bold" color="black">
                Medical Report:
              </Text>
              <Text marginLeft="20px" color="black">
                {appointment.medicalReport || "Not available"}
              </Text>
            </Flex>
            <Divider my={4} borderColor="gray.500" />
            <Flex marginTop="5px">
              <Text fontWeight="bold" color="black">
                Paid:
              </Text>
              <Text marginLeft="20px" color="black">
                {appointment.paid ? "Yes" : "No"}
              </Text>
            </Flex>
            <Divider my={4} borderColor="gray.500" />
          </Flex>
          <Box>
            <Flex marginTop="5px">
              <Text marginLeft="20px" fontWeight="bold" color="black">
                Health History:
              </Text>
              <Text marginLeft="10px" color="black" maxW="600px" maxH="1000px">
                {appointment.recipientHealthHistory || "Not available"}
              </Text>
            </Flex>
            <Divider my={4} borderColor="gray.500" />
          </Box>
          <Box>
            <Flex marginTop="5px">
              <Text marginLeft="20px" fontWeight="bold" color="black">
                Special Needs:
              </Text>
              <Text marginLeft="10px" color="black" maxW="600px" maxH="1000px">
                {appointment.specialNeeds && appointment.specialNeeds.length > 0
                  ? appointment.specialNeeds.join(", ")
                  : "Not available"}
              </Text>
            </Flex>
            <Divider my={4} borderColor="gray.500" />
          </Box>
        </DrawerBody>
        <DrawerFooter justifyContent="space-between">
          {appointment.appointmentPending && (
            <Button
              bg="gray.500"
              color="white"
              _hover={{ color: "" }}
              onClick={onClose}
            >
              Cancel
            </Button>
          )}
          {appointment.appointmentPending && (
            <Box>
              <Button
                bg="#A210C6"
                color="white"
                _hover={{ color: "" }}
                leftIcon={<EditIcon />}
                onClick={handleEditAppointment}
              >
                Edit
              </Button>
              <Button
                ml="10px"
                bg="#E1ACAE"
                color="red.500"
                _hover={{ color: "" }}
                onClick={() => handleCancelAppointment(appointment.id)}
              >
                Delete
              </Button>
            </Box>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export const CancelAppointmentModal = ({
  isOpen,
  onClose,
  handleConfirmation,
}) => {
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");
  const modalWidth = isLargerThan768 ? "400px" : "90vw";

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent width={modalWidth} borderRadius="25px 25px 25px 0px">
        <ModalHeader>
          {" "}
          <WarningIcon w={10} h={10} color="yellow.400" />
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          Are you sure you want to cancel this appointment? <br></br>
          This action is irreversible.
        </ModalBody>
        <ModalFooter>
          <Button bg="#A210C6" color="white" onClick={onClose}>
            No
          </Button>
          <Button
            bg="#E1ACAE"
            color="red.500"
            marginLeft="5px"
            onClick={handleConfirmation}
          >
            Yes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export const MedicDetailsDrawer = ({ isOpen, onClose, medic }) => {
  if (!medic) return null;

  return (
    <Drawer isOpen={isOpen} onClose={onClose} placement="right" size="md">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          borderBottomWidth="1px"
          fontSize="lg"
          fontWeight="bold"
          color="#A210C6"
        >
          Caregiver Details
          <Button variant="ghost" onClick={onClose} leftIcon={<CloseIcon />} />
        </DrawerHeader>
        <DrawerBody overflowY="auto">
          <Flex flexDirection="column" alignItems="start" marginLeft="20px">
            <Flex marginTop="5px">
              <Text fontWeight="bold" color="black">
                Name:
              </Text>
              <Text marginLeft="20px" color="black">
                {`${medic.bioData.firstName} ${medic.bioData.lastName}`}
              </Text>
            </Flex>
            <Divider my={4} borderColor="gray.500" />
            <Flex marginTop="5px">
              <Text fontWeight="bold" color="black">
                Phone Number:
              </Text>
              <Text marginLeft="20px" color="black">
                {medic.bioData.phoneNumber}
              </Text>
            </Flex>
            <Divider my={4} borderColor="gray.500" />
            <Flex marginTop="5px">
              <Text fontWeight="bold" color="black">
                Email:
              </Text>
              <Text marginLeft="20px" color="black">
                {medic.bioData.email}
              </Text>
            </Flex>
            <Divider my={4} borderColor="gray.500" />
            <Flex marginTop="5px">
              <Text fontWeight="bold" color="black">
                Gender:
              </Text>
              <Text marginLeft="20px" color="black">
                {medic.bioData.gender}
              </Text>
            </Flex>
            <Divider my={4} borderColor="gray.500" />
            <Flex marginTop="5px">
              <Text fontWeight="bold" color="black">
                Specialization:
              </Text>
              <Text marginLeft="20px" color="black">
                {medic.specialization}
              </Text>
            </Flex>
            <Divider my={4} borderColor="gray.500" />
            <Flex marginTop="5px">
              <Text fontWeight="bold" color="black">
                Years of Experience:
              </Text>
              <Text marginLeft="20px" color="black">
                {medic.yearsOfExp}
              </Text>
            </Flex>
            <Divider my={4} borderColor="gray.500" />
            <Flex marginTop="5px">
              <Text fontWeight="bold" color="black">
                Address:
              </Text>
              <Text marginLeft="20px" color="black">
                {medic.medicHomeAddress}
              </Text>
            </Flex>
            <Button
              mt="10px"
              w="full"
              colorScheme="green"
              as="a"
              href={`tel:${medic.bioData.phoneNumber}`}
              leftIcon={<PhoneIcon />}
            >
              Call Caregiver
            </Button>
          </Flex>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};
