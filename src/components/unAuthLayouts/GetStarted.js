import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalCloseButton,
  Link as ChakraLink,
  Box,
  useMediaQuery,
} from "@chakra-ui/react";

export default function GetStartedModal({ isOpen, onClose }) {
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");
  const modalWidth = isLargerThan768 ? "400px" : "90vw";

  return (
    <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent
        marginTop="100px"
        border="5px solid white"
        alignItems="center"
        bg="#510863"
        borderRadius="25px 25px 25px 0px"
        width={modalWidth}
      >
        <ModalCloseButton color="white" />
        <Box padding="10px">
          <ChakraLink
            fontStyle="italic"
            href="/login"
            color="#A210C6"
            textDecoration="none"
            display="block"
            bg="white"
            padding="10px"
            borderRadius="8px"
            fontWeight="bold"
            textAlign="center"
            marginY="20px"
            transition="transform 0.3s ease-in-out"
            _hover={{
              transform: "translateY(-10px)",
            }}
          >
            Login
          </ChakraLink>
          <ChakraLink
            fontStyle="italic"
            href="/customer-signUp"
            color="#A210C6"
            textDecoration="none"
            display="block"
            bg="white"
            padding="10px"
            borderRadius="8px"
            fontWeight="bold"
            textAlign="center"
            marginY="20px"
            transition="transform 0.3s ease-in-out"
            _hover={{
              transform: "translateY(-10px)",
            }}
          >
            Sign up
          </ChakraLink>
          <ChakraLink
            fontStyle="italic"
            href="/join"
            color="#A210C6"
            textDecoration="none"
            display="block"
            bg="white"
            padding="10px"
            borderRadius="8px"
            fontWeight="bold"
            textAlign="center"
            marginY="20px"
            transition="transform 0.3s ease-in-out"
            _hover={{
              transform: "translateY(-10px)",
            }}
          >
            Sign up as medic
          </ChakraLink>
        </Box>
        <ModalFooter />
      </ModalContent>
    </Modal>
  );
}
