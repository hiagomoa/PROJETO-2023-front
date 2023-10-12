import React, { forwardRef, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
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
import { useMutation } from "react-query";
import {
  createProf,
  getProfById,
  updateProf,
} from "@/common/services/database/professor";
import { queryClient } from "@/common/services/queryClient";
import { toast } from "react-toastify";
import { FormInput } from "../inputs/FormInput";
import { useSession } from "next-auth/react";

const schema = yup.object({
  name: yup.string().required("Campo obrigatório"),
  email: yup.string().email("E-mail inválido").required("Campo obrigatório"),
  password: yup.string().required("Campo obrigatório"),
});

const ModalBase = ({}, ref) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const getById = useMutation(getProfById);
  const create = useMutation(createProf);
  const updated = useMutation(updateProf);
  const { data: session } = useSession();

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

  const onSubmit = async (data) => {
    if (data.id) {
      await updated.mutateAsync(data, {
        onSuccess: () => {
          toast.success("Professor atualizado com sucesso!");
          queryClient.invalidateQueries(["prof"]);
        },
      });
    } else {
      data.administratorId = session?.user.id;
      await create.mutateAsync(data, {
        onSuccess: () => {
          toast.success("Professor cadastrado com sucesso!");
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
          <ModalHeader>
            {watch("id") ? "ATUALIZAR PROFESSOR" : "CADASTRO DE PROFESSOR"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box display="grid" gap={5}>
              <FormInput
                label="Nome"
                placeholder="NOME"
                {...register("name")}
                error={errors.name?.message}
              />
              <FormInput
                label="E-mail"
                placeholder="EMAIL"
                {...register("email")}
                error={errors.email?.message}
              />
              <FormInput
                label="Senha"
                placeholder="SENHA"
                {...register("password")}
                error={errors.password?.message}
                type="password"
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

export const ModalProfessor = forwardRef(ModalBase);
