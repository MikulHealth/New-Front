// import React, { useState } from "react";

// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";

// import "react-datepicker/dist/react-datepicker.css";

// import HelppIcon from "../../assets/HelppIcon.svg";
// import LogoutModal from "../sections/LogoutModal";
// import serviceIcon from "../../assets/ServiceIcon.svg";
// import { SearchIcon } from "@chakra-ui/icons";
// import {
//   ChakraProvider,
//   VStack,
//   Input,
//   Button,
//   useToast,
//   Image,
//   Box,
//   Text,
//   Flex,
//   Link,
//   FormControl,
//   FormLabel,
//   Modal,
//   ModalOverlay,
//   ModalContent,
//   ModalHeader,
//   extendTheme,
//   ModalBody,
//   Divider,
//   ModalCloseButton,
// } from "@chakra-ui/react";
// import userImageIcon from "../../assets/userImage.svg";
// import NotificationIcon from "../../assets/notification.svg";
// import UserDetailsModal from "../sections/UserDetails";
// import logo from "../../assets/LogoColoured.svg";
// import SettingsIcon from "../../assets/SettingsIcon.svg";
// import LogoutIcon from "../../assets/Logout.svg";
// import AppointmentsIcon from "../../assets/AppointmentIcon.svg";
// import HomeIcon from "../../assets/HomeBlack.svg";
// import Transfer from "../../assets/TransferPayment.svg";
// import Online from "../../assets/OnlinePayment.svg";
// import RightArrow from "../../assets/RightArrow.svg";
// import Wallet from "../../assets/WalletWhite.svg";


// const customTheme = extendTheme({
//   components: {
//     Link: {
//       baseStyle: {
//         _focus: {
//           boxShadow: "none",
//         },
//       },
//     },
//   },
//   fonts: {
//     body: "Montserrat, sans-serif",
//     heading: "Gill Sans MT, sans-serif",
//   },
// });

// const FundWalletModal = ({
//   isOpen,
//   onClose,
//   onBankTransfer,
//   onOnlinePayment,
// }) => {
//   return (
//     <Modal isOpen={isOpen} onClose={onClose} size="xl" borderRadius="15px">
//       <ModalOverlay />
//       <ModalContent>
//         <ModalHeader marginLeft="200px">Fund Wallet</ModalHeader>
//         <ModalCloseButton />
//         <ModalBody>
//           <Box
//             marginLeft="8px"
//             border="1px solid black"
//             h="12vh"
//             w="37vw"
//             borderRadius="15px"
//             paddingBottom="5px"
//             onClick={onBankTransfer}
//             style={{
//               cursor: "pointer",
//             }}
//             _hover={{ color: "#A210C6" }}
//           >
//             <Flex>
//               <Image
//                 marginLeft="15px"
//                 marginTop="15px"
//                 w="50px"
//                 h="50px"
//                 src={Transfer}
//                 alt="Settings"
//               />
//               <Box marginLeft="10px" padding="10px" paddingBottom="10px">
//                 <Text>Via Bank Transfer</Text>
//                 <Text>Direct bank transfer to your Mikul wallet account</Text>
//               </Box>
//               <Image
//                 marginLeft="15px"
//                 marginTop="25px"
//                 w="30px"
//                 h="30px"
//                 src={RightArrow}
//                 alt="Settings"
//               />
//             </Flex>
//           </Box>
//           <Box
//             marginTop="15px"
//             marginLeft="8px"
//             border="1px solid black"
//             h="12vh"
//             w="37vw"
//             marginBottom="15px"
//             borderRadius="15px"
//             onClick={onOnlinePayment}
//             style={{
//               cursor: "pointer",
//             }}
//             _hover={{ color: "#A210C6" }}
//           >
//             <Flex>
//               <Image
//                 marginLeft="15px"
//                 marginTop="15px"
//                 w="50px"
//                 h="50px"
//                 src={Online}
//                 alt="Settings"
//               />
//               <Box marginLeft="10px" padding="10px" paddingBottom="10px">
//                 <Text>Online Payment</Text>
//                 <Text>Fund your Mikul wallet with a debit card</Text>
//               </Box>
//               <Image
//                 marginLeft="70px"
//                 marginTop="25px"
//                 w="30px"
//                 h="30px"
//                 src={RightArrow}
//                 alt="Settings"
//                 style={{
//                   cursor: "pointer",
//                 }}
//                 _hover={{ color: "#A210C6" }}
//               />
//             </Flex>
//           </Box>
//         </ModalBody>
//       </ModalContent>
//     </Modal>
//   );
// };

