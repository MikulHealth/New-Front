import React from "react";
import {
  Text,
  extendTheme,
  Link,
  Button,
  Drawer,
  Flex,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Image,
} from "@chakra-ui/react";
import { WarningIcon } from "@chakra-ui/icons";
import BookingImage from "../../assets/booking.webp";

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
    <Drawer
      theme={customTheme}
      size={{ base: "sm", md: "lg" }}
      isOpen={isOpen}
      onClose={onClose}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader color="#A210C6" fontFamily="heading">
          Just a quick note{" "}
          <WarningIcon
            fontFamily="body"
            mb="5px"
            w={10}
            h={10}
            color="yellow.400"
          />
        </DrawerHeader>
        <DrawerBody>
          <Text color="#00000080" fontFamily="body" mt="-30px" mb="20px">
            <br />
            All services under our <strong>Service Plan</strong> are monthly
            subscriptions with 24-hour or 8-hour (day) shifts and expire after
            one month, except for <strong>Short Home Visit</strong> and{" "}
            <strong>Custom Plans.</strong> If you would like to create a custom
            plan, click{" "}
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
          </Text>
          <Image
            borderRadius="20px"
            src={BookingImage}
            alt="Booking an Appointment"
            my="20px"
          />
        </DrawerBody>
        <DrawerFooter as={Flex} justifyContent="space-between">
          <Text color="#00000080" fontWeight="bold" fontStyle="italic">By continuing, you agree to our terms of service...</Text>
          <Button
            bg="linear-gradient(80deg, #A210C6, #E552FF)"
            color="white"
            onClick={onClose}
          >
            Continue
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default BookingInstructions;
