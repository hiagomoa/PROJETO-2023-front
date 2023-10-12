import { Box, Flex } from "@chakra-ui/react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const FormEditor = ({ value, onChange }) => {
  return (
    <>
      <ReactQuill value={value} onChange={onChange} style={{wordBreak: "break-all"}}  />
    </>
  );
};

export default FormEditor;
