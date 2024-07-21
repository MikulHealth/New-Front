import React, { useState } from "react";
import {
  Box,
  Flex,
  Text,
  VStack,
  Avatar,
  Button,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  ListItem,
  UnorderedList,
  DrawerHeader,
  DrawerCloseButton,
  DrawerBody,
  DrawerFooter,
  extendTheme,
} from "@chakra-ui/react";
import { generateNursingCarePlan } from "./generateNursingCarePlan";

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

const PatientDetailsDrawer = ({ patient, isOpen, onClose }) => {
  const [carePlan, setCarePlan] = useState([]);
  const [isViewingCarePlan, setIsViewingCarePlan] = useState(false);

  const handleViewCarePlan = () => {
    const plan = generateNursingCarePlan(
      patient.customerAppointment.specialNeeds
    );
    setCarePlan(plan);
    setIsViewingCarePlan(true);
  };

  const handleBackToDetails = () => {
    setIsViewingCarePlan(false);
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()}`;
  };

  return (
    <>
      <Drawer theme={customTheme} isOpen={isOpen} onClose={onClose} size="lg">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader fontFamily="heading" color="#A210C6" textAlign="center">
            {isViewingCarePlan ? "Recommended Care Plan" : "Patient Details"}
          </DrawerHeader>
          <DrawerCloseButton onClick={onClose} />
          <DrawerBody>
            {isViewingCarePlan ? (
              <Flex
                direction="column"
                align="center"
                justify="center"
                textAlign="center"
              >
                <Text fontFamily="body" textAlign="left" mb="4">
                  This detailed care plan is designed to assist you in providing
                  the best possible care for our patient. It is divided into two
                  parts:
                  <br />
                  <Text as="span" fontWeight="bold">
                    - Universal Precautions and Standard Medical Interventions,
                  </Text>{" "}
                  and
                  <br />
                  <Text as="span" fontWeight="bold">
                    - Specific care plans tailored to the patient's needs.
                  </Text>
                  <br />
                  Please read through each section carefully and follow the plan
                  diligently. You can always revisit this care plan for
                  reference and reminders.
                </Text>
                <VStack
                  fontFamily="body"
                  textAlign="left"
                  align="start"
                  spacing={3}
                  mt="2"
                >
                  <Box>
                    <Text fontWeight="bold" mb="2">
                      Universal Precautions and Standard Medical Interventions:
                    </Text>
                    <UnorderedList fontFamily="body" spacing={2}>
                      <ListItem>
                        Wash hands thoroughly before and after patient contact.
                      </ListItem>
                      <ListItem>
                        Wear gloves when handling bodily fluids or open wounds.
                      </ListItem>
                      <ListItem>
                        Use masks and eye protection when necessary.
                      </ListItem>
                      <ListItem>
                        Dispose of needles and other sharp objects in proper
                        containers.
                      </ListItem>
                      <ListItem>
                        Sanitize surfaces and equipment regularly.
                      </ListItem>
                      <ListItem>
                        Follow proper procedures for administering medications.
                      </ListItem>
                      <ListItem>
                        Monitor patient vital signs regularly.
                      </ListItem>
                      <ListItem>Maintain patient hygiene and comfort.</ListItem>
                      <ListItem>
                        Provide emotional support and reassurance.
                      </ListItem>
                      <ListItem>
                        Document all care and observations accurately.
                      </ListItem>
                      <ListItem>
                        Ensure proper ventilation in the patient's room.
                      </ListItem>
                      <ListItem>
                        Maintain a clean and clutter-free environment.
                      </ListItem>
                      <ListItem>
                        Use proper lifting techniques to prevent caregiver
                        injury.
                      </ListItem>
                      <ListItem>
                        Communicate regularly with family members and other
                        healthcare providers.
                      </ListItem>
                      <ListItem>
                        Stay updated on the patient's care plan and any changes
                        in their condition.
                      </ListItem>
                      <ListItem>
                        Use personal protective equipment (PPE) appropriately.
                      </ListItem>
                      <ListItem>
                        Ensure proper waste disposal according to medical
                        guidelines.
                      </ListItem>
                    </UnorderedList>
                  </Box>
                  <Text fontWeight="bold">Specific Interventions:</Text>
                  {carePlan.map((item, index) => (
                    <Text key={index}>
                      <Text as="span" fontWeight="bold">
                        {index + 1}.
                      </Text>{" "}
                      <Text as="span" fontWeight="bold">
                        {item.category}:
                      </Text>{" "}
                      {item.plan}
                    </Text>
                  ))}
                </VStack>
              </Flex>
            ) : (
              <Flex
              
                direction="column"
                align="center"
                justify="center"
                textAlign="center"
              >
                <Avatar
                  name={`${patient.customerAppointment.recipientFirstname} ${patient.customerAppointment.recipientLastname}`}
                  src={patient.customerAppointment.picturePath}
                  bg="gray.500"
                  color="white"
                  w={{ base: "100px", md: "100px" }}
                  h={{ base: "100px", md: "100px" }}
                  border="3px solid #057B1F"
                />
                <Box fontFamily="body" textAlign="left" w="full">
                  {/* Patient details */}
                  <Flex wrap="wrap">
                    <Text fontWeight="bold" fontSize="lg" mt="2">
                      Name:
                    </Text>
                    <Text ml="5px" fontSize="lg" mt="2">
                      {patient.customerAppointment.recipientFirstname}{" "}
                      {patient.customerAppointment.recipientLastname}
                    </Text>
                  </Flex>
                  <Flex wrap="wrap">
                    <Text fontWeight="bold" fontSize="lg" mt="2">
                      MH Policy No.:
                    </Text>
                    <Text ml="5px" fontSize="lg" mt="2">
                      {patient.customerAppointment.policyNumber ||
                        "Not available"}
                    </Text>
                  </Flex>
                  <Flex wrap="wrap">
                    <Text fontWeight="bold" mt="2">
                      Location:
                    </Text>
                    <Text ml="5px" mt="2">
                      {patient.customerAppointment.currentLocation}
                    </Text>
                  </Flex>
                  <Flex wrap="wrap">
                    <Text fontWeight="bold" mt="2">
                      City/Town:
                    </Text>
                    <Text ml="5px" mt="2">
                      {patient.customerAppointment.recipientTown}
                    </Text>
                  </Flex>
                  <Flex wrap="wrap">
                    <Text fontWeight="bold" mt="2">
                      Phone number:
                    </Text>
                    <Text ml="5px" mt="2">
                      {patient.customerAppointment.recipientPhoneNumber}
                    </Text>
                  </Flex>
                  <Flex wrap="wrap">
                    <Text fontWeight="bold" mt="2">
                      Gender:
                    </Text>
                    <Text ml="5px" mt="2">
                      {patient.customerAppointment.recipientGender}
                    </Text>
                  </Flex>
                  <Flex wrap="wrap">
                    <Text fontWeight="bold" mt="2">
                      Date of Birth:
                    </Text>
                    <Text ml="5px" mt="2">
                      {formatDateTime(patient.customerAppointment.recipientDOB)}
                    </Text>
                  </Flex>
                  <Flex wrap="wrap">
                    <Text fontWeight="bold" mt="2">
                      Service Plan:
                    </Text>
                    <Text ml="5px" mt="2">
                      {patient.customerAppointment.servicePlan}
                    </Text>
                  </Flex>
                  <Flex wrap="wrap">
                    <Text fontWeight="bold" mt="2">
                      Shift:
                    </Text>
                    <Text ml="5px" mt="2">
                      {patient.customerAppointment.shift}
                    </Text>
                  </Flex>
                  <Flex wrap="wrap">
                    <Text fontWeight="bold" mt="2">
                      Amount Payable:
                    </Text>
                    <Text ml="5px" mt="2">
                      N{" "}
                      {parseFloat(
                        patient.customerAppointment.costOfService
                      ).toLocaleString()}
                    </Text>
                  </Flex>
                  <Flex wrap="wrap">
                    <Text fontWeight="bold" mt="2">
                      Medical history:
                    </Text>
                    <Text maxW={{ base: "50px", md: "450px" }} ml="5px" mt="2">
                      {patient.customerAppointment.recipientHealthHistory}
                    </Text>
                  </Flex>
                  <Flex wrap="wrap">
                    <Text fontWeight="bold" mt="2">
                      Special Needs:
                    </Text>
                    <Text
                      marginLeft="10px"
                      mt="2"
                      color="black"
                      maxW="600px"
                      maxH="1000px"
                    >
                      {patient?.customerAppointment?.specialNeeds &&
                      patient?.customerAppointment?.specialNeeds.length > 0
                        ? patient.customerAppointment.specialNeeds.join(", ")
                        : "Not available"}
                    </Text>
                  </Flex>
                </Box>
              </Flex>
            )}
          </DrawerBody>
          <DrawerFooter>
            {!isViewingCarePlan && (
              <Button
                color="white"
                // bg="#A210C6"
                bgGradient="linear(to-r, #A210C6, #E552FF)"
                borderRadius="50px"
                onClick={handleViewCarePlan}
                fontFamily="body"
                w="full"
              >
                Recommended Care Plan
              </Button>
            )}
            {isViewingCarePlan && (
              <Button
                color="white"
                // bg="#A210C6"
                bgGradient="linear(to-r, #A210C6, #E552FF)"
                borderRadius="50px"
                onClick={handleBackToDetails}
                fontFamily="body"
              >
                Back to Patient Details
              </Button>
            )}
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default PatientDetailsDrawer;
