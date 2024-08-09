import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { PieChart, Pie, Cell } from "recharts";
import {
  Box,
  Flex,
  Text,
  VStack,
  Select,
  Spacer,
  Spinner,
} from "@chakra-ui/react";
import axios from "axios";

const CustomLineChart = ({ data }) => (
  <Box bg="#4B4B4B" borderRadius="10px" p={4} color="white" h="250px" w="650px">
    <Flex justifyContent="space-between" alignItems="center" >
      <Text fontSize="lg" fontWeight="bold">
        Patients Statistics
      </Text>
      {/* <Select color="#4B4B4B" bg="white" width="110px">
        <option value="monthly">Monthly</option>
        <option value="yearly">Yearly</option>
      </Select> */}
    </Flex>
    <ResponsiveContainer width="100%" height={200}>
      <LineChart marginLeft="-10px" data={data}>
        <XAxis dataKey="name" stroke="white" />
        <YAxis stroke="white" />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#00C6F7"
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  </Box>
);

const CustomPieChart = ({
  financialData,
  selectedOption,
  setSelectedOption,
}) => {

  // Helper function to capitalize the first letter
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const getTotalAmount = () => {
    switch (selectedOption) {
      case "week":
        return financialData.totalAmountWeek || 0;
      case "month":
        return financialData.totalAmountMonth || 0;
      case "year":
        return financialData.totalAmountYear || 0;
      case "all":
      default:
        return financialData.totalAmountMade || 0;
    }
  };

  const getPercentage = (value, total) => {
    return total > 0 ? ((value / total) * 100).toFixed(2) : 0;
  };

  const totalAmount = getTotalAmount();

  const pieData = [
    {
      name: "Revenue",
      value: totalAmount,
      percentage: getPercentage(totalAmount, financialData.totalAmountMade || 1),
      color: "#00C6F7",
    },
    {
      name: "COS",
      value:
        financialData[`totalCostOfService${capitalizeFirstLetter(selectedOption)}`] || 0,
      percentage: getPercentage(
        financialData[`totalCostOfService${capitalizeFirstLetter(selectedOption)}`] || 0,
        totalAmount
      ),
      color: "#FF8A80",
    },
    {
      name: "Refunds",
      value:
        financialData[`totalRefunded${capitalizeFirstLetter(selectedOption)}`] || 0,
      percentage: getPercentage(
        financialData[`totalRefunded${capitalizeFirstLetter(selectedOption)}`] || 0,
        totalAmount
      ),
      color: "#FDD835",
    },
  ];

  return (
    <Box
      // mt="15px"
      bg="#4B4B4B"
      borderRadius="10px"
      p={4}
      color="white"
      w="350px"
      h="250px"
    >
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <Text fontSize="lg" fontWeight="bold">
          Financial Statistics
        </Text>
        <Select
          color="#4B4B4B"
          bg="white"
          width="120px"
          value={selectedOption}
          onChange={(e) => setSelectedOption(e.target.value)}
        >
          <option value="all">All</option>
          <option value="year">Year</option>
          <option value="month">Month</option>
          <option value="week">Week</option>
        </Select>
      </Flex>
      <Text fontSize="2xl" fontWeight="bold">
        ₦{getTotalAmount().toLocaleString()}
      </Text>
      <Flex mt={-4} justifyContent="space-between" alignItems="center">
        <ResponsiveContainer width="50%" height={150}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={45}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <VStack fontSize="16px" align="left" width="100%">
          {pieData.map((entry, index) => (
            <Flex key={`label-${index}`} alignItems="center">
              <Box bg={entry.color} w="10px" h="10px" mr={2} />
              <Text>
                {entry.name}: {entry.percentage}% 
              </Text>
            </Flex>
          ))}
        </VStack>
      </Flex>
    </Box>
  );
};

const StatisticsSection = () => {
  const [lineData, setLineData] = useState([]);
  const [financialData, setFinancialData] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState("all");

  useEffect(() => {
    const fetchLineData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/v1/api/admin/beneficiaries/count-by-month"
        );
        const monthOrder = [
          "JANUARY",
          "FEBRUARY",
          "MARCH",
          "APRIL",
          "MAY",
          "JUNE",
          "JULY",
          "AUGUST",
          "SEPTEMBER",
          "OCTOBER",
          "NOVEMBER",
          "DECEMBER",
        ];

        const formattedData = response.data
          .map((item) => ({
            name: item.month,
            value: item.count,
          }))
          .sort(
            (a, b) => monthOrder.indexOf(a.name) - monthOrder.indexOf(b.name)
          );

        setLineData(formattedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const fetchFinancialData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/v1/api/statistics/financial"
        );
        setFinancialData(response.data[0]); // Assuming the response is an array with one object
      } catch (error) {
        console.error("Error fetching financial data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLineData();
    fetchFinancialData();
  }, []);

  if (loading) {
    return <Spinner size="xl" color="white" />;
  }

  return (
    <Flex mt="-20px" justifyContent="space-between" p={4} flexWrap="wrap">
      <CustomLineChart data={lineData} />
      <Spacer />
      <CustomPieChart
        financialData={financialData}
        selectedOption={selectedOption}
        setSelectedOption={setSelectedOption}
      />
    </Flex>
  );
};

export default StatisticsSection;
