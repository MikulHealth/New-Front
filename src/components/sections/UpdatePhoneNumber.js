import React, { useState, useEffect } from "react";
import { GetCurrentUser, UpdateCustomer } from "../../apiCalls/UserApis";
import axios from "axios";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  Input,
  useToast,
  Box,
  Text,
  Button,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const ConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Confirm Changes</ModalHeader>
        <ModalCloseButton />
        <ModalBody>Are you sure you want to submit the changes?</ModalBody>
        <ModalFooter>
          <Button bg="gray" color="white" onClick={onClose}>
            Cancel
          </Button>
          <Button marginLeft="5px" color="white" bg="#A210C6" onClick={onConfirm}>
            Confirm
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

const SettingsModal = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const toast = useToast();
  const navigate = useNavigate();
  const [editedUser, setEditedUser] = useState({
    firstName: "",
    lastName: "",
    address: "",
    email: "",
    phoneNumber: "",
    image: "",
  });
  const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (localStorage.getItem("token")) {
        try {
          console.log("Calling GetCurrentUser API");
          const response = await GetCurrentUser();

          if (response.success) {
            console.log("API response:", response.data);
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
  },);

  useEffect(() => {
    setEditedUser({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      address: user?.address || "",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",
      image: user?.image || "",
    });
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleBack = () => {
    onClose();
  };

  const handleOpenConfirmationModal = () => {
    setConfirmationModalOpen(true);
  };

  const handleCloseConfirmationModal = () => {
    setConfirmationModalOpen(false);
  };

  const handleConfirm = async () => {
    handleCloseConfirmationModal();
    handleSubmit();
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await UpdateCustomer(
        editedUser,
        toast,
        setLoading,
        "Phone number updated. Sending OTP..."
      );

      if (response.success) {
        localStorage.setItem("token", response.data.data);
        console.log(response.data);

        setLoading(false);
        console.log("User details updated successfully:", response.data);

        handleVerify();
      } else {
        console.error("Failed to update user details:", response.error);
      }
    } catch (error) {
      console.error("Failed to update user details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    try {
      setLoading(true);
      localStorage.setItem("phoneNumber", editedUser.phoneNumber);
      const number = localStorage.getItem("phoneNumber");
      const verifyNumberResponse = await axios.post(
        "http://localhost:8080/api/v1/sms/verify-number",
        {
          phoneNumber: number,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setLoading(false);
      toast({
        title: "OTP Sent",
        description: verifyNumberResponse.data.message,
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      setTimeout(() => {
        navigate("/verifyPhone");
      }, 2000);
    } catch (error) {
      toast({
        title: "Update Failed",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Phone Number</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Kindly enter a valid phone number. We would send an OTP to verify
              the new phone number upon submission. You will also have to log in
              again after verifying the new phone number.
            </Text>
            <FormControl marginTop="15px">
              <Input
                name="phoneNumber"
                value={editedUser.phoneNumber}
                onChange={handleInputChange}
                placeholder="Phone Number"
                borderColor="black"
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Box display="flex">
              <Button
                marginLeft="5px"
                bg="gray"
                onClick={handleBack}
                marginBottom="4"
                color="white"
              >
                Cancel
              </Button>

              <Button
                marginLeft="5px"
                bg="#A210C6"
                onClick={handleOpenConfirmationModal}
                marginBottom="4"
                color="white"
                isLoading={loading}
                loadingText="Updating..."
              >
                {loading ? "Loading..." : "Submit"}
              </Button>
            </Box>
          </ModalFooter>
        </ModalContent>
      </Modal>

    
      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={handleCloseConfirmationModal}
        onConfirm={handleConfirm}
      />
    </>
  );
};

export default SettingsModal;
