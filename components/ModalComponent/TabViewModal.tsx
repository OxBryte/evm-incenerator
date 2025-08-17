import {
  Modal,
  ModalBody,
  ModalBodyProps,
  ModalContent,
  ModalContentProps,
  ModalOverlay,
  ModalProps,
} from "@chakra-ui/react";
import { FC, PropsWithChildren } from "react";

interface ModalComponentProps extends PropsWithChildren<ModalProps> {
  isOpen: boolean;
  bg?: string;
  confetti?: boolean;
  onClose(): void;
  modalContentStyle?: ModalContentProps;
  modalBodyStyle?: ModalBodyProps;
}

const ModalComponent: FC<ModalComponentProps> = ({
  children,
  bg,
  isOpen,
  confetti,
  onClose,
  modalContentStyle,
  modalBodyStyle,
  ...props
}): JSX.Element => {
  return (
    <>
      <Modal
        isCentered
        blockScrollOnMount={true}
        scrollBehavior={"outside"}
        isOpen={isOpen}
        size={"sm"}
        onClose={onClose}
        motionPreset="scale"
        {...props}
      >
        <ModalOverlay
          bg={bg ? bg : "#06081A80"}
          backdropFilter="auto"
          backdropBlur="2px"
        />
        <ModalContent
          w={{ base: "95vw", md: "80vw", lg: "70vw" }}
          maxW="1200px"
          borderRadius="24px"
          py="1%"
          position={{ base: "fixed" }}
          bottom={{ base: "0", md: "auto" }}
          mb={{ base: "40px" }}
          bg="gray.800"
          border="1px solid"
          borderColor="gray.700"
          {...modalContentStyle}
        >
          <ModalBody {...modalBodyStyle}>
            <>{children}</>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalComponent;
