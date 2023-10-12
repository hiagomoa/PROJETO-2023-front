import { useMediaQuery } from "@chakra-ui/react";

const Br = () => {
  const [displayMd] = useMediaQuery("(min-width: 768px)");
  return displayMd ? <br /> : null;
};

export default Br;
