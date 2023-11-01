// ProfessorTable.js
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
  console.log(professors, "professors");
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
          {professors &&
            professors?.map((prof, key) => {
              if (prof.deleted_at !== null) return;

              return (
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
              );
            })}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default ListProfessor;
