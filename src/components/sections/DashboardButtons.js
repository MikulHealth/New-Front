import React from "react";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";

import BookIcon from "../../assets/BookIcon.svg";
import Beneficiary from "../../assets/Beneficiaries.svg";
import Services from "../../assets/Services.svg";
import CustomService from "../../assets/CustomizeService.svg";
import Report from "../../assets/MedicalReport.svg";

const DashboardButtons = ({
  handleOpenAppointmentModal,
  handleBeneficiariesButtonClick,
  handleOpenMedicalReportsModal,
  noPendingAppointments,
  activeAppointments,
  completedAppointments,
}) => {
  return (
    <>
      <Box marginTop="-10px">
        <Flex>
          <Box
            style={{ boxShadow: "0px 4px 8px rgba(162, 16, 198, 0.4)" }}
            bg="#DCFFEB"
            // bg="linear-gradient(80deg, #DCFFEB, #27AE60)"
            h={{ base: "125px", md: "150px" }}
            mt={{ base: "4", md: "0" }}
            w={{ base: "180px", md: "340px" }}
            borderRadius="10px"
          >
            <Box
              pt={{ base: "10px", md: "" }}
              display={{ base: "block", md: "flex" }}
              alignItems="center"
            >
              <Image
                src={BookIcon}
                margin={{ base: "10px", md: "15px" }}
                w={{ base: "25px", md: "60px" }}
                h={{ base: "25px", md: "60px" }}
                borderRadius="100px"
              />
              <Box
                mt={{ base: "-35px", md: "0" }}
                ml={{ base: "45px", md: "0" }}
                justifyItems="center"
              >
                <Text
                  textAlign="left"
                  fontSize={{ base: "14px", md: "20px" }}
                  fontFamily="heading"
                  color="black"
                >
                  Book appointment
                </Text>
                <Text
                  textAlign="left"
                  fontSize={{ base: "10px", md: "14px" }}
                  fontFamily="body"
                >
                  Schedule your appointment
                </Text>
              </Box>
            </Box>
            <Text
              fontSize={{ base: "12px", md: "14px" }}
              fontWeight="bold"
              fontFamily="body"
              textAlign="center"
              style={{
                marginTop: "15px",
                fontStyle: "italic",
                cursor: "pointer",
                transition: "transform 0.3s ease-in-out",
              }}
              color="#075C1A"
              onClick={handleOpenAppointmentModal}
              _hover={{ color: "#A210C6", transform: "translateY(-10px)" }}
            >
              Book now
            </Text>
          </Box>

          <Box
            style={{ boxShadow: "0px 4px 8px rgba(162, 16, 198, 0.4)" }}
            bg="#CFF1F4"
            // bg="linear-gradient(80deg, #CFF1F4, #0A656D)"
            h={{ base: "125px", md: "150px" }}
            mt={{ base: "4", md: "0" }}
            marginLeft="10px"
            w={{ base: "180px", md: "340px" }}
            borderRadius="10px"
          >
            <Box
              display={{ base: "block", md: "flex" }}
              pt={{ base: "10px", md: "" }}
              alignItems="center"
            >
              <Image
                src={Report}
                margin={{ base: "10px", md: "15px" }}
                paddingTopt={{ base: "20px", md: "" }}
                w={{ base: "25px", md: "60px" }}
                h={{ base: "25px", md: "60px" }}
                borderRadius="100px"
              />
              <Box
                mt={{ base: "-35px", md: "5px" }}
                ml={{ base: "45px", md: "0" }}
              >
                <Text
                  textAlign="left"
                  fontSize={{ base: "14px", md: "20px" }}
                  fontFamily="heading"
                  color="black"
                >
                  My medical report
                </Text>
                <Text
                  textAlign="left"
                  fontFamily="body"
                  fontSize={{ base: "10px", md: "14px" }}
                >
                  All your medical reports
                </Text>
              </Box>
            </Box>
            <Text
              fontSize={{ base: "12px", md: "14px" }}
              fontWeight="bold"
              fontFamily="body"
              textAlign="center"
              onClick={handleOpenMedicalReportsModal}
              style={{
                marginTop: "15px",
                fontStyle: "italic",
                cursor: "pointer",
                transition: "transform 0.3s ease-in-out",
              }}
              color="#0A656D"
              _hover={{ color: "#A210C6", transform: "translateY(-10px)" }}
            >
              View reports
            </Text>
          </Box>
        </Flex>
        <Flex mt={{ base: "", md: "20px" }}>
          <Box
            style={{ boxShadow: "0px 4px 8px rgba(162, 16, 198, 0.4)" }}
            bg="#A7C5F2"
            //  bg="linear-gradient(80deg, #CCF0FE, #2295F2)"
            h={{ base: "125px", md: "150px" }}
            mt={{ base: "3", md: "0" }}
            w={{ base: "180px", md: "340px" }}
            borderRadius="10px"
          >
            <Box display={{ base: "block", md: "flex" }} alignItems="center">
              <Image
                src={Services}
                margin={{ base: "10px", md: "15px" }}
                w={{ base: "25px", md: "60px" }}
                h={{ base: "25px", md: "60px" }}
                borderRadius="100px"
              />
              <Box
                pt={{ base: "10px", md: "0" }}
                mt={{ base: "-35px", md: "0" }}
                ml={{ base: "45px", md: "0" }}
              >
                <Text
                  textAlign="left"
                  fontSize={{ base: "14px", md: "20px" }}
                  fontFamily="heading"
                  color="black"
                >
                  Our services
                </Text>
                <Text
                  textAlign="left"
                  fontFamily="body"
                  fontSize={{ base: "10px", md: "14px" }}
                >
                  Explore a variety of our services
                </Text>
              </Box>
            </Box>
            <NavLink to="/services">
              <Text
                fontSize={{ base: "12px", md: "14px" }}
                fontWeight="bold"
                fontFamily="body"
                textAlign="center"
                style={{
                  marginTop: "10px",
                  fontStyle: "italic",
                  cursor: "pointer",
                  transition: "transform 0.3s ease-in-out",
                }}
                color="#1C5DBE"
                _hover={{ color: "#A210C6", transform: "translateY(-10px)" }}
              >
                View services
              </Text>
            </NavLink>
          </Box>
          <Box
            style={{ boxShadow: "0px 4px 8px rgba(162, 16, 198, 0.4)" }}
            bg="#F1ECFE"
            //  bg="linear-gradient(80deg, #F1ECFE, #753FF6)"
            h={{ base: "125px", md: "150px" }}
            mt={{ base: "4", md: "0" }}
            w={{ base: "180px", md: "340px" }}
            marginLeft="10px"
            borderRadius="10px"
          >
            <Box display={{ base: "block", md: "flex" }} alignItems="center">
              <Image
                src={CustomService}
                margin={{ base: "10px", md: "15px" }}
                w={{ base: "25px", md: "60px" }}
                h={{ base: "25px", md: "60px" }}
                borderRadius="100px"
              />
              <Box
                mt={{ base: "-35px", md: "10px" }}
                ml={{ base: "45px", md: "0" }}
              >
                <Text
                  mt={{ base: "2px", md: "5px" }}
                  textAlign="left"
                  fontSize={{ base: "14px", md: "20px" }}
                  fontFamily="heading"
                  color="black"
                >
                  Custom plans
                </Text>
                <Text
                  textAlign="left"
                  fontSize={{ base: "10px", md: "14px" }}
                  fontFamily="body"
                >
                  Choose a service you want, how and when you want it
                </Text>
              </Box>
            </Box>
            <NavLink to="/customize-service">
              <Text
                fontSize={{ base: "12px", md: "14px" }}
                fontWeight="bold"
                fontFamily="body"
                textAlign="center"
                style={{
                  marginTop: "10px",
                  fontStyle: "italic",
                  cursor: "pointer",
                  transition: "transform 0.3s ease-in-out",
                }}
                color="#6C0B84"
                _hover={{ color: "#A210C6", transform: "translateY(-10px)" }}
              >
                Customize service
              </Text>
            </NavLink>
          </Box>
        </Flex>
        <Box
          style={{ boxShadow: "0px 4px 8px rgba(162, 16, 198, 0.4)" }}
          bg="#E7F6FF"
          //  bg="linear-gradient(80deg, #E7F6FF, #2295F2)"
          h={{ base: "125px", md: "150px" }}
          mt={{ base: "20px", md: "20px" }}
          mb={{ base: "-10px", md: "30px" }}
          w={{ base: "180px", md: "340px" }}
          borderRadius="10px"
          onClick={handleBeneficiariesButtonClick}
        >
          <Box display={{ base: "block", md: "flex" }} alignItems="center">
            <Image
              src={Beneficiary}
              margin={{ base: "10px", md: "15px" }}
              w={{ base: "25px", md: "60px" }}
              h={{ base: "25px", md: "60px" }}
              borderRadius="100px"
            />
            <Box
              mt={{ base: "-35px", md: "15px" }}
              ml={{ base: "45px", md: "0" }}
            >
              <Text
                textAlign="left"
                fontSize={{ base: "14px", md: "20px" }}
                fontFamily="heading"
                color="black"
              >
                Beneficiaries
              </Text>
              <Text
                textAlign="left"
                fontFamily="body"
                fontSize={{ base: "10px", md: "14px" }}
              >
                Your friends and family as Beneficiaries
              </Text>
            </Box>
          </Box>
          <Text
            fontSize={{ base: "12px", md: "14px" }}
            textAlign="center"
            fontWeight="bold"
            fontFamily="body"
            style={{
              marginTop: "10px",
              fontStyle: "italic",
              cursor: "pointer",
              transition: "transform 0.3s ease-in-out",
            }}
            color="#2295F2"
            _hover={{ color: "#A210C6", transform: "translateY(-10px)" }}
          >
            View all
          </Text>
        </Box>
      </Box>
    </>
  );
};

export default DashboardButtons;
