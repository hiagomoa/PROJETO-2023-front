import { AuthContext } from "@/context/auth.context";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { useContext, useEffect, useRef } from "react";
import { useMutation, useQuery } from "react-query";
import { Container } from "../../../common/components/layout/Container";
import { LayoutProfessor } from "../../../common/components/layout/Layout";
import { ModalAluno } from "../../../common/components/modals/ModalAluno";
import { ModalDelete } from "../../../common/components/modals/ModalDelete";
import ListStudents from "../../../common/components/tables/ListStudents";
import {
  deleteStudent,
  listStudents,
} from "../../../common/services/database/student";
import { queryClient } from "../../../common/services/queryClient";

const ProfessorAlunos = () => {
  const modalAlunos = useRef();
  const modaldelete = useRef();
  const deleteStudents = useMutation(deleteStudent);

  const { user } = useContext(AuthContext);
  const { data: students, isLoading } = useQuery(
    ["students", { id: user?.id, role: user?.role }],
    listStudents
  );

  useEffect(() => {
    console.log(students);
  }, [students]);

  const handleDeleteConfirmation = (studentId) => {
    modaldelete?.current.open(
      "Tem certeza de que deseja excluir este aluno?",
      async () => {
        await deleteStudents.mutateAsync(studentId);
        queryClient.invalidateQueries("students");
      }
    );
  };

  const handleEditClick = (studentId) => {
    modalAlunos.current.onOpen(studentId);
  };

  return (
    <LayoutProfessor>
      <Container>
        <Box my={5}>
          <Flex justify="space-between" my={10}>
            <Text color="#313B6D" fontWeight="bold" fontSize="3xl">
              ALUNOS CRIADOS
            </Text>
            <Button
              bg="blueglobal"
              color="white"
              onClick={() => modalAlunos.current.onOpen()}
            >
              Cadastrar Aluno
            </Button>
          </Flex>
        </Box>
        <ListStudents
          students={students || []}
          handleDeleteConfirmation={handleDeleteConfirmation}
          handleEditClick={handleEditClick}
        />
      </Container>
      <ModalAluno ref={modalAlunos} />
      <ModalDelete ref={modaldelete} />
    </LayoutProfessor>
  );
};

export default ProfessorAlunos;
