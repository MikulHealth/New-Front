import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import LeftSideBar from "../authLayouts/LeftSideBar";
import { useSelector } from "react-redux";
import { SearchIcon, CopyIcon, CheckIcon } from "@chakra-ui/icons";
import AllTransactionTabs from "../../components/authLayouts/AllTransactionTabs";
import DebitTransactionTabs from "../../components/authLayouts/DebitTransaction";
import CreditTransactionTabs from "../../components/authLayouts/CreditTransaction";
import SearchTransactionModal from "../sections/SearchTransationByDate";
import {
  ChakraProvider,
  VStack,
  Input,
  Button,
  Skeleton,
  useClipboard,
  Image,
  IconButton,
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
  Tab,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,

  // Divider,
  ModalCloseButton,
} from "@chakra-ui/react";
import Transfer from "../../assets/TransferPayment.svg";
import Online from "../../assets/WhiteOnlineIcon.svg";
import RightArrow from "../../assets/WhiteArrow.svg";
import NavBar from "../authLayouts/NavBar";
import MobileFooter from "../authLayouts/MobileFooter";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={{ base: "", md: "xl" }}
      borderRadius="15px"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader mx={{ base: "10px", md: "200px" }}>
          Fund Wallet
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box
            color="white"
            bg="#A210C6"
            mx="8px"
            border="1px solid black"
            h={{ base: "15vh", md: "12vh" }}
            w={{ base: "90vw", md: "37vw" }}
            borderRadius="15px"
            pb="5px"
            onClick={onBankTransfer}
            style={{
              cursor: "pointer",
            }}
            // _hover={{ color: "#A210C6" }}
          >
            <Flex>
              <Image
                ml="15px"
                mt="15px"
                w="50px"
                h="50px"
                src={Transfer}
                alt="Bank Transfer"
              />
              <Box ml="10px" p="10px">
                <Text>Via Bank Transfer</Text>
                <Text>Direct bank transfer to your Mikul wallet account</Text>
              </Box>
              <Image
                ml="15px"
                mt="25px"
                w="30px"
                h="30px"
                src={RightArrow}
                alt="Proceed"
              />
            </Flex>
          </Box>
          <Box
            color="white"
            bg="#A210C6"
            mt="15px"
            mx="8px"
            border="1px solid black"
            h={{ base: "15vh", md: "12vh" }}
            w={{ base: "90vw", md: "37vw" }}
            mb="15px"
            borderRadius="15px"
            onClick={onOnlinePayment}
            style={{
              cursor: "pointer",
            }}
            // _hover={{ color: "#A210C6" }}
          >
            <Flex>
              <Image
                ml="15px"
                mt="15px"
                w="50px"
                h="50px"
                src={Online}
                alt="Online Payment"
              />
              <Box ml="10px" p="10px">
                <Text>Online Payment</Text>
                <Text>Fund your Mikul wallet with a debit card</Text>
              </Box>
              <Image
                ml={{ base: "auto", md: "70px" }}
                mt="25px"
                w="30px"
                h="30px"
                src={RightArrow}
                alt="Proceed"
                style={{
                  cursor: "pointer",
                }}
                // _hover={{ color: "#A210C6" }}
              />
            </Flex>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

