import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { ReactComponentElement } from "react";

interface IModalMainProps {
  isOpen: boolean;
  onClose: () => void;
  modalProps: {
    title: string;
    content: ReactComponentElement<any>;
  };
}
export const ModalMain = (props: IModalMainProps) => {
  const { isOpen, onClose } = useDisclosure({
    isOpen: props.isOpen,
    onClose: props.onClose,
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent minW="60%">
        <ModalHeader color="#313B6D">{props.modalProps?.title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody style={{ background: "" }}>
          {props.modalProps?.content}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
