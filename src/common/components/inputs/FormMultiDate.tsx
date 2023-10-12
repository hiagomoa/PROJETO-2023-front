import React, { forwardRef, useState } from "react";
import {
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
import { RangeDatepicker } from "chakra-dayzed-datepicker";

const InputBase = (
  {
    label,
    placeholder,
    description,
    error,
    required,
    leftAddon,
    rightAddon,
    leftElement,
    rightElement,
    value, // nova propriedade para o valor
    onChange, // nova propriedade para o método de mudança de valor
    ...rest
  }: any,
  ref: any
) => {
  const [selectedDates, setSelectedDates] = useState<Date[]>(value || []); // deixando o valor inicial vazio

  const handleDateChange = (dates: Date[]) => {
    setSelectedDates(dates);
    onChange && onChange(dates); // chamando o método "onChange" fornecido pelo componente pai quando as datas são atualizadas
  };

  return (
    <FormControl isInvalid={error} isRequired={required}>
      {label && <FormLabel>{label}</FormLabel>}
      <InputGroup borderRadius="md">
        {leftAddon && (
          <InputLeftAddon p={3} borderRight="none">
            {leftAddon}
          </InputLeftAddon>
        )}
        {leftElement && <InputLeftElement>{leftElement}</InputLeftElement>}

        <InputGroup>
          <InputLeftAddon bg="none" borderLeftRadius="8px" borderRight="none">
            De
          </InputLeftAddon>

          <RangeDatepicker
            ref={ref}
            selectedDates={selectedDates}
            onDateChange={handleDateChange}
            locale="pt-BR" // Correto! Passando a string com o nome da localização
            {...rest}
            configs={{
              dateFormat: "dd-MM-yyyy",
              dayNames: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"],
              monthNames: [
                "Jan",
                "Fev",
                "Mar",
                "Abr",
                "Mai",
                "Jun",
                "Jul",
                "Ago",
                "Set",
                "Out",
                "Nov",
                "Dez",
              ],
            }}
            propsConfigs={{
              dateNavBtnProps: {
                colorScheme: "black",
              },
              dayOfMonthBtnProps: {
                defaultBtnProps: {
                  borderColor: "black",
                  color: "black",
                  _hover: {
                    borderColor: "#0D9488",
                    background: "none",
                    color: "#0D9488",
                  },
                },
                isInRangeBtnProps: {
                  color: "black",
                  bg: "green.400",
                  _hover: {
                    bg: "green.500",
                  },
                },
                selectedBtnProps: {
                  borderWidth: "2px",
                  borderColor: "#0D9488",
                  bg: "green.400",
                  color: "white",
                },
                todayBtnProps: {
                  background: "white",
                },
              },
              inputProps: {
                size: "sm",
                placeholder: placeholder,
                height: "40px",
              },
              popoverCompProps: {
                popoverContentProps: {
                  background: "white",
                  color: "black",
                },
              },
              background: "white",
              zIndex: 999999999999999999999999,
            }}
          />
          <InputRightAddon bg="none" borderRadius="0px">
            Até
          </InputRightAddon>
        </InputGroup>

        {rightAddon && (
          <InputRightAddon p={0} bg="none">
            {rightAddon}
          </InputRightAddon>
        )}
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

export const FormMultiDate = forwardRef(InputBase);
