import React from "react";
import {
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  Text,
  extendTheme,
} from "@chakra-ui/react";

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

const VitalsForm = ({ formData, handleChange }) => {
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

  const getWarningMessage = (value, min, max) => {
    if (value < min) return `Value is too low. Minimum is ${min}.`;
    if (value > max) return `Value is too high. Maximum is ${max}.`;
    return null;
  };

  const getBloodPressureWarningMessage = (value) => {
    const [systolic, diastolic] = value.split("/").map(Number);
    if (isNaN(systolic) || isNaN(diastolic))
      return "Invalid blood pressure format.";

    let message = "";
    if (systolic < thresholds.bloodPressure.systolic.min) {
      message += `Systolic value is too low. Minimum is ${thresholds.bloodPressure.systolic.min}. `;
    } else if (systolic > thresholds.bloodPressure.systolic.max) {
      message += `Systolic value is too high. Maximum is ${thresholds.bloodPressure.systolic.max}. `;
    }

    if (diastolic < thresholds.bloodPressure.diastolic.min) {
      message += `Diastolic value is too low. Minimum is ${thresholds.bloodPressure.diastolic.min}. `;
    } else if (diastolic > thresholds.bloodPressure.diastolic.max) {
      message += `Diastolic value is too high. Maximum is ${thresholds.bloodPressure.diastolic.max}. `;
    }

    return message.trim();
  };

  return (
    <VStack theme={customTheme} spacing={4} align="start">
      <FormControl fontFamily="body" isRequired>
        <FormLabel>Temperature</FormLabel>
        <Input
          name="temperature"
          placeholder="Temperature"
          value={formData.temperature}
          onChange={handleChange}
        />
        {formData.temperature && (
          <Text
            fontStyle="italic"
            fontSize={{ base: "12px", md: "14px" }}
            color="red.500"
          >
            {getWarningMessage(
              formData.temperature,
              thresholds.temperature.min,
              thresholds.temperature.max
            )}
          </Text>
        )}
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Blood Pressure</FormLabel>
        <Input
          name="bloodPressure"
          placeholder="Blood Pressure"
          value={formData.bloodPressure}
          onChange={handleChange}
        />
        {formData.bloodPressure && (
          <Text
            fontStyle="italic"
            fontSize={{ base: "12px", md: "14px" }}
            color="red.500"
          >
            {getBloodPressureWarningMessage(formData.bloodPressure)}
          </Text>
        )}
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Pulse</FormLabel>
        <Input
          name="pulse"
          placeholder="Pulse"
          value={formData.pulse}
          onChange={handleChange}
        />
        {formData.pulse && (
          <Text
            fontStyle="italic"
            fontSize={{ base: "12px", md: "14px" }}
            color="red.500"
          >
            {getWarningMessage(
              formData.pulse,
              thresholds.pulse.min,
              thresholds.pulse.max
            )}
          </Text>
        )}
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Blood Sugar</FormLabel>
        <Input
          name="bloodSugar"
          placeholder="Blood Sugar"
          value={formData.bloodSugar}
          onChange={handleChange}
        />
        {formData.bloodSugar && (
          <Text
            fontStyle="italic"
            fontSize={{ base: "12px", md: "14px" }}
            color="red.500"
          >
            {getWarningMessage(
              formData.bloodSugar,
              thresholds.bloodSugar.min,
              thresholds.bloodSugar.max
            )}
          </Text>
        )}
      </FormControl>
      <FormControl isRequired>
        <FormLabel>SpO2</FormLabel>
        <Input
          name="sp02"
          placeholder="SpO2"
          value={formData.sp02}
          onChange={handleChange}
        />
        {formData.sp02 && (
          <Text
            fontSize={{ base: "12px", md: "14px" }}
            fontStyle="italic"
            color="red.500"
          >
            {getWarningMessage(
              formData.sp02,
              thresholds.sp02.min,
              thresholds.sp02.max
            )}
          </Text>
        )}
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Respiration</FormLabel>
        <Input
          name="respiration"
          placeholder="Respiration"
          value={formData.respiration}
          onChange={handleChange}
        />
        {formData.respiration && (
          <Text
            fontSize={{ base: "12px", md: "14px" }}
            fontStyle="italic"
            color="red.500"
          >
            {getWarningMessage(
              formData.respiration,
              thresholds.respiration.min,
              thresholds.respiration.max
            )}
          </Text>
        )}
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Emotional State</FormLabel>
        <Select
          name="emotionalState"
          placeholder="Select emotional state"
          value={formData.emotionalState}
          onChange={handleChange}
        >
          <option value="Happy">Happy</option>
          <option value="Sad">Sad</option>
          <option value="Anxious">Anxious</option>
          <option value="Restless">Restless</option>
          <option value="Calm">Calm</option>
          <option value="Elevated">Elevated</option>
          <option value="Angry">Angry</option>
          <option value="Aggressive">Aggressive</option>
          <option value="Depressed">Depressed</option>
        </Select>
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Physical State</FormLabel>
        <Select
          name="physicalState"
          placeholder="Select Physical State"
          value={formData.physicalState}
          onChange={handleChange}
        >
          <option value="Good">Good</option>
          <option value="Fair">Fair</option>
          <option value="Poor">Poor</option>
        </Select>
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Pain Level</FormLabel>
        <Select
          name="painLevel"
          placeholder="Select Pain Level"
          value={formData.painLevel}
          onChange={handleChange}
        >
          <option value="None">None</option>
          <option value="Mild">Mild</option>
          <option value="Moderate">Moderate</option>
          <option value="Severe">Severe</option>
          <option value="Very Severe">Very Severe</option>
        </Select>
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Pain Location</FormLabel>
        <Select
          name="painLocation"
          placeholder="Select Pain Location"
          value={formData.painLocation}
          onChange={handleChange}
        >
          <option value="None">None</option>
          <option value="Head">Head</option>
          <option value="Chest">Chest</option>
          <option value="Abdomen">Abdomen</option>
          <option value="Back">Back</option>
          <option value="Legs">Legs</option>
          <option value="Arms">Arms</option>
          <option value="Neck">Neck</option>
          <option value="Shoulders">Shoulders</option>
        </Select>
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Skin Integrity</FormLabel>
        <Select
          name="skinIntegrity"
          placeholder="Select Skin Integrity"
          value={formData.skinIntegrity}
          onChange={handleChange}
        >
          <option value="Intact">Intact</option>
          <option value="Broken">Broken</option>
          <option value="Ulcerated">Ulcerated</option>
          <option value="Infected">Infected</option>
        </Select>
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Appetite</FormLabel>
        <Select
          name="appetite"
          placeholder="Select Appetite"
          value={formData.appetite}
          onChange={handleChange}
        >
          <option value="Good">Good</option>
          <option value="Fair">Fair</option>
          <option value="Poor">Poor</option>
        </Select>
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Fluid Intake</FormLabel>
        <Select
          name="fluidIntake"
          placeholder="Select Fluid Intake"
          value={formData.fluidIntake}
          onChange={handleChange}
        >
          <option value="Adequate">Adequate</option>
          <option value="Fair">Fair</option>
          <option value="Inadequate">Inadequate</option>
        </Select>
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Urinary Elimination</FormLabel>
        <Select
          name="urinaryElimination"
          placeholder="Select Urinary Elimination"
          value={formData.urinaryElimination}
          onChange={handleChange}
        >
          <option value="Normal">Normal</option>
          <option value="Incontinence">Incontinence</option>
          <option value="Retention">Retention</option>
        </Select>
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Bowel Elimination</FormLabel>
        <Select
          name="bowelElimination"
          placeholder="Select Bowel Elimination"
          value={formData.bowelElimination}
          onChange={handleChange}
        >
          <option value="Regular">Regular</option>
          <option value="Constipation">Constipation</option>
          <option value="Diarrhea">Diarrhea</option>
        </Select>
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Sleep Quality</FormLabel>
        <Select
          name="sleepQuality"
          placeholder="Select Sleep Quality"
          value={formData.sleepQuality}
          onChange={handleChange}
        >
          <option value="Good">Good</option>
          <option value="Fair">Fair</option>
          <option value="Poor">Poor</option>
        </Select>
      </FormControl>
    </VStack>
  );
};

export default VitalsForm;
