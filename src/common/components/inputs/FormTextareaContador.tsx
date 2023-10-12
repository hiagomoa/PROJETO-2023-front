import React, { useEffect, useState } from "react";
import { FormTextarea } from "./FormTextarea";
import { Text } from "@chakra-ui/react";

const TextareaContadorCaracteres = ({
  pergunta,
  register2,
  resetText,
  errors,
}) => {
  const [texto, setTexto] = useState("");

  const handleChange = (event) => {
    const novoTexto = event.target.value;
    setTexto(novoTexto);
  };

  useEffect(() => {
    setTexto("");
  }, [resetText]);

  return (
    <>
      <FormTextarea
        label={pergunta.label}
        placeholder={pergunta.placeholder}
        {...register2(String(pergunta.id), {
          required: "Campo obrigatório",
          maxLength: {
            value: 500,
            message: "Limite máximo de 500 caracteres",
          },
        })}
        maxLength={500}
        value={texto}
        onChange={handleChange}
        error={errors[pergunta.id]?.message}
      />
      <p>{texto.length} caracteres digitados</p>

      <Text color="gray.500">{pergunta.msgbottom}</Text>
    </>
  );
};

export default TextareaContadorCaracteres;
