// import React, { useState, useEffect } from "react";
// import {
//   Drawer,
//   DrawerBody,
//   DrawerFooter,
//   DrawerHeader,
//   DrawerOverlay,
//   DrawerContent,
//   DrawerCloseButton,
//   useToast,
//   Button,
//   extendTheme,
//   FormControl,
//   FormLabel,
//   Textarea,
//   Checkbox,
//   Input,
//   Flex,
// } from "@chakra-ui/react";
// import axios from "axios";
// import VitalsForm from "./VitalSignsForm";
// import MedicationForm from "./MedicationForm";
// import ActivitiesForm from "./ActivitiesForm";
// import ReviewForm from "./ReviewForm";
// import PostSubmissionInstructionsDrawer from "./PostSubmissionInstructionsDrawer";
// import { displayPostSubmissionInstructions } from "./instructions";
// import PatientSelector from "./PatientSelector";
// import RenderDocumentationContent from "./RenderDocumentationContent ";
// import CryptoJS from "crypto-js";

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

// const PatientReportDrawer = ({ isOpen, onClose }) => {
//   const [step, setStep] = useState(1);
//   const [patients, setPatients] = useState([]);
//   const [selectedPatient, setSelectedPatient] = useState("");

//   // Add a secret key for AES encryption
//   // const SECRET_KEY = process.env.REACT_APP_SECRET_KEY;
//   const SECRET_KEY = process.env.REACT_APP_SECRET_KEY;

//   // Debug: Check if SECRET_KEY is defined and valid
//   console.log("SECRET_KEY:", SECRET_KEY);

//   let keyBytes;
//   if (SECRET_KEY) {
//     keyBytes = CryptoJS.enc.Hex.parse(SECRET_KEY);
//     // Debug: Check the length of the parsed key
//     console.log("keyBytes.sigBytes:", keyBytes.sigBytes);
//   } else {
//     console.error("SECRET_KEY is not defined");
//   }

//   if (!SECRET_KEY || SECRET_KEY.length !== 64 || keyBytes.sigBytes !== 32) {
//     console.error("Secret key must be 32 bytes long for AES-256 encryption.");
//     // throw new Error("Invalid secret key length");
//   }

//   // Encrypt function
//   const encryptData = (data) => {
//     const stringData = JSON.stringify(data);
//     return CryptoJS.AES.encrypt(stringData, keyBytes).toString();
//   };

//   const [activities, setActivities] = useState([]);
//   const [patientId, setPatientId] = useState();
//   const toast = useToast();
//   const [medications, setMedications] = useState([
//     { name: "", dosage: "", route: "", time: new Date() },
//   ]);
//   const [formData, setFormData] = useState({
//     temperature: "",
//     bloodPressure: "",
//     pulse: "",
//     bloodSugar: "",
//     sp02: "",
//     respiration: "",
//     emotionalState: "",
//     physicalState: "",
//     spiritualState: "",
//     painLevel: "",
//     painLocation: "",
//     skinIntegrity: "",
//     appetite: "",
//     fluidIntake: "",
//     urinaryElimination: "",
//     bowelElimination: "",
//     sleepQuality: "",
//     comments: "",
//     recommendations: "",
//     picture: null,
//     confirmation: false,
//   });
//   const [vitalsOutOfRange, setVitalsOutOfRange] = useState({});
//   const [acknowledgedOutOfRange, setAcknowledgedOutOfRange] = useState(false);
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [instructions, setInstructions] = useState([]);
//   const [showDocumentation, setShowDocumentation] = useState(false);

//   useEffect(() => {
//     if (isOpen) {
//       fetchPatients();
//     }
//   }, [isOpen]);

//   const fetchPatients = async () => {
//     try {
//       const response = await axios.get(
//         "https://backend-c1pz.onrender.com/v1/appointment/active",
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );
//       if (response.data && Array.isArray(response.data.data)) {
//         setPatients(response.data.data);
//         const activePatient = response.data.data.find(
//           (patient) => patient.customerAppointment.appointmentActive
//         );
//         if (activePatient) {
//           setPatientId(activePatient.customerAppointment.id);
//           setSelectedPatient(activePatient.customerAppointment.id);
//         }
//       } else {
//         setPatients([]);
//       }
//     } catch (error) {
//       console.error("Error fetching patients:", error);
//       setPatients([]);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleFileChange = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       picture: e.target.files[0],
//     }));
//   };

