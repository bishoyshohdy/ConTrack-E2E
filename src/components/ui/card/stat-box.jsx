/* eslint-disable no-unused-expressions */
import React from "react";
import {
  Box,
  Stat,
  StatNumber,
  StatHelpText,
  Text,
  Circle,
  Flex,
  TableContainer,
  Table,
  Tbody,
  Tr,
  Td,
  Thead,
  Th,
} from "@chakra-ui/react";
import "./card.css";
import useScreenSize from "../../../hooks/screen-size";
import { SCREEN_SIZE } from "../../../types/screen";
import { Column } from "jspdf-autotable";

function StatCard(props) {
  const {
    minH,
    icon,
    title,
    subTitle,
    bgColor,
    textColor,
    maxW,
    maxH,
    handleClick,
    subText,
    subText2,
    subText3,
    subTextObject,
    width,
    clicked,
    wXh,
    handleClickScroll,
  } = props;
  const size = useScreenSize();
  return (
    <Box
      p={4}
      m={2}
      bg={clicked ? bgColor : bgColor}
      variant="elevated"
      color={textColor}
      borderRadius={"5px"}
      overflow="hidden"
      cursor={handleClick ? "pointer" : "default"}
      w={width}
      onClick={() => {
        handleClick ? handleClick(title) : null;
        console.log("STATCARF");
        handleClickScroll ? handleClickScroll() : null;
      }}
      _hover={handleClick ? { bg: "action.100" } : {}}
    >
      <Flex
        flexDirection={"Column"}
        justifyContent={"center"}
        alignItems={"center"}
        gap={"10%"}
      >
        {icon ? (
          <>
            <Box>
              <Circle
                size="40px"
                borderRadius={"40%"}
                position={"relative"}
                top={"25%"}
              >
                {icon}
              </Circle>
            </Box>
            <Box p={1} className="text-container">
              <Stat>
                <StatHelpText fontSize={"lg"} textAlign={"center"}>
                  {title}
                </StatHelpText>
                <StatNumber w={"100%"} fontSize={"3xl"} textAlign={"center"}>
                  {subTitle}
                </StatNumber>

                {!subTextObject ? (
                  <>
                    <Text fontSize={"md"} textAlign={"center"}>
                      {subText}
                    </Text>
                    <Text fontSize={"md"} textAlign={"center"}>
                      {subText2}
                    </Text>
                    <Text fontSize={"md"} textAlign={"center"}>
                      {subText3}
                    </Text>
                  </>
                ) : (
                  <>
                    <TableContainer mb={2} w={"100%"}>
                      <Table size="md">
                        <Thead>
                          <Th borderColor={"text.primary"}></Th>
                          <Th borderColor={"text.primary"}></Th>
                        </Thead>
                        <Tbody color={"text.primary"}>
                          {Object.keys(subTextObject).map((key, index) => {
                            return (
                              <Tr key={index}>
                                <Td
                                  borderColor={"text.primary"}
                                  color={"text.primary"}
                                  p={1}
                                >
                                  {key}
                                </Td>
                                <Td
                                  borderColor={"text.primary"}
                                  color={"text.primary"}
                                  p={1}
                                  isNumeric
                                >
                                  {subTextObject[key]}
                                </Td>
                              </Tr>
                            );
                          })}
                        </Tbody>
                      </Table>
                    </TableContainer>
                  </>
                )}
              </Stat>
            </Box>
          </>
        ) : (
          <>
            <Box className="text-container">
              <Stat>
                <StatHelpText>{title}</StatHelpText>
                <StatNumber>{subTitle}</StatNumber>
              </Stat>
              <Text fontSize={"xs"}>{subText}</Text>
            </Box>
          </>
        )}
      </Flex>
    </Box>
  );
}

export default StatCard;
