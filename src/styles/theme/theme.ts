import { extendTheme } from "@chakra-ui/react";

const breakpoints = {
  sm: "120px",
  md: "768px",
  lg: "1024px",
  xl: "1366px",
  xxl: "1920px",
};

const theme = extendTheme({
  breakpoints,
  fonts: {
    body: `'Inter', sans-serif`,
  },
  config: {
    toast: {
      position: "bottom-right",
      duration: 5000,
      isClosable: true,
    },
  },
  colors: {
    blueglobal: "#4E5B9F",
    greenglobal: "#438A68",
    grayglobal: "#343434"
  },
});
export default theme;