//   const handleCheckboxChange = (e) => {
//     const { name, checked } = e.target;
//     if (checked) {
//       setActivities([...activities, name]);
//     } else {
//       setActivities(activities.filter((activity) => activity !== name));
//     }
//   };

//   const isFormComplete = () => {
//     const requiredFields = [
//       "temperature",
//       "bloodPressure",
//       "pulse",
//       "bloodSugar",
//       "sp02",
//       "respiration",
//       "emotionalState",
//       "physicalState",
//       "painLevel",
//       "painLocation",
//       "skinIntegrity",
//       "appetite",
//       "fluidIntake",
//       "urinaryElimination",
//       "bowelElimination",
//       "sleepQuality",
//       "comments",
//       "recommendations",
//     ];

//     const missingFields = requiredFields.filter((field) => !formData[field]);

//     if (missingFields.length > 0) {
//       toast({
//         title: "Incomplete Form",
//         description: `Please fill in all required fields: ${missingFields.join(
//           ", "
//         )}.`,
//         status: "error",
//         duration: 5000,
//         isClosable: true,
//         position: "top-right",
//       });
//       return false;
//     }

//     if (!selectedPatient) {
//       toast({
//         title: "Incomplete Form",
//         description: "Please select a patient.",
//         status: "error",
//         duration: 5000,
//         isClosable: true,
//         position: "top-right",
//       });
//       return false;
//     }

//     for (let med of medications) {
//       if (!med.name || !med.dosage || !med.route || !med.time) {
//         toast({
//           title: "Incomplete Form",
//           description: "Please fill in all medication details.",
//           status: "error",
//           duration: 5000,
//           isClosable: true,
//           position: "top-right",
//         });
//         return false;
//       }
//     }

//     if (activities.length === 0) {
//       toast({
//         title: "Incomplete Form",
//         description: "Please select at least one activity.",
//         status: "error",
//         duration: 5000,
//         isClosable: true,
//         position: "top-right",
//       });
//       return false;
//     }

//     if (!formData.confirmation) {
//       toast({
//         title: "Incomplete Form",
//         description:
//           "Please confirm that the information provided is accurate and complete.",
//         status: "error",
//         duration: 5000,
//         isClosable: true,
//         position: "top-right",
//       });
//       return false;
//     }

//     return true;
//   };

//   const handleMedicationChange = (index, field, value) => {
//     const newMedications = medications.slice();
//     newMedications[index][field] = value;
//     setMedications(newMedications);
//   };

//   const handleMedicationTimeChange = (index, time) => {
//     const newMedications = medications.slice();
//     newMedications[index].time = time;
//     setMedications(newMedications);
//   };

//   const addMedication = () => {
//     setMedications([
//       ...medications,
//       { name: "", dosage: "", route: "", time: new Date() },
//     ]);
//   };

//   const removeMedication = (index) => {
//     const newMedications = medications.slice();
//     newMedications.splice(index, 1);
//     setMedications(newMedications);
//   };

//   const validateVitalSigns = () => {
//     const { temperature, bloodPressure, pulse, bloodSugar, sp02, respiration } =
//       formData;

//     const isValid = (value) => !isNaN(value) || value.toLowerCase() === "nil";

//     if (
//       !isValid(temperature) ||
//       !isValid(pulse) ||
//       !isValid(bloodSugar) ||
//       !isValid(sp02) ||
//       !isValid(respiration)
//     ) {
//       return false;
//     }

//     const [systolic, diastolic] = bloodPressure.split("/").map(Number);
//     if (
//       bloodPressure.toLowerCase() !== "nil" &&
//       (isNaN(systolic) || isNaN(diastolic))
//     ) {
//       return false;
//     }

//     return true;
//   };

//   const checkVitalSigns = () => {
//     const { temperature, bloodPressure, pulse, bloodSugar, sp02, respiration } =
//       formData;

