import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PaymentModal from "./PaymentMethod";
import BookingInstructions from "./BookingInstructions";
import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  FormControl,
  FormLabel,
  Button,
  Flex,
  Box,
  Select,
  Textarea,
  extendTheme,
} from "@chakra-ui/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SpecialNeedsForm from "./SpecialNeedsForm";
import AddressInput from "./AddressInput";
import { LoadScript } from '@react-google-maps/api';
import { FaLocationArrow } from 'react-icons/fa';

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

const libraries = ["places"];

const SelfAppointmentModal = ({ isOpen, onClose }) => {
  const { user } = useSelector((state) => state.userReducer);
  const [loading, setLoading] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [customizedPlans, setCustomizedPlans] = useState([]);
  const [selectedDob] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentData, setPaymentData] = useState({});
  const [priority, setPriority] = useState("");
  const [specialNeeds, setSpecialNeeds] = useState([]);
  const [showSpecialNeedsForm, setShowSpecialNeedsForm] = useState(false);
  const [isBookingInstructionsOpen, setIsBookingInstructionsOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState([]);
  const [senderAutoDetectLocation, setSenderAutoDetectLocation] = useState('');
  const [nearbyLocations, setNearbyLocations] = useState([]);
  const [error, setError] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [infoMessage, setInfoMessage] = useState('');
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

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

    setFormFields({ ...formFields, [name]: value });

    if (name === "servicePlan" || name === "shift") {
      calculateServiceCost({ ...formFields, [name]: value });
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

  const calculateServiceCost = (fields) => {
    const { servicePlan, shift } = fields;

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

  const getLocation = async () => {
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      const { latitude, longitude } = position.coords;
      fetchNearbyLocations(latitude, longitude);
    } catch (err) {
      setError('Unable to retrieve your location');
      console.error(err);
    }
  };

  const fetchNearbyLocations = async (latitude, longitude) => {
    try {
      const response = await axios.post(
        'https://places.googleapis.com/v1/places:searchNearby',
        {
          maxResultCount: 10,
          locationRestriction: {
            circle: {
              center: { latitude, longitude },
              radius: 1500.0,
            },
          },
        },
        {
          headers: {
            'X-Goog-Api-Key': 'AIzaSyAGHpgeiFAzUQqrosmbd2G531zmD9zgiI8',
            'X-Goog-FieldMask': 'places.displayName',
          },
        }
      );
      const places = response.data.places.map((place) => place.displayName.text);
      setNearbyLocations(places);
      setShowDropdown(true);
    } catch (error) {
      console.error('Error fetching nearby locations:', error);
    }
  };

  const fetchAddressLocation = useCallback(async (address) => {
    try {
      const response = await axios.post(
        'https://places.googleapis.com/v1/places:searchText',
        {
          textQuery: address,
        },
        {
          headers: {
            'X-Goog-Api-Key': 'AIzaSyAGHpgeiFAzUQqrosmbd2G531zmD9zgiI8',
            'X-Goog-FieldMask': '*',
          },
        }
      );
      if (response.data.places && response.data.places.length > 0) {
        const place = response.data.places[0];
        const location = place.location;
        const latitude = location.latitude;
        const longitude = location.longitude;
        fetchNearbyLocations(latitude, longitude);
      } else {
        console.error('No places found in the response.');
      }
    } catch (error) {
      console.error('Error fetching address location:', error);
    }
  }, []);

  const handleIconClick = () => {
    setInfoMessage('Select up to 3 locations that best describe where you are at.');
    getLocation();
  };

  const handleAddressSelect = async (address) => {
    setInfoMessage('Select up to 3 locations that best describe where you are at.');
    setSenderAutoDetectLocation(address);
  };

  useEffect(() => {
    if (senderAutoDetectLocation) {
      fetchAddressLocation(senderAutoDetectLocation);
    }
  }, [senderAutoDetectLocation, fetchAddressLocation]);

  const handleSelectLocation = (location) => {
    if (currentLocation.includes(location)) {
      setCurrentLocation(currentLocation.filter((loc) => loc !== location));
    } else if (currentLocation.length < 3) {
      setCurrentLocation([...currentLocation, location]);
    } else {
      setError('You can only select up to 3 locations');
    }
  };

  const handleClickOutside = (event) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target) &&
      inputRef.current &&
      !inputRef.current.contains(event.target)
    ) {
      setShowDropdown(false);
    }
  };
  
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

  const handleFormSubmit = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const apiUrl =
        //  `http://localhost:8080/v1/appointment/save`;
        "https://backend-c1pz.onrender.com/v1/appointment/save";

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const formatDateWithDayAdjustment = (selectedDate) =>
        formatDateToUTC(new Date(selectedStartDate));

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
    <LoadScript googleMapsApiKey="AIzaSyB6UPF9BxbH1xao_NwXjXe-BKBMLrPYsaQ" libraries={libraries}>
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
                    <Box w={{ base: "300px", md: "270px" }}>
                      <FormLabel fontFamily="body" fontWeight="bold">
                        Service Plan{" "}
                      </FormLabel>
                      <Select
                        isRequired
                        name="servicePlan"
                        placeholder="preferred service plan"
                        w={{ base: "300px", md: "270px" }}
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
                    <Box fontFamily="body" ml={{ md: "5px" }}>
                      <FormLabel fontWeight="bold">Shift </FormLabel>
                      <Select
                        isRequired
                        name="shift"
                        placeholder="select preferred shift"
                        w={{ base: "300px", md: "270px" }}
                        value={formFields.shift}
                        onChange={handleInputChange}
                      >
                        <option value="Day Shift (8hrs)">
                          Day Shift (8hrs)
                        </option>
                        <option value="Live-in (24hrs)">Live-in (24hrs)</option>
                      </Select>
                    </Box>
                  </Flex>

                  <Flex flexWrap="wrap" ml={{ base: "20px", md: "40px" }}>
                    <Box w={{ base: "300px", md: "270px" }} marginTop="20px">
                      <FormLabel
                        fontFamily="body"
                        fontWeight="bold"
                        marginTop="20px"
                      >
                        Start Date
                      </FormLabel>
                      <Flex
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
                        />
                      </Flex>
                    </Box>
                    <Box ml={{ md: "5px" }} marginTop="20px">
                      <FormLabel fontWeight="bold" fontFamily="body">
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

                  <Flex flexWrap="wrap" ml={{ base: "20px", md: "40px" }}>
                    <Box w={{ base: "300px", md: "270px" }} marginTop="20px">
                      <FormLabel fontFamily="body" fontWeight="bold">
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
                      <FormLabel fontWeight="bold" fontFamily="body">
                        Location{" "}
                      </FormLabel>
                      <Flex>
                        <div ref={inputRef} style={{ position: "relative" }}>
                          <div style={{ display: "flex", alignItems: "center" }}>
                            <FaLocationArrow
                              onClick={handleIconClick}
                              style={{
                                cursor: "pointer",
                                border: "solid 1px gray.500",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: "#D3D3D3",
                                width: "40px",
                                height: "35px",
                                marginRight: "4px",
                                borderRadius: "5px",
                              }}
                              title="Detect my Location"
                            />
                            <AddressInput
                              value={senderAutoDetectLocation}
                              onChange={handleAddressSelect}
                            />
                          </div>
                          {showDropdown && (
                            <div
                              ref={dropdownRef}
                              style={{
                                position: "absolute",
                                top: "100%",
                                left: "0",
                                width: "100%",
                                backgroundColor: "#fff",
                                zIndex: "1000",
                                maxHeight: "200px",
                                overflowY: "auto",
                                border: "1px solid #ccc",
                                borderRadius: "5px",
                              }}
                            >
                              <p style={{ color: "#666", marginBottom: "10px" }}>
                                {infoMessage}
                              </p>
                              <ul
                                style={{
                                  listStyleType: "none",
                                  margin: "0",
                                  padding: "0",
                                }}
                              >
                                {nearbyLocations.map((location, index) => (
                                  <li
                                    key={index}
                                    onClick={() => handleSelectLocation(location)}
                                    style={{
                                      padding: "10px",
                                      cursor: "pointer",
                                      backgroundColor: currentLocation.includes(
                                        location
                                      )
                                        ? "#d3d3d3"
                                        : "#fff",
                                    }}
                                  >
                                    {location}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {error && <p style={{ color: "red" }}>{error}</p>}
                        </div>
                      </Flex>
                    </Box>
                  </Flex>

                  <Box ml={{ base: "20px", md: "40px" }} marginTop="20px">
                    <FormLabel fontWeight="bold" fontFamily="body">
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

                  <Box ml={{ base: "20px", md: "40px" }} marginTop="20px">
                    <FormLabel fontWeight="bold" fontFamily="body">
                      Health History
                    </FormLabel>
                    <FormLabel fontSize="14px" fontFamily="body">
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
                      bg="#A210C6"
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
    </LoadScript>
  );
};

export default SelfAppointmentModal;
