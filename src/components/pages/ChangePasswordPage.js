import React, { useState } from "react";
import LeftSideBar from "../authLayouts/LeftSideBar";
import { useNavigate } from "react-router-dom";
import NavBar from "../authLayouts/NavBar";
import "react-datepicker/dist/react-datepicker.css";
import {
  ChakraProvider,
  VStack,
  Input,
  Button,
  useToast,
  InputGroup,
  InputRightElement,
  Box,
  Text,
  IconButton,
  Flex,
  FormControl,
  FormLabel,
  extendTheme,
} from "@chakra-ui/react";
import { HiEye, HiEyeOff } from "react-icons/hi";
import SettingsSideBar from "../authLayouts/SettingsSideBar";
import MobileFooter from "../authLayouts/MobileFooter";

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

const ChangePasswordPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleToggleOldPassword = () => {
    setShowOldPassword(!showOldPassword);
  };

  const handleToggleNewPassword = () => {
    setShowNewPassword(!showNewPassword);
  };

  const handleToggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleOldPasswordChange = (e) => {
    setOldPassword(e.target.value);
  };

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const validate = (values) => {
    let errors = {};

    if (!values.oldPassword) errors.oldPassword = "*Required";

    if (!values.newPassword) errors.newPassword = "*Required";
    else if (
      !/(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}/.test(
        values.newPassword
      )
    )
      errors.newPassword =
        "Password must contain at least one uppercase letter, one number, one special character, and be at least 8 characters long";

    if (!values.confirmPassword) errors.confirmPassword = "*Required";
    else if (
      !/(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}/.test(
        values.confirmPassword
      )
    )
      errors.confirmPassword =
        "Password must contain at least one uppercase letter, one number, one special character, and be at least 8 characters long";

    if (values.newPassword !== values.confirmPassword)
      errors.confirmPassword = "Password do not match";

    return errors;
  };

  const handleSaveChanges = async () => {
    // Validate passwords
    const validationErrors = validate({
      oldPassword,
      newPassword,
      confirmPassword,
    });

    if (Object.keys(validationErrors).length > 0) {
      // Display validation errors using toast messages
      Object.values(validationErrors).forEach((error) => {
        toast({
          title: "Validation Error",
          description: error,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
      return;
    }

    // API call to update the password
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        "http://localhost:8080/v1/angel/change-password",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            oldPassword,
            newPassword,
            confirmPassword,
          }),
        }
      );

      const responseData = await response.json(); // Parse the response JSON

      if (response.ok && responseData.success) {
        toast({
          title: "Password Updated",
          description: response.message,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } else {
        console.error("API error:", responseData.message);
        toast({
          title: "Password reset failed",
          description: responseData.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Network error:", error.message);
      toast({
        title: "Network Error",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }

    // Reset the form fields after saving changes
    // setOldPassword("");
    // setNewPassword("");
    // setConfirmPassword("");
  };

  const settingsContainerStyle = {
    animation: "slideInUp 0.9s ease-in-out",
  };

  const handleback = () => {
    navigate("/settings");
  };

  return (
    <ChakraProvider theme={customTheme}>
      <LeftSideBar />
      <VStack
        style={settingsContainerStyle}
        position="fixed"
        ml={{ base: "40px", md: "280px" }}
        w="70%"
        h="100vh"
      >
        <NavBar />
        <Flex
          display={{ base: "none", md: "flex" }}
          mt={{ md: "30px" }}
          ml={{ base: "50px", md: "-250px" }}
        >
          <SettingsSideBar />
          <Box className="change-password" p={3}>
            {" "}
            <VStack w="30vw" marginLeft="10px">
              <Text
                textAlign="left"
                fontSize={{ base: "12px" }}
                marginTop="3px"
                marginBottom="20px"
              >
                Change Password
              </Text>

              <FormControl>
                <FormLabel>Old Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showOldPassword ? "text" : "password"}
                    value={oldPassword}
                    onChange={handleOldPasswordChange}
                    borderColor="black"
                    _hover={{ color: "" }}
                  />

                  <InputRightElement width="4.5rem">
                    <IconButton
                      h="1.75rem"
                      size="sm"
                      onClick={handleToggleOldPassword}
                      icon={showConfirmPassword ? <HiEyeOff /> : <HiEye />}
                    />
                    {/* <Button
                      h="1.75rem"
                      size="sm"
                      onClick={handleToggleOldPassword}
                      bg="gray"
                      color="white"
                    >
                      {showOldPassword ? "Hide" : "Show"}
                    </Button> */}
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <FormControl>
                <FormLabel>New Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={handleNewPasswordChange}
                    borderColor="black"
                    _hover={{ color: "" }}
                  />
                  <InputRightElement width="4.5rem">
                    <IconButton
                      h="1.75rem"
                      size="sm"
                      onClick={handleToggleNewPassword}
                      icon={showConfirmPassword ? <HiEyeOff /> : <HiEye />}
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <FormControl>
                <FormLabel>Confirm New Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    borderColor="black"
                    _hover={{ color: "" }}
                  />
                  <InputRightElement width="4.5rem">
                    <IconButton
                      h="1.75rem"
                      size="sm"
                      onClick={handleToggleConfirmPassword}
                      icon={showConfirmPassword ? <HiEyeOff /> : <HiEye />}
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <Button color="white" bg="#A210C6" onClick={handleSaveChanges}>
                Save Changes
              </Button>
            </VStack>
          </Box>
        </Flex>

        <Flex
          display={{ base: "block", md: "none" }}
          w="100%"
          mt={{ base: "20px" }}
        >
          <Flex justifyContent="space-between">
            <Box>
              <Text
                textAlign="left"
                fontSize={{ base: "18px" }}
                marginTop="3px"
              >
                Change Password
              </Text>
            </Box>
            <Button
              onClick={handleback}
              borderColor="#A210C6"
              borderWidth="1px"
              color="#A210C6"
              fontFamily="body"
              _hover={{ color: "" }}
              fontSize={{ base: "12px" }}
              h="3vh"
              borderRadius="100px"
            >
              Back
            </Button>
          </Flex>
          <Box className="change-password" p={3}>
            {" "}
            <VStack ml="15px" w="100%">
              <FormControl w="280px">
                <FormLabel>Old Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showOldPassword ? "text" : "password"}
                    value={oldPassword}
                    onChange={handleOldPasswordChange}
                    borderColor="black"
                    _hover={{ color: "" }}
                  />

                  <InputRightElement width="4.5rem">
                    <IconButton
                      h="1.75rem"
                      size="sm"
                      onClick={handleToggleOldPassword}
                      icon={showConfirmPassword ? <HiEyeOff /> : <HiEye />}
                    />
                    {/* <Button
                      h="1.75rem"
                      size="sm"
                      onClick={handleToggleOldPassword}
                      bg="gray"
                      color="white"
                    >
                      {showOldPassword ? "Hide" : "Show"}
                    </Button> */}
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <FormControl w="280px">
                <FormLabel>New Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={handleNewPasswordChange}
                    borderColor="black"
                    _hover={{ color: "" }}
                  />
                  <InputRightElement width="4.5rem">
                    <IconButton
                      h="1.75rem"
                      size="sm"
                      onClick={handleToggleNewPassword}
                      icon={showConfirmPassword ? <HiEyeOff /> : <HiEye />}
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <FormControl w="280px">
                <FormLabel>Confirm New Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    borderColor="black"
                    _hover={{ color: "" }}
                  />
                  <InputRightElement width="4.5rem">
                    <IconButton
                      h="1.75rem"
                      size="sm"
                      onClick={handleToggleConfirmPassword}
                      icon={showConfirmPassword ? <HiEyeOff /> : <HiEye />}
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <Button
                marginTop="20px"
                color="white"
                bg="#A210C6"
                onClick={handleSaveChanges}
              >
                Save Changes
              </Button>
            </VStack>
          </Box>
        </Flex>
        <MobileFooter />
      </VStack>
    </ChakraProvider>
  );
};
export default ChangePasswordPage;
