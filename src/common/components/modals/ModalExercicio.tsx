import { AuthContext } from "@/context/auth.context";
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
import { yupResolver } from "@hookform/resolvers/yup";
import { PlusCircle, Trash } from "@phosphor-icons/react";
import axios from "axios";
import dynamic from "next/dynamic";
import { forwardRef, useContext, useImperativeHandle, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import * as yup from "yup";
import { listClass } from "../../services/database/class";
import {
  createExercise,
  getExerciseById,
  updateExercise,
} from "../../services/database/exercicio";
import { queryClient } from "../../services/queryClient";
import { API_HOST } from "../../utils/config";
import { FormDate } from "../inputs/FormDate"; // Importe o componente FormDate corretamente
import { FormInput } from "../inputs/FormInput";
import { FormMultiSelect } from "../inputs/FormMultiSelect";

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
  const { user } = useContext(AuthContext);
  const { data: classes } = useQuery(
    ["classes", { id: user?.id, role: user?.role }],
    listClass
  );

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      description: "a",
    },
  });

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

  const [fileBlocks, setFileBlocks] = useState([{}]);
  const [uploadStatus, setUploadStatus] = useState([]);

  const addFileBlock = () => {
    setFileBlocks([...fileBlocks, {}]);
  };

  const removeFileBlock = (index: any) => {
    const updatedBlocks = [...fileBlocks];
    updatedBlocks.splice(index, 1);
    setFileBlocks(updatedBlocks);
  };

  const handleFileChange = (event: any, index: any, fileType: any) => {
    const updatedBlocks: any = [...fileBlocks];
    updatedBlocks[index][fileType] = event.target.files[0];
    setFileBlocks(updatedBlocks);
  };

  const uploadFile = async (index: any, id: string) => {
    const block: any = fileBlocks[index];

    try {
      const formData = new FormData();
      const inName = `${uuidv4()}-${block.inFile.name}`;
      formData.append("file", block.inFile);
      formData.append("name", inName);
      await axios.post(
        `${API_HOST}/upload?entity=exerciseTeacher&entityId=${id}&name=${inName}`,
        formData
      );

      const formData2 = new FormData();
      const outName = `${uuidv4()}-${block.outFile.name}`;
      formData2.append("file", block.outFile);
      formData2.append("name", outName);
      formData2.append("correspondingInFile", inName);

      await axios.post(
        `${API_HOST}/upload?entity=exerciseTeacher&entityId=${id}&name=${outName}`,
        formData2
      );

      const updatedStatus: any = [...uploadStatus];
      updatedStatus[index] = "Upload bem-sucedido";
      setUploadStatus(updatedStatus);
    } catch (error) {
      console.error("Erro de upload:", error);

      const updatedStatus: any = [...uploadStatus];
      updatedStatus[index] = "Erro ao fazer upload";
      setUploadStatus(updatedStatus);
    }
  };

  const onSubmit = async (data: any) => {
    for (var i = 0; i < fileBlocks.length; i++) {
      if (Object.keys(fileBlocks[i]).length === 0) {
        return toast.error("Please add file input ");
      }
    }
    for (const block of fileBlocks) {
      if (!block || (block && !block.inFile) || !block.outFile) {
        toast.error("Please add file input ");
        return;
      }
    }

    if (data.id) {
      await updated.mutateAsync(data, {
        onSuccess: () => {
          toast.success("Exercício atualizado com sucesso!");
          queryClient.invalidateQueries(["prof"]);
        },
      });
    } else {
      data.classId = data?.classId?.id;
      data.professorId = user?.id;

      const result = await create
        .mutateAsync(data, {
          onSuccess: () => {
            toast.success("Exercício cadastrado com sucesso!");
            queryClient.invalidateQueries(["prof"]);
            onClose();
          },
        })
        .then(async (item) => {
          await Promise.all(
            fileBlocks.map(async (f, i) => {
              await uploadFile(i, item.id);
            })
          );
        });
    }
  };
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
                  placeholder="Título"
                  label="Título"
                  {...register("name")}
                  error={errors.name?.message}
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
                      options={classes}
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
              <div>
                {fileBlocks.map((block, index) => (
                  <div key={index}>
                    <Box
                      style={{
                        display: "flex",
                        gap: "10px",
                        position: "relative",
                        margin: "45px 0",
                      }}
                    >
                      <Box
                        width={"50%"}
                        padding={6}
                        border="dashed 2px gray"
                        gap={1}
                        display={"flex"}
                        flexDirection="column"
                      >
                        <input
                          type="file"
                          accept=".in"
                          onChange={(event) =>
                            handleFileChange(event, index, "inFile")
                          }
                        />
                        <span>SELECIONE O ARQUIVO .IN</span>
                      </Box>

                      <Box
                        width={"50%"}
                        padding={6}
                        border="dashed 2px gray"
                        display={"flex"}
                        flexDirection="column"
                        gap={1}
                      >
                        <input
                          type="file"
                          accept=".out"
                          onChange={(event) =>
                            handleFileChange(event, index, "outFile")
                          }
                        />
                        <span>SELECIONE O ARQUIVO .OUT</span>
                      </Box>

                      <div
                        style={{
                          position: "absolute",
                          bottom: -35,
                          right: 0,
                          color: "red",
                          cursor: "pointer",
                        }}
                      >
                        <Trash
                          size={32}
                          onClick={() => removeFileBlock(index)}
                        />
                      </div>
                    </Box>
                  </div>
                ))}
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <PlusCircle
                    size={32}
                    style={{ cursor: "pointer" }}
                    onClick={addFileBlock}
                  />
                </div>
              </div>
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