//     const thresholds = {
//       temperature: { min: 36, max: 37.5 },
//       bloodPressure: {
//         systolic: { min: 90, max: 140 },
//         diastolic: { min: 60, max: 90 },
//       },
//       pulse: { min: 60, max: 100 },
//       bloodSugar: { min: 70, max: 140 },
//       sp02: { min: 95, max: 100 },
//       respiration: { min: 12, max: 20 },
//     };

//     const [systolic, diastolic] = bloodPressure.split("/").map(Number);

//     const outOfRange = {};
//     if (
//       temperature.toLowerCase() !== "nil" &&
//       (temperature < thresholds.temperature.min ||
//         temperature > thresholds.temperature.max)
//     ) {
//       outOfRange.temperature = true;
//     }
//     if (
//       bloodPressure.toLowerCase() !== "nil" &&
//       (systolic < thresholds.bloodPressure.systolic.min ||
//         systolic > thresholds.bloodPressure.systolic.max)
//     ) {
//       outOfRange.bloodPressure = true;
//     }
//     if (
//       bloodPressure.toLowerCase() !== "nil" &&
//       (diastolic < thresholds.bloodPressure.diastolic.min ||
//         diastolic > thresholds.bloodPressure.diastolic.max)
//     ) {
//       outOfRange.bloodPressure = true;
//     }
//     if (
//       pulse.toLowerCase() !== "nil" &&
//       (pulse < thresholds.pulse.min || pulse > thresholds.pulse.max)
//     ) {
//       outOfRange.pulse = true;
//     }
//     if (
//       bloodSugar.toLowerCase() !== "nil" &&
//       (bloodSugar < thresholds.bloodSugar.min ||
//         bloodSugar > thresholds.bloodSugar.max)
//     ) {
//       outOfRange.bloodSugar = true;
//     }
//     if (
//       sp02.toLowerCase() !== "nil" &&
//       (sp02 < thresholds.sp02.min || sp02 > thresholds.sp02.max)
//     ) {
//       outOfRange.sp02 = true;
//     }
//     if (
//       respiration.toLowerCase() !== "nil" &&
//       (respiration < thresholds.respiration.min ||
//         respiration > thresholds.respiration.max)
//     ) {
//       outOfRange.respiration = true;
//     }

//     setVitalsOutOfRange(outOfRange);

//     if (Object.keys(outOfRange).length > 0 && !acknowledgedOutOfRange) {
//       toast({
//         title: "Vital Signs Alert",
//         description: "Some vital signs are out of range. Please review.",
//         status: "warning",
//         duration: 5000,
//         isClosable: true,
//         position: "top-right",
//       });
//       return false;
//     }

//     return true;
//   };

//   const handleSubmit = async () => {
//     if (!isFormComplete()) {
//       return;
//     }

//     if (!validateVitalSigns()) {
//       toast({
//         title: "Invalid Vital Signs",
//         description: "Please enter valid vital signs or 'nil'.",
//         status: "error",
//         duration: 5000,
//         isClosable: true,
//         position: "top-right",
//       });
//       return;
//     }

//     if (!checkVitalSigns() && !acknowledgedOutOfRange) {
//       setAcknowledgedOutOfRange(true);
//       return;
//     }

//     const serializedMedications = medications.map(
//       (med) =>
//         `Name:${med.name},Dosage:${med.dosage},Route:${
//           med.route
//         },Time:${med.time.toISOString()}`
//     );

//     const data = {
//       ...formData,
//       activities: activities,
//       appointmentId: patientId,
//       medications: serializedMedications,
//     };

//     // Log the original data
//     console.log("Original Data:", data);

//     // Encrypt the data
//     const encryptedData = encryptData(data);

//     // Log the encrypted data
//     console.log("Encrypted Data:", encryptedData);

