import axios from "axios";
import { useSelector } from "react-redux";
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { WarningIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import { FaPhoneAlt } from "react-icons/fa";
import PaymentModal from "./PaymentMethod";
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
  InputGroup,
  InputRightElement,
  Input,
  Button,
  Flex,
  Box,
  Select,
  Switch,
  Text,
  Textarea,
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

const OthersAppointmentModal = ({ isOpen, onClose }) => {
  const { user } = useSelector((state) => state.userReducer);
  const [loading, setLoading] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedDob, setSelectedDob] = useState(null);
  const [customizedPlans, setCustomizedPlans] = useState([]);
  const [addToBeneficiaryList, setAddToBeneficiaryList] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentData, setPaymentData] = useState({});
  const [shiftDisabled, setShiftDisabled] = useState(false);
  const [priority, setPriority] = useState("");

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
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "servicePlan") {
      const selectedPlan = customizedPlans.find(plan => plan.name === value);

      if (selectedPlan) {
        setFormFields({
          ...formFields,
          [name]: value,
          shift: selectedPlan.shift,
          costOfService: parseFloat(selectedPlan.costOfService.replace(/[,]/g, "")),
          medicSpecialization: selectedPlan.preferredCaregiver,
        });
        setShiftDisabled(true);  // Disable shift selection because it's a customized plan
      } else {
        setFormFields({ ...formFields, [name]: value, shift: '' });
        setShiftDisabled(false);  // Enable shift selection for non-customized plans
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

  const handleStartDateChange = (date) => {
    setSelectedStartDate(date);
    setFormFields({ ...formFields, startDate: date });
    calculateUrgency(date);
  };

  const handleDOBChange = (date) => {
    setSelectedDob(date);
    setFormFields({ ...formFields, recipientDOB: date });
  };

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

  const handleFormSubmit = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const apiUrl = "https://backend-c1pz.onrender.com/v1/appointment/save";
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
        customerPhoneNumber: user?.phoneNumber,
        customerId: user?.id,
        priority,
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
        });
        toast.success("Appointment saved");
        setPaymentData({
          costOfService: response.data.data.costOfService,
          appointmentId: response.data.data.id,
          beneficiary: `${response.data.data.recipientFirstname} ${response.data.data.recipientLastname}`,
        });
        setTimeout(() => {
          setIsPaymentModalOpen(true);
        }, 1000);
      } else {
        setLoading(false);
        console.error("Error booking appointment");
        const errorMessage = response.data ? response.data.message : "Unknown error";
        toast.error(errorMessage);
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

    setFormFields({ ...formFields, costOfService });
  };

  useEffect(() => {
    calculateServiceCost();
  });

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

  const handleSwitchChange = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const apiUrl = "https://backend-c1pz.onrender.com/v1/appointment/addNewBeneficiary";
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const formatDateWithDayAdjustment = (selectedDate) =>
        formatDateToUTC(new Date(selectedDate));

      const formDataWithDates = {
        ...formFields,
        recipientDOB: formatDateWithDayAdjustment(formFields.recipientDOB),
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
        const errorMessage = response.data ? response.data.message : "Unknown error";
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
        <DrawerContent alignItems="center">
          <DrawerCloseButton />
          <DrawerHeader color="#A210C6" fontFamily="heading">Book Appointment</DrawerHeader>
          <Text p="40px" pt="5px">
            <WarningIcon fontFamily="body" mb="5px" w={10} h={10} color="yellow.400" />
            <br /> Please note, all the services listed under <strong>
              Service Plan
            </strong>{" "}
            are for monthly subscription with 24hrs shift or 8hrs (day) shift,
            and they expire after one month of start of care. With the exception of short home visit and any custom
            plan. You can create a
            custom plan here{" "}
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
          <DrawerBody>
            <FormControl ml={{ base: "25px", md: "0" }} w={{base: "80%", md: "100%"}}>
              <FormLabel fontWeight="bold" fontFamily="heading">Enter Beneficiary details</FormLabel>
              <Flex display={{ base: "block", md: "flex" }}>
                <InputGroup>
                  <Input
                    name="recipientFirstname"
                    placeholder="first name"
                    value={formFields.recipientFirstname}
                    onChange={handleInputChange}
                    w={{ base: "300px", md: "270px" }}
                  />
                </InputGroup>
                <InputGroup mt={{ base: "20px", md: "0" }} ml={{ md: "40px" }}>
                  <Input
                    name="recipientLastname"
                    ml={{ md: "-35px" }}
                    placeholder="last name"
                    value={formFields.recipientLastname}
                    onChange={handleInputChange}
                    w={{ base: "300px", md: "270px" }}
                  />
                </InputGroup>
              </Flex>
              <Flex flexWrap="wrap">
                <Box>
                  <FormLabel fontFamily="body" fontWeight="bold" marginTop="20px">
                    Gender{" "}
                  </FormLabel>
                  <Select
                    name="recipientGender"
                    placeholder="select gender"
                    w={{ base: "300px", md: "270px" }}
                    value={formFields.recipientGender}
                    onChange={handleInputChange}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </Select>
                </Box>
                <Box fontFamily="body" ml={{ md: "5px" }} w={{ base: "300px", md: "270px" }}>
                  <FormLabel fontWeight="bold" marginTop="20px">
                    Date of Birth
                  </FormLabel>
                  <Flex
                    h="5vh"
                    padding="5px"
                    paddingLeft="15px"
                    style={{ border: "1px solid #ccc", borderRadius: "5px" }}
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
              <Flex flexWrap="wrap" marginTop="1px">
                <Box>
                  <FormLabel fontFamily="body" fontWeight="bold" marginTop="20px">
                    Contact Number{" "}
                  </FormLabel>
                  <InputGroup>
                    <Input
                      name="recipientPhoneNumber"
                      type="tel"
                      placeholder="recipient phone number"
                      value={formFields.recipientPhoneNumber}
                      onChange={handleInputChange}
                      w={{ base: "300px", md: "270px" }}
                    />
                    <InputRightElement pointerEvents="none">
                      <FaPhoneAlt color="gray.300" />
                    </InputRightElement>
                  </InputGroup>
                </Box>
                <Box ml={{ md: "5px" }}>
                  <FormLabel fontFamily="body" fontWeight="bold" marginTop="20px">
                    Relationship with beneficiary{" "}
                  </FormLabel>
                  <Select
                    name="relationship"
                    placeholder="Select the appropriate relationship type"
                    w={{ base: "300px", md: "270px" }}
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
              <Flex flexWrap="wrap">
                <Box ml={{ md: "5px" }}>
                  <FormLabel fontFamily="body" fontWeight="bold" marginTop="20px">
                    Service Plan{" "}
                  </FormLabel>
                  <Select
                    isRequired
                    name="servicePlan"
                    placeholder="preferred service plan"
                    w={{ base: "200px", md: "270px" }}
                    fontSize={{ base: "14px", md: "16px" }}
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

                <Box ml={{ md: "5px" }}>
                  <FormLabel fontFamily="body" fontWeight="bold" marginTop="20px">
                    Shift{" "}
                  </FormLabel>
                  <Select
                    name="shift"
                    placeholder="select preferred shift"
                    w={{ base: "300px", md: "270px" }}
                    value={formFields.shift}
                    onChange={handleInputChange}
                    disabled={shiftDisabled}
                  >
                    <option value="Day Shift (8hrs)">Day Shift (8hrs)</option>
                    <option value="Live-in (24hrs)">Live-in (24hrs)</option>
                  </Select>
                </Box>
              </Flex>
              <Flex flexWrap="wrap" ml={{ md: "5px" }}>
                <Box fontFamily="body" w={{ base: "300px", md: "270px" }}>
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
                      value={formFields.currentLocation}
                      onChange={handleInputChange}
                      w={{ base: "300px", md: "270px" }}
                    />
                  </Flex>
                </Box>
              </Flex>
              <Box ml={{ md: "5px" }}>
                <FormLabel fontFamily="body" fontWeight="bold" marginTop="20px">
                  Health History{" "}
                </FormLabel>
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
          <DrawerFooter>
            <Button
              mb={{ base: "20px", md: "0" }}
              w="150px"
              borderRadius="100px"
              isLoading={loading}
              loadingText="Processing..."
              bg="#A210C6"
              color="white"
              onClick={handleFormSubmit}
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

export default OthersAppointmentModal;
