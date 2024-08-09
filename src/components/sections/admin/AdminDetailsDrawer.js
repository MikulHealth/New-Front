import React from "react";
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Avatar,
  Text,
  VStack,
  Divider,
  Flex,
} from "@chakra-ui/react";
import { a } from "@react-spring/web";

const AdminDetailsDrawer = ({ isOpen, onClose, admin }) => {
  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
      <DrawerOverlay />
      <DrawerContent bg="#4B4B4B" color="white">
        <DrawerCloseButton />
        <DrawerHeader>Admin Details</DrawerHeader>
        <DrawerBody>
          <VStack align="left" spacing={4}>
            <Box>
              <Flex justifyContent="center">
                <Avatar
                  size="xl"
                  name={admin.name}
                  src={admin.bioData.image}
                  alt={`${admin.firstName} ${admin.lastName}`}
                />
              </Flex>
              <Flex alignItems="center" justifyContent="space-between" mt={2}>
                <Button colorScheme="blue" onClick={""}>
                  Update Admin Role
                </Button>
              </Flex>
            </Box>

            <Box>
              <Text fontSize="2xl" fontWeight="bold">
                {admin.bioData.firstName} {admin.bioData.lastName}
              </Text>
              <Text>Email: {admin.bioData.email}</Text>
              <Text>Phone Number: {admin.bioData.phoneNumber}</Text>
              <Text>Gender: {admin.bioData.gender}</Text>
              <Text>
                Date of Birth:{" "}
                {admin.bioData.dob
                  ? new Date(admin.bioData.dob).toLocaleDateString()
                  : "N/A"}
              </Text>
              <Text>Role: {admin.bioData.roles.join(", ")}</Text>
              <Text>
                Created At:{" "}
                {new Date(admin.bioData.createdAt).toLocaleDateString()}
              </Text>
              <Text>
                Updated At:{" "}
                {admin.bioData.updatedAt
                  ? new Date(admin.bioData.updatedAt).toLocaleDateString()
                  : "N/A"}
              </Text>
              <Divider mt={4} />
              <Text fontSize="lg" fontWeight="bold" mt={4}>
                Additional Information
              </Text>
              <Text>Active: {admin.active ? "Yes" : "No"}</Text>
              <Text>Wallet Created: {admin.walletCreated ? "Yes" : "No"}</Text>
              <Text>
                Transaction Pin Created:{" "}
                {admin.transactionPinCreated ? "Yes" : "No"}
              </Text>
            </Box>
          </VStack>
        </DrawerBody>
        <DrawerFooter justifyContent="space-between">
          <Button
            variant="outline"
            colorScheme="blue"
            onClick={() => alert("Edit Admin Details")}
          >
            Edit Admin Details
          </Button>
          <Button
            variant="outline"
            colorScheme="red"
            onClick={() => alert("Suspend Admin")}
          >
            Suspend Admin
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default AdminDetailsDrawer;
