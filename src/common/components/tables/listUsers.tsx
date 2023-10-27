import { formatDateTime } from "@/common/utils/formatDateTime";
import { Box, Button } from "@chakra-ui/react";
import { CheckCircle, WarningCircle, XCircle } from "@phosphor-icons/react";
import { useState } from "react";
import DataTable from "react-data-table-component";
import { ModalMain } from "../modals/ModalMain";

interface IStudentTable {
  data: {
    name: string;
    ra: string;
    isOk: string;
    list_inOut: any[];
    exerciseCreated: any;
  };
}

export function StudentTable({ data }: IStudentTable) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentRow, setCurrentRow] = useState<any>();

  function closeModal() {
    setIsOpen(!isOpen);
  }

  const columns = [
    {
      name: "Nome",
      selector: (row) => row.name,
    },
    {
      name: "RA",
      selector: (row) => row.ra,
    },
    {
      name: "Acertos",
      selector: (row) => row.isOk,
    },
  ];

  function resultExe() {
    if (!currentRow) return <></>;
    const date = new Date(currentRow?.exerciseCreated);
    return (
      <Box style={{ marginTop: "2px" }}>
        <p style={{ padding: "30px 0", fontWeight: "bold" }}>
          Data de Submisão : {formatDateTime(date)}
        </p>
        <Button
          bg="#3182CE"
          onClick={() => window.location.replace(currentRow.url)}
          mb={4}
          color="white"
          type="button"
        >
          Baixar o ficheiro
        </Button>
        <div style={{ width: "50%" }}>
          {currentRow?.list_inOut?.map((item: any, i: number) => {
            return (
              <div
                key={i}
                style={{
                  margin: "10px 0",
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
    );
  }
  function setContent(r: any) {
    setCurrentRow({
      exerciseName: r.exerciseName,
      exerciseCreated: r.exerciseCreated,
      list_inOut: r.list_inOut,
      url: r.url,
    });
    closeModal();
  }

  return (
    <>
      <ModalMain
        isOpen={isOpen}
        onClose={closeModal}
        modalProps={{
          content: resultExe(),
          title: currentRow?.exerciseName,
        }}
      />
      <DataTable columns={columns} data={data} onRowClicked={setContent} />
    </>
  );
}
