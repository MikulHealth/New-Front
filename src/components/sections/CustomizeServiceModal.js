import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GetCurrentUser } from "../../apiCalls/UserApis";
import { useDispatch, useSelector } from "react-redux";
import { SetUser } from "../../redux/userSlice";
import axios from "axios";
import {
  Box,
  Flex,
  Text,
  VStack,
  Input,
  Button,
  useToast,
  Checkbox,
  FormControl,
  FormLabel,
  Select,
  Spacer,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  DrawerCloseButton,
  // extendTheme,
} from "@chakra-ui/react";

// const customTheme = extendTheme({
//   components: {
//     Link: {
//       baseStyle: {
//         _focus: {
//           boxShadow: "none",
//         },
//       },
//     },
//   },
//   fonts: {
//     body: "Montserrat, sans-serif",
//     heading: "Gill Sans MT, sans-serif",
//   },
// });

const CustomizePlanModal = ({ isOpen, onClose }) => {
  const [selectedServices, setSelectedServices] = useState([]);
  const [frequency, setFrequency] = useState("");
  const [duration, setDuration] = useState("");
  const [shift, setShift] = useState("");
  const [medicSpecialization, setMedicSpecialization] = useState("");
  const [name, setName] = useState("");
  const [costOfService] = useState(0);

  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const toast = useToast();
  const [setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.userReducer);

  const availableServices = [
    "Vital signs check",
    "Oral care",
    "Serving/feeding food",
    "Light body/muscle massage",
    "Hospice care",
    "Blood sugar monitoring",
    "Serving of medication",
    "Wound dressing/Wound care",
    "Bed bathing",
    "Serving of urinal/bedpan",
    "Catheter care",
    "Ostomy care",
    "Blood pressure & pulse monitoring",
    "Post-Operative Wound Care",
    "Episiotomy Care",
    "Health Education",
    "Physical & Emotional Support",
    "Sitz Bath",
    "Injection administration",
    "Health assessment",
    "Symptom management",
    "Patient education",
    "IV therapy",
    "Dressing changes",
  ];

  // const calculateCost = () => {
  //   let costPerDay = 0;

    
  //   if (medicSpecialization === "Nurse Assistant") {
  //     costPerDay = 6000;
  //   } else {
  //     costPerDay = 12000;
  //   }

   
  //   if (shift === "Day Shift") {
  //     costPerDay *= 1; 
  //   } else if (shift === "Live-in") {
  
  //     if (medicSpecialization === "Nurse Assistant") {
  //       costPerDay = 8000;
  //     } else {
  //       costPerDay = 16000;
  //     }
  //   }

   
  //   const totalCost = costPerDay * parseInt(duration);
  //   return totalCost.toLocaleString("en-NG", {
  //     minimumFractionDigits: 2,
  //     maximumFractionDigits: 2,
  //   }); 
  // };

  // useEffect(() => {
  //   const calculatedCost = calculateCost();
  //   setCostOfService(calculatedCost);
  // }, [duration, medicSpecialization]);

  const formattedCost = (cost) => {
    // Format the costOfService as naira with the last two zeros separated by a dot
    const formattedCost =
      "₦ " + cost.toLocaleString("en-NG", { maximumFractionDigits: 2 });

    return formattedCost;
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      if (localStorage.getItem("token")) {
        try {
          console.log("Calling GetCurrentUser API");
          const response = await GetCurrentUser();

          if (response.success) {
            console.log("API response:", response.data);
            dispatch(SetUser(response.data));
          } else {
            console.error("API request failed:", response.error);
          }
        } catch (error) {
          console.error("Error in GetCurrentUser API:", error);
        } finally {
          //   setLoading(false);
          //   setShowSkeleton(false);
        }
      } else {
        navigate("/login");
      }
    };

    fetchData();
  });

  const handleServiceToggle = (service) => {
    if (selectedServices.includes(service)) {
      setSelectedServices(selectedServices.filter((s) => s !== service));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const handleConfirmationModalOpen = () => {
    setIsConfirmationModalOpen(true);
  };

  const handleConfirmationModalClose = () => {
    setIsConfirmationModalOpen(false);
  };
  console.log("Response from Custom-plan", user?.phoneNumber);
  const handleSubmit = () => {
    // Retrieve the token from local storage
    const token = localStorage.getItem("token");

    // Create the request body
    const requestBody = {
      selectedServices: selectedServices,
      frequency: frequency,
      duration: duration,
      shift: shift,
      medicSpecialization: medicSpecialization,
      costOfService: costOfService,
      name: name,
    };

    // Send the API request using Axios
    axios
      .post(
        // "http://localhost:8080/v1/appointment/save-customized-service",
        "https://backend-c1pz.onrender.com/v1/appointment/save-customized-service",
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
            // Include the authorization header with the token
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        // Handle the response data here
        console.log("Response data:", response.data);
        if (response.data.success) {
          // Display success toast
          toast({
            title: "Customized Plan Saved",
            status: "success",
            duration: 6000,
          });
          handleConfirmationModalClose();
          onClose();
          setTimeout(() => {
            navigate("/services");
          }, 2000);
        } else {
          // Display error toast
          toast({
            title: "Error",
            description: response.data.message,
            status: "error",
            duration: 6000,
          });
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        // Display error toast
        toast({
          title: "Error",
          description: "An error occurred while processing your request.",
          status: "error",
          duration: 6000,
        });
        // Optionally, handle errors and display error messages to the user
      });
  };

  return (
    <>
      <Drawer isOpen={isOpen} onClose={onClose} size="lg">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader color="#A210C6">Customize Your Care Plan</DrawerHeader>
          <DrawerBody>
            <Box p={2}>
              <FormControl mb={4}>
                <FormLabel fontWeight="bold">
                  Kindly select from the available services:
                </FormLabel>
                <VStack overflow="scroll" h="40vh" align="start">
                  {availableServices.map((service, index) => (
                    <Checkbox
                      key={index}
                      isChecked={selectedServices.includes(service)}
                      onChange={() => handleServiceToggle(service)}
                    >
                      {service}
                    </Checkbox>
                  ))}
                </VStack>
              </FormControl>
              <FormControl mb={4}>
                <FormLabel fontWeight="bold">Frequency:</FormLabel>
                <Select
                  placeholder="Select frequency"
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                >
                  <option value="daily">Daily</option>
                </Select>
              </FormControl>
              <FormControl mb={4}>
                <FormLabel fontWeight="bold">Shift: </FormLabel>
                <Select
                  name="shift"
                  placeholder="Select preferred shift"
                  value={shift}
                  onChange={(e) => setShift(e.target.value)}
                >
                  <option value="Day Shift (8hrs)">Day Shift (8hrs)</option>
                  <option value="Live-in (24hrs)">Live-in (24hrs)</option>
                </Select>
              </FormControl>
              <FormControl mb={4}>
                <FormLabel fontWeight="bold">
                  Duration in number(s): (daily)
                </FormLabel>
                <Input
                  placeholder="How many..."
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
              </FormControl>
              <FormControl mb={4}>
                <FormLabel fontWeight="bold">Preferred Caregiver:</FormLabel>
                <Select
                  placeholder="Select preferred caregiver"
                  value={medicSpecialization}
                  onChange={(e) => setMedicSpecialization(e.target.value)}
                >
                  <option value="Registered Nurse">Registered Nurse</option>
                  <option value="Registered Nurse/Midwife">
                    Registered Nurse/Midwife
                  </option>
                  <option value="Nurse Assistant">Nurse Assistant</option>
                </Select>
              </FormControl>
              <FormControl mb={4}>
                <FormLabel fontWeight="bold" marginTop="20px">
                  Name the plan{" "}
                </FormLabel>
                <Input
                  name="name"
                  type="text"
                  placeholder="give the your customized plan a name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </FormControl>
              <Flex>
                <Spacer />
                <Button
                  w="150px"
                  color="white"
                  borderRadius="100px"
                  bg="#A210C6"
                  onClick={handleConfirmationModalOpen}
                >
                  Submit
                </Button>
              </Flex>
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Confirmation Modal */}
      <Drawer
        isOpen={isConfirmationModalOpen}
        onClose={handleConfirmationModalClose}
        placement="right"
        size="lg"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader color="#A210C6">
            Confirm Your Customized Plan
          </DrawerHeader>
          <DrawerBody>
            <VStack overflow="scroll" h="40vh" align="start">
              <Text fontWeight="bold">Selected Services:</Text>
              {selectedServices.map((service, index) => (
                <Text key={index}>{service}</Text>
              ))}
            </VStack>
            <Flex marginTop="10px">
              <Text fontWeight="bold">Frequency:</Text>
              <Text marginLeft="5px"> {frequency}</Text>
            </Flex>
            <Flex>
              <Text fontWeight="bold">Duration:</Text>
              <Text marginLeft="5px"> {duration}</Text>
            </Flex>
            <Flex>
              <Text fontWeight="bold">Shift:</Text>
              <Text marginLeft="5px"> {shift}</Text>
            </Flex>
            <Flex>
              <Text fontWeight="bold">Preferred Caregiver:</Text>
              <Text marginLeft="5px"> {medicSpecialization}</Text>
            </Flex>
            <Flex>
              <Text fontWeight="bold">Cost of Service:</Text>
              <Text marginLeft="5px">{formattedCost(costOfService)}</Text>{" "}
            </Flex>
            <Flex>
              <Text fontWeight="bold">Name of service:</Text>
              <Text marginLeft="5px">{name}</Text>{" "}
            </Flex>
          </DrawerBody>
          <DrawerFooter>
            <Button
              borderRadius="100px"
              w="150px"
              color="white"
              bg="#A210C6"
              onClick={handleSubmit}
            >
              Create plan
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default CustomizePlanModal;
