import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';
import { Box, Flex, Text, VStack, Select, Spacer, Spinner } from "@chakra-ui/react";
import axios from 'axios';

const CustomLineChart = ({ data }) => (
  <Box bg="#4B4B4B" borderRadius="10px" p={4} color="white" w="650px">
    <Flex justifyContent="space-between" alignItems="center" mb={4}>
      <Text fontSize="lg" fontWeight="bold">Patients Statistics</Text>
      <Select bg="white" color="black" width="100px">
        <option value="monthly">Monthly</option>
        <option value="yearly">Yearly</option>
      </Select>
    </Flex>
    <ResponsiveContainer width="100%" height={200}>
      <LineChart  marginLeft="-10px" data={data}>
        <XAxis dataKey="name" stroke="white" />
        <YAxis stroke="white" />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Line type="monotone" dataKey="value" stroke="#00C6F7" activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
  </Box>
);

const pieData = [
  { name: 'Revenue', value: 58, color: '#00C6F7' },
  { name: 'Expense', value: 24, color: '#FF8A80' },
  { name: 'Other', value: 6, color: '#FDD835' },
];

const CustomPieChart = () => (
  <Box mt="15px" bg="#4B4B4B" borderRadius="10px" p={4} color="white" w="350px">
    <Flex justifyContent="space-between" alignItems="center" mb={4}>
      <Text fontSize="lg" fontWeight="bold">Financial Statistics</Text>
      <Select bg="white" color="black" width="140px">
        <option value="date">12/11/2024</option>
        <option value="date">12/12/2024</option>
      </Select>
    </Flex>
    <Text fontSize="2xl" fontWeight="bold">$126583.00</Text>
    <Flex justifyContent="space-between" alignItems="center">
      <ResponsiveContainer width="50%" height={200}>
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
      <VStack fontSize="16px" align="left" mt={4} width="100%">
        {pieData.map((entry, index) => (
          <Flex key={`label-${index}`} alignItems="center">
            <Box bg={entry.color} w="10px" h="10px" mr={2} />
            <Text>{entry.name} {entry.value}%</Text>
          </Flex>
        ))}
      </VStack>
    </Flex>
  </Box>
);

const StatisticsSection = () => {
  const [lineData, setLineData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/v1/api/admin/beneficiaries/count-by-month');
        const monthOrder = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
        
        const formattedData = response.data
          .map(item => ({
            name: item.month,
            value: item.count,
          }))
          .sort((a, b) => monthOrder.indexOf(a.name) - monthOrder.indexOf(b.name));
          
        setLineData(formattedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <Spinner size="xl" color="white" />;
  }

  return (
    <Flex mt="-20px" justifyContent="space-between" p={4} flexWrap="wrap">
      <CustomLineChart data={lineData} />
      <Spacer />
      <CustomPieChart />
    </Flex>
  );
};

export default StatisticsSection;
