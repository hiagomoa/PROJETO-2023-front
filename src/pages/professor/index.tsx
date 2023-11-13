import { FormMultiSelect } from "@/common/components/inputs/FormMultiSelect";
import { Container } from "@/common/components/layout/Container";
import { LayoutProfessor } from "@/common/components/layout/Layout";
import { ModalExercicio } from "@/common/components/modals/ModalExercicio";
import ListExercises from "@/common/components/tables/ListExercise";
import { listClass } from "@/common/services/database/class";
import { listExercises } from "@/common/services/database/exercicio";
import { API_HOST } from "@/common/utils/config";
import { AuthContext } from "@/context/auth.context";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useContext, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useQuery } from "react-query";
import * as yup from "yup";

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
  const { user } = useContext(AuthContext);
  const { data: classes } = useQuery(
    ["classes", { id: user?.id, role: user?.role }],
    listClass
  );

  const { data: exercise } = useQuery(
    [
      "exercise",
      {
        classId: selectedClassId !== null ? selectedClassId : null,
        id: user?.id,
        role: user?.role,
      },
    ],
    listExercises
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
                      ...(classes || []),
                    ]}
                    getOptionValue={(option: any) => option.id}
                    getOptionLabel={(option: any) => option.name}
                    error={errors.classId?.message}
                    onChange={(selectedOption) =>
                      handleSelect(selectedOption.id)
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

          <ListExercises scope="prof" data={exercise} />
        </Box>
      </Container>
      <ModalExercicio ref={modalexercicio} />
    </LayoutProfessor>
  );
};
export default Professor;
