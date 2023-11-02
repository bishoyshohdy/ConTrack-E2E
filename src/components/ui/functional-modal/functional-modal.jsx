import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  IconButton,
} from "@chakra-ui/react";
import { Icon } from "@chakra-ui/icons";


function FunctionalModal({
  footer = true,
  modalTitle,
  btnTitle,
  btnColor,
  btnMinH,
  btnMinW,
  children,
  btnAction,
  iconSize = "20px",
  iconBtn,
  btnSize = "sm",
  modalMinH,
  modalMinW = "350px",
  transparent,
  smallBlur,
  initialRef,
  reset,
  isOpen = null,
  onOpen = null,
  onClose = null,
   
  //  when you want to use icon and text in the button
   IconAndText = false,
})

{

// if isOpen, onOpen, onClose are not passed as props, useDisclosure is used instead
 const { isOpen: isOpenModal, onOpen: onOpenModal, onClose: onCloseModal } = useDisclosure()
  if (isOpen === null) {
    isOpen = isOpenModal;
  }
  if (onOpen === null) {
    onOpen = onOpenModal;
  }
  if (onClose === null) {
    onClose = onCloseModal;
  }


  return (
    <>
      {iconBtn && !IconAndText ? (
        <IconButton
          onClick={onOpen}
          size={btnSize}
          rounded={"full"}
          bg={btnColor}
          icon={<Icon boxSize={iconSize} as={iconBtn} color={"text.primary"} />}
        />
      ) : (
        <Button
          minW={btnMinW}
          w={"fit-content"}
          size={btnSize}
          color={"text.primary"}
          bg={btnColor}
          minH={btnMinH}
          onClick={onOpen}
          leftIcon={iconBtn ? <Icon boxSize={iconSize} as={iconBtn} color={"text.primary"} /> : null}
        >
          {btnTitle}
        </Button>
        )}
      <Modal
        initialFocusRef={initialRef}
        scrollBehavior="inside"
        isCentered
        motionPreset="scale"
        w={"100%"}
        isOpen={isOpen}
        onClose={() => {
          onClose();
        }}
      >
        <ModalOverlay
          h={"100%"}
          backdropFilter="auto"
          backdropBlur={smallBlur ? "0px" : "4px"}
        />
        <ModalContent
          m={0}
          h={modalMinH}
          minW={modalMinW}
          bg={transparent ? "transparent" : "primary.80"}
        >
          <ModalHeader
            bg={transparent ? "transparent" : "primary.80"}
            color={"text.primary"}
          >
            {modalTitle}
          </ModalHeader>
          <ModalCloseButton color={"text.primary"} />
          <ModalBody
            h={transparent ? "100%" : modalMinH}
            color={"text.primary"}
          >
            {children}
          </ModalBody>
          {footer && (
            <ModalFooter
              h={"60px"}
              bg={transparent ? "transparent" : "primary.80"}
            >
              {!transparent && (
                <Button
                  color={"text.primary"}
                  bg={"primary.100"}
                  mr={3}
                  onClick={() => {
                    onClose();
                    if (reset) reset();
                  }}
                >
                  Close
                </Button>
              )}
              {btnAction}
            </ModalFooter>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default FunctionalModal;
