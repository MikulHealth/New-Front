import React, { useState, useEffect } from "react";
import { SetUser } from "../../redux/userSlice";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Box,
  Text,
  Flex,
  Image,
} from "@chakra-ui/react";
import CardPayment from "../../assets/OnlinePayment.svg";
import Wallet from "../../assets/WalletIcon.svg";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { GetCurrentUser } from "../../apiCalls/UserApis";
import InsufficientFundsModal from "./InsufficientFundsModal";

function PaymentModal({ isOpen, onClose, paymentData }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.userReducer);
  const balance = user?.walletBalance;
  const [amountNeeded, setAmountNeeded] = useState(0);

  const [showInsufficientModal, setShowInsufficientModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      // setLoading(true);

      if (localStorage.getItem("token")) {
        try {
          console.log("Calling GetCurrentUser API");
          const response = await GetCurrentUser();

          if (response.success) {
            console.log("API response:", response.data);
            dispatch(SetUser(response.data));
          } else {
            console.error("API request failed:", response.error);
          }
        } catch (error) {
          console.error("Error in GetCurrentUser API:", error);
        } finally {
          // setLoading(false);
          // setShowSkeleton(false);
        }
      } else {
        navigate("/login");
      }
    };

    fetchData();
  }, [navigate, dispatch]);

  const handleWalletPayment = () => {
    console.log("Paying with wallet...");
    console.log("User balance..." + balance);
    console.log(paymentData)
    const { costOfService } = paymentData;
    console.log("cos..." + costOfService / 100)
    const formattedCost = costOfService / 100;

    if (balance > formattedCost) {
      setTimeout(() => {
        navigate("/wallet-confirmation", {
          state: { ...paymentData },
        });
      }, 1000);
      onClose();
    } else {
      setAmountNeeded(formattedCost); 
      setShowInsufficientModal(true); 
    }
  };

  const handleCardPayment = () => {
    console.log("Paying online...");
    setTimeout(() => {
      navigate("/make-payment", {
        state: { ...paymentData },
      });
    }, 1000);
    onClose();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent bg="#A210C6">
          <ModalHeader color="white" textAlign="center">How do you want to pay?</ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody paddingBottom="25px">
          <Box
            bg="white"
            marginLeft="8px"
            borderRadius="15px"
            onClick={handleWalletPayment}
            style={{
              cursor: "",
            }}
            _hover={{ color: "#A210C6" }}
          >
            <Flex>
              <Image
                marginLeft="15px"
                marginTop="15px"
                w="30px"
                h="30px"
                boxSize={["20px", "30px"]}
                src={Wallet}
                alt="Settings"
              />
              <Box marginLeft="10px" padding="10px" paddingBottom="10px">
                <Text fontSize={["lg", "xl"]} fontWeight="bold">
                  Via Wallet
                </Text>
                <Text fontSize={["sm", "md"]}>
                  Make payment directly from your Mikul Health wallet
                </Text>
              </Box>
              {/* <Image
               display={{base: "none", md: "block"}}
                marginLeft="15px"
                marginTop="25px"
                w="30px"
                h="30px"
                boxSize={["20px", "30px"]}
                src={RightArrow}
                alt="Settings"
              /> */}
            </Flex>
          </Box>
          <Box
            bg="white"
            marginTop="15px"
            marginLeft="8px"
            borderRadius="15px"
            onClick={handleCardPayment}
            style={{
              cursor: "",
            }}
            _hover={{ color: "#A210C6" }}
          >
            <Flex>
              <Image
                marginLeft="15px"
                marginTop="15px"
                w="30px"
                h="30px"
                boxSize={["20px", "30px"]}
                src={CardPayment}
                alt="Settings"
              />
              <Box marginLeft="10px" padding="10px" paddingBottom="10px">
                <Text fontSize={["lg", "xl"]} fontWeight="bold">
                  Card Payment
                </Text>
                <Text fontSize={["sm", "md"]}>
                  Make payment for booking with card
                </Text>
              </Box>
              {/* <Image
              display={{base: "none", md: "block"}}
                marginLeft="15px"
                marginTop="25px"
                w="30px"
                h="30px"
                boxSize={["20px", "30px"]}
                src={RightArrow}
                alt="Settings"
              /> */}
            </Flex>
          </Box>
        </ModalBody>
        </ModalContent>
      </Modal>
      {showInsufficientModal && (
        <InsufficientFundsModal
          isOpen={showInsufficientModal}
          onClose={() => setShowInsufficientModal(false)}
          amountNeeded={amountNeeded.toFixed(2)}
        />
      )}
    </>
  );
}

export default PaymentModal;
