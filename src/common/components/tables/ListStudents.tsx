import { IStudent } from "@/common/interfaces/student.interface";
import { Flex, Table, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react";

const ListStudents = ({
  students,
  handleEditClick,
  handleDeleteConfirmation,
  isOnClassEdit,
}: {
  students: IStudent[];
  handleEditClick: (id: string) => void;
  handleDeleteConfirmation: (id: string) => void;
  isOnClassEdit?: boolean;
}) => {
  return (
    <>
      <Table variant="striped" colorScheme="gray">
        <Thead>
          <Tr>
            {!isOnClassEdit && <Th>RA</Th>}
            <Th>Nome</Th>
            <Th colSpan={2}></Th>
          </Tr>
        </Thead>
        <Tbody>
          {students?.map((student, key) => (
            <Tr key={student?.id}>
              {!isOnClassEdit && <Td>{student?.ra}</Td>}
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
    </>
  );
};

export default ListStudents;
