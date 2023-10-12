import { Container } from "@/common/components/layout/Container";
import { LayoutProfessor } from "@/common/components/layout/Layout";
import { ModalDelete } from "@/common/components/modals/ModalDelete";
import { ModalTurma } from "@/common/components/modals/ModalTurma";
import ListClass from "@/common/components/tables/ListClass";
import { deleteClass, listClass } from "@/common/services/database/class";
import { queryClient } from "@/common/services/queryClient";
import { withPermission } from "@/common/utils/withPermission";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useRef } from "react";
import { useMutation, useQuery } from "react-query";

const Turmas = () => {
  const modalturmas = useRef();
  const modaldelete = useRef();
  const deleteClasses = useMutation(deleteClass);

  const { data: session } = useSession();
  const { data: classes, isLoading } = useQuery(
    ["classes", { id: session?.user?.id, role: session?.user?.role }],
    listClass
  );

  const handleDeleteConfirmation = (id) => {
    modaldelete?.current.open(
      "Tem certeza de que deseja excluir está classe?",
      async () => {
        await deleteClasses.mutateAsync(id);
        queryClient.invalidateQueries("classes");
      }
    );
  };

  const handleEditClick = (id) => {
    modalturmas.current.onOpen(id);
  };

  return (
    <LayoutProfessor>
      <Container>
        <Box my={5}>
          <Flex justify="space-between" my={10}>
            <Text color="#313B6D" fontWeight="bold" fontSize="3xl">
              TURMAS CRIADAS
            </Text>
            <Button
              bg="blueglobal"
              color="white"
              onClick={() => modalturmas.current.onOpen()}
            >
              Cadastrar Turma
            </Button>
          </Flex>
        </Box>
        <ListClass
          classes={classes?.data}
          handleDeleteConfirmation={handleDeleteConfirmation}
          handleEditClick={handleEditClick}
        />
      </Container>
      <ModalTurma ref={modalturmas} />
      <ModalDelete ref={modaldelete} />
    </LayoutProfessor>
  );
};
export default Turmas;

export const getServerSideProps = withPermission(async (ctx) => {
  return {
    props: {},
  };
}, "PROFESSOR");
