/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  IconButton,
  Input,
  Text,
  Flex,
  Stack,
  Button,
  Center,
  Spacer,
  Heading,
  Tag,
  TagLabel,
  FormLabel,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Grid,
  GridItem,
  Image,
} from "@chakra-ui/react";
import {
  ArrowBackIcon,
  ArrowDownIcon,
  ArrowForwardIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  MinusIcon,
  DeleteIcon,
} from "@chakra-ui/icons";
import { extractHeaders, flattenObject } from "../../../helpers/array-map";
import {
  usePagination,
  useSortBy,
  useGlobalFilter,
  useTable,
} from "react-table";
import GlobalFilter from "./components/global-filter/global-filter";
import StyledSelect from "../styled-select/styled-select";
import { BsArrowDownUp, BsDoorOpen } from "react-icons/bs";
import { MdClear, MdVerified } from "react-icons/md";
import { AiFillEdit } from "react-icons/ai";
import FunctionalModal from "../functional-modal/functional-modal";
import DeviceForm from "../../pages/device-management/device-form/device-form";
import CyTagIcon from "../icon/cytag-icon";
import { ThemeContext } from "../../../context/theme";
import { DevicesContext } from "../../../context/devices";
import NoDataVectorLight from "../../../assets/images/resources/No-data-vector-light.png";
import NoDataVectorDark from "../../../assets/images/resources/No-data-vector-dark.png";

