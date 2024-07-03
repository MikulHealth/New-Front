import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  extendTheme,
  Text,
} from "@chakra-ui/react";

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

const PostSubmissionInstructionsModal = ({ isOpen, onClose, instructions }) => {
  return (
    <Modal
      theme={customTheme}
      isOpen={isOpen}
      onClose={onClose}
      size={{ base: "sm", md: "lg" }}
    >
      <ModalOverlay />
      <ModalContent borderRadius="25px 25px 25px 0px">
        <ModalHeader textAlign="center" color="#A210C6" fontFamily="heading">
          Post Submission Instructions
        </ModalHeader>
        <ModalBody fontFamily="body">
          {instructions.map((instruction, index) => (
            <Text key={index} mb="2">
              {instruction}
            </Text>
          ))}
        </ModalBody>
        <ModalFooter>
          <Button bg="#A210C6" color="white" onClick={onClose}>
            Okay
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PostSubmissionInstructionsModal;
