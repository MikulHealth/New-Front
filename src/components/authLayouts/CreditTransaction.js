import React, { useState, useEffect } from "react";
import axios from "axios";
import LoadingSpinner from "../../utils/Spiner";
import { VStack, useToast, Box, Text, Flex, Image } from "@chakra-ui/react";
import CreditIcon from "../../assets/CreditIcon.svg";
import DebitIcon from "../../assets/DebitIcon.svg";
import { useSelector } from "react-redux";

export default function TransactionTab() {
  const toast = useToast();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state) => state.userReducer);
  const id = user?.userId;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const customerId = id;
        const config = {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        };

        const response = await axios.get(
          `https://backend-c1pz.onrender.com/v1/api/wallets/${customerId}/credits`,
          //             // `http://localhost:8080/v1/api/wallets/${customerId}/credits`,
          config
        );

        if (response.data) {
          const sortedTrans = response.data.data.sort(
            (a, b) => new Date(b.transactionDate) - new Date(a.transactionDate)
          );
          setTransactions(sortedTrans);
        } else {
          console.error("Failed to fetch transactions");
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast, id]);

  const formatAmount = (amount) => {
    const num = Number(amount);
    return num.toLocaleString("en-US");
  };
  const formatTimeDifference = (date) => {
    const now = new Date();
    const transactionDate = new Date(date);
  
    // Adjust for timezone differences if needed
    const timezoneOffset = now.getTimezoneOffset() * 60000; // in milliseconds
    const diff = now - (transactionDate - timezoneOffset); // Difference in milliseconds
  
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
  
    if (seconds < 60) {
      return `${seconds} seconds ago`;
    } else if (minutes < 60) {
      return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
    } else if (hours < 24) {
      const remainingMinutes = minutes % 60;
      return `${hours} hour${hours !== 1 ? "s" : ""} ${remainingMinutes} minute${remainingMinutes !== 1 ? "s" : ""} ago`;
    } else {
      return `${days} day${days !== 1 ? "s" : ""} ago`;
    }
  };
  

  return (
    <Box
      className="all-transaction"
      sx={{
        w: { base: "100%", md: "40vw" },
        h: { base: "60vh", md: "30vh" },
        overflowY: "auto",
        overflowX: "hidden",
        "&::-webkit-scrollbar": {
          display: "none",
        },
        msOverflowStyle: "none", // IE and Edge
        scrollbarWidth: "none", // Firefox
      }}
    >
      <VStack align="start" spacing={4}>
        {loading ? (
          <LoadingSpinner />
        ) : transactions.length === 0 ? (
          <Text
            fontSize={{ base: "10px", md: "16px" }}
            ml={{ base: "10px", md: "35px" }}
          >
            No transaction yet. 
          </Text>
        ) : (
          <Box>
            <Flex
              mt="-10px"
              mb="50px"
              w={{ base: "90vw", md: "600px" }}
              position="fixed"
              ml={{ base: "40px", md: "-20px" }}
              justifyContent="space-between"
              bg="#D087E2"
              p={4}
              borderRadius="md"
              color="white"
              fontSize={{ base: "10px", md: "14px" }}
            >
              <Text ml={{ md: "40px" }} fontWeight="bold">
                Name
              </Text>
              <Text fontWeight="bold">Amount</Text>
              <Text fontWeight="bold">Time</Text>
              <Text mr={{ md: "40px" }} fontWeight="bold">
                Status
              </Text>
            </Flex>
            <Box
              mb={{ base: "50", md: "50px" }}
              w={{ base: "100vw", md: "560px" }}
              ml={{ base: "20px", md: "-16px" }}
              // overflow="scroll"
              justifyContent="space-between"
              mt={{ base: 10, md: 12 }}
              align="start"
              spacing={4}
            >
              {transactions.map((transaction) => (
                <Box
                  w={{ base: "90vw", md: "550px" }}
                  p={4}
                  borderBottom="1px solid #e2e8f0"
                  // ml={{ base: "10px" }}
                  key={transaction.id}
                >
                  <Flex
                    fontSize={{ base: "10px", md: "14px" }}
                    textAlign="left"
                    // ml={{ base: "-25px", md: "-20px" }}
                    justifyContent="space-between"
                    wrap="wrap"
                  >
                    <Flex ml={{ base: "5px", md: "0px" }}>
                      <Image
                        src={
                          transaction.type === "CREDIT" ? CreditIcon : DebitIcon
                        }
                        // mt={{ base: "0px", md: "0px" }}
                        // ml={{ base: "0px", md: "0px" }}
                        w={{ base: "30px", md: "25px" }}
                        h={{ base: "15px", md: "25px" }}
                        borderRadius="100px"
                      />
                      <Text
                        ml={{ base: "-5px", md: "5px" }}
                        color={
                          transaction.type === "CREDIT"
                            ? "green.500"
                            : "red.500"
                        }
                        maxW={{ base: "80px", md: "100px" }}
                        wordWrap="break-word"
                      >
                        {transaction.type === "CREDIT"
                          ? "MH incoming payment"
                          : "MH outgoing payment"}
                      </Text>
                    </Flex>

                    <Text
                      ml={{ base: "-20px", md: "-20px" }}
                      color="black"
                      maxW={{ base: "80px", md: "100px" }}
                      wordWrap="break-word"
                    >
                      {formatAmount(transaction.amount)}
                    </Text>
                    <Text
                      ml={{ base: "8px", md: "50px" }}
                      color="black"
                      maxW={{ base: "80px", md: "100px" }}
                      wordWrap="break-word"
                    >
                      {formatTimeDifference(transaction.transactionDate)}
                    </Text>
                    <Box
                      mr={{ base: "-30px", md: "-25px" }}
                      ml={{ md: "0px" }}
                      w={{ base: "60px", md: "80px" }}
                      h={{ base: "28px", md: "25px" }}
                      textAlign="center"
                      borderRadius="10px"
                      p="5px"
                      bg="#ACE1C1"
                    >
                      <Text
                        fontSize={{ base: "10px", md: "12px" }}
                        color="#057B1F"
                        textAlign="center"
                        maxW={{ base: "50px", md: "100px" }}
                        wordWrap="break-word"
                      >
                        Completed
                      </Text>
                    </Box>
                  </Flex>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </VStack>
    </Box>
  );
}
