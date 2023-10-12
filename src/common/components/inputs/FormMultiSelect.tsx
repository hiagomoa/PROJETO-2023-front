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
import { forwardRef, useState } from "react";
import { Select } from "chakra-react-select";
import { useRouter } from "next/router";

const menuPortalTarget = typeof window !== "undefined" ? document.body : null;

const InputBase = (
  {
    label,
    error,
    description,
    rightElement,
    rightAddon,
    leftElement,
    leftAddon,
    children,
    ...rest
  },
  ref
) => {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const router = useRouter();
  return (
    <FormControl isInvalid={error ? true : false}>
      {label && <FormLabel>{label}</FormLabel>}
      <InputGroup>
        {leftAddon && <InputLeftAddon>{leftAddon}</InputLeftAddon>}
        {leftElement && <InputLeftElement>{leftElement}</InputLeftElement>}
        <Select
          ref={ref}
          {...rest}
          menuPortalTarget={menuPortalTarget}
          styles={{
            menuPortal: (provided) => ({
              ...provided,
              zIndex: 9999999999999999999,
            }),
          }}
          chakraStyles={{
            container: (_, { selectProps: { width } }) => ({
              width: "full",
              bg: "white",
            }),
          }}
        />

        {rightAddon && <InputRightAddon>{rightAddon}</InputRightAddon>}
        {rightElement && <InputRightElement>{rightElement}</InputRightElement>}
      </InputGroup>
      {error && (
        <FormErrorMessage>
          <FormErrorIcon />
          {error}
        </FormErrorMessage>
      )}
      {description && <FormHelperText>{description}</FormHelperText>}
    </FormControl>
  );
};
export const FormMultiSelect = forwardRef(InputBase);
