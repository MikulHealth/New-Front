import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import PaymentModal from "./PaymentMethod";
import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  DrawerCloseButton,
  Button,
  Input,
  Select,
  Textarea,
  FormControl,
  FormLabel,
  Text,
  Box,
  Flex,
  extendTheme,
} from "@chakra-ui/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { WarningIcon } from "@chakra-ui/icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";

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
  });

  const formatDateToUTC = (selectedDate) => {
    if (!selectedDate) return "";

    if (isNaN(new Date(selectedDate))) {
      console.error("Invalid date:", selectedDate);
      return "";
    }

    const adjustedDate = new Date(selectedDate);
    adjustedDate.setDate(adjustedDate.getDate() + 1);

    return adjustedDate.toISOString().split("T")[0];
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "servicePlan") {
      const selectedPlan = customizedPlans.find(plan => plan.name === value);

      if (selectedPlan) {
        setFormPages(prev => ({
          ...prev,
          [name]: value,
          shift: selectedPlan.shift,
          costOfService: parseFloat(selectedPlan.costOfService.replace(/[,]/g, "")),
          medicSpecialization: selectedPlan.preferredCaregiver,
        }));
        setIsShiftDisabled(true);
      } else {
        setFormPages(prev => ({
          ...prev,
          [name]: value,
          shift: '',
          costOfService: 0,
        }));
        setIsShiftDisabled(false);
      }
    } else {
      setFormPages(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleStartDateChange = (date) => {
    setSelectedStartDate(date);
    setFormPages({ ...formPages, startDate: date });
    calculateUrgency(date);
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
      const apiUrl = 
      "https://backend-c1pz.onrender.com/v1/appointment/save";
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
          "https://backend-c1pz.onrender.com/v1/appointment/all-customized-services",
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

  const calculateServiceCost = useCallback(() => {
    const { servicePlan, shift } = formPages;

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

    setFormPages((prevPages) => ({ ...prevPages, costOfService }));
  }, [formPages, customizedPlans]);

  useEffect(() => {
    calculateServiceCost();
  }, [calculateServiceCost]);

  return (
    <>
      <Drawer theme={customTheme} isOpen={isOpen} onClose={onClose} size={{ base: "md", md: "lg" }}>
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
            {`${selectedBeneficiary.recipientFirstName || ""} ${selectedBeneficiary.recipientLastName || ""}`}
          </DrawerHeader>
          <Text p="40px" pt="5px">
            <WarningIcon fontFamily="body" mb="5px" w={10} h={10} color="yellow.400" />
            <br /> Please note, all the services listed under <strong>Service Plan</strong>{" "}
            are for monthly subscription with 24hrs shift or 8hrs (day) shift,
            and they expire after one month of start of care. With the exception of short home visit and any custom
            plan. You can create a custom plan here{" "}
            <Link
              to="/customize-service"
              style={{
                color: "#A210C6",
                fontWeight: "bold",
                fontStyle: "italic",
              }}
              fontFamily="body"
            >
              create plan
            </Link>
          </Text>
          <DrawerCloseButton />
          <DrawerBody ml={{ base: "25px", md: "0" }}>
            <FormControl isRequired>
              <Box>
                <Flex flexWrap="wrap">
                  <Box ml={{ md: "40px" }}>
                    <FormLabel fontFamily="body" fontWeight="bold" marginTop="20px">
                      Service Plan{" "}
                    </FormLabel>
                    <Select
                      isRequired
                      name="servicePlan"
                      placeholder="preferred service plan"
                      w={{ base: "200px", md: "270px" }}
                      value={formPages.servicePlan}
                      onChange={handleInputChange}
                      fontSize={{ base: "14px", md: "16px" }}
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

                  <Box marginLeft="5px">
                    <FormLabel fontFamily="body" fontWeight="bold" marginTop="20px">
                      Shift{" "}
                    </FormLabel>
                    <Select
                      name="shift"
                      placeholder="select preferred shift"
                      w={{ base: "300px", md: "270px" }}
                      value={formPages.shift}
                      onChange={handleInputChange}
                      disabled={isShiftDisabled}
                    >
                      <option value="Day Shift (8hrs)">Day Shift (8hrs)</option>
                      <option value="Live-in (24hrs)">Live-in (24hrs)</option>
                    </Select>
                  </Box>
                </Flex>
                <Flex flexWrap="wrap" ml={{ md: "40px" }}>
                  <Box w={{ base: "300px", md: "270px" }}>
                    <FormLabel fontFamily="body" fontWeight="bold" marginTop="20px">
                      Start Date
                    </FormLabel>
                    <Flex
                      h="5vh"
                      padding="5px"
                      paddingLeft="15px"
                      style={{ border: "1px solid #ccc", borderRadius: "5px" }}
                    >
                      <DatePicker
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
                      />
                    </Flex>
                  </Box>
                  <Box ml={{ md: "5px" }}>
                    <FormLabel fontFamily="body" fontWeight="bold" marginTop="20px">
                      Current Location{" "}
                    </FormLabel>
                    <Flex>
                      <Input
                        name="currentLocation"
                        type="text"
                        placeholder="current Location"
                        value={formPages.currentLocation}
                        onChange={handleInputChange}
                        w={{ base: "300px", md: "270px" }}
                      />
                    </Flex>
                  </Box>
                </Flex>

                <Box ml={{ md: "40px" }}>
                  <FormLabel fontFamily="body" fontWeight="bold" marginTop="20px">
                    Health History{" "}
                  </FormLabel>
                  <Textarea
                    name="recipientHealthHistory"
                    type="text"
                    placeholder="share health history and any special need we should know"
                    value={formPages.recipientHealthHistory}
                    onChange={handleInputChange}
                    w={{ base: "300px", md: "550px" }}
                  />
                </Box>
                {/* <Box ml={{ md: "40px" }}>
                  <FormLabel fontFamily="body" fontWeight="bold" marginTop="20px">
                    Urgency{" "}
                  </FormLabel>
                  <Input
                    name="priority"
                    type="text"
                    placeholder="urgency level"
                    value={priority}
                    isReadOnly
                  />
                </Box> */}
              </Box>
            </FormControl>
          </DrawerBody>
          <DrawerFooter>
            <Button
              w="150px"
              isLoading={loading}
              loadingText="Processing..."
              bg="#A210C6"
              color="white"
              onClick={handleFormSubmit}
              borderRadius="100px"
              _hover={{ color: "" }}
            >
              {loading ? "Processing..." : "Submit"}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        paymentData={paymentData}
      />
    </>
  );
};

export default BookBeneficiaryAppointmentModal;
