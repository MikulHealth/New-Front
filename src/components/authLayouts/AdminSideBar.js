import React, { useState } from "react";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import { VStack, Box, Flex, Text, Collapse, Icon } from "@chakra-ui/react";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { FaUserFriends, FaUserNurse, FaUserShield } from "react-icons/fa"; // For Customers, Medics, and Admins icons
import { AiOutlineHome, AiOutlineCalendar, AiOutlineFileText, AiOutlineWallet, AiOutlineSetting } from "react-icons/ai"; // For other icons
import logo from "../../assets/LogoColoured.svg";
import LogoutIcon from "../../assets/Logout.svg";

const AdminSideBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showUsersSubMenu, setShowUsersSubMenu] = useState(false);

  const handleConfirmLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("phoneNumber");
    navigate("/");
  };

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path);

  const NavLinkWithBackground = ({ icon, text, to, subMenu }) => {
    const active = isActive(to);
    return (
      <NavLink to={to}>
        <Flex
          borderRadius="10px"
          align="center"
          height="50px"
          width="180px"
          background={
            active
              ? "linear-gradient(80deg, #A210C6, #E552FF)"
              : "transparent"
          }
          color={active ? "white" : "white"}
          paddingLeft="10px"
          onClick={subMenu}
        >
          <Icon as={icon} boxSize="24px" marginRight="10px" color={active ? "white" : "white"} />
          <Text fontSize="16px">{text}</Text>
          {subMenu && (
            <Icon
              as={showUsersSubMenu ? ChevronUpIcon : ChevronDownIcon}
              ml="auto"
              mr="10px"
            />
          )}
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
        <img src={logo} alt="Logo" width="160px" height="60px" style={{ marginLeft: '20px', marginTop: '10px' }} />
        <VStack mt="45px" align="left" spacing={5}>
          <NavLinkWithBackground
            icon={AiOutlineHome}
            text="Home"
            to="/admin"
          />

          <NavLinkWithBackground
            icon={FaUserFriends}
            text="Users"
            to="#"
            subMenu={() => setShowUsersSubMenu(!showUsersSubMenu)}
          />

          <Collapse in={showUsersSubMenu || isActive('/users')} animateOpacity>
            <Box textAlign="left" pl="30px">
              <NavLink to="/users/customers">
                <Flex
                  alignItems="center"
                  background={isActive('/users/customers') ? "linear-gradient(80deg, #A210C6, #E552FF)" : "transparent"}
                  borderRadius="10px"
                  p="5px"
                >
                  <Icon as={FaUserFriends} mr={2} color={isActive('/users/customers') ? "white" : "white"} />
                  <Text
                    fontSize="14px"
                    color={isActive('/users/customers') ? "white" : "white"}
                    fontWeight={isActive('/users/customers') ? "bold" : "normal"}
                    textDecoration={isActive('/users/customers') ? "none" : "none"}
                  >
                    Customers
                  </Text>
                </Flex>
              </NavLink>
              <NavLink mt="5px" to="/users/medics">
                <Flex
                  alignItems="center"
                  background={isActive('/users/medics') ? "linear-gradient(80deg, #A210C6, #E552FF)" : "transparent"}
                  borderRadius="10px"
                  p="5px"
                >
                  <Icon as={FaUserNurse} mr={2} color={isActive('/users/medics') ? "white" : "white"} />
                  <Text
                    fontSize="14px"
                    color={isActive('/users/medics') ? "white" : "white"}
                    fontWeight={isActive('/users/medics') ? "bold" : "normal"}
                    textDecoration={isActive('/users/medics') ? "none" : "none"}
                  >
                    Medics
                  </Text>
                </Flex>
              </NavLink>
              <NavLink mt="5px" to="/users/admins">
                <Flex
                  alignItems="center"
                  background={isActive('/users/admins') ? "linear-gradient(80deg, #A210C6, #E552FF)" : "transparent"}
                  borderRadius="10px"
                  p="5px"
                >
                  <Icon as={FaUserShield} mr={2} color={isActive('/users/admins') ? "white" : "white"} />
                  <Text
                    fontSize="14px"
                    color={isActive('/users/admins') ? "white" : "white"}
                    fontWeight={isActive('/users/admins') ? "bold" : "normal"}
                    textDecoration={isActive('/users/admins') ? "none" : "none"}
                  >
                    Admins
                  </Text>
                </Flex>
              </NavLink>
            </Box>
          </Collapse>

          <NavLinkWithBackground
            icon={AiOutlineCalendar}
            text="Appointments"
            to="/appointments"
          />

          <NavLinkWithBackground
            icon={AiOutlineFileText}
            text="Medical Reports"
            to="/admin/medical-reports"
          />

          <NavLinkWithBackground
            icon={AiOutlineWallet}
            text="Financials"
            to="/finance"
          />

          <NavLinkWithBackground
            icon={AiOutlineSetting}
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
              <img src={LogoutIcon} alt="logout" width="24px" height="24px" style={{ marginRight: '10px' }} />
              <Text fontSize="16px">Logout</Text>
            </Flex>
          </Box>
        </VStack>

        <Box
          borderRight="2px solid #A210C6"
          height="150%"
          position="absolute"
          right="0"
          mt="-800"
        />
      </Box>
    </>
  );
};

export default AdminSideBar;
