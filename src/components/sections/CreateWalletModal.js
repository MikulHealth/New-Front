import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Text,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const WalletModal = ({ isOpen, onClose }) => {
  const [bvn, setBvn] = useState("");
  const [bankList, setBankList] = useState([]);
  const [selectedBank, setSelectedBank] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [bvnWarning, setBvnWarning] = useState("");
  const [accountNumberWarning, setAccountNumberWarning] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.userReducer);
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
            // "http://localhost:8080/v1/payment/bankName",
            "https://backend-c1pz.onrender.com/v1/payment/bankName",
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
            setIsFetching(false);
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

  const handleBvnChange = (e) => {
    const value = e.target.value;
    if (/^[0-9]{0,11}$/.test(value)) {
      setBvn(value);
      if (value.length !== 11) {
        setBvnWarning("BVN must be exactly 11 digits");
      } else {
        setBvnWarning("");
      }
    }
  };

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

  // const handleSubmit = async () => {
  //   if (bvn.length !== 11) {
  //     toast({
  //       title: "Error",
  //       description: "BVN must be exactly 11 digits",
  //       status: "error",
  //       duration: 5000,
  //       isClosable: true,
  //     });
  //     return;
  //   }
  //   if (accountNumber.length !== 10) {
  //     toast({
  //       title: "Error",
  //       description: "Account number must be exactly 10 digits",
  //       status: "error",
  //       duration: 5000,
  //       isClosable: true,
  //     });
  //     return;
  //   }

  //   const payload = {
  //     customerCode: userId,
  //     country: "NG",
  //     type: "bank_account",
  //     accountNumber,
  //     bvn,
  //     bankCode: selectedBank,
  //     firstName: user?.firstName,
  //     lastName: user?.lastName,
  //   };

  //   setIsLoading(true);
  //   try {
  //     const response = await axios.post(
  //       "http://localhost:8080/v1/payment/identify",
  //       payload,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${localStorage.getItem("token")}`,
  //         },
  //       }
  //     );

  //     if (response.data.status) {
  //       toast({
  //         description: "Customer Identification in progress",
  //         status: "success",
  //         duration: 5000,
  //         isClosable: true,
  //       });
  //       onClose();
  //       setTimeout(() => {
  //         navigate("/client-dashboard");
  //       }, 5000);
  //     } else {
  //       throw new Error(response.data.message || "Identification failed");
  //     }
  //   } catch (error) {
  //     toast({
  //       title: "Error",
  //       description: error.message || "Identification failed",
  //       status: "error",
  //       duration: 5000,
  //       isClosable: true,
  //     });
  //     setHasError(true);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleSubmit = async () => {
    console.log("user id:", userId);
    if (bvn.length !== 11) {
      toast({
        title: "Error",
        description: "BVN must be exactly 11 digits",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    if (accountNumber.length !== 10) {
      toast({
        title: "Error",
        description: "Account number must be exactly 10 digits",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const selectedBankDetails = bankList.find(
      (bank) => bank.code === selectedBank
    );

    const payload = {
      userId,
      bankName: selectedBankDetails ? selectedBankDetails.name : "",
      accountNumber,
      accountName,
      bvn,
      bankCode: selectedBank,
    };

    setIsLoading(true);
    try {
      const role = user?.setOfRole?.[0];
      let apiUrl = "";
      let dashboardUrl = "";

      if (role === "NEW_USER") {
        // apiUrl = "http://localhost:8080/v1/api/wallets/add-customer-bank";
        apiUrl =
          "https://backend-c1pz.onrender.com/v1/api/wallets/add-customer-bank";
        dashboardUrl = "/client-dashboard";
      } else if (role === "NEW_MEDIC") {
        // apiUrl = "http://localhost:8080/v1/api/wallets/add-medic-bank";
        apiUrl =
          "https://backend-c1pz.onrender.com/v1/api/wallets/add-medic-bank";
        dashboardUrl = "/medic-dashboard";
      }

      const response = await axios.post(apiUrl, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200 && response.data.success) {
        toast({
          //   title: "Success",
          description: "Wallet created successfully",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        onClose();
        setTimeout(() => {
          navigate(dashboardUrl);
        }, 5000);
      } else {
        throw new Error(response.data.message || "Failed to add bank details");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to add bank details",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent
        maxW={{ base: "90%", md: "500px" }}
        mx={{ base: "10px", md: "auto" }}
      >
        <ModalHeader color="#A210C6">Create your wallet</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text fontSize="sm" color="gray.500" mb={4}>
            We need your BVN to create a virtual wallet for secure and seamless
            transactions.
          </Text>
          <FormControl id="bvn" isRequired>
            <FormLabel>BVN</FormLabel>
            <Input
              type="text"
              value={bvn}
              onChange={handleBvnChange}
              title="BVN must be 11 digits"
            />
            {bvnWarning && (
              <Text fontSize="sm" color="red.500" fontStyle="italic">
                {bvnWarning}
              </Text>
            )}
          </FormControl>
          <FormControl id="bank-name" isRequired mt={4}>
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
          <FormControl id="account-number" isRequired mt={4}>
            <FormLabel>Account Number</FormLabel>
            <Input
              type="text"
              value={accountNumber}
              onChange={handleAccountNumberChange}
              title="Account number must be 10 digits"
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
                // fontWeight="bold"
                fontSize="sm"
                color={hasError ? "red.500" : "green.500"}
                // fontStyle="italic"
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
              onClick={handleSubmit}
              isLoading={isLoading}
              spinner={<Spinner color="white" />}
              ml={3}
              disabled={isFetching}
            >
              Submit
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

export default WalletModal;
