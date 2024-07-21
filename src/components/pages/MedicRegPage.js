import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { baseUrl } from "../../apiCalls/config";
import {
  Box,
  ChakraProvider,
  Flex,
  Image,
  Text,
  extendTheme,
} from "@chakra-ui/react";
import AOS from "aos";
import "aos/dist/aos.css";
import "../../styles/pages/LandingPage.css";
import { Link } from "react-router-dom";
import logo from "../../assets/Logo.svg";
import MedicRegistrationForm from "../sections/MedicRegistrationForm";
import TermsModal from "../sections/TermsModal";

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
    image: "",
  });
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();
  const [image, setImage] = useState();
  const [imageLoading, setImageLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateInput(name, value);
  };

  const handleDobChange = (date) => {
    setFormData({ ...formData, dob: date });
    validateInput("dob", date);
  };

  const handleClick = () => setShow(!show);

  const handleTermsChange = (e) => {
    setAgreeToTerms(e.target.checked);
    setIsTermsOpen(true);
  };

  const closeTermsModal = () => setIsTermsOpen(false);

  const getValidNigerianPhoneNumber = (phoneNumber) => {
    const pattern = /^(\d{10})$/;
    if (pattern.test(phoneNumber)) {
      return "0" + phoneNumber;
    }
    return null;
  };

  const validatePassword = (password) => {
    const pattern = /^(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{6,}$/;
    return pattern.test(password);
  };

  const validateInput = (name, value) => {
    let errors = { ...validationErrors };
    switch (name) {
      case "firstName":
      case "lastName":
        if (!value) {
          errors[name] = `${
            name === "firstName" ? "First" : "Last"
          } name is required.`;
        } else {
          delete errors[name];
        }
        break;
      case "email":
        if (!value) {
          errors[name] = "Email is required.";
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          errors[name] = "Email is invalid.";
        } else {
          delete errors[name];
        }
        break;
      case "phoneNumber":
        if (!getValidNigerianPhoneNumber(value)) {
          errors[name] =
            "Please enter a valid Nigerian phone number, without the first zero";
        } else {
          delete errors[name];
        }
        break;
      case "password":
        if (!validatePassword(value)) {
          errors[name] =
            "Password must be at least 6 characters long and include letters, special characters, and numbers.";
        } else {
          delete errors[name];
        }
        break;
      case "confirmPassword":
        if (value !== formData.password) {
          errors[name] = "Passwords do not match.";
        } else {
          delete errors[name];
        }
        break;
      case "gender":
        if (!["Male", "Female"].includes(value)) {
          errors[name] = "Please select a valid gender.";
        } else {
          delete errors[name];
        }
        break;
      case "dob":
        const today = new Date();
        const minDate = new Date(
          today.getFullYear() - 20,
          today.getMonth(),
          today.getDate()
        );
        if (value > minDate) {
          errors[name] = "You must be at least 20 years old.";
        } else {
          delete errors[name];
        }
        break;
      default:
        break;
    }
    setValidationErrors(errors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    validateInput("firstName", formData.firstName);
    validateInput("lastName", formData.lastName);
    validateInput("email", formData.email);
    validateInput("phoneNumber", formData.phoneNumber);
    validateInput("password", formData.password);
    validateInput("confirmPassword", formData.confirmPassword);
    validateInput("gender", formData.gender);
    validateInput("dob", formData.dob);

    if (Object.keys(validationErrors).length > 0) {
      toast.warning("Please ensure all the fields has the right input");
      return;
    }

    if (!agreeToTerms) {
      toast.warning("You have to accept our terms and conditions to continue");
      return;
    }

    const validPhoneNumber = getValidNigerianPhoneNumber(formData.phoneNumber);
    if (!validPhoneNumber) {
      toast.warning(
        "Please enter a valid Nigerian phone number, without the first zero"
      );
      return;
    }

    if (!validatePassword(formData.password)) {
      toast.warning(
        "Password must be at least 6 characters long and include letters, special characters, and numbers"
      );
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.warning("Passwords do not match");
      return;
    }
    setLoading(true);
    await postImage(image, formData, setFormData);

    try {
      const updatedFormData = { ...formData, phoneNumber: validPhoneNumber };
      const response = await axios.post(
     `${baseUrl}/angel/registerMedicUser`,
        updatedFormData,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.success) {
        toast.success("Registration successful");
        localStorage.setItem("phoneNumber", updatedFormData.phoneNumber);
        setTimeout(() => {
          navigate("/join-complete");
        }, 5000);
      } else {
        setLoading(false);
        console.error("Error registering");
        toast.error(response.data.message);
      }
    } catch (error) {
      setLoading(false);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        const errorMessage = error.response.data.message;
        if (errorMessage === "Account already exists, kindly login!") {
          toast.error(errorMessage);
          setTimeout(() => {
            navigate("/login");
          }, 5000);
        } else {
          toast.error(errorMessage);
        }
      } else {
        toast.error(
          "Registration failed, kindly login if you have registered before."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    AOS.init();
  }, []);

  const postImage = async (image, formData) => {
    setImageLoading(true);
    if (image === undefined) {
      return;
    }
    if (image.type === "image/jpeg" || image.type === "image/png") {
      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", "profileImage");
      data.append("cloud_name", "dmfewrwla");

      try {
        const response = await fetch(
          "https://api.cloudinary.com/v1_1/dmfewrwla/image/upload",
          {
            method: "post",
            body: data,
          }
        );

        const imageData = await response.json();

        setFormData({
          ...formData,
          image: imageData.url.toString(),
        });
        setImageLoading(false);
      } catch (err) {
        console.log(err);
        setImageLoading(false);
      }
    } else {
      return;
    }
  };

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
      <Flex color="#00000080" overflow="scroll" align="center" justify="center" height="100vh">
        <Box
          mb="300px"
          mt={{ base: "700px", md: "800px" }}
          width={{ base: "90%", sm: "500px" }}
          h={{ base: "140%", md: "160%" }}
          p="6"
          bg="white"
        >
          <Box
            top={{ base: "0px", md: "20px" }}
            left={{ base: "0px", md: "20px" }}
          >
            <a href="/">
              <Image
                src={logo}
                alt="Logo"
                h={{ base: "40px", md: "58px" }}
                w={{ base: "150px", md: "200px" }}
              />
            </a>
          </Box>
          <Text
            fontFamily="header"
            fontSize="2xl"
            color="#A210C6"
            mb="4"
            textAlign="center"
          >
            Create your account
          </Text>
          <MedicRegistrationForm
            formData={formData}
            handleInputChange={handleInputChange}
            handleDobChange={handleDobChange}
            handleClick={handleClick}
            show={show}
            handleSubmit={handleSubmit}
            validationErrors={validationErrors}
            agreeToTerms={agreeToTerms}
            handleTermsChange={handleTermsChange}
            loading={loading}
            imageLoading={imageLoading}
            setImage={(img) => setImage(img)}
            postImage={postImage}
          />
          <Text fontSize="16px" fontFamily="body" mt="15px">
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
      <TermsModal isOpen={isTermsOpen} onClose={closeTermsModal} />
    </ChakraProvider>
  );
};

export default LandingPage;