//     try {
//       const response = await axios.post(
//         "http://localhost:8080/v1/appointment/send-report",
//         { encryptedData }, // Send encrypted data
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       if (response.data.success) {
//         toast({
//           title: response.data.message,
//           status: "success",
//           duration: 5000,
//           isClosable: true,
//           position: "top-right",
//         });
//         displayPostSubmissionInstructions(
//           formData,
//           vitalsOutOfRange,
//           setInstructions,
//           setDrawerOpen
//         );

//         onClose();
//       } else {
//         toast({
//           title: "Error",
//           description: "Failed to send reports.",
//           status: "error",
//           duration: 5000,
//           isClosable: true,
//           position: "top-right",
//         });
//       }
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "An error occurred while sending reports.",
//         status: "error",
//         duration: 5000,
//         isClosable: true,
//         position: "top-right",
//       });
//     }
//   };

//   return (
//     <>
//       <Drawer
//         theme={customTheme}
//         isOpen={isOpen}
//         placement="right"
//         onClose={onClose}
//         size="lg"
//       >
//         <DrawerOverlay />
//         <DrawerContent>
//           <DrawerCloseButton />
//           <DrawerHeader fontFamily="heading" color="#A210C6">
//             {showDocumentation ? "How to Submit Report" : "Patient Report"}
//           </DrawerHeader>
//           <DrawerBody overflowY="auto">
//             {showDocumentation ? (
//               <RenderDocumentationContent />
//             ) : (
//               <>
//                 <Flex justify="flex-end">
//                   <Button
//                     justifySelf="flex-end"
//                     colorScheme="teal"
//                     mb={4}
//                     onClick={() => setShowDocumentation(!showDocumentation)}
//                   >
//                     How to Submit Report
//                   </Button>
//                 </Flex>
//                 {step === 1 && (
//                   <>
//                     <PatientSelector
//                       patients={patients}
//                       selectedPatient={selectedPatient}
//                       setSelectedPatient={setSelectedPatient}
//                     />
//                     <VitalsForm
//                       formData={formData}
//                       handleChange={handleChange}
//                     />
//                   </>
//                 )}
//                 {step === 2 && (
//                   <>
//                     <FormControl isRequired mb="4">
//                       <FormLabel
//                         fontSize={{ base: "18px", md: "20px" }}
//                         fontWeight="bold"
//                       >
//                         Medications
//                       </FormLabel>
//                       <MedicationForm
//                         medications={medications}
//                         handleMedicationChange={handleMedicationChange}
//                         handleMedicationTimeChange={handleMedicationTimeChange}
//                         addMedication={addMedication}
//                         removeMedication={removeMedication}
//                       />
//                     </FormControl>
//                     <ActivitiesForm
//                       activities={activities}
//                       handleCheckboxChange={handleCheckboxChange}
//                     />
//                   </>
//                 )}
//                 {step === 3 && (
//                   <>
//                     <FormControl isRequired mb="4">
//                       <FormLabel
//                         fontWeight="bold"
//                         fontSize={{ base: "18px", md: "20px" }}
//                       >
//                         Drug Reaction/Observations
//                       </FormLabel>
//                       <Textarea
//                         name="comments"
//                         placeholder="Comments"
//                         value={formData.comments}
//                         onChange={handleChange}
//                       />
//                     </FormControl>
//                     <FormControl isRequired mb="4">
//                       <FormLabel
//                         fontWeight="bold"
//                         fontSize={{ base: "18px", md: "20px" }}
//                       >
//                         Recommendations/Requests
//                       </FormLabel>
//                       <Textarea
//                         name="recommendations"
//                         placeholder="Recommendations"
//                         value={formData.recommendations}
//                         onChange={handleChange}
//                       />
//                     </FormControl>
//                     <FormControl mb="4">
//                       <FormLabel
//                         fontWeight="bold"
//                         fontSize={{ base: "18px", md: "20px" }}
//                       >
//                         Picture Evidence (Optional)
//                       </FormLabel>
//                       <Input
//                         type="file"
//                         name="picture"
//                         onChange={handleFileChange}
//                       />
//                     </FormControl>
//                     <FormControl isRequired mb="4">
//                       <Checkbox
//                         name="confirmation"
//                         isChecked={formData.confirmation}
//                         onChange={(e) =>
//                           setFormData((prev) => ({
//                             ...prev,
//                             confirmation: e.target.checked,
//                           }))
//                         }
//                       >
//                         I confirm that the information provided is accurate and
//                         complete
//                       </Checkbox>
//                     </FormControl>
//                   </>
//                 )}
//                 {step === 4 && (
//                   <ReviewForm
//                     formData={formData}
//                     medications={medications}
//                     activities={activities}
//                     vitalsOutOfRange={vitalsOutOfRange}
//                     setStep={setStep}
//                     handleSubmit={handleSubmit}
//                     acknowledgedOutOfRange={acknowledgedOutOfRange}
//                     setAcknowledgedOutOfRange={setAcknowledgedOutOfRange}
//                   />
//                 )}
//               </>
//             )}
//           </DrawerBody>
//           {step < 4 && !showDocumentation && (
//             <DrawerFooter>
//               {step > 1 && (
//                 <Button
//                   variant="outline"
//                   mr={3}
//                   onClick={() => setStep(step - 1)}
//                 >
//                   Previous
//                 </Button>
//               )}
//               {step < 3 ? (
//                 <Button
//                   bg="#A210C6"
//                   color="white"
//                   onClick={() => setStep(step + 1)}
//                 >
//                   Next
//                 </Button>
//               ) : (
//                 <Button
//                   bg="#A210C6"
//                   color="white"
//                   onClick={() => setStep(4)}
//                   isDisabled={!formData.confirmation}
//                 >
//                   Review and Confirm
//                 </Button>
//               )}
//             </DrawerFooter>
//           )}
//           {showDocumentation && (
//             <DrawerFooter>
//               <Button
//                 color="white"
//                 bg="#A210C6"
//                 onClick={() => setShowDocumentation(false)}
//               >
//                 Back
//               </Button>
//             </DrawerFooter>
//           )}
//         </DrawerContent>
//       </Drawer>
//       <PostSubmissionInstructionsDrawer
//         isOpen={drawerOpen}
//         onClose={() => setDrawerOpen(false)}
//         instructions={instructions}
//       />
//     </>
//   );
// };

// export default PatientReportDrawer;

import React, { useState, useEffect } from "react";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useToast,
  Button,
  extendTheme,
  FormControl,
  FormLabel,
  Textarea,
  Checkbox,
  Input,
  Flex,
} from "@chakra-ui/react";
import axios from "axios";
import VitalsForm from "./VitalSignsForm";
import MedicationForm from "./MedicationForm";
import ActivitiesForm from "./ActivitiesForm";
import ReviewForm from "./ReviewForm";
import PostSubmissionInstructionsDrawer from "./PostSubmissionInstructionsDrawer";
import { displayPostSubmissionInstructions } from "./instructions";
import PatientSelector from "./PatientSelector";
import RenderDocumentationContent from "./RenderDocumentationContent ";
import LoadingSpinner from "../../utils/Spiner";

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

