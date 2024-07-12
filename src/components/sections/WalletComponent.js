import { Box, Flex, Text, VStack, Button, IconButton } from "@chakra-ui/react";
import { CopyIcon, CheckIcon } from "@chakra-ui/icons";

const WalletComponent = ({ balance, accountNumber, handleOpenWalletModal, hasCopied, onCopy }) => {

    const formatAmount = (amount) => {
        const num = Number(amount);
        return num.toLocaleString();
    };

    return (
        <Box
            position="relative"
            textAlign="center"
            w={{ base: "375px", md: "702px" }}
            h={{ base: "151px", md: "250px" }}
            mt={{ base: "4px", md: "0" }}
            mb={{ base: "5px", md: "30px" }}
            paddingBottom={{ base: "20px", md: "" }}
            bg="#A210C6"
            borderRadius="20px"
        >
            {/* Left Gradient Circles */}
            <Box
                position="absolute"
                bottom={{ base: "10px", md: "20px" }}
                left={{ base: "10px", md: "20px" }}
                w={{ base: "82px", md: "144px" }} // Increased size
                h={{ base: "82px", md: "144px" }} // Increased size
                borderRadius="50%"
                bg="#D087E2"
                opacity="0.3"
                zIndex={1}
                className="outer-circle"
            />
            <Box
                position="absolute"
                bottom={{ base: "20px", md: "38px" }}
                left={{ base: "20px", md: "38px" }}
                w={{ base: "66.5px", md: "113px" }} // Increased size
                h={{ base: "66.5px", md: "113px" }} // Increased size
                borderRadius="50%"
                bg="#ECCFF4"
                opacity="0.3"
                zIndex={1}
                className="middle-circle"
            />
            <Box
                position="absolute"
                bottom={{ base: "27.5px", md: "55px" }}
                left={{ base: "27.5px", md: "55px" }}
                w={{ base: "51px", md: "82px" }} // Increased size
                h={{ base: "51px", md: "82px" }} // Increased size
                borderRadius="50%"
                bg="#D087E2"
                opacity="1"
                zIndex={1}
                className="inner-circle"
            />

            {/* Right Gradient Circles */}
            <Box
                position="absolute"
                bottom={{ base: "10px", md: "18px" }}
                right={{ base: "10px", md: "75px" }}
                w={{ base: "82px", md: "144px" }} // Increased size
                h={{ base: "82px", md: "144px" }} // Increased size
                borderRadius="50%"
                bg="#D087E2"
                opacity="0.3"
                zIndex={1}
                className="outer-circle"
            />
            <Box
                position="absolute"
                bottom={{ base: "20px", md: "28px" }}
                right={{ base: "20px", md: "88px" }}
                w={{ base: "66.5px", md: "113px" }} // Increased size
                h={{ base: "66.5px", md: "113px" }} // Increased size
                borderRadius="50%"
                bg="#ECCFF4"
                opacity="0.3"
                zIndex={1}
                className="middle-circle"
            />
            <Box
                position="absolute"
                bottom={{ base: "27.5px", md: "35px" }}
                right={{ base: "27.5px", md: "100px" }}
                w={{ base: "51px", md: "82px" }} // Increased size
                h={{ base: "51px", md: "82px" }} // Increased size
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
                            ₦{formatAmount(balance)}.00
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
                        onClick={handleOpenWalletModal}
                        bg="white"
                    >
                        Fund wallet
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
                <Box mt={{ base: "0px", md: "85px" }} ml={{ base: "5px", md: "-280px" }}>
                    <Text fontWeight="bold" textAlign="left">
                        Wallet ID:
                    </Text>
                    <Flex>
                        <Text
                            textAlign="left"
                            fontFamily="body"
                            fontSize={{ base: "12px", md: "16px" }}
                        >
                            Wema Bank
                        </Text>
                        <Text
                            ml="10px"
                            textAlign="left"
                            fontSize={{ base: "12px", md: "16px" }}
                        >
                            {accountNumber}
                        </Text>
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
                    </Flex>
                </Box>
            </VStack>
        </Box>
    );
};

export default WalletComponent;
