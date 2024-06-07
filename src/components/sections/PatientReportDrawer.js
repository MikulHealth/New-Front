import React, { useState, useEffect } from "react";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
  extendTheme,
  Text,
  Input,
  FormControl,
  FormLabel,
  Select,
  Checkbox,
  Box,
  Textarea,
  VStack,
  HStack,
  IconButton,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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

const CustomInput = React.forwardRef(({ value, onClick }, ref) => (
  <Button
    onClick={onClick}
    ref={ref}
    width="full"
    bg="gray.200"
    _hover={{ bg: "gray.300" }}
  >
    {value || "Select Time"}
  </Button>
));

const PatientReportDrawer = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [activities, setActivities] = useState([]);
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
    comments: "",
    recommendations: "",
    picture: null,
    confirmation: false,
  });

  useEffect(() => {
    if (isOpen) {
      fetchPatients();
    }
  }, [isOpen]);

  const fetchPatients = async () => {
    try {
      const response = await axios.get("https://your-backend-api.com/patients");
      setPatients(response.data);
    } catch (error) {
      console.error("Error fetching patients:", error);
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

  const handleSubmit = async () => {
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });
    data.append("activities", activities);
    data.append("patientId", selectedPatient);
    data.append("medications", JSON.stringify(medications));

    try {
      const response = await axios.post(
        "https://your-backend-api.com/patient-report",
        data
      );
      console.log("Report submitted successfully:", response.data);
      onClose();
    } catch (error) {
      console.error("Error submitting report:", error);
    }
  };

  return (
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
          Patient report
        </DrawerHeader>
        <DrawerBody>
          {step === 1 && (
            <>
              <FormControl isRequired mb="4">
                <FormLabel fontFamily="body" fontWeight="bold">
                  Select Patient
                </FormLabel>
                <Select
                  placeholder="Select patient"
                  value={selectedPatient}
                  onChange={(e) => setSelectedPatient(e.target.value)}
                >
                  {patients.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl isRequired mb="4">
                <Text mb="5px" fontFamily="heading" fontWeight="bold">
                  Vitals Signs
                </Text>
                <FormLabel fontFamily="body">Temperature</FormLabel>
                <Input
                  name="temperature"
                  placeholder="Temperature"
                  value={formData.temperature}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl isRequired mb="4">
                <FormLabel fontFamily="body">Blood pressure</FormLabel>
                <Input
                  name="bloodPressure"
                  placeholder="Blood pressure"
                  value={formData.bloodPressure}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl isRequired mb="4">
                <FormLabel fontFamily="body">Pulse</FormLabel>
                <Input
                  name="pulse"
                  placeholder="Pulse"
                  value={formData.pulse}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl isRequired mb="4">
                <FormLabel fontFamily="body">Blood sugar</FormLabel>
                <Input
                  name="bloodSugar"
                  placeholder="Blood sugar"
                  value={formData.bloodSugar}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl isRequired mb="4">
                <FormLabel fontFamily="body">SpO2</FormLabel>
                <Input
                  name="sp02"
                  placeholder="SpO2"
                  value={formData.sp02}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl isRequired mb="4">
                <FormLabel fontFamily="body">Respiration</FormLabel>
                <Input
                  name="respiration"
                  placeholder="Respiration"
                  value={formData.respiration}
                  onChange={handleChange}
                />
              </FormControl>
            </>
          )}

          {step === 2 && (
            <>
              <FormControl isRequired mb="4">
                <FormLabel fontFamily="heading" fontWeight="bold">
                  Medications
                </FormLabel>
                <VStack spacing={3}>
                  {medications.map((medication, index) => (
                    <Box key={index} w="100%">
                      <HStack spacing={2}>
                        <Input
                          placeholder="Name"
                          value={medication.name}
                          onChange={(e) =>
                            handleMedicationChange(
                              index,
                              "name",
                              e.target.value
                            )
                          }
                        />
                        <Input
                          placeholder="Dosage"
                          value={medication.dosage}
                          onChange={(e) =>
                            handleMedicationChange(
                              index,
                              "dosage",
                              e.target.value
                            )
                          }
                        />
                        <Input
                          placeholder="Route"
                          value={medication.route}
                          onChange={(e) =>
                            handleMedicationChange(
                              index,
                              "route",
                              e.target.value
                            )
                          }
                        />
                        <Box width="100%">
                          <DatePicker
                            selected={medication.time}
                            onChange={(time) =>
                              handleMedicationTimeChange(index, time)
                            }
                            showTimeSelect
                            showTimeSelectOnly
                            timeIntervals={15}
                            timeCaption="Time"
                            dateFormat="h:mm aa"
                            customInput={<CustomInput />}
                          />
                        </Box>
                        <IconButton
                          icon={<DeleteIcon />}
                          onClick={() => removeMedication(index)}
                        />
                      </HStack>
                    </Box>
                  ))}
                  <Button
                    leftIcon={<AddIcon />}
                    onClick={addMedication}
                    bg="blue.400"
                    color="white"
                    fontFamily="body"
                  >
                    Add Medication
                  </Button>
                </VStack>
              </FormControl>
              <FormControl isRequired mb="4">
                <FormLabel fontFamily="heading" fontWeight="bold">
                  Activities of Daily Living
                </FormLabel>
                <VStack align="start">
                  <Checkbox
                    name="Tub bath/shower assistance"
                    onChange={handleCheckboxChange}
                  >
                    Tub bath/shower assistance
                  </Checkbox>
                  <Checkbox
                    name="Bed bath/sink bath"
                    onChange={handleCheckboxChange}
                  >
                    Bed bath/sink bath
                  </Checkbox>
                  <Checkbox name="Shampoo hair" onChange={handleCheckboxChange}>
                    Shampoo hair
                  </Checkbox>
                  <Checkbox name="Shave hair" onChange={handleCheckboxChange}>
                    Shave hair
                  </Checkbox>
                  <Checkbox name="Mouth care" onChange={handleCheckboxChange}>
                    Mouth care
                  </Checkbox>
                  <Checkbox
                    name="Dress assistance"
                    onChange={handleCheckboxChange}
                  >
                    Dress assistance
                  </Checkbox>
                  <Checkbox name="Body massage" onChange={handleCheckboxChange}>
                    Body massage
                  </Checkbox>
                  <Checkbox
                    name="Wound care/dressing"
                    onChange={handleCheckboxChange}
                  >
                    Wound care/dressing
                  </Checkbox>
                  <Checkbox
                    name="Catheter care"
                    onChange={handleCheckboxChange}
                  >
                    Catheter care
                  </Checkbox>
                  <Checkbox name="Ostomy care" onChange={handleCheckboxChange}>
                    Ostomy care
                  </Checkbox>
                  <Checkbox name="Feed client" onChange={handleCheckboxChange}>
                    Feed client
                  </Checkbox>
                  <Checkbox
                    name="Served urinal or bed pan"
                    onChange={handleCheckboxChange}
                  >
                    Served urinal or bed pan
                  </Checkbox>
                  <Checkbox
                    name="Assisted to toilet or commode"
                    onChange={handleCheckboxChange}
                  >
                    Assisted to toilet or commode
                  </Checkbox>
                  <Checkbox
                    name="Diaper change"
                    onChange={handleCheckboxChange}
                  >
                    Diaper change
                  </Checkbox>
                  <Checkbox
                    name="Assistance with transfer to bed, chair or wheelchair"
                    onChange={handleCheckboxChange}
                  >
                    Assistance with transfer to bed, chair or wheelchair
                  </Checkbox>
                </VStack>
              </FormControl>
            </>
          )}

          {step === 3 && (
            <>
              <FormControl isRequired mb="4">
                <FormLabel fontFamily="body">Comments</FormLabel>
                <Textarea
                  name="comments"
                  placeholder="Comments"
                  value={formData.comments}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl isRequired mb="4">
                <FormLabel fontFamily="body">Recommendations</FormLabel>
                <Textarea
                  name="recommendations"
                  placeholder="Recommendations"
                  value={formData.recommendations}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl mb="4">
                <FormLabel fontFamily="body">
                  Picture Evidence (Optional)
                </FormLabel>
                <Input type="file" name="picture" onChange={handleFileChange} />
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
        </DrawerBody>
        <DrawerFooter>
          {step > 1 && (
            <Button
              fontFamily="body"
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
              fontFamily="body"
            >
              Next
            </Button>
          ) : (
            <Button
              bg="#A210C6"
              color="white"
              onClick={handleSubmit}
              isDisabled={!formData.confirmation}
              fontFamily="body"
            >
              Submit Report
            </Button>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default PatientReportDrawer;
