import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import LeftSideBar from "../authLayouts/MedicSideBar";
import { useSelector } from "react-redux";
import {
  SearchIcon,
  CopyIcon,
  CheckIcon,
  AddIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";
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
  ModalFooter,
  extendTheme,
  ModalBody,
  Tab,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  useMediaQuery,
  ModalCloseButton,
  Divider,
} from "@chakra-ui/react";
import RightArrow from "../../assets/HeadsUp.svg";
import NavBar from "../authLayouts/MedicNavBar";
import MobileFooter from "../authLayouts/MedicFooter";
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

const HeadsUpModal = ({
  isOpen,
  onClose,
  onBankTransfer,
}) => {
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");
  const modalWidth = isLargerThan768 ? "400px" : "90vw";

  return (
    <Modal
      theme={customTheme}
      isOpen={isOpen}
      onClose={onClose}
      size={{ base: "sm", md: "xl" }}
      borderRadius="15px"
    >
      <ModalOverlay />
      <ModalContent
        width={modalWidth}
        justifyContent="center"
        alignItems="center"
        textAlign="center"
      >
        <ModalCloseButton />
        <ModalBody
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          p={{ base: 2, md: 4 }}
        >
          <Image
            mt={{ base: "15px", md: "25px" }}
            w={{ base: "200px", md: "250px" }}
            h={{ base: "120px", md: "150px" }}
            src={RightArrow}
            alt="HeadsUp"
          />
          <Box>
            <Text
              color="#A210C6"
              fontFamily="heading"
              fontSize={{ base: "24px", md: "28px" }}
              mt="5px"
            >
              Heads up!
            </Text>
            <Text
              textAlign="left"
              mt="5px"
              fontSize={{ base: "14px", md: "16px" }}
            >
              We have put the following security protocols in place to enhance
              the safety of your funds.
            </Text>
            <Text
              textAlign="left"
              mt="5px"
              fontSize={{ base: "14px", md: "16px" }}
            >
              - Your withdrawals will take 24 hours to be processed
            </Text>
            <Text
              textAlign="left"
              mt="5px"
              fontSize={{ base: "14px", md: "16px" }}
            >
              - You can only make one (1) withdrawal request at a time
            </Text>
          </Box>
          <Button
            mb="10px"
            mt="10px"
            bg="#A210C6"
            color="white"
            borderRadius="50px"
            onClick={onBankTransfer}
          >
            Continue
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

const ChooseBankModal = ({ isOpen, onClose, onOnlinePayment }) => {
  return (
    <Modal
      size={{ base: "sm", md: "md" }}
      theme={customTheme}
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader color="#A210C6" fontFamily="heading">
          Choose bank account
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody fontFamily="body">
          <Box>
            <Flex
              style={{
                cursor: "pointer",
              }}
              onClick={onOnlinePayment}
              justifyContent="space-between"
            >
              <Box p="5px">
                <Text>Wema Bank</Text>
                <Text>Kemi Joshua</Text>
              </Box>
              <ChevronRightIcon w="30px" h="45px" mt="10px" />
            </Flex>
            <Divider my={4} borderColor="gray.500" />
            <Button
              color="#A210C6"
              marginTop="20px"
              mt={{ base: "150px", md: "80px" }}
              mb={{ base: "20px", md: "20px" }}
              ml={{ base: "10px", md: "10px" }}
              leftIcon={<AddIcon />}
            >
              Add bank account
            </Button>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

const WithdrawModal = ({ isOpen, onClose, onOpenConfirmation, setAmount }) => {
  const [inputAmount, setInputAmount] = useState("");

  const handleWithdrawClick = () => {
    setAmount(inputAmount);
    onOpenConfirmation();
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
        size={{ base: "sm", md: "md" }}
      />

      <ModalOverlay />
      <ModalContent
        justifyContent="center"
        alignItems="center"
        textAlign="center"
      >
        <ModalHeader color="#A210C6" fontFamily="heading">
          Choose Amount
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          p={{ base: 2, md: 4 }}
        >
          <Text>Processing fee ₦50</Text>
          <FormControl mt="20px" fontFamily="body">
            <FormLabel fontFamily="body" textAlign="center">
              Input amount:
            </FormLabel>
            <Input
              type="number"
              value={inputAmount}
              border="1px solid black"
              placeholder="₦5000"
              onChange={(e) => setInputAmount(e.target.value)}
            />
          </FormControl>
          <Button
            mt="10px"
            mb="20px"
            bg="#A210C6"
            color="white"
            onClick={handleWithdrawClick}
            width={{ base: "full", md: "auto" }}
          >
            Withdraw
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

const ConfirmationModal = ({ isOpen, onClose, onConfirm, amount }) => {
  return (
    <Modal size={{ base: "sm", md: "md" }} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader color="#A210C6" fontFamily="heading">
          Confirmation
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody fontFamily="body" textAlign="left">
          <Text>
            You are about to transfer ₦{amount} to Adebola, Busola Mercy (Wema
            Bank).
          </Text>
          <Text mt="10px">A ₦50 transaction charge applies.</Text>
        </ModalBody>
        <ModalFooter justifyContent="center">
          <Button
            fontFamily="body"
            variant="ghost"
            color="gray.500"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            fontFamily="body"
            colorScheme="ghost"
            color="#A210C6"
            onClick={onConfirm}
          >
            Confirm
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

const MedicWalletPage = () => {
  const [showFundWalletModal, setShowFundWalletModal] = useState(false);
  const [showBankTransferModal, setShowBankTransferModal] = useState(false);
  const [showOnlinePaymentModal, setShowOnlinePaymentModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [amount, setAmount] = useState("");
  const navigate = useNavigate();
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

  const handleCloseOnlinePaymentModal = () => {
    setShowOnlinePaymentModal(false);
  };

  const handleOpenConfirmationModal = () => {
    setShowConfirmationModal(true);
  };

  const handleCloseConfirmationModal = () => {
    setShowConfirmationModal(false);
  };

  const handleConfirmWithdrawal = async () => {
    setLoading(true);
  
    const medicId = user?.userId;  
    const method = "WALLET"; 
  
    // const apiUrl = `http://localhost:8080/v1/api/wallets/medic-withdraw?medicId=${encodeURIComponent(medicId)}&amount=${encodeURIComponent(amount)}&method=${encodeURIComponent(method)}`;
    const apiUrl = `https://backend-c1pz.onrender.com/v1/api/wallets/withdraw?medicId=${encodeURIComponent(medicId)}&amount=${encodeURIComponent(amount)}&method=${encodeURIComponent(method)}`;
  
    try {
      const token = localStorage.getItem("token"); 
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
  
       const response = await axios.post(apiUrl, {}, { headers });
  
      if (response.data.success) {
       
        setLoading(false);
        toast.success("Withdrawal successful");
        setTimeout(() => {
          navigate("/medic-dashboard");
        }, 5000);

      } else {
        setLoading(false);
            console.error("Withdrawal failed");
            const errorMessage = response.data
              ? response.data.message
              : "Unknown failure";
            toast.error(errorMessage);
      }
    } catch (error) {
      setLoading(false);
      console.error("An error occurred:", error);
      toast.error("Error making withdrawal");
    }
  };

  const formatAmount = (amount) => {
    const num = Number(amount);
    return num.toLocaleString("en-US");
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
              w={{ base: "375px", md: "910px" }}
              h={{ base: "150px", md: "200px" }}
              mt={{ base: "10px", md: "0" }}
              mb={{ base: "10px", md: "30" }}
              paddingBottom={{ base: "20px", md: "" }}
              bg="#A210C6"
              borderRadius="20px"
            >
              <Flex w={{ base: "90vw", md: "80vw" }}>
                <Box
                  ml={{ base: "20px", md: "40px" }}
                  pt={{ base: "px", md: "8px" }}
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
                  >
                    Withdraw
                  </Button>
                </VStack>
              </Flex>
              <Flex
                ml={{ base: "20px", md: "40px" }}
                mt={{ base: "30px", md: "50px" }}
              >
                <Box marginBottom={{ base: "50px", md: "50px" }} color="white">
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
                      Total Made
                    </Text>
                    <Text textAlign="left" color="white" fontSize="10px">
                      ₦ {formatAmount(walletTotalCredit)}.00
                    </Text>
                  </Box>
                  <Box color="white" marginLeft="10px">
                    <Text textAlign="left" fontSize="10px">
                      Total Withdraw
                    </Text>
                    <Text textAlign="left" color="white" fontSize="10px">
                      ₦ {formatAmount(walletTotalDebit)}.00
                    </Text>
                  </Box>
                </Flex>
              </Flex>
            </Box>

            <Flex
              w={{ base: "90vw", md: "90%" }}
              ml={{ base: "0", md: "-100px" }}
              mt={{ base: "-10px", md: "-30px" }}
              justifyContent="center"
              className="transaction-tabs"
            >
              <VStack ml={{ base: "0", md: "0px" }} w="90%">
                <Tabs colorScheme="purple.100" mt={{ base: "" }}>
                  <TabList justifyContent="space-between">
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
      <HeadsUpModal
        isOpen={showFundWalletModal}
        onClose={handleCloseFundWalletModal}
        onBankTransfer={handleOpenBankTransferModal}
      />
      <ChooseBankModal
        isOpen={showBankTransferModal}
        onClose={handleCloseBankTransferModal}
        onOnlinePayment={handleOpenOnlinePaymentModal}
      />

      <WithdrawModal
        isOpen={showOnlinePaymentModal}
        onClose={handleCloseOnlinePaymentModal}
        onOpenConfirmation={handleOpenConfirmationModal}
        setAmount={setAmount}
      />

      <ConfirmationModal
        isOpen={showConfirmationModal}
        onClose={handleCloseConfirmationModal}
        onConfirm={handleConfirmWithdrawal}
        amount={amount}
      />

      <SearchTransactionModal
        isOpen={showSearchTransactionsModal}
        onClose={handleCloseSearchTransactionsModal}
      />
    </ChakraProvider>
  );
};

export default MedicWalletPage;
