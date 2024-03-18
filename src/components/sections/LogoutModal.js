import { WarningIcon } from "@chakra-ui/icons";
import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useMediaQuery,
} from "@chakra-ui/react";

const LogoutModal = ({ isOpen, onClose, onConfirm }) => {
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");
  const modalWidth = isLargerThan768 ? "400px" : "90vw";

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <ModalOverlay />
      <ModalContent
        // border="5px solid #A210C6"
        borderRadius="25px 25px 25px 0px"
        width={modalWidth}
      >
        <ModalHeader justifyContent="center">
          <WarningIcon w={10} h={10} color="yellow.400" />
        </ModalHeader>
        <ModalBody textAlign="center">Are you sure you want to logout?</ModalBody>
        <ModalFooter justifyContent="center">
          <Button color="white" bg="#510863" mr={3} onClick={onClose}>
            No
          </Button>
          <Button bg="red.500" color="white" onClick={onConfirm}>
            Yes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default LogoutModal;