// const BankTransferModal = ({ isOpen, onClose, bankDetails }) => {
//   return (
//     <Modal isOpen={isOpen} onClose={onClose}>
//       <ModalOverlay />
//       <ModalContent>
//         <ModalHeader marginLeft="130px">Bank Transfer</ModalHeader>
//         <ModalCloseButton />
//         <ModalBody>
//           <Text marginTop="-10px">
//             This is your Mikul Health account number. Please refresh this page
//             after making a transfer to this account number either via your bank
//             app or bank USSD code
//           </Text>
//           <Flex
//             borderRadius="15px"
//             border="1px solid black"
//             marginLeft="10px"
//             padding="10px"
//             marginTop="10px"
//           >
//             <Text>Bank Name:</Text>
//             <Text marginLeft="200"> {bankDetails.bankName}</Text>
//           </Flex>
//           <Flex
//             borderRadius="15px"
//             border="1px solid black"
//             marginLeft="10px"
//             padding="10px"
//             marginTop="20px"
//           >
//             <Text>Account Name:</Text>
//             <Text marginLeft="140"> {bankDetails.accountName}</Text>
//           </Flex>
//           <Flex
//             borderRadius="15px"
//             border="1px solid black"
//             marginLeft="10px"
//             padding="10px"
//             marginTop="20px"
//             marginBottom="20px"
//           >
//             <Text>Account Number:</Text>
//             <Text marginLeft="145"> {bankDetails.accountNumber}</Text>
//           </Flex>
//         </ModalBody>
//       </ModalContent>
//     </Modal>
//   );
// };

// const OnlinePaymentModal = ({ isOpen, onClose }) => {
//   const [amount, setAmount] = useState("");

//   const handleAmountSubmission = () => {
//     // Handle the submission of the entered amount here
//     console.log("Amount submitted:", amount);
//     // You can perform further actions like making a deposit or calling an API here
//   };

//   return (
//     <Modal isOpen={isOpen} onClose={onClose}>
//       <ModalOverlay />
//       <ModalContent>
//         <ModalHeader marginLeft="130px">Online Payment</ModalHeader>
//         <ModalCloseButton />
//         <ModalBody>
//           <FormControl>
//             <FormLabel>Input amount:</FormLabel>
//             <Input
//               type="number"
//               value={amount}
//               border="1px solid black"
//               placeholder="₦5000"
//               onChange={(e) => setAmount(e.target.value)}
//             />
//           </FormControl>
//           <Button
//             marginTop="10px"
//             marginBottom="20px"
//             marginLeft="130px"
//             bg="#A210C6"
//             color="white"
//             onClick={handleAmountSubmission}
//             _hover={{ backgroundColor: "blue.500" }}
//           >
//             Make deposit
//           </Button>
//         </ModalBody>
//       </ModalContent>
//     </Modal>
//   );
// };

// const DebitPage = () => {
//   const [showFundWalletModal, setShowFundWalletModal] = useState(false);
//   const [showBankTransferModal, setShowBankTransferModal] = useState(false);
//   const [showOnlinePaymentModal, setShowOnlinePaymentModal] = useState(false);
//   const [ setShowSettingsModal] = useState(false);
//   const navigate = useNavigate();
//   // const dispatch = useDispatch();
//   // const toast = useToast();
//   const balance = 0.0;
//   const { user } = useSelector((state) => state.userReducer);
//   const [showUserDetailsModal, setShowUserDetailsModal] = useState(false);
//   const [setSelectedDate] = useState(null);
//   const [showLogoutModal, setShowLogoutModal] = useState(false);
//   const [ setShowWalletModal] = useState(false);
 
//   // Add these lines to your existing state declarations

//   const handleOpenFundWalletModal = () => {
//     setShowFundWalletModal(true);
//   };

//   const handleCloseFundWalletModal = () => {
//     setShowFundWalletModal(false);
//   };

//   const handleOpenBankTransferModal = () => {
//     setShowBankTransferModal(true);
//   };

//   const handleCloseBankTransferModal = () => {
//     setShowBankTransferModal(false);
//   };

