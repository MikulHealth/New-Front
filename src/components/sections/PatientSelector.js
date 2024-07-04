import React from "react";
import { FormControl, FormLabel, Select } from "@chakra-ui/react";

const PatientSelector = ({ patients, selectedPatient, setSelectedPatient }) => (
  <FormControl isRequired mb="4">
    <FormLabel fontSize={{ base: "18px", md: "20px" }} fontWeight="bold">
      Select Patient
    </FormLabel>
    <Select
      placeholder="Select patient"
      value={selectedPatient}
      onChange={(e) => setSelectedPatient(e.target.value)}
    >
      {Array.isArray(patients) &&
        patients
          .filter((patient) => patient.customerAppointment?.appointmentActive)
          .map((patient) => (
            <option
              key={patient.customerAppointment.id}
              value={patient.customerAppointment.id}
            >
              {patient.customerAppointment.recipientFirstname}{" "}
              {patient.customerAppointment.recipientLastname}
            </option>
          ))}
    </Select>
  </FormControl>
);

export default PatientSelector;
