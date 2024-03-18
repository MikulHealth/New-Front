import React, { useState } from "react";
import {  UpdateCustomer } from "../../apiCalls/UserApis";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import DateIcon from "../../assets/DateIcon.svg";
import NavBar from "../authLayouts/NavBar";
import LeftSideBar from "../authLayouts/LeftSideBar";
import {
  ChakraProvider,
  VStack,
  Input,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useToast,
  Avatar,
  Image,
  Box,
  Text,
  Flex,

  Divider,
  FormControl,
  extendTheme,
  FormLabel,
} from "@chakra-ui/react";
import LoadingSpinner from "../../utils/Spiner";
import UpdatePhoneNumber from "../sections/UpdatePhoneNumber";
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

const EdithProfilePage = () => {
  const navigate = useNavigate();
  // const dispatch = useDispatch();
  const toast = useToast();
  const { user } = useSelector((state) => state.userReducer);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isPhoneModalOpen, setPhoneModalOpen] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [image] = useState();
  const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = new Date(dateString).toLocaleDateString(
      undefined,
      options
    );
    return formattedDate;
  };

  const [formData, setFormData] = useState({
    firstName: user?.firstName,
    lastName: user?.lastName,
    dob: user?.dob,
    email: user?.email,
    phoneNumber: user?.phoneNumber,
    address: user?.address,
    gender: user?.gender,
    image: user?.image,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name !== "dob") {
      setFormData({
        ...formData,
        [name]: value,
      });
    } else {
      handleDOBChange(value);
    }
  };

  const handleDOBChange = (dobValue) => {
    // Check if 'dobValue' is provided, if not, use the current date
    const newDate = dobValue ? new Date(dobValue) : new Date();

    // Update the 'selectedDate' state
    setSelectedDate(newDate);

    // Update the 'formData' with the formatted date or an empty string if 'dobValue' is falsy
    setFormData({
      ...formData,
      dob: dobValue ? newDate.toISOString().split("T")[0] : "",
    });
  };

  const handleOpenConfirmationModal = () => {
    setConfirmationModalOpen(true);
  };

  const handleCloseConfirmationModal = () => {
    setConfirmationModalOpen(false);
  };

  const handlePhoneModalOpen = () => {
    setPhoneModalOpen(true);
  };

  const handlePhoneModalClose = () => {
    setPhoneModalOpen(false);
  };

  const handleImageChange = async (image, formData, setFormData) => {
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

        setFormData({
          ...formData,
          image: imageData.url.toString(),
        });
        setImageLoading(false);
        console.log(imageData.url.toString());
      } catch (err) {
        console.log(err);
        setImageLoading(false);
      }
    } else {
      return;
    }
  };

  const handleSubmit = async () => {
    handleCloseConfirmationModal();
    setLoading(true);
    try {
      await handleImageChange(image, formData, setFormData);

      // Add one day to the selected date
      const modifiedDate = selectedDate
        ? new Date(selectedDate.getTime() + 86400000)
        : null;

      // Format the modified date to match the backend expectations
      const formattedDate = modifiedDate
        ? modifiedDate.toISOString().split("T")[0]
        : "";

      const dataToSend = {
        ...formData,
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
        setTimeout(() => {}, 7000);
        navigate("/dashboard");
        window.location.reload();
      } else {
        console.error("Failed to update user details:", response.error);
      }
    } catch (error) {
      console.error("Failed to update user details:", error);
    }
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
          ml={{ base: "50px", md: "120px" }}
        >
          <SettingsSideBar />

          <VStack marginLeft="-40px" spacing={-10}>
            <Text fontWeight="bold" fontSize="20px">
              Edit profile
            </Text>
            <FormControl>
              <FormLabel fontSize="16px">First Name</FormLabel>
              <Input
                type="text"
                name="firstName"
                value={formData?.firstName}
                onChange={handleInputChange}
                borderColor="black"
                _hover={{ color: "" }}
              />
            </FormControl>
            <FormControl marginTop="15px">
              <FormLabel fontSize="16px">Last Name</FormLabel>
              <Input
                type="text"
                name="lastName"
                value={formData?.lastName}
                onChange={handleInputChange}
                borderColor="black"
                _hover={{ color: "" }}
              />
            </FormControl>
            <FormControl marginTop="15px">
              <FormLabel fontSize="16px">Date of Birth</FormLabel>
              <Flex
                border="1px solid black"
                borderRadius="6px"
                paddingTop="10px"
                h="7vh"
                w="30vw"
              >
                <Box marginRight="10px"></Box>
                <DatePicker
                  selected={
                    selectedDate ||
                    (formData.dob ? new Date(formData.dob) : null)
                  }
                  onChange={(date) => handleDOBChange(date)}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="dd/mm/yyyy"
                  maxDate={new Date()}
                  peekNextMonth
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  value={formatDate(formData.dob)}
                  style={{
                    marginTop: "60px",
                    marginLeft: "50px",
                    display: "",
                  }}
                />

                <Image
                  marginLeft="160px"
                  h="24px"
                  w="24px"
                  src={DateIcon}
                  alt="Date icon"
                />
              </Flex>
            </FormControl>
            <FormControl marginTop="15px">
              <FormLabel fontSize="16px">Email Address</FormLabel>
              <Input
                type="email"
                name="email"
                value={formData?.email}
                onChange={handleInputChange}
                borderColor="black"
                _hover={{ color: "" }}
              />
            </FormControl>
            <FormControl marginTop="15px">
              <FormLabel fontSize="16px">Home Address</FormLabel>
              <Input
                type="text"
                name="address"
                value={formData?.address}
                onChange={handleInputChange}
                borderColor="black"
                _hover={{ color: "" }}
              />
            </FormControl>
            {/* <FormControl marginTop="15px">
                  <FormLabel>Gender </FormLabel>
                  <Select
                    name="gender"
                    placeholder="Select your gender"
                    w="240px"
                    onChange={handleInputChange}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </Select>
                </FormControl> */}
            <Button
              marginTop="10px"
              color="white"
              bg="#A210C6"
              onClick={handleOpenConfirmationModal}
              _hover={{ color: "white" }}
            >
              Save changes
            </Button>
          </VStack>

          <Box marginLeft="30px" width="15%">
            <Box
              borderRadius="10px"
              marginTop="30px"
              marginLeft="40px"
              p={3}
              h="150px"
              w="180px"
              bg="white"
              boxShadow="0 4px 8px rgba(0, 0, 0, 0.1)"
            >
              <Avatar
                style={{
                  cursor: "pointer",
                }}
                h="120px"
                w="100px"
                src={formData?.image}
                name={formData?.firstName}
                bg="#A210C6"
              ></Avatar>

              <Input
                marginTop="30px"
                marginBottom="20px"
                id="fileInput"
                name="image"
                type="file"
                accept="image/*"
                borderColor="black"
                padding="5px"
                _hover={{ color: "" }}
                onChange={(e) => {
                  handleImageChange(e.target.files[0], formData, setFormData);
                }}
              />
            </Box>
            <Flex marginTop="80px">
              {imageLoading && <LoadingSpinner size={20} />}
              <Button
                fontSize="15px"
                borderColor="#A210C6"
                marginLeft="50px"
                bg="none"
                _hover={{ color: "" }}
                onClick={handleOpenConfirmationModal}
              >
                Change picture
              </Button>
              <Divider orientation="vertical" borderColor="black" my={1} />
              <Button
                _hover={{ color: "" }}
                bg="none"
                fontSize="15px"
                color="red"
                marginLeft="75px"
              >
                Delete picture
              </Button>
            </Flex>
            <Button
              bg="gray"
              color="white"
              marginTop="5px"
              marginLeft="35px"
              style={{}}
              _hover={{ color: "" }}
              onClick={handlePhoneModalOpen}
            >
              Change phone number
            </Button>
          </Box>
        </Flex>

        <Flex
          overflow="scroll"
          display={{ base: "block", md: "none" }}
          mt={{ md: "30px" }}
          ml={{ base: "30px" }}
          mb={{base: "60px"}}
        >
          <Flex justifyContent="space-between" margin="20px">
            <Box>
              <Text
                textAlign="left"
                fontSize={{ base: "18px" }}
                marginTop="3px"
                marginBottom="20px"
              >
                Edit Profile
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

          <VStack spacing={-10}>
            <Box
              borderRadius="10px"
              p={3}
              h="150px"
              w="180px"
              bg="white"
              boxShadow="0 4px 8px rgba(0, 0, 0, 0.1)"
            >
              <Avatar
                style={{
                  cursor: "pointer",
                }}
                h="120px"
                w="100px"
                src={formData?.image}
                name={formData?.firstName}
                bg="#A210C6"
              ></Avatar>

              <Input
                marginTop="30px"
                marginBottom="20px"
                id="fileInput"
                name="image"
                type="file"
                accept="image/*"
                borderColor="black"
                padding="5px"
                _hover={{ color: "" }}
                onChange={(e) => {
                  handleImageChange(e.target.files[0], formData, setFormData);
                }}
              />
            </Box>
            <Flex marginTop="60px">
              {imageLoading && <LoadingSpinner size={20} />}
              <Button
                fontSize="15px"
                borderColor="#A210C6"
                bg="none"
                _hover={{ color: "" }}
                onClick={handleOpenConfirmationModal}
              >
                Change picture
              </Button>
              <Divider orientation="vertical" borderColor="black" my={1} />
              <Button
                _hover={{ color: "" }}
                bg="none"
                fontSize="15px"
                color="red"
              >
                Delete picture
              </Button>
            </Flex>
            <Button
              bg="gray"
              color="white"
              marginTop="10px"
              style={{}}
              _hover={{ color: "" }}
              onClick={handlePhoneModalOpen}
            >
              Change phone number
            </Button>
            <Box marginTop="15px" w="100%">
              <FormControl w="280px">
                <FormLabel fontSize="16px">First Name</FormLabel>
                <Input
                  type="text"
                  name="firstName"
                  value={formData?.firstName}
                  onChange={handleInputChange}
                  borderColor="black"
                  _hover={{ color: "" }}
                />

                <FormLabel marginTop="15px" fontSize="16px">
                  Last Name
                </FormLabel>
                <Input
                  type="text"
                  name="lastName"
                  value={formData?.lastName}
                  onChange={handleInputChange}
                  borderColor="black"
                  _hover={{ color: "" }}
                />

                <FormLabel marginTop="15px" fontSize="16px">
                  Date of Birth
                </FormLabel>
                <Flex
                  border="1px solid black"
                  borderRadius="6px"
                  paddingTop="10px"
                  h="6vh"
                  w="280px"
                >
                  <Box marginRight="10px"></Box>
                  <DatePicker
                    selected={
                      selectedDate ||
                      (formData.dob ? new Date(formData.dob) : null)
                    }
                    onChange={(date) => handleDOBChange(date)}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="dd/mm/yyyy"
                    maxDate={new Date()}
                    peekNextMonth
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    value={formatDate(formData.dob)}
                    style={{
                      marginTop: "60px",
                      marginLeft: "50px",
                      display: "",
                    }}
                  />

                  <Image
                    marginLeft="160px"
                    h="24px"
                    w="24px"
                    src={DateIcon}
                    alt="Date icon"
                  />
                </Flex>

                <FormLabel marginTop="15px" fontSize="16px">
                  Email Address
                </FormLabel>
                <Input
                  type="email"
                  name="email"
                  value={formData?.email}
                  onChange={handleInputChange}
                  borderColor="black"
                  _hover={{ color: "" }}
                />

                <FormLabel marginTop="15px" fontSize="16px">
                  Home Address
                </FormLabel>
                <Input
                  type="text"
                  name="address"
                  value={formData?.address}
                  onChange={handleInputChange}
                  borderColor="black"
                  _hover={{ color: "" }}
                />
              </FormControl>
              {/* <FormControl marginTop="15px">
                  <FormLabel>Gender </FormLabel>
                  <Select
                    name="gender"
                    placeholder="Select your gender"
                    w="240px"
                    onChange={handleInputChange}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </Select>
                </FormControl> */}
              <Button
                marginTop="10px"
                marginBottom="50px"
                color="white"
                bg="#A210C6"
                onClick={handleOpenConfirmationModal}
                _hover={{ color: "white" }}
              >
                Save changes
              </Button>
            </Box>
          </VStack>
        </Flex>
        <MobileFooter/>
      </VStack>

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
      <VStack />
    </ChakraProvider>
  );
};
export default EdithProfilePage;
