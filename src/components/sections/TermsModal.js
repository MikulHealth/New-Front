import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
} from "@chakra-ui/react";
import TermsAndConditions from "./TermsAndConditions"; 

const TermsModal = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader fontFamily="heading">
          TERMS AND CONDITION & PRIVACY POLICY
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <TermsAndConditions />
        </ModalBody>
        <ModalFooter>
          <Button bg="#A210C6" color="white" mr="3" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default TermsModal;
