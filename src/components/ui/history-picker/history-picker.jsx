import {
  Box,
  Button,
  Input,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  IconButton,
} from "@chakra-ui/react";
import { RepeatClockIcon } from "@chakra-ui/icons";
import React from "react";
import "./history-picker.css";

function HistoryPicker({
  showBtn = true,
  selectStartDate,
  selectEndDate,
  disabled,
  startDate,
  handleClick,
  endDate,
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const today = new Date();
  today.setDate(today.getDate() + 1);
  const body = () => {
    return (
      <>
        <Box p={1}>
          <Text p={1} color={"text.primary"}>
            Start Date:{" "}
          </Text>
          <Input
            color={"text.primary"}
            bg={"primary.100"}
            borderRadius={"10px"}
            borderWidth={0}
            placeholder="Select start date and time"
            size="md"
            w={"100%"}
            type="datetime-local"
            variant={"outline"}
            value={startDate}
            onChange={(e) => selectStartDate(e.target.value.replace("Z", ""))}
            max={today.toISOString().replace("Z", "")}
          />
        </Box>
        <Box p={1} mr={1}>
          <Text p={1} color={"text.primary"}>
            End Date:{" "}
          </Text>
          <Input
            color={"text.primary"}
            bg={"primary.100"}
            borderRadius={"10px"}
            borderWidth={0}
            placeholder="Select end date and time"
            size="md"
            w={"100%"}
            variant={"outline"}
            type="datetime-local"
            onChange={(e) => {
              console.log(e.target.value);
              selectEndDate(e.target.value.replace("Z", ""));
            }}
            min={startDate}
            max={today.toISOString().replace("Z", "")}
            value={endDate}
          />
        </Box>
      </>
    );
  };
  return (
    <>
      {showBtn ? (
        <>
          <IconButton
            size={"sm"}
            title="get historical data"
            aria-label="get historical data"
            rounded={"full"}
            icon={<RepeatClockIcon color={"text.primary"} />}
            bg={"action.100"}
            color={"text.primary"}
            onClick={onOpen}
          />
          <Modal h={"100%"} isOpen={isOpen} onClose={onClose}>
            <ModalOverlay h={"100%"} />
            <ModalContent bg={"primary.80"}>
              <ModalHeader color={"text.primary"}>
                Get Historical Data
              </ModalHeader>
              <ModalCloseButton color={"text.primary"} />
              <ModalBody>{body()}</ModalBody>
              <ModalFooter>
                <Button
                  size={"sm"}
                  h={"35px"}
                  mt={8}
                  bg={"action.100"}
                  color={"text.primary"}
                  onClick={handleClick}
                  disabled={disabled}
                >
                  {" "}
                  Get Historical Data
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      ) : (
        body()
      )}
    </>
  );
}

export default HistoryPicker;
