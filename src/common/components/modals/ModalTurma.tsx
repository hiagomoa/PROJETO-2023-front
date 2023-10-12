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
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FormInput } from "../inputs/FormInput";
import { toast } from "react-toastify";
import { useMutation } from "react-query";
import {
  createClass,
  getClassById,
  updateClass,
} from "@/common/services/database/class";
import { useSession } from "next-auth/react";
import { queryClient } from "@/common/services/queryClient";

const schema = yup
  .object({
    name: yup.string().required("Campo obrigatório"),
  })
  .required();

const ModalBase = ({}, ref) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const getById = useMutation(getClassById);
  const create = useMutation(createClass);
  const updated = useMutation(updateClass);

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
          toast.success("Turma atualizada com sucesso!");
          queryClient.invalidateQueries(["classes"]);
        },
      });
    } else {
      data.professorId = session?.user.id;
      await create.mutateAsync(data, {
        onSuccess: () => {
          toast.success("Turma cadastrada com sucesso!");
          queryClient.invalidateQueries(["classes"]);
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
          <ModalHeader color="#313B6D">
            {watch("id") ? "Atualizar Turma" : "Criar Turma"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box display="grid" gap={5}>
              <Flex gap={5}>
                <FormInput placeholder="Nome" {...register("name")} />
              </Flex>
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

export const ModalTurma = forwardRef(ModalBase);
