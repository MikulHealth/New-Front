import React, { useState, useEffect, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerCloseButton,
  DrawerBody,
  Button,
  List,
  ListItem,
  Flex,
  Text,
  useToast,
  Box,
  Image,
  VStack,
  useBreakpointValue,
  Spinner,
  InputGroup,
  InputRightElement,
  IconButton,
  Input,
  Modal,
  ModalOverlay,
  extendTheme,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { DownloadIcon, SearchIcon, CloseIcon } from "@chakra-ui/icons";
import axios from "axios";
import { jsPDF } from "jspdf";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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

function MedicalReportsDrawer({ isOpen, onClose }) {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchDate, setSearchDate] = useState(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordInput, setPassword] = useState("");
  // const [passwordError, setPasswordError] = useState("");
  const { user } = useSelector((state) => state.userReducer);
  // const navigate = useNavigate();
  const toast = useToast();
  const drawerSize = useBreakpointValue({ base: "full", md: "lg" });
  const emailInput = user?.email;

  const fetchReports = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        "https://backend-c1pz.onrender.com/v1/appointment/fetch-reports",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      if (response.data.success) {
        const sortedReports = response.data.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setReports(sortedReports);
      } else {
        toast({
          title: "Failed to load reports",
          description: response.data.message,
          status: "error",
          duration: 9000,
          isClosable: true,
          position: "top-right",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while fetching medical reports.",
        status: "error",
        duration: 9000,
        isClosable: true,
        position: "top-right",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const handlePasswordSubmit = async () => {
    setIsLoading(true);
    const apiUrl = "https://backend-c1pz.onrender.com/login";
    // const apiUrl = "http://localhost:8080/login";
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailInput,
          password: passwordInput,
        }),
      });

      if (response.ok) {
        closePasswordModal();
        generatePDF(selectedReport);
      } else {
        toast({
          title: "Verification Failed",
          description: "Invalid password. Please try again.",
          status: "error",
          duration: 2000,
          isClosable: true,
          position: "top-left",
        });
      }
    } catch (error) {
      toast({
        title: "Verification Error",
        description: "Invalid password. Please try again.",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top-left",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const searchReports = useCallback(
    async (date) => {
      if (!date) return;
      setIsLoading(true);
      try {
        const newDate = new Date(date);
        newDate.setDate(newDate.getDate() + 1);
        const formattedDate = new Date(newDate).toISOString().split("T")[0];
        const response = await axios.get(
          // `http://localhost:8080/v1/appointment/search-report?date=${formattedDate}`,
          `https://backend-c1pz.onrender.com/v1/appointment/search-report?date=${formattedDate}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.data.success) {
          const sortedReports = response.data.data.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          setReports(sortedReports);
        } else {
          toast({
            title: "Failed to load reports",
            description: response.data.message,
            status: "error",
            duration: 9000,
            isClosable: true,
            position: "top-right",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "An error occurred while fetching medical reports.",
          status: "error",
          duration: 9000,
          isClosable: true,
          position: "top-right",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [toast]
  );

  useEffect(() => {
    if (isOpen) {
      fetchReports();
    }
  }, [isOpen, fetchReports]);

  useEffect(() => {
    if (searchDate) {
      searchReports(searchDate);
    }
  }, [searchDate, searchReports]);

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()}, ${date.toLocaleTimeString()}`;
  };

  const formatMedicationTime = (medication) => {
    const parts = medication.split(",");
    const timePart = parts.find((part) => part.startsWith("Time:"));
    const time = timePart
      ? new Date(timePart.replace("Time:", ""))
      : new Date(NaN);
    return `${parts[0]}, ${parts[1]}, ${parts[2]}, ${
      !isNaN(time.getTime())
        ? `Time:${time.toLocaleString()}`
        : "Time:Invalid Date"
    }`;
  };

  const generatePDF = async (report) => {
    setIsDownloading(true);
    try {
      const doc = new jsPDF();
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");

      // Add title
      const title = `${report.recipientFullName} MH Report`;
      doc.text(title, 10, 20);

      doc.setFontSize(12);

      const addText = (label, text, offsetY) => {
        doc.setFont("helvetica", "bold");
        const splitLabel = doc.splitTextToSize(`${label}: `, 180);
        doc.text(splitLabel, 10, offsetY);
        const labelHeight = splitLabel.length * 10;

        doc.setFont("helvetica", "normal");
        const splitText = doc.splitTextToSize(text, 180);
        doc.text(
          splitText,
          10 + doc.getTextDimensions(splitLabel[0]).w,
          offsetY
        );
        const textHeight = splitText.length * 10;

        const totalHeight = Math.max(labelHeight, textHeight);
        if (offsetY + totalHeight > 280) {
          doc.addPage();
          offsetY = 10;
        }

        return offsetY + totalHeight;
      };

      let offsetY = 30; // Start below the title
      offsetY = addText("Beneficiary name ", report.recipientFullName, offsetY);
      offsetY = addText("Service Plan ", report.servicePlan, offsetY);
      offsetY = addText(
        "Report date and time ",
        formatDateTime(report.createdAt),
        offsetY
      );
      offsetY = addText("Temperature ", `${report.temperature}°C`, offsetY);
      offsetY = addText("Blood Pressure ", report.bloodPressure, offsetY);
      offsetY = addText("Pulse ", `${report.pulse} bpm`, offsetY);
      offsetY = addText("Blood Sugar ", report.bloodSugar, offsetY);
      offsetY = addText("SpO2 ", `${report.sp02}%`, offsetY);
      offsetY = addText("Respiration ", `${report.respiration} c/m`, offsetY);

      // Adding medications
      offsetY = addText("Medications ", "", offsetY);
      report.medications.forEach((medication) => {
        offsetY = addText("", formatMedicationTime(medication), offsetY);
      });

      // Adding activities
      offsetY = addText("Activities ", "", offsetY);
      report.activities.forEach((activity) => {
        offsetY = addText("", activity, offsetY);
      });

      offsetY = addText("Comments ", report.comments, offsetY);
      offsetY = addText("Recommendations ", report.recommendations, offsetY);
      offsetY = addText("Reported by ", report.medicFullName, offsetY);

      if (report.picturePath) {
        if (offsetY + 160 > 280) {
          doc.addPage();
          offsetY = 10;
        }
        doc.addImage(report.picturePath, "JPEG", 10, offsetY, 180, 160);
      }

      doc.save(
        `${report.recipientFullName}_${formatDateTime(
          report.createdAt
        )}_MH_Medical_Report.pdf`
      );
      toast({
        title: "Download Complete",
        description: "Report downloaded successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while generating the PDF.",
        status: "error",
        duration: 9000,
        isClosable: true,
        position: "top-right",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const openPasswordModal = () => setIsPasswordModalOpen(true);
  const closePasswordModal = () => setIsPasswordModalOpen(false);

  // const handlePasswordSubmit = () => {
  //   if (password === "yourPassword") {
  //     // Replace "yourPassword" with your actual password or validation logic
  //     closePasswordModal();
  //     generatePDF(selectedReport);
  //   } else {
  //     setPasswordError("Invalid password. Please try again.");
  //   }
  // };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={() => {
        onClose();
        setSelectedReport(null);
        setSearchDate(null);
      }}
      size={drawerSize}
      theme={customTheme}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader fontFamily="heading" color="#A210C6">
          Medical Reports
        </DrawerHeader>
        <DrawerCloseButton />
        <DrawerBody>
          {isLoading ? (
            <Flex justifyContent="center" alignItems="center" height="100%">
              <Spinner size="xl" />
            </Flex>
          ) : reports.length === 0 ? (
            <Text fontFamily="body">You have no medical report yet.</Text>
          ) : !selectedReport ? (
            <List mb="10px" spacing={3} color="#A210C6">
              <InputGroup borderRadius="10px" mb="10px" border="4px solid gray">
                <DatePicker
                  selected={searchDate}
                  onChange={(date) => setSearchDate(date)}
                  dateFormat="yyyy-MM-dd"
                  placeholderText="Search report by bate"
                  customInput={
                    <Input
                      placeholder="Search report by date"
                      value={
                        searchDate ? searchDate.toISOString().split("T")[0] : ""
                      }
                      border="none"
                    />
                  }
                />
                <InputRightElement>
                  {searchDate ? (
                    <IconButton
                      icon={<CloseIcon />}
                      onClick={() => {
                        setSearchDate(null);
                        fetchReports();
                      }}
                    />
                  ) : (
                    <IconButton
                      icon={<SearchIcon />}
                      onClick={() => searchReports(searchDate)}
                    />
                  )}
                </InputRightElement>
              </InputGroup>
              {reports.map((report) => (
                <ListItem
                  border="1px solid #A210C6"
                  p="10px"
                  borderRadius="5px"
                  key={report.id}
                  cursor="pointer"
                  onClick={() => setSelectedReport(report)}
                >
                  <Text fontFamily="body" fontWeight="bold">
                    Report for: {report.recipientFullName} on{" "}
                    {formatDateTime(report.createdAt)}
                  </Text>
                  <Text fontWeight="body" fontStyle="italic">
                    Submitted by: {report.medicFullName}
                  </Text>
                </ListItem>
              ))}
            </List>
          ) : (
            <VStack mb="50px" spacing={4} align="start" w="100%">
              <Flex justifyContent="space-between" w="100%">
                <Button
                  colorScheme="blue"
                  onClick={() => setSelectedReport(null)}
                >
                  Back
                </Button>
                <Button
                  mb="10px"
                  bg="green.500"
                  color="white"
                  leftIcon={<DownloadIcon />}
                  onClick={openPasswordModal}
                  isLoading={isDownloading}
                  loadingText="Downloading..."
                >
                  PDF
                </Button>
              </Flex>
              {/* <Divider my={2} borderColor="gray.500" /> */}
              <Flex
                justifyContent="space-between"
                flexDirection={{ base: "column", md: "row" }}
                w="100%"
                fontFamily="body"
              >
                <Flex mb={{ base: 2, md: 0 }}>
                  <Text fontWeight="bold">Beneficiary name:</Text>
                  <Text ml={2}>{selectedReport.recipientFullName}</Text>
                </Flex>

                <Flex mb={{ base: 2, md: 0 }}>
                  <Text ml={{ base: 0, md: "10px" }} fontWeight="bold">
                    Service Plan:
                  </Text>
                  <Text ml="10px">{selectedReport.servicePlan}</Text>
                </Flex>
              </Flex>
              <Flex fontFamily="body">
                <Text fontWeight="bold">Report date and time:</Text>
                <Text ml="10px">
                  {formatDateTime(selectedReport.createdAt)}
                </Text>
              </Flex>
              <Box fontFamily="body">
                <Text fontWeight="bold">Vital Signs:</Text>
                <Text>Temperature: {selectedReport.temperature}°C</Text>
                <Text>Blood Pressure: {selectedReport.bloodPressure}</Text>
                <Text>Pulse: {selectedReport.pulse} bpm</Text>
                <Text>Blood Sugar: {selectedReport.bloodSugar}</Text>
                <Text>SpO2: {selectedReport.sp02}%</Text>
                <Text>Respiration: {selectedReport.respiration} c/m</Text>
                <Text fontWeight="bold">Medications:</Text>
                <VStack align="start" spacing={1}>
                  {selectedReport.medications.map((medication, index) => (
                    <Text key={index}>{formatMedicationTime(medication)}</Text>
                  ))}
                </VStack>
                <Text fontWeight="bold" maxWidth="100%">
                  Activities:
                </Text>
                <VStack align="start" spacing={1}>
                  {selectedReport.activities.map((activity, index) => (
                    <Text key={index}>{activity}</Text>
                  ))}
                </VStack>
                <Text fontWeight="bold" maxWidth="100%">
                  Comments/Observation:
                </Text>
                <Text maxWidth="100%">{selectedReport.comments}</Text>
                <Text fontWeight="bold" maxWidth="100%">
                  Recommendations/Requests:
                </Text>
                <Text maxWidth="100%">{selectedReport.recommendations}</Text>
                <Flex>
                  <Text fontStyle="italic" fontWeight="bold">
                    Submitted by:
                  </Text>
                  <Text ml="10px" fontStyle="italic">
                    {selectedReport.medicFullName}
                  </Text>
                </Flex>

                {selectedReport.picturePath && (
                  <Image src={selectedReport.picturePath} alt="Medical Image" />
                )}
              </Box>
            </VStack>
          )}
        </DrawerBody>
      </DrawerContent>

      <Modal
        size={{ base: "sm", md: "md" }}
        isOpen={isPasswordModalOpen}
        onClose={closePasswordModal}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontFamily="heading" color="#A210C6">
            Enter Password
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontWeight="body" mb={4}>
              Mikul health wants to make sure it's really you trying to downlaod
              the medical report. <br></br>To ensure the security and privacy of
              your medical information, please confirm your identity by entering
              your password.
            </Text>

            <Input
              placeholder="Password"
              type="password"
              value={passwordInput}
              onChange={(e) => setPassword(e.target.value)}
              mb={3}
            />
            {/* {passwordError && <Text color="red.500">{passwordError}</Text>} */}
          </ModalBody>
          <ModalFooter>
            <Button
              bg="#A210C6"
              color="white"
              mr={3}
              onClick={handlePasswordSubmit}
              fontFamily="body"
            >
              Submit
            </Button>
            <Button
              fontFamily="body"
              bg="gray.500"
              color="white"
              onClick={closePasswordModal}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Drawer>
  );
}

export default MedicalReportsDrawer;
