import { Container } from "@/common/components/layout/Container";
import { LayoutProfessor } from "@/common/components/layout/Layout";
import { Box, Button, Flex, Grid, GridItem, Text } from "@chakra-ui/react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ModalExercicio } from "@/common/components/modals/ModalExercicio";
import { useRef, useState } from "react";
import { withPermission } from "@/common/utils/withPermission";
import { FormMultiSelect } from "@/common/components/inputs/FormMultiSelect";
import { useQuery } from "react-query";
import { listClass } from "@/common/services/database/class";
import { useSession } from "next-auth/react";
import ListExercises from "@/common/components/tables/ListExercise";
import { listExercises } from "@/common/services/database/exercicio";

const schema = yup
  .object({
    classId: yup.object().required("Campo obrigatório"),
  })
  .required();

const Professor = () => {
  const [selectedClassId, setSelectedClassId] = useState(null);

  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const modalexercicio = useRef();
  const { data: session } = useSession();
  const { data: classes } = useQuery(
    ["classes", { id: session?.user?.id, role: session?.user?.role }],
    listClass
  );

  const { data: exercise } = useQuery(
    [
      "exercise",
      {
        classId: selectedClassId,
        id: session?.user?.id,
        role: session?.user?.role,
      },
    ],
    listExercises
  );

  return (
    <LayoutProfessor>
      <Container>
        <Box my={5}>
          <Flex
            display={{ sm: "grid", md: "flex" }}
            justify="space-between"
            my={10}
            gap={5}
          >
            <Box display="grid" gap={5}>
              <Text color="#313B6D" fontWeight="bold" fontSize="3xl">
                EXERCÍCIOS CRIADOS
              </Text>
              <Controller
                name="classId"
                control={control}
                render={({ field }) => (
                  <FormMultiSelect
                    {...field}
                    required
                    placeholder="Turma"
                    options={[
                      { id: null, name: "Todas as Turmas" }, // Opção para limpar o filtro
                      ...(classes?.data || []), 
                    ]}
                    getOptionValue={(option: any) => option.id}
                    getOptionLabel={(option: any) => option.name}
                    error={errors.classId?.message}
                    onChange={(selectedOption) =>
                      setSelectedClassId(selectedOption.id)
                    }
                  />
                )}
              />
            </Box>
            <Button
              bg="blueglobal"
              color="white"
              onClick={() => modalexercicio.current.onOpen()}
            >
              Criar Exercício
            </Button>
          </Flex>

          <ListExercises exercises={exercise?.data} />
        </Box>
      </Container>
      <ModalExercicio ref={modalexercicio} />
    </LayoutProfessor>
  );
};
export default Professor;

export const getServerSideProps = withPermission(async (ctx) => {
  return {
    props: {},
  };
}, "PROFESSOR");
