import React from "react";
import { useNavigate } from "react-router-dom";
import HelppIcon from "../../assets/HelppIcon.svg";
import { Box, Image } from "@chakra-ui/react";
export default function HelpMobile() {
  const help = () => {
    navigate("/help");
  };
  const navigate = useNavigate();
  return (
    <Box
    position="fixed"
      justify={{ base: "right" }}
      mt="610px"
      ml="260px"
    >
      <Image
        onClick={help}
        src={HelppIcon}
        alt="Logo"
        w="40px"
        h="40px"
        style={{
          cursor: "pointer",
          animation: "zoomInOut 2s infinite alternate",
        }}
      />

      <style>
        {`
  @keyframes zoomInOut {
    0% {
      transform: scale(1);
    }
    100% {
      transform: scale(1.2);
    }
  }
`}
      </style>
    </Box>
  );
}
