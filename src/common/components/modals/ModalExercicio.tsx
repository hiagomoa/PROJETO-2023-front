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
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FormInput } from "../inputs/FormInput";
import { FormDate } from "../inputs/FormDate";

import { useMutation, useQuery } from "react-query";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { queryClient } from "@/common/services/queryClient";
import { FormMultiSelect } from "../inputs/FormMultiSelect";
import { listClass } from "@/common/services/database/class";
import dynamic from "next/dynamic";
import { createExercise, getExerciseById, updateExercise } from "@/common/services/database/exercicio";

const schema = yup.object({
  name: yup.string().required("Campo obrigatório"),
  description: yup.string().required("Campo obrigatório"),
  dueDate: yup.date().required("Campo obrigatório").typeError("Data inválida"),
  html: yup.string().required("Campo obrigatório"),
  classId: yup.object().required("Campo obrigatório"),
  maxAttempts: yup.string().required("Campo obrigatório"),
});

const FormEditor = dynamic(() => import("../inputs/FormEditor"), {
  ssr: false, 
});

const ModalBase = ({}, ref) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const getById = useMutation(getExerciseById);
  const create = useMutation(createExercise);
  const updated = useMutation(updateExercise);
  const { data: session } = useSession();
  const { data: classes } = useQuery(
    ["classes", { id: session?.user?.id, role: session?.user?.role }],
    listClass
  );

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    if (data.id) {
      await updated.mutateAsync(data, {
        onSuccess: () => {
          toast.success("Exercício atualizado com sucesso!");
          queryClient.invalidateQueries(["prof"]);
        },
      });
    } else {
      data.classId = data?.classId?.id;
      data.professorId = session?.user?.id;
      await create.mutateAsync(data, {
        onSuccess: () => {
          toast.success("Exercício cadastrado com sucesso!");
          queryClient.invalidateQueries(["prof"]);
          onClose();
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
          <ModalHeader color="#313B6D">Criar Exercício</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box display="grid" gap={5}>
              <Flex gap={5}>
                <FormInput
                  placeholder="Nome"
                  label="Nome"
                  {...register("name")}
                  error={errors.name?.message}
                />

                <FormInput
                  placeholder="Descrição"
                  label="Descrição"
                  {...register("description")}
                  error={errors.description?.message}
                />
              </Flex>
              <Flex gap={5}>
                <Controller
                  name="classId"
                  control={control}
                  render={({ field }) => (
                    <FormMultiSelect
                      {...field}
                      required
                      placeholder="Turma"
                      label="Turma"
                      options={classes?.data}
                      getOptionValue={(option: any) => option.id}
                      getOptionLabel={(option: any) => option.name}
                      error={errors.classId?.message}
                    />
                  )}
                />
                <FormDate
                  placeholder="Data de expiração com hora"
                  label="Data de Entrega"
                  {...register("dueDate")}
                  error={errors.dueDate?.message}
                />
                <FormInput
                  placeholder="Quantidade máx de tentativas"
                  label="Quantidade máx de tentativas"
                  {...register("maxAttempts")}
                  error={errors.maxAttempts?.message}
                />
              </Flex>
              <Box>
                <Controller
                  name="html"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <FormEditor value={field.value} onChange={field.onChange} />
                  )}
                />
              </Box>
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
              <Button bg="blueglobal" color="white" type="submit">
                Finalizar
              </Button>
            </Flex>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export const ModalExercicio = forwardRef(ModalBase);
