import React from "react";
import {
  List,
  ListItem,
  InputGroup,
  InputRightElement,
  IconButton,
  Input,
  Text,
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
      <InputGroup borderRadius="10px" mb="10px" border="4px solid gray">
        <DatePicker
          selected={searchDate}
          onChange={(date) => setSearchDate(date)}
          dateFormat="yyyy-MM-dd"
          placeholderText="Search report by date"
          customInput={
            <Input
              placeholder="Search report by date"
              value={searchDate ? searchDate.toISOString().split("T")[0] : ""}
              border="none"
            />
          }
        />
        <InputRightElement>
          {searchDate ? (
            <IconButton
              icon={<CloseIcon />}
              onClick={() => {
                setSearchDate(null);
                fetchReports();
              }}
            />
          ) : (
            <IconButton icon={<SearchIcon />} onClick={() => searchReports(searchDate)} />
          )}
        </InputRightElement>
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
            <Text fontFamily="body" fontWeight="bold">
              Report for: {report.recipientFullName} on {formatDateTime(report.createdAt)}
            </Text>
            <Text fontWeight="body" fontStyle="italic">
              Submitted by: {report.medicFullName}
            </Text>
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default ReportList;
