import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import LocationIcon from "../../assets/LocationIcon.svg";
import CalenderIcon from "../../assets/CalenderIcon.svg";
import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  FormControl,
  FormLabel,
  Input,
  Button,
  Image,
  Flex,
  Box,
  Select,
  useToast,
  InputGroup,
  Textarea,
} from "@chakra-ui/react";
const SelfAppointmentModal = ({ isOpen, onClose }) => {
  const toast = useToast();
  const { user } = useSelector((state) => state.userReducer);
  const [loading, setLoading] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [customizedPlans, setCustomizedPlans] = useState([]);
  const [selectedDob] = useState(null);
  const [formFields, setFormFields] = useState({
    startDate: null,
    endDate: null,
    shift: "",
    servicePlan: "",
    currentLocation: "",
    medicalReport: "",
    recipientHealthHistory: "",
    costOfService: "",
  });

  const navigate = useNavigate();

  const formatDateToUTC = (selectedDate) => {
    if (!selectedDate) return "";

    // Add one day to the selected date
    const adjustedDate = new Date(selectedDate);
    adjustedDate.setDate(adjustedDate.getDate() + 1);

    return adjustedDate.toISOString().split("T")[0];
  };

  const handleStartDateChange = (date) => {
    setSelectedStartDate(date);
    setFormFields({ ...formFields, startDate: date });
  };

  const handleEndDateChange = (date) => {
    setSelectedEndDate(date);
    setFormFields({ ...formFields, endDate: date });
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

      if (selectedPlan) {
        setFormFields({
          ...formFields,
          [name]: value,
          shift: selectedPlan.shift,
          costOfService: parseFloat(selectedPlan.costOfService),
          medicSpecialization: selectedPlan.preferredCaregiver,
        });
      } else {
        setFormFields({ ...formFields, [name]: value });
      }
    } else {
      setFormFields({ ...formFields, [name]: value });
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

  const handleFormSubmit = async () => {
    setLoading(true);

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
        endDate: formatDateWithDayAdjustment(selectedEndDate),
        recipientDOB: formatDateWithDayAdjustment(selectedDob),
        customerPhoneNumber: user?.phoneNumber,
        customerId: user?.id,

        ...userFieldsForBookForSelf,
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

  // const validateForm = () => {
  //   if (
  //     !formFields.startDate ||
  //     !formFields.endDate ||
  //     !formFields.shift ||
  //     !formFields.servicePlan ||
  //     !formFields.currentLocation ||
  //     !formFields.medicSpecialization ||
  //     !formFields.recipientHealthHistory
  //   ) {
  //     toast({
  //       title: "Please fill all required fields",
  //       status: "error",
  //       duration: 3000,
  //       isClosable: true,
  //     });
  //     return false;
  //   }
  //   return true;
  // };

  const calculateServiceCost = () => {
    const { servicePlan, shift } = formFields;

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

    setFormFields({ ...formFields, costOfService });
  };

  useEffect(() => {
    calculateServiceCost();
  });

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      size={{ base: "md", md: "lg" }}
      placement="right"
    >
      <DrawerOverlay />
      <DrawerContent alignItems="center">
        <DrawerCloseButton />
        <DrawerHeader color="#510863">Book Appointment</DrawerHeader>
        <DrawerBody>
          <FormControl isRequired>
            <Flex flexWrap="wrap" ml={{ md: "45px" }}>
              <Box w={{ base: "300px", md: "270px" }}>
                <FormLabel fontWeight="bold" marginTop="20px">
                  Start Date
                </FormLabel>
                <Flex
                  h="6vh"
                  paddingTop="5px"
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
              <Box
                w={{ base: "300px", md: "270px" }}
                ml={{ md: "5px" }}
                marginTop="20px"
              >
                <FormLabel fontWeight="bold">End Date</FormLabel>
                <Flex
                  h="6vh"
                  paddingTop="5px"
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
                    ml={{ base: "50px", md: "30px" }}
                    w="24px"
                    h="24px"
                    src={CalenderIcon}
                    alt="CalenderIcon"
                  />
                </Flex>
              </Box>
            </Flex>
            <Flex flexWrap="wrap" marginTop="20px">
              <Box w={{ base: "300px", md: "270px" }} ml={{ md: "40px" }}>
                <FormLabel fontWeight="bold">Service Plan </FormLabel>
                <Select
                  name="servicePlan"
                  placeholder="preferred service plan"
                  w={{ base: "300px", md: "270px" }}
                  value={formFields.servicePlan}
                  onChange={handleInputChange}
                >
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
                  {customizedPlans.map((plan) => (
                    <option key={plan.id} value={plan.name}>
                      {plan.name}
                    </option>
                  ))}
                </Select>
              </Box>
              <Box ml={{ md: "5px" }}>
                <FormLabel fontWeight="bold">Shift </FormLabel>
                <Select
                  name="shift"
                  placeholder="select preferred shift"
                  w={{ base: "300px", md: "270px" }}
                  value={formFields.shift}
                  onChange={handleInputChange}
                >
                  <option value="Day Shift (8hrs)">Day Shift (8hrs)</option>
                  <option value="Live-in (24hrs)">Live-in (24hrs)</option>
                </Select>
              </Box>
            </Flex>
            <Box ml={{ md: "40px" }} marginTop="20px">
              <FormLabel fontWeight="bold">Current Location </FormLabel>
              <Flex>
                <Input
                  name="currentLocation"
                  type="text"
                  placeholder="current Location"
                  value={formFields.currentLocation}
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
            <Box ml={{ md: "40px" }} marginTop="20px">
              <FormLabel fontWeight="bold">
                Upload necessary document (test results, medical report, scans,
                etc)
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
              </InputGroup>
            </Box>
            <Box ml={{ md: "40px" }} marginTop="20px">
              <FormLabel fontWeight="bold">Health History </FormLabel>
              <Textarea
                name="recipientHealthHistory"
                type="text"
                placeholder="share health history and any special need we should know"
                value={formFields.recipientHealthHistory}
                onChange={handleInputChange}
                w={{ base: "300px", md: "550px" }}
              />
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

export default SelfAppointmentModal;
