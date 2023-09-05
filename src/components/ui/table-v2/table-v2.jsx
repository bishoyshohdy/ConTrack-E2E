import React, { useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Button,
  Box,
  Flex,
  Heading,
  IconButton,
  Input,
  Center,
} from "@chakra-ui/react";
import StyledSelect from "../styled-select/styled-select";
import {
  ArrowBackIcon,
  ArrowDownIcon,
  ArrowForwardIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpIcon,
} from "@chakra-ui/icons";
import { BsArrowDownUp } from "react-icons/bs";

const DESC = "desc";
const ASC = "asc";

const GlobalSearch = ({ value, width, setValue, onChange, count }) => {
  return (
    <Input
      variant={"outline"}
      borderColor={"primary.100"}
      bg={"primary.100"}
      borderRadius={"10px"}
      value={value || ""}
      w={width}
      color={"text.primary"}
      onChange={(e) => {
        setValue(e.target.value);
        onChange(e.target.value);
      }}
      placeholder={`Search in ${count} records`}
    />
  );
};

function TableV2({
  title,
  fetchData,
  data,
  extractFn,
  hiddenCols,
  defaultPageSize,
  numberOfPages,
  children,
  icon,
  redirectToDevice,
  firstCol,
}) {
  
  const headers = extractFn(data.data)
    .reverse()
    .filter(
      (header) => !hiddenCols.find((colName) => colName === header.accessor)
    );
  const [numberPerPage, setNumberPerPage] = useState(data.numberPerPage);
  const [sortedField, setSortedField] = React.useState(null);
  const [sortType, setSortType] = React.useState(null);

  const sortAsc = (x, y) => {
    if (x > y) {
      return 1;
    }
    if (x < y) {
      return -1;
    }
    return 0;
  };
  const sortDesc = (x, y) => {
    if (x > y) {
      return -1;
    }
    if (x < y) {
      return 1;
    }
    return 0;
  };

  const sortRows = (key) => {
    setSortedField(key);
    if (key === sortedField) {
      if (sortType === DESC) {
        setSortType(ASC);
        return data.data.sort(function (a, b) {
          let x = a[key] || 0;
          let y = b[key] || 0;
          return sortAsc(x, y);
        });
      } else {
        setSortType(DESC);
        return data.data.sort(function (a, b) {
          let x = a[key] || 0;
          let y = b[key] || 0;
          return sortDesc(x, y);
        });
      }
    } else {
      setSortedField(key);
      setSortType(DESC);
      return data.data.sort(function (a, b) {
        let x = a[key] || 0;
        let y = b[key] || 0;
        return sortDesc(x, y);
      });
    }
  };

  const [searchTerm, setSearchTerm] = useState("");
  const searchAll = (term) => {
    data.data = data.data.filter((datum) => {
      return headers.forEach((header) => {
        if (datum[header.accessor] && datum[header.accessor].includes(term)) {
          return datum;
        }
      });
    });
  };

  return (
    <Box
      backgroundColor={"primary.80"}
      borderRadius={"5px"}
      w={"100%"}
      p={2}
      minH={data.data.length !== 0 ? "555px" : "50px"}
    >
      <Flex p={"1%"} justifyContent={"start"} alignItems={"center"}>
        <Box w={children ? "30%" : "70%"} gap={2} as={Flex}>
          {icon}
          <Heading w={"100%"} color={"text.primary"} fontSize={"xl"}>
            {title}
          </Heading>
        </Box>
        {children ? (
          <Box as={Flex} flexWrap={"wrap"} justifyContent={"end"} w={"100%"}>
            {children}
          </Box>
        ) : null}
        {/* <GlobalSearch value={searchTerm} onChange={searchAll} setValue={setSearchTerm} /> */}
      </Flex>
      {data.data.length !== 0 ? (
        <>
          <TableContainer overflowX={"scroll"} overflowY={"scroll"} h={"430px"}>
            <Table h={"100%"} color={"secondary.100"} variant={"unstyled"}>
              <Thead pos={"sticky"} top={"0"} bg={"primary.80"}>
                <Tr bg={"primary.100"}>
                  <Th textAlign={"center"} h={"10px"} key={firstCol}>
                    {firstCol && firstCol.toUpperCase().replaceAll("_", " ")}
                    <IconButton
                      onClick={() => sortRows(firstCol)}
                      ml={1}
                      size={"xs"}
                      bg={"transparent"}
                      icon={
                        firstCol === sortedField ? (
                          sortType === DESC ? (
                            <ArrowDownIcon color={"text.primary"} />
                          ) : (
                            <ArrowUpIcon color={"text.primary"} />
                          )
                        ) : (
                          <BsArrowDownUp color={"text.primary"} />
                        )
                      }
                    />
                  </Th>
                  {headers
                    .filter((head) => head.accessor !== firstCol)
                    .map((header) => {
                      return (
                        <Th
                          textAlign={"center"}
                          h={"10px"}
                          key={header.accessor}
                        >
                          {header.Header}
                          <IconButton
                            onClick={() => sortRows(header.accessor)}
                            ml={1}
                            size={"xs"}
                            bg={"transparent"}
                            color={"text.primary"}
                            icon={
                              header.accessor === sortedField ? (
                                sortType === DESC ? (
                                  <ArrowDownIcon />
                                ) : (
                                  <ArrowUpIcon />
                                )
                              ) : (
                                <BsArrowDownUp />
                              )
                            }
                          />
                        </Th>
                      );
                    })}
                </Tr>
              </Thead>
              <Tbody height={"80%"}>
                {data.data.map((row, index) => {
                  return (
                    <Tr
                      h={"10px"}
                      cursor={redirectToDevice ? "pointer" : "default"}
                      borderColor={"transparent"}
                      borderRightWidth={4}
                      borderLeftWidth={4}
                      _hover={{
                        backgroundColor: "primary.100",
                        borderColor: "primary.60",
                      }}
                      onClick={() =>
                        redirectToDevice ? redirectToDevice(row.cells) : null
                      }
                      key={index}
                      width={"100%"}
                    >
                      <Td p={1} minWidth={"200px"} key={firstCol}>
                        {firstCol !== "Acknowledge" &&
                        firstCol !== "severity" &&
                        firstCol !== "Geofence_Actions" &&
                        firstCol !== "Route_Actions" ? (
                          <Box
                            h={"50px"}
                            textAlign={"start"}
                            p={2}
                            rounded={"md"}
                            bg={"table.cell"}
                            w={"100%"}
                          >
                            {" "}
                          
                            {typeof row[firstCol] !== "undefined"? headers
                                  .find(
                                    (header) => header.accessor === firstCol
                                  )
                                  .Cell({ value: row[firstCol] })
                              : "-"}
                          </Box>
                        ) : (
                          <Box
                            p={2}
                            w={"100%"}
                            textAlign={"start"}
                            fontSize={"sm"}
                          >
                            {headers
                              .find((header) => header.accessor === firstCol)
                              .Cell({ value: row[firstCol] })}
                          </Box>
                        )}
                      </Td>
                      {headers
                        .filter((head) => head.accessor !== firstCol)
                        .map((header, index2) => {
                          return (
                            <Td p={1} minWidth={"200px"} key={index2}>
                              {header.accessor !== "Acknowledge" &&
                              header.accessor !== "severity" &&
                              header.accessor !== "Geofence_Actions" &&
                              header.accessor !== "Route_Actions" ? (
                                <Box
                                  h={"50px"}
                                  textAlign={"start"}
                                  p={2}
                                  rounded={"md"}
                                  bg={"table.cell"}
                                  w={"100%"}
                                >
                                  {" "}
                                  {typeof row[header.accessor] !== "undefined"
                                    ? header.Cell({
                                        value: row[header.accessor],
                                      })
                                    : "-"}
                                </Box>
                              ) : (
                                <Box
                                  p={2}
                                  w={"100%"}
                                  textAlign={"start"}
                                  fontSize={"sm"}
                                >
                                  {header.Cell({ value: row[header.accessor] })}
                                </Box>
                              )}
                            </Td>
                          );
                        })}
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </TableContainer>
          <Flex m={2} justifyContent={"space-between"}>
            <Box as={Flex} gap={2}>
              <IconButton
                rounded="full"
                bg={"transparent"}
                color="secondary.100"
                icon={<ArrowLeftIcon />}
                size={"xs"}
                onClick={() => fetchData(0, numberPerPage)}
                isDisabled={data.pageNum === 0}
              />
              <IconButton
                rounded="full"
                bg={"transparent"}
                color="secondary.100"
                icon={<ArrowBackIcon />}
                size={"xs"}
                onClick={() => fetchData(data.pageNum - 1, numberPerPage)}
                isDisabled={data.pageNum === 0}
              />
              <IconButton
                rounded="full"
                bg={"transparent"}
                color="secondary.100"
                icon={<ArrowForwardIcon />}
                size={"xs"}
                onClick={() => fetchData(data.pageNum + 1, numberPerPage)}
                isDisabled={data.pageNum + 1 === data.numberOfPages}
              />
              <IconButton
                rounded="full"
                bg={"transparent"}
                color="secondary.100"
                icon={<ArrowRightIcon />}
                size={"xs"}
                onClick={() => fetchData(data.numberOfPages - 1, numberPerPage)}
                isDisabled={data.pageNum + 1 === data.numberOfPages}
              />
            </Box>
            <Box color={"text.primary"}>
              {data.pageNum + 1} out of {data.numberOfPages}
            </Box>
            <StyledSelect
              size={"xs"}
              value={numberPerPage}
              onchange={(res) => {
                console.log(res);
                setNumberPerPage(parseInt(res));
                fetchData(data.pageNum, parseInt(res));
              }}
              options={[
                { value: 5, label: "5" },
                { value: 10, label: "10" },
                { value: 15, label: "15" },
                { value: 20, label: "20" },
                { value: 25, label: "25" },
              ]}
            />
          </Flex>
        </>
      ) : (
        <Center color={"text.primary"}>There are no data to display</Center>
      )}
    </Box>
  );
}

export default TableV2;
