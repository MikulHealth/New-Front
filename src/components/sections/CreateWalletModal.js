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
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.userReducer);
  const userId = user?.userId;

  useEffect(() => {
    // Fetch bank list for development purposes
    const devBankList = () => {
      return [
        { name: "Access Bank", code: "044" },
        { name: "Citibank", code: "023" },
        { name: "Diamond Bank", code: "063" },
        { name: "Ecobank Nigeria", code: "050" },
        { name: "Fidelity Bank Nigeria", code: "070" },
        { name: "First Bank of Nigeria", code: "011" },
        { name: "First City Monument Bank", code: "214" },
        { name: "Guaranty Trust Bank", code: "058" },
        { name: "Heritage Bank Plc", code: "030" },
        { name: "Keystone Bank Limited", code: "082" },
        { name: "Polaris Bank", code: "076" },
        { name: "Providus Bank Plc", code: "101" },
        { name: "Stanbic IBTC Bank Nigeria Limited", code: "221" },
        { name: "Standard Chartered Bank", code: "068" },
        { name: "Sterling Bank", code: "232" },
        { name: "Union Bank of Nigeria", code: "032" },
        { name: "United Bank for Africa", code: "033" },
        { name: "Unity Bank Plc", code: "215" },
        { name: "Wema Bank", code: "035" },
        { name: "Zenith Bank", code: "057" },
      ];
    };

    // const fetchBanks = async () => {
    //   try {
    //     const secretKey = process.env.PVB_SECRET_KEY;
    //     const url = `${process.env.PVB_BASE_URL}/api/v1/transfer/bank-list`;

    //     const response = await axios.get(url, {
    //       headers: {
    //         Authorization: `Bearer ${secretKey}`,
    //       },
    //     });

    //     if (response.data.status) {
    //       setBankList(response.data.data);
    //     } else {
    //       throw new Error("Failed to fetch bank list");
    //     }
    //   } catch (error) {
    //     toast({
    //       title: "Error",
    //       description: error.message,
    //       status: "error",
    //       duration: 5000,
    //       isClosable: true,
    //     });
    //   }
    // };

    if (isOpen) {
      setBankList(devBankList()); // Use the development bank list for now
      // fetchBanks(); // Uncomment this line to use the API call in production
    }
  }, [isOpen, toast]);

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
          <FormControl id="account-name" isRequired mt={4}>
            <FormLabel>Account Name</FormLabel>
            <Input
              type="text"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              title="Account name"
            />
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
        </ModalBody>
        <ModalFooter>
          <Button
            bg="#A210C6"
            color="white"
            mr={3}
            onClick={handleSubmit}
            isLoading={isLoading}
            spinner={<Spinner color="white" />}
          >
            Submit
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default WalletModal;
