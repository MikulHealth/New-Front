import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import LoadingSpinner from "../../utils/Spiner";
import logo from "../../assets/Logo.svg";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  Box,
  Button,
  extendTheme,
  ChakraProvider,
  Text,
  FormControl,
  Image,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  InputLeftAddon,
  Flex,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Checkbox,
} from "@chakra-ui/react";
import AOS from "aos";
import "aos/dist/aos.css";
import "../../styles/pages/LandingPage.css";

const customTheme = extendTheme({
  components: {
    Link: {
      baseStyle: { _focus: { boxShadow: "none" } },
    },
  },
  fonts: {
    body: "Montserrat, sans-serif",
    heading: "Gill Sans MT, sans-serif",
  },
});

const LandingPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    gender: "",
    dob: new Date(),
    address: "",
    // image: "",
    kinName: "",
    kinNumber: "",
    language: "English",
    relationship: "Self",
  });
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  // const [imageLoading, setImageLoading] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDobChange = (date) => {
    setFormData({ ...formData, dob: date });
  };

  const handleClick = () => setShow(!show);

  const handleTermsChange = (e) => {
    setAgreeToTerms(e.target.checked);
    setIsTermsOpen(true);
  };

  const closeTermsModal = () => setIsTermsOpen(false);

  // const sendOtp = async () => {
  //   try {
  //     const number = localStorage.getItem("phoneNumber");
  //     const response = await axios.post(
  //       "http://localhost:8080/api/v1/sms/verify-number",
  //        // "https://backend-c1pz.onrender.com/api/v1/sms/verify-number"
  //       { phoneNumber: number },
  //       { headers: { "Content-Type": "application/json" } }
  //     );
  //     console.log(response);
  //     if (response.data.success) {
  //       setLoading(false);
  //       toast.success(response.data.message);
  //       return true;  // Return true to indicate success
  //     } else {
  //       setLoading(false);
  //       console.error("Error registering");
  //       toast.error(response.data.message);
  //       return false;  // Return false to indicate failure
  //     }
  //   } catch (error) {
  //     setLoading(false);
  //     const message = error.response && error.response.data && error.response.data.message
  //       ? error.response.data.message
  //       : "Unable to send OTP.";
  //     toast.error(message);
  //     return false;
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreeToTerms) {
      toast.warning("You have to accept our terms and conditions to continue");
      return;
    }

    function getValidNigerianPhoneNumber(phoneNumber) {
      // Regular expression for validating a Nigerian phone number
      // Matches +234 followed by 10 digits or starts with 0 followed by 10 digits starting with 7, 8, or 9
      const pattern = /^(?:\+234|0)[789]\d{9}$/;

      if (pattern.test(phoneNumber)) {
        // Transform +234 to 0 format if needed
        if (phoneNumber.startsWith("+234")) {
          return "0" + phoneNumber.slice(4); // Remove '+234' and prepend '0'
        }
        return phoneNumber;
      }
      return null;
    }

    const validPhoneNumber = getValidNigerianPhoneNumber(formData.phoneNumber);
    if (!validPhoneNumber) {
      toast.warning("Please enter a valid Nigerian phone number");
      return;
    }

    setLoading(true);
    try {
      // Include the valid and adjusted phone number in formData
      const updatedFormData = { ...formData, phoneNumber: validPhoneNumber };
      const response = await axios.post(
        // "http://localhost:8080/v1/angel/join",
        "https://backend-c1pz.onrender.com/v1/angel/join",
        updatedFormData,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.success) {
        // toast.success(response.data.message);
        toast.success("Registration successfull, kindly login");
        setTimeout(() => {
          navigate("/login");
        }, 5000);

        // localStorage.setItem("phoneNumber", formData.phoneNumber);
        // const otpSent = await sendOtp();
        // if (otpSent) {
        //   toast.success(response.data.message);
        //   navigate("/verify-number");
        // }
      } else {
        setLoading(false);
        console.error("Error registering");
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Registration failed, kindly login if you have registered before.");
    } finally {
      setLoading(false);
    }
  };

  // const postImage = async (image) => {
  //   setImageLoading(true);
  //   if (image === undefined) {
  //     toast.warning("Please select an image");
  //     return;
  //   }
   
  //   if (image.type === "image/jpeg" || image.type === "image/png") {
  //     const data = new FormData();
  //     data.append("file", image);
  //     data.append("upload_preset", "profileImage");
  //     data.append("cloud_name", "dmfewrwla");

  //     try {
  //       const response = await fetch(
  //         "https://api.cloudinary.com/v1_1/dmfewrwla/image/upload",
  //         {
  //           method: "post",
  //           body: data,
  //         }
  //       );

  //       const imageData = await response.json();

  //       setFormData({
  //         ...formData,
  //         image: imageData.url.toString(),
  //       });
  //       setImageLoading(false);
  //       console.log(imageData.url.toString());
  //     } catch (err) {
  //       console.error(err);
  //       setImageLoading(false);
  //     }
  //   } else {
  //     toast.warning("Please select a calid image file");
  //     return;
  //   }
  // };

  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <ChakraProvider overflow="hidden" theme={customTheme}>
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
      <Flex overflow="scroll" align="center" justify="center" height="100vh">
        <Box
          mb="300px"
          mt={{ base: "700px", md: "800px" }}
          width={{ base: "90%", sm: "500px" }}
          h={{ base: "140%", md: "160%" }}
          p="6"
          bg="white"
        >
          <a href="/">
            <Image
              justifySelf="center"
              src={logo}
              alt="Logo"
              ml={{ base: "20px", md: "90px" }}
              h={{ base: "80px", md: "100px" }}
              w={{ base: "300px", md: "350px" }}
            />
          </a>
          <Text fontFamily="header" fontSize="2xl" color="#A210C6" mb="4" textAlign="center">
            Create your account
          </Text>
          <form  onSubmit={handleSubmit}>
            {/* Form fields */}
            <FormControl fontSize={{base: "16px", md: "20px"}} fontFamily="body" isRequired>
              <FormLabel>First name</FormLabel>
              <Input
                name="firstName"
                placeholder="First name"
                onChange={handleInputChange}
              />
              <FormLabel mt="4">Last name</FormLabel>
              <Input
                name="lastName"
                placeholder="Last name"
                onChange={handleInputChange}
              />
              <FormLabel mt="4">Email address</FormLabel>
              <Input
                name="email"
                type="email"
                placeholder="Email"
                onChange={handleInputChange}
              />
              {/* <FormLabel mt="4">Home Address</FormLabel> */}
              {/* <Input
                name="address"
                placeholder="Home address"
                onChange={handleInputChange}
              /> */}
              <FormLabel mt="4">Phone number</FormLabel>
              <InputGroup>
                <InputLeftAddon children="+234" />
                <Input
                  name="phoneNumber"
                  type="tel"
                  placeholder="Phone number"
                  onChange={handleInputChange}
                />
              </InputGroup>
              <FormLabel mt="4">Gender</FormLabel>
              <Select
                name="gender"
                placeholder="Select your gender"
                onChange={handleInputChange}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </Select>
              <Box marginLeft="1px" w={{base: "320px", md: "450px"}}>
                <FormLabel marginTop="20px">Date of birth</FormLabel>
                <Flex
                  alignItems="flex-start"
                  border="1px solid"
                  borderColor="gray.200"
                  p={2}
                  borderRadius="8px"
                >
                  <DatePicker
                    name="dob"
                    selected={formData.dob}
                    onChange={handleDobChange}
                    maxDate={new Date()}
                    peekNextMonth
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    dateFormat="yyyy-MM-dd"
                    placeholderText="Select your date of birth"
                    className="form-control"
                  />
                </Flex>
              </Box>
              {/* <FormLabel mt="4">Upload Image</FormLabel>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => postImage(e.target.files[0])}
              />
              {imageLoading && <LoadingSpinner />} */}
              <FormLabel mt="4">Password</FormLabel>
              <InputGroup size="md">
                <Input
                  name="password"
                  pr="4.5rem"
                  type={show ? "text" : "password"}
                  placeholder="Enter password"
                  onChange={handleInputChange}
                />
                <InputRightElement width="4.5rem">
                  <Button h="1.75rem" size="sm" onClick={handleClick}>
                    {show ? "Hide" : "Show"}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <FormLabel mt="4">Confirm password</FormLabel>
              <InputGroup size="md">
                <Input
                  name="confirmPassword"
                  pr="4.5rem"
                  type={show ? "text" : "password"}
                  placeholder="Confirm password"
                  onChange={handleInputChange}
                />
                <InputRightElement width="4.5rem">
                  <Button h="1.75rem" size="sm" onClick={handleClick}>
                    {show ? "Hide" : "Show"}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Checkbox
            fontFamily="body"
              isChecked={agreeToTerms}
              onChange={handleTermsChange}
              mt="4"
            >
              Click to view and accept{" "}
              <Text as="span" color="#A210C6">
                Mikul Health's Terms and conditions
              </Text>
            </Checkbox>

            <Button
              mt="6"
              type="submit"
              w="full"
              bg="#A210C6"
              color="white"
              isLoading={loading}
              fontFamily="body"
              loadingText="Registering..."
            >
              Submit
            </Button>
          </form>
          <Text  fontSize="16px" fontFamily="body" mt="15px">
            Already have an account?{" "}
            <Link
              to="/login"
              style={{
                fontStyle: "italic",
                color: "#A210C6",
                textDecoration: "none",
              }}
            >
              Login
            </Link>
          </Text>
        </Box>
      </Flex>

      {/* Terms Modal */}
      <Modal isOpen={isTermsOpen} onClose={closeTermsModal} size="full" theme={customTheme}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontFamily="heading">TERMS AND CONDITION & PRIVACY POLICY</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontSize="18px" mb="4" fontFamily="body">
              <strong >BACKGROUND:</strong>
              <br />
              (A) These Terms of Service together with any and all other
              documents connected with these Terms of Service set out the terms
              and conditions on which Mikul Health Technology Limited (“Us” or
              “MHTL” or “We”) paid home care service is sold to Customers/You
              through our website, www.mikulhealth.com (“Our Site”) and
              in-person.
              <br />
              (B) Please read these Terms of Service carefully and ensure that
              You understand them before accessing and paying. If You have any
              query about anything in these Terms of Service, please contact Us
              to discuss. Before accessing Our Site or MHTL paid home care
              service, You will be required to read, accept, and agree to comply
              with and be bound by these Terms of Service. If You do not, You
              will not be able to access MHTL paid home care service through Our
              Site or in-person.
              <br />
              (D) These Terms of Service, as well as any and all Contracts, are
              in the English language only.
              <br />
              <br />
              <strong>Definitions and Interpretation</strong>
              <br />
              In these Terms of Service, unless the context otherwise requires,
              the following expressions have the following meanings:
              <br />
              “Account” means the account that You must set up with Us on Our
              Site or in-person in order to request, pay for, and access the
              MHTL paid home care service;
              <br />
              “Background Items” means background and other information about
              topics relevant to the MHTL paid home care service that We provide
              to You in-person, downloadable or viewable as text/graphics;
              <br />
              "Organization(s)"" include but are not limited to Companies,
              business names, partnerships and charitable organizations.
              <br />
              "Network" This refers to all of MHTL technologies including
              website, mobile applications, USSD service directly and indirectly
              involved in sustaining, delivering and interfacing with our
              provided services.
              <br />
              “Service consumer” means an individual Customer or Business
              Customers who is to receive or use the MHTL paid home care
              service;
              <br />
              "Services" Implies all the services described, listed and/or
              provided by Service Providers to be received by Service Consumers
              within our Network.
              <br />
              Service Provider: Implies anyone and/or organization or a
              representative with an active account who holds out as providing
              service(s), within our network.
              <br />
              "Subscriber or User" Means any Service Provider, Service Consumer
              or any other person or organization outside these descriptions who
              accesses or uses our Network for any purpose whatsoever.
              <br />
              “MHTL paid home care service” includes any consultation,
              examination, diagnosis, advice, instruction, care or any other
              Background Items, content, materials, programs or related
              information, sold by Us through Our Site and made available by Us
              to You in-person and downloadable or other viewable text, graphics
              or other video, audio or other items or information, including
              Background Items.
              <br />
              "MHTL Wallet or Account" means an account created on our Network
              by a Service Consumer to deposit funds or money for paid home care
              service. Such an account must remain active to qualify as an
              account within the context considered under these Terms; A dormant
              period shall be for a term of one year after which a lack of
              activity may mandate a reactivation process of your account.
              <br />
              "Third Parties" Implies Service Providers and Service Consumers
              within our Network; and external service providers outside/without
              our Network, that may be addressable as by links within our
              websites or other means within our Network.
              <br />
              USAGE OF THIRD PARTY SERVICES <br /> Usage of Third Party services
              accessible on our Network is at your own risks. We shall not be
              held liable for any dispute or mishap suffered by you in the event
              of interaction with any Third Party. You acknowledge that all your
              interaction with any Third Party will be treated as absolutely
              independent of us. 
              <br />
              OWNERSHIP STATEMENT <br /> This website and mobile application and
              any affiliated documentation not declared otherwise is the sole
              intellectual property of MHTL. Our intellectual property rights
              and trade names are protected under the extant laws and
              regulations applicable in Nigeria for our operations in Nigeria
              and under various international conventions in instances outside
              Nigeria. No title or equity of the website or any portion thereof
              is transferred to you by virtue of your patronage.
              <br />
              ELIGIBILITY OF USE <br /> This Service is only available to
              persons who are 18 years and above. By accessing this Service
              either as a Subscriber or User or Service Provider or Service
              Consumer, you warrant and/or hold out yourself to have attained
              the mandatory age of 18 years.
              <br />
              CLAIM ON ACCOUNT <br /> MHTL retains the absolute prerogative to
              absolve Service Providers and/or Service Consumers of their
              accounts. In the case that such occurs, you will be temporarily or
              permanently prevented from accessing such accounts registered on
              the Network depending on our sole consideration of the matter. We
              are not obliged to offer you apologies and/or justifications
              and/or remuneration of any kind or even information regarding
              imminent and/or actual suspension of your Account. All information
              within such dissolved accounts is subject to our discretion. MHTL
              is not liable to compensate any loss incurred as a result of delay
              or any other issue in accessing our services through your account.
              You may leave this Network at your liberty, however, it is
              important to note that when you decide to leave, you will not be
              entitled to the information contained in your Account neither are
              we bound to relinquish information and/or submission and/or ideas
              and any other material of yours in our custody.
              <br /> <br />
              <br />
              <strong>PRIVACY POLICY</strong>
              <br />
              Our collection, use, storage, and disclosure of Your information
              is governed by Our Privacy Policy. You understand that We share
              the personal information and any other information, like health
              records of our Users with affiliated companies, service providers,
              and health care practitioners. You further understand that We
              share personal information with financial service providers (for
              interests) and non-financial companies, such as email service
              providers that perform marketing services on our behalf. You
              acknowledge that MHTL does not control the transfer of data over
              telecommunications facilities and that the Internet is inherently
              insecure and provides opportunity for unauthorized access by third
              parties. You are responsible for maintaining the security of Your
              own systems, servers, communications links, and data, and for
              providing secure access to those systems and data, including
              Personal Data (as defined in the MHTL Privacy Policy). You will
              not disclose Personal Data to MHTL other than that which is
              reasonably required for Us to carry out our obligations under
              these Terms, and then only during the time period reasonably
              required. You agree to put in place appropriate privacy and
              security safeguards designed to prevent the unauthorized use and
              disclosure of Your Personal Data including not disclosing Your
              passwords to Third-Parties.
              <br />
              SERVICE DISCLAIMER <br />
              Our sole promise is to connect Service Consumers with Service
              Providers (including health practitioners) who hold out themselves
              to have the requisite know-how to meet the needs of Service
              Consumers. Even though we do carry out verification of the Service
              Providers with the aim of ascertaining their addresses,
              qualifications, and records, we do not however guarantee the
              accuracy of such background checks nor the correctitude of any
              process, product, publication, service, or offering by any Service
              Provider and/or Third Party. You agree to always exercise due
              diligence and caution in the course of carrying out both online
              and offline transactions with Service Providers, as well as
              Service Consumers, Users and third parties. Your credence to any
              Service Provider or Service Consumer or Third Party is solely at
              your own discretion and you assume full responsibility for all
              associated risk. Where there is failure in fulfilling the terms of
              the transaction, MHTL will not be liable under any circumstances
              for such failure, and shall be indemnified from any liability
              and/or losses and/or damages that may arise from such failure.
              Even in cases where an action is instituted against such Service
              Consumer and/or Service Provider, MHTL shall not be joined as a
              party to such lawsuit and if joined, Service Providers and/or
              Service Consumers shall indemnify MHTL against any legal cost
              associated with such lawsuit.
              <br />
              NO WARRANTIES <br />
              MHTL makes no guarantees and disclaims any implied warranty
              binding on services delivered by service providers on the Network.
              You understand that Service Providers endeavor to provide
              efficient and uninterrupted transmission of services. However, You
              acknowledge that We have no control over such transmissions
              including transmission delays or interruptions. Hence, we assume
              no liability arising from or relating to the delay, failure,
              interruption, or corruption of any data or other information
              transmitted within our network. In the event of a transmission
              delay, You agree to bear full responsibility to implement
              appropriate measures to mitigate any potential loss or damage
              during your interaction with our network.
              <br />
              INDEMNIFICATION <br />
              You agree to indemnify, defend and exempt MHTL from any liability,
              loss, claim, suit, damage, and expense (including reasonable
              attorneys' fees and expenses) related to your breach of these
              Terms of Use or violation of public law, or proven compromise of
              your user account details from your end.
              <br />
              CHARGES AND PAYMENT <br />
              Every monetary transaction will be negotiated and made under Mikul
              Health Technology Limited (MHTL). The cost of services rendered
              will be negotiated between MHTL and Service Consumers, and payment
              will be made through provisions within the Network. MHTL retains
              the prerogative to deduct its commission before crediting the
              Service provider. Any direct and independent monetary transaction
              between Service Providers and Service Consumers over services
              rendered within the network shall be considered a breach of
              contract. <br />
              Subscriptions on our platform are monthly and expire one month
              after the subscription date. Service Consumers must renew their
              subscription for continued service or forfeit any remaining
              service if they were not available to receive the service within
              the subscription period. <br />
              In the event of subscription to any third-party service, payment
              will be independent of our jurisdiction and we proceed as governed
              by such a party. You hereby agree to be solely responsible for the
              payment of your applicable federal, state, and local government
              taxes and levies. You understand and agree that you will contact
              tax professionals for advice in respect of the payment of your
              taxes. However, we shall remit to the relevant tax authorities all
              Value Added Tax (VAT) paid by Service Consumers for transactions
              initiated and completed within our network and reserves the right
              to introduce new payment methods, and/or change charges across the
              board at short notice.
              <br />
              RESTRICTION, CLOSURE & TERMINATION OF ACCOUNTS <br />
              We may at Our sole discretion restrict or close Your User Account
              if: You use Your Account for unauthorised purposes or where
              MHTL detects any abuse/misuse, breach of content, fraud or
              attempted fraud relating to Your use of the Service. We are
              required or requested to comply with an order or instruction of or
              a recommendation from the government, court, regulator or other
              competent authority. We reasonably suspect or believe that You are
              in breach of this Terms of Use. The closure or restriction is
              necessary as a consequence of technical problems or for reasons of
              safety; to facilitate update or upgrade the contents or
              functionality of the Services from time to time; or where Your
              Account becomes inactive or dormant. We decide to suspend or cease
              the provision of the Service for commercial reasons or for any
              other reasons it may determine in its absolute discretion. Where
              we restrict, close or terminate your Account, you shall have nor
              right of legal action against MHTL. You have the option to
              discontinue using the Service, close Your MHTL Account, and
              terminate these Terms at any time. To initiate the process, You
              can contact us at surpport@mikulhealth.com and provide the
              necessary information for Us to verify their identity.
              <br />
              RIGHT TO MODIFY <br />
              We reserve the exclusive right to revise, modify and/or alter
              these Terms at its sole discretion and at any time, without
              notifying You besides uploading such revised Terms and Conditions
              of Use on this Service. Such updated and/or revised Terms and
              Conditions of Use once Uploaded on this Service becomes effective
              seven (7) days after it is uploaded. Please note that if You
              continue to use this Platform upon the expiration of the said
              seven (7) days after we have uploaded our updated and/or revised
              Terms and Conditions of Use, then You have unequivocally expressed
              Your acceptance to be bound by them. You are expected to stop
              using and/or accessing this Service if You do not agree to the
              altered and/or revised Terms and Conditions of Use. The words
              “upload” “uploaded” and “uploading” as used in these Terms,
              include but not limited to, the act of posting, publishing,
              updating, submitting, and displaying materials.
              <br />
              EFFECTIVE DATE <br />
              This Terms and Condition of Use takes effect immediately.
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button  bg="#A210C6" color="white" mr="3" onClick={closeTermsModal}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </ChakraProvider>
  );
};

export default LandingPage;
