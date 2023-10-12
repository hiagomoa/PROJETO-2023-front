import { Box, Text } from "@chakra-ui/react";

export const CardExercicios = ({ name, date, description, maxAttempts }) => {
  return (
    <Box borderRadius="xl" w="100%" h="100%" bg="#EBEBEB">
      <Box
        h="80px"
        bg="url('/professor/bg.png')"
        bgPos="center center"
        bgSize="cover"
      />

      <Box h="70%" p={5} display="grid" gap={5}>
        <Text>{name}</Text>
        <Text>{description}</Text>
        <Text>
          <b>Data de entrega:</b> {date}{" "}
        </Text>
        <Text>
          <b>Turma: </b> Arrumar o backend{" "}
        </Text>
        <Text>
          <b>Número máximo de tentativas:</b> {maxAttempts}
        </Text>
      </Box>
    </Box>
  );
};
