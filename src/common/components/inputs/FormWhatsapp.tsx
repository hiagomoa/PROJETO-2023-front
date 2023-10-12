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
import { forwardRef } from "react";
import PhoneInput from "react-phone-input-2";

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
    ...rest
  },
  ref
) => {
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

        <PhoneInput
          inputStyle={{
            width: "100%",
            height: "40px",
            border: "1px solid rgba(0,0,0,0.1)",
          }}
          country={"br"}
          ref={ref}
          {...rest}
          placeholder={placeholder}
        />
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

export const FormWhatsapp = forwardRef(InputBase);
