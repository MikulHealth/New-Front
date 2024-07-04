import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerCloseButton,
  DrawerBody,
  useBreakpointValue,
  Flex,
  Spinner,
  Text,
  useToast,
  extendTheme,
} from "@chakra-ui/react";
import axios from "axios";
import ReportList from "./ReportList";
import ReportDetails from "./ReportDetails";
import PasswordModal from "./PasswordModal";
import RecommendedInterventionModal from "./RecommendedInterventionModal";
import { generateRecommendations } from "./instructions";
import { generatePDF } from "./pdfUtils";

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
  const [modalOpen, setModalOpen] = useState(false);
  const [instructions, setInstructions] = useState([]);
  const { user } = useSelector((state) => state.userReducer);
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
        generatePDF(selectedReport, setIsDownloading, toast);
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

  const handleViewRecommendations = () => {
    const vitalsOutOfRange = {
      temperature:
        selectedReport.temperature < 36 || selectedReport.temperature > 37.5,
      bloodPressure: (() => {
        const [systolic, diastolic] = selectedReport.bloodPressure
          .split("/")
          .map(Number);
        return (
          systolic < 90 || systolic > 140 || diastolic < 60 || diastolic > 90
        );
      })(),
      pulse: selectedReport.pulse < 60 || selectedReport.pulse > 100,
      bloodSugar:
        selectedReport.bloodSugar < 70 || selectedReport.bloodSugar > 140,
      sp02: selectedReport.sp02 < 95,
      respiration:
        selectedReport.respiration < 12 || selectedReport.respiration > 20,
    };

    const formData = {
      temperature: selectedReport.temperature,
      bloodPressure: selectedReport.bloodPressure,
      pulse: selectedReport.pulse,
      bloodSugar: selectedReport.bloodSugar,
      sp02: selectedReport.sp02,
      respiration: selectedReport.respiration,
      emotionalState: selectedReport.emotionalState,
      physicalState: selectedReport.physicalState,
      painLevel: selectedReport.painLevel,
      painLocation: selectedReport.painLocation,
      skinIntegrity: selectedReport.skinIntegrity,
      appetite: selectedReport.appetite,
      fluidIntake: selectedReport.fluidIntake,
      urinaryElimination: selectedReport.urinaryElimination,
      bowelElimination: selectedReport.bowelElimination,
      sleepQuality: selectedReport.sleepQuality,
    };
    
    const recommendations = generateRecommendations(
      formData,
      vitalsOutOfRange,
      selectedReport.recipientFullName,
      selectedReport.medicFullName
    );
    setInstructions(recommendations);
    setModalOpen(true);
  };

  const closePasswordModal = () => setIsPasswordModalOpen(false);

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
            <ReportList
              reports={reports}
              searchDate={searchDate}
              setSearchDate={setSearchDate}
              setSelectedReport={setSelectedReport}
              fetchReports={fetchReports}
              searchReports={searchReports}
            />
          ) : (
            <ReportDetails
              selectedReport={selectedReport}
              setSelectedReport={setSelectedReport}
              openPasswordModal={() => setIsPasswordModalOpen(true)}
              handleViewRecommendations={handleViewRecommendations}
              isDownloading={isDownloading}
            />
          )}
        </DrawerBody>
      </DrawerContent>

      <RecommendedInterventionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        instructions={instructions}
      />

      <PasswordModal
        isOpen={isPasswordModalOpen}
        onClose={closePasswordModal}
        passwordInput={passwordInput}
        setPassword={setPassword}
        handlePasswordSubmit={handlePasswordSubmit}
        isLoading={isLoading}
      />
    </Drawer>
  );
}

export default MedicalReportsDrawer;
