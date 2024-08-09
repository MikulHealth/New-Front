import React, { useState, useEffect } from "react";
import { Box, Flex, Text, VStack, HStack } from "@chakra-ui/react";
import {
  AiOutlineUser,
  AiOutlineCalendar,
  AiOutlineDollarCircle,
  AiOutlineHeart,
  AiOutlineMedicineBox,
} from "react-icons/ai";
import axios from "axios";
import { useSpring, animated } from "@react-spring/web";

// Function to format numbers with commas
const formatNumber = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const MedicStatBox = () => {
  const [statistics, setStatistics] = useState([
    {
      id: 1,
      title: "Unverified",
      count: 0,
      percentage: "0%",
      bgColor: "linear-gradient(80deg, #00C6F7, #E552FF)",
      lastMonth: "Last Month",
      icon: AiOutlineUser,
    },
    {
      id: 2,
      title: "Total RNs",
      count: 0,
      percentage: "0%",
      bgColor: "linear-gradient(80deg, #FDD835, #E552FF)",
      lastMonth: "Last Month",
      icon: AiOutlineCalendar,
    },
    {
      id: 3,
      title: "Total CNAs",
      count: 0,
      percentage: "0%",
      bgColor: "linear-gradient(80deg, #057B1F, #E552FF)",
      lastMonth: "Last Month",
      icon: AiOutlineHeart,
    },
    {
      id: 4,
      title: "Total DRs",
      count: 0,
      percentage: "0%",
      bgColor: "linear-gradient(80deg, #6FBACA, #E552FF)",
      lastMonth: "Last Month",
      icon: AiOutlineMedicineBox,
    },
    {
      id: 5,
      title: "Total PTs",
      count: 0,
      percentage: "0%",
      bgColor: "linear-gradient(80deg, #A210C6, #E552FF)",
      lastMonth: "Last Month",
      icon: AiOutlineDollarCircle,
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
          totalUnVerifiedMedics: data.totalUnVerifiedMedics,
          totalRNs: data.totalRNs,
          totalCNAs: data.totalCNAs,
          totalDoctors: data.totalDoctors,
          totalPhysiotherapists: data.totalPhysiotherapists,
        });
      } catch (error) {
        console.error("Error fetching statistics:", error);
      }
    };

    fetchData();
  }, []);

  const userSpring = useSpring({
    from: { value: 0 },
    value: fetchedData ? fetchedData.totalUnVerifiedMedics : 0,
  });
  const appointmentSpring = useSpring({
    from: { value: 0 },
    value: fetchedData ? fetchedData.totalRNs : 0,
  });
  const beneficiarySpring = useSpring({
    from: { value: 0 },
    value: fetchedData ? fetchedData.totalCNAs : 0,
  });
  const medicSpring = useSpring({
    from: { value: 0 },
    value: fetchedData ? fetchedData.totalDoctors : 0,
  });
  const revenueSpring = useSpring({
    from: { value: 0 },
    value: fetchedData ? fetchedData.totalPhysiotherapists : 0,
  });

  return (
    <Flex justifyContent="space-between" w="100%" p={4}>
      {statistics.map((stat, index) => {
        const springValue =
          index === 0
            ? userSpring.value
            : index === 1
            ? appointmentSpring.value
            : index === 2
            ? beneficiarySpring.value
            : index === 3
            ? medicSpring.value
            : revenueSpring.value;

        return (
          <Box
            key={stat.id}
            bg={stat.bgColor}
            borderRadius="20px"
            p={4}
            w="19%"
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
                    ? `${formatNumber(val.toFixed(2))}`
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

export default MedicStatBox;
