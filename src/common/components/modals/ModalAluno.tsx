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
  UseDisclosureProps,
  useDisclosure,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Ref, forwardRef, useContext, useImperativeHandle } from "react";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import { toast } from "react-toastify";
import * as yup from "yup";
import { FormInput } from "../inputs/FormInput";

import { listClass } from "@/common/services/database/class";
import {
  createStudent,
  getStudentById,
  updateStudent,
} from "@/common/services/database/student";
import { queryClient } from "@/common/services/queryClient";
import { AuthContext } from "@/context/auth.context";
import { FormMultiSelect } from "../inputs/FormMultiSelect";

const schema = yup
  .object({
    ra: yup.string().required("Campo obrigatório"),
    name: yup.string().required("Campo obrigatório"),
    email: yup.string().email("E-mail inválido").required("Campo obrigatório"),
    classId: yup.object().required("Campo obrigatório"),
  })
  .required();

const ModalBase = (
  { classId, isOnClassEdit }: { classId?: string; isOnClassEdit?: boolean },
  ref: Ref<UseDisclosureProps>
) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const getById = useMutation(getStudentById);
  const create = useMutation(createStudent);
  const updated = useMutation(updateStudent);

  const { user } = useContext(AuthContext);
  const { data: classes } = useQuery(
    ["classes", { id: user?.id, role: user?.role }],
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
      newData.professorId = user.id;
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

              <Controller
                name="classId"
                defaultValue={
                  classId && isOnClassEdit
                    ? classes.find((option) => option.id === classId)
                    : undefined
                }
                control={control}
                render={({ field }) => (
                  <FormMultiSelect
                    {...field}
                    required
                    placeholder="Turma"
                    options={classes}
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
