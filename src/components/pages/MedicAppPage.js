import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useSwipeable } from "react-swipeable";
import "react-datepicker/dist/react-datepicker.css";
import { SearchIcon } from "@chakra-ui/icons";
import LeftSideBar from "../authLayouts/MedicSideBar";
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
  Skeleton,
  useTabs,
} from "@chakra-ui/react";
import familyIcon from "../../assets/MedTeam.svg";
// import SearchAppointmentsModal from "../sections/SearchAppointmentByDate";
import NavBar from "../authLayouts/MedicNavBar";
import AppointmentTab from "../authLayouts/AllMedicApp";
// import PendingApp from "../authLayouts/PendingAppointmentTab";
import MobileFooter from "../authLayouts/MedicFooter";
import PendingMedicAppTab from "../authLayouts/PendingMedicApp";
import ActiveMedicAppTab from "../authLayouts/ActiveMedicTab";
import CompletedMedicAppTab from "../authLayouts/CompletedMedicApp";
import RequestAppointmentModal from "../sections/RequestAppModal";

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

const MedicAppPage = () => {
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state) => state.userReducer);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  //   const [showSearchAppointmentsModal, setShowSearchAppointmentsModal] =
  //     useState(false);

  const handleOpenAppointmentModal = () => {
    setShowAppointmentModal(true);
  };

  //   const handleOpenSearchAppointmentsModal = () => {
  //     setShowSearchAppointmentsModal(true);
  //   };

  //   const handleCloseSearchAppointmentsModal = () => {
  //     setShowSearchAppointmentsModal(false);
  //   };

  const handleCloseAppointmentModal = () => {
    setShowAppointmentModal(false);
  };

  const settingsContainerStyle = {
    animation: "slideInUp 0.9s ease-in-out",
  };

  const { index, setIndex } = useTabs({ index: 0 });

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => setIndex((prevIndex) => (prevIndex + 1) % 5),
    onSwipedRight: () =>
      setIndex((prevIndex) => (prevIndex === 0 ? 4 : prevIndex - 1)),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

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
        {loading ? (
          <Skeleton
            // ml={{ base: "10px", md: "0" }}
            justifyContent="center"
            w={{ base: "375px", md: "70vw" }}
            h={{ base: "189px", md: "40vh" }}
            startColor="#E552FF"
            endColor="#870DA5"
            fadeDuration={0.6}
            borderRadius="20px"
          />
        ) : (
          <Box>
            <Box
              marginTop="10px"
              border="1px solid gray"
              borderRadius="md"
              padding="3px"
              w={{ base: "88vw", md: "908px" }}
              h={{ base: "7vw", md: "5vh" }}
            >
              <Flex>
                <SearchIcon boxSize={4} marginRight="10px" marginTop="5px" />
                <Text
                  fontSize={{ base: "10px", md: "14px" }}
                  mt={{ base: "3px", md: "" }}
                  fontFamily="body"
                  style={{
                    fontStyle: "italic",
                    cursor: "pointer",
                  }}
                  _hover={{ color: "#A210C6" }}
                  //   onClick={handleOpenSearchAppointmentsModal}
                >
                  Search Appointment by date
                </Text>
              </Flex>
            </Box>
            <Flex
              ml={{ base: "-5px" }}
              bg="linear-gradient(80deg, #A210C6, #E552FF)"
              w={{ base: "90vw", md: "910px" }}
              h={{ base: "17vh", md: "200px" }}
              mt={{ base: "5px", md: "15px" }}
              borderRadius="20px"
              justifyContent="space-between"
            >
              <Box
                pt={{ base: "5px", md: "10px" }}
                justify="left"
                color="white"
              >
                <Text
                  fontSize={{ base: "12px", md: "20px" }}
                  fontFamily="heading"
                  marginTop="15px"
                  ml={{ base: "30px", md: "" }}
                  textAlign="left"
                >
                  Hello {user?.firstName},
                </Text>
                <Text
                  fontFamily="body"
                  fontSize={{ base: "10px", md: "15px" }}
                  ml={{ base: "30px", md: "" }}
                  mt={{ md: "5px" }}
                  textAlign="left"
                >
                  Would you like to request for an appointment?
                </Text>
                <Box>
                  <Button
                    onClick={handleOpenAppointmentModal}
                    bg="white"
                    color="#A210C6"
                    fontFamily="body"
                    mt={{ base: "20px", md: "30px" }}
                    _hover={{ color: "" }}
                    padding={{ base: "5px", md: "0" }}
                    w={{ base: "140px", md: "190px" }}
                    h={{ base: "25px", md: "40px" }}
                    fontSize={{ base: "12px", md: "16px" }}
                    borderRadius="15px"
                    ml={{ base: "-50px", md: "-90px" }}
                    //   leftIcon={<CheckIcon />}
                  >
                    Request appointment
                  </Button>
                </Box>
              </Box>
              <Box mr={{ md: "20px" }}>
                <Image
                  src={familyIcon}
                  alt="family icon"
                  w={{ base: "80px", md: "150px" }}
                  h={{ base: "80x", md: "150px" }}
                  mt={{ base: "25px", md: "30px" }}
                  mb={{ base: "0", md: "50px" }}
                  mr={{ base: "30px", md: "30px" }}
                />
              </Box>
            </Flex>

            <Flex
              w={{ base: "90vw", md: "65vw" }}
              p="4px"
              mt={{ base: "-5px", md: "-5px" }}
              justifyContent="center"
              className="appointment-tabs"
              overflow={{ base: "hidden", md: "hidden" }}
            >
              <VStack ml={{ md: "-100px" }} w="full" {...swipeHandlers}>
                <Tabs
                  index={index}
                  onChange={setIndex}
                  mb="20px"
                  colorScheme="purple.100"
                  mt={{ base: "", md: "5px" }}
                >
                  <TabList justifyContent="space-between">
                    <Tab
                      fontSize={{ base: "11px", md: "16px" }}
                      color="#A210C6"
                      fontWeight="bold"
                    >
                      All
                    </Tab>

                    <Tab
                      fontSize={{ base: "11px", md: "16px" }}
                      color="yellow.500"
                      fontWeight="bold"
                    >
                      Pending
                    </Tab>

                    <Tab
                      fontSize={{ base: "11px", md: "16px" }}
                      color="green.500"
                      fontWeight="bold"
                    >
                      Active
                    </Tab>

                    <Tab
                      fontSize={{ base: "11px", md: "16px" }}
                      color="blue.500"
                      fontWeight="bold"
                    >
                      Completed
                    </Tab>
                  </TabList>
                  <TabPanels ml={{ base: "0px", md: "0px" }}>
                    <TabPanel>
                      <AppointmentTab />
                    </TabPanel>
                    <TabPanel>
                      <PendingMedicAppTab />
                    </TabPanel>
                    <TabPanel>
                      <ActiveMedicAppTab />
                    </TabPanel>
                    <TabPanel>
                      <CompletedMedicAppTab />
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </VStack>
            </Flex>

            <RequestAppointmentModal
              isOpen={showAppointmentModal}
              onClose={handleCloseAppointmentModal}
            />
          </Box>
        )}
        <MobileFooter />
      </VStack>
    </ChakraProvider>
  );
};

export default MedicAppPage;
