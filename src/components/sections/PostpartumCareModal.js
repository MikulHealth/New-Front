import React, { useState} from "react";
import { CheckIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  Divider,
  ModalHeader,
  Box,
  Flex,
  ModalBody,
  ModalCloseButton,
  Text,
  Button,
} from "@chakra-ui/react";
import BookAppointmentModal from "../sections/BookAppointment";
const PostpartumCareModal = ({ isOpen, onClose }) => {
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
        <ModalHeader textAlign="center">POSTPATUM CARE</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text fontWeight="bold" textAlign="center" color="#A210C6">
            PREMIUM CARE FOR MOTHER AND CHILD (4 WEEKS INTENSIVE CARE)
          </Text>
          <Text
            fontSize="16px"
            fontStyle="italic"
            fontWeight="bold"
            textAlign="center"
            color="#A210C6"
          >
            Exclusively provided by a licensed nurse/midwife
          </Text>
          <Flex
            marginBottom="30px"
            mt={{base: "20px", md: "30px" }}
            marginLeft="8px"
            alignItems="center"
            ml={{md: "90px" }}
            flexWrap={{ base: "wrap" }}
          >
            <Box
              borderColor="#A210C6"
              borderRadius="10px"
              style={{
                cursor: "pointer",
                boxShadow: "0px 4px 8px rgba(162, 16, 198, 0.4)",
                transition: "transform 0.3s ease-in-out",
              }}
              w={{ base: "100vw", md: "40vw" }}
              h={{ base: "56vh", md: "60vh" }}
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
                Specialized care for new babies and mothers during the
                postpartum period, providing support for physical and emotional
                recovery.
              </Text>
              <Flex mt="15px" direction="column">
                <Box ml="20px" fontSize="16px">
                  <Text>- Blood pressure & pulse monitoring</Text>
                  <Text>- Blood sugar monitoring</Text>
                  <Text>- Post-Operative Wound Care</Text>
                  <Text>- Episiotomy Care</Text>
                  <Text>- Physical & Emotional Support</Text>
                  <Text>- Sitz Bath</Text>
                  <Text>- Baby Grooming</Text>
                </Box>
              </Flex>
              <Divider my={1} borderColor="black.500" />
              <Flex justifyContent="space-between">
                <Flex>
                  <Text
                    color="#A210C6"
                    fontWeight="bold"
                    marginTop="10px"
                    marginLeft="20px"
                    fontSize="24px"
                  >
                    ₦200,000
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

            <Box
              style={{
                cursor: "pointer",
                boxShadow: "0px 4px 8px rgba(162, 16, 198, 0.4)",
                transition: "transform 0.3s ease-in-out",
              }}
              ml={{ md: "30px" }}
              mt={{ base: "30px", md: "-20px" }}
              borderRadius="10px"
              bg="#A210C6"
              w={{ base: "100vw", md: "40vw" }}
              h={{ base: "56vh", md: "60vh" }}
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
                Specialized care for new babies and mothers during the
                postpartum period, providing support for physical and emotional
                recovery.
              </Text>
              <Flex mt="15px" direction="column">
                <Box color="white" ml="20px" fontSize="16px">
                  <Text>- Blood pressure & pulse monitoring</Text>
                  <Text>- Blood sugar monitoring</Text>
                  <Text>- Post-Operative Wound Care</Text>
                  <Text>- Episiotomy Care</Text>
                  <Text>- Physical & Emotional Support</Text>
                  <Text>- Sitz Bath</Text>
                  <Text>- Baby Grooming</Text>
                </Box>
              </Flex>
              <Divider my={1} borderColor="white" />
              <Flex justifyContent="space-between">
                <Flex>
                  <Text
                    color="white"
                    fontWeight="bold"
                    marginTop="10px"
                    marginLeft="20px"
                    fontSize="24px"
                  >
                    ₦250,000
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

export default PostpartumCareModal;
