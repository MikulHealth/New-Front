import React, { useState, useEffect } from "react";
import {
  VStack,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Box,
  Progress,

} from "@chakra-ui/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { baseUrl } from "../../apiCalls/config";

const SearchTransactionModal = ({ isOpen, onClose }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const { user } = useSelector((state) => state.userReducer);
  const id = user?.userId;

  const formatDateToISO = (date) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + 1);
    return date ? newDate.toISOString().split("T")[0] : "";
  };

  useEffect(() => {
    if (!selectedDate) return;

    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const formattedDate = formatDateToISO(selectedDate);
        const url = `${baseUrl}/api/wallets/${id}/transactions/by-date?date=${formattedDate}`;

        const response = await axios.get(url, config);

        if (response.data && response.data.success) {
          if (response.data.data.length > 0) {
            setTransactions(response.data.data);
            toast.success("Transactions loaded successfully");
          } else {
            setTransactions([]);
            toast.warning("No transactions found for this date.");
          }
        } else {
          setTransactions([]);
          toast.error(response.data.message || "Failed to fetch transactions");
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
        toast.error("Failed to fetch transactions due to an error");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [selectedDate, id, isOpen]);

  const handleDateChange = (date) => {
    // const newDate = new Date(date);
    // newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(date);
  };

  const formatDateTime = (dateTimeString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    };
    return new Date(dateTimeString).toLocaleDateString(undefined, options);
  };

  const formatAmount = (amount) => {
    return Number(amount).toLocaleString("en-US");
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          setSelectedDate(null);
          setTransactions([]);
        }}
        size="xl"
        isCentered
      >
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
          <ModalHeader color="#A210C6">Search Transactions</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box
              style={{
                cursor: "pointer",
              }}
              _hover={{ color: "#A210C6" }}
              mb="20px"
            >
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                maxDate={new Date()}
                peekNextMonth
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                dateFormat="dd-MM-yyyy"
                placeholderText="Select a date"
              />
            </Box>

            {loading ? (
              <Progress size="xs" isIndeterminate />
            ) : (
              transactions.length > 0 && (
                <VStack
                  mt="20px"
                  mb="20px"
                  spacing={4}
                  overflowY="auto"
                  maxH="60vh"
                >
                  {transactions.map((transaction, index) => (
                    <Box
                      style={{
                        boxShadow: "0px 4px 8px rgba(162, 16, 198, 0.4)",
                        transition: "transform 0.3s ease-in-out",
                      }}
                      key={index}
                      p={4}
                      shadow="md"
                      borderWidth="1px"
                      mb="20px"
                    >
                      <Text>Amount: {formatAmount(transaction.amount)}</Text>
                      <Text>
                        Date: {formatDateTime(transaction.transactionDate)}
                      </Text>
                      <Text>Method: {transaction.method}</Text>
                      <Text>Reference: {transaction.id}</Text>
                      <Text
                        color={
                          transaction.type === "CREDIT"
                            ? "green.500"
                            : "red.500"
                        }
                      >
                        {transaction.type === "CREDIT"
                          ? "Credit transaction"
                          : "Debit transaction"}
                      </Text>
                    </Box>
                  ))}
                </VStack>
              )
            )}
          </ModalBody>
          <ModalFooter>
           
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SearchTransactionModal;
