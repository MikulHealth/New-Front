import React, { useState, useEffect } from "react";
import { Box, Flex, Text, HStack } from "@chakra-ui/react";
import {
  AiOutlineUser,
  AiOutlineCalendar,
  AiOutlineHeart,
} from "react-icons/ai";
import axios from "axios";
import { useSpring, animated } from "@react-spring/web";

// Function to format numbers with commas
const formatNumber = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const CustomerStatisticsBox = () => {
  const [statistics, setStatistics] = useState([
    {
      id: 1,
      title: "Total Users",
      count: 0,
      percentage: "0%",
      bgColor: "linear-gradient(80deg, #00C6F7, #E552FF)",
      lastMonth: "Last Month",
      icon: AiOutlineUser,
    },
    {
      id: 2,
      title: "Total Customers",
      count: 0,
      percentage: "0%",
      bgColor: "linear-gradient(80deg, #FDD835, #E552FF)",
      lastMonth: "Last Month",
      icon: AiOutlineCalendar,
    },

    {
      id: 3,
      title: "Total Patients",
      count: 0,
      percentage: "0%",
      bgColor: "linear-gradient(80deg, #057B1F, #E552FF)",
      lastMonth: "Last Month",
      icon: AiOutlineHeart,
    },
    {
      id: 3,
      title: "Total Coporates",
      count: 0,
      percentage: "0%",
      bgColor: "linear-gradient(80deg, #057B1F, #E552FF)",
      lastMonth: "Last Month",
      icon: AiOutlineHeart,
    },
  ]);

  const [fetchedData, setFetchedData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/v1/api/statistics"
        );
        const data = response.data[0];

        setFetchedData({
          totalUsers: data.totalUsers,
          totalCustomers: data.totalCustomers,
          totalCareBeneficiaries: data.totalCareBeneficiaries,
          totalCoporates: data?.totalCoporates,
        });
      } catch (error) {
        console.error("Error fetching statistics:", error);
      }
    };

    fetchData();
  }, []);

  const userSpring = useSpring({
    from: { value: 0 },
    value: fetchedData ? fetchedData.totalUsers : 0,
  });
  const appointmentSpring = useSpring({
    from: { value: 0 },
    value: fetchedData ? fetchedData.totalCustomers : 0,
  });
  const beneficiarySpring = useSpring({
    from: { value: 0 },
    value: fetchedData ? fetchedData.totalCareBeneficiaries : 0,
  });
  const medicSpring = useSpring({
    from: { value: 0 },
    value: fetchedData ? fetchedData?.totalCoporates : 0,
  });
  return (
    <Flex justifyContent="space-between" w="100%" p={4} gap={4}>
      {statistics.map((stat, index) => {
        const springValue =
          index === 0
            ? userSpring.value
            : index === 1
            ? appointmentSpring.value
            : index === 2
            ? beneficiarySpring.value
            : medicSpring.value

        return (
          <Box
            key={stat.id}
            bg={stat.bgColor}
            borderRadius="20px"
            p={4}
            flex="1"
            color="white"
          >
            <Flex justifyContent="space-between" alignItems="center">
              <Text fontSize="lg" fontWeight="bold">
                {stat.title}
              </Text>
              <stat.icon size={24} />
            </Flex>
            <Text fontSize="2xl" fontWeight="bold" mt={2}>
              <animated.span>
                {springValue.to((val) =>
                  index === 4
                    ? `₦${formatNumber(val.toFixed(2))}`
                    : formatNumber(Math.floor(val))
                )}
              </animated.span>
            </Text>
            <HStack justifyContent="space-between" mt={2}>
              <Text bg="rgba(255, 255, 255, 0.3)" borderRadius="10px" p={1}>
                {stat.percentage}
              </Text>
              <Text>{stat.lastMonth}</Text>
            </HStack>
          </Box>
        );
      })}
    </Flex>
  );
};

export default CustomerStatisticsBox;
