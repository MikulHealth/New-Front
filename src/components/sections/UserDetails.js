import React, { useState, useEffect } from "react";
import { GetCurrentUser } from "../../apiCalls/UserApis";
import { useNavigate } from "react-router-dom";
import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  VStack,
  Flex,
  Text,
  Divider,
  DrawerFooter,
  IconButton,
  extendTheme,
  Avatar,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import EditProfileModal from "./EditUser";



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

const UserDetailsDrawer = ({ isOpen, onClose }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (localStorage.getItem("token")) {
        try {
           const response = await GetCurrentUser();

          if (response.success) {
            setUser(response.data);
          } else {
            console.error("API request failed:", response.error);
          }
        } catch (error) {
          console.error("Error in GetCurrentUser API:", error);
        }
      } else {
        navigate("/login");
      }
    };

    fetchData();
  }, [navigate]);

  const [isEditModalOpen, setEditModalOpen] = useState(false);

  const handleEditClick = () => {
    navigate("/edit-profile");
    onClose();
  };

  const handleEditModalClose = () => {
    setEditModalOpen(false);
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = new Date(dateString).toLocaleDateString(
      undefined,
      options
    );
    return formattedDate;
  };

  return (
    <>
      <Drawer  theme={customTheme} isOpen={isOpen} onClose={onClose} size={{ base: "xm", md: "lg" }}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            fontFamily="heading"
            color="#A210C6"
          >
            Profile Details
            <IconButton
              icon={<CloseIcon />}
              onClick={onClose}
              aria-label="Close drawer"
            />
          </DrawerHeader>
          <DrawerBody>
            <Flex
              justifyContent="center"
              display={{ base: "block", md: "flex" }}
            >
              <Avatar
                src={user?.image}
                color="white"
                alt="User Image"
                borderRadius="8px"
                ml={{ base: "85px", md: "10px" }}
                h={{ base: "260px", md: "55vh" }}
                w={{ base: "200px", md: "20vw" }}
                marginTop="40px"
                bg="#A210C6"
              ></Avatar>
              <VStack
                ml={{ md: "20px" }}
                mt={{ base: "30px", md: "70px" }}
                align="center"
                spacing={4}
              >
                <Text  fontFamily="heading">
                  Name:{" "}
                  <Text
                   fontFamily="body"
                    as="span"
                    fontWeight="bold"
                  >{`${user?.firstName} ${user?.lastName}`}</Text>
                </Text>
                {/* <Divider my={1} borderColor="gray.500" />
                <Text>
                  Home address:{" "}
                  <Text as="span" fontWeight="bold">{`${user?.address}`}</Text>
                </Text> */}
                <Divider my={1} borderColor="gray.500" />
                <Text  fontFamily="heading">
                  Email:{" "}
                  <Text  fontFamily="body" as="span" fontWeight="bold">{`${user?.email}`}</Text>
                </Text>
                <Divider my={1} borderColor="gray.500" />
                <Text  fontFamily="heading">
                  Phone Number:{" "}
                  <Text
                   fontFamily="body"
                    as="span"
                    fontWeight="bold"
                  >{`${user?.phoneNumber}`}</Text>
                </Text>
                <Divider my={1} borderColor="gray.500" />
                <Text  fontFamily="heading">
                  Date of birth:{" "}
                  <Text  fontFamily="body" as="span" fontWeight="bold">{`${formatDate(
                    user?.dob
                  )}`}</Text>
                </Text>
                <Divider my={1} borderColor="gray.500" />
                <Text  fontFamily="heading">
                  Gender:{" "}
                  <Text  fontFamily="body" as="span" fontWeight="bold">{`${user?.gender}`}</Text>
                </Text>
                <Divider my={1} borderColor="gray.500" />
              </VStack>
            </Flex>
          </DrawerBody>
          <DrawerFooter>
            <Text
              fontSize="19px"
              marginRight="20px"
              onClick={handleEditClick}
              fontFamily="heading"
              style={{
                color: "#A210C6",
                fontStyle: "italic",
                cursor: "pointer",
              }}
              _hover={{ color: "#A210C6" }}
            >
              Edit Profile
            </Text>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={handleEditModalClose}
      />
    </>
  );
};

export default UserDetailsDrawer;
