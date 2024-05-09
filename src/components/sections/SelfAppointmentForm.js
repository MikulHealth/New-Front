import axios from "axios";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import LocationIcon from "../../assets/LocationIcon.svg";
import { WarningIcon } from "@chakra-ui/icons";
// import CalenderIcon from "../../assets/CalenderIcon.svg";
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
  Input,
  Button,
  Flex,
  Box,
  Select,
  Text,
  InputGroup,
  Textarea,
} from "@chakra-ui/react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SelfAppointmentModal = ({ isOpen, onClose }) => {
  // const toast = useToast();
  const { user } = useSelector((state) => state.userReducer);
  const [loading, setLoading] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [isShiftDisabled, setIsShiftDisabled] = useState(false);
  const [customizedPlans, setCustomizedPlans] = useState([]);
  const [selectedDob] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentData, setPaymentData] = useState({});

  const [formFields, setFormFields] = useState({
    startDate: null,
    shift: "",
    servicePlan: "",
    currentLocation: "",
    medicalReport: "",
    recipientHealthHistory: "",
    costOfService: "",
  });

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
  
    if (name === "servicePlan") {
      const selectedPlan = customizedPlans.find((plan) => plan.name === value);
  
      console.log("Selected Plan:", selectedPlan);
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
         recipientDOB: formatDateWithDayAdjustment(selectedDob),
        customerPhoneNumber: user?.phoneNumber,
        customerId: user?.id,

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
        console.error(response.data.message);
        toast.error(response.data.message);
      }
    } catch (error) {
      setLoading(false);
      console.error("An error occurred:", error);
      toast.error("Error bokking appointment");
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
    setFormFields(prevFields => ({ ...prevFields, costOfService }));
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
          <DrawerHeader color="#A210C6">Book Appointment</DrawerHeader>

          <Text p="40px" pt="5px">
            <WarningIcon mb="5px" w={10} h={10} color="yellow.400" />
            <br /> Please note, all the services listed under <strong>
              "Service Plan"
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
            >
              create plan
            </Link>
          </Text>

          <DrawerBody>
            <FormControl ml={{ base: "25px", md: "0" }}>
            <Flex flexWrap="wrap" marginTop="20px">
                <Box w={{ base: "300px", md: "270px" }} ml={{ md: "40px" }}>
                  <FormLabel fontWeight="bold">Service Plan </FormLabel>
                  <Select
                    isRequired
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
                    isRequired
                    name="shift"
                    placeholder="select preferred shift"
                    w={{ base: "300px", md: "270px" }}
                    value={formFields.shift}
                    onChange={handleInputChange}
                    disabled={isShiftDisabled}
                  >
                    <option value="Day Shift (8hrs)">Day Shift (8hrs)</option>
                    <option value="Live-in (24hrs)">Live-in (24hrs)</option>
                  </Select>
                </Box>
              </Flex>
            

              <Flex flexWrap="wrap" ml={{ md: "45px" }}>
                <Box  w={{ base: "300px", md: "270px" }}>
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
                    />
                    {/* <Image
                      ml={{ base: "50px", md: "30px" }}
                      w="24px"
                      h="24px"
                      src={CalenderIcon}
                      alt="CalenderIcon"
                    /> */}
                  </Flex>
                </Box>
                <Box ml={{ md: "5px" }} marginTop="20px">
                <FormLabel fontWeight="bold">Current Location </FormLabel>
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
              </Flex>
             
            
              <Box ml={{ md: "40px" }} marginTop="20px">
                <FormLabel fontWeight="bold">
                  Upload necessary document (test results, medical report,
                  scans, etc)
                </FormLabel>
                <InputGroup>
                  <Input
                    isRequired
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

export default SelfAppointmentModal;
