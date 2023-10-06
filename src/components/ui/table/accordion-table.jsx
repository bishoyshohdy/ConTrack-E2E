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
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Grid, 
  GridItem ,
  Collapse
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
  AddIcon
} from "@chakra-ui/icons";
import { extractHeaders, flattenObject } from "../../../helpers/array-map";
import {
  usePagination,
  useSortBy,
  useGlobalFilter,
  useTable,
} from "react-table";
import CyLockIcon from "../../ui/icon/cylock-icon";
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
import {switchMainHeader} from "../../../helpers/array-map" /* makes cytag chip*/
import './accordion-table.css'


function AccordionTable({
  reverse = false,
  minHEmpty = "150px",
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
  CreateDevice

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
      autoResetPageIndex:false,
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
      console.log("page is now", pageNumber);
      if (pageIndex) {
        setPageNumber(pageIndex);
      }
    } else {
      console.log("PAGE IS UNDIFINED");
    }
  }, [pageIndex]);
  
  useEffect(()=>{

  },[])


  return (
    <>
      <Box
        backgroundColor={"primary.80"}
        borderRadius={"5px"}
        w={"100%"}
        p={2}
        
        // minH={columns.length !== 0 ? "200px" : minHEmpty}
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
            <Box overflowX={"scroll"} overflowY={"scroll"} h={"100%"}>
              <Table
                // h={"%"}
                color={"secondary.100"}
                {...getTableProps()}
                variant={"unstyled"}
              >
                <Thead pos={"sticky"} top={"0"} bg={"primary.80"}>
                  {headerGroups.map((headerGroup, index) => (
                    <Tr
                      bg={"primary.100"}
                      key={index}
                      {...headerGroup.getHeaderGroupProps()}
                    >
                      {headerGroup.headers.map((column, i) => {
                        return column.id === "severity" ? (
                          <Th
                            mb={2}
                            textAlign={"center"}
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
                                      <IconButton as={ArrowDownIcon} size={'50px'} bg={'transparent'} color={'text.primary'} />
                                    ) : (
                                      <IconButton as={ArrowUpIcon} size={'50px'} bg={'transparent'} color={'text.primary'} />
                                    )
                                  ) : (
                                    <IconButton as={BsArrowDownUp} size={'50px'} bg={'transparent'} color={'text.primary'} />
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
                </Table>
                {/* start */}
                <Accordion {...getTableBodyProps()}
                defaultIndex={[0]} 
                allowMultiple
                allowToggle
                >
                  {page.map((row, index) => {
                    prepareRow(row);
                    return (
                    <>

                    {/* Access Normally */}
                    {/* name  .cells[0].column.Header*/}
                    {console.log("test0",row)}
                    {/* gps */}
                    {console.log("test1",row.cells[1].value)}
                    {/* id */}
                    {console.log("test2",row.cells[2].value)}
                    {/*  */}
                    {console.log("test3",row.cells[3].value[0])}
                    {/*  */}
                    { row.cells[4].value===null ? console.log("null") : console.log("test4",row.cells[4].value)}  
                    
                    <AccordionItem 
                            key={index}
                            rounded={5}
                            // {...cell.getCellProps()}
                            {...row.getRowProps()}
                          >

                    {({ isExpanded }) => (
                          <>
                    <AccordionButton 
                    rounded={5}
                    
                      _expanded={{ bg: 'card.100', color: 'white', p:'20px', }}
                     >

                      
                      {isExpanded ? (
                        <>

                        <Box  as="span" flex='1' textAlign='left' className="slide-right-animation ">
                          {row.cells[0].value}
                        </Box>
                        <MinusIcon fontSize='20px' />
                        </>
                      ) : (
                        <>
                        {/* <CyLockIcon
                        margin={"auto"}
                        mx={"5px"}
                        p={"auto"}
                        w={"20px"}
                        color={themeCtx.theme.colors && themeCtx.theme.colors.text.primary}
                      /> */}
                        <Box fontSize='20px' as="span" flex='1' textAlign='left' className="slide-left-animation" p={"5px"} >
                          {row.cells[0].value}
                        </Box>
                        <Box>
                          <AddIcon fontSize='12px' />
                          <Text fontSize='xs'> View More Info </Text>
                        </Box>
                        </>
                      )}
                    </AccordionButton>
                    <AccordionPanel 
                    p={10}
                    key={index}
                    py={4}>
                      <Grid
                        h='200px'
                        templateRows='repeat(2, 1fr)'
                        templateColumns='repeat(11, 1fr)'
                        gap={5}
                      >
                        <GridItem rowSpan={2} colSpan={2} p={2} rounded={5} >
                        <Flex justify="center" align="center" h="100%">
                          <CyLockIcon
                            margin={"auto"}
                            p={"auto"}
                            w={"100px"}
                            className={isExpanded ? "slide-in-animation" : ""}
                            color={themeCtx.theme.colors && themeCtx.theme.colors.text.primary}
                            transform="rotate(20deg)"
                          />
                        </Flex>
                        </GridItem>
                        <GridItem colSpan={3} bg='primary.100' p={2} rounded={5}>
                        <Stack spacing={0}> 
                        <Text as={'samp'}>
                            {row.cells[2].column.Header}
                          </Text>
                          <Text  as='abbr' textAlign={'center'} fontSize='3xl'>
                            {row.cells[2].value}
                          </Text>
                        </Stack>
                        </GridItem>
                        <GridItem colSpan={3} bg='primary.100' p={2} rounded={5}>
                        <Stack spacing={0}> 
                          <Text as={'samp'}>
                            {row.cells[1].column.Header}
                          </Text>
                          <Text  as='abbr' textAlign={'center'} fontSize='3xl'>
                            {row.cells[1].value}
                          </Text>
                        </Stack>
                        </GridItem>
                        <GridItem colSpan={3} bg='primary.100' p={2} rounded={5}>
                        <Stack spacing={0}> 
                        <Text as={'samp'}>
                            {row.cells[4].column.Header}
                          </Text>
                          <Text  as='abbr' textAlign={'center'} fontSize='3xl'>
                            {row.cells[4].value || "-"}
                          </Text>
                        </Stack>
                        </GridItem>
                        <GridItem colSpan={9} bg='primary.100' p={2} rounded={5}>
                          <Stack spacing={2}>
                          <Text as={'samp'}>
                              {row.cells[3].column.Header}
                          </Text >
                          <Box  px={10}>
                            {switchMainHeader('myCytags', row.original.id )}
                          </Box>
                          </Stack>
                        </GridItem>
                      </Grid>
                    </AccordionPanel >  
                    </>
                    )}


                    
                    </AccordionItem>


                    </>
  
                    );
                  })}
                  <Box h={"-moz-available"}></Box>
                </Accordion>
                {/* end */}
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
          <Center color={"text.primary"}>There are no data to display</Center>
        )}
      </Box>
    </>
  );
}

export default AccordionTable;