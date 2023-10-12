// ProfessorTable.js
import React from "react";
import {
  Flex,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";

const ListProfessor = ({
  professors,
  handleEditClick,
  handleDeleteConfirmation,
}) => {
  return (
    <TableContainer>
      <Table variant="striped" colorScheme="gray">
        <Thead>
          <Tr>
            <Th>Nome</Th>
            <Th colSpan={2}></Th>
          </Tr>
        </Thead>
        <Tbody>
          {professors.map((prof, key) => (
            <Tr key={prof.id}>
              <Td>{prof.name}</Td>
              <Td colSpan={2}>
                <Flex justify="flex-end" gap={5}>
                  <Text
                    as="button"
                    fontWeight="bold"
                    onClick={() => handleEditClick(prof.id)}
                  >
                    Editar
                  </Text>
                  <Text
                    as="button"
                    color="red"
                    fontWeight="bold"
                    onClick={() => handleDeleteConfirmation(prof.id)}
                  >
                    Excluir
                  </Text>
                </Flex>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default ListProfessor;
