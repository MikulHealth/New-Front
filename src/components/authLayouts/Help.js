import React from "react";
import { useNavigate } from "react-router-dom";
import HelppIcon from "../../assets/HelppIcon.svg";
import { Box, Image } from "@chakra-ui/react";
export default function Help() {
  const help = () => {
    navigate("/help");
  };
  const navigate = useNavigate();
  return (
    <Box
      display={{ base: "none", lg: "block" }}
      marginTop="100px"
      marginLeft="100px"
    >
      <Image
        onClick={help}
        src={HelppIcon}
        alt="Logo"
        w="70px"
        h="70px"
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
