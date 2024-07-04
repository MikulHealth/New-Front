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
  Text,
  VStack,
  ListItem,
  UnorderedList,
} from "@chakra-ui/react";
import axios from "axios";
import VitalsForm from "./VitalSignsForm";
import MedicationForm from "./MedicationForm";
import ActivitiesForm from "./ActivitiesForm";
import ReviewForm from "./ReviewForm";
import PostSubmissionInstructionsModal from "./PostSubmissionInstructionsModal ";
import { displayPostSubmissionInstructions } from "./instructions";
import PatientSelector from "./PatientSelector";

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
    mood: "",
    emotionalState: "",
    physicalState: "",
    spiritualState: "",
    painLevel: "",
    comments: "",
    recommendations: "",
    picture: null,
    confirmation: false,
  });
  const [vitalsOutOfRange, setVitalsOutOfRange] = useState({});
  const [acknowledgedOutOfRange, setAcknowledgedOutOfRange] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
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

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      picture: e.target.files[0],
    }));
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
      "mood",
      "emotionalState",
      "physicalState",
      "painLevel",
      "comments",
      "recommendations",
    ];

    for (let field of requiredFields) {
      if (!formData[field]) {
        return false;
      }
    }

    if (!selectedPatient) {
      return false;
    }

    for (let med of medications) {
      if (!med.name || !med.dosage || !med.route || !med.time) {
        return false;
      }
    }

    if (activities.length === 0) {
      return false;
    }

    if (!formData.confirmation) {
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
      toast({
        title: "Incomplete Form",
        description: "Please fill in all required fields.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
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

    try {
      const response = await axios.post(
        "https://backend-c1pz.onrender.com/v1/appointment/send-report",
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
          setModalOpen
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

  const renderDocumentationContent = () => (
    <>
      {/* <DrawerHeader textAlign="center" color="#A210C6" fontFamily="heading">
        How to Submit Patient Report
      </DrawerHeader> */}
      <DrawerBody>
        <VStack fontFamily="body" align="start" spacing={4}>
          <Text>Follow these steps to submit the patient report:</Text>
          <UnorderedList spacing={3}>
            <ListItem>
              <Text fontWeight="bold">Select Patient:</Text>
              <Text>
                The system would automatically select your patient for whom you
                are submitting the report from the dropdown menu.
              </Text>
            </ListItem>
            <ListItem>
              <Text fontWeight="bold">Vitals Signs:</Text>
              <Text>
                Enter the patient's vital signs including temperature, blood
                pressure, pulse, blood sugar, SpO2, and respiration. If a vital
                sign is not available, enter "nil".
              </Text>
            </ListItem>
            <ListItem>
              <Text fontWeight="bold">Mood and States:</Text>
              <Text>
                Select the patient's mood, emotional state, physical state, and
                pain level from the dropdown options.
              </Text>
            </ListItem>
            <ListItem>
              <Text fontWeight="bold">Medications:</Text>
              <Text>
                Add all medications the patient is currently taking, including
                the name, dosage, route, and time of administration.
              </Text>
            </ListItem>
            <ListItem>
              <Text fontWeight="bold">Activities of Daily Living:</Text>
              <Text>
                Check all activities you assisted the patient with, such as
                bathing, dressing, and feeding.
              </Text>
            </ListItem>
            <ListItem>
              <Text fontWeight="bold">Observations/Comments:</Text>
              <Text>
                Write any observations or comments about the patient's condition
                or behavior.
              </Text>
            </ListItem>
            <ListItem>
              <Text fontWeight="bold">Recommendations/Requests:</Text>
              <Text>
                Provide any recommendations or requests for the patient's care.
              </Text>
            </ListItem>
            <ListItem>
              <Text fontWeight="bold">Picture Evidence (Optional):</Text>
              <Text>Upload any picture evidence if necessary.</Text>
            </ListItem>
            <ListItem>
              <Text fontWeight="bold">Confirmation:</Text>
              <Text>
                Check the confirmation box to confirm that all information
                provided is accurate and complete.
              </Text>
            </ListItem>
          </UnorderedList>
          <Text>
            Reports should be made at least once a day at the end of the day
            (shift) for healthy patients, and twice a day (morning and evening)
            for those who are ill. For critically ill patients, reports should
            be made as needed (PRN).
          </Text>
        </VStack>
      </DrawerBody>
    </>
  );

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
          <DrawerBody>
            {showDocumentation ? (
              renderDocumentationContent()
            ) : (
              <>
                <Flex justify="flex-end">
                  <Button
                    justifySelf="flex-end"
                    colorScheme="blue"
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
                        name="picture"
                        onChange={handleFileChange}
                      />
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
      <PostSubmissionInstructionsModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        instructions={instructions}
      />
    </>
  );
};

export default PatientReportDrawer;
