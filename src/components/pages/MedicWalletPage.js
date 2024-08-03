import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import LeftSideBar from "../authLayouts/MedicSideBar";
import { useSelector } from "react-redux";
import TransactionPinModal from "../sections/TransactionPinModal";
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
import WalletModal from "../sections/CreateWalletModal";
import { baseUrl } from "../../apiCalls/config";
import {
  ChakraProvider,
  VStack,
  Input,
  Button,
  Skeleton,
  useClipboard,
  Select,
  useToast,
  Spinner,
  Image,
  IconButton,
  Box,
  Text,
  Flex,
  useDisclosure,
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
import ReviewBankModal from "../sections/ReviewBankModal";

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

const HeadsUpModal = ({ isOpen, onClose, onBankTransfer }) => {
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");
  const modalWidth = isLargerThan768 ? "400px" : "90vw";

  const openBankList = () => {
    onClose();
    onBankTransfer();
  };

  return (
    <Modal
      theme={customTheme}
      isOpen={isOpen}
      onClose={onClose}
      size={{ base: "sm", sm: "md", md: "lg" }}
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
            onClick={openBankList}
          >
            Continue
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

const ChooseBankModal = ({
  isOpen,
  onClose,
  onOnlinePayment,
  onOpenAddBankModal,
  onSelectBank,
}) => {
  const { user } = useSelector((state) => state.userReducer);
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      const fetchBanks = async () => {
        try {
          const response = await axios.get(
            `${baseUrl}/api/wallets/${user?.userId}/banks`
          );
          const fetchedBanks = Array.isArray(response.data.data)
            ? response.data.data
            : [];
          setBanks(fetchedBanks);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching banks:", error);
          setBanks([]);
          setLoading(false);
        }
      };

      fetchBanks();
    }
  }, [isOpen, user]);

  const handleBankClick = (bank) => {
    onSelectBank(bank);
    onOnlinePayment();
  };

  return (
    <Modal size={{ base: "sm", sm: "md", md: "lg" }} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader color="#A210C6" fontFamily="heading">
          Choose bank account
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody fontFamily="body">
          {loading ? (
            <Skeleton height="20px" my="10px" />
          ) : banks.length === 0 ? (
            <Box textAlign="center">
              <Text mt="20px">No bank found.</Text>
            </Box>
          ) : (
            <Box maxH="300px" overflowY="auto">
              {banks.map((bank) => (
                <Box key={bank.id}>
                  <Flex
                    style={{
                      cursor: "pointer",
                    }}
                    onClick={() => handleBankClick(bank)}
                    justifyContent="space-between"
                  >
                    <Box p="5px">
                      <Text>{bank.bankName}</Text>
                      <Text>{bank.accountName}</Text>
                    </Box>
                    <ChevronRightIcon w="30px" h="45px" mt="10px" />
                  </Flex>
                  <Divider my={4} borderColor="gray.500" />
                </Box>
              ))}
            </Box>
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            mt="10px"
            mb="10px"
            colorScheme="ghost"
            color="#A210C6"
            leftIcon={<AddIcon />}
            onClick={onOpenAddBankModal}
          >
            Add bank account
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

const AddBankModal = ({ isOpen, onClose, onReviewBank }) => {
  const { user } = useSelector((state) => state.userReducer);
  const [bankList, setBankList] = useState([]);
  const [selectedBank, setSelectedBank] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountNumberWarning, setAccountNumberWarning] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [hasError, setHasError] = useState(false);
  const toast = useToast();

  const userId = user?.userId;

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const secretKey = "process.env.PAYSTACK_SECRET_KEY";
        const link = "https://api.paystack.co/bank";

        const response = await axios.get(link, {
          headers: {
            Authorization: `Bearer ${secretKey}`,
          },
        });

        if (response.data.status) {
          setBankList(response.data.data);
        } else {
          throw new Error("Failed to fetch bank list");
        }
      } catch (error) {
        toast({
          title: "Error",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };

    if (isOpen) {
      fetchBanks();
    }
  }, [isOpen, toast]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchAccountName = async () => {
      if (accountNumber.length === 10 && selectedBank) {
        setIsFetching(true);
        try {
          const response = await axios.post(
            `${baseUrl}/payment/bankName`,
            {
              accountNumber,
              bankCode: selectedBank,
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (response.data.account_name) {
            setAccountName(response.data.account_name);
            setHasError(false);
          } else {
            setAccountName(
              "Account name not found, please double check the number"
            );
            setHasError(true);
          }
          setIsFetching(false);
        } catch (error) {
          toast({
            title: "Error",
            description: error.message,
            status: "error",
            duration: 5000,
            isClosable: true,
          });
          setIsFetching(false);
        }
      }
    };

    fetchAccountName();
  }, [accountNumber, selectedBank, toast, user.token]);

  const handleAccountNumberChange = (e) => {
    const value = e.target.value;
    if (/^[0-9]{0,10}$/.test(value)) {
      setAccountNumber(value);
      if (value.length !== 10) {
        setAccountNumberWarning("Account number must be exactly 10 digits");
      } else {
        setAccountNumberWarning("");
      }
    }
  };

  const handleAddBank = () => {
    const selectedBankDetails = bankList.find(
      (bank) => bank.code === selectedBank
    );

    const newBank = {
      userId,
      bankName: selectedBankDetails ? selectedBankDetails.name : "",
      accountNumber,
      accountName,
      bankCode: selectedBank,
    };
    onReviewBank(newBank);
  };

  return (
    <Modal size={{ base: "sm", sm: "md", md: "lg" }} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader color="#A210C6" fontFamily="heading">
          Add Bank Account
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Bank Name</FormLabel>
            <Select
              placeholder="Select bank"
              value={selectedBank}
              onChange={(e) => setSelectedBank(e.target.value)}
            >
              {bankList.map((bank) => (
                <option key={bank.code} value={bank.code}>
                  {bank.name}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Account Number</FormLabel>
            <Input
              value={accountNumber}
              onChange={handleAccountNumberChange}
              placeholder="Enter account number"
            />
            {accountNumberWarning && (
              <Text fontSize="sm" color="red.500" fontStyle="italic">
                {accountNumberWarning}
              </Text>
            )}
          </FormControl>
          {isFetching ? (
            <Spinner size="sm" mt={4} />
          ) : (
            accountName && (
              <Text
                mt={4}
                fontSize="sm"
                color={hasError ? "red.500" : "green.500"}
              >
                {accountName}
              </Text>
            )
          )}
        </ModalBody>
        <ModalFooter>
          {!hasError && accountName && (
            <Button
              bg="#A210C6"
              color="white"
              onClick={handleAddBank}
              ml={3}
              disabled={isFetching}
            >
              Save
            </Button>
          )}
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

const WithdrawModal = ({ isOpen, onClose, onOpenConfirmation, setAmount }) => {
  const [inputAmount, setInputAmount] = useState("");
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [pinVerified, setPinVerified] = useState(false);
  const { user } = useSelector((state) => state.userReducer);
  const toast = useToast();

  const handleWithdrawClick = () => {
    if (!pinVerified) {
      setPinModalOpen(true);
    } else {
      setAmount(inputAmount);
      onOpenConfirmation();
    }
  };

  const handlePinSubmit = async (pin) => {
    const userId = user?.userId;

    if (user?.transactionPinCreated) {
      try {
        const response = await axios.post(
          `${baseUrl}/api/wallets/transaction-pin/match`,
          {
            userId,
            pin,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.data.success) {
          setPinVerified(true);
          setTimeout(() => {
            setPinModalOpen(false);
          }, 2000);
          setAmount(inputAmount);
          onOpenConfirmation();
        } else {
          toast({
            title: "Error",
            description: "Incorrect transaction pin",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "top-right",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Error verifying transaction pin",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
      }
    } else {
      try {
        const response = await axios.post(
          `${baseUrl}/api/wallets/transaction-pin/create`,
          {
            userId,
            pin,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.data.success) {
          setPinVerified(true);
          setTimeout(() => {
            setPinModalOpen(false);
          }, 2000);
          setAmount(inputAmount);
          onOpenConfirmation();
        } else {
          toast({
            title: "Error",
            description: "Failed to create transaction pin",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Error creating transaction pin",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  return (
    <>
      <Modal size={{ base: "sm", sm: "md", md: "lg" }} isOpen={isOpen} onClose={onClose}>
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
          <ModalHeader textAlign="left" color="#A210C6" fontFamily="heading">
            Choose Amount
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            flexDirection="column"
            justifyContent="left"
            alignItems="left"
            p={{ base: 2, md: 4 }}
          >
            <FormControl mt="20px" fontFamily="body">
              <FormLabel fontFamily="body" textAlign="left">
                Input amount:
              </FormLabel>
              <Input
                type="number"
                value={inputAmount}
                border="1px solid black"
                placeholder="₦5000"
                onChange={(e) => setInputAmount(e.target.value)}
                width={{ base: "full", md: "auto" }}
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
              Send
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>

      <TransactionPinModal
        isOpen={pinModalOpen}
        onClose={() => setPinModalOpen(false)}
        handleSubmit={handlePinSubmit}
      />
    </>
  );
};

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  amount,
  bankDetails,
}) => {
  const [isConfirming, setIsConfirming] = useState(false);

  const handleConfirm = async () => {
    setIsConfirming(true);
    await onConfirm();
    setIsConfirming(false);
  };

  const formatAmount = (amount) => {
    const num = Number(amount);
    return num.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <Modal size={{ base: "sm", sm: "md", md: "lg" }} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader color="#A210C6" fontFamily="heading">
          Confirmation
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody fontFamily="body" textAlign="left">
          <Text>
            You are about to transfer ₦{formatAmount(amount)} to{" "}
            {bankDetails?.accountName} ( {bankDetails?.accountNumber}{" "}
            {bankDetails?.bankName}).
          </Text>
          <Text mt="10px">A ₦50 transaction charge applies.</Text>
        </ModalBody>
        <ModalFooter justifyContent="center">
          <Button
            fontFamily="body"
            variant="ghost"
            color="gray.500"
            onClick={onClose}
            isDisabled={isConfirming}
          >
            Cancel
          </Button>
          <Button
            fontFamily="body"
            colorScheme="ghost"
            color="#A210C6"
            onClick={handleConfirm}
            isDisabled={isConfirming}
          >
            {isConfirming ? <Spinner size="sm" /> : "Confirm"}
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
  const [showAddBankModal, setShowAddBankModal] = useState(false);
  const [showReviewBankModal, setShowReviewBankModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [amount, setAmount] = useState("");
  const [reviewBankDetails, setReviewBankDetails] = useState(null);
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.userReducer);
  const accountNumber = user?.walletAccountNumber;
  const accountName = user?.walletBankName;
  const [selectedBankDetails, setSelectedBankDetails] = useState(null);
  const { hasCopied, onCopy } = useClipboard(accountNumber);
  const [loading, setLoading] = useState(true);
  const walletCreated = user?.walletCreated;
  const balance = user?.walletBalance;
  const walletTotalCredit = user?.walletTotalCredit;
  const walletTotalDebit = user?.walletTotalDebit;
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleOpenConfirmationModal = () => {
    setShowConfirmationModal(true);
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

  const handleOpenAddBankModal = () => {
    handleCloseBankTransferModal();
    setShowAddBankModal(true);
  };

  const handleCloseAddBankModal = () => {
    setShowAddBankModal(false);
  };

  const handleOpenReviewBankModal = (bankDetails) => {
    setReviewBankDetails(bankDetails);
    setShowReviewBankModal(true);
  };

  const handleCloseReviewBankModal = () => {
    setShowReviewBankModal(false);
  };

  const handleCloseConfirmationModal = () => {
    setShowConfirmationModal(false);
  };

  const handleConfirmWithdrawal = async () => {
    setLoading(true);

    const transferRequest = {
      customerId: user?.userId,
      amount: parseFloat(amount),
      method: "WALLET",
      narration: "Transfer to bank",
      currency: "NGN",
      bankCode: selectedBankDetails?.bankCode,
      accountNumber: selectedBankDetails?.accountNumber,
      source: user?.walletId,
      reference: "generated_reference",
    };

    const apiUrl = `${baseUrl}/api/wallets/withdraw`;

    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.post(apiUrl, transferRequest, { headers });

      if (response.data.success) {
        setLoading(false);
        toast.success("Transfer successful");
        setTimeout(() => {
          navigate("/medic-dashboard");
        }, 3000);
      } else {
        setLoading(false);
        const errorMessage = response.data.message || "Unknown failure";
        if (errorMessage === "Insufficient funds") {
          toast.error(
            "Insufficient funds. Please check your balance and try again."
          );
        } else {
          toast.error(errorMessage);
        }
      }
    } catch (error) {
      setLoading(false);
      console.error("An error occurred:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        const errorMessage = error.response.data.message;
        if (errorMessage === "Insufficient funds") {
          toast.error(
            "Insufficient funds. Please check your balance and try again."
          );
        } else {
          toast.error(errorMessage);
        }
      } else {
        toast.error("Error making transfer");
      }
    }
  };

  const formatAmount = (amount) => {
    const num = Number(amount);
    return num.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <ChakraProvider theme={customTheme}>
      <LeftSideBar />
      <VStack
        style={{ animation: "slideInUp 0.9s ease-in-out" }}
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
            <Box
              textAlign="center"
              w={{ base: "375px", md: "910px" }}
              h={{ base: "150px", md: "200px" }}
              mt={{ base: "10px", md: "0" }}
              mb={{ base: "10px", md: "30" }}
              paddingBottom={{ base: "20px", md: "" }}
              bg="linear-gradient(80deg, #A210C6, #E552FF)"
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
                      ₦ {formatAmount(balance)}
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
                    onClick={walletCreated ? handleOpenFundWalletModal : onOpen}
                    bg="white"
                  >
                    {walletCreated ? "Send funds" : "Create Wallet"}
                  </Button>
                </VStack>
              </Flex>
              {walletCreated && (
                <Flex
                  ml={{ base: "20px", md: "40px" }}
                  mt={{ base: "30px", md: "50px" }}
                >
                  <Box
                    fontWeight="bold"
                    marginBottom={{ base: "50px", md: "50px" }}
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
                        fontStyle={
                          !walletCreated || !accountName || !accountNumber
                            ? "italic"
                            : "normal"
                        }
                      >
                        {walletCreated && accountName && accountNumber
                          ? accountName
                          : "Processing, please wait..."}
                      </Text>
                      <Text
                        ml="10px"
                        textAlign="left"
                        fontSize={{ base: "10px", md: "16px" }}
                        fontStyle={
                          !walletCreated || !accountName || !accountNumber
                            ? "italic"
                            : "normal"
                        }
                      >
                        {walletCreated && accountName && accountNumber
                          ? accountNumber
                          : ""}
                      </Text>
                      {walletCreated && accountName && accountNumber && (
                        <IconButton
                          icon={hasCopied ? <CheckIcon /> : <CopyIcon />}
                          onClick={onCopy}
                          mt="-5px"
                          size="sm"
                          aria-label="Copy account number"
                          color="white"
                          bg={hasCopied ? "#A210C6" : "transparent"}
                          _hover={{ bg: "transparent" }}
                        />
                      )}
                    </Flex>
                  </Box>

                  <Flex marginLeft={{ base: "50px", md: "400px" }}>
                    <Box color="white">
                      <Text textAlign="left" fontSize="10px">
                        Total Made
                      </Text>
                      <Text textAlign="left" color="white" fontSize="10px">
                        ₦ {formatAmount(walletTotalCredit)}
                      </Text>
                    </Box>
                    <Box color="white" marginLeft="10px">
                      <Text textAlign="left" fontSize="10px">
                        Total Withdraw
                      </Text>
                      <Text textAlign="left" color="white" fontSize="10px">
                        ₦ {formatAmount(walletTotalDebit)}
                      </Text>
                    </Box>
                  </Flex>
                </Flex>
              )}
            </Box>
            <Text
              mb={{ base: "10px", md: "25px" }}
              mt="20px"
              textAlign="left"
              fontFamily="heading"
              fontWeight="bold"
              fontSize={{ base: "16px", md: "22px" }}
            >
              Recent activity
            </Text>

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
                      // ml={{ base: "35px", md: "0" }}
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
        onOpenAddBankModal={handleOpenAddBankModal}
        onSelectBank={setSelectedBankDetails}
      />
      <AddBankModal
        isOpen={showAddBankModal}
        onClose={handleCloseAddBankModal}
        onBankAdded={() => {
          setShowBankTransferModal(false);
          setShowBankTransferModal(true);
        }}
        onReviewBank={handleOpenReviewBankModal}
      />
      <ReviewBankModal
        isOpen={showReviewBankModal}
        onClose={handleCloseReviewBankModal}
        bankDetails={reviewBankDetails}
        onSave={() => {
          setShowReviewBankModal(false);
          setShowBankTransferModal(true);
        }}
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
        bankDetails={selectedBankDetails}
      />
      <SearchTransactionModal
        isOpen={showSearchTransactionsModal}
        onClose={handleCloseSearchTransactionsModal}
      />
      <WalletModal isOpen={isOpen} onClose={onClose} />
    </ChakraProvider>
  );
};

export default MedicWalletPage;