//   const handleOpenOnlinePaymentModal = () => {
//     setShowOnlinePaymentModal(true);
//   };

//   const handleOpenLogoutModal = () => {
//     setShowLogoutModal(true);
//   };

//   const handleConfirmLogout = () => {
//     // Close the logout confirmation modal
//     setShowLogoutModal(false);

//     // Perform the actual logout
//     localStorage.removeItem("token");
//     localStorage.removeItem("phoneNumber");
//     localStorage.removeItem("orderId");
//     navigate("/");
//   };

//   const handleOpenDashboard = () => {
//     navigate("/dashboard");
//   };
//   const handleOpenSettingsModal = () => {
//     navigate("/settings");
//   };

//   const handleOpenAppointmentsModal = () => {
//     navigate("/appointment");
//   };

//   const help = () => {
//     navigate("/help");
//   };

//   const Services = () => {
//     navigate("/services");
//   };

//   const openWalletPage = () => {
//     navigate("/wallet");
//   };

//   const openCreditpage = () => {
//     navigate("/credit");
//   };

//   const handleCloseOnlinePaymentModal = () => {
//     setShowOnlinePaymentModal(false);
//   };

//   const handleOpenUserDetailsModal = () => {
//     setShowUserDetailsModal(true);
//   };

//   const handleCloseUserDetailsModal = () => {
//     setShowUserDetailsModal(false);
//   };

//   const handleDateChange = (date) => {
//     setSelectedDate(date);
//   };

//   const handleOpenWalletModal = () => {
//     setShowWalletModal(true);
//   };

//   const handleOpenHelpModal = () => {};
//   const handleCloseSettingsModal = () => {
//     setShowSettingsModal(false);
//   };

//   return (
//     <ChakraProvider theme={customTheme}>
//       <Box width="25%" p={3} h="100vh">
//         <Image
//           src={logo}
//           alt="Logo"
//           w="160px"
//           h="60px"
//           marginLeft="90px"
//           marginTop="10px"
//         />

//         <VStack spacing={3} align="center" mt={5}>
//           <Flex marginTop="50px" alignItems="center">
//             <Image
//               marginLeft="-40px"
//               w="20px"
//               h="20px"
//               src={HomeIcon}
//               alt="HomeIcon"
//             />

//             <Text
//               marginLeft="15px"
//               color="black"
//               onClick={() => {
//                 handleOpenDashboard();
//               }}
//               style={{
//                 cursor: "pointer",
//               }}
//               _hover={{ color: "#A210C6" }}
//               fontSize="18px"
//             >
//               Home
//             </Text>
//           </Flex>

//           <Flex alignItems="center" marginTop="30px">
//             <Image
//               marginLeft="20px"
//               w="20px"
//               h="20px"
//               src={AppointmentsIcon}
//               alt="Appointments"
//             />
//             <Text
//               marginLeft="15px"
//               color="black"
//               onClick={handleOpenAppointmentsModal}
//               style={{
//                 cursor: "pointer",
//               }}
//               _hover={{ color: "#A210C6" }}
//               fontSize="18px"
//             >
//               Appointments
//             </Text>
//           </Flex>

//           <Flex
//             alignItems="center"
//             marginTop="30px"
//             marginLeft="-10px"
//             bg="#A210C6"
//             w="15vw"
//             p={3}
//             borderRadius="md"
//           >
//             <Image
//               marginLeft="32px"
//               w="20px"
//               h="20px"
//               src={Wallet}
//               alt="wallet"
//             />
//             <Text
//               marginLeft="17px"
//               color="white"
//               onClick={handleOpenWalletModal}
//               style={{
//                 cursor: "pointer",
//               }}
//               _hover={{ color: "white" }}
//               fontSize="18px"
//             >
//               Wallet
//             </Text>
//           </Flex>

//           <Flex alignItems="center" marginTop="30px" marginLeft="-60px">
//             <Image
//               marginLeft="26px"
//               w="20px"
//               h="20px"
//               src={serviceIcon}
//               alt="Help"
//             />
//             <Text
//               marginLeft="15px"
//               color="black"
//               onClick={Services}
//               style={{
//                 cursor: "pointer",
//               }}
//               _hover={{ color: "#A210C6" }}
//               fontSize="18px"
//             >
//               Service
//             </Text>
//           </Flex>

