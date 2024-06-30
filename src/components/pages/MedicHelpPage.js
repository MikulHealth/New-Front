import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import WhatsAppIcon from "../../assets/WhatsApp.svg";
import { useNavigate } from "react-router-dom";
import {
  ChakraProvider,
  VStack,
  Image,
  Button,
  Box,
  Text,
  Flex,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  extendTheme,
} from "@chakra-ui/react";
import MedicSideBar from "../authLayouts/MedicSideBar";
import MedicNavBar from "../authLayouts/MedicNavBar";
import MedicSettingsSideBar from "../authLayouts/MedicSettingsSidebar";
import MedicMobileFooter from "../authLayouts/MedicFooter";

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

const MedicHelpPage = () => {
  const navigate = useNavigate();
  const handleback = () => {
    navigate("/settings");
  };

  const settingsContainerStyle = {
    animation: "slideInUp 0.9s ease-in-out",
  };

  return (
    <ChakraProvider theme={customTheme}>
     <MedicSideBar/>
      <VStack
        style={settingsContainerStyle}
        ml={{ md: "500px" }}
        height="100vh"
        w={{ base: "95%", md: "70vh" }}
      >
      <MedicNavBar/>
        <Box
          mb={{ base: "100px", md: "0" }}
          overflow="scroll"
          display={{ base: "block", md: "none" }}
          marginTop="20px"
        >
          <Box>
            <VStack>
              <Box>
                <Flex justifyContent="space-between">
                  <Text
                    textAlign="left"
                    fontSize={{ base: "18px" }}
                    color="#A210C6"
                    fontFamily="heading"
                  >
                    Frequently Asked Questions
                  </Text>

                  <Button
                    onClick={handleback}
                    borderColor="#A210C6"
                    borderWidth="1px"
                    color="#A210C6"
                    fontFamily="body"
                    _hover={{ color: "" }}
                    fontSize={{ base: "12px" }}
                    h="3vh"
                    marginLeft="10px"
                    borderRadius="100px"
                  >
                    Back
                  </Button>
                </Flex>

                <Text fontFamily="body" fontStyle="italic" fontSize="12px">
                  Click on a question to see more details
                </Text>
              </Box>
              <Box marginLeft="15px">
                <Accordion allowToggle fontSize="10px" w={{ base: "95%" }}>
                  <AccordionItem
                    p={-6}
                    my={5}
                    fontSize="14px"
                    className="custom-accordion-item"
                  >
                    <h2>
                      <AccordionButton>
                        <Box
                          as="span"
                          flex="1"
                          textAlign="left"
                          fontSize="14px"
                          fontFamily="body"
                        >
                          How do I add my loved ones as beneficiaries?
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel
                      textAlign="justify"
                      fontSize="14px"
                      fontFamily="body"
                      className="custom-accordion-panel"
                    >
                      Upon a successful registeration, you can request and get
                      matched to a medic to recieve care by booking any of the
                      services we offer from your dashboard.
                    </AccordionPanel>
                  </AccordionItem>

                  <AccordionItem
                    p={-6}
                    my={5}
                    fontSize="12px"
                    className="custom-accordion-item"
                  >
                    <h2>
                      <AccordionButton>
                        <Box
                          as="span"
                          flex="1"
                          textAlign="left"
                          fontSize="14px"
                          fontFamily="body"
                        >
                          I entered the wrong details while booking my
                          appointment. How do I change it?
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel
                      textAlign="justify"
                      fontSize="14px"
                      fontFamily="body"
                      className="custom-accordion-panel"
                    >
                      To ensure you are safe while you receive care from any
                      Mikul&nbsp;Health care provider, we make sure our
                      caregivers are vetted and their background checked. We
                      also have an insurance policy for any theft and damages
                      during the course of our service.
                    </AccordionPanel>
                  </AccordionItem>

                  <AccordionItem
                    p={-6}
                    my={5}
                    fontSize="14px"
                    className="custom-accordion-item"
                  >
                    <h2>
                      <AccordionButton>
                        <Box
                          as="span"
                          flex="1"
                          textAlign="left"
                          fontSize="14px"
                          fontFamily="body"
                        >
                          I would like to book multiple services at the same
                          time. How do I do that?
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel
                      textAlign="justify"
                      fontSize="14px"
                      fontFamily="body"
                      className="custom-accordion-panel"
                    >
                      Yes you can have a replacement when asigned a caregiver
                      that you do not like. We can provide a replace within 72
                      hours upon your request for a replacement.
                    </AccordionPanel>
                  </AccordionItem>

                  <AccordionItem
                    p={-6}
                    my={5}
                    fontSize="14px"
                    className="custom-accordion-item"
                  >
                    <h2>
                      <AccordionButton>
                        <Box
                          as="span"
                          flex="1"
                          textAlign="left"
                          fontSize="14px"
                          fontFamily="body"
                        >
                          I am no longer interested in using this service. How
                          can I cancel?
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel
                      textAlign="justify"
                      fontSize="14px"
                      fontFamily="body"
                      className="custom-accordion-panel"
                    >
                      Yes, aside our standadized service plans. We also have
                      provision for customizing a service plan that would best
                      suit you or your loved according to the peculiarity of the
                      care needs.
                    </AccordionPanel>
                  </AccordionItem>
                </Accordion>
              </Box>
            </VStack>
            <VStack overflow="scroll" marginLeft="20px">
              <Box textAlign="left">
                <Text fontFamily="body" color="#A210C6" fontSize="20px">
                  Contact us
                </Text>
                <VStack textAlign="left" fontSize="14px">
                  <Text fontFamily="body">
                    If you have any issues, our Mikul Customer Care agents are
                    always happy to help. You can reach us via:
                  </Text>
                  <Text fontFamily="body">
                    Email:{" "}
                    <a
                      href="mailto:support@mikulhealth.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      support@mikulhealth.com
                    </a>{" "}
                    <br></br>
                    Phone: <a href="tel:+2349160596636">+2349160596636</a>
                  </Text>
                </VStack>
              </Box>
              <Box
                ml={{ base: "200px" }}
                mb={{ base: "50px" }}
                mt={{ base: "-8px" }}
              >
                <a href="https://wa.me/2347032579006">
                  <Image
                    // onClick={help}
                    src={WhatsAppIcon}
                    alt="Logo"
                    w="50px"
                    h="50px"
                    style={{
                      cursor: "pointer",
                      animation: "zoomInOut 2s infinite alternate",
                    }}
                  />
                </a>
                <style>
                  {`
          @keyframes zoomInOut {
            0% {
              transform: scale(1);
            }
            100% {
              transform: scale(1.2);
            }
          }
        `}
                </style>
              </Box>
            </VStack>
          </Box>
        </Box>

        <Box ml="40px" display={{ base: "none", md: "block" }} marginTop="20px">
        <MedicSettingsSideBar/>
          <Flex>
            <VStack marginLeft="150px">
              <Box marginTop="-370px">
                <Text fontFamily="heading" color="#A210C6" fontSize="24px">
                  Frequently Asked Questions
                </Text>
                <Text fontFamily="body" fontStyle="italic" fontSize="16px">
                  Click on a question to see more details
                </Text>
              </Box>
              <Box marginLeft="170px">
                <Accordion
                  allowToggle
                  w="500px"
                  data-aos="fade-down"
                  data-aos-duration="10000"
                >
                  <AccordionItem
                    p={-6}
                    my={5}
                    fontSize="14px"
                    className="custom-accordion-item"
                  >
                    <h2>
                      <AccordionButton>
                        <Box
                          as="span"
                          flex="1"
                          textAlign="left"
                          fontSize="14px"
                          fontFamily="body"
                        >
                          Do I have to create another account as a non-medic if
                          I would like to access care?
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel
                      textAlign="justify"
                      fontSize="14px"
                      fontFamily="body"
                      className="custom-accordion-panel"
                    >
                      Upon a successful registeration, you can request and get
                      matched to a medic to recieve care by booking any of the
                      services we offer from your dashboard.
                    </AccordionPanel>
                  </AccordionItem>

                  <AccordionItem
                    p={-6}
                    my={5}
                    fontSize="12px"
                    className="custom-accordion-item"
                  >
                    <h2>
                      <AccordionButton>
                        <Box
                          as="span"
                          flex="1"
                          textAlign="left"
                          fontSize="14px"
                          fontFamily="body"
                        >
                          I entered the wrong details while requesting an
                          appointment. How do I change it?
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel
                      textAlign="justify"
                      fontSize="14px"
                      fontFamily="body"
                      className="custom-accordion-panel"
                    >
                      To ensure you are safe while you receive care from any
                      Mikul&nbsp;Health care provider, we make sure our
                      caregivers are vetted and their background checked. We
                      also have an insurance policy for any theft and damages
                      during the course of our service.
                    </AccordionPanel>
                  </AccordionItem>

                  <AccordionItem
                    p={-6}
                    my={5}
                    fontSize="14px"
                    className="custom-accordion-item"
                  >
                    <h2>
                      <AccordionButton>
                        <Box
                          as="span"
                          flex="1"
                          textAlign="left"
                          fontFamily="body"
                          fontSize="14px"
                        >
                         Is it possible to request for multiple services at the same time?
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel
                      textAlign="justify"
                      fontFamily="body"
                      fontSize="14px"
                      className="custom-accordion-panel"
                    >
                      Yes you can have a replacement when asigned a caregiver
                      that you do not like. We can provide a replace within 72
                      hours upon your request for a replacement.
                    </AccordionPanel>
                  </AccordionItem>

                  <AccordionItem
                    p={-6}
                    my={5}
                    fontSize="14px"
                    className="custom-accordion-item"
                  >
                    <h2>
                      <AccordionButton>
                        <Box
                          as="span"
                          flex="1"
                          textAlign="left"
                          fontSize="14px"
                          fontFamily="body"
                        >
                        How do I know my account is active or not?
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel
                      textAlign="justify"
                      fontSize="14px"
                      fontFamily="body"
                      className="custom-accordion-panel"
                    >
                      Yes, aside our standadized service plans. We also have
                      provision for customizing a service plan that would best
                      suit you or your loved according to the peculiarity of the
                      care needs.
                    </AccordionPanel>
                  </AccordionItem>
                </Accordion>
              </Box>
            </VStack>
            <VStack marginLeft="50px" marginTop="-285px">
              <Box textAlign="left">
                <Text fontFamily="body" color="#A210C6" fontSize="20px">
                  Contact us
                </Text>
                <VStack fontSize="14px">
                  <Text fontFamily="body">
                    If you have any issues, our Mikul Customer
                  </Text>
                  <Text fontFamily="body">
                    Care agents are always happy to help. You can reach us via:
                  </Text>

                  <Text fontFamily="body">
                    Email:
                    <a
                      href="mailto:support@mikulhealth.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      support@mikulhealth.com
                    </a>{" "}
                    <br></br>
                    Phone: <a href="tel:+2349160596636">+2349160596636</a>
                  </Text>
                </VStack>
              </Box>
              <Box
                ml={{ base: "150px", md: "100px" }}
                mb={{ base: "150px" }}
                mt={{ base: "-50px", md: "50px" }}
              >
                <a href="https://wa.me/message/7NHXMWT4I54JC1">
                  <Image
                    // onClick={help}
                    src={WhatsAppIcon}
                    alt="Logo"
                    w={{ base: "50px", md: "70px" }}
                    h={{ base: "50px", md: "70px" }}
                    style={{
                      cursor: "pointer",
                      animation: "zoomInOut 2s infinite alternate",
                    }}
                  />
                </a>
                <style>
                  {`
          @keyframes zoomInOut {
            0% {
              transform: scale(1);
            }
            100% {
              transform: scale(1.2);
            }
          }
        `}
                </style>
              </Box>
            </VStack>
          </Flex>
        </Box>
       <MedicMobileFooter/>
      </VStack>
    </ChakraProvider>
  );
};
export default MedicHelpPage;
