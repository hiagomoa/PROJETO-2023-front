import { Container } from "@/common/components/layout/Container";
import { LayoutAdm } from "@/common/components/layout/Layout";
import { ModalDelete } from "@/common/components/modals/ModalDelete";
import { ModalProfessor } from "@/common/components/modals/ModalProfessor";
import ListProfessor from "@/common/components/tables/ListProfessor";
import { deleteProf, listProfs } from "@/common/services/database/professor";
import { queryClient } from "@/common/services/queryClient";
import { withPermission } from "@/common/utils/withPermission";
import {
  Box,
} from "@chakra-ui/react";
import { useRef } from "react";
import { useMutation, useQuery } from "react-query";

const Adm = () => {
  const deleteProfessor = useMutation(deleteProf);
  const { data: profs, isLoading } = useQuery("prof", listProfs);
  const modalprof = useRef();
  const modaldelete = useRef();

  const handleDeleteConfirmation = (profId) => {
    modaldelete?.current.open(
      "Tem certeza de que deseja excluir este professor?",
      async () => {
        await deleteProfessor.mutateAsync(profId);
        queryClient.invalidateQueries("prof");
      }
    );
  };

  const handleEditClick = (profId) => {
    modalprof.current.onOpen(profId);
  };

  return (
    <LayoutAdm>
      <Box mt={10}>
        <Container>
          <ListProfessor
            professors={profs?.data || []}
            handleDeleteConfirmation={handleDeleteConfirmation}
            handleEditClick={handleEditClick}
          />
        </Container>
      </Box>
      <ModalProfessor ref={modalprof} />
      <ModalDelete ref={modaldelete} />
    </LayoutAdm>
  );
};
export default Adm;

export const getServerSideProps = withPermission(async (ctx) => {
  return {
    props: {},
  };
}, "ADMIN");
