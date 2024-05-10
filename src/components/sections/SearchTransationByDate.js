import React, { useState, useEffect } from "react";
import {
  VStack,
  Text,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Box,
  Flex,
  Progress,
  Divider,
} from "@chakra-ui/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const SearchTransactionModal = ({ isOpen, onClose }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]); const [transactionsModalOpen, setTransactionsModalOpen] = useState(false);
//   const [searchTrigger, setSearchTrigger] = useState(false);
  const { user } = useSelector((state) => state.userReducer);
  const id = user?.userId;

  const formatDateToISO = (date) => {
    return date ? date.toISOString().split('T')[0] : '';  
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!selectedDate) return;  

      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const customerId = id;
        const formattedDate = formatDateToISO(selectedDate);
        const url = `https://backend-c1pz.onrender.com/v1/api/wallets/${customerId}/transactions/by-date?date=${formattedDate}`;
        // const url = `http://localhost:8080/v1/api/wallets/${customerId}/transactions/by-date?date=${formattedDate}`;
      
        const response = await axios.get(url, config);

        if (response.data && response.data.success) {
          setTransactions(response.data);
          console.log("Transactions "+ response.data)
          toast.success("Transactions loaded successfully");
        } else {
            toast.error("Failed to fetch transactions");
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
    // const nextDay = new Date(date);
    // nextDay.setDate(date.getDate());
    setSelectedDate(date);
    // setSearchTrigger(true);
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
    const formattedDateTime = new Date(dateTimeString).toLocaleDateString(
      undefined,
      options
    );
    return formattedDateTime;
  };

//   const formatDate = (dateString) => {
//     const options = { year: "numeric", month: "long", day: "numeric" };
//     const formattedDate = new Date(dateString).toLocaleDateString(
//       undefined,
//       options
//     );
//     return formattedDate;
//   };

  const formatAmount = (amount) => {
    const num = Number(amount);
    return num.toLocaleString("en-US");
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
        borderRadius="0px"
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
        <ModalContent h="70vh" maxH="80vh" overflowY="auto">
          <ModalHeader color="#A210C6">Search transaction(s)</ModalHeader>

          <ModalCloseButton />
          <ModalBody>
            <Progress marginBottom="20px" size="xs" isIndeterminate />
            <Flex align="center" justify="center">
              <Box>
                <Flex>
                  <Flex
                    style={{
                      cursor: "pointer",
                    }}
                    _hover={{ color: "#A210C6" }}
                    align="center"
                    mb={4}
                  >
                    <Text fontWeight="bold" color="black" marginRight="10px">
                      Select Date:{" "}
                    </Text>
                    <DatePicker
                      selected={selectedDate}
                      onChange={handleDateChange}
                      maxDate={new Date()}
                      peekNextMonth
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      dateFormat="dd-MM-yyyy"
                      placeholderText="here"
                      className="form-control"
                      style={{
                        border: "1px solid #ced4da",
                        borderRadius: "4px",
                        marginLeft: "10px",
                      }}
                    />
                  </Flex>
                  <Button
                    bg="#A210C6"
                    onClick={() => handleDateChange(new Date())}
                    mb={4}
                    color="white"
                    h="4vh"
                    w="10vw"
                    isLoading={loading}
                    loadingText="Searching..."
                    marginLeft="10px"
                  >
                    {loading ? "Searching..." : "Search"}
                  </Button>
                </Flex>
                <Divider my={4} borderColor="gray.500" />
                <Flex>
                  {transactionsModalOpen && transactions && (
                    <Modal
                      isOpen={transactionsModalOpen}
                      onClose={() => {
                        setTransactionsModalOpen(false);
                        handleDateChange(null);
                      }}
                      size="3xl"
                    >
                      <ModalOverlay />
                      <ModalContent overflowY="auto">
                        <ModalHeader color="#A210C6">
                          Appointment Details
                        </ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                          <VStack
                            mb={{ base: "200px", md: "0" }}
                            ml={{ base: "20px", md: "" }}
                            align="start"
                            spacing={4}
                          >
                            {transactions.map((transaction) => (
                              <Box
                                fontSize={{ base: "12px", md: "16px" }}
                                key={transaction.id}
                              >
                                <Flex>
                                  <Text fontWeight="bold" color="black">
                                    Amount:
                                  </Text>
                                  <Text
                                    ml={{ base: "10px", md: "5px" }}
                                    color="black"
                                  >
                                    {formatAmount(transaction.amount)}.00
                                  </Text>
                                </Flex>
                                <Flex>
                                  <Text fontWeight="bold" color="black">
                                    Date:
                                  </Text>
                                  <Text
                                    ml={{ base: "10px", md: "5px" }}
                                    color="black"
                                  >
                                    {formatDateTime(
                                      transaction.transactionDate
                                    )}
                                  </Text>
                                </Flex>

                                <Flex>
                                  <Text fontWeight="bold" color="black">
                                    Method:
                                  </Text>
                                  <Text ml={{ base: "10px", md: "5px" }}>
                                    {transaction.method === "WALLET"
                                      ? "Wallet payment"
                                      : "Card payment"}
                                  </Text>
                                </Flex>
                                <Flex>
                                  <Text fontWeight="bold" color="black">
                                    Type:
                                  </Text>
                                  <Text
                                    ml={{ base: "10px", md: "5px" }}
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
                                </Flex>
                                <Flex>
                                  <Text fontWeight="bold" color="black">
                                    Reference:
                                  </Text>
                                  <Text
                                    ml={{ base: "10px", md: "5px" }}
                                    color="black"
                                  >
                                    {`${transaction.id}`}
                                  </Text>
                                </Flex>

                                <Divider my={4} borderColor="gray.500" />
                              </Box>
                            ))}
                          </VStack>
                        </ModalBody>
                      </ModalContent>
                    </Modal>
                  )}
                </Flex>
              </Box>
            </Flex>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SearchTransactionModal;
