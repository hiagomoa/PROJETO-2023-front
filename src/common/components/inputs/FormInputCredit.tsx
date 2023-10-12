import React, { useState } from "react";
import {
  Box,
  Input,
  InputGroup,
  InputRightElement,
  FormLabel,
  FormErrorMessage,
  FormErrorIcon,
  Text,
  FormControl,
  Flex,
} from "@chakra-ui/react";
import creditCardType from "credit-card-type";
import { BsCreditCard2Back } from "react-icons/bs";
import {
  FaCcVisa,
  FaCcMastercard,
  FaCcAmex,
  FaCcDiscover,
  FaExclamationCircle,
} from "react-icons/fa";
import InputMask from "react-input-mask";

const CardFlagInput = ({ cardNumber, onCardNumberChange, errors }) => {
  const [cardFlag, setCardFlag] = useState("");

  const handleCardNumberChange = (event) => {
    const { value } = event.target;
    const numericValue = value.replace(/\D/g, ""); // Remove caracteres não numéricos

    if (numericValue.length <= 16) {
      const cardNumberWithoutSpaces = numericValue.replace(/\s/g, ""); // Remove espaços
      // Verifica o comprimento máximo do número do cartão
      onCardNumberChange({
        ...event,
        target: {
          ...event.target,
          value: cardNumberWithoutSpaces,
        },
      }); // Chama a função onCardNumberChange passada como prop

      if (cardNumberWithoutSpaces === "") {
        setCardFlag("");
      } else {
        const cardTypes = creditCardType(cardNumberWithoutSpaces);
        if (cardTypes.length > 0) {
          setCardFlag(cardTypes[0].type);
        } else {
          setCardFlag("");
        }
      }
    }
  };

  const getCardIcon = (cardFlag) => {
    switch (cardFlag) {
      case "visa":
        return <FaCcVisa />;
      case "mastercard":
        return <FaCcMastercard />;
      case "amex":
        return <FaCcAmex />;
      case "discover":
        return <FaCcDiscover />;
      default:
        return <BsCreditCard2Back />;
    }
  };
  
  return (
    <FormControl>
      <FormLabel>Número do cartão</FormLabel>
      <InputGroup>
        <Input
          placeholder="**** **** **** ****"
          as={InputMask}
          mask="9999 9999 9999 9999"
          value={cardNumber}
          onChange={handleCardNumberChange}
        />
        <InputRightElement pointerEvents="none">
          {getCardIcon(cardFlag)}
        </InputRightElement>
      </InputGroup>
      {errors && (
        <Box mt="2" color="red.500" fontSize="sm">
          <Box display="inline-block" mr="2">
            {/* Ícone de erro do React Icons */}
            <FaExclamationCircle />
          </Box>
          {/* Mensagem de erro */}
          {errors}
        </Box>
      )}
    </FormControl>
  );
};

export default CardFlagInput;
