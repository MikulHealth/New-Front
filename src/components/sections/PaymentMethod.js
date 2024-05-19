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
  useMediaQuery,
  extendTheme,
} from "@chakra-ui/react";
import CardPayment from "../../assets/OnlinePayment.svg";
import Wallet from "../../assets/WalletIcon.svg";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { GetCurrentUser } from "../../apiCalls/UserApis";
import InsufficientFundsModal from "./InsufficientFundsModal";

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
    body: "Gill Sans MT, sans-serif",
    heading: "Gill Sans MT, sans-serif",
  },
});

function PaymentModal({ isOpen, onClose, paymentData }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.userReducer);
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");
  const modalWidth = isLargerThan768 ? "400px" : "90vw";
  const balance = user?.walletBalance;
  const [amountNeeded, setAmountNeeded] = useState(0);
  const [showInsufficientModal, setShowInsufficientModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (localStorage.getItem("token")) {
        try {
          const response = await GetCurrentUser();

          if (response.success) {
            dispatch(SetUser(response.data));
          } else {
          }
        } catch (error) {
        } finally {
        }
      } else {
        navigate("/login");
      }
    };

    fetchData();
  }, [navigate, dispatch]);

  const handleWalletPayment = () => {
    const { costOfService } = paymentData;
    const numericBalance = Number(balance);
    const numericCostOfService = Number(paymentData.costOfService);

    if (numericBalance > numericCostOfService) {
      setTimeout(() => {
        navigate("/wallet-confirmation", {
          state: { ...paymentData },
        });
      }, 1000);
      onClose();
    } else {
      setAmountNeeded(costOfService);
      setShowInsufficientModal(true);
    }
  };

  const handleCardPayment = () => {
    setTimeout(() => {
      navigate("/make-payment", {
        state: { ...paymentData },
      });
    }, 1000);
    onClose();
  };

  const formatAmount = (amount) => {
    const num = Number(amount);
    return num.toLocaleString();
  };

  return (
    <>
      <Modal theme={customTheme} isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent
          width={modalWidth}
          borderRadius="25px 25px 25px 0px"
          bg="#A210C6"
        >
          <ModalCloseButton color="white" />
          <ModalHeader
            fontFamily="heading"
            fontSize={{ base: "18px", md: "20px" }}
            mt="20px"
            color="white"
            textAlign="center"
          >
            The cost for the service is ₦
            {formatAmount(paymentData.costOfService)} <br></br>
            How do you want to pay?
          </ModalHeader>

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
                  <Text
                    fontFamily="heading"
                    fontSize={["lg", "xl"]}
                    fontWeight="bold"
                  >
                    Via Wallet
                  </Text>
                  <Text fontFamily="body" fontSize={["sm", "md"]}>
                    Pay with your Mikul Health wallet
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
              fontFamily="body"
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
                  <Text
                    fontFamily="heading"
                    fontSize={["lg", "xl"]}
                    fontWeight="bold"
                  >
                    Card Payment
                  </Text>
                  <Text fontFamily="body" fontSize={["sm", "md"]}>
                    Pay with your card
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
          amountNeeded={amountNeeded}
        />
      )}
    </>
  );
}

export default PaymentModal;
