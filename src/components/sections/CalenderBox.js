// CalendarBox.js
import React, { useState } from "react";
import { Box, Text, Flex, Button } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { format, addMonths, subMonths, startOfWeek, endOfWeek, startOfMonth, endOfMonth, addDays, isSameMonth, isSameDay } from "date-fns";

const CalendarBox = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const renderHeader = () => {
    return (
      <Flex justifyContent="space-between" alignItems="center" mb="4">
        <Button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
          <ChevronLeftIcon w={6} h={6} />
        </Button>
        <Text fontFamily="sans-serif" fontSize="lg">
          {format(currentMonth, "MMMM yyyy")}
        </Text>
        <Button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
          <ChevronRightIcon w={6} h={6} />
        </Button>
      </Flex>
    );
  };

  const renderDays = () => {
    const days = [];
    const dayNames = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

    for (let i = 0; i < 7; i++) {
      days.push(
        <Box fontFamily="sans-serif" key={i} w="14%" fontSize={{ base: "14px", md: "16px" }} textAlign="center">
          {dayNames[i]}
        </Box>
      );
    }

    return <Flex>{days}</Flex>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, "d");
        const cloneDay = day;

        days.push(
          <Box
            key={day}
            w="14%"
            textAlign="center"
            p={{ base: "1", md: "2" }}
            borderRadius="50%"
            bg={
              !isSameMonth(day, monthStart)
                ? "transparent"
                : isSameDay(day, selectedDate)
                ? "#A210C6"
                : "transparent"
            }
            color={
              !isSameMonth(day, monthStart)
                ? "gray.300"
                : isSameDay(day, selectedDate)
                ? "white"
                : "black"
            }
            cursor="pointer"
            onClick={() => setSelectedDate(cloneDay)}
          >
            {formattedDate}
          </Box>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <Flex key={day} justifyContent="space-between">
          {days}
        </Flex>
      );
      days = [];
    }
    return <Box>{rows}</Box>;
  };

  return (
    <Box
      w={{ base: "100%", md: "300px" }}
      h={{ base: "auto", md: "700px" }}
      border="1px solid #A210C6"
      borderRadius="20px"
      boxShadow="0 4px 8px rgba(162, 16, 198, 0.4)"
      ml={{ base: "0px", md: "30px" }}
      padding="20px"
    >
      <Text fontSize="lg" fontFamily="sans-serif" fontWeight="bold" mb="4">
        My Calendar
      </Text>
      {renderHeader()}
      {renderDays()}
      {renderCells()}
      <Box mt="4">
        {/* Appointment List */}
        {/* <Flex mb="2">
          <Box w="10px" h="10px" bg="#A210C6" borderRadius="50%" mr="2" />
          <Box>
            <Text fontWeight="bold">9:00 am</Text>
            <Text>Short Home Visit - Sylvia Benjamin - Confirmed</Text>
          </Box>
        </Flex>
        <Flex>
          <Box w="10px" h="10px" bg="#A210C6" borderRadius="50%" mr="2" />
          <Box>
            <Text fontWeight="bold">11:00 am</Text>
            <Text>Recovery Care - Adebisi Folarin - Confirmed</Text>
          </Box>
        </Flex> */}
      </Box>
    </Box>
  );
};

export default CalendarBox;
