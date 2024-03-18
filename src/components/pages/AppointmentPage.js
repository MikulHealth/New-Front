import React, { useState } from "react";
import { useSelector } from "react-redux";
import "react-datepicker/dist/react-datepicker.css";
import BookAppointmentModal from "../sections/BookAppointment";
import { SearchIcon } from "@chakra-ui/icons";
import LeftSideBar from "../authLayouts/LeftSideBar";
import {
  ChakraProvider,
  VStack,
  Button,
  Image,
  Box,
  Text,
  Flex,
  extendTheme,
  Tabs,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
} from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";
import familyIcon from "../../assets/family.svg";
import SearchAppointmentsModal from "../sections/SearchAppointmentByDate";
import NavBar from "../authLayouts/NavBar";
import AppointmentTab from "../authLayouts/AllAppointmentTab";
import PendingApp from "../authLayouts/PendingAppointmentTab";
import MobileFooter from "../authLayouts/MobileFooter";

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

const AppointmentPage = () => {
  const { user } = useSelector((state) => state.userReducer);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showSearchAppointmentsModal, setShowSearchAppointmentsModal] =
    useState(false);
  const handleOpenAppointmentModal = () => {
    setShowAppointmentModal(true);
  };

  const handleOpenSearchAppointmentsModal = () => {
    setShowSearchAppointmentsModal(true);
  };

  const handleCloseSearchAppointmentsModal = () => {
    setShowSearchAppointmentsModal(false);
  };

  const handleCloseAppointmentModal = () => {
    setShowAppointmentModal(false);
  };

  const settingsContainerStyle = {
    animation: "slideInUp 0.9s ease-in-out",
  };

  return (
    <ChakraProvider theme={customTheme}>
      <LeftSideBar />
      <VStack
        style={settingsContainerStyle}
        position="fixed"
        ml={{ md: "200px" }}
        w={{ base: "100%", md: "80%" }}
        h={{ base: "100%", md: "100%" }}
      >
        <NavBar />
        <Box
          marginTop="10px"
          border="1px solid gray"
          borderRadius="md"
          padding="3px"
          w={{ base: "90vw", md: "70vw" }}
          h={{ base: "7vw", md: "5vh" }}
        >
          <Flex>
            <SearchIcon boxSize={4} marginRight="10px" marginTop="5px" />
            <Text
              fontSize={{ base: "12px", md: "16px" }}
              fontFamily="body"
              // mt={{ md: "15px" }}
              style={{
                fontStyle: "italic",
                cursor: "pointer",
              }}
              _hover={{ color: "#A210C6" }}
              onClick={handleOpenSearchAppointmentsModal}
            >
              Search Appointment by date
            </Text>
          </Flex>
        </Box>
        <Flex
          marginTop="10px"
          bg="#A210C6"
          w={{ base: "90vw", md: "70vw" }}
          h={{ base: "19vh", md: "30vh" }}
          borderRadius="20px"
          justifyContent="space-between"
        >
          <VStack paddingLeft="10px" justify="left" color="white">
            <Text
              fontSize={{ base: "12px", md: "20px" }}
              fontFamily="heading"
              marginTop="15px"
              ml={{ base: "", md: "-98px" }}
              textAlign="left"
            >
              Hello {user?.firstName},
            </Text>
            <Text
              fontFamily="body"
              fontSize={{ base: "10px", md: "15px" }}
              ml={{ base: "", md: "43px" }}
              mt={{ md: "5px" }}
              textAlign="left"
            >
              Would you like to book an appointment
            </Text>
            <Text
              fontFamily="body"
              fontSize={{ base: "10px", md: "15px" }}
              mt={{ md: "2px" }}
              ml={{ base: "", md: "-36px" }}
            >
              for yourself or a loved one?
            </Text>

            <Button
              onClick={handleOpenAppointmentModal}
              bg="white"
              color="#A210C6"
              fontFamily="body"
              mt={{ md: "10px" }}
              _hover={{ color: "" }}
              padding={{ base: "5px", md: "0" }}
              ml={{ base: "", md: "-40px" }}
              w={{ base: "140px", md: "190px" }}
              h={{ base: "30px", md: "40px" }}
              fontSize={{ base: "12px", md: "16px" }}
              borderRadius="15px"
              leftIcon={<CheckIcon />}
            >
              Book appointment
            </Button>
          </VStack>
          <Box>
            <Image
              src={familyIcon}
              alt="family icon"
              w={{ base: "80px", md: "150px" }}
              h={{ base: "80x", md: "150px" }}
              mt={{ base: "40px", md: "20px" }}
              mb={{ base: "0", md: "50px" }}
              mr={{ base: "30px", md: "30px" }}
            />
          </Box>
        </Flex>

        <Flex
          w={{ base: "", md: "50vh" }}
          ml={{ base: "-75px", md: "-400px" }}
          justifyContent="space-between"
          className="appointment-tabs"
        >
          <VStack ml={{ base: "50px", md: "-100px" }}>
            <Tabs colorScheme="purple.100" mt={{ base: "", md: "40px" }}>
              <TabList justifyContent="space-between">
                <Tab
                  fontSize={{ base: "12px", md: "16px" }}
                  color="#A210C6"
                  fontWeight="bold"
                >
                  All
                </Tab>

                <Tab
                  fontSize={{ base: "12px", md: "16px" }}
                  color="yellow.500"
                  fontWeight="bold"
                >
                  Pending
                </Tab>

                <Tab
                  fontSize={{ base: "12px", md: "16px" }}
                  color="green.500"
                  fontWeight="bold"
                >
                  Active
                </Tab>

                <Tab
                  fontSize={{ base: "12px", md: "16px" }}
                  color="blue.500"
                  fontWeight="bold"
                >
                  Completed
                </Tab>
              </TabList>
              <TabPanels ml={{ base: "-20px", md: "-30px" }}>
                <TabPanel>
                  <AppointmentTab />
                </TabPanel>
                <TabPanel>
                  <PendingApp />
                </TabPanel>
                <TabPanel>
                  <PendingApp />
                </TabPanel>
                <TabPanel>
                  <PendingApp />
                </TabPanel>
              </TabPanels>
            </Tabs>
            <MobileFooter />
          </VStack>
          {/* <Help /> */}
        </Flex>
        <BookAppointmentModal
          isOpen={showAppointmentModal}
          onClose={handleCloseAppointmentModal}
        />
        <SearchAppointmentsModal
          isOpen={showSearchAppointmentsModal}
          onClose={handleCloseSearchAppointmentsModal}
        />
      </VStack>
    </ChakraProvider>
  );
};

export default AppointmentPage;
