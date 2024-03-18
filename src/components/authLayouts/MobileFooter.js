import React from "react";
import { Flex, Image, Text, VStack, useDisclosure } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import HomeIcon from "../../assets/HomeBlack.svg";
import AppointmentsIcon from "../../assets/AppointmentIcon.svg";
import WalletIcon from "../../assets/Wallet.svg";
import HelpIcon from "../../assets/HelppIcon.svg";
import LogoutModal from "../sections/LogoutModal";


const MobileFooter = () => {
  const { isOpen, onClose } = useDisclosure();
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

  return (
    <>
      {/* <HelpMobile /> */}
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
        <NavLink to="/dashboard" style={listItemStyle}>
          <VStack>
            <Image src={HomeIcon} alt="home" style={iconStyle} />
            <Text>Home</Text>
          </VStack>
        </NavLink>

        <NavLink to="/appointment" style={listItemStyle}>
          <VStack>
            <Image
              src={AppointmentsIcon}
              alt="appointments"
              style={iconStyle}
            />
            <Text>Appointments</Text>
          </VStack>
        </NavLink>

        <NavLink to="/wallet" style={listItemStyle}>
          <VStack>
            <Image src={WalletIcon} alt="wallet" style={iconStyle} />
            <Text>Wallet</Text>
          </VStack>
        </NavLink>

        <NavLink to="/help" style={listItemStyle}>
          <VStack>
            <Image src={HelpIcon} alt="Help" style={iconStyle} />
            <Text>Help</Text>
          </VStack>
        </NavLink>
      </Flex>

      <LogoutModal isOpen={isOpen} onClose={onClose} />
    </>
  );
};

export default MobileFooter;
