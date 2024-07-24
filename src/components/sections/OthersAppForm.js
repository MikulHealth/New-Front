import axios from "axios";
import { useSelector } from "react-redux";
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import BookingInstructions from "./BookingInstructions";
import { baseUrl } from "../../apiCalls/config";
// import { Link } from "react-router-dom";
import { FormFields } from "./formFields";
import { FaPhoneAlt } from "react-icons/fa";
import PaymentModal from "./PaymentMethod";
import SpecialNeedsForm from "./SpecialNeedsForm";
import {
  formatDateToUTC,
  calculateEndDate,
  calculateUrgency,
  calculateServiceCost,
} from "./helpers";

import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  FormControl,
  FormLabel,
  InputGroup,
  InputRightElement,
  InputLeftAddon,
  Input,
  Button,
  Flex,
  Box,
  Select,
  Switch,
  Text,
  extendTheme,
} from "@chakra-ui/react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

const OthersAppointmentModal = ({ isOpen, onClose }) => {
  const { user } = useSelector((state) => state.userReducer);
  const [loading, setLoading] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedDob, setSelectedDob] = useState(null);
  const [customizedPlans, setCustomizedPlans] = useState([]);
  const [addToBeneficiaryList, setAddToBeneficiaryList] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentData, setPaymentData] = useState({});
  const [shiftDisabled, setIsShiftDisabled] = useState(false);
  const [priority, setPriority] = useState("");
  const [specialNeeds, setSpecialNeeds] = useState([]);
  const [showSpecialNeedsForm, setShowSpecialNeedsForm] = useState(false);

  const [isBookingInstructionsOpen, setIsBookingInstructionsOpen] =
    useState(false);

  const [formFields, setFormFields] = useState({
    recipientFirstname: "",
    recipientLastname: "",
    recipientPhoneNumber: "",
    recipientGender: "",
    recipientDOB: "",
    currentLocation: "",
    shift: "",
    servicePlan: "",
    costOfService: "",
    startDate: "",
    relationship: "",
    medicalReport: "",
    recipientHealthHistory: "",
    recipientTown: "",
    preferredMedicGender: "",
    preferredLanguage: "",
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsBookingInstructionsOpen(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

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

  const handleDOBChange = (date) => {
    setSelectedDob(date);
    setFormFields({ ...formFields, recipientDOB: date });
  };

  const getValidNigerianPhoneNumber = (phoneNumber) => {
    const pattern = /^(\d{10})$/;
    if (pattern.test(phoneNumber)) {
      return "0" + phoneNumber;
    }
    return null;
  };

  const handleFormSubmit = async () => {
    setLoading(true);

    const validPhoneNumber = getValidNigerianPhoneNumber(
      formFields.recipientPhoneNumber
    );
    console.log("number " + validPhoneNumber);

    if (!validPhoneNumber) {
      toast.warning("Please enter a valid Nigerian phone number");
      setLoading(false);
      return;
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
        ...formFields,
        startDate: formatDateWithDayAdjustment(formFields.startDate),
        recipientDOB: formatDateWithDayAdjustment(formFields.recipientDOB),
        recipientPhoneNumber: validPhoneNumber,
        customerPhoneNumber: user?.phoneNumber,
        customerId: user?.id,
        priority,
        specialNeeds,
      };
      const requestBody = JSON.stringify(formDataWithDates);
      const response = await axios.post(apiUrl, requestBody, { headers });

      if (response.data.success) {
        setLoading(false);
        setFormFields({
          recipientFirstname: "",
          recipientLastname: "",
          recipientPhoneNumber: "",
          recipientGender: "",
          recipientDOB: "",
          currentLocation: "",
          shift: "",
          servicePlan: "",
          costOfService: "",
          startDate: "",
          relationship: "",
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
          endDate: response.data.data.endDate,
          startDate: response.data.data.startDate,
          beneficiary: `${response.data.data.recipientFirstname} ${response.data.data.recipientLastname}`,
        });
        setTimeout(() => {
          setIsPaymentModalOpen(true);
        }, 1000);
      } else {
        setLoading(false);
        console.error("Error booking appointment");
        const errorMessage = response.data
          ? response.data.message
          : "Unknown error";
        toast.error(errorMessage);
      }
    } catch (error) {
      setLoading(false);
      console.error("An error occurred:", error);
      toast.error("Error booking appointment");
    }
  };

  useEffect(() => {
    calculateServiceCost(
      formFields.servicePlan,
      formFields.shift,
      customizedPlans,
      setFormFields
    );
  }, [formFields.servicePlan, formFields.shift, customizedPlans]);

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

  const handleSwitchChange = async () => {
    setLoading(true);

    const validPhoneNumber = getValidNigerianPhoneNumber(
      formFields.recipientPhoneNumber
    );
    console.log("number " + validPhoneNumber);

    if (!validPhoneNumber) {
      toast.warning("Please enter a valid Nigerian phone number");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const apiUrl = `${baseUrl}/appointment/addNewBeneficiary`;
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const formatDateWithDayAdjustment = (selectedDate) =>
        formatDateToUTC(new Date(selectedDate));

      const formDataWithDates = {
        ...formFields,
        recipientDOB: formatDateWithDayAdjustment(formFields.recipientDOB),
        recipientPhoneNumber: validPhoneNumber,
        customerPhoneNumber: user?.phoneNumber,
        customerId: user?.id,
      };

      const requestBody = JSON.stringify(formDataWithDates);

      const response = await axios.post(apiUrl, requestBody, { headers });

      if (response.data.success) {
        setLoading(false);
        toast.success("Beneficiary added");
      } else {
        setLoading(false);
        console.error("Error adding beneficiary");
        const errorMessage = response.data
          ? response.data.message
          : "Unknown error";
        toast.error(errorMessage);
      }
    } catch (error) {
      setLoading(false);
      console.error("An error occurred:", error);
      toast.error("Error adding beneficiary");
    }
  };

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
        <DrawerContent alignItems="center">
          <DrawerCloseButton />
          <DrawerHeader color="#A210C6" fontFamily="heading">
            Book Appointment
          </DrawerHeader>

          <DrawerBody>
            {showSpecialNeedsForm ? (
              <SpecialNeedsForm
                specialNeeds={specialNeeds}
                loading={loading}
                setSpecialNeeds={setSpecialNeeds}
                handleSubmit={handleFormSubmit}
                handleBack={() => setShowSpecialNeedsForm(false)}
              />
            ) : (
              <FormControl w={{ base: "100%", md: "100%" }}>
                <FormLabel
                  ml={{ base: "20px", md: "30px" }}
                  fontWeight="bold"
                  fontFamily="heading"
                  color="#00000080"
                >
                  Enter Beneficiary details
                </FormLabel>
                <Flex
                  display={{ base: "block", md: "flex" }}
                  ml={{ base: "20px", md: "30px" }}
                >
                  <InputGroup>
                    <Input
                      name="recipientFirstname"
                      placeholder="first name"
                      value={formFields.recipientFirstname}
                      onChange={handleInputChange}
                      w={{ base: "300px", md: "270px" }}
                      h="6vh"
                    />
                  </InputGroup>
                  <InputGroup
                    mt={{ base: "20px", md: "0" }}
                    ml={{ md: "40px" }}
                  >
                    <Input
                      name="recipientLastname"
                      ml={{ md: "-35px" }}
                      placeholder="last name"
                      value={formFields.recipientLastname}
                      onChange={handleInputChange}
                      w={{ base: "300px", md: "270px" }}
                      h="6vh"
                    />
                  </InputGroup>
                </Flex>
                <Flex flexWrap="wrap" ml={{ base: "20px", md: "30px" }}>
                  <Box>
                    <FormLabel
                      fontFamily="body"
                      fontWeight="bold"
                      marginTop="20px"
                      color="#00000080"
                    >
                      Gender{" "}
                    </FormLabel>
                    <Select
                      name="recipientGender"
                      placeholder="select gender"
                      w={{ base: "300px", md: "270px" }}
                      h="6vh"
                      value={formFields.recipientGender}
                      onChange={handleInputChange}
                      style={{ color: "#00000080" }}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </Select>
                  </Box>
                  <Box fontFamily="body" ml={{ md: "5px" }}>
                    <FormLabel
                      color="#00000080"
                      fontWeight="bold"
                      marginTop="20px"
                    >
                      Date of Birth
                    </FormLabel>
                    <Flex
                      h="6vh"
                      padding="5px"
                      paddingLeft="15px"
                      style={{
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                      }}
                      w={{ base: "300px", md: "270px" }}
                    >
                      <DatePicker
                        name="recipientDOB"
                        selected={selectedDob}
                        onChange={handleDOBChange}
                        maxDate={new Date()}
                        peekNextMonth
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        dateFormat="dd-MM-yyyy"
                        placeholderText="select date of birth"
                        className="form-control"
                      />
                    </Flex>
                  </Box>
                </Flex>
                <Flex
                  flexWrap="wrap"
                  marginTop="1px"
                  ml={{ base: "20px", md: "30px" }}
                >
                  <Box>
                    <FormLabel
                      fontFamily="body"
                      fontWeight="bold"
                      marginTop="20px"
                      color="#00000080"
                    >
                      Contact Number{" "}
                    </FormLabel>
                    <InputGroup>
                      <InputLeftAddon children="+234" />
                      <Input
                        name="recipientPhoneNumber"
                        type="tel"
                        placeholder="recipient phone number"
                        value={formFields.recipientPhoneNumber}
                        onChange={handleInputChange}
                        w={{ base: "230px", md: "475px" }}
                      />
                      <InputRightElement pointerEvents="none">
                        <FaPhoneAlt color="#00000080" />
                      </InputRightElement>
                    </InputGroup>
                  </Box>
                  <Box ml={{ md: "5px" }}>
                    <FormLabel
                      fontFamily="body"
                      fontWeight="bold"
                      marginTop="20px"
                      color="#00000080"
                    >
                      Relationship with beneficiary{" "}
                    </FormLabel>
                    <Select
                      style={{ color: "#00000080" }}
                      name="relationship"
                      placeholder="Select the appropriate relationship type"
                      w={{ base: "300px", md: "540px" }}
                      onChange={handleInputChange}
                    >
                      <option value="Mum">Mum</option>
                      <option value="Dad">Dad</option>
                      <option value="Wife">Wife</option>
                      <option value="Husband">Husband</option>
                      <option value="Sister">Sister</option>
                      <option value="Brother">Brother</option>
                      <option value="Uncle">Uncle</option>
                      <option value="Aunt">Aunt</option>
                      <option value="Son">Son</option>
                      <option value="Daughter">Daughter</option>
                      <option value="Niece">Niece</option>
                      <option value="Nephew">Nephew</option>
                      <option value="Cousin">Cousin</option>
                      <option value="Friend">Friend</option>
                      <option value="Colleague">Colleague</option>
                      <option value="Neighbour">Neighbour</option>
                      <option value="MotherInLaw">Mother in-law</option>
                      <option value="FatherInLaw">Father in-law</option>
                      <option value="Grandmother">Grand mother</option>
                      <option value="Grandfather">Grand father</option>
                    </Select>
                  </Box>
                </Flex>
                <FormFields
                  formFields={formFields}
                  townsInLagos={townsInLagos}
                  majorLanguages={majorLanguages}
                  handleInputChange={handleInputChange}
                  handleStartDateChange={handleStartDateChange}
                  selectedStartDate={selectedStartDate}
                  customizedPlans={customizedPlans}
                  isShiftDisabled={shiftDisabled}
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
            )}
            <Flex justify="right" marginTop="10px">
              <Text fontFamily="body" color="#A210C6" fontStyle="italic">
                Add to beneficiary list?
              </Text>
              <Switch
                marginLeft="10px"
                colorScheme="green"
                isChecked={addToBeneficiaryList}
                onChange={() => {
                  setAddToBeneficiaryList(!addToBeneficiaryList);
                  if (!addToBeneficiaryList) {
                    handleSwitchChange();
                  }
                }}
              />
            </Flex>
          </DrawerBody>
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

export default OthersAppointmentModal;
