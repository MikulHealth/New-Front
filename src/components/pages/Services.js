import React from "react";
import {
  Box,
  Text,
  VStack,
  Image,
  Flex,
  Link,
  Button,
} from "@chakra-ui/react";

const ServicesPage = () => {
  return (
    <VStack align="center" width="75%" h="100vh" spacing={5} p={2} marginLeft="auto" marginRight="auto" marginBottom="20px">
     
      <Text fontSize="32px" fontFamily="body" color="#A210C6" mt={1}>
        Our Services
      </Text>
      <Flex justifyContent="space-between" width="100%">
        <ServiceBox
          title="Elderly Care"
          description="Comprehensive nursing care for elderly individuals, focusing on their unique needs and promoting overall well-being."
          services={[
            "Medication management",
            "Assistance with daily activities",
            "Mobility support",
            "Emotional and companionship support",
          ]}
        />
        <ServiceBox
          title="Post Partum Care"
          description="Specialized care for new mothers during the postpartum period, providing support for physical and emotional recovery."
          services={[
            "Monitoring maternal health",
            "Newborn care guidance",
            "Assistance with breastfeeding",
            "Emotional support",
          ]}
        />
      </Flex>
      <Flex justifyContent="space-between" width="100%" >
        <ServiceBox
          title="Recovery Care"
          description="Dedicated nursing care for individuals recovering from surgeries, illnesses, or injuries, focusing on a smooth recovery process."
          services={[
            "Wound care",
            "Pain management",
            "Physical therapy support",
            "Medication monitoring",
          ]}
        />
        <ServiceBox 
          title="Palliative Care"
          description="Holistic and compassionate care for individuals facing serious illnesses, focusing on improving the quality of life and providing comfort."
          services={[
            "Symptom management",
            "Emotional and spiritual support",
            "Family counseling",
            "End-of-life planning",
          ]}
        />
      </Flex>
    </VStack>
  );
};

const ServiceBox = ({ title, description, services }) => {
    return (
      <Box bg="#F6E4FC"  h="auto" borderRadius="4px" p={5} style={{ minHeight: "250px", width: "600px" }}>
        <Text fontSize="20px" fontFamily="body" color="#A210C6" mt={3} ml={3}>
          {title}
        </Text>
        <Text ml={3} fontSize="16px">
          {description}
        </Text>
        <VStack align="start" ml={3} spacing={1} mt={2}>
          {services.map((service, index) => (
            <Text key={index} fontSize="14px">
              - {service}
            </Text>
          ))}
        </VStack>
        <Link ml={3} fontSize="16px" fontStyle="italic" mt={2}>
          <Button colorScheme="purple">Book Now</Button>
        </Link>
      </Box>
    );
  };
  

export default ServicesPage;
