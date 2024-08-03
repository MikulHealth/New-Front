import React from "react";
import {
  Box,
  Flex,
  FormLabel,
  Input,
  Select,
  Textarea,
} from "@chakra-ui/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import AddressInput from "./AddressInput";

export const FormFields = ({
  formFields,
  townsInLagos,
  majorLanguages,
  handleInputChange,
  handleStartDateChange,
  selectedStartDate,
  customizedPlans,
  isShiftDisabled,
  // handleLocationChange,
}) => (
  <>
    <Flex ml={{ base: "0", md: "45px" }} flexWrap="wrap" marginTop="20px">
      <Box w={{ base: "full", md: "270px" }}>
        <FormLabel fontFamily="body" fontWeight="bold" color="#00000080">
          Start Date
        </FormLabel>
        <Flex
          color="#00000080"
          h="6.5vh"
          paddingTop="5px"
          paddingLeft="15px"
          style={{ border: "1px solid #B49C9C", borderRadius: "5px" }}
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

      <Box
        ml={{ md: "5px" }}
        color="#00000080"
        w={{ base: "full", md: "270px" }}
      
      >
        <FormLabel color="#00000080" fontFamily="body" fontWeight="bold">
          Service Plan
        </FormLabel>
        <Select
          isRequired
          h="6.5vh"
          name="servicePlan"
          placeholder="preferred service plan"
          w={{ base: "full", md: "270px" }}
          fontSize={{ base: "14px", md: "16px" }}
          value={formFields.servicePlan}
          onChange={handleInputChange}
          border="1px solid #B49C9C"
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
    </Flex>

    <Flex
      marginTop="20px"
      color="#00000080"
      flexWrap="wrap"
      
      ml={{ base: "0", md: "40px" }}
    >
      <Box  w={{ base: "full", md: "270px" }} color="#00000080" fontFamily="body" ml={{ md: "5px" }}>
        <FormLabel fontWeight="bold">Shift</FormLabel>
        <Select
          isRequired
          h="6.5vh"
          name="shift"
          placeholder="select preferred shift"
         
          value={formFields.shift}
          onChange={handleInputChange}
          disabled={isShiftDisabled}
          style={{ border: "1px solid #B49C9C", borderRadius: "5px" }}
        >
          <option value="Day Shift (8hrs)">Day Shift (8hrs)</option>
          <option value="Live-in (24hrs)">Live-in (24hrs)</option>
        </Select>
      </Box>
      <Box  ml={{ md: "5px" }} w={{ base: "full", md: "270px" }}>
        <FormLabel fontFamily="body" fontWeight="bold" color="#00000080">
          End Date
        </FormLabel>
        <Flex
          color="#00000080"
          h="6.5vh"
          paddingTop="5px"
          paddingLeft="15px"
          style={{ border: "1px solid #B49C9C", borderRadius: "5px" }}
        >
          <DatePicker
            selected={formFields.endDate}
            placeholderText="estimated end date"
            dateFormat="dd-MM-yyyy"
            className="form-control"
            disabled
            style={{ color: "#00000080" }}
          />
        </Flex>
      </Box>
    </Flex>

    <Box
      w={{ base: "full", md: "550px" }}
      marginTop="20px"
      ml={{ base: "0", md: "40px" }}
    >
      <FormLabel color="#00000080" fontFamily="body" fontWeight="bold">
        City/Town
      </FormLabel>
      <Select
        style={{ border: "1px solid #B49C9C", borderRadius: "5px" }}
        isRequired
        name="recipientTown"
        placeholder="select town"
        w={{ base: "full", md: "550px" }}
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
    <Box
      ml={{ base: "0", md: "40px" }}
      w={{ base: "full", md: "550px" }}
      marginTop="20px"
    >
      <FormLabel color="#00000080" fontWeight="bold" fontFamily="body">
        Location
      </FormLabel>
      <Input
        style={{ border: "1px solid #B49C9C", borderRadius: "5px" }}
        name="currentLocation"
        type="text"
        placeholder="enter home address"
        value={formFields.currentLocation}
        onChange={handleInputChange}
        w={{ base: "full", md: "550px" }}
      />
      {/* <Flex   w={{ base: "full", md: "550px" }} style={{ border: "1px solid #B49C9C", borderRadius: "5px" }}>
        
        <AddressInput
          value={formFields.currentLocation}
          onChange={handleLocationChange}
        />
      </Flex> */}
    </Box>

    <Flex color="#00000080" flexWrap="wrap" ml={{ base: "0", md: "40px" }}>
      <Box w={{ base: "full", md: "270px" }} marginTop="20px">
        <FormLabel color="#00000080" fontFamily="body" fontWeight="bold">
          Preferred Language
        </FormLabel>
        <Select
          isRequired
          style={{ border: "1px solid #B49C9C", borderRadius: "5px" }}
          name="preferredLanguage"
          placeholder="select language"
          w={{ base: "full", md: "270px" }}
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
      <Box w={{ base: "full", md: "270px" }} ml={{ md: "5px" }} marginTop="20px">
        <FormLabel color="#00000080" fontWeight="bold" fontFamily="body">
          Preferred Medic Gender
        </FormLabel>
        <Select
          style={{ border: "1px solid #B49C9C", borderRadius: "5px" }}
          isRequired
          name="preferredMedicGender"
          placeholder="select gender"
          w={{ base: "full", md: "270px" }}
          fontSize={{ base: "14px", md: "16px" }}
          value={formFields.preferredMedicGender}
          onChange={handleInputChange}
        >
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </Select>
      </Box>
    </Flex>

    <Box color="#00000080" ml={{ base: "0", md: "40px" }} marginTop="20px">
      <FormLabel color="#00000080" fontWeight="bold" fontFamily="body">
        Health History
      </FormLabel>
      <FormLabel color="#00000080" fontSize="14px" fontFamily="body">
        (Is there anything you'd like us to know?)
      </FormLabel>
      <Textarea
        style={{ border: "1px solid #B49C9C", borderRadius: "5px" }}
        name="recipientHealthHistory"
        type="text"
        placeholder="share health history"
        value={formFields.recipientHealthHistory}
        onChange={handleInputChange}
        w={{ base: "full", md: "550px" }}
      />
    </Box>
  </>
);
