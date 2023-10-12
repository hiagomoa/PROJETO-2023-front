import { FormMultiSelect } from "@/common/components/inputs/FormMultiSelect";
import { Container } from "@/common/components/layout/Container";
import { LayoutAlunos } from "@/common/components/layout/Layout";
import ListExercises from "@/common/components/tables/ListExercise";
import { listClass } from "@/common/services/database/class";
import { listExercises } from "@/common/services/database/exercicio";
import { withPermission } from "@/common/utils/withPermission";
import { Box, Flex, Grid, GridItem, Text } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useQuery } from "react-query";
import * as yup from "yup";

const schema = yup
  .object({
    classId: yup.object().required("Campo obrigatório"),
  })
  .required();

const Alunos = () => {
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

  const { data: session } = useSession();
  const [selectedClassId, setSelectedClassId] = useState(null);
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
    <>
      <LayoutAlunos>
        <Container>
          <Box my={5}>
            <Flex justify="space-between" my={10}>
              <Text color="#313B6D" fontWeight="bold" fontSize="3xl">
                EXERCÍCIOS PENDENTES
              </Text>
              {/* <Text color="#313B6D" fontWeight="bold" fontSize="3xl">
                EXERCÍCIOS ATRASADOS
              </Text>
              <Text color="#313B6D" fontWeight="bold" fontSize="3xl">
                EXERCÍCIOS CONCLUIDOS
              </Text> */}
              <Box>
                <Controller
                  name="classId"
                  control={control}
                  render={({ field }) => (
                    <FormMultiSelect
                      {...field}
                      required
                      placeholder="Turma"
                      options={[
                        { id: null, name: "Todas as Turmas" },
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
            </Flex>
          </Box>
          <ListExercises exercises={exercise?.data} />
        </Container>
      </LayoutAlunos>
    </>
  );
};
export default Alunos;

export const getServerSideProps = withPermission(async (ctx) => {
  return {
    props: {},
  };
}, "STUDENT");
