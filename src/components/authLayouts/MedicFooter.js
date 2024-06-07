import React from "react";
import { Flex, Image, Text, VStack, useDisclosure } from "@chakra-ui/react";
import HomeIcon from "../../assets/HomeBlack.svg";
import AppointmentsIcon from "../../assets/AppointmentIcon.svg";
import WalletIcon from "../../assets/Wallet.svg";
import SettingsIcon from "../../assets/SettingsIcon.svg";
import LogoutModal from "../sections/LogoutModal";
import { NavLink, useLocation } from "react-router-dom";
const MedicMobileFooter = () => {
  const { isOpen, onClose } = useDisclosure();
  const location = useLocation();
  const listItemStyle = {
    fontStyle: "body",
    fontSize: "14px",
    textAlign: "center",
    marginBottom: "5px",
  };

  const iconStyle = {
    height: "24px",
    width: "24px",
  };

  const activeStyle = {
    textDecoration: "underline",
    color: "#A210C6",
  };

  return (
    <>
      <Flex
        display={{ base: "flex", lg: "none" }}
        justifyContent="space-around"
        position="fixed"
        bottom="0"
        left="0"
        right="0"
        bg="white"
        borderTop="1px solid #E2E8F0"
        paddingY={3}
        paddingX={4}
      >
        <NavLink to="/medic-dashboard" style={listItemStyle}>
          <VStack>
            <Image src={HomeIcon} alt="home" style={iconStyle} />
            <Text
              color={location.pathname === "/medic-dashboard" ? "#A210C6" : ""}
              fontWeight={location.pathname === "/medic-dashboard" ? "bold" : ""}
              textDecoration={
                location.pathname === "/medic-dashboard" ? "underline" : ""
              }
            >
              Home
            </Text>
          </VStack>
        </NavLink>

        <NavLink
          to="/medic-appointment"
          style={listItemStyle}
          activeStyle={activeStyle}
        >
          <VStack>
            <Image
              src={AppointmentsIcon}
              alt="appointments"
              style={iconStyle}
            />
            <Text
              color={location.pathname === "/medic-appointment" ? "#A210C6" : ""}
              fontWeight={location.pathname === "/medic-appointment" ? "bold" : ""}
              textDecoration={
                location.pathname === "/medic-appointment" ? "underline" : ""
              }
            >
              Appointments
            </Text>
          </VStack>
        </NavLink>

        <NavLink to="/medic-wallet" style={listItemStyle} activeStyle={activeStyle}>
          <VStack>
            <Image src={WalletIcon} alt="wallet" style={iconStyle} />
            <Text
              color={location.pathname === "/medic-wallet" ? "#A210C6" : ""}
              fontWeight={location.pathname === "/medic-wallet" ? "bold" : ""}
              textDecoration={
                location.pathname === "/medic-wallet" ? "underline" : ""
              }
            >
              Wallet
            </Text>
          </VStack>
        </NavLink>

        <NavLink to="/medic-settings" style={listItemStyle} activeStyle={activeStyle}>
          <VStack>
            <Image src={SettingsIcon} alt="Settings" style={iconStyle} />
            <Text
              fontFamily="heading"
              textDecoration={
                location.pathname === "/medic-settings" ||
                location.pathname === "/medic-edit-profile" ||
                location.pathname === "/medic-change-password" ||
                location.pathname === "/medic-notification-settings" ||
                location.pathname === "/help"
                  ? "underline"
                  : ""
              }
              fontWeight={
                location.pathname === "/medic-settings" ||
                location.pathname === "/medic-edit-profile" ||
                location.pathname === "/medic-change-password" ||
                location.pathname === "/medic-notification-settings" ||
                location.pathname === "/help"
                  ? "bold"
                  : ""
              }
              color={
                location.pathname === "/medic-settings" ||
                location.pathname === "/medic-edit-profile" ||
                location.pathname === "/medic-change-password" ||
                location.pathname === "/medic-notification-settings" ||
                location.pathname === "/help"
                  ? "#A210C6"
                  : ""
              }
            >
              Settings
            </Text>
          </VStack>
        </NavLink>
      </Flex>

      <LogoutModal isOpen={isOpen} onClose={onClose} />
    </>
  );
};

export default MedicMobileFooter;
