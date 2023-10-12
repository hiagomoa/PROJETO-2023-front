import { Box } from "@chakra-ui/react";

export const Container = ({ children }) => (
  <Box
    w={{ sm: "100%", md: "100%", lg: "1024px", xl: "1200px", xxl: "1500px" }}
    mx="auto"
  >
    {children}
  </Box>
);
