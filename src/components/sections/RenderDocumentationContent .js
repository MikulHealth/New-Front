import React from "react";
import { DrawerBody, VStack, Text, UnorderedList, ListItem } from "@chakra-ui/react";

const RenderDocumentationContent = () => (
  <DrawerBody overflowY="auto">
    <VStack fontFamily="body" align="start" spacing={4}>
      <Text fontWeight="bold">Follow these steps to submit the patient report:</Text>
      <Text>
        Reports should be made at least once a day at the end of the day
        (shift) for healthy patients, and twice a day (morning and evening)
        for those who are ill. For critically ill patients, reports should
        be made as needed (PRN).
      </Text>
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
    </VStack>
  </DrawerBody>
);

export default RenderDocumentationContent;
