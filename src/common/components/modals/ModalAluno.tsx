import {
  Box,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { forwardRef, useImperativeHandle } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FormInput } from "../inputs/FormInput";
import { toast } from "react-toastify";
import { useMutation, useQuery } from "react-query";

import { useSession } from "next-auth/react";
import { queryClient } from "@/common/services/queryClient";
import {
  createStudent,
  getStudentById,
  updateStudent,
} from "@/common/services/database/student";
import { FormMultiSelect } from "../inputs/FormMultiSelect";
import { listClass } from "@/common/services/database/class";

const schema = yup
  .object({
    ra: yup.string().required("Campo obrigatório"),
    password: yup.string().required("Campo obrigatório"),
    name: yup.string().required("Campo obrigatório"),
    email: yup.string().email("E-mail inválido").required("Campo obrigatório"),
    classId: yup.object().required("Campo obrigatório"),
  })
  .required();

const ModalBase = ({}, ref) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const getById = useMutation(getStudentById);
  const create = useMutation(createStudent);
  const updated = useMutation(updateStudent);

  const { data: session } = useSession();
  const { data: classes } = useQuery(
    ["classes", { id: session?.user?.id, role: session?.user?.role }],
    listClass
  );
  const {
    control,
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    const newData = { ...data, classId: data.classId.id };

    if (newData.id) {
      await updated.mutateAsync(newData, {
        onSuccess: () => {
          toast.success("Aluno atualizado com sucesso!");
          queryClient.invalidateQueries(["students"]);
        },
      });
    } else {
      newData.professorId = session?.user.id;
      await create.mutateAsync(newData, {
        onSuccess: () => {
          toast.success("Aluno cadastrado com sucesso!");
          queryClient.invalidateQueries(["students"]);
          onClose();
        },
        onError: (error) => {
          toast.error(error);
          queryClient.invalidateQueries(["students"]);
        },
      });
    }
  };

  useImperativeHandle(ref, () => ({
    onOpen: async (id = null) => {
      reset({});
      if (id) {
        await getById.mutateAsync(id, {
          onSuccess: (data) => {
            reset(data);
            onOpen();
          },
        });
      } else {
        onOpen();
      }
    },
  }));

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent minW="60%">
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader color="#313B6D">
            {watch("id") ? "Atualizar Aluno" : "Novo Aluno"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box display="grid" gap={5}>
              <FormInput placeholder="RA" {...register("ra")} />
              <FormInput placeholder="Nome" {...register("name")} />
              <FormInput placeholder="Email" {...register("email")} />
              <FormInput
                placeholder="Senha"
                {...register("password")}
                type="password"
              />
              <Controller
                name="classId"
                control={control}
                render={({ field }) => (
                  <FormMultiSelect
                    {...field}
                    required
                    placeholder="Turma"
                    options={classes.data}
                    getOptionValue={(option: any) => option.id}
                    getOptionLabel={(option: any) => option.name}
                    error={errors.classId?.message}
                  />
                )}
              />
            </Box>
          </ModalBody>

          <ModalFooter>
            <Flex w="100%" justifyContent="flex-end" gap={5}>
              <Button
                mr={3}
                variant="ghost"
                border="1px"
                borderColor="blackAlpha.300"
                onClick={onClose}
              >
                Cancelar
              </Button>
              <Button bg="#3182CE" color="white" type="submit">
                {watch("id") ? "Atualizar" : "Cadastrar"}
              </Button>
            </Flex>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export const ModalAluno = forwardRef(ModalBase);
