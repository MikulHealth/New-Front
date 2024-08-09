import React from "react";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Box,
  Text,
  Avatar,
  Divider,
  Button,
  VStack,
} from "@chakra-ui/react";

const CustomerDetailsDrawer = ({ isOpen, onClose, customer }) => {
  if (!customer) return null;

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
      <DrawerOverlay />
      <DrawerContent bg="#4B4B4B" color="white">
        <DrawerCloseButton />
        <DrawerHeader>
          <Avatar
            borderRadius="full"
            boxSize="80px"
            src={customer.bioData.image}
            alt={customer.bioData.firstName}
          />
          <Text fontSize="2xl" fontWeight="bold" mt={2}>
            {`${customer.bioData.firstName} ${customer.bioData.lastName}`}
          </Text>
        </DrawerHeader>

        <DrawerBody>
          <VStack align="left" spacing={4}>
            <Box>
              <Text fontWeight="bold">Phone Number:</Text>
              <Text>{customer.phoneNumber}</Text>
            </Box>
            <Divider />
            <Box>
              <Text fontWeight="bold">Email:</Text>
              <Text>{customer.bioData.email}</Text>
            </Box>
            <Divider />
            <Box>
              <Text fontWeight="bold">Gender:</Text>
              <Text>{customer.bioData.gender}</Text>
            </Box>
            <Divider />
            <Box>
              <Text fontWeight="bold">Date of Birth:</Text>
              <Text>{new Date(customer.bioData.dob).toLocaleDateString()}</Text>
            </Box>
            <Divider />
            <Box>
              <Text fontWeight="bold">Address:</Text>
              <Text>{customer.bioData.address || "N/A"}</Text>
            </Box>
            <Divider />
            <Box>
              <Text fontWeight="bold">Created At:</Text>
              <Text>
                {new Date(customer.bioData.createdAt).toLocaleDateString()}
              </Text>
            </Box>
            <Divider />
            <Box>
              <Text fontWeight="bold">Has Wallet:</Text>
              <Text>{customer.walletCreated ? "Yes" : "No"}</Text>
            </Box>
            <Divider />
            <Box>
              <Text fontWeight="bold">Wallet Balance:</Text>
              <Text>{customer.walletBalance || "N/A"}</Text>
            </Box>
            <Divider />
            <Box>
              <Text fontWeight="bold">Pending Appointments:</Text>
              <Text>{customer.numberOfPendingAppointments}</Text>
            </Box>
            <Divider />
            <Box>
              <Text fontWeight="bold">Active Appointments:</Text>
              <Text>{customer.numberOfActiveAppointments}</Text>
            </Box>
            <Divider />
            <Box>
              <Text fontWeight="bold">Completed Appointments:</Text>
              <Text>{customer.numberOfCompletedAppointments}</Text>
            </Box>
            <Divider />
            <Box>
              <Text fontWeight="bold">Beneficiaries:</Text>
              <Text>{customer.numberOfBeneficiaries}</Text>
            </Box>
            <Divider />
            <Box>
              <Text fontWeight="bold">Subscriptions:</Text>
              <Text>{customer.numberOfSubscriptions}</Text>
            </Box>
            <Divider />
            <Box>
              <Text fontWeight="bold">Amount Spent:</Text>
              <Text>₦{customer.amountSpent.toLocaleString()}</Text>
            </Box>
            <Divider />
            <Box>
              <Text fontWeight="bold">Number of Plans:</Text>
              <Text>{customer.numberOfPlan}</Text>
            </Box>
            <Divider />
            <Box>
              <Text fontWeight="bold">Bank Details:</Text>
              <Text>
                {customer.bankDetails
                  ? `${customer.bankDetails.bankName} - ${customer.bankDetails.accountNumber}`
                  : "N/A"}
              </Text>
            </Box>
          </VStack>
        </DrawerBody>

        <DrawerFooter justifyContent="space-between">
          <Button variant="outline" colorScheme="blue" mr={3} onClick={onClose}>
            Edit Customer Details
          </Button>
          <Button variant="outline" colorScheme="red">Suspend Customer</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default CustomerDetailsDrawer;
