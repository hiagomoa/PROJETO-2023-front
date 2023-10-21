import React, { useState } from "react";
import { Box, Button, Grid, GridItem } from "@chakra-ui/react";
import { CardExercicios } from "../professor/CardExercicios";
import { formatDateTime } from "@/common/utils/formatDateTime";
import { ModalMain } from "../modals/ModalMain";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { CheckCircle, WarningCircle, XCircle } from "@phosphor-icons/react";
import { useSession } from "next-auth/react";
interface IProps {
  exCurrent: any;
  outPutEx?: any;
}
const ListExercises = ({ exercises }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState(null);
  const { data: session } = useSession();
  const [props, setProps] = useState<IProps>();
  function updateModal(exercise?: any) {
    setIsOpen(!isOpen);
    if (exercise) {
      axios
        .post("http://localhost:3001/answer/out-put", {
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
            outPutEx : null
          });
          console.log(error.message);
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
        await axios.post(
          `http://localhost:3001/upload?entity=studentAnswer&studentId=${session?.user?.id}&exerciseId=${props?.exCurrent?.id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setIsOpen(!isOpen);
        toast.info("Arquivo enviado com sucesso!");
      } catch (error) {
        toast.info("Erro ao enviar o arquivo");
        console.error(error);
      }
    } else {
      toast.info("Selecione um arquivo para enviar.");
    }
  };

  function MyModal() {
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

            {props.outPutEx ? (
              <Box style={{ marginTop: "2px" }}>
                <p style={{ paddingBottom: "8px", fontWeight: "bold" }}>
                  Resultado após as execuções
                </p>
                <div style={{ width: "50%" }}>
                  <div
                    style={{
                      width: "100",
                      background: "#fff",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "2px",
                      borderRadius: "4px",
                      border: "2px solid gray",
                    }}
                  >
                    {" "}
                    {`Test ${Number(props.outPutEx.testNumber)}`}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {" "}
                      <span>{props.outPutEx.answer}</span>{" "}
                      {props.outPutEx.answer == "OK" ? (
                        <CheckCircle size={22} color="#33ba21" />
                      ) : props.outPutEx.answer == "FALHOU" ? (
                        <XCircle size={22} color="#ef531f" />
                      ) : (
                        <WarningCircle size={22} color="#efcd1f" />
                      )}
                    </div>
                  </div>
                </div>
              </Box>
            ) : (
              <></>
            )}
          </Box>
        ) : (
          <></>
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
        {exercises?.map((exercise: any, key: number) => (
          <GridItem
            key={key}
            onClick={() => updateModal(exercise)}
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