//           <Flex alignItems="center" marginTop="30px" marginLeft="-46px">
//             <Image
//               marginLeft="20px"
//               w="20px"
//               h="20px"
//               src={SettingsIcon}
//               alt="Settings"
//             />
//             <Text
//               marginLeft="15px"
//               color="black"
//               onClick={() => {
//                 handleOpenSettingsModal();
//               }}
//               style={{
//                 cursor: "pointer",
//               }}
//               _hover={{ color: "#A210C6" }}
//               fontSize="18px"
//             >
//               Settings
//             </Text>
//           </Flex>

//           <Flex alignItems="center" marginTop="100px" marginLeft="-55px">
//             <Image
//               marginLeft="20px"
//               w="20px"
//               h="20px"
//               src={LogoutIcon}
//               alt="Logout"
//             />
//             <Text
//               onClick={handleOpenLogoutModal}
//               marginLeft="15px"
//               color="#A210C6"
//               style={{
//                 cursor: "pointer",
//               }}
//               _hover={{ color: "#A210C6" }}
//               fontSize="18px"
//             >
//               Logout
//             </Text>
//           </Flex>
//         </VStack>
//         <Box
//           borderRight="2px solid #A210C6"
//           height="104%"
//           marginX={3}
//           marginTop="-620px"
//         />
//       </Box>
//       <Box
//         position="fixed"
//         top="0"
//         left="25%"
//         width="80%"
//         height="100%"
//         backgroundColor="white"
//         zIndex="1000"
//       >
//         <Flex>
//           <Text
//             fontSize="28px"
//             fontFamily="heading"
//             color="#A210C6"
//             marginLeft="30px"
//             marginTop="30px"
//           >
//             Wallet
//           </Text>
//           <Flex
//             marginLeft="790px"
//             style={{
//               cursor: "pointer",
//             }}
//             _hover={{ color: "#A210C6" }}
//           >
//             <Box marginTop="30px">
//               <Image
//                 src={NotificationIcon}
//                 alt="Notificatio icon"
//                 h="26px"
//                 w="30px"
//                 marginBottom="10px"
//               />
//             </Box>

//             <Box marginLeft="10px" marginTop="30px">
//               {user?.image ? (
//                 <Link onClick={handleOpenUserDetailsModal}>
//                   <Image
//                     borderRadius="100px"
//                     h="29px"
//                     w="30px"
//                     src={user?.image}
//                     alt="User Image"
//                   />
//                 </Link>
//               ) : (
//                 <Link onClick={handleOpenUserDetailsModal}>
//                   <Image
//                     src={userImageIcon}
//                     alt="User Image Icon"
//                     boxSize="50px"
//                     marginBottom="2%"
//                     h="19px"
//                     w="20px"
//                     borderRadius="100%"
//                   />
//                 </Link>
//               )}
//             </Box>
//           </Flex>
//         </Flex>

//         <Box
//           marginTop="30px"
//           marginLeft="13px"
//           border="1px solid gray"
//           borderRadius="md"
//           padding="3px"
//           w="70vw"
//           h="6vh"
//         >
//           <Flex marginLeft="10px" marginTop="5px">
//             <SearchIcon boxSize={4} marginRight="10px" marginTop="5px" />
//             <Text
//               fontSize="16px"
//               fontFamily="body"
//               style={{
//                 marginLeft: "5px",
//                 marginTop: "1px",
//                 fontStyle: "italic",
//                 cursor: "pointer",
//               }}
//               _hover={{ color: "#A210C6" }}
//               // onClick={handleOpenSearchAppointmentsModal}
//             >
//               Search transaction by date
//             </Text>
//           </Flex>
//         </Box>
//         <Box
//           marginTop="20px"
//           marginLeft="15px"
//           bg="#A210C6"
//           w="70vw"
//           h="25vh"
//           borderRadius="20px"
//           display="flex"
//         >
//           <Box>
//             {" "}
//             <Flex marginLeft="30">
//               <Box color="white">
//                 <Text
//                   fontSize="16px"
//                   fontFamily="body"
//                   marginTop="25px"
//                   style={{ marginLeft: "5px" }}
//                 >
//                   Mikul health wallet
//                 </Text>
//                 <Text fontSize="24px" style={{ marginLeft: "-55px" }}>
//                   ₦ {balance.toFixed(2)}
//                 </Text>
//               </Box>
//               <Box>
//                 <Button
//                   borderRadius="15px"
//                   color="#A210C6"
//                   marginLeft="650px"
//                   marginTop="30px"
//                   onClick={handleOpenFundWalletModal}
//                   bg="white"
//                   _hover={{ backgroundColor: "blue.500", color: "white" }}
//                 >
//                   Fund wallet
//                 </Button>
//               </Box>
//             </Flex>
//             <Flex marginLeft="35px" marginTop="20px">
//               <Box w="15vw" color="white" marginTop="5px">
//                 <Text marginLeft="-135px" fontSize="16px">
//                   Wallet ID:
//                 </Text>
//                 <Text fontFamily="body" marginLeft="-23px" fontSize="16px">
//                   Wema Bank 0124536789
//                 </Text>
//               </Box>
//               <Flex marginLeft="480px">
//                 <Box w="8vw" color="white">
//                   <Text fontSize="14px">Total funded</Text>
//                   <Text color="white" fontSize="12px" marginLeft="-44px">
//                     ₦{balance.toFixed(2)}
//                   </Text>
//                 </Box>
//                 <Box w="8vw" color="white" marginLeft="10px">
//                   <Text fontSize="14px">Total spent</Text>
//                   <Text color="white" fontSize="12px" marginLeft="-34px">
//                     ₦{balance.toFixed(2)}
//                   </Text>
//                 </Box>
//               </Flex>
//             </Flex>
//           </Box>
//         </Box>

