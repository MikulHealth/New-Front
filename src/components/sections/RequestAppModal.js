import React, { useState } from "react";
import { baseUrl } from "../../apiCalls/config";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  extendTheme,
  Flex,
  FormControl,
  FormLabel,
  Select,
  InputGroup,
  InputRightElement,
  Icon,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { MdLocationOn } from "react-icons/md";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import WalletModal from "./CreateWalletModal";
import AddressInput from "./AddressInput";

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

const RequestAppointmentModal = ({ isOpen, onClose }) => {
  const [appointmentType, setAppointmentType] = useState("");
  const [shift, setShift] = useState("");
  const [preferredTown, setPreferredTown] = useState("");
  const [currentLocation, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => state.userReducer);
  const {
    isOpen: isWalletModalOpen,
    onOpen: onOpenWalletModal,
    onClose: onCloseWalletModal,
  } = useDisclosure();
  const specialization = user?.medicType;
  const medicId = user?.userId;
  const walletCreated = user?.walletCreated;

  const townsInLagos = [
    "Ikeja",
    "Ogudu",
    "Berger",
    "Surulere",
    "Ikorodu",
    "Epe",
    "Badagry",
    "Yaba",
    "Victoria Island",
    "Lekki",
    "Lagos Island",
    "Ajah",
    "Sangotedo",
    "Agege",
    "Ikoyi",
    "Okota",
    "Mushin",
    "Iyana Ipaja",
    "Oshodi",
    "Isolo",
    "Ikotun",
    "Festac",
    "Ijesha",
    "Maryland",
    "Ojota",
  ];

  const handleSubmit = async () => {
    // Validate all fields
    if (!appointmentType || !shift || !currentLocation) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    const requestData = {
      appointmentType,
      shift,
      currentLocation,
      specialization,
      medicId,
      preferredTown: "",
    };

    try {
      const token = localStorage.getItem("token");

      const apiUrl = `${baseUrl}/appointment/request`;

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.post(apiUrl, requestData, { headers });

      if (response.data.success) {
        toast.success(response.data.message);
        setLoading(false);
        console.log("Appointment requested successfully:", response.data);
        onClose();
      } else {
        toast.error(response.data.message);
        console.error("Appointment request failed:", response.data.message);
        setLoading(false);
      }
    } catch (error) {
      toast.error("Error requesting appointment");
      console.error("Error requesting appointment:", error);
      setLoading(false);
    }
  };

  const handleLocationChange = (location) => {
    setLocation((prevFields) => ({
      ...prevFields,
      currentLocation: location,
    }));
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={8000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Modal
        theme={customTheme}
        isOpen={isOpen}
        onClose={onClose}
        size={{ base: "sm", md: "md" }}
      >
        <ModalOverlay />
        <ModalContent justifyContent="center" borderRadius="20px">
          <ModalHeader fontFamily="heading" color="#A210C6">
            {walletCreated ? "Request Appointment" : "Create Wallet"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {walletCreated ? (
              <>
                <FormControl isRequired>
                  <FormLabel fontFamily="body">
                    Choose Appointment Type
                  </FormLabel>
                  <InputGroup>
                    <Select
                      placeholder="Select appointment type"
                      value={appointmentType}
                      onChange={(e) => setAppointmentType(e.target.value)}
                    >
                      <option value="Elderly care">Elderly care</option>
                      <option value="Recovery care">Recovery care</option>
                      <option value="Short home visit">Short home visit</option>
                      <option value="Postpartum care">Postpartum care</option>
                      <option value="Nanny services">Nanny services</option>
                    </Select>
                    <InputRightElement pointerEvents="none">
                      <ChevronDownIcon color="gray.300" />
                    </InputRightElement>
                  </InputGroup>
                </FormControl>
                <FormControl isRequired mt="4">
                  <FormLabel fontFamily="body">Choose Shift</FormLabel>
                  <InputGroup>
                    <Select
                      placeholder="Select shift"
                      value={shift}
                      onChange={(e) => setShift(e.target.value)}
                    >
                      <option value="Day Shift(8hrs)">Day Shift(8hrs)</option>
                      <option value="Night Shift(12hrs)">
                        Night Shift (12hrs)
                      </option>
                      <option value="Live-in(24hrs)">Live-in (24hrs)</option>
                      <option value="Any">Any of the above</option>
                    </Select>
                    <InputRightElement pointerEvents="none">
                      <ChevronDownIcon color="gray.300" />
                    </InputRightElement>
                  </InputGroup>
                </FormControl>
                <FormControl isRequired mt="4">
                  <FormLabel fontFamily="body">City/Town</FormLabel>
                  <InputGroup>
                    <Select
                      isRequired
                      placeholder="Select preferred town"
                      fontSize={{ base: "14px", md: "16px" }}
                      value={preferredTown}
                      onChange={(e) => setPreferredTown(e.target.value)}
                    >
                      {townsInLagos.map((town) => (
                        <option key={town} value={town}>
                          {town}
                        </option>
                      ))}
                    </Select>
                    <InputRightElement pointerEvents="none">
                      <Icon as={MdLocationOn} color="gray.300" />
                    </InputRightElement>
                  </InputGroup>
                </FormControl>
                <FormControl isRequired mt="4">
                  <FormLabel fontFamily="body">Location</FormLabel>
                  <AddressInput
                    value={currentLocation}
                    onChange={handleLocationChange}
                    // onChange={(e) => setLocation(e.target.value)}
                  />
                  {/* <InputGroup>
                    <Input
                      placeholder="Select preferred location"
                      value={currentLocation}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                    <InputRightElement pointerEvents="none">
                      <Icon as={MdLocationOn} color="gray.300" />
                    </InputRightElement>
                  </InputGroup> */}
                </FormControl>
              </>
            ) : (
              <>
                <Text fontSize="sm" color="gray.500" mb={4}>
                  Please create a wallet before you can start earning.
                </Text>
                <Flex justifyContent="flex-end" mt={4}>
                  <Button
                    mb="20px"
                    bg="#A210C6"
                    color="white"
                    onClick={onOpenWalletModal}
                  >
                    Create Wallet
                  </Button>
                </Flex>
              </>
            )}
          </ModalBody>
          {walletCreated && (
            <ModalFooter justifyContent="center">
              <Button
                isLoading={loading}
                loadingText="Loading..."
                // bg="#A210C6"
                bgGradient="linear(to-r, #A210C6, #E552FF)"
                fontFamily="body"
                color="white"
                w={{ base: "auto", md: "200px" }}
                borderRadius="100px"
                mr={3}
                onClick={handleSubmit}
              >
                {loading ? "Loading..." : "Request"}
              </Button>
            </ModalFooter>
          )}
        </ModalContent>
      </Modal>
      <WalletModal isOpen={isWalletModalOpen} onClose={onCloseWalletModal} />
    </>
  );
};

export default RequestAppointmentModal;
