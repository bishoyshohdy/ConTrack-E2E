/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from "react";
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
  Image
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
import { FiUnlock, FiLock } from 'react-icons/fi';
import container_side from '../../../assets/images/resources/container_side.png';




function CardTable({
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
  allCytags

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
  // hiddenCols = [...hiddenCols, "cycollector_id", "roles"];
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
                    let imei, namez, locked, vals, loc, attached,cytagKOKO; // Declare variables here
                
                    row.cells.forEach((cell, cellIndex) => {
                      switch (cellIndex) {
                        case 0: imei = cell.value; break;
                        case 1: namez = cell.value; break;
                        case 2: locked = cell.value; break;
                        case 3: loc = cell.value; break;
                        case 4: attached = cell.value; break;
                        case 5: cytagKOKO = cell.value; break;

                      }
                    });
                      
                  return(
                    <Card 
                    bg={'#2d3748'}
                    color="secondary.100"
                    width={'100%'}
                    border="1px solid #2d3748" 

                    _hover={{
                      backgroundColor: "primary.100",
                      borderColor: "primary.60",
                    }}

                    cursor={redirectToDevice ? "pointer" : "default"}


                    // onClick={(e) => {
                    //   e.preventDefault();
                    //   e.stopPropagation();
                    //   cytagsBtn(
                    //     row.cells.find(
                    //       (col) => col.column.Header === "IMEI"
                    //     ).value
                    //   );
                    // }}



                    onClick={() =>
                      redirectToDevice ? redirectToDevice(row.cells) : null
                    }



                    key={index}
                    {...row.getRowProps()}
                   >
                    
                    
                      
                      
                      <CardHeader
                      pb={'10px'}>
                      <Flex alignItems={'center'}>
                        <Heading size='md' mb={'10px'}> {namez}</Heading>
                        <Spacer/>
                        {{locked}? 
                        <div style={{ color: 'green' , marginLeft: 'auto' ,display: 'flex', alignItems: 'center', justifyContent:'center' }}> 
                          <FiLock/>
                          <Text fontSize='lg' ml={'3px'}> Locked</Text> 
                        </div>  
                        : <div style={{ color: 'red' , marginLeft: 'auto' ,display: 'flex', alignItems: 'center' }}>
                            <FiUnlock/>
                            <Text fontSize='lg' ml={'3px'}> Unlocked</Text>
                          </div> }
                      </Flex>
                      <hr style={{ width: '60%', color: 'blue' }} />
                      
                      </CardHeader>
                           
                      <CardBody
                      pt={'10px'} 
                      pb={'0px'}
                      pr={'0px'}>

                        <Text as={'abbr'}> IMEI: {imei}  <br/>
                        Last Location Type: {loc} <br/>
                      
                      <Box  onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      cytagsBtn(
                        row.cells.find(
                          (col) => col.column.Header === "IMEI"
                        ).value
                      );
                      const sectionElement = document.getElementById("connected_cytags"); // Replace with the actual ID of the section
                      if (sectionElement) {
                        sectionElement.scrollIntoView({ behavior: "smooth" }); // Use smooth scrolling for a nicer effect
                      }
                    }}
                    _hover={{
                      color: "card.100",
                      textDecoration:"underline"
                      
                    }}
                    style={{ 
                      color:"#9b29e7"
          
                    }}

                     > Connected Cytags

                      </Box>

                         </Text>
                        </CardBody>

                      <CardFooter
                      pb={'0px'}
                      pr={'0px'}
                      pt={'10px'}>
                      <Flex
                      mt={'5%'} w= {"100%"}>
                        <Text as={'abbr'}> Attached To: {attached} </Text>
                        <Spacer/>
                        <Image
                          objectFit='cover'
                          src= {container_side}
                          alt='Chakra UI'
                          width={'60%'}
                          p={0}
                        />
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
    </>
  );
}

export default CardTable;
