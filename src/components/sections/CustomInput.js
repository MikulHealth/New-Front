import React from "react";
import { Button } from "@chakra-ui/react";

const CustomInput = React.forwardRef(({ value, onClick }, ref) => (
  <Button
    onClick={onClick}
    ref={ref}
    width="full"
    bg="gray.200"
    _hover={{ bg: "gray.300" }}
  >
    {value || "Select Time"}
  </Button>
));

export default CustomInput;
