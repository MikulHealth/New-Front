import React from "react";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import Tele from "../../assets/Telemed.svg";

const AppointmentsSidebar = ({
  noPendingAppointments,
  activeAppointments,
  completedAppointments,
}) => {
  return (
    <Box display={{ base: "none", md: "block" }} marginLeft="30px">
      <Box color="white" borderRadius="10px" h="40vh" w="20vw" bg="linear-gradient(80deg, #A210C6, #E552FF)">
        <Box textAlign="center">
          <Text
            fontSize={{ base: "16", md: "20px" }}
            fontFamily="body"
            pt="25px"
          >
            My Appointments
          </Text>
          <Flex flexDirection="column" mt="15px">
            <Text
              marginTop="15px"
              textAlign="left"
              pl="50px"
              fontSize={{ base: "12", md: "16px" }}
              fontFamily="body"
              style={{ cursor: "pointer" }}
              _hover={{ color: "" }}
            >
              Active: {activeAppointments}
            </Text>
            <Text
              fontFamily="body"
              textAlign="left"
              marginTop="10px"
              pl="50px"
              fontSize={{ base: "12", md: "16px" }}
              style={{ cursor: "pointer" }}
              _hover={{ color: "" }}
            >
              Pending: {noPendingAppointments}
            </Text>
            <Text
              marginTop="10px"
              textAlign="left"
              pl="50px"
              fontSize={{ base: "12", md: "16px" }}
              fontFamily="body"
              style={{ cursor: "pointer" }}
              _hover={{ color: "" }}
            >
              Completed: {completedAppointments}
            </Text>
          </Flex>
        </Box>
      </Box>

      <Box align="center" bg="#F6E4FC" borderRadius="10" h="30vh">
        <Image
          src={Tele}
          alt="Nurse and Patient"
          w="150px"
          h="150px"
          marginTop="20px"
          paddingTop="40px"
        />
      </Box>
    </Box>
  );
};

export default AppointmentsSidebar;
