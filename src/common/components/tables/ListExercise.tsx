import { AuthContext } from "@/context/auth.context";
import { Box, Button, Grid, GridItem, Input, Text } from "@chakra-ui/react";
import { CheckCircle, WarningCircle, XCircle } from "@phosphor-icons/react";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Exercise, ProfessorContext } from "../../../context/professor.context";
import { API_HOST } from "../../utils/config";
import { formatDateTime } from "../../utils/formatDateTime";
import { FormEditorHtml } from "../inputs/FormEditorHtml";
import { ModalMain } from "../modals/ModalMain";
import { CardExercicios } from "../professor/CardExercicios";
import { StudentTable } from "./listUsers";
export interface IProps {
  exCurrent: any;
  outPutEx?: any;
}
const ListExercises = ({
  exercises,
  scope = "student",
  data,
  status,
}: {
  data: Exercise[];
  scope?: string;
  exercises?: any;
  status?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const { user } = useContext(AuthContext);
  const [props, setProps] = useState<IProps>();
  const {
    handleSelectExercise,
    selectedExercise,
    editExerciseDescription,
    setEditExerciseDescription,
    editDateExercise,
    editHtmlExercise,
    editMaxAttempts,
    setEditDateExercise,
    setEditHtmlExercise,
    setEditMaxAttempts,
    updateExercise,
  } = useContext(ProfessorContext);

  function updateModal(exercise?: any) {
    setIsOpen(!isOpen);
    if (exercise && scope == "student") {
      // @ts-ignore
      axios
        .post(`${API_HOST}/answer/out-put`, {
          studentId: user?.id,
          exerciseId: exercise.id,
        })
        .then((r) => {
          setProps({
            ...props,
            exCurrent: {
              html: exercise.html,
              title: exercise.name,
              expectedDate: new Date(exercise.dueDate),
              maxAttempts: exercise.maxAttempts,
              id: exercise.id,
              attempts: r.data.attempts || 0,
            },
            outPutEx: r.data.inOut,
          });
        })
        .catch((error) => {
          setProps({
            ...props,
            exCurrent: {
              html: exercise.html,
              title: exercise.name,
              expectedDate: new Date(exercise.dueDate),
              attempts: 0,
              maxAttempts: exercise.maxAttempts,
              id: exercise.id,
            },
            outPutEx: null,
          });
        });
    } else if (exercise) {
      axios
        .get(`${API_HOST}/exercise/get-users-by-exc/${exercise.id}`)
        .then((item: any) => {
          if (item.data.length >= 1) {
            const r = item.data.map((i: any) => {
              return {
                name: i.student.name,
                ra: i.student.ra,
                isOk: `${i.totalAnswersOk}/${item.data.length}`,
                endDate: exercise.dueDate,
                list_inOut: i.list_inOut,
                maxAttempts: exercise.maxAttempts,

                exerciseCreated: exercise.created_at,
                exerciseName: exercise.name,
                url: i.answer,
              };
            });
            setProps({ ...props, exCurrent: r });
          } else {
            setProps({ ...props, exCurrent: null });
          }
        });
    }
  }

  const handleFileChange = (e: any) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        // @ts-ignore
        await axios.post(
          `${API_HOST}/upload?entity=studentAnswer&studentId=${user?.id}&exerciseId=${props?.exCurrent?.id}&name=${file.name}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        toast.info("Arquivo enviado com sucesso!");
        setIsOpen(false);
      } catch (error) {
        toast.info("Erro ao enviar o arquivo");
        console.error(error);
      }
    } else {
      toast.info("Selecione um arquivo para enviar.");
    }
  };

  const [value, setValue] = useState("");

  function MyModal() {
    if (
      scope == "prof" &&
      props?.exCurrent &&
      new Date(props.exCurrent[0].endDate.split(":00.")[0]) < new Date()
    ) {
      const date = new Date(props.exCurrent[0].endDate);

      return (
        <Box>
          <Text fontWeight="bold" mb="1.5rem" color="#313B6D">
            {props.exCurrent[0].exerciseName}
          </Text>
          <div
            style={{
              fontWeight: "bold",
              fontSize: "14px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span> Data de finalização {formatDateTime(date)} </span>
          </div>

          <Box>
            <StudentTable data={props?.exCurrent} />
          </Box>
        </Box>
      );
    } else if (
      scope == "prof" &&
      props?.exCurrent &&
      new Date(props.exCurrent[0].endDate.split(":00.")[0]) > new Date()
    ) {
      const date = new Date(props.exCurrent[0].endDate);

      return (
        <>
          <Box
            sx={{
              display: "flex",
              gap: "1.5rem",
              flexDirection: "column",
            }}
          >
            <Box
              sx={{
                display: "flex",
                mt: "0px",
                alignItems: "center",
                justifyContent: "space-between",
              }}
              flexDirection="row"
            >
              <Text fontWeight="bold" color="#313B6D">
                Editar exercicio
              </Text>

              <Box sx={{ display: "flex", gap: "1.5rem" }}>
                <Button bg="#3182CE" color="white" maxWidth="180px">
                  Executar verificacao
                </Button>
                <Button
                  bg="#3182CE"
                  color="white"
                  onClick={(e) => updateExercise()}
                  maxWidth="180px"
                >
                  Salvar
                </Button>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mt: "1.5rem",
              }}
            >
              <Input
                type="datetime-local"
                value={editDateExercise}
                onChange={(e) => setEditDateExercise(e.target.value)}
                maxW="17rem"
              />
              <Input
                type="number"
                defaultValue={editMaxAttempts}
                onChange={(e) => setEditMaxAttempts(Number(e.target.value))}
                maxW="17rem"
              />
            </Box>
            <Input
              value={editExerciseDescription}
              onChange={(e) => setEditExerciseDescription(e.target.value)}
              placeholder="Assunto"
            />
            <Box h="30rem" boxSizing="border-box">
              <FormEditorHtml
                value={editHtmlExercise}
                onChange={(e: any) => setEditHtmlExercise(e)}
              />
            </Box>
          </Box>
          <Text fontWeight="bold" color="#313B6D" mb="1.5rem">
            Alunos que realizaram
          </Text>
          <StudentTable data={props.exCurrent} />
        </>
      );
    } else if (
      scope == "prof" &&
      !props?.exCurrent &&
      new Date(editDateExercise!) < new Date()
    ) {
      return (
        <Box
          sx={{
            display: "flex",
            width: "100%",
            minHeight: "600px",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text fontWeight="bold" color="#313B6D">
            EXERCICIO FINALIZADO E SEM PENDENCIAS DE CORRECAO!
          </Text>
        </Box>
      );
    }

    //   if (
    //     scope == "prof" &&
    //     props?.exCurrent &&
    //     new Date(props.exCurrent[0].endDate.split(":00.")[0]) > new Date()
    //   ) {
    //     return (
    //       <div style={{ width: "50px", height: "50px", background: "red" }}>
    //         1 na conta
    //       </div>
    //     );
    //   }

    // if (
    //   scope == "prof" &&
    //   props?.exCurrent &&
    //   selectedExercise &&
    //   new Date(selectedExercise.dueDate) > new Date()
    // ) {
    //   return <>123</>;
    // }

    return (
      <>
        {props?.exCurrent ? (
          <Box>
            <div
              style={{
                fontWeight: "bold",
                fontSize: "14px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>
                Data de Entrega {formatDateTime(props.exCurrent.expectedDate)}
              </span>
              <span>
                Tentativas Restantes{" "}
                {props.exCurrent.maxAttempts - props.exCurrent.attempts >= 0
                  ? props.exCurrent.maxAttempts - props.exCurrent.attempts
                  : "0"}
              </span>
            </div>
            <div
              style={{
                padding: "10px",
                marginBottom: "10px",
                width: "100%",
                height: "auto",
                overflowX: "auto",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  textAlign: "left",
                  width: "100%",
                  background: "#fff",
                  padding: "15px",
                }}
                dangerouslySetInnerHTML={{ __html: props.exCurrent.html }}
              ></div>

              {status &&
                status === "dueLater" &&
                props.exCurrent.maxAttempts && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: "10px 0",
                      margin: "10px 0 ",
                      width: "100%",
                      background: "#fff",
                    }}
                  >
                    <input
                      type="file"
                      accept=".py, .out, .in"
                      onChange={handleFileChange}
                    />
                    <Button
                      bg="#3182CE"
                      mt={3}
                      color="white"
                      onClick={handleUpload}
                      maxWidth="180px"
                    >
                      Enviar Arquivo
                    </Button>
                  </div>
                )}
            </div>

            {props?.outPutEx?.length >= 1 && (
              <Box style={{ marginTop: "2px" }}>
                <p style={{ paddingBottom: "8px", fontWeight: "bold" }}>
                  Resultado após as execuções
                </p>
                <div style={{ width: "50%" }}>
                  {props.outPutEx?.map((item: any, i: number) => {
                    return (
                      <div
                        key={i}
                        style={{
                          width: "100",
                          background: "#fff",
                          margin: "10px 0",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "2px",
                          borderRadius: "4px",
                          border: "2px solid gray",
                        }}
                      >
                        {" "}
                        {item.testNumber}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {" "}
                          <span>{item.answer}</span>{" "}
                          {item.answer == "OK" ? (
                            <CheckCircle size={22} color="#33ba21" />
                          ) : item.answer == "FALHOU" ? (
                            <XCircle size={22} color="#ef531f" />
                          ) : (
                            <WarningCircle size={22} color="#efcd1f" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Box>
            )}
          </Box>
        ) : (
          new Date(editDateExercise || "") > new Date() && (
            <Box
              sx={{
                display: "flex",
                gap: "1.5rem",
                flexDirection: "column",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  mt: "0px",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
                flexDirection="row"
              >
                <Text fontWeight="bold" color="#313B6D">
                  Editar exercicio
                </Text>

                <Box sx={{ display: "flex", gap: "1.5rem" }}>
                  <Button bg="#3182CE" color="white" maxWidth="180px">
                    Executar verificacao
                  </Button>
                  <Button
                    bg="#3182CE"
                    color="white"
                    onClick={(e) => updateExercise()}
                    maxWidth="180px"
                  >
                    Salvar
                  </Button>
                </Box>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mt: "1.5rem",
                }}
              >
                <Input
                  type="datetime-local"
                  value={editDateExercise}
                  onChange={(e) => setEditDateExercise(e.target.value)}
                  maxW="17rem"
                />
                <Input
                  type="number"
                  defaultValue={editMaxAttempts}
                  onChange={(e) => setEditMaxAttempts(Number(e.target.value))}
                  maxW="17rem"
                />
              </Box>
              <Input
                value={editExerciseDescription}
                onChange={(e) => setEditExerciseDescription(e.target.value)}
                placeholder="Assunto"
              />
              <Box h="30rem" boxSizing="border-box">
                <FormEditorHtml
                  value={editHtmlExercise}
                  onChange={(e: any) => setEditHtmlExercise(e)}
                />
              </Box>
            </Box>
          )
        )}
      </>
    );
  }
  useEffect(() => {}, [data]);

  return (
    <>
      <ToastContainer />
      <ModalMain
        isOpen={isOpen}
        onClose={() => updateModal()}
        modalProps={{
          content: MyModal(),

          title: props?.exCurrent?.title,
        }}
      />

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
        }}
      >
        <Grid templateColumns={{ md: "repeat(3, 1fr)" }} gap={10}>
          {data?.length === 0 && <Text>Nenhum exercício encontrado</Text>}
          {data &&
            data?.map((exercise: Exercise, key: number) => (
              <GridItem
                key={key}
                onClick={() => {
                  handleSelectExercise(exercise), updateModal(exercise);
                }}
                style={{ cursor: "pointer" }}
              >
                <CardExercicios
                  name={exercise?.name}
                  description={exercise?.description}
                  date={formatDateTime(new Date(exercise?.dueDate))}
                  maxAttempts={exercise?.maxAttempts}
                  myClass={exercise?.class.name}
                />
              </GridItem>
            ))}
        </Grid>
      </Box>
    </>
  );
};

export default ListExercises;
