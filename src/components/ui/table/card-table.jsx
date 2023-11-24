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
  Image,
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
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";




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
  allCytags,
  isLoading,
  toggleDrawer

}) {
  const [flatData, setFlatData] = useState(data);
  const [locks , setLocks] = useState([]);
  const [selectedColumn, setSelectedColumn] = useState(null);

  useEffect(() => {
    let tmpLocks = [];
    //devide data into 10s

    for(let i = 0; i < data.length; i++)
    {
      if(i % 8 === 0)
      {
        tmpLocks.push([]);
      }
      tmpLocks[tmpLocks.length - 1].push(data[i]);
    }
    setLocks(tmpLocks);
  }, [data]) ;

 


  // useEffect(() => {
  //   if (flatten) {
  //     setFlatData([...data].map((obj) => flattenObject(obj)));
  //   }
  // }, [data]);
  const columns = React.useMemo(
    () =>
      reverse
        ? [...extractFn(data, hiddenCols).reverse()]
        : [...extractFn(data, hiddenCols)],
    [data]
  );

  
  // const {
  //   getTableProps,
  //   getTableBodyProps,
  //   headerGroups,
  //   prepareRow,
  //   page,
  //   canPreviousPage,
  //   canNextPage,
  //   pageOptions,
  //   pageCount,
  //   gotoPage,
  //   nextPage,
  //   previousPage,
  //   setPageSize,
  //   state: { pageIndex, pageSize, globalFilter, hiddenColumns },
  //   visibleColumns,
  //   preGlobalFilteredRows,
  //   setGlobalFilter,
  // } = useTable(
  //   {
  //     columns,
  //     data: flatten && flatData ? flatData : data,
  //     manualPagination: false,
  //     manualSortBy: false,
  //     autoResetPage: false,
  //     autoResetSortBy: false,
  //     autoResetPageIndex:false,
  //     initialState: {
  //       pageIndex: pageNumber ? pageNumber : 0,
  //       pageSize: 5,
  //       globalFilter: "",
  //       hiddenColumns: [...hiddenCols, "cycollector_id", "roles"],
  //     },
  //   },
  //   useGlobalFilter,
  //   useSortBy,
  //   usePagination
  // );
  // useEffect(() => {
  //   if (pageNumber != undefined) {
  //     if (pageIndex) {
  //       setPageNumber(pageIndex);
  //     }
  //   }
  // }, [pageIndex]);
  
  // useEffect(()=>{

  // },[])

  const [LoadingElapsed, setLoadingElapsed] = useState(true);
  setTimeout(() => {
    setLoadingElapsed(false);
  }, 1200);



  const handleColumnSelect = (selected) => {
    setSelectedColumn(selected);
    console.log("selected", selected);
  
    const sortedData = [...data].sort((a, b) => {
      const valueA = a[selected];
      const valueB = b[selected];
  
      return valueA - valueB;
    });
  
    let tmpLocks = [];
    for (let i = 0; i < sortedData.length; i++) {
      if (i % 8 === 0) {
        tmpLocks.push([]);
      }
      tmpLocks[tmpLocks.length - 1].push(sortedData[i]);
    }
    setLocks(tmpLocks);
  };
  
  

  return (
    <>
      {isLoading || LoadingElapsed ? (
        <Grid templateColumns='repeat(4, 1fr)' gap={4} mx={6}>
        {Array.from({ length: 8 }, (_, index) => (
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
            p={0}
            justifyContent={"space-between"}
            gap={2}
            alignItems={"center"}
          >
            <Box w={children ? "30%" : "70%"} gap={2} as={Flex} px={4}>
              {icon}
              <Heading w={"100%"} color={"text.primary"} fontSize={"2xl"}>
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
                // preGlobalFilteredRows={preGlobalFilteredRows}
                // globalFilter={globalFilter}
                // setGlobalFilter={setGlobalFilter}
                width={"200px"}
              />
            )} */}
            
          </Flex>
          
          {columns.length !== 0 ? (
            <>
            
              <Box my={2}
              bg={'111'}
              >
                
                <Box
                display={'flex'}
                justifyContent={'end'}
                alignItems={'center'}
                m={5}
                >
                <Text fontSize={'lg'} color={'white'} >Sort By: {" "} </Text>
               
                  <StyledSelect
                  
                  size={"xs"}
                  options={columns.map((col) => ({
                    value: col.accessor,
                    label: col.Header,
                  }))}
                  value={selectedColumn}
                  onchange={(res) => handleColumnSelect(res)}
                />

                
                </Box>

              <Carousel
              showArrows={true}
              showStatus={true}
              showIndicators={true}
              swipeable={true}
              >
                {
                locks.map((page, index) => (
                  <Box key={index}>
                  <SimpleGrid 
                  spacing={4} 
                  templateColumns='repeat(auto-fill, minmax( 260px, 24% ))'
                  m={10}
                  >   
                  
                    {
                      page.map((lock, rindex) => (
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
    
                        onClick={() =>
                          redirectToDevice ? redirectToDevice(lock) : null
                        }
    
                        key={rindex}
                       >
                        
                          
                        
                          <CardHeader
                          pb={'10px'}>
                          <Flex alignItems={'center'}>
                              <Heading size='md' mb={'10px'}> 
                              {lock.name}
                              </Heading>
                              <Spacer/>
                              {
                              !lock.lock_status
                              ?
                               <div style={{ color: 'red' , marginLeft: 'auto' ,display: 'flex', alignItems: 'center' }}>
                                  <FiUnlock/>
                                  <Text fontSize='lg' ml={'3px'}> Unlocked</Text>
                                </div> 
                                :
                                <div style={{ color: 'green' , marginLeft: 'auto' ,display: 'flex', alignItems: 'center', justifyContent:'center' }}> 
                                <FiLock/>
                                <Text fontSize='lg' ml={'3px'}> Locked</Text> 
                              </div> 
                              }
                          </Flex>
                          <hr style={{ width: '60%', color: 'blue' }} />
                          
                          </CardHeader>
                               
                          <CardBody
                          pt={'10px'} 
                          pb={'0px'}
                          pr={'0px'}>
    
                            <Text as={'abbr'}> IMEI:{" "}
                            {lock.imei}  
                            <br/>
                            Last Location Type: {" "}
                            {lock.last_location_type} 
                            <br/>
                          <Box  onClick={(e) => {
                          
                          
                          e.preventDefault();
                          e.stopPropagation();
    
                          cytagsBtn(lock.imei );
                          const sectionElement = document.getElementById("connected_cytags"); // Replace with the actual ID of the section
                          if (sectionElement) {
                            sectionElement.scrollIntoView({ behavior: "smooth" }); // Use smooth scrolling for a nicer effect
                          }
    
                          toggleDrawer();
    
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
                          mt={'5%'}
                          pb={'0px'}
                          pr={'0px'}
                          pt={'10px'}>
                            <Text as={'abbr'}> Attached To: {" "}
                            {lock.attached_to}
                             </Text>
                            <Spacer/>
                            <Image src= {container_side} alt='Container' width={'60%'} p={0} m={0} borderRadius={'0px 0px 4px 0px'}
                            overflowY={'hidden'}
                            />
                          </CardFooter>
                          
                        </Card>
                
                      ))
                    }

                  </SimpleGrid>
                  </Box>
                  
                ))
                }
              </Carousel>






           

              
              </Box>
            
              {/* <Stack
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
              </Stack> */}
            </>
          ) : (
                <Center color={"text.primary"}>There are no data to display</Center>
              )
          
          }
        </Box>



      )}
    </>
  );
}

// ReactDOM.render(<DemoCarousel />, document.querySelector('.demo-carousel'));


export default CardTable;
