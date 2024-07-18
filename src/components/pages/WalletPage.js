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
import WalletModal from "../sections/CreateWalletModal";
import WalletBox from "../sections/WalletBox";
import { baseUrl } from "../../apiCalls/config";
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
  useMediaQuery,
  ModalCloseButton,
} from "@chakra-ui/react";
import Transfer from "../../assets/TransferPayment.svg";
// import RightArrow from "../../assets/WhiteArrow.svg";
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
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");
  const modalWidth = isLargerThan768 ? "400px" : "90vw";

  return (
    <Modal
      theme={customTheme}
      isOpen={isOpen}
      onClose={onClose}
      size={{ base: "", md: "xl" }}
      borderRadius="15px"
    >
      <ModalOverlay />
      <ModalContent
        width={modalWidth}
        borderRadius="25px 25px 25px 0px"
        justifyContent="center"
      >
        <ModalHeader fontFamily="heading">Fund Wallet</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box
            mb="20px"
            color="white"
            bg="#A210C6"
            // mx="8px"
            border="1px solid black"
            h={{ base: "10vh", md: "10vh" }}
            w={{ base: "80vw", md: "25vw" }}
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
                w={{ base: "30px", md: "30px" }}
                h={{ base: "30px", md: "30px" }}
                src={Transfer}
                alt="Bank Transfer"
              />
              <Box ml="10px" p="10px">
                <Text
                  fontSize={{ base: "16px", md: "18px" }}
                  fontFamily="heading"
                >
                  Via Bank Transfer
                </Text>
                <Text fontSize={{ base: "10px", md: "12px" }} fontFamily="body">
                  Bank transfer to your wallet account
                </Text>
              </Box>
              {/* <Image
                ml="15px"
                mt="25px"
                w="30px"
                h="30px"
                src={RightArrow}
                alt="Proceed"
              /> */}
            </Flex>
          </Box>
          <Box
            color="white"
            bg="#A210C6"
            mt="15px"
            // mx="8px"
            border="1px solid black"
            h={{ base: "10vh", md: "10vh" }}
            w={{ base: "80vw", md: "25vw" }}
            mb="15px"
            borderRadius="15px"
            onClick={onOnlinePayment}
            style={{
              cursor: "pointer",
            }}
            _hover={{ color: "#A210C6" }}
          >
            <Flex>
              {/* <Image
                ml="15px"
                mt="15px"
                w={{ base: "30px", md: "30px" }}
                h={{ base: "30px", md: "30px" }}
                src={Online}
                alt="Online Payment"
              /> */}
              <Box ml="10px" p="10px">
                <Text
                  fontSize={{ base: "16px", md: "18px" }}
                  fontFamily="heading"
                >
                  Online Payment
                </Text>
                <Text fontSize={{ base: "10px", md: "12px" }} fontFamily="body">
                  Fund your wallet with a debit card
                </Text>
              </Box>
              {/* <Image
                ml={{ base: "auto", md: "15px" }}
                mt="25px"
                w="30px"
                h="30px"
                src={RightArrow}
                alt="Proceed"
                style={{
                  cursor: "pointer",
                }} 
           _hover={{ color: "#A210C6" }} 
           />  */}
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
    <Modal theme={customTheme} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader fontFamily="heading">Bank Transfer</ModalHeader>
        <ModalCloseButton />
        <ModalBody fontFamily="body">
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
      const apiUrl = `${baseUrl}/api/wallets/deposit?customerId=${encodeURIComponent(
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
          navigate("/client-dashboard");
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
        <ModalHeader fontFamily="heading">Online Payment</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl fontFamily="body">
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
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state) => state.userReducer);
  const walletAccountNumber = user?.walletAccountNumber;
  const { hasCopied, onCopy } = useClipboard(walletAccountNumber);
  const walletBankName = user?.walletBankName;
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

  const handleCloseOnlinePaymentModal = () => {
    setShowOnlinePaymentModal(false);
  };

  const handleOpenWalletModal = () => {
    setShowWalletModal(true);
  };

  const handleCloseWalletModal = () => {
    setShowWalletModal(false);
  };

  return (
    <ChakraProvider theme={customTheme}>
      <LeftSideBar />
      <VStack
        style={settingsContainerStyle}
        position="fixed"
        ml={{ md: "230px" }}
        w={{ base: "100%", md: "80%" }}
        h={{ base: "100%", md: "100%" }}
      >
        <NavBar />
        {loading ? (
          <Skeleton
            justifyContent="center"
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
              ml={{ base: "8px", md: "15px" }}
              mb={{ base: "5px", md: "10px" }}
            >
              <Flex ml={{ md: "10px" }}>
                <SearchIcon boxSize={4} marginRight="10px" marginTop="5px" />
                <Text
                  fontSize={{ base: "10px", md: "14px" }}
                  fontFamily="body"
                  mt={{ md: "3px" }}
                  style={{ fontStyle: "italic", cursor: "pointer" }}
                  _hover={{ color: "#A210C6" }}
                  onClick={handleOpenSearchTransactionsModal}
                >
                  Search transaction by date
                </Text>
              </Flex>
            </Flex>
            <WalletBox
              user={user}
              accountNumber={walletAccountNumber}
              accountName={walletBankName}
              hasCopied={hasCopied}
              onCopy={onCopy}
              handleOpenFundWalletModal={handleOpenFundWalletModal}
              handleOpenWalletModal={handleOpenWalletModal}
            />
            <Text
              mb={{ base: "10px", md: "25px" }}
              mt="20px"
              textAlign="left"
              fontFamily="heading"
              fontWeight="bold"
              fontSize={{ base: "16px", md: "22px" }}
            >
              Recent transactions
            </Text>
            <Flex
              w={{ base: "90vw", md: "90%" }}
              ml={{ base: "0", md: "-110px" }}
              mt={{ base: "-10px", md: "-30px" }}
              justifyContent="center"
              className="transaction-tabs"
            >
              <VStack ml={{ base: "0", md: "0px" }} w="90%">
                <Tabs colorScheme="purple.100" mt={{ base: "" }}>
                  <TabList>
                    <Tab
                      fontSize={{ base: "12px", md: "16px" }}
                      color="#A210C6"
                      fontWeight="bold"
                      ml={{ base: "35px", md: "0" }}
                    >
                      All
                    </Tab>

                    <Tab
                      fontSize={{ base: "12px", md: "16px" }}
                      color="green.500"
                      fontWeight="bold"
                    >
                      Credit
                    </Tab>

                    <Tab
                      fontSize={{ base: "12px", md: "16px" }}
                      color="red.500"
                      fontWeight="bold"
                      mr={{ base: "30px", md: "0" }}
                    >
                      Debit
                    </Tab>
                  </TabList>
                  <TabPanels
                    ml={{ base: "-25px", md: "0px" }}
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
      <WalletModal isOpen={showWalletModal} onClose={handleCloseWalletModal} />
    </ChakraProvider>
  );
};

export default WalletPage;
