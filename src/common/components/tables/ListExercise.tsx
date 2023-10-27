import { API_HOST } from "@/common/utils/config";
import { formatDateTime } from "@/common/utils/formatDateTime";
import { Exercise, ProfessorContext } from "@/context/professor.context";
import { Box, Button, Grid, GridItem, Input, Text } from "@chakra-ui/react";
import { CheckCircle, WarningCircle, XCircle } from "@phosphor-icons/react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useContext, useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { FormEditorHtml } from "../inputs/FormEditorHtml";
import { ModalMain } from "../modals/ModalMain";
import { CardExercicios } from "../professor/CardExercicios";
import { StudentTable } from "./listUsers";
interface IProps {
  exCurrent: any;
  outPutEx?: any;
}
const ListExercises = ({ exercises, scope = "student" }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState(null);
  const { data: session } = useSession();
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

  const refSelected = useRef<Exercise>(null);

  function updateModal(exercise?: any) {
    setIsOpen(!isOpen);
    if (exercise && scope == "student") {
      // @ts-ignore
      axios
        .post(`${API_HOST}/answer/out-put`, {
          studentId: session?.user?.id,
          exerciseId: exercise.id,
        })
        .then((r) => {
          const { data } = r;
          setProps({
            ...props,
            exCurrent: {
              html: exercise.html,
              title: exercise.name,
              expectedDate: new Date(exercise.dueDate),
              tryIt: Number(data.testNumber || 0),
              maxAttempts: exercise.maxAttempts,
              id: exercise.id,
            },
            outPutEx: data,
          });
        })
        .catch((error) => {
          setProps({
            ...props,
            exCurrent: {
              html: exercise.html,
              title: exercise.name,
              expectedDate: new Date(exercise.dueDate),
              tryIt: 0,
              maxAttempts: exercise.maxAttempts,
              id: exercise.id,
            },
            outPutEx: null,
          });
          console.log(error.message);
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

  useEffect(() => {
    console.log(exercises);
  }, [exercises]);

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
          `${API_HOST}/upload?entity=studentAnswer&studentId=${session?.user?.id}&exerciseId=${props?.exCurrent?.id}`,
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
    if (scope == "prof" && props?.exCurrent) {
      const date = new Date(props.exCurrent[0].endDate);
      return (
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
            <span> Data de finalização {formatDateTime(date)} </span>
          </div>

          <Box>
            <StudentTable data={props?.exCurrent} />
          </Box>
        </Box>
      );
    }
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
                {props.exCurrent.maxAttempts - props.exCurrent.tryIt}
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
                  accept=".py, .out"
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
            </div>

            {props?.outPutEx?.length >= 1 ? (
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
                        {`Test ${Number(item.testNumber)}`}
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
            ) : (
              <></>
            )}
          </Box>
        ) : (
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
        )}
      </>
    );
  }

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
      <Grid templateColumns={{ md: "repeat(3, 1fr)" }} gap={10}>
        {exercises?.map((exercise: Exercise, key: number) => (
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
              myClass={exercise?.className}
            />
          </GridItem>
        ))}
      </Grid>
    </>
  );
};

export default ListExercises;
