import { IClass } from "@/common/interfaces/class.interface";
import { Flex, Table, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react";
import { useRef } from "react";
import { ModalTurma } from "../modals/ModalTurma";

const ListClass = ({
  classes,
  handleEditClick,
  handleDeleteConfirmation,
}: {
  classes: IClass[];
  handleEditClick: (id: string) => void;
  handleDeleteConfirmation: (id: string) => void;
}) => {
  const modalturmas = useRef();

  return (
    <>
      <Table variant="striped" colorScheme="gray">
        <Thead>
          <Tr>
            <Th>Nome</Th>
            <Th colSpan={2}></Th>
          </Tr>
        </Thead>
        <Tbody>
          {classes?.map((classItem, key) => (
            <Tr key={classItem?.id}>
              <Td>{classItem?.name}</Td>
              <Td colSpan={2}>
                <Flex justify="flex-end" gap={5}>
                  <Text
                    as="button"
                    fontWeight="bold"
                    onClick={() => handleEditClick(classItem.id)}
                  >
                    Editar
                  </Text>
                  <Text
                    as="button"
                    color="red"
                    fontWeight="bold"
                    onClick={() => handleDeleteConfirmation(classItem.id)}
                  >
                    Excluir
                  </Text>
                </Flex>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <ModalTurma ref={modalturmas} />
    </>
  );
};

export default ListClass;
