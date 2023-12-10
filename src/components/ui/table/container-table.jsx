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
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerCloseButton,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  TabPanels,
  TabIndicator,
  Avatar,
  Textarea,
  Tooltip,
  ButtonGroup,
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
  TimeIcon,
  ChatIcon,
} from "@chakra-ui/icons";
import { extractHeaders, flattenObject } from "../../../helpers/array-map";
import {
  useTable,
  useGlobalFilter,
  useSortBy,
  usePagination,
  useRowSelect,
  useBlockLayout,
  useResizeColumns,
  useDraggable,
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
import { ExtractContainerHeaders } from "../../../helpers/array-map";
import { FaEye, FaFileExcel, FaFilePdf, FaFileImage } from "react-icons/fa";

const MessageComponent = ({ containerName, updates }) => {
  return (
    <Box>
      {updates.map((update, index) => (
        <Box
          key={index}
          mt={4}
          border={"1px solid #D0D4E4"}
          borderRadius={"10px"}
          p={4}
        >
          <Flex justifyContent={"space-between"}>
            <Flex mb={4}>
              <Avatar
                bg={"grey"}
                color={"white"}
                size={"md"}
                name={update.user}
              />
              <Text my={2} mx={4} fontSize={"xl"} color={"#0073EA"}>
                {update.user}
              </Text>
            </Flex>
            <Flex>
              <Text opacity={"0.7"}>{update.date}</Text>
              <IconButton
                ml={2}
                size={"xs"}
                bg={"transparent"}
                icon={<TimeIcon />}
                isDisabled
                _hover={{ cursor: "default" }}
              />
            </Flex>
          </Flex>

          <Text fontSize={"lg"} mx={2}>
            {update.message}
          </Text>
          <Flex justifyContent={"flex-end"} my={3} mx={2}>
            <IconButton
              size={"xs"}
              bg={"transparent"}
              icon={<FaEye />}
              isDisabled
              _hover={{ cursor: "default" }}
            />
            <Text ml={2} fontStyle="italic" opacity={"0.7"}>
              {update.seenCount} Seen
            </Text>
          </Flex>

          <Button
            rounded={0}
            p={0}
            m={0}
            w={"100%"}
            border={"1px solid #D0D4E4"}
            bg={"primary.80"}
            color={"text.primary"}
            _hover={{ bg: "primary.60" }}
            onClick={() => {
              document.getElementById(`reply${index}`).focus();
            }}
          >
            <ChatIcon />
            <Text ml={2}>Reply</Text>
          </Button>

          <Box ml={4} mt={2}>
            {update.replies.map((reply, replyIndex) => (
              <>
                <Flex mt={4} mb={1}>
                  <Avatar
                    bg={"grey"}
                    color={"white"}
                    size={"md"}
                    mx={2}
                    name={reply.user}
                  />
                  <Box p={3} key={replyIndex} rounded={"10px"} bg={"#F6F7FB"}>
                    <Text fontSize={"md"} mb={2} color={"#0073EA"}>
                      {reply.user}
                    </Text>
                    <Text fontSize={"md"}>{reply.reply}</Text>
                  </Box>
                </Flex>
                <Flex ml={20}>
                  <IconButton
                    size={"xs"}
                    bg={"transparent"}
                    icon={<FaEye />}
                    isDisabled
                    _hover={{ cursor: "default" }}
                  />
                  <Text fontStyle="italic" opacity={"0.7"}>
                    {reply.seenCount} Seen
                  </Text>
                  <Text mx={2} opacity={"0.7"}>
                    {" "}
                    |{" "}
                  </Text>
                  <Text ms={1} opacity={"0.7"}>
                    <TimeIcon me={2} />
                    {reply.date}
                  </Text>
                </Flex>
              </>
            ))}
          </Box>
          <Flex my={3} mx={2}>
            {/* Reply input & user avatar */}
            <Avatar
              bg={"grey"}
              mx={4}
              color={"white"}
              size={"md"}
              name={"User Name"}
            />
            <Textarea
              id={`reply${index}`}
              ml={2}
              my={2}
              w={"70%"}
              bg={"primary.80"}
              color={"text.primary"}
              placeholder={"Reply"}
              border={"1px solid #D0D4E4"}
              borderRadius={"10px"}
            />
          </Flex>
          <Button
            ml={"70%"}
            w={"10%"}
            bg={"action.80"}
            color={"white"}
            _hover={{ bg: "primary.60" }}
          >
            Send
          </Button>
        </Box>
      ))}
    </Box>
  );
};

const FilesComponent = ({ containerName, files }) => {
  return (
    <Grid 
      templateColumns={
        files.length > 1 ? 
        "repeat(3 , 1fr)" : 
        "repeat(1, 1fr)"
      } 
      gap={4}
    >
      {files.map((file, index) => (
          <Box minW={"100px"} minH={"250px"} bg={"primary.100"} rounded={"10px"} p={4} >
              <Text fontSize={"xl"} color={"#0073EA"}>
                {file.fileName}
              </Text>
              <Flex>
                <Text opacity={"0.7"}>{file.date}</Text>
                <IconButton
                  ml={2}
                  size={"xs"}
                  bg={"transparent"}
                  icon={<TimeIcon />}
                  isDisabled
                  _hover={{ cursor: "default" }}
                />
              </Flex>
              <Center my={4}>
              {file.fileType === "pdf" ? (
              <FaFilePdf name="file" size={"150px"} color={"#0073EA"} />
            ) : file.fileType === "xls" ? (
              <FaFileExcel name="file" size={"150px"} color={"#0073EA"} />
            ) : file.fileType === "jpg" ? (
              <FaFileImage name="file" size={"150px"} color={"#0073EA"} />)
              : null}
              </Center>

            <ButtonGroup w={"100%"}>
            <Button
              rounded={"10px"}
              p={0}
              m={0}
              w={"100%"}
              border={"1px solid #D0D4E4"}
              bg={"primary.80"}
              color={"text.primary"}
              _hover={{ bg: "primary.60" }}
              
              
            >
              <a href={file.location.uri} download={file.fileName}>Download</a>
            </Button>
            <Button
              rounded={"10px"}
              p={0}
              m={0}
              w={"100%"}
              border={"1px solid #D0D4E4"}
              bg={"primary.80"}
              color={"text.primary"}
              _hover={{ bg: "primary.60" }}
              onClick={() => {
                // Implement this
              }}
            >Delete
            </Button>
            </ButtonGroup>
              
          </Box>
      ))}
    </Grid>
  );
};

function ContainerDrawer({
  isOpen,
  onClose,
  children,
  updatesData,
  filesData,
}) {
  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size={"xl"}>
      <DrawerOverlay />
      <DrawerContent bg={"primary.80"} color={"text.primary"}>
        <DrawerCloseButton />
        <DrawerHeader>
          <Heading size={"md"}>{updatesData.containerName}</Heading>
        </DrawerHeader>

        <DrawerBody>
          <Tabs variant="enclosed" colorScheme="primary" isFitted>
            <TabList>
              <Tab>Updates</Tab>
              <Tab>Files</Tab>
            </TabList>
            {/* <TabIndicator
              mt="-1.5px"
              height="2px"
              bg="action.80"
              borderRadius="1px"
            /> */}
            <TabPanels>
              <TabPanel>
                <MessageComponent updates={updatesData.updates} />
              </TabPanel>
              <TabPanel>
                <FilesComponent files={filesData.files} />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}

function ContainerTable({
  reverse = false,
  minH = "550px",
  flatten = false,
  extractFn = ExtractContainerHeaders,
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
  updates,
  files,
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
    headerGroupProps,
    rows,
    onDragEnd,
    allColumns,
  } = useTable(
    {
      columns,
      data: flatten && flatData ? flatData : data,
      initialState: {
        pageIndex: pageNumber ? pageNumber : 0,
        pageSize: 10,
        globalFilter: "",
        hiddenColumns: [...hiddenCols, "id"],
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

  const [LoadingElapsed, setLoadingElapsed] = useState(true);
  setTimeout(() => {
    setLoadingElapsed(false);
  }, 1200);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [containerUpdates, setContainerUpdates] = useState({});
  const [containerFiles, setContainerFiles] = useState({});

  const handleRowClick = (containerName) => {
    setIsDrawerOpen(true);
    const containerUpdates = updates.find(
      (update) => update.containerName === containerName
    );
    setContainerUpdates(containerUpdates);

    const containerFiles = files.find(
      (file) => file.ContainerName === containerName
    );

    setContainerFiles(containerFiles);
  };

  return (
    <>
      {isLoading || LoadingElapsed ? (
        <>
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
              <Box w={"70%"} gap={2} as={Flex}>
                <Skeleton height="20px" width="30px" />
                <Heading w={"100%"} color={"text.primary"} fontSize={"xl"}>
                  <Skeleton height="20px" width="80%" />
                </Heading>
              </Box>
              {/* Skeleton for create device button */}
              <Skeleton height="30px" width="80px" />
            </Flex>
            {/* Skeleton for global filter */}
            <Skeleton height="20px" width="200px" />
            {/* Skeleton for table */}
            <Table size={"sm"}>
              <Thead>
                <Tr>
                  {/* Skeleton for table headers */}
                  <Th>
                    <Skeleton height="20px" width="50%" />
                  </Th>
                  <Th>
                    <Skeleton height="20px" width="50%" />
                  </Th>
                  {/* Add more Th elements as needed */}
                </Tr>
              </Thead>
              <Tbody>
                {/* Skeleton for table rows */}
                <Tr>
                  <Td>
                    <Skeleton height="20px" width="50%" />
                  </Td>
                  <Td>
                    <Skeleton height="20px" width="50%" />
                  </Td>
                  {/* Add more Td elements as needed */}
                </Tr>
              </Tbody>
            </Table>
            {/* Skeleton for pagination */}
            <Stack
              pos={"relative"}
              bottom={0}
              direction="row"
              padding={"10px"}
              justifyContent={"space-between"}
              borderTopWidth={2}
              borderColor={"secondary.100"}
            >
              {/* Skeleton for pagination controls */}
              <Skeleton height="20px" width="30px" />
              {/* Skeleton for page info */}
              <Text color={"text.primary"} fontSize="sm">
                <Skeleton height="20px" width="60px" />
              </Text>
              {/* Skeleton for go to page input */}
              <Input
                type="number"
                size={"xs"}
                bg={"primary.100"}
                color={"secondary.100"}
                defaultValue={1}
                borderWidth={"0px"}
                borderRadius={"10px"}
                onChange={() => {}}
                style={{ width: "50px" }}
              />
              {/* Skeleton for page size select */}
              <Skeleton height="20px" width="50px" />
            </Stack>
          </Box>
        </>
      ) : (
        <Box
          backgroundColor={"primary.80"}
          borderRadius={"5px"}
          w={"100%"}
          p={2}
          minH={minH}
          minW={minW}
        >
          <ContainerDrawer
            isOpen={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
            updatesData={containerUpdates}
            filesData={containerFiles}
          />
          <Flex
            p={"1%"}
            justifyContent={"space-between"}
            gap={2}
            alignItems={"center"}
          >
            <Box w={children ? "30%" : "70%"} gap={2} as={Flex}>
              <Heading w={"100%"} color={"text.primary"} fontSize={"xl"}>
                {title}
              </Heading>
            </Box>
            {CreateDevice}
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
              <Box
                overflowY={"scroll"}
                overflowX={"scroll"}
                // scroll color
                style={{
                  "&::-webkit-scrollbar": {
                    width: "10px",
                  },
                  "&::-webkit-scrollbar-track": {
                    backgroundColor: "red",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "#444 !important",
                  },
                }}
                minH={minH}
              >
                <Table
                  h={"100%"}
                  color={"secondary.100"}
                  {...getTableProps()}
                  size={"sm"}
                >
                  <Thead pos={"sticky"} top={"0"} 
                  borderBottom="2px"
                  borderColor="action.80"
                  >
  {headerGroups.map((headerGroup, index) => (
    <Tr key={index} {...headerGroup.getHeaderGroupProps()} >
      {headerGroup.headers.map((column, i) => (
        <Th
          color={"text.primary"}
          opacity={0.8}
          h={"10px"}
            key={i}
          {...column.getSortByToggleProps()}
          style={{
            textAlign: "center",
            maxWidth: "200px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {column.render("Header")}
        </Th>
      ))}
    </Tr>
  ))}
</Thead>


                  <Tbody {...getTableBodyProps()}>
                    {page.map((row, index) => {
                      prepareRow(row);
                      return (
                        <Tr
                          h={"10px"}
                          borderBottom="1px"
        borderColor="secondary.100"
        
                          _hover={{
                            backgroundColor: "primary.100",
                            borderColor: "primary.60",
                          }}
                          cursor={"pointer"}
                          key={index}
                          {...row.getRowProps()}
                          width={"100%"}
                        >
                          {row.cells.map((cell, index) => {
                            return (
                              <Td p={1} key={index} {...cell.getCellProps()} >
                                <Box
                                  display={"flex"}
                                  justifyContent={"center"}
                                  textAlign={"start"}
                                  fontSize={"sm"}
                                  minW={"max-content"}
                                  w={"100%"}
                                >
                                  {index === 0 ? (
                                    <Tooltip
                                      label={"Open" + " " + cell.value}
                                      hasArrow
                                      placement={"top"}
                                      color={"white"}
                                      bg={"action.80"}
                                      rounded={"10px"}
                                    >
                                      <Center
                                        w={"100%"}
                                        h={"40px"}
                                        onClick={() => {
                                          handleRowClick(row.original.name);
                                        }}
                                      >
                                        {cell.render("Cell")}
                                      </Center>
                                    </Tooltip>
                                  ) : (
                                    cell.render("Cell")
                                  )}
                                </Box>
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

export default ContainerTable;
