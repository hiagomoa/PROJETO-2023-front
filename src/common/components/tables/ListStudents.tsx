import { Flex, Table, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react";
import { ModalAluno } from "../modals/ModalAluno"; // Importe o modal correto
import { useRef } from "react";

const ListStudents = ({
  students,
  handleEditClick,
  handleDeleteConfirmation,
}) => {
  const modalAluno = useRef(); // Renomeie a ref para modalAluno

  return (
    <>
      <Table variant="striped" colorScheme="gray">
        <Thead>
          <Tr>
            <Th>RA</Th>
            <Th>Nome</Th>
            <Th colSpan={2}></Th>
          </Tr>
        </Thead>
        <Tbody>
          {students?.map((student, key) => (
            <Tr key={student?.id}>
              <Td>{student?.ra}</Td>
              <Td>{student?.name}</Td>
              <Td colSpan={2}>
                <Flex justify="flex-end" gap={5}>
                  <Text
                    as="button"
                    fontWeight="bold"
                    onClick={() => handleEditClick(student.id)}
                  >
                    Editar
                  </Text>
                  <Text
                    as="button"
                    color="red"
                    fontWeight="bold"
                    onClick={() => handleDeleteConfirmation(student.id)}
                  >
                    Excluir
                  </Text>
                </Flex>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <ModalAluno ref={modalAluno} />
    </>
  );
};

export default ListStudents;
