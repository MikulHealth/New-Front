import React from "react";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import { VStack, Box, Flex, Image, Text } from "@chakra-ui/react";
import logo from "../../assets/LogoColoured.svg";
import AppointmentsIcon from "../../assets/AppointmentIcon.svg";
import AppointmentsIconWh from "../../assets/AppWhite.svg";
import HomeIconWhite from "../../assets/HomeWhite.svg";
import Services from "../../assets/ServiceWhite.svg";
import Wallet from "../../assets/WalletIcon.svg";
import Reports from "../../assets/MedicalReport.svg";
import WalletWh from "../../assets/WalletWhite.svg";
import PatientIcon from "../../assets/PatientsIcon.svg";
import SettingsIconWh from "../../assets/PatientsIconColored.svg";
import SettingsIcon from "../../assets/SettingsIcon.svg";
import LogoutIcon from "../../assets/Logout.svg";
import PatientWH from "../../assets/PatienticonWH.svg";

const AdminSideBar = () => {
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
          background={
            isActive
              ? "linear-gradient(80deg, #A210C6, #E552FF)"
              : "transparent"
          }
          color={isActive ? "white" : "white"}
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
            icon={HomeIconWhite}
            activeIcon={HomeIconWhite}
            text="Home"
            to="/admin"
          />

          <NavLinkWithBackground
            icon={PatientWH}
            activeIcon={PatientWH}
            text="Users"
            to="/mh-users"
          />
          <NavLinkWithBackground
            icon={AppointmentsIconWh}
            activeIcon={AppointmentsIconWh}
            text="Appointments"
            to="/mh-appointment"
          />

          {/* <NavLinkWithBackground
            icon={WalletWh}
            activeIcon={WalletWh}
            text="Wallet"
            to="/medic-wallet"
          /> */}

          {/* <NavLinkWithBackground
            icon={Services}
            activeIcon={Services}
            text="Services "
            to="/admin-services"
          /> */}

          <NavLinkWithBackground
            icon={Services}
            activeIcon={Services}
            text="Medical Reports"
            to="/reports"
          />

          <NavLinkWithBackground
            icon={WalletWh}
            activeIcon={WalletWh}
            text="Finacials"
            to="/finance"
          />

          <NavLinkWithBackground
            icon={SettingsIconWh}
            activeIcon={SettingsIconWh}
            text="Settings"
            to="/admin-settings"
          />

          <Box ml="10px" marginTop="30px" onClick={handleConfirmLogout}>
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
          mt="-600"
        />
      </Box>
    </>
  );
};

export default AdminSideBar;
