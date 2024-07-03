import React from "react";
import { VStack, HStack, Input, Box, IconButton, Button } from "@chakra-ui/react";
import { DeleteIcon, AddIcon } from "@chakra-ui/icons";
import DatePicker from "react-datepicker";
import CustomInput from "./CustomInput";

const MedicationForm = ({ medications, handleMedicationChange, handleMedicationTimeChange, addMedication, removeMedication }) => (
  <VStack spacing={3}>
    {medications.map((medication, index) => (
      <Box key={index} w="100%">
        <HStack spacing={2}>
          <Input
            placeholder="Name"
            value={medication.name}
            onChange={(e) => handleMedicationChange(index, "name", e.target.value)}
          />
          <Input
            placeholder="Dosage"
            value={medication.dosage}
            onChange={(e) => handleMedicationChange(index, "dosage", e.target.value)}
          />
          <Input
            placeholder="Route"
            value={medication.route}
            onChange={(e) => handleMedicationChange(index, "route", e.target.value)}
          />
          <Box width="100%">
            <DatePicker
              selected={medication.time}
              onChange={(time) => handleMedicationTimeChange(index, time)}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              timeCaption="Time"
              dateFormat="h:mm aa"
              customInput={<CustomInput />}
            />
          </Box>
          <IconButton icon={<DeleteIcon />} onClick={() => removeMedication(index)} />
        </HStack>
      </Box>
    ))}
    <Button leftIcon={<AddIcon />} onClick={addMedication} bg="blue.400" color="white">
      Add Medication
    </Button>
  </VStack>
);

export default MedicationForm;
