import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import PaymentModal from "./PaymentMethod";
import BookingInstructions from "./BookingInstructions";
import { baseUrl } from "../../apiCalls/config";
import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  FormControl,
  Box,
  Button,
  extendTheme,
} from "@chakra-ui/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SpecialNeedsForm from "./SpecialNeedsForm";
import { FormFields } from "./formFields";
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

const SelfAppointmentModal = ({ isOpen, onClose }) => {
  const { user } = useSelector((state) => state.userReducer);
  const [loading, setLoading] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [isShiftDisabled, setIsShiftDisabled] = useState(false);
  const [customizedPlans, setCustomizedPlans] = useState([]);
  const [selectedDob] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentData, setPaymentData] = useState({});
  const [priority, setPriority] = useState("");
  const [specialNeeds, setSpecialNeeds] = useState([]);
  const [showSpecialNeedsForm, setShowSpecialNeedsForm] = useState(false);
  const [isBookingInstructionsOpen, setIsBookingInstructionsOpen] =
    useState(false);

  const [formFields, setFormFields] = useState({
    startDate: null,
    endDate: null,
    shift: "",
    servicePlan: "",
    currentLocation: "",
    medicalReport: "",
    recipientHealthHistory: "",
    recipientTown: "",
    preferredMedicGender: "",
    preferredLanguage: "",
    costOfService: "",
    duration: "",
    customerId: user?.userId,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsBookingInstructionsOpen(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleStartDateChange = (date) => {
    setSelectedStartDate(date);
    setFormFields((prevFields) => ({ ...prevFields, startDate: date }));
    calculateUrgency(date, setPriority);

    if (formFields.servicePlan) {
      const selectedPlan = customizedPlans.find(
        (plan) => plan.name === formFields.servicePlan
      );
      if (selectedPlan) {
        calculateEndDate(
          formFields.servicePlan,
          date,
          selectedPlan.duration,
          customizedPlans,
          setFormFields
        );
      } else {
        calculateEndDate(
          formFields.servicePlan,
          date,
          null,
          customizedPlans,
          setFormFields
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

          setFormFields((prevFields) => ({
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
        setFormFields((prevFields) => ({
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
          setFormFields
        );
      } else {
        calculateEndDate(
          value,
          selectedStartDate,
          null,
          customizedPlans,
          setFormFields
        );
      }

      if (value === "Short home visit") {
        setFormFields((prevFields) => ({
          ...prevFields,
          shift: "Day Shift (8hrs)",
        }));
        setIsShiftDisabled(true);
      }
    } else {
      setFormFields((prevFields) => ({ ...prevFields, [name]: value }));
    }
  };

  const handleLocationChange = (location) => {
    setFormFields((prevFields) => ({
      ...prevFields,
      currentLocation: location,
    }));
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
    calculateServiceCost(
      formFields.servicePlan,
      formFields.shift,
      customizedPlans,
      setFormFields
    );
  }, [formFields.servicePlan, formFields.shift, customizedPlans]);

  const handleFormSubmit = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const apiUrl = `${baseUrl}/appointment/save`;

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const formatDateWithDayAdjustment = (selectedDate) =>
        formatDateToUTC(new Date(selectedDate));

      const userFieldsForBookForSelf = {
        recipientFirstname: user?.firstName,
        recipientLastname: user?.lastName,
        recipientPhoneNumber: user?.phoneNumber,
        recipientGender: user?.gender,
        recipientDOB: user?.dob,
        recipientImage: user?.image,
      };

      const formDataWithDates = {
        ...formFields,
        startDate: formatDateWithDayAdjustment(selectedStartDate),
        endDate: formatDateWithDayAdjustment(formFields.endDate),
        recipientDOB: formatDateWithDayAdjustment(selectedDob),
        customerPhoneNumber: user?.phoneNumber,
        customerId: user?.userId,
        priority,
        specialNeeds,
        ...userFieldsForBookForSelf,
      };

      const requestBody = JSON.stringify(formDataWithDates);
      const response = await axios.post(apiUrl, requestBody, { headers });

      if (response.data.success) {
        setLoading(false);
        setFormFields({
          startDate: null,
          endDate: null,
          shift: "",
          servicePlan: "",
          currentLocation: "",
          medicalReport: "",
          recipientHealthHistory: "",
          recipientTown: "",
          preferredMedicGender: "",
          preferredLanguage: "",
        });
        toast.success("Appointment saved");
        setPaymentData({
          costOfService: response.data.data.costOfService,
          appointmentId: response.data.data.id,
          startDate: response.data.data.startDate,
          endDate: response.data.data.endDate,
          beneficiary: `${response.data.data.recipientFirstname} ${response.data.data.recipientLastname}`,
        });

        setTimeout(() => {
          setIsPaymentModalOpen(true);
        }, 4000);
      } else {
        setLoading(false);
        console.error(response.data.message);
        toast.error(response.data.message);
      }
    } catch (error) {
      setLoading(false);
      console.error("An error occurred:", error);
      toast.error("Error booking appointment");
    }
  };

  return (
    <>
      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        size={{ base: "md", md: "lg" }}
        placement="right"
        theme={customTheme}
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
        <DrawerContent alignItems="center">
          <DrawerCloseButton />
          <DrawerHeader color="#A210C6" fontFamily="heading">
            Book Appointment
          </DrawerHeader>

          {showSpecialNeedsForm ? (
            <SpecialNeedsForm
              specialNeeds={specialNeeds}
              loading={loading}
              setSpecialNeeds={setSpecialNeeds}
              handleSubmit={handleFormSubmit}
              handleBack={() => setShowSpecialNeedsForm(false)}
            />
          ) : (
            <>
              <DrawerBody>
                <FormControl>
                  <FormFields
                    formFields={formFields}
                    townsInLagos={townsInLagos}
                    majorLanguages={majorLanguages}
                    handleInputChange={handleInputChange}
                    handleStartDateChange={handleStartDateChange}
                    selectedStartDate={selectedStartDate}
                    customizedPlans={customizedPlans}
                    isShiftDisabled={isShiftDisabled}
                    handleLocationChange={handleLocationChange}
                  />
                  <Box mb="20px" ml={{ base: "20px", md: "40px" }} mt="20px">
                    <Button
                      isLoading={loading}
                      loadingText="Loading..."
                      w="150px"
                      bg="linear-gradient(80deg, #A210C6, #E552FF)"
                      color="white"
                      onClick={() => setShowSpecialNeedsForm(true)}
                    >
                      {loading ? "Loading..." : "Next"}
                    </Button>
                  </Box>
                </FormControl>
              </DrawerBody>
            </>
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

export default SelfAppointmentModal;
