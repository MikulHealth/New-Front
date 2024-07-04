import React from "react";
import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
  extendTheme,
  Text,
  VStack,
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

const RecommendedInterventionDrawer = ({ isOpen, onClose, instructions }) => {
  return (
    <Drawer
      theme={customTheme}
      isOpen={isOpen}
      onClose={onClose}
      size={{ base: "sm", md: "lg" }}
    >
      <DrawerOverlay />
      <DrawerContent >
        <DrawerHeader textAlign="center" color="#A210C6" fontFamily="heading">
          Recommended Intervention
        </DrawerHeader>
        <DrawerBody fontFamily="body">
          <VStack spacing={4} align="start">
            {instructions.map((instruction, index) => (
              <Text key={index} mb="2">
                {instruction}
              </Text>
            ))}
          </VStack>
        </DrawerBody>
        <DrawerFooter>
          <Button bg="#A210C6" color="white" onClick={onClose}>
            Okay
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default RecommendedInterventionDrawer;
