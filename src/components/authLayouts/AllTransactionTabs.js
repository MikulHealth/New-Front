import React, { useState, useEffect } from "react";
import axios from "axios";
import LoadingSpinner from "../../utils/Spiner";
import { VStack, useToast, Box, Text, Flex, Divider } from "@chakra-ui/react";

export default function TransactionTab() {
  const toast = useToast();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        };

        const response = await axios.get(
        //   "http://localhost:8080/v1/api/wallets/transactions",
            "https://backend-c1pz.onrender.com/v1/wallets/transactions",
          config
        );

        if (response.data) {
          setTransactions(response.data.data);
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
  }, [toast]);
  

  const formatAmount = (amount) => {
    const num = Number(amount);
    return num.toLocaleString('en-US');
  
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

  return (
    <Box
      className="all-transaction"
      sx={{
        w: { base: "100%", md: "40vw" },
        h: { base: "60vh", md: "30vh" },
        overflowY: "auto", 
        '&::-webkit-scrollbar': {
        //   display: "none"  
        },
        msOverflowStyle: "none",  // IE and Edge
        scrollbarWidth: "none"  // Firefox
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
            No transaction yet. click on fund wallet to begin
          </Text>
        ) : (
          <VStack align="start" spacing={4}>
            {transactions.map((transaction) => (
              <Box fontSize={{ base: "12px", md: "16px" }} key={transaction.id}>
                <Flex>
                  <Text fontWeight="bold" color="black">
                    Amount:
                  </Text>
                  <Text ml={{ base: "10px", md: "5px" }} color="black">
                    {formatAmount(transaction.amount)}.00
                  </Text>
                </Flex>
                <Flex>
                  <Text fontWeight="bold" color="black">
                    Date:
                  </Text>
                  <Text ml={{ base: "10px", md: "5px" }} color="black">
                    {formatDateTime(transaction.transactionDate)}
                  </Text>
                </Flex>
              
                <Flex>
                  <Text fontWeight="bold" color="black">
                    Method:
                  </Text>
                  <Text
                    ml={{ base: "10px", md: "5px" }}
                  >
                    {transaction.method === "WALLET" ? "Wallet payment" : "Card payment"}
                  </Text>
                </Flex>
                <Flex>
                  <Text fontWeight="bold" color="black">
                    Type:
                  </Text>
                  <Text
                    ml={{ base: "10px", md: "5px" }}
                    color={transaction.type === "CREDIT" ? "green.500" : "red.500"}
                  
                  >
                    {transaction.type === "CREDIT" ? "Credit transaction" : "Debit transaction"}
                  </Text>
                </Flex>
                <Flex>
                  <Text fontWeight="bold" color="black">
                    Reference:
                  </Text>
                  <Text ml={{ base: "10px", md: "5px" }} color="black">
                    {`${transaction.id}`}
                  </Text>
                </Flex>
                <Flex
                  fontSize={{ base: "12px", md: "16px" }}
                  display={{ base: "flex", md: "none" }}
                  ml={{ base: "225px", md: "0" }}
                >
                  <Text
                    // onClick={() => handleViewMore(appointment.id)}
                    style={{
                      color: "#A210C6",
                      fontStyle: "italic",
                      cursor: "pointer",
                    }}
                    _hover={{ color: "#A210C6" }}
                  >
                    Details
                  </Text>
                  {/* <Text
                    ml={{ base: "30px" }}
                    color={
                      appointment.appointmentCompleted
                        ? "green.500"
                        : appointment.appointmentActive
                        ? "blue.500"
                        : appointment.appointmentMatched
                        ? "yellow.500"
                        : appointment.appointmentPending
                        ? "yellow.500"
                        : "black"
                    }
                    fontStyle="italic"
                  >
                    {appointment.appointmentCompleted
                      ? "Completed"
                      : appointment.appointmentActive
                      ? "Active"
                      : appointment.appointmentMatched
                      ? "Paired"
                      : appointment.appointmentPending
                      ? "Pending"
                      : "Unknown"}
                  </Text> */}
                </Flex>
                <Divider my={4} borderColor="gray.500" />
              </Box>
            ))}
          </VStack>
        )}
      </VStack>
    </Box>
  );
}
