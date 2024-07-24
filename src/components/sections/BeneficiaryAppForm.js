import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import PaymentModal from "./PaymentMethod";
import { baseUrl } from "../../apiCalls/config";
import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerCloseButton,
  Button,
  FormControl,
  Box,
  extendTheme,
} from "@chakra-ui/react";
import { FormFields } from "./formFields";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import BookingInstructions from "./BookingInstructions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SpecialNeedsForm from "./SpecialNeedsForm";
import {
  formatDateToUTC,
  calculateEndDate,
  calculateUrgency,
  calculateServiceCost,
} from "./helpers";

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

const townsInLagos = [
  "Ikeja",
  "Ogudu",
  "Berger",
  "Surulere",
  "Ikorodu",
  "Epe",
  "Badagry",
  "Yaba",
  "Victoria Island",
  "Lekki",
  "Lagos Island",
  "Ajah",
  "Sangotedo",
  "Agege",
  "Ikoyi",
  "Okota",
  "Mushin",
  "Iyana Ipaja",
  "Oshodi",
  "Isolo",
  "Ikotun",
  "Festac",
  "Ijesha",
  "Maryland",
  "Ojota",
];

const majorLanguages = [
  "English",
  "Yoruba",
  "Igbo",
  "Hausa",
  "Pidgin",
  "Other",
];

