import React from "react";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import { VStack, Box, Flex, Image, Text } from "@chakra-ui/react";
import logo from "../../assets/LogoColoured.svg";
import AppointmentsIcon from "../../assets/AppointmentIcon.svg";
import HomeIcon from "../../assets/HomeWhite.svg";
import Wallet from "../../assets/Wallet.svg";
import serviceIcon from "../../assets/ServiceIcon.svg";
import SettingsIcon from "../../assets/SettingsIcon.svg";
import LogoutIcon from "../../assets/Logout.svg";

const LeftSideBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleConfirmLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("phoneNumber");
    navigate("/");
  };

  const NavLinkWithBackground = ({ icon, text, to, isActiveCondition }) => {
    const isActive = isActiveCondition || location.pathname === to;
    return (
      <NavLink to={to}>
        <Flex
          borderRadius="10px"
          align="center"
          height="50px"
          width="170px"
          background={isActive ? "#A210C6" : "transparent"}
          color={isActive ? "white" : "inherit"}
          paddingLeft="10px"
        >
          <Image src={icon} alt={text} boxSize="24px" marginRight="10px" />
          <Text fontSize="16px">{text}</Text>
        </Flex>
      </NavLink>
    );
  };

  const settingsPaths = [
    "/settings",
    "/settings/edit-profile",
    "/settings/change-password",
    "/settings/notification-settings",
    "/settings/help",
  ];

  return (
    <>
      <Box
        display={{ base: "none", lg: "block" }}
        position="fixed"
        width="16%"
        p={3}
        h="100vh"
        ml="30px"
      >
        <Image src={logo} alt="Logo" w="160px" h="60px" ml="20px" mt="10px" />
        <VStack mt="45px" align="left" spacing={5}>
          <NavLinkWithBackground icon={HomeIcon} text="Home" to="/dashboard" />
          <NavLinkWithBackground
            icon={AppointmentsIcon}
            text="Appointments"
            to="/appointment"
          />
          <NavLinkWithBackground icon={Wallet} text="Wallet" to="/wallet" />
          <NavLinkWithBackground
            icon={serviceIcon}
            text="Services"
            to="/services"
          />
          <NavLinkWithBackground
            icon={SettingsIcon}
            text="Settings"
            to="/settings"
            isActiveCondition={settingsPaths.includes(location.pathname)}
          />

          <Box ml="10px" marginTop="70px" onClick={handleConfirmLogout}>
            <Flex
              style={{
                cursor: "pointer",
              }}
              align="center"
              color="#A210C6"
            >
              <Image
                src={LogoutIcon}
                alt="logout"
                boxSize="24px"
                marginRight="10px"
              />
              <Text fontSize="16px">Logout</Text>
            </Flex>
          </Box>
        </VStack>

        <Box
          borderRight="2px solid #A210C6"
          height="100%"
          position="absolute"
          right="0"
          mt="-566"
        />
      </Box>
    </>
  );
};

export default LeftSideBar;
