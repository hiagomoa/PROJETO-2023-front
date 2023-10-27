import { IClass } from "@/common/interfaces/class.interface";
import {
  createClass,
  getClassById,
  updateClass,
} from "@/common/services/database/class";
import { deleteStudent } from "@/common/services/database/student";
import { queryClient } from "@/common/services/queryClient";
import {
  Box,
  Button,
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  UseDisclosureProps,
  useDisclosure,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSession } from "next-auth/react";
import { Ref, forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
import * as yup from "yup";
import { FormInput } from "../inputs/FormInput";
import ListStudents from "../tables/ListStudents";
import { ModalAluno } from "./ModalAluno";
import { ModalDelete } from "./ModalDelete";

const schema = yup
  .object({
    name: yup.string().required("Campo obrigatório"),
  })
  .required();

const ModalBase = ({}, ref: Ref<UseDisclosureProps>) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const getById = useMutation(getClassById);
  const create = useMutation(createClass);
  const updated = useMutation(updateClass);

  const { data: session } = useSession();

  useEffect(() => {
    console.log(ref);
  }, []);

  const {
    control,
    register,
    handleSubmit,
    reset,
    getValues,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<IClass | any>({
    resolver: yupResolver(schema),
  });

  const id = watch("id");
  const onSubmit = async (data) => {
    console.log(data);
    if (data.id) {
      await updated.mutateAsync(data, {
        onSuccess: () => {
          toast.success("Turma atualizada com sucesso!");
          queryClient.invalidateQueries(["classes"]);
        },
      });
    } else {
      data.professorId = session?.user?.id;
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

  // useEffect(() => {
  //   if (id) {
  //   }
  // }, [id]);

  const modalStudent = useRef();
  const modalDelete = useRef();
  const handleDeleteConfirmation = (id) => {
    modalDelete?.current.open(
      "Tem certeza de que deseja excluir está classe?",
      async () => {
        await deleteStudent.mutateAsync(id);
        queryClient.invalidateQueries("classes");
      }
    );
  };

  const handleEditClick = (id: string) => {
    modalStudent.current.onOpen(id);
  };

  if (id) {
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent minW="60%">
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader
              color="#313B6D"
              sx={{
                mt: "1.5rem",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              {id && (
                <Input
                  {...register("name")}
                  maxWidth="40%"
                  type="text"
                  defaultValue={watch("name")}
                  fontWeight="bold"
                  color="#313B6D"
                />
              )}

              {watch("name") === "" && (
                <Text fontWeight="bold" color="#313B6D">
                  Criar Turma
                </Text>
              )}

              <Button
                bg="#3182CE"
                color="white"
                maxWidth="180px"
                onClick={(e) => modalStudent.current.onOpen()}
              >
                Adicionar Aluno
              </Button>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Box>
                <ListStudents
                  students={getValues("students")}
                  handleEditClick={handleEditClick}
                  handleDeleteConfirmation={handleDeleteConfirmation}
                  isOnClassEdit
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
        <ModalAluno classId={id} isOnClassEdit ref={modalStudent} />
        <ModalDelete ref={modalDelete} />
      </Modal>
    );
  }

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
