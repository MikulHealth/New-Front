import React from "react";
import {
  Box,
  Flex,
  Image,
  Text,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import WalletIcon from "../../assets/WalletIcon.svg";
import Patients from "../../assets/MedicPatients.svg";
import Report from "../../assets/MedicReport.svg";
import PatientReportDrawer from "./PatientReportDrawer";
import WalletModal from "../sections/CreateWalletModal";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const DesktopCards = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isWalletModalOpen,
    onOpen: onWalletModalOpen,
    onClose: onWalletModalClose,
  } = useDisclosure(); // Manage WalletModal state
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.userReducer);
  const walletCreated = user?.walletCreated;
  const balance = user?.walletBalance;
  const noOfPatients = user?.noOfPatients;

  const formatAmount = (amount) => {
    const num = Number(amount);
    return num.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const openPatientsPage = () => {
    navigate("/patients");
  };

  return (
    <Box>
      <Box display={{ base: "none", md: "block" }} marginTop="10px">
        <Flex>
          <Box
            style={{
              transition: "transform 0.3s ease-in-out",
              cursor: "pointer",
            }}
            bg="#CFF4D7"
            h={{ base: "125px", md: "186px" }}
            mt={{ base: "4", md: "0" }}
            w={{ base: "180px", md: "300px" }}
            borderRadius="5px"
            _hover={{
              transform: "translateY(-10px)",
            }}
          >
            <Box>
              <Flex>
                <Image
                  src={WalletIcon}
                  mt={{ base: "5px", md: "25px" }}
                  ml={{ base: "5px", md: "30px" }}
                  w={{ base: "25px", md: "30px" }}
                  h={{ base: "25px", md: "30px" }}
                />
                <Text
                  ml={{ base: "5px", md: "5px" }}
                  mt={{ base: "5px", md: "30px" }}
                  fontSize={{ base: "10px", md: "16px" }}
                  fontFamily="body"
                  color="#676568"
                >
                  Wallet
                </Text>
              </Flex>
              {walletCreated ? (
                <Text
                  fontSize={{ base: "18px", md: "24px" }}
                  ml={{ base: "5px", md: "-120px" }}
                  mt={{ base: "5px", md: "20px" }}
                  fontFamily="heading"
                  fontWeight="bold"
                  color="#212427"
                >
                  ₦{formatAmount(balance)}
                </Text>
              ) : (
                <Button
                  mt={{ base: "5px", md: "20px" }}
                  ml={{ base: "5px", md: "5px" }}
                  onClick={onWalletModalOpen}
                  color="#A210C6"
                  fontWeight="bold"
                >
                  Create Wallet
                </Button>
              )}
            </Box>
          </Box>

          <Box
            style={{
              transition: "transform 0.3s ease-in-out",
              cursor: "pointer",
            }}
            _hover={{
              transform: "translateY(-10px)",
            }}
            bg="#FCF6E8"
            h={{ base: "125px", md: "186px" }}
            mt={{ base: "4", md: "0" }}
            w={{ base: "180px", md: "300px" }}
            ml={{ base: "20px", md: "30px" }}
            borderRadius="5px"
            onClick={openPatientsPage}
          >
            <Box>
              <Flex>
                <Image
                  src={Patients}
                  mt={{ base: "5px", md: "25px" }}
                  ml={{ base: "5px", md: "30px" }}
                  w={{ base: "25px", md: "30px" }}
                  h={{ base: "25px", md: "30px" }}
                />
                <Text
                  ml={{ base: "5px", md: "5px" }}
                  mt={{ base: "5px", md: "30px" }}
                  fontSize={{ base: "10px", md: "16px" }}
                  fontFamily="body"
                  color="#676568"
                >
                  Patients
                </Text>
              </Flex>
              <Text
                fontSize={{ base: "18px", md: "24px" }}
                ml={{ base: "5px", md: "-225px" }}
                mt={{ base: "5px", md: "20px" }}
                fontFamily="heading"
                fontWeight="bold"
                color="#212427"
              >
                {noOfPatients}
              </Text>
            </Box>
          </Box>
        </Flex>
        <Flex mt={{ base: "", md: "20px" }}>
          <Box
            style={{
              transition: "transform 0.3s ease-in-out",
            }}
            _hover={{
              transform: "translateY(-10px)",
            }}
            bg="#E9E7FC"
            h={{ base: "125px", md: "186px" }}
            mt={{ base: "3", md: "0" }}
            w={{ base: "180px", md: "300px" }}
            borderRadius="5px"
            onClick={onOpen}
            cursor="pointer"
          >
            <Box>
              <Flex>
                <Image
                  src={Report}
                  mt={{ base: "5px", md: "25px" }}
                  ml={{ base: "5px", md: "30px" }}
                  w={{ base: "25px", md: "30px" }}
                  h={{ base: "25px", md: "30px" }}
                />
                <Text
                  ml={{ base: "5px", md: "5px" }}
                  mt={{ base: "5px", md: "30px" }}
                  fontSize={{ base: "10px", md: "16px" }}
                  fontFamily="body"
                  color="#212427"
                >
                  Patient Report
                </Text>
              </Flex>
              <Text
                fontSize={{ base: "10px", md: "16px" }}
                ml={{ base: "5px", md: "0px" }}
                mt={{ base: "5px", md: "20px" }}
                fontFamily="body"
                color="#212427"
              >
                Update and upload patient report
              </Text>
              <Text
                fontSize={{ base: "12px", md: "14px" }}
                textAlign="center"
                fontWeight="bold"
                fontFamily="body"
                mt={{ base: "5px", md: "30px" }}
                style={{
                  fontStyle: "italic",
                  cursor: "pointer",
                }}
                color="#3A3899"
                _hover={{ color: "#A210C6" }}
              >
                Upload report
              </Text>
            </Box>
          </Box>
        </Flex>
      </Box>
      <PatientReportDrawer isOpen={isOpen} onClose={onClose} />
      <WalletModal isOpen={isWalletModalOpen} onClose={onWalletModalClose} />
    </Box>
  );
};

export default DesktopCards;
