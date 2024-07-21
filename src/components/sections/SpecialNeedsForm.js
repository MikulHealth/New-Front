import React from "react";
import {
  FormLabel,
  Checkbox,
  CheckboxGroup,
  Box,
  Button,
  extendTheme,
  SimpleGrid,
  Text,
  Flex,
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

const SpecialNeedsForm = ({
  specialNeeds,
  setSpecialNeeds,
  handleSubmit,
  handleBack,
}) => {
  // const [loading, setLoading] = useState(false);
  const specialNeedsCategories = {
    "Mobility Assistance": [
      "Wheelchair User",
      "Walker/Cane Support",
      "Bedridden",
    ],
    "Medical Conditions": [
      "Diabetes Management",
      "Hypertension Management",
      "Cardiovascular Conditions",
      "Respiratory Conditions (e.g., COPD, Asthma)",
      "Neurological Conditions (e.g., Parkinson's Disease, ALS)",
    ],
    "Cognitive/Developmental Conditions": [
      "Alzheimer's Disease",
      "Dementia",
      "Autism Spectrum Disorder",
      "Down Syndrome",
      "Intellectual Disabilities",
    ],
    "Mental Health Support": [
      "Depression",
      "Anxiety Disorders",
      "Bipolar Disorder",
      "Schizophrenia",
    ],
    "Sensory Impairments": ["Vision Impairment", "Hearing Impairment"],
    "Personal Care Needs": [
      "Bathing Assistance",
      "Dressing Assistance",
      "Feeding Assistance",
      "Incontinence Care",
    ],
    "Medication Management": [
      "Medication Reminders",
      "Administering Medication",
    ],
    "Rehabilitation Needs": [
      "Physical Therapy",
      "Occupational Therapy",
      "Speech Therapy",
    ],
    "Nutritional Support": ["Special Diet Requirements", "Tube Feeding"],
    "Post-Surgical Care": ["Wound Care", "Mobility Support", "Pain Management"],
    "Palliative/Hospice Care": [
      "Pain and Symptom Management",
      "Emotional and Spiritual Support",
    ],
    "Postpartum Care": [
      "Newborn Care",
      "Breastfeeding Support",
      "Postpartum Recovery Assistance",
      "Emotional Support for New Mothers",
    ],
    "Nanny Services": [
      "Infant Care",
      "Toddler Care",
      "School-age Child Care",
      "Homework Assistance",
      "Activities and Playtime",
      "Meal Preparation for Children",
      "Bedtime Routine Assistance",
    ],
    "Household Assistance": ["Light Housekeeping", "Warming Food"],
    // "Transportation Assistance": [
    //   "Medical Appointments",
    //   "Errands and Shopping",
    // ],
    Companionship: [
      "Social Interaction",
      "Recreational Activities",
      "Emotional Support",
    ],
  };

  const handleCheckboxChange = (need) => {
    if (specialNeeds.includes(need)) {
      setSpecialNeeds(specialNeeds.filter((item) => item !== need));
    } else {
      setSpecialNeeds([...specialNeeds, need]);
    }
  };

  return (
    <Box theme={customTheme} overflow="scroll" p="40px">
      <Text
        color="#A210C6"
        fontFamily="heading"
        fontWeight="bold"
        fontSize="20px"
         mb="5px"
      >
        Special Needs
      </Text>
      <Text mb="10px" fontSize="md" color="gray.600">
        Please carefully select the special needs that apply to the care
        recipient. Your accurate selections will help us provide the best
        possible care tailored to their needs.
      </Text>
      {Object.entries(specialNeedsCategories).map(([category, needs]) => (
        <Box key={category} mb="20px">
          <FormLabel fontWeight="bold">{category}</FormLabel>
          <CheckboxGroup>
            <SimpleGrid columns={[1, 2]} spacing={2}>
              {needs.map((need) => (
                <Checkbox
                  key={need}
                  isChecked={specialNeeds.includes(need)}
                  onChange={() => handleCheckboxChange(need)}
                >
                  {need}
                </Checkbox>
              ))}
            </SimpleGrid>
          </CheckboxGroup>
        </Box>
      ))}
      <Flex justify="space-between" mt="20px">
        <Button onClick={handleBack} bg="gray.400" color="white">
          Back
        </Button>
        <Button
          // isLoading={loading}
          // loadingText="Processing..."
          onClick={handleSubmit}
          // bg="#A210C6"
          bg="linear-gradient(80deg, #A210C6, #E552FF)"
          color="white"
        >
          {/* {loading ? "Processing..." : "Submit"} */}
          Submit
        </Button>
      </Flex>
    </Box>
  );
};

export default SpecialNeedsForm;
