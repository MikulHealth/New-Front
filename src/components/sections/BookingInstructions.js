import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Text,
  extendTheme,
  Link,
  Button,
} from "@chakra-ui/react";
import { WarningIcon } from "@chakra-ui/icons";

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

const BookingInstructions = ({ isOpen, onClose }) => {
  return (
    <Modal
      theme={customTheme}
      size={{ base: "sm", md: "lg" }}
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent borderRadius="25px 25px 25px 0px">
        <ModalHeader color="#A210C6" fontFamily="heading">
          Just a quick note{" "}
          <WarningIcon
            fontFamily="body"
            mb="5px"
            w={10}
            h={10}
            color="yellow.400"
          />
        </ModalHeader>
        {/* <ModalCloseButton /> */}
        <ModalBody>
          <Text fontFamily="body" mt="-30px" mb="20px">
            <br />All services under our <strong>Service Plan</strong>{" "}
            are monthly subscriptions with 24-hour or 8-hour (day) shifts and
            expire after one month, except for short home visits and custom
            plans. <br/> <br/>Create a custom plan{" "}
            <Link
              to="/customize-service"
              style={{
                color: "#A210C6",
                fontWeight: "bold",
                fontStyle: "italic",
              }}
              fontFamily="body"
            >
              here
            </Link>{" "}
            if needed. <br/>We're here to help!
          </Text>
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

export default BookingInstructions;
