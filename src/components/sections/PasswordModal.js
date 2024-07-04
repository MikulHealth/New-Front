import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  Input,
  Text,
} from "@chakra-ui/react";

const PasswordModal = ({
  isOpen,
  onClose,
  passwordInput,
  setPassword,
  handlePasswordSubmit,
  isLoading,
}) => {
  return (
    <Modal
      size={{ base: "sm", md: "md" }}
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader fontFamily="heading" color="#A210C6">
          Enter Password
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text fontWeight="body" mb={4}>
            Mikul health wants to make sure it's really you trying to download
            the medical report.
          </Text>

          <Input
            placeholder="Password"
            type="password"
            value={passwordInput}
            onChange={(e) => setPassword(e.target.value)}
            mb={3}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            bg="#A210C6"
            color="white"
            mr={3}
            onClick={handlePasswordSubmit}
            fontFamily="body"
            isLoading={isLoading}
          >
            Submit
          </Button>
          <Button
            fontFamily="body"
            bg="gray.500"
            color="white"
            onClick={onClose}
          >
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PasswordModal;
