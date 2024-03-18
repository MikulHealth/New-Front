import React, { useState} from "react";
import { useNavigate } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import LeftSideBar from "../authLayouts/LeftSideBar";
// import {useSelector } from "react-redux";
import { SearchIcon } from "@chakra-ui/icons";
import {
  ChakraProvider,
  VStack,
  Input,
  Button,
  // useToast,
  Image,
  Box,
  Text,
  Flex,

  FormControl,
  FormLabel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  extendTheme,
  ModalBody,
  Divider,
  ModalCloseButton,
} from "@chakra-ui/react";
import Transfer from "../../assets/TransferPayment.svg";
import Online from "../../assets/OnlinePayment.svg";
import RightArrow from "../../assets/RightArrow.svg";
import NavBar from "../authLayouts/NavBar";
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

const FundWalletModal = ({
  isOpen,
  onClose,
  onBankTransfer,
  onOnlinePayment,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" borderRadius="15px">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader marginLeft="200px">Fund Wallet</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box
            marginLeft="8px"
            border="1px solid black"
            h="12vh"
            w="37vw"
            borderRadius="15px"
            paddingBottom="5px"
            onClick={onBankTransfer}
            style={{
              cursor: "pointer",
            }}
            _hover={{ color: "#A210C6" }}
          >
            <Flex>
              <Image
                marginLeft="15px"
                marginTop="15px"
                w="50px"
                h="50px"
                src={Transfer}
                alt="Settings"
              />
              <Box marginLeft="10px" padding="10px" paddingBottom="10px">
                <Text>Via Bank Transfer</Text>
                <Text>Direct bank transfer to your Mikul wallet account</Text>
              </Box>
              <Image
                marginLeft="15px"
                marginTop="25px"
                w="30px"
                h="30px"
                src={RightArrow}
                alt="Settings"
              />
            </Flex>
          </Box>
          <Box
            marginTop="15px"
            marginLeft="8px"
            border="1px solid black"
            h="12vh"
            w="37vw"
            marginBottom="15px"
            borderRadius="15px"
            onClick={onOnlinePayment}
            style={{
              cursor: "pointer",
            }}
            _hover={{ color: "#A210C6" }}
          >
            <Flex>
              <Image
                marginLeft="15px"
                marginTop="15px"
                w="50px"
                h="50px"
                src={Online}
                alt="Settings"
              />
              <Box marginLeft="10px" padding="10px" paddingBottom="10px">
                <Text>Online Payment</Text>
                <Text>Fund your Mikul wallet with a debit card</Text>
              </Box>
              <Image
                marginLeft="70px"
                marginTop="25px"
                w="30px"
                h="30px"
                src={RightArrow}
                alt="Settings"
                style={{
                  cursor: "pointer",
                }}
                _hover={{ color: "#A210C6" }}
              />
            </Flex>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

const BankTransferModal = ({ isOpen, onClose, bankDetails }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader marginLeft="130px">Bank Transfer</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text marginTop="-10px">
            This is your Mikul Health account number. Please refresh this page
            after making a transfer to this account number either via your bank
            app or bank USSD code
          </Text>
          <Flex
            borderRadius="15px"
            border="1px solid black"
            marginLeft="10px"
            padding="10px"
            marginTop="10px"
          >
            <Text>Bank Name:</Text>
            <Text marginLeft="200"> {bankDetails.bankName}</Text>
          </Flex>
          <Flex
            borderRadius="15px"
            border="1px solid black"
            marginLeft="10px"
            padding="10px"
            marginTop="20px"
          >
            <Text>Account Name:</Text>
            <Text marginLeft="140"> {bankDetails.accountName}</Text>
          </Flex>
          <Flex
            borderRadius="15px"
            border="1px solid black"
            marginLeft="10px"
            padding="10px"
            marginTop="20px"
            marginBottom="20px"
          >
            <Text>Account Number:</Text>
            <Text marginLeft="145"> {bankDetails.accountNumber}</Text>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

const OnlinePaymentModal = ({ isOpen, onClose }) => {
  const [amount, setAmount] = useState("");

  const handleAmountSubmission = () => {
    // Handle the submission of the entered amount here
    console.log("Amount submitted:", amount);
    // You can perform further actions like making a deposit or calling an API here
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader marginLeft="130px">Online Payment</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Input amount:</FormLabel>
            <Input
              type="number"
              value={amount}
              border="1px solid black"
              placeholder="₦5000"
              onChange={(e) => setAmount(e.target.value)}
            />
          </FormControl>
          <Button
            marginTop="10px"
            marginBottom="20px"
            marginLeft="130px"
            bg="#A210C6"
            color="white"
            onClick={handleAmountSubmission}
            _hover={{ backgroundColor: "blue.500" }}
          >
            Make deposit
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

const WalletPage = () => {
  const [showFundWalletModal, setShowFundWalletModal] = useState(false);
  const [showBankTransferModal, setShowBankTransferModal] = useState(false);
  const [showOnlinePaymentModal, setShowOnlinePaymentModal] = useState(false);
  const navigate = useNavigate();
  // const toast = useToast();
  const balance = 0.0;
  // const { user } = useSelector((state) => state.userReducer);

  const settingsContainerStyle = {
    animation: "slideInUp 0.9s ease-in-out",
  };

  const handleOpenFundWalletModal = () => {
    setShowFundWalletModal(true);
  };

  const handleCloseFundWalletModal = () => {
    setShowFundWalletModal(false);
  };

  const handleOpenBankTransferModal = () => {
    setShowBankTransferModal(true);
  };

  const handleCloseBankTransferModal = () => {
    setShowBankTransferModal(false);
  };

  const handleOpenOnlinePaymentModal = () => {
    setShowOnlinePaymentModal(true);
  };

  const openCreditpage = () => {
    navigate("/credit");
  };
  const openDebitpage = () => {
    navigate("/debit");
  };

  const handleCloseOnlinePaymentModal = () => {
    setShowOnlinePaymentModal(false);
  };

  return (
    <ChakraProvider theme={customTheme}>
      <LeftSideBar />
      <VStack
        style={settingsContainerStyle}
        position="fixed"
        ml={{ md: "270px" }}
        w={{ base: "", md: "70%" }}
        h={{ base: "100%", md: "100%" }}
      >
        <NavBar />
        <Box
          marginTop="10px"
          border="1px solid gray"
          borderRadius="md"
          padding="3px"
          w={{ base: "89vw", md: "70vw" }}
          h={{ base: "7vw", md: "5vh" }}
          ml={{ base: "20px", md: "10px" }}
        >
          <Flex ml={{ md: "10px" }}>
            <SearchIcon boxSize={4} marginRight="10px" marginTop="5px" />
            <Text
              fontSize="16px"
              fontFamily="body"
              mt={{ md: "2px" }}
              style={{
                fontStyle: "italic",
                cursor: "pointer",
              }}
              _hover={{ color: "#A210C6" }}
              // onClick={handleOpenSearchAppointmentsModal}
            >
              Search transaction by date
            </Text>
          </Flex>
        </Box>
        <Box
          marginTop="10px"
          bg="#A210C6"
          w={{ base: "90vw", md: "70vw" }}
          ml={{ base: "20px", md: "10px" }}
          h={{ base: "19vh", md: "25vh" }}
          borderRadius="20px"
          display="flex"
        >
          <Flex  w={{ base: "90vw", md: "80vw" }}>
            <VStack marginLeft="20px">
              <Text
                fontSize={{ base: "12px", md: "16px" }}
                fontFamily="body"
                color="white"
                textAlign="left"
                mt={{ base: "10px", md: "20px" }}
              >
                Mikul Health Savings Account
              </Text>
              <Text
                color="white"
                fontSize={{ base: "12px", md: "16px" }}
                marginLeft="-80%"
              >
                ₦ {balance.toFixed(2)}
              </Text>
            </VStack>
            <Button
              padding={{ base: "5px", md: "0" }}
              ml={{ base: "40px", md: "460px" }}
              w={{ base: "100px", md: "200px" }}
              h={{ base: "30px", md: "40px" }}
              fontSize={{ base: "12px", md: "16px" }}
              borderRadius="15px"
              color="#A210C6"
              marginTop="20px"
              onClick={handleOpenFundWalletModal}
              bg="white"
              _hover={{ color: "" }}
            >
              Fund wallet
            </Button>
          </Flex>
          <Flex marginLeft={{ base: "5px", md: "56px" }} marginTop="100px">
            <VStack
              marginBottom={{ base: "50px", md: "0" }}
              marginLeft={{ base: "-50px", md: "-935px" }}
              color="white"
            >
              <Text fontSize={{ base: "12px", md: "16px" }}>Wallet ID:</Text>
              <Text fontFamily="body" fontSize="16px">
                Wema Bank 0124536789
              </Text>
            </VStack>
            <Flex
              display={{ base: "flex", md: "flex" }}
              marginLeft={{ base: "", md: "500px" }}
            >
              <VStack color="white">
                <Text fontSize="14px">Total funded</Text>
                <Text color="white" fontSize="12px" marginLeft="-44px">
                  ₦{balance.toFixed(2)}
                </Text>
              </VStack>
              <VStack color="white" marginLeft="50px">
                <Text fontSize="14px">Total spent</Text>
                <Text color="white" fontSize="12px" marginLeft="-34px">
                  ₦{balance.toFixed(2)}
                </Text>
              </VStack>
            </Flex>
          </Flex>
        </Box>
        <Box>
          <VStack>
            <Text
              fontSize="28px"
              fontFamily="heading"
              color="black"
              marginLeft="-780px"
              // marginTop="20px"
            >
              Recent activity
            </Text>
          </VStack>

          <Flex marginLeft="-70px" marginTop="10px">
            <Text
              style={{
                cursor: "pointer",
                textDecoration: "underline",
                textDecorationThickness: "5px",
              }}
              _hover={{ color: "#A210C6" }}
              marginLeft="15px"
            >
              All
            </Text>{" "}
            <Text
              style={{
                cursor: "pointer",
              }}
              _hover={{ color: "#A210C6" }}
              marginLeft="50px"
              onClick={openCreditpage}
            >
              Credit
            </Text>{" "}
            <Text
              style={{
                cursor: "pointer",
              }}
              _hover={{ color: "#A210C6" }}
              marginLeft="50px"
              onClick={openDebitpage}
            >
              Debit
            </Text>
          </Flex>
          <Divider
            marginTop="-10%"
            marginLeft="2%"
            my={4}
            borderColor="gray.500"
            width="60%"
          />
        </Box>
        {/* <Help/> */}
        <MobileFooter/>
      </VStack>
      <FundWalletModal
        isOpen={showFundWalletModal}
        onClose={handleCloseFundWalletModal}
        onBankTransfer={handleOpenBankTransferModal}
        onOnlinePayment={handleOpenOnlinePaymentModal}
      />
      <BankTransferModal
        isOpen={showBankTransferModal}
        onClose={handleCloseBankTransferModal}
        bankDetails={{
          bankName: "XYZ Bank",
          accountName: "Michael Joshua",
          accountNumber: "0123456789",
        }}
      />

      <OnlinePaymentModal
        isOpen={showOnlinePaymentModal}
        onClose={handleCloseOnlinePaymentModal}
      />
    </ChakraProvider>
  );
};

export default WalletPage;
