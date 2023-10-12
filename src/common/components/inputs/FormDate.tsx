import {
  FormControl,
  FormErrorIcon,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  InputGroup,
  InputLeftAddon,
  InputLeftElement,
  InputRightAddon,
  InputRightElement,
} from "@chakra-ui/react";
import { forwardRef } from "react";

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
        <Input type="date" ref={ref} {...rest} placeholder={placeholder} />
        {rightAddon && (
          <InputRightAddon p={3} borderLeft="none" bg="none">
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

export const FormDate = forwardRef(InputBase);
