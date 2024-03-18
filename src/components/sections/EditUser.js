import React, { useState, useEffect } from "react";
import { GetCurrentUser, UpdateCustomer } from "../../apiCalls/UserApis";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  VStack,
  Input,
  Button,
  Progress,
  useToast,
  Image,
  Box,
  Text,
  Flex,
  Select,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../utils/Spiner";
import UpdatePhoneNumber from "./UpdatePhoneNumber";

const EditProfileModal = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [image] = useState();
  const [imageLoading, setImageLoading] = useState(false);
  const [isPhoneModalOpen, setPhoneModalOpen] = useState(false);
  const [editedUser, setEditedUser] = useState({
    firstName: "",
    lastName: "",
    address: "",
    email: "",
    phoneNumber: "",
    image: "",
  });
  const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const toast = useToast();

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = new Date(dateString).toLocaleDateString(
      undefined,
      options
    );
    return formattedDate;
  };


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
  });

 

  useEffect(() => {
   
    setEditedUser({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      address: user?.address || "",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",
      image: user?.image || "",
      gender: user?.gender || "",
      dob: user?.dob || "",
    });
  }, [user]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name !== "dob") {
      setEditedUser({
        ...editedUser,
        [name]: value,
      });
    } else {
      handleDOBChange(value);
    }
  };

  const handleDOBChange = (dobValue) => {
    setSelectedDate(dobValue);
    setEditedUser({
      ...editedUser,
      dob: dobValue,
    });
  };

  const navigate = useNavigate();

  const handleImageChange = async (image, editedUser, setEditedUser) => {
    setImageLoading(true);
    if (image === undefined) {
      // toast.error("Please select an image")
      return;
    }
    console.log(image);
    if (image.type === "image/jpeg" || image.type === "image/png") {
      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", "profileImage");
      data.append("cloud_name", "dmfewrwla");

      try {
        const response = await fetch(
          "https://api.cloudinary.com/v1_1/dmfewrwla/image/upload",
          {
            method: "post",
            body: data,
          }
        );

        const imageData = await response.json();

        setEditedUser({
          ...editedUser,
          image: imageData.url.toString(),
        });
        setImageLoading(false);
        console.log(imageData.url.toString());
      } catch (err) {
        console.log(err);
        setImageLoading(false);
      }
    } else {
      // toast.error("Please select an image");

      return;
    }
  };

  const handlePhoneModalOpen = () => {
    setPhoneModalOpen(true);
    onClose();
  };

  const handlePhoneModalClose = () => {
    setPhoneModalOpen(false);
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

  const handleSubmit = async () => {
    handleCloseConfirmationModal();
    setLoading(true);
    try {
      await handleImageChange(image, editedUser, setEditedUser);
      // Format the date to match the backend expectations
      const formattedDate = selectedDate
        ? selectedDate.toISOString().split("T")[0]
        : "";

      const dataToSend = {
        ...editedUser,
        dob: formattedDate,
      };

      const response = await UpdateCustomer(
        dataToSend,
        toast,
        setLoading,
        "You will be re-directed to the dashboard"
      );

      if (response.success) {
        setLoading(false);
        console.log("User details updated successfully:", response.data);
        navigate("/dashboard");
        window.location.reload();
      } else {
        console.error("Failed to update user details:", response.error);
      }
    } catch (error) {
      console.error("Failed to update user details:", error);
    }
  };

  // const handleImageClick = () => {
  //   const fileInput = document.getElementById("fileInput");
  //   if (fileInput) {
  //     fileInput.click();
  //   }
  // };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Profile</ModalHeader>
          <ModalCloseButton />
          <ModalBody marginTop="-2px">
            <Progress size="xs" isIndeterminate />
            <VStack align="center" spacing={4}>
              <Text marginLeft="2px" marginTop="2px">
                Only update the field(s) you want to change before saving the
                change(s)
              </Text>
              <Flex direction="row" justify="space-between">
                <label htmlFor="fileInput">
                  <Image
                    src={editedUser.image}
                    alt="Profile Preview"
                    boxSize="100px"
                    objectFit="cover"
                    borderRadius="8px"
                    cursor="pointer"
                  />
                  <Input
                    id="fileInput"
                    name="image"
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      handleImageChange(
                        e.target.files[0],
                        editedUser,
                        setEditedUser
                      );
                    }}
                  />
                </label>
              </Flex>
              {imageLoading && <LoadingSpinner size={20} />}
              <FormLabel marginLeft="8px" marginTop="2px">
                Click image to update (only PNG and JPG files are accepted)
              </FormLabel>
              <Flex direction="row" justify="space-between" w="100%">
                <FormControl>
                  <Input
                    name="firstName"
                    value={editedUser.firstName}
                    onChange={handleInputChange}
                    placeholder="First Name"
                  />
                </FormControl>
                <FormControl>
                  <Input
                    name="lastName"
                    value={editedUser.lastName}
                    onChange={handleInputChange}
                    placeholder="Last Name"
                  />
                </FormControl>
              </Flex>
              <Flex marginTop="5px" marginLeft="-90px">
                <Box>
                  <FormLabel>Gender </FormLabel>
                  <Select
                    name="gender"
                    placeholder="Select your gender"
                    w="250px"
                    value={editedUser.gender}
                    onChange={handleInputChange}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </Select>
                </Box>
                <Box marginLeft="10px">
                  <FormLabel>Date of Birth</FormLabel>
                  <DatePicker
                    name="dob"
                    selected={selectedDate}
                    onBlur={() => handleDOBChange(selectedDate)}
                    onChange={(date) => setSelectedDate(date)}
                    maxDate={new Date()}
                    peekNextMonth
                    showMonthDropdown
                    value={formatDate(editedUser.dob)}
                    showYearDropdown
                    dropdownMode="select"
                    dateFormat="yyyy-MM-dd"
                    placeholderText="Select your date of birth"
                    className="form-control"
                  />
                </Box>
              </Flex>
              <Input
                name="address"
                value={editedUser.address}
                onChange={handleInputChange}
                placeholder="Home address"
              />

              <Flex direction="row" justify="space-between" w="100%">
                <FormControl>
                  <Input
                    name="email"
                    value={editedUser.email}
                    onChange={handleInputChange}
                    placeholder="email address"
                  />
                </FormControl>
                <FormControl>
                  <Button onClick={handlePhoneModalOpen}>
                    Change phone number
                  </Button>
                </FormControl>
              </Flex>
            </VStack>
          </ModalBody>
          <Flex
            marginLeft="220px"
            marginBottom="4"
            marginTop="10px"
            display="flex"
          >
            <Text
              fontSize="20px"
              onClick={handleBack}
              style={{
                // marginLeft: "60px",
                color: "black",
                fontStyle: "italic",
                cursor: "pointer",
              }}
              _hover={{ color: "#A210C6" }}
            >
              Cancel
            </Text>
            <Text
              fontSize="20px"
              marginLeft="30px"
              onClick={handleOpenConfirmationModal}
              isLoading={loading}
              loadingText="Updating..."
              style={{
                // marginLeft: "60px",
                color: "#A210C6",
                fontStyle: "italic",
                cursor: "pointer",
              }}
              _hover={{ color: "#A210C6" }}
            >
              {loading ? "Loading..." : "Save Changes"}
            </Text>
          </Flex>
        </ModalContent>
      </Modal>

      {/* Confirmation Modal */}
      <Modal
        isOpen={isConfirmationModalOpen}
        onClose={handleCloseConfirmationModal}
        size="sm"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Changes</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Are you sure you want to save the changes?</ModalBody>
          <Box display="flex" justifyContent="flex-end" p="2">
            <Button
              mr={3}
              onClick={handleCloseConfirmationModal}
              colorScheme="gray"
              color="#A210C6"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              color="white"
              bg="#A210C6"
              isLoading={loading}
            >
              Confirm
            </Button>
          </Box>
        </ModalContent>
      </Modal>
      <UpdatePhoneNumber
        isOpen={isPhoneModalOpen}
        onClose={handlePhoneModalClose}
      />
    </>
  );
};

export default EditProfileModal;
