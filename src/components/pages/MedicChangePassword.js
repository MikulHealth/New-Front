import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import { WarningIcon } from "@chakra-ui/icons";
import {
  ChakraProvider,
  VStack,
  Input,
  Button,
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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MedicSettingsSideBar from "../authLayouts/MedicSettingsSidebar";
import MedicNavBar from "../authLayouts/MedicNavBar";
import MedicMobileFooter from "../authLayouts/MedicFooter";
import MedicSideBar from "../authLayouts/MedicSideBar";

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

const MedicChangePasswordPage = () => {
  const navigate = useNavigate();
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
        // "http://localhost:8080/v1/angel/change-password",
        "https://backend-c1pz.onrender.com/v1/angel/change-password",
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

      const responseData = await response.json();

      if (response.ok && responseData.success) {
        toast.success("Password changed, Kindly login with the new password");
        setTimeout(() => {
          navigate("/login");
        }, 5000);
      } else {
        console.error("API error:", responseData.message);
        toast.error("Password reset failed");
      }
    } catch (error) {
      console.error("Network error:", error.message);
      toast.error("Network error");
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
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <MedicSideBar/>
      <VStack
        style={settingsContainerStyle}
        position="fixed"
        ml={{ base: "40px", md: "280px" }}
        w="70%"
        h="100vh"
      >
        <MedicNavBar/>
        <Flex
          display={{ base: "none", md: "flex" }}
          mt={{ md: "30px" }}
          ml={{ base: "50px", md: "-250px" }}
        >
          <MedicSettingsSideBar/>
          <Box className="change-password" p={3}>
            {" "}
            <VStack w="30vw" marginLeft="10px">
              <WarningIcon mb="5px" w={10} h={10} color="yellow.400" />
              <Text  fontFamily="body" textAlign="left">
                Please note, you will have to log in again after reseting your
                password.
              </Text>

              <Text
                textAlign="left"
                fontSize={{ base: "12px", md: "20px" }}
                marginTop="3px"
                marginBottom="20px"
                fontFamily="heading"
              >
                Change Password
              </Text>

              <FormControl>
                <FormLabel  fontFamily="body">Old Password</FormLabel>
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
                <FormLabel  fontFamily="body">New Password</FormLabel>
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
                <FormLabel  fontFamily="body">Confirm New Password</FormLabel>
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

              <Button  fontFamily="body" color="white" bg="#A210C6" onClick={handleSaveChanges}>
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
                fontFamily="heading"
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
          <WarningIcon ml="10px" mb="5px" w={10} h={10} color="yellow.400" />
              <Text  fontFamily="body" ml="12px" mb="5px" textAlign="left">
                Please note, you will have to log in again after reseting your
                password.
              </Text>
            {" "}
            <VStack ml="15px" w="100%">
              <FormControl w="280px">

                <FormLabel  fontFamily="body">Old Password</FormLabel>
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
                <FormLabel  fontFamily="body">New Password</FormLabel>
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
                <FormLabel  fontFamily="body">Confirm New Password</FormLabel>
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
                fontFamily="body"
                onClick={handleSaveChanges}
              >
                Save Changes
              </Button>
            </VStack>
          </Box>
        </Flex>
        <MedicMobileFooter/>
      </VStack>
    </ChakraProvider>
  );
};
export default MedicChangePasswordPage;