const BookBeneficiaryAppointmentModal = ({
  isOpen,
  onClose,
  selectedBeneficiary,
}) => {
  const { user } = useSelector((state) => state.userReducer);
  const [loading, setLoading] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [isShiftDisabled, setIsShiftDisabled] = useState(false);
  const [customizedPlans, setCustomizedPlans] = useState([]);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentData, setPaymentData] = useState({});
  const [priority, setPriority] = useState("");
  const [specialNeeds, setSpecialNeeds] = useState([]);
  const [showSpecialNeedsForm, setShowSpecialNeedsForm] = useState(false);
  const [isBookingInstructionsOpen, setIsBookingInstructionsOpen] =
    useState(false);

  const [formPages, setFormPages] = useState({
    recipientFirstname: selectedBeneficiary.recipientFirstName,
    recipientLastname: selectedBeneficiary.recipientLastName,
    recipientGender: selectedBeneficiary.recipientGender,
    recipientDOB: selectedBeneficiary.recipientDOB,
    recipientPhoneNumber: selectedBeneficiary.recipientPhoneNumber,
    currentLocation: "",
    shift: "",
    servicePlan: "",
    medicalReport: null,
    medicSpecialization: "",
    startDate: null,
    relationship: selectedBeneficiary.relationship,
    costOfService: "",
    recipientTown: "",
    preferredMedicGender: "",
    preferredLanguage: "",
    recipientHealthHistory: "",
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsBookingInstructionsOpen(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleStartDateChange = (date) => {
    setSelectedStartDate(date);
    setFormPages((prevFields) => ({ ...prevFields, startDate: date }));
    calculateUrgency(date, setPriority);

    if (formPages.servicePlan) {
      const selectedPlan = customizedPlans.find(
        (plan) => plan.name === formPages.servicePlan
      );
      if (selectedPlan) {
        calculateEndDate(
          formPages.servicePlan,
          date,
          selectedPlan.duration,
          customizedPlans,
          setFormPages
        );
      } else {
        calculateEndDate(
          formPages.servicePlan,
          date,
          null,
          customizedPlans,
          setFormPages
        );
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "servicePlan") {
      const selectedPlan = customizedPlans.find((plan) => plan.name === value);

      if (selectedPlan) {
        if (selectedPlan.costOfService) {
          const cleanedCost = selectedPlan.costOfService;

          setFormPages((prevFields) => ({
            ...prevFields,
            [name]: value,
            shift: selectedPlan.shift,
            costOfService: cleanedCost,
            medicSpecialization: selectedPlan.preferredCaregiver,
          }));
        } else {
          console.log("Cost of Service is undefined or null");
        }
        setIsShiftDisabled(true);
      } else {
        setFormPages((prevFields) => ({
          ...prevFields,
          [name]: value,
          shift: "",
          costOfService: "",
        }));
        setIsShiftDisabled(false);
      }

      if (selectedPlan) {
        calculateEndDate(
          value,
          selectedStartDate,
          selectedPlan.duration,
          customizedPlans,
          setFormPages
        );
      } else {
        calculateEndDate(
          value,
          selectedStartDate,
          null,
          customizedPlans,
          setFormPages
        );
      }

      if (value === "Short home visit") {
        setFormPages((prevFields) => ({
          ...prevFields,
          shift: "Day Shift (8hrs)",
        }));
        setIsShiftDisabled(true);
      }
    } else {
      setFormPages((prevFields) => ({ ...prevFields, [name]: value }));
    }
  };

  const handleFormSubmit = async () => {
    setLoading(true);

    const fieldNameMappings = {
      shift: "Shift",
      servicePlan: "Service Plan",
      startDate: "Start Date",
      currentLocation: "Current Location",
    };

    const requiredFields = [
      "shift",
      "servicePlan",
      "startDate",
      "currentLocation",
    ];

    for (const fieldName of requiredFields) {
      if (!formPages[fieldName]) {
        setLoading(false);
        toast.error(`${fieldNameMappings[fieldName]} is required`);
        return;
      }
    }

    try {
      const token = localStorage.getItem("token");
      const apiUrl = `${baseUrl}/appointment/save`;
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const formatDateWithDayAdjustment = (selectedDate) =>
        formatDateToUTC(new Date(selectedDate));

      const formDataWithDates = {
        ...formPages,
        startDate: formatDateWithDayAdjustment(formPages.startDate),
        customerPhoneNumber: user.phoneNumber,
        priority,
        specialNeeds,
      };

      const requestBody = JSON.stringify(formDataWithDates);
      const response = await axios.post(apiUrl, requestBody, { headers });

      if (response.data.success) {
        setLoading(false);
        setFormPages({
          currentLocation: "",
          shift: "",
          servicePlan: "",
          medicalReport: null,
          medicSpecialization: "",
          startDate: null,
          costOfService: "",
        });
        toast.success("Appointment saved");

        setPaymentData({
          costOfService: response.data.data.costOfService,
          endDate: response.data.data.endDate,
          startDate: response.data.data.startDate,
          appointmentId: response.data.data.id,
          beneficiary: `${response.data.data.recipientFirstname} ${response.data.data.recipientLastname}`,
        });
        setTimeout(() => {
          setIsPaymentModalOpen(true);
        }, 4000);
      } else {
        setLoading(false);
        console.error("Error booking appointment");
        toast.error(response.data.message);
      }
    } catch (error) {
      setLoading(false);
      console.error("An error occurred:", error);
      toast.error("Error booking appointment");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        };

        const response = await axios.get(
          `${baseUrl}/appointment/all-customized-services`,
          config
        );

        if (response.data.success) {
          setCustomizedPlans(response.data.data);
        } else {
          console.error("Failed to fetch custom services");
        }
      } catch (error) {
        console.error("Error fetching custom services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedBeneficiary) {
      setFormPages({
        recipientFirstname: selectedBeneficiary.recipientFirstName || "",
        recipientLastname: selectedBeneficiary.recipientLastName || "",
        recipientGender: selectedBeneficiary.recipientGender || "",
        recipientDOB: selectedBeneficiary.recipientDOB
          ? new Date(selectedBeneficiary.recipientDOB)
          : null,
        recipientPhoneNumber: selectedBeneficiary.recipientPhoneNumber || "",
        currentLocation: "",
        shift: "",
        servicePlan: "",
        medicalReport: null,
        medicSpecialization: "",
        startDate: null,
        relationship: selectedBeneficiary.relationship || "",
      });
    }
  }, [selectedBeneficiary]);

  useEffect(() => {
    calculateServiceCost(
      formPages.servicePlan,
      formPages.shift,
      customizedPlans,
      setFormPages
    );
  }, [formPages.servicePlan, formPages.shift, customizedPlans]);

  return (
    <>
      <Drawer
        theme={customTheme}
        isOpen={isOpen}
        onClose={onClose}
        size={{ base: "md", md: "lg" }}
      >
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader fontFamily="heading" textAlign="center" color="#A210C6">
            Book Appointment for{" "}
            {`${selectedBeneficiary.recipientFirstName || ""} ${
              selectedBeneficiary.recipientLastName || ""
            }`}
          </DrawerHeader>

          <DrawerCloseButton />
          {showSpecialNeedsForm ? (
            <SpecialNeedsForm
              specialNeeds={specialNeeds}
              loading={loading}
              setSpecialNeeds={setSpecialNeeds}
              handleSubmit={handleFormSubmit}
              handleBack={() => setShowSpecialNeedsForm(false)}
            />
          ) : (
            <DrawerBody ml={{ base: "25px", md: "0" }}>
              <FormControl isRequired>
                <FormFields
                  formFields={formPages}
                  townsInLagos={townsInLagos}
                  majorLanguages={majorLanguages}
                  handleInputChange={handleInputChange}
                  handleStartDateChange={handleStartDateChange}
                  selectedStartDate={selectedStartDate}
                  customizedPlans={customizedPlans}
                  isShiftDisabled={isShiftDisabled}
                />
                <Box mb="20px" ml={{ base: "20px", md: "40px" }}>
                  <Button
                    isLoading={loading}
                    loadingText="Loading..."
                    w="150px"
                    // bg="#A210C6"
                    bg="linear-gradient(80deg, #A210C6, #E552FF)"
                    color="white"
                    mt="20px"
                    onClick={() => setShowSpecialNeedsForm(true)}
                  >
                    {loading ? "Loading..." : "Next"}
                  </Button>
                </Box>
              </FormControl>
            </DrawerBody>
          )}
        </DrawerContent>
      </Drawer>
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        paymentData={paymentData}
      />
      <BookingInstructions
        isOpen={isBookingInstructionsOpen}
        onClose={() => setIsBookingInstructionsOpen(false)}
      />
    </>
  );
};

export default BookBeneficiaryAppointmentModal;
