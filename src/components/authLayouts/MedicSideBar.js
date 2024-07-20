import React from "react";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import { VStack, Box, Flex, Image, Text } from "@chakra-ui/react";
import logo from "../../assets/LogoColoured.svg";
import AppointmentsIcon from "../../assets/AppointmentIcon.svg";
import AppointmentsIconWh from "../../assets/AppWhite.svg";
import HomeIconWhite from "../../assets/HomeWhite.svg";
import HomeIconBlack from "../../assets/HomeBlack.svg";
import Wallet from "../../assets/Wallet.svg";
import WalletWh from "../../assets/WalletWhite.svg";
import PatientIcon from "../../assets/PatientsIcon.svg";
import SettingsIconWh from "../../assets/PatientsIconColored.svg";
import SettingsIcon from "../../assets/SettingsIcon.svg";
import LogoutIcon from "../../assets/Logout.svg";
import PatientWH from "../../assets/PatienticonWH.svg"

const MedicSideBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleConfirmLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("phoneNumber");
    navigate("/");
  };

  const NavLinkWithBackground = ({ icon, activeIcon, text, to }) => {
    const isActive = location.pathname === to;
    return (
      <NavLink to={to}>
        <Flex
          borderRadius="10px"
          align="center"
          height="50px"
          width="170px"
          background={isActive ? "linear-gradient(80deg, #A210C6, #E552FF)" : "transparent"}
          color={isActive ? "white" : "inherit"}
          paddingLeft="10px"
        >
          <Image
            src={isActive ? activeIcon : icon}
            alt={text}
            boxSize="24px"
            marginRight="10px"
          />
          <Text fontSize="16px">{text}</Text>
        </Flex>
      </NavLink>
    );
  };

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
          <NavLinkWithBackground
            icon={HomeIconBlack}
            activeIcon={HomeIconWhite}
            text="Home"
            to="/medic-dashboard"
          />

          <NavLinkWithBackground
            icon={PatientIcon}
            activeIcon={PatientWH}
            text="Patients"
            to="/patients"
          />
          <NavLinkWithBackground
            icon={AppointmentsIcon}
            activeIcon={AppointmentsIconWh}
            text="Appointments"
            to="/medic-appointment"
          />

          <NavLinkWithBackground
            icon={Wallet}
            activeIcon={WalletWh}
            text="Wallet"
            to="/medic-wallet"
          />

          <NavLinkWithBackground
            icon={SettingsIcon}
            activeIcon={SettingsIconWh}
            text="Settings"
            to="/medic-settings"
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

export default MedicSideBar;
