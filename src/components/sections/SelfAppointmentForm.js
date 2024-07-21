import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
// import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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
  FormLabel,
  Input,
  Button,
  Flex,
  Box,
  Select,
  extendTheme,
  Textarea,
} from "@chakra-ui/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SpecialNeedsForm from "./SpecialNeedsForm";

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
    shift: "",
    servicePlan: "",
    currentLocation: "",
    medicalReport: "",
    recipientHealthHistory: "",
    recipientTown: "",
    preferredMedicGender: "",
    preferredLanguage: "",
    costOfService: "",
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsBookingInstructionsOpen(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const formatDateToUTC = (selectedDate) => {
    if (!selectedDate) return "";

    const adjustedDate = new Date(selectedDate);
    adjustedDate.setDate(adjustedDate.getDate() + 1);

    return adjustedDate.toISOString().split("T")[0];
  };

  const handleStartDateChange = (date) => {
    setSelectedStartDate(date);
    setFormFields({ ...formFields, startDate: date });
    calculateUrgency(date);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "servicePlan") {
      const selectedPlan = customizedPlans.find((plan) => plan.name === value);

      if (selectedPlan) {
        if (selectedPlan.costOfService) {
          const cleanedCost = selectedPlan.costOfService;

          setFormFields({
            ...formFields,
            [name]: value,
            shift: selectedPlan.shift,
            costOfService: cleanedCost,
            medicSpecialization: selectedPlan.preferredCaregiver,
          });
        } else {
          console.log("Cost of Service is undefined or null");
        }
        setIsShiftDisabled(true);
      } else {
        setFormFields({
          ...formFields,
          [name]: value,
          shift: "",
          costOfService: "",
        });
        setIsShiftDisabled(false);
      }
    } else {
      setFormFields({ ...formFields, [name]: value });
    }
  };

  const calculateUrgency = (date) => {
    const now = new Date();
    const diffInHours = (date - now) / (1000 * 60 * 60);

    if (diffInHours <= 24) {
      setPriority("High");
    } else if (diffInHours <= 48) {
      setPriority("Medium");
    } else if (diffInHours <= 72) {
      setPriority("Normal");
    } else {
      setPriority("Flexible");
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
        recipientDOB: formatDateWithDayAdjustment(selectedDob),
        customerPhoneNumber: user?.phoneNumber,
        customerId: user?.id,
        priority,
        specialNeeds, // Include specialNeeds in the request
        ...userFieldsForBookForSelf,
      };
  
      const requestBody = JSON.stringify(formDataWithDates);
      const response = await axios.post(apiUrl, requestBody, { headers });
  
      if (response.data.success) {
        setLoading(false);
        setFormFields({
          startDate: null,
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
          beneficiary: `${response.data.data.recipientFirstname} ${response.data.data.recipientLastname}`, // corrected line
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
  
  const calculateServiceCost = () => {
    const { servicePlan, shift } = formFields;

    let costOfService = 0;

    switch (servicePlan) {
      case "Elderly care by a Licensed Nurse":
        costOfService = shift === "Day Shift (8hrs)" ? 180000 : 220000;
        break;
      case "Elderly care by a Nurse Assistant":
        costOfService = shift === "Day Shift (8hrs)" ? 120000 : 150000;
        break;
      case "Postpartum care":
      case "Recovery care":
        costOfService = shift === "Day Shift (8hrs)" ? 200000 : 250000;
        break;
      case "Nanny care":
        costOfService = shift === "Day Shift (8hrs)" ? 70000 : 90000;
        break;
      case "Short home visit":
        costOfService = 15000;
        break;
      default:
        const customPlan = customizedPlans.find(
          (plan) => plan.name === servicePlan
        );
        if (customPlan) {
          costOfService = customPlan.costOfService;
        } else {
          costOfService = 0;
        }
        break;
    }
    setFormFields((prevFields) => ({ ...prevFields, costOfService }));
  };

  useEffect(() => {
    calculateServiceCost();
  });

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
              setSpecialNeeds={setSpecialNeeds}
              handleSubmit={handleFormSubmit}
              handleBack={() => setShowSpecialNeedsForm(false)}
            />
          ) : (
            <>
              <DrawerBody>
                <FormControl>
                  <Flex
                    ml={{ base: "20px", md: "40px" }}
                    flexWrap="wrap"
                    marginTop="20px"
                  >
                    <Box  color="#00000080" w={{ base: "300px", md: "270px" }}>
                      <FormLabel
                        color="#00000080"
                        fontFamily="body"
                        fontWeight="bold"
                      >
                        Service Plan{" "}
                      </FormLabel>
                      <Select
                        isRequired
                        name="servicePlan"
                        placeholder="preferred service plan"
                        w={{ base: "300px", md: "270px" }}
                        fontSize={{ base: "14px", md: "16px" }}
                        // style={{ border: "1px solid #B49C9C" }}
                        value={formFields.servicePlan}
                        onChange={handleInputChange}
                      >
                        <optgroup label="Standard Plans">
                          <option value="Elderly care by a Licensed Nurse">
                            Elderly care by a Licensed Nurse
                          </option>
                          <option value="Elderly care by a Nurse Assistant">
                            Elderly care by a Nurse Assistant
                          </option>
                          <option value="Postpartum care">
                            Postpartum care by a Licensed Nurse/Midwife
                          </option>
                          <option value="Nanny care">
                            Nanny service by a Professional Nanny
                          </option>
                          <option value="Recovery care">
                            Recovery care by a Licensed Nurse
                          </option>
                          <option value="Short home visit">
                            Short home visit by a Licensed Nurse
                          </option>
                        </optgroup>
                        <optgroup label="Custom Plans">
                          {customizedPlans.map((plan) => (
                            <option key={plan.id} value={plan.name}>
                              {plan.name}
                            </option>
                          ))}
                        </optgroup>
                      </Select>
                    </Box>
                    <Box color="#00000080" fontFamily="body" ml={{ md: "5px" }}>
                      <FormLabel fontWeight="bold">Shift </FormLabel>
                      <Select
                        isRequired
                        name="shift"
                        placeholder="select preferred shift"
                        w={{ base: "300px", md: "270px" }}
                        value={formFields.shift}
                        onChange={handleInputChange}
                        disabled={isShiftDisabled}
                      >
                        <option value="Day Shift (8hrs)">
                          Day Shift (8hrs)
                        </option>
                        <option value="Live-in (24hrs)">Live-in (24hrs)</option>
                      </Select>
                    </Box>
                  </Flex>

                  <Flex  color="#00000080" flexWrap="wrap" ml={{ base: "20px", md: "40px" }}>
                    <Box w={{ base: "300px", md: "270px" }}>
                      <FormLabel
                        fontFamily="body"
                        fontWeight="bold"
                        marginTop="20px"
                        color="#00000080"
                      >
                        Start Date
                      </FormLabel>
                      <Flex
                       color="#00000080"
                        h="6.5vh"
                        paddingTop="5px"
                        paddingLeft="15px"
                        style={{
                          border: "1px solid #ccc",
                          borderRadius: "5px",
                        }}
                      >
                        <DatePicker
                          isRequired
                          selected={selectedStartDate}
                          onChange={handleStartDateChange}
                          peekNextMonth
                          showMonthDropdown
                          showYearDropdown
                          dropdownMode="select"
                          dateFormat="dd-MM-yyyy"
                          placeholderText="preferred date to start"
                          className="form-control"
                          minDate={new Date()}
                          style={{
                            color: "#00000080",
                          }}
                        />
                      </Flex>
                    </Box>
                    <Box  color="#00000080" ml={{ md: "5px" }} marginTop="20px">
                      <FormLabel
                        color="#00000080"
                        fontWeight="bold"
                        fontFamily="body"
                      >
                        Preferred Medic Gender{" "}
                      </FormLabel>
                      <Select
                        isRequired
                        name="preferredMedicGender"
                        placeholder="select gender"
                        w={{ base: "300px", md: "270px" }}
                        fontSize={{ base: "14px", md: "16px" }}
                        value={formFields.preferredMedicGender}
                        onChange={handleInputChange}
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </Select>
                    </Box>
                  </Flex>

                  <Flex  color="#00000080" flexWrap="wrap" ml={{ base: "20px", md: "40px" }}>
                    <Box w={{ base: "300px", md: "270px" }} marginTop="20px">
                      <FormLabel
                        color="#00000080"
                        fontFamily="body"
                        fontWeight="bold"
                      >
                        City/Town{" "}
                      </FormLabel>
                      <Select
                        isRequired
                        name="recipientTown"
                        placeholder="select town"
                        w={{ base: "300px", md: "270px" }}
                        fontSize={{ base: "14px", md: "16px" }}
                        value={formFields.recipientTown}
                        onChange={handleInputChange}
                      >
                        {townsInLagos.map((town) => (
                          <option key={town} value={town}>
                            {town}
                          </option>
                        ))}
                      </Select>
                    </Box>
                    <Box ml={{ md: "5px" }} marginTop="20px">
                      <FormLabel
                        color="#00000080"
                        fontWeight="bold"
                        fontFamily="body"
                      >
                        Location{" "}
                      </FormLabel>
                      <Flex>
                        <Input
                          isRequired
                          name="currentLocation"
                          type="text"
                          placeholder="current Location"
                          value={formFields.currentLocation}
                          onChange={handleInputChange}
                          w={{ base: "300px", md: "270px" }}
                        />
                      </Flex>
                    </Box>
                  </Flex>

                  <Box  color="#00000080" ml={{ base: "20px", md: "40px" }} marginTop="20px">
                    <FormLabel
                      color="#00000080"
                      fontWeight="bold"
                      fontFamily="body"
                    >
                      Preferred Language{" "}
                    </FormLabel>
                    <Select
                      isRequired
                      name="preferredLanguage"
                      placeholder="select language"
                      w={{ base: "300px", md: "550px" }}
                      fontSize={{ base: "14px", md: "16px" }}
                      value={formFields.preferredLanguage}
                      onChange={handleInputChange}
                    >
                      {majorLanguages.map((language) => (
                        <option key={language} value={language}>
                          {language}
                        </option>
                      ))}
                    </Select>
                  </Box>

                  <Box  color="#00000080" ml={{ base: "20px", md: "40px" }} marginTop="20px">
                    <FormLabel
                      color="#00000080"
                      fontWeight="bold"
                      fontFamily="body"
                    >
                      Health History
                    </FormLabel>
                    <FormLabel
                      color="#00000080"
                      fontSize="14px"
                      fontFamily="body"
                    >
                      (Is there anything you'd like us to know?)
                    </FormLabel>
                    <Textarea
                      name="recipientHealthHistory"
                      type="text"
                      placeholder="share health history"
                      value={formFields.recipientHealthHistory}
                      onChange={handleInputChange}
                      w={{ base: "300px", md: "550px" }}
                    />
                  </Box>
                  <Box mb="20px" ml={{ base: "20px", md: "40px" }} mt="20px">
                    <Button
                      isLoading={loading}
                      loadingText="Loading..."
                      w="150px"
                      // bg="#A210C6"
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
