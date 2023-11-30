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
  Tooltip,
  Box,
  Center,
  Text,
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
}) {
  // if isOpen, onOpen, onClose are not passed as props, useDisclosure is used instead
  const {
    isOpen: isOpenModal,
    onOpen: onOpenModal,
    onClose: onCloseModal,
  } = useDisclosure();
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
        <Center
          w={"40px"}
          h={"40px"}
          borderRadius={"full"}
          bg={"white"}
          boxShadow={"0px 0px 7px 0px #8c8c8c"}
        >
          <Tooltip
            label={btnTitle}
            hasArrow
            placement="top"
            color="white"
            bg={btnColor}
          >
            <IconButton
              onClick={onOpen}
              size={btnSize}
              rounded={"full"}
              bg={btnColor}
              _hover={{ opacity: 0.8 }}
              icon={<Icon boxSize={iconSize} as={iconBtn} color={"white"} />}
            />
          </Tooltip>
        </Center>
      ) : (
        <Button
          minW={btnMinW}
          size={btnSize}
          color={"white"}
          bg={btnColor}
          _hover={{ opacity: 0.8 }}
          rounded={"20px"}
          minH={btnMinH}
          onClick={onOpen}
          leftIcon={
            iconBtn ? (
              <Icon boxSize={iconSize} as={iconBtn} color={"text.primary"} />
            ) : null
          }
        >
          <Text isTruncated>{btnTitle}</Text>
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
          borderRadius={"25px"}
        >
          <ModalHeader
            bg={transparent ? "transparent" : "primary.80"}
            color={"text.primary"}
            borderRadius={"25px"}
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
              borderRadius={"25px"}
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
