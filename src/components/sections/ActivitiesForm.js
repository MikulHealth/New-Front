import React from "react";
import { FormControl, FormLabel, VStack, Checkbox } from "@chakra-ui/react";

const ActivitiesForm = ({ activities, handleCheckboxChange }) => (
  <FormControl isRequired>
    <FormLabel fontSize={{ base: "18px", md: "20px" }} fontWeight="bold">
      Activities of Daily Living
    </FormLabel>
    <VStack align="start">
      <Checkbox name="Tub bath/shower assistance" onChange={handleCheckboxChange}>
        Tub bath/shower assistance
      </Checkbox>
      <Checkbox name="Bed bath/sink bath" onChange={handleCheckboxChange}>
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
      <Checkbox name="Dress assistance" onChange={handleCheckboxChange}>
        Dress assistance
      </Checkbox>
      <Checkbox name="Body massage" onChange={handleCheckboxChange}>
        Body massage
      </Checkbox>
      <Checkbox name="Wound care/dressing" onChange={handleCheckboxChange}>
        Wound care/dressing
      </Checkbox>
      <Checkbox name="Catheter care" onChange={handleCheckboxChange}>
        Catheter care
      </Checkbox>
      <Checkbox name="Ostomy care" onChange={handleCheckboxChange}>
        Ostomy care
      </Checkbox>
      <Checkbox name="Feed client" onChange={handleCheckboxChange}>
        Feed client
      </Checkbox>
      <Checkbox name="Served urinal or bed pan" onChange={handleCheckboxChange}>
        Served urinal or bed pan
      </Checkbox>
      <Checkbox name="Assisted to toilet or commode" onChange={handleCheckboxChange}>
        Assisted to toilet or commode
      </Checkbox>
      <Checkbox name="Diaper change" onChange={handleCheckboxChange}>
        Diaper change
      </Checkbox>
      <Checkbox name="Assistance with transfer to bed, chair or wheelchair" onChange={handleCheckboxChange}>
        Assistance with transfer to bed, chair or wheelchair
      </Checkbox>
    </VStack>
  </FormControl>
);

export default ActivitiesForm;
