import React from "react";
import {
  List,
  ListItem,
  InputGroup,
  InputLeftElement,
  IconButton,
  Input,
  Text,
  Flex,
  Box,
  Button,
} from "@chakra-ui/react";
import DatePicker from "react-datepicker";
import { SearchIcon, CloseIcon } from "@chakra-ui/icons";

const ReportList = ({
  reports,
  searchDate,
  setSearchDate,
  setSelectedReport,
  fetchReports,
  searchReports,
}) => {
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()}, ${date.toLocaleTimeString()}`;
  };

  return (
    <>
      <InputGroup borderRadius="100px" mb="10px" border="1px solid gray">
        <DatePicker
          selected={searchDate}
          onChange={(date) => setSearchDate(date)}
          dateFormat="yyyy-MM-dd"
          placeholderText="Search report by date"
          customInput={
            <Input
              ml="20px"
              fontSize={{ base: "12px", md: "16px" }}
              placeholder="Search report by date"
              value={searchDate ? searchDate.toISOString().split("T")[0] : ""}
              border="none"
            />
          }
        />
        <InputLeftElement>
          {searchDate ? (
            <IconButton
              icon={<CloseIcon />}
              onClick={() => {
                setSearchDate(null);
                fetchReports();
              }}
            />
          ) : (
            <IconButton
              bg="none"
              borderRadius="100px"
              icon={<SearchIcon />}
              onClick={() => searchReports(searchDate)}
            />
          )}
        </InputLeftElement>
      </InputGroup>
      <List mb="10px" spacing={3} color="#A210C6">
        {reports.map((report) => (
          <ListItem
            border="1px solid #A210C6"
            p="10px"
            borderRadius="5px"
            key={report.id}
            cursor="pointer"
            onClick={() => setSelectedReport(report)}
          >
            <Flex justifyContent="space-between">
              <Box>
                <Text fontFamily="heading" fontWeight="bold">
                  Report for {report.recipientFullName}
                </Text>
                <Text
                  fontSize={{ base: "12px", md: "16px" }}
                  fontWeight="body"
                  fontStyle="italic"
                >
                  Submitted by {report.medicFullName} on{" "}
                  {formatDateTime(report.createdAt)}
                </Text>
              </Box>
              <Button
              display={{base: "none", md: "block"}}
                fontSize={{ base: "12px", md: "16px" }}
                borderRadius="100px"
                color="white"
                bg="#A210C6"
              >
                Open
              </Button>
            </Flex>
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default ReportList;