//         <Box>
//           <Text
//             fontSize="28px"
//             fontFamily="heading"
//             color="black"
//             marginLeft="-860px"
//             marginTop="20px"
//           >
//             Recent activity
//           </Text>
//           <Flex marginTop="10px">
//             <Text
//               style={{
//                 cursor: "pointer",
//               }}
//               _hover={{ color: "#A210C6" }}
//               marginLeft="30px"
//               onClick={openWalletPage}
//             >
//               All
//             </Text>{" "}
//             <Text
//               style={{
//                 cursor: "pointer",
//               }}
//               _hover={{ color: "#A210C6" }}
//               marginLeft="50px"
//               onClick={openCreditpage}
//             >
//               Credit
//             </Text>{" "}
//             <Text
//               style={{
//                 cursor: "pointer",
//                 textDecoration: "underline",
//                 textDecorationThickness: "5px",
//               }}
//               _hover={{ color: "#A210C6" }}
//               marginLeft="50px"
//             >
//               Debit
//             </Text>
//           </Flex>
//           <Divider
//             marginTop="-10%"
//             marginLeft="2%"
//             my={4}
//             borderColor="gray.500"
//             width="60%"
//           />
//         </Box>
//         <Box marginLeft="900px" marginTop="120px">
//           <Image
//             onClick={help}
//             src={HelppIcon}
//             alt="Logo"
//             w="70px"
//             h="70px"
//             style={{
//               cursor: "pointer",
//               animation: "zoomInOut 2s infinite alternate",
//             }}
//           />

//           <style>
//             {`
//           @keyframes zoomInOut {
//             0% {
//               transform: scale(1);
//             }
//             100% {
//               transform: scale(1.2);
//             }
//           }
//         `}
//           </style>
//         </Box>
//       </Box>
//       <UserDetailsModal
//         isOpen={showUserDetailsModal}
//         onClose={handleCloseUserDetailsModal}
//       />
//       <FundWalletModal
//         isOpen={showFundWalletModal}
//         onClose={handleCloseFundWalletModal}
//         onBankTransfer={handleOpenBankTransferModal}
//         onOnlinePayment={handleOpenOnlinePaymentModal}
//       />
//       <BankTransferModal
//         isOpen={showBankTransferModal}
//         onClose={handleCloseBankTransferModal}
//         bankDetails={{
//           bankName: "XYZ Bank",
//           accountName: "Michael Joshua",
//           accountNumber: "0123456789",
//         }}
//       />
//       <LogoutModal
//         isOpen={showLogoutModal}
//         onClose={() => setShowLogoutModal(false)}
//         onConfirm={handleConfirmLogout}
//       />
//       <OnlinePaymentModal
//         isOpen={showOnlinePaymentModal}
//         onClose={handleCloseOnlinePaymentModal}
//       />
//     </ChakraProvider>
//   );
// };

// export default DebitPage;