function ComplexTable({
  reverse = false,
  minH = "550px",
  flatten = false,
  extractFn = extractHeaders,
  data,
  icon,
  title,
  redirectToDevice,
  children,
  cytagsBtn,
  minW,
  alarms = false,
  hiddenCols = [],
  deleteBtn,
  editBtn,
  idLabel,
  type,
  id,
  name,
  setId,
  setName,
  setPage,
  setPageNumber,
  pageNumber,
  CreateDevice,
  isLoading,
}) {
  const [flatData, setFlatData] = useState(data);

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
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize, globalFilter, hiddenColumns },
    visibleColumns,
    preGlobalFilteredRows,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data: flatten && flatData ? flatData : data,
      manualPagination: false,
      manualSortBy: false,
      autoResetPage: false,
      autoResetSortBy: false,
      autoResetPageIndex: false,
      initialState: {
        pageIndex: pageNumber ? pageNumber : 0,
        pageSize: 5,
        globalFilter: "",
        hiddenColumns: [...hiddenCols, "cycollector_id", "roles"],
      },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );
  useEffect(() => {
    if (pageNumber != undefined) {
      if (pageIndex) {
        setPageNumber(pageIndex);
      }
    }
  }, [pageIndex]);

  useEffect(() => {}, []);

  const [LoadingElapsed, setLoadingElapsed] = useState(true);
  setTimeout(() => {
    setLoadingElapsed(false);
  }, 1200);

  let Type;

  function transformGeofenceString(inputString) {
    const [, geofenceName, geofenceType, lat, lng] =
      inputString.match(
        /geofence_name:(.*?)geofence_type:(.*?)lat:([-0-9.]+)lng:([-0-9.]+)/
      ) || [];

    if (geofenceName && geofenceType && lat && lng) {
      const insideOrOutside =
        geofenceType === "ASSERT_IN" ? "Outside" : "Inside";
      return `${geofenceName} ${insideOrOutside} (${parseFloat(lat).toFixed(
        5
      )}, ${parseFloat(lng).toFixed(5)})`;
    } else {
      return "Invalid input string";
    }
  }
  return (
    <>
      {isLoading || LoadingElapsed ? (
        <Grid templateColumns="repeat(1, 1fr)" gap={4} mx={6}>
          {Array.from({ length: 3 }, (_, index) => (
            //Alarm Card Skeleton
            <GridItem>
              <Box
                w={"100%"}
                border="2px"
                borderColor="grey"
                borderRadius="10px"
                p={2}
                m={"2"}
              >
                <Skeleton my={2}>
                  <Box h={"25px"}></Box>
                </Skeleton>
                <hr />
                <SkeletonText my={2} />
              </Box>
            </GridItem>
          ))}
        </Grid>
      ) : (
        <Box
          backgroundColor={"primary.80"}
          borderRadius={"5px"}
          w={"100%"}
          p={2}
          minH={minH}
          minW={minW}
        >
          <Flex
            p={"1%"}
            justifyContent={"space-between"}
            gap={2}
            alignItems={"center"}
          >
            <Box w={children ? "30%" : "70%"} gap={2} as={Flex}>
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
            {columns.length !== 0 && (
              <GlobalFilter
                preGlobalFilteredRows={preGlobalFilteredRows}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
                width={"200px"}
              />
            )}
          </Flex>
          {columns.length !== 0 ? (
            <>
              {console.log("minH", minH)}
              <Box overflowY={"scroll"} overflowX={"scroll"} minH={minH}>
                <Table
                  h={"100%"}
                  color={"secondary.100"}
                  {...getTableProps()}
                  variant={"unstyled"}
                >
                  <Thead pos={"sticky"} top={"0"}>
                    {headerGroups.map((headerGroup, index) => (
                      <Tr key={index} {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column, i) => {
                          return column.id === "severity" ? (
                            <Th
                              mb={2}
                              textAlign={"center"}
                              color={"text.primary"}
                              opacity={0.8}
                              h={"10px"}
                              key={i}
                              {...column.getHeaderProps()}
                            >
                              <Flex textAlign={"center"}>
                                {column.render("Header")}
                                <IconButton
                                  ml={1}
                                  size={"xs"}
                                  bg={"transparent"}
                                  isDisabled
                                />
                              </Flex>
                            </Th>
                          ) : (
                            <Th
                              color={"text.primary"}
                              opacity={0.8}
                              textAlign={"center"}
                              h={"10px"}
                              key={i}
                              {...column.getSortByToggleProps()}
                            >
                              <Flex textAlign={"center"}>
                                {column.render("Header")}
                                <IconButton
                                  ml={1}
                                  size={"xs"}
                                  bg={"transparent"}
                                  icon={
                                    column.isSorted ? (
                                      column.isSortedDesc ? (
                                        <IconButton
                                          as={ArrowDownIcon}
                                          size={"50px"}
                                          bg={"transparent"}
                                          color={"text.primary"}
                                        />
                                      ) : (
                                        <IconButton
                                          as={ArrowUpIcon}
                                          size={"50px"}
                                          bg={"transparent"}
                                          color={"text.primary"}
                                        />
                                      )
                                    ) : (
                                      <IconButton
                                        as={BsArrowDownUp}
                                        size={"50px"}
                                        bg={"transparent"}
                                        color={"text.primary"}
                                      />
                                    )
                                  }
                                />
                              </Flex>
                            </Th>
                          );
                        })}
                      </Tr>
                    ))}
                  </Thead>

                  <Tbody {...getTableBodyProps()}>
                    {page.map((row, index) => {
                      prepareRow(row);
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
                            redirectToDevice
                              ? redirectToDevice(row.cells)
                              : null
                          }
                          key={index}
                          {...row.getRowProps()}
                          width={"100%"}
                        >
                          {row.cells.map((cell, index) => {
                            return (
                              <Td p={1} key={index} {...cell.getCellProps()}>
                                {cell.column.id !== "Acknowledge" &&
                                cell.column.id !== "edit" &&
                                cell.column.id !== "delete" &&
                                cell.column.id !== "Clear" &&
                                cell.column.id !== "severity" &&
                                cell.column.id !== "Geofence_Actions" &&
                                cell.column.id !== "Route_Actions" ? (
                                  <Box
                                    h={"50px"}
                                    textAlign={"start"}
                                    p={2}
                                    w={"max-content"}
                                  >
                                    {typeof cell.value !== "undefined"
                                      ? (() => {
                                          switch (cell.column.id) {
                                            case "current_status":
                                              return (
                                                cell.value
                                                  .charAt(0)
                                                  .toUpperCase() +
                                                cell.value.slice(1)
                                              );
                                            case "type":
                                              Type = cell.value.split(":")[0];
                                              return (
                                                cell.value
                                                  .charAt(0)
                                                  .toUpperCase() +
                                                cell.value
                                                  .split(":")[0]
                                                  .slice(1)
                                                  .replace(/_/g, " ")
                                              );
                                            case "details":
                                              if (Type === "CyLock Battery ") {
                                                const batteryMatch =
                                                  cell.value.match(
                                                    /Battery:(\d+\.\d+)/
                                                  );
                                                const resolveValueMatch =
                                                  cell.value.match(
                                                    /resolve_value:(\d+\.\d+)/
                                                  );

                                                if (
                                                  batteryMatch &&
                                                  resolveValueMatch
                                                ) {
                                                  return (
                                                    batteryMatch[1] +
                                                    " Resolve value: " +
                                                    resolveValueMatch[1]
                                                  );
                                                } else if (batteryMatch) {
                                                  return batteryMatch[1];
                                                } else if (resolveValueMatch) {
                                                  return (
                                                    " Resolve value: " +
                                                    resolveValueMatch[1]
                                                  );
                                                } else {
                                                  return "Invalid input string";
                                                }
                                              } else if (Type === "geofence") {
                                                return transformGeofenceString(
                                                  cell.value
                                                );
                                              } else if (
                                                Type === "undetected_tag"
                                              ) {
                                                const undetectedTagMatch =
                                                  cell.value.match(
                                                    /tag:(\w+):(\w+):(\w+):(\w+):(\w+)/
                                                  );
                                                const assignedCyCollectorUndetectedMatch =
                                                  cell.value.match(
                                                    /assigned_cycollector:(\d+)/
                                                  );
                                                let transformedString;
                                                if (undetectedTagMatch) {
                                                  const undetectedTag =
                                                    undetectedTagMatch[1] +
                                                    ":" +
                                                    undetectedTagMatch[2] +
                                                    ":" +
                                                    undetectedTagMatch[3] +
                                                    ":" +
                                                    undetectedTagMatch[4] +
                                                    ":" +
                                                    undetectedTagMatch[5];
                                                  transformedString = `${undetectedTag} ${assignedCyCollectorUndetectedMatch[1]}`;
                                                }
                                                return transformedString;
                                              } else if (
                                                Type === "CyTag Battery "
                                              ) {
                                                const batteryMatch =
                                                  cell.value.match(
                                                    /Battery:(\d+\.\d+)/
                                                  );
                                                const resolveValueMatch =
                                                  cell.value.match(
                                                    /resolve_value:(\d+\.\d+)/
                                                  );

                                                if (
                                                  batteryMatch &&
                                                  resolveValueMatch
                                                ) {
                                                  return (
                                                    batteryMatch[1] +
                                                    " Resolve value: " +
                                                    resolveValueMatch[1]
                                                  );
                                                } else if (batteryMatch) {
                                                  return batteryMatch[1];
                                                } else if (resolveValueMatch) {
                                                  return (
                                                    " Resolve value: " +
                                                    resolveValueMatch[1]
                                                  );
                                                } else {
                                                  return "Invalid input string";
                                                }
                                              } else if (Type === "tampering") {
                                                return cell.value.match(
                                                  /Tamper:(\d+)/
                                                )[1];
                                              } else if (
                                                Type === "threshold "
                                              ) {
                                                const thresholdTypeMatch =
                                                  cell.value.split(":")[0];
                                                const thresholdValueMatch =
                                                  cell.value.match(
                                                    /:(\d+\.\d+)/
                                                  ) ||
                                                  cell.value.match(/:(\d+)/);
                                                const resolveValueMatch =
                                                  cell.value.match(
                                                    /resolve_value:(\d+\.\d+)/
                                                  ) ||
                                                  cell.value.match(
                                                    /resolve_value:(\d+)/
                                                  );
                                                if (
                                                  thresholdTypeMatch &&
                                                  thresholdValueMatch &&
                                                  resolveValueMatch
                                                ) {
                                                  return `${thresholdTypeMatch}: ${thresholdValueMatch[1]} Resolve value: ${resolveValueMatch[1]}`;
                                                } else if (
                                                  thresholdTypeMatch &&
                                                  thresholdValueMatch
                                                ) {
                                                  return `${thresholdTypeMatch} ${thresholdValueMatch[1]}`;
                                                } else return "Error";
                                              }
                                              break;
                                            default:
                                              return cell.render("Cell");
                                          }
                                        })()
                                      : "-"}
                                  </Box>
                                ) : (
                                  // Severity, Acknowledge, Edit, Delete, Clear, Geofence_Actions, Route_Actions
                                  <Box
                                    display={"flex"}
                                    justifyContent={"center"}
                                    textAlign={"start"}
                                    fontSize={"sm"}
                                  >
                                    {cell.render("Cell")}
                                  </Box>
                                )}
                              </Td>
                            );
                          })}
                          {cytagsBtn && (
                            <Td>
                              {" "}
                              <IconButton
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  cytagsBtn(
                                    row.cells.find(
                                      (col) => col.column.Header === "IMEI"
                                    ).value
                                  );
                                }}
                                size={"sm"}
                                bg={"action.100"}
                                icon={
                                  <CyTagIcon
                                    boxSize={"30px"}
                                    display={"block"}
                                    margin={"auto"}
                                    p={"15%"}
                                    color={
                                      themeCtx.theme.colors &&
                                      themeCtx.theme.colors.text.primary
                                    }
                                  />
                                }
                                rounded={"full"}
                              />{" "}
                            </Td>
                          )}
                          {alarms && (
                            <>
                              <Td as={Flex} gap={2}>
                                <Button
                                  size={"sm"}
                                  bg={"danger.100"}
                                  icon={<MdClear color={"danger.100"} />}
                                  rounded={"full"}
                                  onClick={actionAlarmCall}
                                >
                                  Clear
                                </Button>
                                <Button
                                  size={"sm"}
                                  bg={"action.100"}
                                  icon={<MdVerified color={"danger.100"} />}
                                  rounded={"full"}
                                >
                                  Acknowledge
                                </Button>
                              </Td>
                            </>
                          )}
                          {deleteBtn && (
                            <Td>
                              <FunctionalModal
                                iconBtn={DeleteIcon}
                                modalMinH={"500px"}
                                btnColor={"danger.100"}
                                modalTitle={`Delete ${type}`}
                                btnAction={
                                  <Button
                                    bg={"danger.100"}
                                    color={"text.primary"}
                                    onClick={() =>
                                      deleteBtn(row.cells[0].value)
                                    }
                                  >
                                    Delete {type}
                                  </Button>
                                }
                              >
                                <Text>
                                  Are you sure you want to delete this {type}?
                                </Text>
                                <Tag
                                  size="lg"
                                  colorScheme="danger"
                                  borderRadius="full"
                                >
                                  <TagLabel>
                                    {row.cells[1].value} : {row.cells[0].value}
                                  </TagLabel>
                                </Tag>
                              </FunctionalModal>
                            </Td>
                          )}
                          {editBtn && (
                            <Td>
                              <FunctionalModal
                                modalMinH={"500px"}
                                iconBtn={AiFillEdit}
                                btnColor={"action.100"}
                                modalTitle={`Edit ${type}`}
                                btnAction={
                                  <Button
                                    bg={"primary.100"}
                                    color={"text.primary"}
                                    onClick={editBtn}
                                  >
                                    Edit {type}
                                  </Button>
                                }
                              >
                                <DeviceForm
                                  id={id}
                                  name={name}
                                  initialId={row.cells[0].value}
                                  initialName={row.cells[1].value}
                                  idLabel={idLabel}
                                  setName={setName}
                                  setId={setId}
                                />
                              </FunctionalModal>
                            </Td>
                          )}
                        </Tr>
                      );
                    })}
                    <Box h={"-moz-available"}></Box>
                  </Tbody>
                </Table>
              </Box>

              <Stack
                pos={"relative"}
                bottom={0}
                direction="row"
                padding={"10px"}
                justifyContent={"space-between"}
                borderTopWidth={2}
                borderColor={"secondary.100"}
              >
                <Stack direction="row" justifyContent={"space-between"}>
                  <IconButton
                    rounded="full"
                    bg={"transparent"}
                    color="secondary.100"
                    icon={<ArrowLeftIcon />}
                    size={"xs"}
                    onClick={() => gotoPage(0)}
                    isDisabled={!canPreviousPage}
                  />
                  <IconButton
                    rounded="full"
                    bg={"transparent"}
                    color="secondary.100"
                    icon={<ArrowBackIcon />}
                    size={"xs"}
                    onClick={() => previousPage()}
                    isDisabled={!canPreviousPage}
                  />
                  <IconButton
                    rounded="full"
                    bg={"transparent"}
                    color="secondary.100"
                    icon={<ArrowForwardIcon />}
                    size={"xs"}
                    onClick={() => nextPage()}
                    isDisabled={!canNextPage}
                  />
                  <IconButton
                    rounded="full"
                    bg={"transparent"}
                    color="secondary.100"
                    icon={<ArrowRightIcon />}
                    size={"xs"}
                    onClick={() => gotoPage(pageCount - 1)}
                    isDisabled={!canNextPage}
                  />
                </Stack>
                <Text color={"text.primary"} fontSize="sm">
                  Page {pageIndex + 1} of {pageOptions.length}
                </Text>
                <Box>
                  <Text color={"text.primary"} fontSize="sm">
                    Go to page:
                  </Text>
                </Box>
                <Box>
                  <Input
                    type="number"
                    size={"xs"}
                    bg={"primary.100"}
                    color={"secondary.100"}
                    defaultValue={pageIndex + 1}
                    borderWidth={"0px"}
                    borderRadius={"10px"}
                    onChange={(e) => {
                      const page = e.target.value
                        ? Number(e.target.value) - 1
                        : 0;
                      gotoPage(page);
                    }}
                    style={{ width: "50px" }}
                  />
                </Box>
                <Box>
                  <StyledSelect
                    size={"xs"}
                    options={[
                      { value: 3, label: "3" },
                      { label: "5", value: 5 },
                      { value: 10, label: "10" },
                      { value: 12, label: "12" },
                      { value: 15, label: "15" },
                      { value: 20, label: "20" },
                      { value: 25, label: "25" },
                      { value: 30, label: "30" },
                      { value: 35, label: "35" },
                      { value: 40, label: "40" },
                      { value: 45, label: "45" },
                      { value: 50, label: "50" },
                    ]}
                    value={pageSize}
                    onchange={(res) => setPageSize(parseInt(res))}
                  />
                </Box>
              </Stack>
            </>
          ) : (
            <>
              <Center my={4}>
                <Text
                  color={"text.primary"}
                  fontSize={"xl"}
                  fontWeight={"bold"}
                  textAlign={"center"}
                >
                  There is no data to display
                </Text>
              </Center>
              <Center mt={10} mb={5}>
                <Image
                  src={themeCtx.darkMode ? NoDataVectorDark : NoDataVectorLight}
                  alt="No Data Vector"
                  height="300px"
                ></Image>
              </Center>
            </>
          )}
        </Box>
      )}
    </>
  );
}

export default ComplexTable;
