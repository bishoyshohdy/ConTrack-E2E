/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from "react";
import {mapThreatToColor} from "../../../helpers/array-map"
import {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
    SimpleGrid,
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
    Card, CardHeader, CardBody, CardFooter,
    Image,
    CloseButton,
    Spinner,
    Skeleton,
    SkeletonCircle,
    SkeletonText,
    Grid,
    GridItem,
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
  WarningTwoIcon
} from "@chakra-ui/icons";
import { Icon,  CheckCircleIcon  } from "@chakra-ui/icons";

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
import { FiUnlock, FiLock } from 'react-icons/fi';




function AlarmTable({
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
  CreateDevice,
  allCytags,
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
{  // hiddenCols = [...hiddenCols, "cycollector_id", "roles"];
  // const themeCtx = useContext(ThemeContext);
  // const columns = React.useMemo(
  //   () =>
  //     reverse
  //       ? [...extractFn(data, hiddenCols).reverse()]
  //       : [
  //           ...extractFn(data, hiddenCols),
  //           {
  //             Header: "Cytag",
  //             accessor: "cytag", // Assuming "cytag" is the property containing Cytag information
  //             Cell: ({ value }) => (
  //               <Tag size="md" colorScheme="teal">
  //                 <TagLabel>{value}</TagLabel>
  //               </Tag>
  //             ),
  //           },
  //         ],
  //   [data]
  // );
}


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

  const [LoadingElapsed, setLoadingElapsed] = useState(true);
  setTimeout(() => {
    setLoadingElapsed(false);
  }, 1200);




// console.log("Loading", isLoading)

  return (
    <>
      {isLoading || LoadingElapsed ? (
        <Grid templateColumns='repeat(4, 1fr)' gap={4} mx={6}>
        {Array.from({ length: 7 }, (_, index) => (
        //Alarm Card Skeleton
        <GridItem>
        <Box 
        w={'100%'}
        border='2px'
        borderColor='grey'
        borderRadius='10px'
        p={3}
        m={'2'}
        >
        <SkeletonCircle size={12}/>
        <Skeleton my={2}>
          <Box h={'25px'}></Box>
        </Skeleton>
        <hr />
        <SkeletonText my={3} />
        <SkeletonText my={3} />
        <Flex justifyContent={'end'}>
        <SkeletonCircle size={12}/>
        </Flex>
        <SkeletonText my={3}/>
        </Box>
        </GridItem>
        ))}
        </Grid>
// END OF LOADING
    ) : (
      <Box
        backgroundColor={"primary.80"}
        borderRadius={"5px"}
        w={"100%"}
        p={2}
        minH={columns.length !== 0 ? "555px" : minHEmpty}
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
            <Box  overflowY={"scroll"} h={"430px"}>
            <Table
                mb={'10px'}
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

            {/* Card Grid */}
            <SimpleGrid 
            spacing={4} 
            templateColumns='repeat(auto-fill, minmax( 260px, 24% ))'
            {...getTableBodyProps()}>
                
                   {page.map((row, index) => {
                    prepareRow(row);
                    let severity, entity, type, min, max, details,startTime,updatedTime,ack,clear; // Declare variables here
                    row.cells.forEach((cell, cellIndex) => {
                      switch (cellIndex) {
                        case 0: severity = cell.value; break;
                        case 1: entity = cell.value; break;
                        case 2: type = cell.value; break;
                        case 3: min = cell.value; break;
                        case 4: max = cell.value; break;
                        case 5: details = cell.value; break;
                        case 6: startTime = cell.value; break;
                        case 7: updatedTime = cell.value; break;
                        case 8: ack = cell.value; break;
                        case 9: clear = cell.value; break;
                      }
                    });

                    let alarmColor= mapThreatToColor(severity);
                    
                  return(
                    <Card 
                    bg={'#2d3748'}
                    color="secondary.100"
                    width={'100%'}
                    border="2px solid " 
                    borderColor={alarmColor}

                    _hover={{
                      backgroundColor: "primary.100",
                    }}

                    cursor={redirectToDevice ? "pointer" : "default"}

                    onClick={() =>
                      redirectToDevice ? redirectToDevice(row.cells) : null
                    }

                    key={index}
                    {...row.getRowProps()}
                   >
                    
                    
                    
                      <CardHeader
                      pb={'10px'} >
                      <Flex justifyContent={'flex-end'}>
                      {/* <CloseButton onClick={actionAlarmCall}/> */}
                      </Flex>


                      <Flex alignItems={'center'} >
                      <WarningTwoIcon color={alarmColor} fontSize={'25px'} m={'10px'}/>
                        <Heading size='md' mb={'10px'}> 
                        {console.log("severity",type)}
                           {type} <br/>
                            <Text as='cite' fontSize={'14px'} fontWeight="normal"> {severity} severity</Text>
                        </Heading>
                        
                      </Flex>
                      
                      <hr style={{ width: '60%', color: 'blue' }} />
                      
                      </CardHeader>
                      
                    <CardBody mb={0}>
                    
                        <Text as={'abbr'}> Entity: {entity}  <br/>
                        { min !== '-' || max !== '-' && type === "CyTag Battery : Battery" ? 
                         <Text as={'abbr'}>
                        Battery's Max Range: {max}
                        
                        <br/>
                        </Text>  
                       :
                        <Text></Text>
                        
                   }
                   
                    { min !== '-' || max !== '-' && type !== "CyTag Battery : Battery" ? 
                         <Text as={'abbr'}>
                       Normal Range:{min},{max}
                       
                        <br/>
                        </Text>
                        :<Text></Text>
                   }
                        {details}
                      
                      
                         </Text>
                         
                    </CardBody>

                      <CardFooter as={'Flex'} p={'5%'}   >
                      <Flex alignItems={'right'} w={'100%'}>
                        <Text as={'abbr'}>
                        Updated Time:{updatedTime} 
                        </Text>
                        <Spacer/>
                        <Box
                                as={'Flex'}
                                justifyContent={'center'}
                                alignItems= {'center'}
                                size={"sm"}
                                bg={alarmColor}
                                rounded={"full"}
                                w = {'50px'}
                                h = {'50px'}
                                title={"Acknowledge Alert"}
                                p={"5px"}
                              >
                                <MdVerified color={"white"} fontSize={"40px"}  />
                        
                        </Box>
                        
                      </Flex>

                      </CardFooter>
                      
                    </Card>
                  )
  
                })}
            </SimpleGrid>
             {/* /Card Grid */}

             
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
    )}
    </>
  );
}

export default AlarmTable;