const BankTransferModal = ({ isOpen, onClose, bankDetails }) => {
  const { hasCopied, onCopy } = useClipboard(bankDetails.accountNumber);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader mx={{ base: "10px", md: "130px" }}>
          Bank Transfer
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text mt="-10px">
            This is your Mikul Health account number. Please refresh this page
            after making a transfer to this account number either via your bank
            app or bank USSD code
          </Text>
          <Flex
            color="white"
            bg="#A210C6"
            borderRadius="15px"
            border="1px solid black"
            mx="10px"
            p="10px"
            mt="10px"
            // flexDirection={{ base: "column", md: "row" }}
          >
            <Text>Bank Name:</Text>
            <Text ml={{ base: "150px", md: "180px" }}>
              {bankDetails.bankName}
            </Text>
          </Flex>
          <Flex
            color="white"
            bg="#A210C6"
            borderRadius="15px"
            border="1px solid black"
            mx="10px"
            p="10px"
            mt="20px"
            // flexDirection={{ base: "column", md: "row" }}
          >
            <Text>Account Name:</Text>
            <Text ml={{ base: "100px", md: "135px" }}>
              {bankDetails.accountName}
            </Text>
          </Flex>
          <Flex
            color="white"
            bg="#A210C6"
            borderRadius="15px"
            border="1px solid black"
            mx="10px"
            p="10px"
            mt="20px"
            mb="20px"
            // flexDirection={{ base: "column", md: "row" }}
          >
            <Text>Account Number:</Text>
            <Text ml={{ base: "75px", md: "110px" }}>
              {bankDetails.accountNumber}
            </Text>
            <IconButton
              icon={hasCopied ? <CheckIcon /> : <CopyIcon />}
              onClick={onCopy}
              mt="-1"
              size="sm"
              aria-label="Copy account number"
              color="white"
              bg={hasCopied ? "#A210C6" : "#A210C6"}
              _hover={{ bg: "transparent" }}
            />
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

const OnlinePaymentModal = ({ isOpen, onClose }) => {
  const [amount, setAmount] = useState("");
  const { user } = useSelector((state) => state.userReducer);
  const customerId = user?.userId;
  const [loading, setLoading] = useState(false);
  const method = "CARD";
  const navigate = useNavigate();

  const handleAmountSubmission = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      // const apiUrl = `http://localhost:8080/v1/api/wallets/deposit?customerId=${encodeURIComponent(customerId)}&amount=${encodeURIComponent(amount)}&method=${encodeURIComponent(method)}`;
      const apiUrl = `https://backend-c1pz.onrender.com/v1/api/wallets/deposit?customerId=${encodeURIComponent(
        customerId
      )}&amount=${encodeURIComponent(amount)}&method=${encodeURIComponent(
        method
      )}`;

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.post(apiUrl, {}, { headers });

      if (response.data.success) {
        setLoading(false);
        toast.success("Wallet funded successfully");
        setAmount("");
        setTimeout(() => {
          navigate("/dashboard");
        }, 5000);
      } else {
        setLoading(false);

        console.error("Error Funding Wallet");
        const errorMessage = response.data
          ? response.data.message
          : "Unknown error";
        toast.error(errorMessage);
      }
    } catch (error) {
      setLoading(false);
      console.error("An error occurred:", error);
      toast.error("Error funding wallet");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
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

      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Online Payment</ModalHeader>
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
            mt="10px"
            mb="20px"
            bg="#A210C6"
            color="white"
            isLoading={loading}
            loadingText="Processing..."
            onClick={handleAmountSubmission}
            // _hover={{ backgroundColor: "blue.500" }}
            width={{ base: "full", md: "auto" }}
          >
            {loading ? "Processing..." : "Make deposit"}
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
  const accountNumber = "0124536789";
  const { hasCopied, onCopy } = useClipboard(accountNumber);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state) => state.userReducer);
  const balance = user?.walletBalance;
  const walletTotalCredit = user?.walletTotalCredit;
  const walletTotalDebit = user?.walletTotalDebit;
  const settingsContainerStyle = {
    animation: "slideInUp 0.9s ease-in-out",
  };

  const [showSearchTransactionsModal, setShowSearchTransactionsModal] =
    useState(false);

  const handleOpenSearchTransactionsModal = () => {
    setShowSearchTransactionsModal(true);
  };

  const handleCloseSearchTransactionsModal = () => {
    setShowSearchTransactionsModal(false);
  };

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, [user]);

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
  const formatAmount = (amount) => {
    const num = Number(amount);
    return num.toLocaleString("en-US");
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
        {loading ? (
          <Skeleton
            ml={{ base: "20px", md: "0" }}
            w={{ base: "375px", md: "70vw" }}
            h={{ base: "189px", md: "40vh" }}
            startColor="#E552FF"
            endColor="#870DA5"
            fadeDuration={0.6}
            borderRadius="20px"
          />
        ) : (
          <Box>
            <Flex
              marginTop="10px"
              border="1px solid gray"
              borderRadius="md"
              padding="3px"
              w={{ base: "88vw", md: "908px" }}
              h={{ base: "7vw", md: "5vh" }}
              ml={{ base: "22px", md: "15px" }}
              mb={{ base: "5px", md: "10px" }}
            >
              <Flex ml={{ md: "10px" }}>
                <SearchIcon boxSize={4} marginRight="10px" marginTop="5px" />
                <Text
                  fontSize={{ base: "10px", md: "14px" }}
                  fontFamily="body"
                  mt={{ md: "3px" }}
                  style={{
                    fontStyle: "italic",
                    cursor: "pointer",
                  }}
                  _hover={{ color: "#A210C6" }}
                  onClick={handleOpenSearchTransactionsModal}
                >
                  Search transaction by date
                </Text>
              </Flex>
            </Flex>
            <Box
              textAlign="center"
              ml={{ base: "15px", md: "0" }}
              w={{ base: "375px", md: "910px" }}
              h={{ base: "180px", md: "230px" }}
              mt={{ base: "10px", md: "0" }}
              mb={{ base: "5px", md: "30" }}
              paddingBottom={{ base: "20px", md: "" }}
              bg="#A210C6"
              borderRadius="20px"
            >
              <Flex w={{ base: "90vw", md: "80vw" }}>
                <Box
                  ml={{ base: "20px", md: "40px" }}
                  pt={{ base: "5px", md: "15px" }}
                >
                  <Text
                    fontSize="16px"
                    fontFamily="body"
                    color="white"
                    marginTop="20px"
                  >
                    Mikul Health Wallet
                  </Text>
                  <Flex>
                    <Text
                      marginTop="2px"
                      color="white"
                      fontSize={{ base: "18px", md: "22px" }}
                      textAlign="left"
                    >
                      ₦ {formatAmount(balance)}.00
                    </Text>
                  </Flex>
                </Box>
                <VStack pt={{ base: "5px", md: "15px" }}>
                  <Button
                    padding={{ base: "5px", md: "0" }}
                    ml={{ base: "75px", md: "500px" }}
                    w={{ base: "100px", md: "35%" }}
                    h={{ base: "30px", md: "50%" }}
                    fontSize={{ base: "12px", md: "16px" }}
                    borderRadius="15px"
                    color="#A210C6"
                    marginTop="20px"
                    onClick={handleOpenFundWalletModal}
                    bg="white"
                    // leftIcon={<ExternalLinkIcon />}
                  >
                    Fund wallet
                  </Button>
                </VStack>
              </Flex>
              <Flex
                ml={{ base: "20px", md: "40px" }}
                mt={{ base: "30px", md: "50px" }}
              >
                <Box
                  marginBottom={{ base: "50px", md: "50px" }}
                  // marginLeft={{ base: "-50px", md: "-935px" }}
                  color="white"
                >
                  <Text
                    textAlign="left"
                    fontSize={{ base: "10px", md: "16px" }}
                  >
                    Wallet ID:
                  </Text>
                  <Flex>
                    <Text
                      textAlign="left"
                      fontSize={{ base: "10px", md: "16px" }}
                    >
                      Wema Bank
                    </Text>
                    <Text
                      ml="10px"
                      textAlign="left"
                      fontSize={{ base: "10px", md: "16px" }}
                    >
                      {accountNumber}
                    </Text>
                    <IconButton
                      icon={hasCopied ? <CheckIcon /> : <CopyIcon />}
                      onClick={onCopy}
                      mt="-5px"
                      size="sm"
                      aria-label="Copy account number"
                      color="white"
                      bg={hasCopied ? "#A210C6" : "#A210C6"}
                      _hover={{ bg: "transparent" }}
                    />
                  </Flex>
                </Box>
                <Flex marginLeft={{ base: "15px", md: "400px" }}>
                  <Box color="white">
                    <Text textAlign="left" fontSize="10px">
                      Total funded
                    </Text>
                    <Text textAlign="left" color="white" fontSize="10px">
                      ₦ {formatAmount(walletTotalCredit)}.00
                    </Text>
                  </Box>
                  <Box color="white" marginLeft="10px">
                    <Text textAlign="left" fontSize="10px">
                      Total spent
                    </Text>
                    <Text textAlign="left" color="white" fontSize="10px">
                      ₦ {formatAmount(walletTotalDebit)}.00
                    </Text>
                  </Box>
                </Flex>
              </Flex>
            </Box>

            <Flex
              w={{ base: "100%", md: "50vw" }}
              ml={{ base: "-50", md: "5px" }}
              justifyContent="space-between"
              className="transaction-tabs"
            >
              <VStack ml={{ base: "100px", md: "0" }}>
                <Tabs colorScheme="purple.100" mt={{ base: "", md: "-15px" }}>
                  <TabList ml="10px">
                    <Tab
                      fontSize={{ base: "12px", md: "16px" }}
                      color="#A210C6"
                      fontWeight="bold"
                    >
                      All
                    </Tab>

                    <Tab
                      fontSize={{ base: "12px", md: "16px" }}
                      color="green.500"
                      fontWeight="bold"
                      ml="50px"
                    >
                      Credit
                    </Tab>

                    <Tab
                      fontSize={{ base: "12px", md: "16px" }}
                      color="red.500"
                      fontWeight="bold"
                      ml="50px"
                    >
                      Debit
                    </Tab>
                  </TabList>
                  <TabPanels
                    ml={{ base: "-20px", md: "0px" }}
                    overflow={{ base: "scroll" }}
                  >
                    <TabPanel>
                      <AllTransactionTabs />
                    </TabPanel>
                    <TabPanel>
                      <CreditTransactionTabs />
                    </TabPanel>
                    <TabPanel>
                      <DebitTransactionTabs />
                    </TabPanel>
                  </TabPanels>
                </Tabs>
                <MobileFooter />
              </VStack>
              {/* <Help /> */}
            </Flex>
          </Box>
        )}
        <MobileFooter />
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

      <SearchTransactionModal
        isOpen={showSearchTransactionsModal}
        onClose={handleCloseSearchTransactionsModal}
      />
    </ChakraProvider>
  );
};

export default WalletPage;
