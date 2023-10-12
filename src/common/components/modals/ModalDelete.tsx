import React, { forwardRef, useImperativeHandle, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";

const ModalBase = ({}, ref) => {
  const [onConfirm, setOnConfirm] = useState(null);
  const [message, setMessage] = useState("");
  const { isOpen, onClose, onOpen } = useDisclosure();

  useImperativeHandle(ref, () => ({
    open: (confirmationMessage, confirmationCallback) => {
      setMessage(confirmationMessage);
      setOnConfirm(() => confirmationCallback);
      onOpen();
    },
  }));

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent minW="60%">
        <ModalHeader>Confirmação</ModalHeader>
        <ModalBody>
          <Text>{message}</Text>
        </ModalBody>
        <ModalFooter>
          <Flex w="100%" justifyContent="flex-end" gap={5}>
            <Button
              mr={3}
              variant="ghost"
              border="1px"
              borderColor="blackAlpha.300"
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button bg="red" color="white" onClick={handleConfirm}>
              Confirmar
            </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export const ModalDelete = forwardRef(ModalBase);
