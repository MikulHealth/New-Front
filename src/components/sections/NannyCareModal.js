import React, { useState } from "react";
import { CheckIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  Divider,
  ModalBody,
  Box,
  Flex,
  ModalCloseButton,
  Text,
  Button,
} from "@chakra-ui/react";
import BookAppointmentModal from "../sections/BookAppointment";
const NannyCareModal = ({ isOpen, onClose }) => {
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);

  const handleCloseAppointmentModal = () => {
    setShowAppointmentModal(false);
  };

  const handleOpenAppointmentModal = () => {
    setShowAppointmentModal(true);
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <ModalOverlay />
      <ModalContent marginTop="30px">
        <ModalHeader textAlign="center">NANNY SERVICES</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text textAlign="center" fontWeight="bold" color="#A210C6">
            PREMIUM CHILD CARE SERVICES
          </Text>

          <Text
            fontSize="16"
            fontStyle="italic"
            fontWeight="bold"
            textAlign="center"
            color="#A210C6"
          >
            Exclusively provided by a professional nanny
          </Text>
          <Flex
            marginBottom="30px"
            marginTop="30px"
            ml={{ md: "90px" }}
            flexWrap={{ base: "wrap" }}
            alignItems="center"
          >
            <Box
              className="8hrs-box"
              borderColor="#A210C6"
              borderRadius="10px"
              style={{
                cursor: "pointer",
                boxShadow: "0px 4px 8px rgba(162, 16, 198, 0.4)",
                transition: "transform 0.3s ease-in-out",
              }}
              w={{ base: "100vw", md: "40vw" }}
              h={{ base: "58vh", md: "60vh" }}
              _hover={{
                transform: "translateY(-10px)",
              }}
            >
              <Text
                color="#A210C6"
                fontWeight="bold"
                marginTop="40px"
                textAlign="center"
                fontSize="18px"
              >
                8 Hours Daily (5 days a week for a month)
              </Text>
              <Divider my={1} borderColor="black.500" />
              <Text ml="15px" fontSize="16px" mt="5px">
                Professional care services provided by trained nannies for
                children of all ages.
              </Text>
              <Flex mt="15px" direction="column">
                <Box ml="20px" fontSize="16px">
                  <Text>- Babysitting</Text>
                  <Text>- Feeding and meal preparation</Text>
                  <Text>- Bathing and grooming</Text>
                  <Text>- Playtime and educational activities</Text>
                  <Text>- Bedtime routines</Text>
                  <Text>- Transportation (to school, appointments, etc.)</Text>
                  <Text>- Household chores related to children</Text>
                </Box>
              </Flex>
              <Box>
                <Divider my={1} borderColor="black.500" />
                <Text
                  display={{ base: "block", md: "none" }}
                  textAlign="center"
                  marginTop="16px"
                  color="#A210C6"
                >
                  Cost excludes pre-nanny test
                </Text>
                <Flex justifyContent="space-between">
                  <Flex>
                    <Text
                      color="#A210C6"
                      fontWeight="bold"
                      marginTop="10px"
                      marginLeft="20px"
                      fontSize="24px"
                    >
                      ₦70,000
                    </Text>
                    <Text
                      display={{ base: "none", md: "block" }}
                      marginLeft="5px"
                      marginTop="16px"
                      color="#A210C6"
                    >
                      (excluding pre-nanny test)
                    </Text>
                  </Flex>

                  <Button
                    marginTop="10px"
                    borderRadius="100px"
                    fontSize="16px"
                    bg="#A210C6"
                    marginRight="20px"
                    leftIcon={<CheckIcon />}
                    color="white"
                    onClick={handleOpenAppointmentModal}
                    style={{
                      fontStyle: "italic",
                      cursor: "pointer",
                    }}
                    _hover={{ color: "" }}
                  >
                    Book plan
                  </Button>
                </Flex>
              </Box>
            </Box>

            <Box
              className="24hrs-box"
              style={{
                cursor: "pointer",
                boxShadow: "0px 4px 8px rgba(162, 16, 198, 0.4)",
                transition: "transform 0.3s ease-in-out",
              }}
              borderRadius="10px"
              bg="#A210C6"
              ml={{ md: "30px" }}
              mt={{ base: "30px", md: "-20px" }}
              w={{ base: "100vw", md: "40vw" }}
              h={{ base: "58vh", md: "60vh" }}
              _hover={{
                transform: "translateY(-10px)",
              }}
            >
              <Text
                color="white"
                fontWeight="bold"
                marginTop="40px"
                textAlign="center"
                fontSize="18px"
              >
                24 Hours Daily (30 days in a month)
              </Text>
              <Divider my={1} borderColor="white" />
              <Text color="white" ml="15px" fontSize="16px" mt="5px">
                Professional care services provided by trained nannies for
                children of all ages.
              </Text>
              <Flex mt="15px" direction="column">
                <Box color="white" ml="20px" fontSize="16px">
                  <Text>- Babysitting</Text>
                  <Text>- Feeding and meal preparation</Text>
                  <Text>- Bathing and grooming</Text>
                  <Text>- Playtime and educational activities</Text>
                  <Text>- Bedtime routines</Text>
                  <Text>- Transportation (to school, appointments, etc.)</Text>
                  <Text>- Household chores related to children</Text>
                </Box>
              </Flex>
              <Box>
                <Divider my={1} borderColor="white" />
                <Text
                  display={{ base: "block", md: "none" }}
                  textAlign="center"
                  marginTop="16px"
                  color="white"
                >
                  Cost excludes pre-nanny test
                </Text>
                <Flex justifyContent="space-between">
                  <Flex>
                    <Text
                      color="white"
                      fontWeight="bold"
                      marginTop="10px"
                      marginLeft="20px"
                      fontSize="24px"
                    >
                      ₦90,000
                    </Text>
                    <Text
                      display={{ base: "none", md: "block" }}
                      marginLeft="5px"
                      marginTop="16px"
                      color="white"
                    >
                      (excluding pre-nanny test)
                    </Text>
                  </Flex>

                  <Button
                    marginTop="10px"
                    borderRadius="100px"
                    fontSize="16px"
                    bg="white"
                    marginRight="20px"
                    leftIcon={<CheckIcon />}
                    color="#A210C6"
                    onClick={handleOpenAppointmentModal}
                    style={{
                      fontStyle: "italic",
                      cursor: "pointer",
                    }}
                    _hover={{ color: "#A210C6" }}
                  >
                    Book plan
                  </Button>
                </Flex>
              </Box>
            </Box>
          </Flex>
        </ModalBody>
      </ModalContent>
      <BookAppointmentModal
        isOpen={showAppointmentModal}
        onClose={handleCloseAppointmentModal}
      />
    </Modal>
  );
};

export default NannyCareModal;
