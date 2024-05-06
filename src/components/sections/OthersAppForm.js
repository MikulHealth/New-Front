import axios from "axios";
import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import LocationIcon from "../../assets/LocationIcon.svg";
// import CalenderIcon from "../../assets/CalenderIcon.svg";
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
  // Image,
  FormControl,
  FormLabel,
  InputGroup,
  InputRightElement,
  Input,
  Button,
  Flex,
  Box,
  Select,
  // useToast,
  Switch,
  Text,
  Textarea,
} from "@chakra-ui/react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



const BeneficiaryAppointmentModal = ({ isOpen, onClose }) => {
  // const toast = useToast();
  const { user } = useSelector((state) => state.userReducer);
  const [loading, setLoading] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedDob, setSelectedDob] = useState(null);
  const [customizedPlans, setCustomizedPlans] = useState([]);
  const [addToBeneficiaryList, setAddToBeneficiaryList] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentData, setPaymentData] = useState({});
  const [shiftDisabled, setShiftDisabled] = useState(false);


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
  });

  // const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
  
    if (name === "servicePlan") {
      const selectedPlan = customizedPlans.find(plan => plan.name === value);
  
      if (selectedPlan) {
        setFormFields({
          ...formFields,
          [name]: value,
          shift: selectedPlan.shift,
          costOfService: parseInt(selectedPlan.costOfService.replace(/[,]/g, "")),
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
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        };

        const response = await axios.get(
          "http://localhost:8080/v1/appointment/all-customized-services",
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

  const handleStartDateChange = (date) => {
    setSelectedStartDate(date);
    setFormFields({ ...formFields, startDate: date });
  };

  const handleDOBChange = (date) => {
    setSelectedDob(date);
    setFormFields({ ...formFields, recipientDOB: date });
  };

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

      const formDataWithDates = {
        ...formFields,
        startDate: formatDateWithDayAdjustment(formFields.startDate),
         recipientDOB: formatDateWithDayAdjustment(formFields.recipientDOB),
        customerPhoneNumber: user?.phoneNumber,
        customerId: user?.id,
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
        const errorMessage = response.data
          ? response.data.message
          : "Unknown error";
          toast.error(errorMessage.message);
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

  const handleSwitchChange = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      // const apiUrl = "http://localhost:8080/v1/appointment/addNewBeneficiary";
      const apiUrl ="https://backend-c1pz.onrender.com/v1/appointment/addNewBeneficiary";
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
      <Drawer isOpen={isOpen} onClose={onClose} size={{ base: "md", md: "lg" }}>
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
          <DrawerHeader color="#510863">Book Appointment</DrawerHeader>
          <DrawerBody>
            <FormControl ml={{ base: "25px", md: "0" }} w={{base: "100%", md: ""}}>
              {/* <Box> */}
              <FormLabel fontWeight="bold">Enter Beneficiary details</FormLabel>
              <Flex display={{ base: "block", md: "flex" }}>
                <InputGroup>
                  <Input
                    name="recipientFirstname"
                    placeholder="first name"
                    value={formFields.recipientFirstname}
                    onChange={handleInputChange}
                    w={{ base: "300px", md: "270px" }}
                  />
                  {/* <InputRightElement pointerEvents="none">
                    <FaUser color="gray.300" />
                  </InputRightElement> */}
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
                  {/* <InputRightElement pointerEvents="none">
                    <FaUser color="gray.300" />
                  </InputRightElement> */}
                </InputGroup>
              </Flex>
              <Flex flexWrap="wrap">
                <Box>
                  <FormLabel fontWeight="bold" marginTop="20px">
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
                <Box ml={{ md: "5px" }} w={{ base: "300px", md: "270px" }}>
                  <FormLabel fontWeight="bold" marginTop="20px">
                    Date of Birth
                  </FormLabel>
                  <Flex
                    h="6vh"
                    padding="5px"
                    paddingLeft="15px"
                    style={{ border: "1px solid #ccc", borderRadius: "5px" }}
                  >
                    {" "}
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
                    {/* <Image
                      marginLeft="30px"
                      w="24px"
                      h="24px"
                      src={CalenderIcon}
                      alt="CalenderIcon"
                    /> */}
                  </Flex>
                </Box>
              </Flex>
              <Flex flexWrap="wrap" marginTop="1px">
                <Box>
                  <FormLabel fontWeight="bold" marginTop="20px">
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
                  <FormLabel fontWeight="bold" marginTop="20px">
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
              <Flex flexWrap="wrap" ml={{ md: "5px" }}>
                <Box w={{ base: "300px", md: "550px" }}>
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
                    {/* <Image
                      marginLeft="30px"
                      w="24px"
                      h="24px"
                      src={CalenderIcon}
                      alt="CalenderIcon"
                    /> */}
                  </Flex>
                </Box>
              
                  </Flex>
                
              <Flex flexWrap="wrap">
                <Box ml={{ md: "5px" }}>
                  <FormLabel fontWeight="bold" marginTop="20px">
                    Service Plan{" "}
                  </FormLabel>
                  <Select
                    name="servicePlan"
                    placeholder="preferred service plan"
                    w={{ base: "300px", md: "270px" }}
                    value={formFields.servicePlan}
                    onChange={handleInputChange}
                  >
                    <option
                      value="Elderly care by a Licensed Nurse"
                      style={{ marginTop: "5px" }}
                    >
                      Elderly care by a Licensed Nurse
                    </option>
                    <option
                      value="Elderly care by a Nurse Assistant"
                      style={{ marginTop: "5px" }}
                    >
                      Elderly care by a Nurse Assistant
                    </option>
                    <option
                      value="Postpartum care"
                      style={{ marginTop: "5px" }}
                    >
                      Postpartum care by a Licensed Nurse/Midwife
                    </option>
                    <option value="Nanny care" style={{ marginTop: "5px" }}>
                      Nanny service by a Professional Nanny
                    </option>
                    <option value="Recovery care" style={{ marginTop: "5px" }}>
                      Recovery care by a Licensed Nurse
                    </option>
                    <option
                      value="Short home visit"
                      style={{ marginTop: "5px" }}
                    >
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
                  <FormLabel fontWeight="bold" marginTop="20px">
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

              <Box ml={{ md: "5px" }}>
                <FormLabel fontWeight="bold" marginTop="20px">
                  Current Location{" "}
                </FormLabel>
                <Flex>
                  <Input
                    name="currentLocation"
                    type="text"
                    placeholder="current Location"
                    value={formFields.currentLocation}
                    onChange={handleInputChange}
                    w={{ base: "300px", md: "550px" }}
                  />
                  {/* <Image
                    marginTop="10px"
                    marginLeft="-35px"
                    w="24px"
                    h="24px"
                    src={LocationIcon}
                    alt="LocationIcon"
                  /> */}
                </Flex>
              </Box>
              <Box ml={{ md: "5px" }}>
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
                </InputGroup>
              </Box>
              <Box ml={{ md: "5px" }}>
                <FormLabel fontWeight="bold" marginTop="20px">
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
              {/* </Box> */}
            </FormControl>
            <Flex justify="right" marginTop="10px">
              <Text color="#A210C6" fontStyle="italic">
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
            mb={{base: "20px", md: "0"}}
              w="150px"
              borderRadius="100px"
              isLoading={loading}
              loadingText="Processing..."
              bg="#510863"
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

export default BeneficiaryAppointmentModal;
