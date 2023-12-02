import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  IconButton,
  Input,
  Text,
  Flex,
  Center,
  Heading,
  SimpleGrid,
  Tag,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { extractHeaders, flattenObject } from "../../../helpers/array-map";
import { ThemeContext } from "../../../context/theme";
import cypod from "../../../assets/images/logo/cypod.png";
import cypod_dark from "../../../assets/images/logo/cypod-dark.png";

import "./tag-container.css";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import StyledSelect from "../styled-select/styled-select";
// react icons
import {
  RiArrowLeftSLine as LeftIcon,
  RiArrowRightSLine as RightIcon,
} from "react-icons/ri";

function tagContainer({
  reverse = false,
  flatten = false,
  extractFn = extractHeaders,
  data,
  icon,
  title,
  redirectToDevice,
  children,
  minW,
  hiddenCols = [],
  CreateDevice,

  TabChange,
}) {
  const theme = useContext(ThemeContext);
  const [flatData, setFlatData] = useState(data);
  const [tags, setTags] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedColumn, setSelectedColumn] = useState(null);

  const [divWidth, setDivWidth] = useState(0);
  const [cardWidth, setCardWidth] = useState(0);

  useEffect(() => {
    const updateDivWidth = () => {
      const cardTableDiv = document.getElementById("TagTable");
      const cardWidth = document.getElementById("Tagcard");

      if (cardTableDiv && cardWidth) {
        const newWidth = cardTableDiv.offsetWidth;
        const newCardWidth = cardWidth.offsetWidth;
        setDivWidth(newWidth);
        setCardWidth(newCardWidth);
      }
    };

    updateDivWidth();

    window.addEventListener("resize", updateDivWidth);

    return () => {
      window.removeEventListener("resize", updateDivWidth);
    };
  }, [TabChange, data]);

  const [cardsPerRow, setCardsPerRow] = useState(4);

  const updateTags = () => {
    let tmpTags = [];
    for (let i = 0; i < data.length; i++) {
      if (i % (cardsPerRow * 2) === 0) {
        tmpTags.push([]);
      }
      tmpTags[tmpTags.length - 1].push(data[i]);
    }
    setTags(tmpTags);
  };

  useEffect(() => {
    updateTags();
  }, [TabChange, cardsPerRow]);

  useEffect(() => {
    if (divWidth) {
      const NewcardsPerRow = Math.floor((divWidth - 14) / (cardWidth + 24));

      if (cardsPerRow <= 1) {
        setCardsPerRow(1);
      } else setCardsPerRow(NewcardsPerRow);
    }
  }, [divWidth]);

  useEffect(() => {
    let tmpTags = [];
    for (let i = 0; i < data.length; i++) {
      if (i % (cardsPerRow * 2) === 0) {
        tmpTags.push([]);
      }
      tmpTags[tmpTags.length - 1].push(data[i]);
    }
    setTags(tmpTags);
  }, [data]);

  useEffect(() => {
    if (flatten) {
      setFlatData([...data].map((obj) => flattenObject(obj)));
    }
  }, [data]);
  const columns = React.useMemo(
    () =>
      reverse
        ? [...extractFn(data, hiddenCols).reverse()]
        : [...extractFn(data, hiddenCols)],
    [data]
  );
  hiddenCols = [...hiddenCols, "cycollector_id", "roles"];

  const [filteredTags, setFilteredTags] = useState(tags);
  useEffect(() => {
    setFilteredTags(tags);
  }, [tags]);

  const handleSearch = () => {
    const filteredData = data.filter((item) => {
      return Object.values(item)
        .join(" ")
        .toLowerCase()
        .includes(searchText.toLowerCase());
    });

    let tmpTags = [];
    for (let i = 0; i < filteredData.length; i++) {
      if (i % (cardsPerRow * 2) === 0) {
        tmpTags.push([]);
      }
      tmpTags[tmpTags.length - 1].push(filteredData[i]);
    }
    setFilteredTags(tmpTags);
  };

  const handleColumnSelect = (selected) => {
    setSelectedColumn(selected);

    const sortedData = [...data].sort((a, b) => {
      const valueA = a[selected];
      const valueB = b[selected];

      // Convert MAC addresses to comparable format
      const formatMac = (mac) => {
        // Check if mac is undefined or null
        if (!mac) {
          return "";
        }
        return mac
          .split(":")
          .map((part) => parseInt(part, 16))
          .join("");
      };

      const formattedValueA = formatMac(valueA);
      const formattedValueB = formatMac(valueB);

      // Use a simple comparison for strings
      return formattedValueA.localeCompare(formattedValueB);
    });

    let tmpTags = [];
    for (let i = 0; i < sortedData.length; i++) {
      if (i % (cardsPerRow * 2) === 0) {
        tmpTags.push([]);
      }
      tmpTags[tmpTags.length - 1].push(sortedData[i]);
    }

    setTags(tmpTags);
  };
  return (
    <>
      <Box
        backgroundColor={"primary.80"}
        borderRadius={"25px"}
        w={"100%"}
        p={2}
        minW={minW}
        boxShadow={
          theme.darkMode ? "0px 0px 10px 0px #111" : "0px 0px 1px 0px #aaaa"
        }
      >
        <Flex
          p={{ base: 0, sm: 2 }}
          justifyContent={{ base: "center", sm: "space-between" }}
          alignItems={"center"}
          flexDirection={["column", "column", "row"]}
        >
          <Flex gap={2} px={{ base: 0, md: 4 }} mt={{ base: 5, sm: 0 }}>
            {icon}
            <Heading
              w={"100%"}
              color={"text.primary"}
              fontSize={"xl"}
              alignSelf={"center"}
            >
              {title}
            </Heading>
          </Flex>

          <Flex
            justifyContent={"center"}
            alignItems={"center"}
            flexDirection={["column", "column", "row"]}
          >
            <Flex my={3}>
              <Text
                fontSize={"lg"}
                color={"text.primary"}
                mr={{ base: 0, md: 4 }}
                whiteSpace={"nowrap"}
                my={1}
                mx={3}
              >
                Sort By:
              </Text>

              <Box>
                <StyledSelect
                  size={"md"}
                  options={columns.map((col) => ({
                    value: col.accessor,
                    label: col.Header,
                  }))}
                  value={selectedColumn}
                  onchange={(res) => handleColumnSelect(res)}
                />
              </Box>
            </Flex>

            {/* Search Bar */}
            <Box
              display={"flex"}
              alignItems={"center"}
              justifyContent={{ base: "center", sm: "end" }}
              my={2}
            >
              <Input
                size="md"
                color={"text.primary"}
                fontFamily="DM Sans"
                borderRadius={"10px"}
                placeholder="Search"
                bg={"primary.100"}
                mr={4}
                width={"70%"}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />

              <Center
                w={"40px"}
                h={"40px"}
                borderRadius={"full"}
                bg={"white"}
                boxShadow={"0px 0px 7px 0px #8c8c8c"}
                mr={{ base: 0, sm: 4 }}
              >
                <IconButton
                  size={"sm"}
                  aria-label="Search"
                  icon={<SearchIcon color={"white"} />}
                  _hover={{ opacity: 0.8 }}
                  rounded={"full"}
                  bg={"action.80"}
                  onClick={() => handleSearch()}
                />
              </Center>
            </Box>

            {CreateDevice}
            {children ? (
              <Flex me={{ base: 0, sm: 10 }} my={1}>
                <Text
                  fontSize={"lg"}
                  color={"text.primary"}
                  my={1}
                  mx={3}
                  display={{ base: "block", sm: "none" }}
                >
                  Export to PDF/Excel:
                </Text>
                {children}
              </Flex>
            ) : null}
          </Flex>
        </Flex>
        {columns.length !== 0 ? (
          <>
            <Carousel
              showArrows={true}
              showStatus={false}
              showIndicators={true}
              swipeable={true}
              renderArrowPrev={(clickHandler, hasPrev) => {
                return (
                  <Flex
                    top={0}
                    bottom={0}
                    left={0}
                    zIndex={20}
                    justifyContent={"center"}
                    alignItems={"center"}
                    position={"absolute"}
                    onClick={clickHandler}
                    style={{ transition: " 0.1s" }}
                    _hover={{ bg: "card.100", cursor: "pointer" }}
                    _focus={{ bg: "transparent" }}
                    disabled={!hasPrev}
                    rounded={"full"}
                    w={"40px"}
                  >
                    <IconButton
                      onClick={clickHandler}
                      icon={<LeftIcon size={"30px"} />}
                      bg={"transparent"}
                      _hover={{ bg: "transparent" }}
                      _focus={{ bg: "transparent" }}
                      color={"text.primary"}
                      borderRadius={"full"}
                      size={"lg"}
                      mr={2}
                      disabled={!hasPrev}
                    />
                  </Flex>
                );
              }}
              renderArrowNext={(clickHandler, hasNext) => {
                return (
                  <Flex
                    top={0}
                    bottom={0}
                    right={0}
                    zIndex={20}
                    justifyContent={"center"}
                    alignItems={"center"}
                    position={"absolute"}
                    onClick={clickHandler}
                    style={{ transition: " 0.1s" }}
                    _hover={{ bg: "card.100", cursor: "pointer" }}
                    _focus={{ bg: "transparent" }}
                    disabled={!hasNext}
                    rounded={"full"}
                    w={"40px"}
                  >
                    <IconButton
                      onClick={clickHandler}
                      icon={<RightIcon size={"30px"} />}
                      bg={"transparent"}
                      _hover={{ bg: "transparent" }}
                      _focus={{ bg: "transparent" }}
                      color={"text.primary"}
                      borderRadius={"full"}
                      size={"lg"}
                      ml={2}
                      disabled={!hasNext}
                    />
                  </Flex>
                );
              }}
              renderIndicator={(clickHandler, isSelected, index, label) => {
                if (isSelected) {
                  return (
                    <Tag
                      bg={"action.80"}
                      color={"white"}
                      borderRadius={"full"}
                      size={"sm"}
                      mr={2}
                      onClick={clickHandler}
                      key={index}
                      boxShadow={"sm"}
                      _hover={{ bg: "action.80", cursor: "pointer" }}
                      _focus={{ bg: "action.80", cursor: "pointer" }}
                      style={{ transition: " 0.1s" }}
                    >
                      <Text
                        fontSize={"sm"}
                        color={"white"}
                        display={{ base: "none", sm: "block" }}
                      >
                        {index + 1}
                      </Text>
                    </Tag>
                  );
                }
                return (
                  <Tag
                    bg={"primary.100"}
                    color={"text.primary"}
                    borderRadius={"full"}
                    size={"sm"}
                    mr={2}
                    onClick={clickHandler}
                    key={index}
                    boxShadow={"sm"}
                    _hover={{ bg: "action.80", cursor: "pointer" }}
                    _focus={{ bg: "action.80", cursor: "pointer" }}
                    style={{ transition: " 0.1s" }}
                  >
                    <Text
                      fontSize={"sm"}
                      color={"text.primary"}
                      display={{ base: "none", sm: "block" }}
                    >
                      {index + 1}
                    </Text>
                  </Tag>
                );
              }}
            >
              {filteredTags.map((page, index) => {
                return (
                  <SimpleGrid
                    id="TagTable"
                    spacing={2}
                    spacingX={"12px"}
                    templateColumns="repeat(auto-fill, minmax( 260px, auto ))"
                    justifyContent={"center"}
                    m={10}
                    key={index}
                  >
                    {page.map((tag, index2) => {
                      return (
                        <Box
                          id="Tagcard"
                          key={index2}
                          bg={"table.cell"}
                          className="tag-container"
                          w={"100%"}
                          minH={"200px"}
                          maxH={"220px"}
                          minW={"200px"}
                          maxW={"220px"}
                          cursor={redirectToDevice ? "pointer" : "default"}
                          borderColor={"transparent"}
                          overflowX={"hidden"}
                          _hover={{
                            transform:
                              "perspective(1000px) rotatex(0deg) !important",
                            boxShadow: `0 0 3px #${
                              theme.darkMode ? "9b29e7" : "229CE2"
                            }`,
                            borderBottom: "15px solid rgba(0,0,0,0) !important",
                          }}
                          onClick={() =>
                            redirectToDevice ? redirectToDevice(tag) : null
                          }
                          style={{
                            transform: "perspective(1000px) rotatex(15deg)",
                            transformStyle: "preserve-3d",
                            transition: "transform 0.4s",
                            borderRadius: "40px",
                            position: "relative",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            borderBottom: "15px solid rgb(12,12,15, 0.2)",
                          }}
                        >
                          <Box
                            p={1}
                            width={"200px"}
                            alignContent={"center"}
                            display={"flex"}
                            flexDirection={"column"}
                          >
                            <Box
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                padding: "0",
                              }}
                              color={"text.primary"}
                            >
                              <Box>
                                <h2>{tag.name}</h2>
                              </Box>
                              <Box
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                }}
                              >
                                <img
                                  src={theme.darkMode ? cypod : cypod_dark}
                                  alt="logo"
                                  style={{ width: "50%", padding: "16px" }}
                                />
                                ID: {tag.id}
                              </Box>
                            </Box>
                          </Box>
                        </Box>
                      );
                    })}
                  </SimpleGrid>
                );
              })}
            </Carousel>
          </>
        ) : (
          <Center color={"text.primary"}>There are no data to display</Center>
        )}
      </Box>
    </>
  );
}

export default tagContainer;
