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
        <FormLabel>Mood</FormLabel>
        <Select
          name="mood"
          placeholder="Select Mood"
          value={formData.mood}
          onChange={handleChange}
        >
          <option value="Happy">Happy</option>
          <option value="Sad">Sad</option>
          <option value="Anxious">Anxious</option>
          <option value="Calm">Calm</option>
          <option value="Angry">Angry</option>
        </Select>
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Emotional State</FormLabel>
        <Select
          name="emotionalState"
          placeholder="Select Emotional State"
          value={formData.emotionalState}
          onChange={handleChange}
        >
          <option value="Stable">Stable</option>
          <option value="Unstable">Unstable</option>
          <option value="Depressed">Depressed</option>
          <option value="Elevated">Elevated</option>
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
    </VStack>
  );
};

export default VitalsForm;
