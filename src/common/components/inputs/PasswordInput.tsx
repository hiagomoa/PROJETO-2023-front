import { useState } from "react";
import {
  FormControl,
  FormLabel,
  InputGroup,
  Input,
  InputRightElement,
  Button,
  FormErrorIcon,
  FormErrorMessage,
  InputLeftAddon,
  InputLeftElement,
  InputRightAddon,
  FormHelperText,
} from "@chakra-ui/react";
import { BsEye, BsEyeSlash } from "react-icons/bs";
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
  const [showPassword, setShowPassword] = useState(false);

  const handleClick = () => {
    setShowPassword(!showPassword);
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
        <Input
          ref={ref}
          {...rest}
          placeholder={placeholder}
          type={showPassword ? "text" : "password"}
        />
        {rightAddon && <InputRightAddon p={0}>{rightAddon}</InputRightAddon>}
        <InputRightElement width="4.5rem">
          <Button
            color="greenglobal.700"
            h="1.75rem"
            size="sm"
            onClick={handleClick}
            bg="none"
            _hover={{ bg: "none" }}
            _active={{ bg: "none" }}
          >
            {showPassword ? <BsEyeSlash /> : <BsEye />}
          </Button>
        </InputRightElement>
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

export const FormInputPassword = forwardRef(InputBase);