const PatientReportDrawer = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [activities, setActivities] = useState([]);
  const [patientId, setPatientId] = useState();

  const [image] = useState();
  const [imageLoading, setImageLoading] = useState(false);
  const toast = useToast();
  const [medications, setMedications] = useState([
    { name: "", dosage: "", route: "", time: new Date() },
  ]);
  const [formData, setFormData] = useState({
    temperature: "",
    bloodPressure: "",
    pulse: "",
    bloodSugar: "",
    sp02: "",
    respiration: "",
    emotionalState: "",
    physicalState: "",
    spiritualState: "",
    painLevel: "",
    painLocation: "",
    skinIntegrity: "",
    appetite: "",
    fluidIntake: "",
    urinaryElimination: "",
    bowelElimination: "",
    sleepQuality: "",
    comments: "",
    recommendations: "",
    image: null,
    confirmation: false,
  });
  const [vitalsOutOfRange, setVitalsOutOfRange] = useState({});
  const [acknowledgedOutOfRange, setAcknowledgedOutOfRange] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [instructions, setInstructions] = useState([]);
  const [showDocumentation, setShowDocumentation] = useState(false);
  useEffect(() => {
    if (isOpen) {
      fetchPatients();
    }
  }, [isOpen]);

  const fetchPatients = async () => {
    try {
      const response = await axios.get(
        "https://backend-c1pz.onrender.com/v1/appointment/active",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data && Array.isArray(response.data.data)) {
        setPatients(response.data.data);
        const activePatient = response.data.data.find(
          (patient) => patient.customerAppointment.appointmentActive
        );
        if (activePatient) {
          setPatientId(activePatient.customerAppointment.id);
          setSelectedPatient(activePatient.customerAppointment.id);
        }
      } else {
        setPatients([]);
      }
    } catch (error) {
      console.error("Error fetching patients:", error);
      setPatients([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const postImage = async (image, formData, setFormData) => {
    setImageLoading(true);
    if (image === undefined) {
      // toast.error("Please select an image")
      return;
    }
    console.log(image);
    if (image.type === "image/jpeg" || image.type === "image/png") {
      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", "profileImage");
      data.append("cloud_name", "dmfewrwla");

      try {
        const response = await fetch(
          "https://api.cloudinary.com/v1_1/dmfewrwla/image/upload",
          {
            method: "post",
            body: data,
          }
        );

        const imageData = await response.json();

        setFormData({
          ...formData,
          image: imageData.url.toString(),
        });
        setImageLoading(false);
        console.log(imageData.url.toString());
      } catch (err) {
        console.log(err);
        setImageLoading(false);
      }
    } else {
      // toast.error("Please select an image");

      return;
    }
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    if (checked) {
      setActivities([...activities, name]);
    } else {
      setActivities(activities.filter((activity) => activity !== name));
    }
  };

  const isFormComplete = () => {
    const requiredFields = [
      "temperature",
      "bloodPressure",
      "pulse",
      "bloodSugar",
      "sp02",
      "respiration",
      "emotionalState",
      "physicalState",
      "painLevel",
      "painLocation",
      "skinIntegrity",
      "appetite",
      "fluidIntake",
      "urinaryElimination",
      "bowelElimination",
      "sleepQuality",
      "comments",
      "recommendations",
    ];

    const missingFields = requiredFields.filter((field) => !formData[field]);

    if (missingFields.length > 0) {
      toast({
        title: "Incomplete Form",
        description: `Please fill in all required fields: ${missingFields.join(
          ", "
        )}.`,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      return false;
    }

    if (!selectedPatient) {
      toast({
        title: "Incomplete Form",
        description: "Please select a patient.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      return false;
    }

    for (let med of medications) {
      if (!med.name || !med.dosage || !med.route || !med.time) {
        toast({
          title: "Incomplete Form",
          description: "Please fill in all medication details.",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
        return false;
      }
    }

    if (activities.length === 0) {
      toast({
        title: "Incomplete Form",
        description: "Please select at least one activity.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      return false;
    }

    if (!formData.confirmation) {
      toast({
        title: "Incomplete Form",
        description:
          "Please confirm that the information provided is accurate and complete.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      return false;
    }

    return true;
  };

  const handleMedicationChange = (index, field, value) => {
    const newMedications = medications.slice();
    newMedications[index][field] = value;
    setMedications(newMedications);
  };

  const handleMedicationTimeChange = (index, time) => {
    const newMedications = medications.slice();
    newMedications[index].time = time;
    setMedications(newMedications);
  };

  const addMedication = () => {
    setMedications([
      ...medications,
      { name: "", dosage: "", route: "", time: new Date() },
    ]);
  };

  const removeMedication = (index) => {
    const newMedications = medications.slice();
    newMedications.splice(index, 1);
    setMedications(newMedications);
  };

  const validateVitalSigns = () => {
    const { temperature, bloodPressure, pulse, bloodSugar, sp02, respiration } =
      formData;

    const isValid = (value) => !isNaN(value) || value.toLowerCase() === "nil";

    if (
      !isValid(temperature) ||
      !isValid(pulse) ||
      !isValid(bloodSugar) ||
      !isValid(sp02) ||
      !isValid(respiration)
    ) {
      return false;
    }

    const [systolic, diastolic] = bloodPressure.split("/").map(Number);
    if (
      bloodPressure.toLowerCase() !== "nil" &&
      (isNaN(systolic) || isNaN(diastolic))
    ) {
      return false;
    }

    return true;
  };

  const checkVitalSigns = () => {
    const { temperature, bloodPressure, pulse, bloodSugar, sp02, respiration } =
      formData;

    const thresholds = {
      temperature: { min: 36, max: 37.5 },
      bloodPressure: {
        systolic: { min: 90, max: 140 },
        diastolic: { min: 60, max: 90 },
      },
      pulse: { min: 60, max: 100 },
      bloodSugar: { min: 70, max: 140 },
      sp02: { min: 95, max: 100 },
      respiration: { min: 12, max: 20 },
    };

    const [systolic, diastolic] = bloodPressure.split("/").map(Number);

    const outOfRange = {};
    if (
      temperature.toLowerCase() !== "nil" &&
      (temperature < thresholds.temperature.min ||
        temperature > thresholds.temperature.max)
    ) {
      outOfRange.temperature = true;
    }
    if (
      bloodPressure.toLowerCase() !== "nil" &&
      (systolic < thresholds.bloodPressure.systolic.min ||
        systolic > thresholds.bloodPressure.systolic.max)
    ) {
      outOfRange.bloodPressure = true;
    }
    if (
      bloodPressure.toLowerCase() !== "nil" &&
      (diastolic < thresholds.bloodPressure.diastolic.min ||
        diastolic > thresholds.bloodPressure.diastolic.max)
    ) {
      outOfRange.bloodPressure = true;
    }
    if (
      pulse.toLowerCase() !== "nil" &&
      (pulse < thresholds.pulse.min || pulse > thresholds.pulse.max)
    ) {
      outOfRange.pulse = true;
    }
    if (
      bloodSugar.toLowerCase() !== "nil" &&
      (bloodSugar < thresholds.bloodSugar.min ||
        bloodSugar > thresholds.bloodSugar.max)
    ) {
      outOfRange.bloodSugar = true;
    }
    if (
      sp02.toLowerCase() !== "nil" &&
      (sp02 < thresholds.sp02.min || sp02 > thresholds.sp02.max)
    ) {
      outOfRange.sp02 = true;
    }
    if (
      respiration.toLowerCase() !== "nil" &&
      (respiration < thresholds.respiration.min ||
        respiration > thresholds.respiration.max)
    ) {
      outOfRange.respiration = true;
    }

    setVitalsOutOfRange(outOfRange);

    if (Object.keys(outOfRange).length > 0 && !acknowledgedOutOfRange) {
      toast({
        title: "Vital Signs Alert",
        description: "Some vital signs are out of range. Please review.",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!isFormComplete()) {
      return;
    }

    if (!validateVitalSigns()) {
      toast({
        title: "Invalid Vital Signs",
        description: "Please enter valid vital signs or 'nil'.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    if (!checkVitalSigns() && !acknowledgedOutOfRange) {
      setAcknowledgedOutOfRange(true);
      return;
    }

    const serializedMedications = medications.map(
      (med) =>
        `Name:${med.name},Dosage:${med.dosage},Route:${
          med.route
        },Time:${med.time.toISOString()}`
    );

    const data = {
      ...formData,
      activities: activities,
      appointmentId: patientId,
      medications: serializedMedications,
    };

    await postImage(image, formData, setFormData);
    // setLoading(true);
    try {
      const response = await axios.post(
        "https://backend-c1pz.onrender.com/v1/appointment/send-report",
        // "http://localhost:8080/v1/appointment/send-report",
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        toast({
          title: response.data.message,
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
        displayPostSubmissionInstructions(
          formData,
          vitalsOutOfRange,
          setInstructions,
          setDrawerOpen
        );

        onClose();
      } else {
        toast({
          title: "Error",
          description: "Failed to send reports.",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while sending reports.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  return (
    <>
      <Drawer
        theme={customTheme}
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        size="lg"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader fontFamily="heading" color="#A210C6">
            {showDocumentation ? "How to Submit Report" : "Patient Report"}
          </DrawerHeader>
          <DrawerBody overflowY="auto">
            {showDocumentation ? (
              <RenderDocumentationContent />
            ) : (
              <>
                <Flex justify="flex-end">
                  <Button
                    justifySelf="flex-end"
                    colorScheme="teal"
                    mb={4}
                    onClick={() => setShowDocumentation(!showDocumentation)}
                  >
                    How to Submit Report
                  </Button>
                </Flex>
                {step === 1 && (
                  <>
                    <PatientSelector
                      patients={patients}
                      selectedPatient={selectedPatient}
                      setSelectedPatient={setSelectedPatient}
                    />
                    <VitalsForm
                      formData={formData}
                      handleChange={handleChange}
                    />
                  </>
                )}
                {step === 2 && (
                  <>
                    <FormControl isRequired mb="4">
                      <FormLabel
                        fontSize={{ base: "18px", md: "20px" }}
                        fontWeight="bold"
                      >
                        Medications
                      </FormLabel>
                      <MedicationForm
                        medications={medications}
                        handleMedicationChange={handleMedicationChange}
                        handleMedicationTimeChange={handleMedicationTimeChange}
                        addMedication={addMedication}
                        removeMedication={removeMedication}
                      />
                    </FormControl>
                    <ActivitiesForm
                      activities={activities}
                      handleCheckboxChange={handleCheckboxChange}
                    />
                  </>
                )}
                {step === 3 && (
                  <>
                    <FormControl isRequired mb="4">
                      <FormLabel
                        fontWeight="bold"
                        fontSize={{ base: "18px", md: "20px" }}
                      >
                        Drug Reaction/Observations
                      </FormLabel>
                      <Textarea
                        name="comments"
                        placeholder="Comments"
                        value={formData.comments}
                        onChange={handleChange}
                      />
                    </FormControl>
                    <FormControl isRequired mb="4">
                      <FormLabel
                        fontWeight="bold"
                        fontSize={{ base: "18px", md: "20px" }}
                      >
                        Recommendations/Requests
                      </FormLabel>
                      <Textarea
                        name="recommendations"
                        placeholder="Recommendations"
                        value={formData.recommendations}
                        onChange={handleChange}
                      />
                    </FormControl>
                    <FormControl mb="4">
                      <FormLabel
                        fontWeight="bold"
                        fontSize={{ base: "18px", md: "20px" }}
                      >
                        Picture Evidence (Optional)
                      </FormLabel>
                      <Input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={(e) => {
                          postImage(e.target.files[0], formData, setFormData);
                        }}
                      />
                       {imageLoading && <LoadingSpinner size={20} />}
                    </FormControl>
                    <FormControl isRequired mb="4">
                      <Checkbox
                        name="confirmation"
                        isChecked={formData.confirmation}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            confirmation: e.target.checked,
                          }))
                        }
                      >
                        I confirm that the information provided is accurate and
                        complete
                      </Checkbox>
                    </FormControl>
                  </>
                )}
                {step === 4 && (
                  <ReviewForm
                    formData={formData}
                    medications={medications}
                    activities={activities}
                    vitalsOutOfRange={vitalsOutOfRange}
                    setStep={setStep}
                    handleSubmit={handleSubmit}
                    acknowledgedOutOfRange={acknowledgedOutOfRange}
                    setAcknowledgedOutOfRange={setAcknowledgedOutOfRange}
                  />
                )}
              </>
            )}
          </DrawerBody>
          {step < 4 && !showDocumentation && (
            <DrawerFooter>
              {step > 1 && (
                <Button
                  variant="outline"
                  mr={3}
                  onClick={() => setStep(step - 1)}
                >
                  Previous
                </Button>
              )}
              {step < 3 ? (
                <Button
                  bg="#A210C6"
                  color="white"
                  onClick={() => setStep(step + 1)}
                >
                  Next
                </Button>
              ) : (
                <Button
                  bg="#A210C6"
                  color="white"
                  onClick={() => setStep(4)}
                  isDisabled={!formData.confirmation}
                >
                  Review and Confirm
                </Button>
              )}
            </DrawerFooter>
          )}
          {showDocumentation && (
            <DrawerFooter>
              <Button
                color="white"
                bg="#A210C6"
                onClick={() => setShowDocumentation(false)}
              >
                Back
              </Button>
            </DrawerFooter>
          )}
        </DrawerContent>
      </Drawer>
      <PostSubmissionInstructionsDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        instructions={instructions}
      />
    </>
  );
};

export default PatientReportDrawer;
