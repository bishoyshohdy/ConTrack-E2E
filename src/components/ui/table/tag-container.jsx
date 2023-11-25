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
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { extractHeaders, flattenObject } from "../../../helpers/array-map";
import { ThemeContext } from "../../../context/theme";
import cypod from "../../../assets/images/logo/cypod.png";
import "./tag-container.css";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

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
}) {
  const [flatData, setFlatData] = useState(data);
  const [tags, setTags] = useState([]);
  const [searchText, setSearchText] = useState("");  const [selectedColumn, setSelectedColumn] = useState(null);


  useEffect(() => {}, [tags]);

  useEffect(() => {
    let tmpTags = [];
    for (let i = 0; i < data.length; i++) {
      if (i % 12 === 0) {
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
  const themeCtx = useContext(ThemeContext);


  
  useEffect(()=>{

  },[])


  return (
    <>
      <Box
        backgroundColor={"primary.80"}
        borderRadius={"5px"}
        w={"100%"}
        p={2}
        minW={minW}
      >
        <Flex
          p={"1%"}
          justifyContent={"space-between"}
          gap={2}
          alignItems={"center"}
        >
          <Box w={children ? "30%" : "70%"} gap={2} as={Flex} px={4}>
            {icon}
            <Heading w={"100%"} color={"text.primary"} fontSize={"xl"}>
              {title}
            </Heading>
          </Box>
          {CreateDevice}
          {children ? (
            <Box as={Flex} flexWrap={"wrap"} justifyContent={"end"} w={"50%"}>
              {children}
            </Box>
          ) : null}
          {/* {columns.length !== 0 && (
            <GlobalFilter
              preGlobalFilteredRows={preGlobalFilteredRows}
              globalFilter={globalFilter}
              setGlobalFilter={setGlobalFilter}
              width={"200px"}
            />
          )} */}
        </Flex>
        {columns.length !== 0 ? (
          <>
            <Carousel
              showArrows={true}
              showStatus={true}
              showIndicators={true}
              swipeable={true}
            >
              {filteredTags.map((page, index) => {
                return (
                  <SimpleGrid
                    spacing={7}
                    spacingX={14}
                    templateColumns={"repeat(6, minmax( 200px, 220px ))"}
                    justifyContent={"center"}
                    m={10}
                    key={index}
                  >
                    {page.map((tag, index2) => {
                      return (
                        <Box
                          key={index2}
                          bg={"table.cell"}
                          className="tag-container"
                          w={"100%"}
                          minH={"200px"}
                          maxH={"220px"}
                          cursor={redirectToDevice ? "pointer" : "default"}
                          borderColor={"transparent"}
                          overflowX={"hidden"}
                          _hover={{
                            transform:
                              "perspective(1000px) rotatex(0deg) !important",
                            boxShadow: "0 0 10px rgba(155, 40,231, 0.7)",
                            borderBottom: "15px solid rgba(0,0,0,0) !important",
                            transition: "transform 0.3s",
                          }}
                          onClick={() =>
                            redirectToDevice ? redirectToDevice(tag) : null
                          }
                          style={{
                            transform: "perspective(1000px) rotatex(15deg)",
                            transformStyle: "preserve-3d",
                            transition: "transform 0.3s",
                            borderRadius: "40px",
                            position: "relative",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            borderBottom: "15px solid rgb(12,12,15)",
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
                                  src={cypod}
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
