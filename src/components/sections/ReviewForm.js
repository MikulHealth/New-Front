import React from "react";
import { VStack, Text, Flex, Button } from "@chakra-ui/react";

const ReviewForm = ({ formData, medications, activities, vitalsOutOfRange, setStep, handleSubmit, acknowledgedOutOfRange, setAcknowledgedOutOfRange }) => (
  <VStack spacing={4} align="start" w="100%">
    <Text fontSize="xl" fontWeight="bold">Confirmation</Text>
    <Text color="#A210C6" fontStyle="italic">
      Proof read to confirm that the report is complete and accurate.
    </Text>
    {Object.keys(vitalsOutOfRange).length > 0 && (
      <Text color="red.500" fontWeight="bold">
        Some vital signs are out of range. Please confirm they are correct before submitting.
      </Text>
    )}
    <Text color={vitalsOutOfRange.temperature ? "red.500" : "black"}>
      Temperature: {formData.temperature}°C
    </Text>
    <Text color={vitalsOutOfRange.bloodPressure ? "red.500" : "black"}>
      Blood Pressure: {formData.bloodPressure}
    </Text>
    <Text color={vitalsOutOfRange.pulse ? "red.500" : "black"}>
      Pulse: {formData.pulse} bpm
    </Text>
    <Text color={vitalsOutOfRange.bloodSugar ? "red.500" : "black"}>
      Blood Sugar: {formData.bloodSugar}
    </Text>
    <Text color={vitalsOutOfRange.sp02 ? "red.500" : "black"}>
      SpO2: {formData.sp02}%
    </Text>
    <Text color={vitalsOutOfRange.respiration ? "red.500" : "black"}>
      Respiration: {formData.respiration} c/m
    </Text>
    <Text>Mood: {formData.mood}</Text>
    <Text>Emotional State: {formData.emotionalState}</Text>
    <Text>Physical State: {formData.physicalState}</Text>
    <Text>Spiritual State: {formData.spiritualState}</Text>
    <Text>Pain Level: {formData.painLevel}</Text>
    <Text fontWeight="bold">Medications:</Text>
    <VStack align="start" spacing={1}>
      {medications.map((medication, index) => (
        <Text key={index}>{`Name: ${medication.name}, Dosage: ${medication.dosage}, Route: ${medication.route}, Time: ${medication.time.toLocaleString()}`}</Text>
      ))}
    </VStack>
    <Text fontWeight="bold">Activities:</Text>
    <VStack align="start" spacing={1}>
      {activities.map((activity, index) => (
        <Text key={index}>{activity}</Text>
      ))}
    </VStack>
    <Text>Comments: {formData.comments}</Text>
    <Text>Recommendations: {formData.recommendations}</Text>
    <Flex justifyContent="space-between" w="100%">
      <Button
        variant="outline"
        onClick={() => {
          setAcknowledgedOutOfRange(false);
          setStep(3);
        }}
        bg="gray.500"
        color="white"
      >
        Back
      </Button>
      <Button
        bg="#A210C6"
        color="white"
        onClick={handleSubmit}
        isDisabled={!formData.confirmation}
      >
        Confirm and Submit
      </Button>
    </Flex>
  </VStack>
);

export default ReviewForm;