import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import LocationIcon from "../../assets/LocationIcon.svg";
import CalenderIcon from "../../assets/CalenderIcon.svg";
import {
  InputGroup,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  DrawerCloseButton,
  useToast,
  Button,
  Input,
  Select,
  Image,
  Textarea,
  FormControl,
  FormLabel,
  Box,
  Flex,
} from "@chakra-ui/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const BookBeneficiaryAppointmentModal = ({
  isOpen,
  onClose,
  selectedBeneficiary,
}) => {
  const toast = useToast();
  const { user } = useSelector((state) => state.userReducer);
  const [loading, setLoading] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [customizedPlans, setCustomizedPlans] = useState([]);
  const navigate = useNavigate();
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
    endDate: null,
    relationship: selectedBeneficiary.relationship,
    costOfService: "",
  });

  const formatDateToUTC = (selectedDate) => {
    if (!selectedDate) return "";

    // Use isNaN to check if the selectedDate is a valid date object
    if (isNaN(new Date(selectedDate))) {
      console.error("Invalid date:", selectedDate);
      return "";
    }

    // Add one day to the selected date
    const adjustedDate = new Date(selectedDate);
    adjustedDate.setDate(adjustedDate.getDate() + 1);

    return adjustedDate.toISOString().split("T")[0];
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "servicePlan") {
      // Find the selected plan object
      const selectedPlan = customizedPlans.find((plan) => plan.name === value);

      console.log("Selected Plan:", selectedPlan);
      console.log(
        "Cost of Service:",
        selectedPlan ? selectedPlan.costOfService : "N/A"
      );

      // Set the shift and costOfService based on the selected plan
      if (selectedPlan) {
        setFormPages({
          ...formPages,
          [name]: value,
          shift: selectedPlan.shift,
          costOfService: parseFloat(selectedPlan.costOfService),
          medicSpecialization: selectedPlan.preferredCaregiver,
        });
      } else {
        setFormPages({ ...formPages, [name]: value });
      }
    } else {
      setFormPages({ ...formPages, [name]: value });
    }
  };

  const handleStartDateChange = (date) => {
    setSelectedStartDate(date);
    setFormPages({ ...formPages, startDate: date });
  };

  const handleEndDateChange = (date) => {
    setSelectedEndDate(date);
    setFormPages({ ...formPages, endDate: date });
  };

  const handleFormSubmit = async () => {
    setLoading(true);

    if (!validateStartDates()) {
      setLoading(false);
      return;
    }

    const fieldNameMappings = {
      shift: "Shift",
      servicePlan: "Service Plan",
      startDate: "Start Date",
      endDate: "End Date",
      currentLocation: "Current Location",
    };

    const requiredFields = [
      "shift",
      "servicePlan",
      "startDate",
      "endDate",
      "currentLocation",
    ];

    for (const fieldName of requiredFields) {
      if (!formPages[fieldName]) {
        setLoading(false);
        toast({
          title: `${fieldNameMappings[fieldName]} is required`,
          description: `Please fill in the ${fieldNameMappings[fieldName]} field.`,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }
    }

    try {
      const token = localStorage.getItem("token");
      // const apiUrl = "http://localhost:8080/v1/appointment/save";
      const apiUrl = "https://backend-c1pz.onrender.com/v1/appointment/save";
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const formatDateWithDayAdjustment = (selectedDate) =>
        formatDateToUTC(new Date(selectedDate));

      const formDataWithDates = {
        ...formPages,
        startDate: formatDateWithDayAdjustment(formPages.startDate),
        endDate: formatDateWithDayAdjustment(formPages.endDate),
        customerPhoneNumber: user.phoneNumber,
      };

      const requestBody = JSON.stringify(formDataWithDates);

      const response = await axios.post(apiUrl, requestBody, { headers });

      if (response.data.success) {
        setLoading(false);

        toast({
          title: "Appointment Saved",
          status: "success",
          duration: 6000,
        });
        const {
          id: appointmentId,
          costOfService,
          recipientFirstname,
          recipientLastname,
        } = response.data.data;
        const beneficiary = `${recipientFirstname} ${recipientLastname}`;
        console.log("beneficiary", beneficiary);
        setTimeout(() => {
          navigate("/make-payment", {
            state: { costOfService, appointmentId, beneficiary },
          });
        }, 1000);
      } else {
        setLoading(false);

        console.error("Error booking appointment");
        const errorMessage = response.data
          ? response.data.message
          : "Unknown error";
        toast({
          title: "Booking failed",
          description: errorMessage,
          status: "error",
          duration: 6000,
        });
      }
    } catch (error) {
      setLoading(false);
      console.error("An error occurred:", error);
      toast({
        title: "Error booking appointment",
        description: error.response?.data?.message || "Unknown error",
        status: "error",
        duration: 6000,
      });
    }
  };

  const validateStartDates = () => {
    if (!formPages.startDate || !formPages.endDate) {
      toast({
        title: "Appointment Dates Required",
        description: "Please select both start and end dates.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return false;
    }
    return true;
  };
  // const validateNigerianPhoneNumber = (phoneNumber) => {
  //   // Regular expression to match Nigerian phone numbers
  //   const nigerianPhoneNumberRegex = /^(?:\+234|234)([789]\d{9})$/;
  //   return nigerianPhoneNumberRegex.test(phoneNumber);
  // };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        };

        const response = await axios.get(
          // "http://localhost:8080/v1/appointment/all-customized-services",
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
    // Set initial form values based on the selected beneficiary
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
        endDate: null,

        relationship: selectedBeneficiary.relationship || "",
      });
    }
  }, [selectedBeneficiary]);

  const calculateServiceCost = () => {
    const { servicePlan, shift } = formPages;

    let costOfService = 0;

    switch (servicePlan) {
      case "Elderly care by a Licensed Nurse":
        costOfService = shift === "Day Shift (8hrs)" ? 18000000 : 22000000;
        break;
      case "Elderly care by a Nurse Assistant":
        costOfService = shift === "Day Shift (8hrs)" ? 12000000 : 15000000;
        break;
      case "Postpartum care":
      case "Recovery care":
        costOfService = shift === "Day Shift (8hrs)" ? 20000000 : 25000000;
        break;
      case "Nanny care":
        costOfService = shift === "Day Shift (8hrs)" ? 7000000 : 9000000;
        break;
      case "Short home visit":
        costOfService = 1500000;
        break;
      default:
        const customPlan = customizedPlans.find(
          (plan) => plan.name === servicePlan
        );
        if (customPlan) {
          // Adding two decimal places to costOfService for custom plans
          costOfService = parseInt(
            customPlan.costOfService.replace(/[,]/g, "")
          );
        } else {
          costOfService = 0;
        }
        break;
    }

    setFormPages({ ...formPages, costOfService });
  };

  useEffect(() => {
    calculateServiceCost();
  }, [formPages.servicePlan, formPages.shift]);

  return (
    <Drawer isOpen={isOpen} onClose={onClose} size={{ base: "md", md: "lg" }}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader color="#510863">
          {" "}
          Book Appointment for{" "}
          {`${selectedBeneficiary.recipientFirstName || ""} ${
            selectedBeneficiary.recipientLastName || ""
          }`}
        </DrawerHeader>
        <DrawerCloseButton />
        <DrawerBody>
          <FormControl isRequired>
            <Box>
              <Flex flexWrap="wrap">
                <Box ml={{ md: "40px" }}>
                  <FormLabel fontWeight="bold" marginTop="20px">
                    Service Plan{" "}
                  </FormLabel>
                  <Select
                    name="servicePlan"
                    placeholder="preferred service plan"
                    w={{ base: "300px", md: "270px" }}
                    value={formPages.servicePlan}
                    onChange={handleInputChange}
                  >
                    {/* Predefined options */}
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
                    {/* Customized plans */}
                    {customizedPlans.map((plan) => (
                      <option key={plan.id} value={plan.name}>
                        {plan.name}
                      </option>
                    ))}
                  </Select>
                </Box>

                <Box marginLeft="5px">
                  <FormLabel fontWeight="bold" marginTop="20px">
                    Shift{" "}
                  </FormLabel>
                  <Select
                    name="shift"
                    placeholder="select preferred shift"
                    w={{ base: "300px", md: "270px" }}
                    value={formPages.shift}
                    onChange={handleInputChange}
                  >
                    <option value="Day Shift (8hrs)">Day Shift (8hrs)</option>

                    <option value="Live-in (24hrs)">Live-in (24hrs)</option>
                  </Select>
                </Box>
              </Flex>
              <Flex flexWrap="wrap" ml={{ md: "40px" }}>
                <Box w={{ base: "300px", md: "270px" }}>
                  <FormLabel fontWeight="bold" marginTop="20px">
                    Start Date
                  </FormLabel>
                  <Flex
                    h="6vh"
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
                    <Image
                      ml={{ base: "50px", md: "30px" }}
                      w="24px"
                      h="24px"
                      src={CalenderIcon}
                      alt="CalenderIcon"
                    />
                  </Flex>
                </Box>
                <Box w={{ base: "297px", md: "270px" }} marginLeft="5px">
                  <FormLabel fontWeight="bold" marginTop="20px">
                    End Date
                  </FormLabel>
                  <Flex
                    h="6vh"
                    padding="5px"
                    paddingLeft="15px"
                    style={{ border: "1px solid #ccc", borderRadius: "5px" }}
                  >
                    <DatePicker
                      selected={selectedEndDate}
                      onChange={handleEndDateChange}
                      peekNextMonth
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      dateFormat="dd-MM-yyyy"
                      placeholderText="preferred date to end"
                      className="form-control"
                      minDate={new Date()}
                      style={{ border: "none" }}
                    />
                    <Image
                      ml={{base: "50px", md: "30px"}}
                      w="24px"
                      h="24px"
                      src={CalenderIcon}
                      alt="CalenderIcon"
                    />
                  </Flex>
                </Box>
              </Flex>

              <Box ml={{ md: "40px" }}>
                <FormLabel fontWeight="bold" marginTop="20px">
                  Current Location{" "}
                </FormLabel>

                <Flex>
                  <Input
                    name="currentLocation"
                    type="text"
                    placeholder="current Location"
                    value={formPages.currentLocation}
                    onChange={handleInputChange}
                    w={{ base: "300px", md: "550px" }}
                  />
                  <Image
                    marginTop="10px"
                    marginLeft="-35px"
                    w="24px"
                    h="24px"
                    src={LocationIcon}
                    alt="LocationIcon"
                  />
                </Flex>
              </Box>

              <Box ml={{ md: "40px" }}>
                <FormLabel fontWeight="bold" marginTop="20px">
                  Upload necessary document (test results, medical report,
                  scans, etc)
                </FormLabel>
                <InputGroup>
                  <Input
                    padding="5px"
                    name="medicalReport"
                    type="file"
                    onChange={handleInputChange}
                    w={{ base: "300px", md: "550px" }}
                    placeholder="Upload necessary document"
                  />
                  {/* <InputRightElement
                    pointerEvents="none"
                    children={<FaFile color="gray.300" />}
                  /> */}
                </InputGroup>
              </Box>
              <Box ml={{ md: "40px" }}>
                <FormLabel fontWeight="bold" marginTop="20px">
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
            </Box>
          </FormControl>
        </DrawerBody>
        <DrawerFooter>
          <Button
            w="150px"
            isLoading={loading}
            loadingText="Processing..."
            bg="#510863"
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
  );
};

export default BookBeneficiaryAppointmentModal;
