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
  Icon,
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
import { FaMapMarkedAlt } from "react-icons/fa";
import Map from "../../ui/map/map";


function GeofenceTable({
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
  isLoading

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
        pageSize: Number.MAX_SAFE_INTEGER,
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
  
  useEffect(()=>{

  },[])

  const [LoadingElapsed, setLoadingElapsed] = useState(true);
  setTimeout(() => {
    setLoadingElapsed(false);
  }, 1200);

  return (
    <>
      {isLoading || LoadingElapsed ? (
        <>
        {/* Search Bar Skeleton */}
        <Skeleton my={2} px={20} mx={8}>
            <Icon py={1} as={FaMapMarkedAlt} boxSize={"30px"} color={"action.100"} /> 
            <Text mx={3} fontSize={'xl'} >Geofences</Text>
        </Skeleton>
        <Grid templateColumns='repeat(5, 1fr)' gap={4} mx={6}>
        {Array.from({ length: 5 }, (_, index) => (
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
        </>
        ) : (
        <>
            {/* Search Bar */}
            <Flex
            justifyContent={"space-between"}
            my={4}
            mx={4}
            >

            <Flex >
                  <Icon py={1} as={FaMapMarkedAlt} boxSize={"30px"} color={"action.100"} /> 
                  <Text mx={3} 
                    fontSize={'xl'}
                  >Geofences</Text>
                  </Flex>
          {columns.length !== 0 && (
            <GlobalFilter
              preGlobalFilteredRows={preGlobalFilteredRows}
              globalFilter={globalFilter}
              setGlobalFilter={setGlobalFilter}
              width={"300px"}
            />
          )}
            </Flex>
        <Box overflowY={"auto"}>
        {columns.length !== 0 ? (
          <>
            {/* Card Grid */}
            <Flex
            minW={'max-content'}
            display="flex"
            {...getTableBodyProps()}>
                   {page.map((row, index) => {
                    prepareRow(row);
                    let GeofenceName, ID, Buttons, vals, loc, attached,cytagKOKO; 
                
                    row.cells.forEach((cell, cellIndex) => {
                      switch (cellIndex) {
                        case 0: GeofenceName = cell.value; break;
                        case 1: ID = cell.value; break;
                        case 2: Buttons = cell.value; break;
                        case 3: loc = cell.value; break;
                        case 4: attached = cell.value; break;
                        case 5: cytagKOKO = cell.value; break;

                      }
                    });
                      
                  return(
                    <Card 
                    borderRadius={'30px 30px 0 0'}
                    minW={'350px'}
                    minH={'350px'}
                    mx={2}
                    my={5}
                    bg={'#2d3748'}
                    color="secondary.100"
                    border="1px solid #2d3748" 
                    maxH={'300px'}
                    maxW={'350px'}
                    _hover={{
                      backgroundColor: "primary.100",
                      borderColor: "primary.60",
                    }}
                    cursor={redirectToDevice ? "pointer" : "default"}
                    onClick={() =>
                      redirectToDevice ? redirectToDevice(row.cells) : null
                    }
                    key={index}
                    {...row.getRowProps()}
                   >
                      <CardHeader
                        pb={'10px'}>
                      <Flex alignItems={'center'}>
                        <Heading size='md' mb={'10px'}> 
                        <Text mb={2} fontSize={'xl'}>{GeofenceName}</Text>
                        <Text fontSize={'lg'}>ID: {ID}</Text>
                        </Heading>
                        <Spacer/>
                      </Flex>
                      <hr style={{ width: '60%', color: 'blue' }} />
                      </CardHeader>
                           
                      <CardBody
                      pt={'10px'} 
                      pb={'0px'}
                      pr={'0px'}>

                        
                        <Flex justifyContent={'start'}>
                        <Button 
                        colorScheme="blue"
                        variant="solid"
                        size="sm"
                        mr={2}
                        >
                            Edit
                        </Button>
                        <Button
                        colorScheme="red"
                        variant="solid"
                        size="sm"
                        >
                            Delete
                        </Button>
                        <Button
                        colorScheme="green"
                        variant="solid"
                        size="sm"
                        ml={2}
                        >
                            View on Map
                        </Button>
                        </Flex>
                      </CardBody>




                      <CardFooter p={'0px'}>
                      <Map minH='200px' GeoMap={true} zoom={15} geofences={loc} borderRadius={'30px 30px 0 0'}/>
                      </CardFooter>
                    </Card>
                  )
  
                })}
            </Flex>

          </>
        ) : (
          <Center color={"text.primary"}>There are no data to display</Center>
        )}
      </Box>
        </>
      )}
    </>
  );
}

export default GeofenceTable;
