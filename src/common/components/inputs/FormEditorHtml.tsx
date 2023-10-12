import { useState } from "react";
import {
  Box,
  FormControl,
  FormErrorIcon,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  InputGroup,
  InputLeftAddon,
  InputLeftElement,
  InputRightAddon,
  InputRightElement,
} from "@chakra-ui/react";
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

export const FormEditorHtml = ({
  label,
  placeholder,
  description,
  error,
  required,
  leftAddon,
  rightAddon,
  leftElement,
  rightElement,
  defaultValue,
  ...rest
}: any) => {
  const [content, setContent] = useState(defaultValue || "");

  const handleChange = (value: any) => {
    setContent(value);
  };

  const formats = [
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "color",
    "background",
    "align",
    "list",
    "small",
    "large",
  ];

  const sizeOptions = {
    small: {
      label: "Pequeno",
      value: false,
    },
    large: {
      label: "Grande",
      value: "2em",
    },
  };
  
  const modules = {
    toolbar: {
      container: [
        [{ font: [] }],
        [{ size: ["small", false, "large", "huge"] }],
        ["bold", "italic", "underline"],
        [{ color: [] }, { background: [] }],
        [{ align: [] }],
        [{ list: "ordered" }, { list: "bullet" }],
        ["clean"],
      ],
    },
  };

  // Defina as traduções para a opção `size` em `formats`
  const sizeTranslations = {
    small: "Pequeno",
    large: "Grande",
    huge: "Enorme",
  };

  return (
    <FormControl isInvalid={error} isRequired={required}>
      {label && <FormLabel>{label}</FormLabel>}
      <InputGroup>
        {leftAddon && (
          <InputLeftAddon p={3} borderRight="none">
            {leftAddon}
          </InputLeftAddon>
        )}
        {leftElement && <InputLeftElement>{leftElement}</InputLeftElement>}
        <Box w='full'>
          <ReactQuill
            value={content}
            onChange={handleChange}
            modules={modules}
            formats={formats}
            placeholder={placeholder}
            {...rest}
          />
        </Box>
        {rightAddon && <InputRightAddon p={0}>{rightAddon}</InputRightAddon>}
        {rightElement && <InputRightElement>{rightElement}</InputRightElement>}
      </InputGroup>
      {description && <FormHelperText>{description}</FormHelperText>}
      {error && (
        <FormErrorMessage>
          <FormErrorIcon /> {error}
        </FormErrorMessage>
      )}
    </FormControl>
  );
};
