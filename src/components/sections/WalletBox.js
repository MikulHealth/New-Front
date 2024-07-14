import { Box, Flex, Text, VStack, Button, IconButton } from "@chakra-ui/react";
import { CopyIcon, CheckIcon } from "@chakra-ui/icons";

const WalletBox = ({
  user,
  accountNumber,
  hasCopied,
  onCopy,
  handleOpenFundWalletModal,
  handleOpenWalletModal,
}) => {
  const { walletCreated, walletBalance, walletTotalCredit, walletTotalDebit } =
    user;

  const formatAmount = (amount) => {
    const num = Number(amount);
    return num.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <Box
      position="relative"
      textAlign="center"
      w={{ base: "375px", md: "910px" }}
      h={{ base: "151px", md: "250px" }}
      mt={{ base: "10px", md: "0" }}
      mb={{ base: "10px", md: "30" }}
      paddingBottom={{ base: "20px", md: "" }}
      bg="#A210C6"
      borderRadius="20px"
      overflow="hidden"
    >
      {/* Left Gradient Circles */}
      <Box
        position="absolute"
        bottom={{ base: "-50px", md: "20px" }}
        left={{ base: "-50px", md: "20px" }}
        w={{ base: "100px", md: "144px" }}
        h={{ base: "100px", md: "144px" }}
        borderRadius="50%"
        bg="#D087E2"
        opacity="0.3"
        zIndex={1}
      />
      <Box
        position="absolute"
        bottom={{ base: "-40px", md: "38px" }}
        left={{ base: "-40px", md: "38px" }}
        w={{ base: "80px", md: "113px" }}
        h={{ base: "80px", md: "113px" }}
        borderRadius="50%"
        bg="#ECCFF4"
        opacity="0.3"
        zIndex={1}
      />
      <Box
        position="absolute"
        bottom={{ base: "-30px", md: "55px" }}
        left={{ base: "-30px", md: "55px" }}
        w={{ base: "60px", md: "82px" }}
        h={{ base: "60px", md: "82px" }}
        borderRadius="50%"
        bg="#D087E2"
        opacity="1"
        zIndex={1}
      />

      {/* Right Gradient Circles */}
      <Box
        position="absolute"
        bottom={{ base: "-50px", md: "18px" }}
        right={{ base: "-50px", md: "75px" }}
        w={{ base: "100px", md: "144px" }}
        h={{ base: "100px", md: "144px" }}
        borderRadius="50%"
        bg="#D087E2"
        opacity="0.3"
        zIndex={1}
      />
      <Box
        position="absolute"
        bottom={{ base: "-40px", md: "28px" }}
        right={{ base: "-40px", md: "88px" }}
        w={{ base: "80px", md: "113px" }}
        h={{ base: "80px", md: "113px" }}
        borderRadius="50%"
        bg="#ECCFF4"
        opacity="0.3"
        zIndex={1}
      />
      <Box
        position="absolute"
        bottom={{ base: "-30px", md: "35px" }}
        right={{ base: "-30px", md: "100px" }}
        w={{ base: "60px", md: "82px" }}
        h={{ base: "60px", md: "82px" }}
        borderRadius="50%"
        bg="#D087E2"
        opacity="1"
        zIndex={1}
      />

      <Flex w={{ base: "90vw", md: "80vw" }} position="relative" zIndex={2}>
        <Box ml={{ base: "20px", md: "40px" }} pt={{ base: "px", md: "8px" }}>
          <Text fontSize="16px" fontFamily="body" color="white" marginTop="20px">
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
            onClick={
              walletCreated ? handleOpenFundWalletModal : handleOpenWalletModal
            }
            bg="white"
          >
            {walletCreated ? "Fund wallet" : "Create wallet"}
          </Button>
        </VStack>
      </Flex>
      <Flex
        ml={{ base: "20px", md: "40px" }}
        mt={{ base: "30px", md: "100px" }}
        position="relative"
        zIndex={2}
      >
        <Box fontWeight="bold" marginBottom={{ base: "50px", md: "50px" }} color="white">
          <Text textAlign="left" fontSize={{ base: "10px", md: "16px" }}>
            Wallet ID:
          </Text>
          <Flex>
            <Text textAlign="left" fontSize={{ base: "10px", md: "16px" }}>
              {walletCreated ? "Wema Bank" : ""}
            </Text>
            <Text
              ml="10px"
              textAlign="left"
              fontSize={{ base: "10px", md: "16px" }}
            >
              {walletCreated ? accountNumber : ""}
            </Text>
            {walletCreated && (
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
        {walletCreated && (
          <Flex fontWeight="bold" marginLeft={{ base: "50px", md: "400px" }}>
            <Box color="white">
              <Text textAlign="left" fontSize="10px">
                Total funded
              </Text>
              <Text textAlign="left" color="white" fontSize="10px">
                ₦{formatAmount(walletTotalCredit)}
              </Text>
            </Box>
            <Box color="white" marginLeft="10px">
              <Text textAlign="left" fontSize="10px">
                Total spent
              </Text>
              <Text textAlign="left" color="white" fontSize="10px">
                ₦{formatAmount(walletTotalDebit)}
              </Text>
            </Box>
          </Flex>
        )}
      </Flex>
    </Box>
  );
};

export default WalletBox;
