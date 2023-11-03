import { FormMultiSelect } from "@/common/components/inputs/FormMultiSelect";
import { Container } from "@/common/components/layout/Container";
import { LayoutAlunos } from "@/common/components/layout/Layout";
import ListExercises from "@/common/components/tables/ListExercise";
import { listClass } from "@/common/services/database/class";
import { listExercises } from "@/common/services/database/exercicio";
import { API_HOST } from "@/common/utils/config";
import { AuthContext } from "@/context/auth.context";
import { Exercise } from "@/context/professor.context";
import { Box, Flex, Text } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useContext, useEffect, useState } from "react";
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

  const { user } = useContext(AuthContext);
  const [selectedClassId, setSelectedClassId] = useState(null);
  const { data: classes } = useQuery(
    ["classes", { id: user?.id, role: user?.role }],
    listClass
  );

  const handleSelect = async (id: string) => {
    await fetch(`${API_HOST}/exercise/${id}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        setSelectedClassId(data.classId);
      });
  };

  const { data: exercise } = useQuery(
    [
      "exercise",
      {
        classId: selectedClassId,
        id: user?.id,
        role: user?.role,
      },
    ],
    listExercises
  );

  const [dueToday, setDueToday] = useState<Exercise[]>();
  const [dueLater, setDueLater] = useState<Exercise[]>();
  const [duePast, setDuePast] = useState<Exercise[]>();

  useEffect(() => {
    const dueToday =
      exercise &&
      exercise?.filter((item: any, i: number) => {
        let dueDate = new Date(item?.dueDate.split(":00.")[0]);
        if (
          dueDate.getMonth() <= new Date().getMonth() &&
          dueDate.getFullYear() <= new Date().getFullYear()
        ) {
          if (
            new Date().getMonth() === dueDate.getMonth() &&
            new Date().getFullYear() === dueDate.getFullYear()
          ) {
            if (dueDate.getDate() < new Date().getDate()) {
              if (item.StudentAnswer && item.StudentAnswer.length === 0) {
                return item;
              }
            }
          }

          if (
            dueDate.getMonth() < new Date().getMonth() &&
            new Date().getFullYear() === dueDate.getFullYear()
          ) {
            return item;
          }
        }
      });

    const dueLater =
      exercise &&
      exercise?.filter((item: any, i: number) => {
        const dueDate = new Date(item?.dueDate.split(":00.")[0]);

        if (
          dueDate.getDate() >= new Date().getDate() &&
          dueDate.getMonth() >= new Date().getMonth() &&
          dueDate.getFullYear() >= new Date().getFullYear()
        ) {
          return item;
        }
      });

    const duePast =
      exercise &&
      exercise?.filter((item: any, i: number) => {
        let dueDate = new Date(item?.dueDate.split(":00.")[0]);
        if (
          dueDate.getMonth() <= new Date().getMonth() &&
          dueDate.getFullYear() <= new Date().getFullYear()
        ) {
          if (dueDate.getDate() <= new Date().getDate()) {
            if (item.StudentAnswer && item.StudentAnswer.length > 0) {
              return item;
            }
          }
        }
      });

    setDueLater(dueLater);
    setDueToday(dueToday);
    setDuePast(duePast);
  }, [exercise]);

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
                        ...(classes || []),
                      ]}
                      getOptionValue={(option: any) => option.id}
                      getOptionLabel={(option: any) => option.name}
                      error={errors.classId?.message}
                      onChange={(selectedOption) => {
                        handleSelect(selectedOption.id);
                      }}
                    />
                  )}
                />
              </Box>
            </Flex>
          </Box>
          {dueLater && <ListExercises status="dueLater" data={dueLater} />}
          <Text
            color="#313B6D"
            mt="4rem"
            mb="2rem"
            fontWeight="bold"
            fontSize="3xl"
          >
            EXERCÍCIOS ATRASADOS
          </Text>
          {dueToday && <ListExercises status="dueToday" data={dueToday} />}
          <Text
            color="#313B6D"
            mt="4rem"
            mb="2rem"
            fontWeight="bold"
            fontSize="3xl"
          >
            EXERCÍCIOS CONCLUIDOS
          </Text>
          {duePast && <ListExercises status="duePast" data={duePast} />}
        </Container>
      </LayoutAlunos>
    </>
  );
};
export default Alunos;
