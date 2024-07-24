import React, { useState } from "react";
import {
  Box,
  Flex,
  Text,
  VStack,
  Button,
  IconButton,
  extendTheme,
  Icon,
  keyframes,
} from "@chakra-ui/react";
import { CopyIcon, CheckIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import WalletModal from "../sections/CreateWalletModal";
import SubscribedAppointmentsDrawer from "./SubscribedAppointmentsDrawer";

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

const WalletComponent = ({
  user,
  accountNumber,
  hasCopied,
  onCopy,
  walletBankName,
  subscriptionsCount,
}) => {
  const { walletCreated, walletBalance } = user;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubscriptionsDrawerOpen, setIsSubscriptionsDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const formatAmount = (amount) => {
    const num = Number(amount);
    return num.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handleOpenWalletModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseWalletModal = () => {
    setIsModalOpen(false);
  };

  const handleButtonClick = () => {
    if (walletCreated) {
      navigate("/wallet");
    } else {
      handleOpenWalletModal();
    }
  };

  const handleSubscriptionsClick = () => {
    setIsSubscriptionsDrawerOpen(true);
  };

  const handleCloseSubscriptionsDrawer = () => {
    setIsSubscriptionsDrawerOpen(false);
  };

  const zoomAnimation = keyframes`
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.2);
    }
  `;

  return (
    <Box theme={customTheme}>
      <Box
        position="relative"
        textAlign="center"
        w={{ base: "375px", md: "702px" }}
        h={{ base: "151px", md: "250px" }}
        mt={{ base: "4px", md: "0" }}
        mb={{ base: "10px", md: "10px" }}
        paddingBottom={{ base: "20px", md: "" }}
        bg="#A210C6"
        borderRadius="20px"
      >
        {/* Left Gradient Circles */}
        <Box
          position="absolute"
          bottom={{ base: "0px", md: "20px" }}
          left={{ base: "10px", md: "20px" }}
          w={{ base: "100px", md: "144px" }}
          h={{ base: "100px", md: "144px" }}
          borderRadius="50%"
          bg="#D087E2"
          opacity="0.3"
          zIndex={1}
          className="outer-circle"
        />
        <Box
          position="absolute"
          bottom={{ base: "0px", md: "38px" }}
          left={{ base: "20px", md: "38px" }}
          w={{ base: "80px", md: "113px" }}
          h={{ base: "80px", md: "113px" }}
          borderRadius="50%"
          bg="#ECCFF4"
          opacity="0.3"
          zIndex={1}
          className="middle-circle"
        />
        <Box
          position="absolute"
          bottom={{ base: "0px", md: "55px" }}
          left={{ base: "27.5px", md: "55px" }}
          w={{ base: "60px", md: "82px" }}
          h={{ base: "60px", md: "82px" }}
          borderRadius="50%"
          bg="#D087E2"
          opacity="1"
          zIndex={1}
          className="inner-circle"
        />

        {/* Right Gradient Circles */}
        <Box
          position="absolute"
          bottom={{ base: "0px", md: "18px" }}
          right={{ base: "10px", md: "75px" }}
          w={{ base: "100px", md: "144px" }}
          h={{ base: "100px", md: "144px" }}
          borderRadius="50%"
          bg="#D087E2"
          opacity="0.3"
          zIndex={1}
          className="outer-circle"
        />
        <Box
          position="absolute"
          bottom={{ base: "0px", md: "28px" }}
          right={{ base: "20px", md: "88px" }}
          w={{ base: "80px", md: "113px" }}
          h={{ base: "80px", md: "113px" }}
          borderRadius="50%"
          bg="#ECCFF4"
          opacity="0.3"
          zIndex={1}
          className="middle-circle"
        />
        <Box
          position="absolute"
          bottom={{ base: "0px", md: "35px" }}
          right={{ base: "27.5px", md: "100px" }}
          w={{ base: "60px", md: "82px" }}
          h={{ base: "60px", md: "82px" }}
          borderRadius="50%"
          bg="#D087E2"
          opacity="1"
          zIndex={1}
          className="inner-circle"
        />

        <Flex position="relative" zIndex={2}>
          <Box marginLeft="20px" paddingTop="5px">
            <Text
              fontSize="16px"
              textAlign="left"
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
                ₦{walletCreated ? formatAmount(walletBalance) : "__.__"}
              </Text>
            </Flex>
          </Box>
          <VStack>
            <Button
              padding={{ base: "5px", md: "0" }}
              mt={{ base: "10px" }}
              ml={{ base: "110px", md: "360px" }}
              w={{ base: "100px", md: "35%" }}
              h={{ base: "30px", md: "50%" }}
              fontSize={{ base: "12px", md: "16px" }}
              borderRadius="15px"
              color="#A210C6"
              marginTop="20px"
              fontFamily="body"
              onClick={handleButtonClick}
              bg="white"
            >
              {walletCreated ? "Fund Wallet" : "Create Wallet"}
            </Button>
          </VStack>
        </Flex>
        <VStack
          mb={{ base: "35px", md: "0" }}
          mt={{ base: "20px", md: "20px" }}
          ml={{ base: "-168px" }}
          color="white"
          position="relative"
          zIndex={2}
        >
          {walletCreated && (
            <Box
              mt={{ base: "0px", md: "85px" }}
              ml={{ base: "25px", md: "-255px" }}
            >
              <Text fontFamily="body" fontWeight="bold" textAlign="left">
                Wallet ID:
              </Text>
              <Flex>
                <Text
                  textAlign="left"
                  fontSize={{ base: "10px", md: "16px" }}
                  fontStyle={
                    !walletCreated || !walletBankName || !accountNumber
                      ? "italic"
                      : "normal"
                  }
                >
                  {walletCreated && walletBankName && accountNumber
                    ? walletBankName
                    : "Processing, please wait..."}
                </Text>
                <Text
                  ml="10px"
                  textAlign="left"
                  fontSize={{ base: "10px", md: "16px" }}
                  fontStyle={
                    !walletCreated || !walletBankName || !accountNumber
                      ? "italic"
                      : "normal"
                  }
                >
                  {walletCreated && walletBankName && accountNumber
                    ? accountNumber
                    : ""}
                </Text>
                {walletCreated && walletBankName && accountNumber && (
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
                )}
              </Flex>
            </Box>
          )}
        </VStack>
        <WalletModal isOpen={isModalOpen} onClose={handleCloseWalletModal} />
      </Box>

      <Box
        w={{ base: "370px", md: "690px" }}
        h={{ base: "50px", md: "65px" }}
        mb={{ md: "20px" }}
        style={{ boxShadow: "0px 4px 8px rgba(162, 16, 198, 0.4)" }}
        borderRadius="4px"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        padding="20px"
        cursor="pointer"
        onClick={handleSubscriptionsClick}
      >
        <Text
          fontSize={{ base: "14px", md: "20px" }}
          fontFamily="heading"
          color="#A210C6"
          fontWeight="bold"
        >
          Subscribed appointments
        </Text>
        <Flex>
          <Text
            fontWeight="bold"
            fontSize={{ base: "18px", md: "22px" }}
            color="#A210C6"
          >
            {subscriptionsCount}
          </Text>
          <Icon
            ml="5px"
            as={FaHeart}
            color="#A210C6"
            mt={{ base: "px", md: "5px" }}
            w={5}
            h={5}
            animation={`${zoomAnimation} 2s infinite`}
          />
        </Flex>
      </Box>

      <SubscribedAppointmentsDrawer
        isOpen={isSubscriptionsDrawerOpen}
        onClose={handleCloseSubscriptionsDrawer}
        user={user}
      />
    </Box>
  );
};

export default WalletComponent;
