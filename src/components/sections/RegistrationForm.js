

import React from "react";
import {
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  InputLeftAddon,
  FormErrorMessage,
  Button,
  Select,
  Checkbox,
  Flex,
  Stack,
  Text,
} from "@chakra-ui/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import LoadingSpinner from "../../utils/Spiner";

const RegistrationForm = ({
  formData,
  handleInputChange,
  handleDobChange,
  handleClick,
  show,
  handleSubmit,
  validationErrors,
  agreeToTerms,
  handleTermsChange,
  loading,
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={4} marginTop="20px">
        <FormControl
          fontSize={{ base: "16px", md: "20px" }}
          fontFamily="body"
          isRequired
          isInvalid={validationErrors.firstName}
        >
          <FormLabel>First name</FormLabel>
          <Input
            name="firstName"
            placeholder="First name"
            onChange={handleInputChange}
          />
          {validationErrors.firstName && (
            <FormErrorMessage>
              <Text as="i">{validationErrors.firstName}</Text>
            </FormErrorMessage>
          )}
        </FormControl>

        <FormControl
          fontSize={{ base: "16px", md: "20px" }}
          fontFamily="body"
          isRequired
          isInvalid={validationErrors.lastName}
        >
          <FormLabel>Last name</FormLabel>
          <Input
            name="lastName"
            placeholder="Last name"
            onChange={handleInputChange}
          />
          {validationErrors.lastName && (
            <FormErrorMessage>
              <Text as="i">{validationErrors.lastName}</Text>
            </FormErrorMessage>
          )}
        </FormControl>

        <FormControl
          fontSize={{ base: "16px", md: "20px" }}
          fontFamily="body"
          isRequired
          isInvalid={validationErrors.email}
        >
          <FormLabel>Email address</FormLabel>
          <Input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleInputChange}
          />
          {validationErrors.email && (
            <FormErrorMessage>
              <Text as="i">{validationErrors.email}</Text>
            </FormErrorMessage>
          )}
        </FormControl>

        <FormControl
          fontSize={{ base: "16px", md: "20px" }}
          fontFamily="body"
          isRequired
          isInvalid={validationErrors.phoneNumber}
        >
          <FormLabel>Phone number</FormLabel>
          <InputGroup>
            <InputLeftAddon children="+234" />
            <Input
              name="phoneNumber"
              type="tel"
              placeholder="Phone number"
              onChange={handleInputChange}
            />
          </InputGroup>
          {validationErrors.phoneNumber && (
            <FormErrorMessage>
              <Text as="i">{validationErrors.phoneNumber}</Text>
            </FormErrorMessage>
          )}
        </FormControl>

        <FormControl
          fontSize={{ base: "16px", md: "20px" }}
          fontFamily="body"
          isRequired
          isInvalid={validationErrors.gender}
        >
          <FormLabel>Gender</FormLabel>
          <Select
            name="gender"
            placeholder="Select your gender"
            onChange={handleInputChange}
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </Select>
          {validationErrors.gender && (
            <FormErrorMessage>
              <Text as="i">{validationErrors.gender}</Text>
            </FormErrorMessage>
          )}
        </FormControl>

        <FormControl
          fontSize={{ base: "16px", md: "20px" }}
          fontFamily="body"
          isRequired
          isInvalid={validationErrors.dob}
        >
          <FormLabel>Date of birth</FormLabel>
          <Flex
            alignItems="flex-start"
            border="1px solid"
            borderColor="gray.200"
            p={1}
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
          {validationErrors.dob && (
            <FormErrorMessage>
              <Text as="i">{validationErrors.dob}</Text>
            </FormErrorMessage>
          )}
        </FormControl>

        <FormControl
          fontSize={{ base: "16px", md: "20px" }}
          fontFamily="body"
          isRequired
          isInvalid={validationErrors.password}
        >
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
          {validationErrors.password && (
            <FormErrorMessage>
              <Text as="i">{validationErrors.password}</Text>
            </FormErrorMessage>
          )}
        </FormControl>

        <FormControl
          fontSize={{ base: "16px", md: "20px" }}
          fontFamily="body"
          isRequired
          isInvalid={validationErrors.confirmPassword}
        >
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
          {validationErrors.confirmPassword && (
            <FormErrorMessage>
              <Text as="i">{validationErrors.confirmPassword}</Text>
            </FormErrorMessage>
          )}
        </FormControl>

        <Checkbox
          fontFamily="body"
          isChecked={agreeToTerms}
          onChange={handleTermsChange}
          mt="4"
          style={{
            fontSize: "6px",
            fontStyle: "italic",
            cursor: "pointer",
          }}
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
      </Stack>
    </form>
  );
};

export default RegistrationForm;
