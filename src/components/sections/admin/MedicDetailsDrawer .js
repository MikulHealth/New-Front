import React, { useState } from "react";
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Avatar,
  Text,
  VStack,
  Divider,
  Flex,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
} from "@chakra-ui/react";

const MedicDetailsDrawer = ({ isOpen, onClose, medic }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageTitle, setSelectedImageTitle] = useState("");
  
  const {
    isOpen: isDocumentDrawerOpen,
    onOpen: openDocumentDrawer,
    onClose: closeDocumentDrawer,
  } = useDisclosure();
  
  const {
    isOpen: isModalOpen,
    onOpen: openModal,
    onClose: closeModal,
  } = useDisclosure();

  const handleImageClick = (image, title) => {
    setSelectedImage(image);
    setSelectedImageTitle(title);
    openModal();
  };

  const handleAvatarClick = () => {
    handleImageClick(medic.bioData.image, "Medic Avatar");
  };

  return (
    <>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
        <DrawerOverlay />
        <DrawerContent bg="#4B4B4B" color="white">
          <DrawerCloseButton />
          <DrawerHeader>Medic Details</DrawerHeader>
          <DrawerBody>
            <VStack align="left" spacing={4}>
              <Box>
                <Flex justifyContent="center">
                  <Avatar
                    size="xl"
                    src={medic.bioData.image}
                    alt={`${medic.bioData.firstName} ${medic.bioData.lastName}`}
                    cursor="pointer"
                    onClick={handleAvatarClick}
                  />
                </Flex>
                <Flex alignItems="center" justifyContent="space-between" mt={2}>
                  <Button colorScheme="blue" onClick={openDocumentDrawer}>
                    View Credentials
                  </Button>
                  {!medic.medicVerified && (
                    <Button
                      colorScheme="green"
                      onClick={() => alert("Verify Medic")}
                    >
                      Verify Medic
                    </Button>
                  )}
                </Flex>
              </Box>

              <Text fontSize="2xl" fontWeight="bold">
                {medic.bioData.firstName} {medic.bioData.lastName}
              </Text>
              <Text>Phone Number: {medic.phoneNumber}</Text>
              <Text>Email: {medic.bioData.email}</Text>
              <Text>Gender: {medic.bioData.gender}</Text>
              <Text>
                Date of Birth:{" "}
                {new Date(medic.bioData.dob).toLocaleDateString()}
              </Text>
              <Text>Medic Type: {medic.medicType}</Text>
              <Text>Years of Experience: {medic.yearsOfExp}</Text>
              <Text>Number of Patients: {medic.noOfPatients}</Text>
              <Text>Total Made: ₦{medic.totalMade.toLocaleString()}</Text>
              <Text>
                Total Withdrawn: ₦{medic.totalWithdraw.toLocaleString()}
              </Text>
              <Text>
                Last Payment Date:{" "}
                {medic.lastPayDateTime
                  ? new Date(medic.lastPayDateTime).toLocaleDateString()
                  : "N/A"}
              </Text>
              <Text>Medic Verified: {medic.medicVerified ? "Yes" : "No"}</Text>
              <Text>
                Verified At:{" "}
                {medic.verifiedAt
                  ? new Date(medic.verifiedAt).toLocaleDateString()
                  : "N/A"}
              </Text>
              <Text>Home Address: {medic.medicHomeAddress}</Text>
              <Divider />
              <Text fontSize="lg" fontWeight="bold">
                Guarantor Details
              </Text>
              <Text>
                Guarantor Name: {medic.guarantorFirstName}{" "}
                {medic.guarantorLastName}
              </Text>
              <Text>Guarantor Phone: {medic.guarantorPhone}</Text>
              <Text>Guarantor Email: {medic.guarantorEmail}</Text>
              <Text>Guarantor Home Address: {medic.guarantorHomeAddress}</Text>
              <Divider />
              <Text fontSize="lg" fontWeight="bold">
                Bank Details
              </Text>
              {medic.bankDetails.map((bank, index) => (
                <Box key={index}>
                  <Text>Bank Name: {bank.bankName}</Text>
                  <Text>Account Number: {bank.accountNumber}</Text>
                  <Text>Account Name: {bank.accountName}</Text>
                </Box>
              ))}
            </VStack>
          </DrawerBody>
          <DrawerFooter justifyContent="space-between">
            <Button
              variant="outline"
              colorScheme="blue"
              onClick={() => alert("Edit Medic Details")}
            >
              Edit Medic Details
            </Button>
            <Button
              variant="outline"
              colorScheme="red"
              onClick={() => alert("Suspend Medic")}
            >
              Suspend Medic
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <Drawer
        isOpen={isDocumentDrawerOpen}
        placement="right"
        onClose={closeDocumentDrawer}
        size="md"
      >
        <DrawerOverlay />
        <DrawerContent bg="#4B4B4B" color="white">
          <DrawerCloseButton />
          <DrawerHeader>Medic's Credentials</DrawerHeader>
          <DrawerBody>
            <VStack spacing={4} align="center" justify="center" height="100%">
              <Box>
                <Text fontSize="lg" mb={2}>
                  License
                </Text>
                <Image
                  src={medic.license}
                  alt="License"
                  height="200px"
                  width="auto"
                  objectFit="cover"
                  onClick={() => handleImageClick(medic.license, "License")}
                  cursor="pointer"
                />
              </Box>
              <Box mt={6}>
                <Text fontSize="lg" mb={2}>
                  CV
                </Text>
                <Image
                  src={medic.cvCopy}
                  alt="CV"
                  height="200px"
                  width="auto"
                  objectFit="cover"
                  onClick={() => handleImageClick(medic.cvCopy, "CV")}
                  cursor="pointer"
                />
              </Box>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      <Modal isOpen={isModalOpen} onClose={closeModal} size="2xl">
        <ModalOverlay />
        <ModalContent
          overflow="scroll"
          mt="-2px"
          mb="20px"
          bg="white"
          color="black.500"
        >
          <ModalCloseButton />
          <ModalHeader>{selectedImageTitle}</ModalHeader>
          <ModalBody>
            <Image src={selectedImage} alt="Selected Document" width="90%" />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default MedicDetailsDrawer;
