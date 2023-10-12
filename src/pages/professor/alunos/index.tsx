import { Container } from "@/common/components/layout/Container";
import { LayoutProfessor } from "@/common/components/layout/Layout";
import { ModalAluno } from "@/common/components/modals/ModalAluno";
import { ModalDelete } from "@/common/components/modals/ModalDelete";
import ListStudents from "@/common/components/tables/ListStudents";
import {
  deleteStudent,
  listStudents,
} from "@/common/services/database/student";
import { queryClient } from "@/common/services/queryClient";
import { withPermission } from "@/common/utils/withPermission";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useRef } from "react";
import { useMutation, useQuery } from "react-query";

const ProfessorAlunos = () => {
  const modalAlunos = useRef();
  const modaldelete = useRef();
  const deleteStudents = useMutation(deleteStudent);

  const { data: session } = useSession();

  const { data: students, isLoading } = useQuery(
    ["students", { id: session?.user?.id, role: session?.user?.role }],
    listStudents
  );

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
          students={students?.data || []}
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

export const getServerSideProps = withPermission(async (ctx) => {
  return {
    props: {},
  };
}, "PROFESSOR");
