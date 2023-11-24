/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from "react";
import {
  Table,
  Thead,
  Tr,
  Th,
  Box,
  IconButton,
  Input,
  Text,
  Flex,
  Stack,
  Center,
  Heading,
  SimpleGrid,
  
} from "@chakra-ui/react";
import {
  ArrowBackIcon,
  ArrowDownIcon,
  ArrowForwardIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpIcon,
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
  setPageNumber,
  pageNumber,
  CreateDevice
}) {
  const [flatData, setFlatData] = useState(data);
  const [tags , setTags] = useState([]);


  useEffect(()=>{
    console.log("tags", tags);
  },[tags])

  useEffect(()=>{
    let tmpTags = [];
    for(let i = 0; i < data.length; i++)
    {
      if(i % 8 === 0)
      {
        tmpTags.push([]);
      }
      tmpTags[tmpTags.length - 1].push(data[i]);
    }
    setTags(tmpTags);
  }
  ,[data])


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
          // <>
          //   <Box overflowY={"scroll"} minH={'50vh'} >
          //     <Table
          //       h={'10px'}
          //       color={"secondary.100"}
          //       {...getTableProps()}
          //       variant={"unstyled"}
          //     >
          //       <Thead top={"0"} bg={"primary.80"}>
          //         {headerGroups.map((headerGroup, index) => (
          //           <Tr
          //             bg={"primary.100"}
          //             key={index}
          //             {...headerGroup.getHeaderGroupProps()}
          //           >
          //             {headerGroup.headers.map((column, i) => {
          //               return column.id === "severity" ? (
          //                 <Th
          //                   mb={2}
          //                   textAlign={"center"}
          //                   h={"10px"}
          //                   key={i}
          //                   {...column.getHeaderProps()}
          //                 >
          //                   <Flex textAlign={"center"}>
          //                     {column.render("Header")}
          //                     <IconButton
          //                       ml={1}
          //                       size={"xs"}
          //                       bg={"transparent"}
          //                       isDisabled
          //                     />
          //                   </Flex>
          //                 </Th>
          //               ) : (
          //                 <Th
          //                   textAlign={"center"}
          //                   h={"10px"}
          //                   key={i}
          //                   {...column.getSortByToggleProps()}
          //                 >
          //                   <Flex textAlign={"center"}>
          //                     {column.render("Header")}
          //                     <IconButton
          //                       ml={1}
          //                       size={"xs"}
          //                       bg={"transparent"}
          //                       icon={
          //                         column.isSorted ? (
          //                           column.isSortedDesc ? (
          //                             <IconButton as={ArrowDownIcon} size={'50px'} bg={'transparent'} color={'text.primary'} />
          //                           ) : (
          //                             <IconButton as={ArrowUpIcon} size={'50px'} bg={'transparent'} color={'text.primary'} />
          //                           )
          //                         ) : (
          //                           <IconButton as={BsArrowDownUp} size={'50px'} bg={'transparent'} color={'text.primary'} />
          //                         )
          //                       }
          //                     />
          //                   </Flex>
          //                 </Th>
          //               );
          //             })}
          //           </Tr>
          //         ))}
          //       </Thead>
          //     </Table>


          //   <SimpleGrid 
          //   spacing={7} 
          //   templateColumns={'repeat(auto-fill, minmax( 200px, 220px ))'}
          //   alignContent={"center"}
          //   my={5}
          //   mx={5}
          //   {...getTableBodyProps()} >
              
          //         {page.map((row, index) => {
          //           prepareRow(row);
          //           return (
          //             <Box
          //               bg={"table.cell"}
          //               className="tag-container"
          //               w={'100%'}
          //               minH={"200px"}
          //               maxH={"220px"}
          //               cursor={redirectToDevice ? "pointer" : "default"}
          //               borderColor={"transparent"}
          //               overflowX={"hidden"}
                        
          //               _hover={{
          //                 transform: "perspective(1000px) rotatex(0deg) !important", // Add a 3D rotation effect on hover
          //                 boxShadow: "0 0 10px rgba(155, 40,231, 0.7)",
          //                 borderBottom:'15px solid rgba(0,0,0,0) !important',
          //                 transition: "transform 0.3s", 

          //               }}
          //               onClick={() =>
          //                 redirectToDevice ? redirectToDevice(row.cells) : null
          //               }
          //               key={index}
          //               {...row.getRowProps()}
          //               style={{
          //                 transform: "perspective(1000px) rotatex(15deg)", // Add a 3D rotation effect on hover
          //                 transformStyle: "preserve-3d",
          //                 transition: "transform 0.3s", 
          //                 borderRadius: "40px", 
          //                 position:"relative", 
          //                 display: "flex",
          //                 flexDirection: "column",
          //                 justifyContent: "center",
          //                 alignItems: "center",
          //                 borderBottom:'15px solid rgb(12,12,15)',
          //               }}
          //             >
          //               {/* Connected Cytags */}
          //               {row.cells.map((cell, index) => {
          //                 return (
          //                   <Box
          //                     p={1}
          //                     key={index}
          //                     {...cell.getCellProps()}
          //                     width={"200px"}
          //                     alignContent={"center"}
          //                     display= {"flex"}
          //                     flexDirection= {"column"}
          //                   >
                              
          //                     <Box 
          //                     style={{ display: "flex", flexDirection: "column", alignItems: "center" , padding: '0'}}
          //                     >
          //                         {typeof cell.value !== "undefined" && index === 0 ? (
          //                           <Box >
          //                             <h2>{cell.render("Cell")}</h2>
          //                           </Box>
          //                         ) : (
          //                           <Box style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          //                             <img src={cypod} alt="logo" style={{ width: "50%",padding:"16px" }} />
          //                             ID: {cell.render("Cell")}
          //                           </Box>
          //                         )}
          //                       </Box>  

                              
          //                   </Box>
          //                 );
          //               })}
          //             </Box>
          //           );
          //         })}
          //         <Box h={"-moz-available"}></Box>
          //       </SimpleGrid>


          //   </Box>
          //   <Stack
          //     pos={"relative"}
          //     bottom={0}
          //     direction="row"
          //     justifyContent={"space-between"}
          //     borderColor={"secondary.100"}
          //   >
          //     <Stack direction="row" justifyContent={"space-between"}>
          //       <IconButton
          //         rounded="full"
          //         bg={"transparent"}
          //         color="secondary.100"
          //         icon={<ArrowLeftIcon />}
          //         size={"xs"}
          //         onClick={() => gotoPage(0)}
          //         isDisabled={!canPreviousPage}
          //       />
          //       <IconButton
          //         rounded="full"
          //         bg={"transparent"}
          //         color="secondary.100"
          //         icon={<ArrowBackIcon />}
          //         size={"xs"}
          //         onClick={() => previousPage()}
          //         isDisabled={!canPreviousPage}
          //       />
          //       <IconButton
          //         rounded="full"
          //         bg={"transparent"}
          //         color="secondary.100"
          //         icon={<ArrowForwardIcon />}
          //         size={"xs"}
          //         onClick={() => nextPage()}
          //         isDisabled={!canNextPage}
          //       />
          //       <IconButton
          //         rounded="full"
          //         bg={"transparent"}
          //         color="secondary.100"
          //         icon={<ArrowRightIcon />}
          //         size={"xs"}
          //         onClick={() => gotoPage(pageCount - 1)}
          //         isDisabled={!canNextPage}
          //       />
          //     </Stack>
          //     <Text color={"text.primary"} fontSize="sm">
          //       Page {pageIndex + 1} of {pageOptions.length}
          //     </Text>
          //     <Box>
          //       <Text color={"text.primary"} fontSize="sm">
          //         Go to page:
          //       </Text>
          //     </Box>
          //     <Box>
          //       <Input
          //         type="number"
          //         size={"xs"}
          //         bg={"primary.100"}
          //         color={"secondary.100"}
          //         defaultValue={pageIndex + 1}
          //         borderWidth={"0px"}
          //         // borderRadius={"10px"}
          //         onChange={(e) => {
          //           const page = e.target.value
          //             ? Number(e.target.value) - 1
          //             : 0;
          //           gotoPage(page);
          //         }}
          //         style={{ width: "50px" }}
          //       />
          //     </Box>
          //     <Box>
          //       <StyledSelect
          //         size={"xs"}
          //         options={[
          //           { value: 3, label: "3" },
          //           { label: "5", value: 5 },
          //           { value: 10, label: "10" },
          //           { value: 12, label: "12" },
          //           { value: 15, label: "15" },
          //           { value: 20, label: "20" },
          //           { value: 25, label: "25" },
          //           { value: 30, label: "30" },
          //           { value: 35, label: "35" },
          //           { value: 40, label: "40" },
          //           { value: 45, label: "45" },
          //           { value: 50, label: "50" },
          //         ]}
          //         value={pageSize}
          //         onchange={(res) => setPageSize(parseInt(res))}
          //       />
          //     </Box>
          //   </Stack>
          // </>

          <>
            <Carousel
              showArrows={true}
              showStatus={true}
              showIndicators={true}
              swipeable={true}>
              {
                tags.map((page, index) => {
                  return(
                  <SimpleGrid 
                  // spacing={4} 
                  // templateColumns='repeat(auto-fill, minmax( 260px, 24% ))'
                  spacing={7}
                  spacingX={12}
                  //horizontal spacing

                  templateColumns={'repeat(4, minmax( 200px, 220px ))'}
                  alignContent={"center"}
                  justifyContent={"center"}
                  m={10}
                  key={index}
                  > 
                      {
                        page.map((tag, index2) => {
                        return(
                        
                          <Box
                          key={index2}
                          bg={"table.cell"}
                          className="tag-container"
                          w={'100%'}
                          minH={"200px"}
                          maxH={"220px"}
                          cursor={redirectToDevice ? "pointer" : "default"}
                          borderColor={"transparent"}
                          overflowX={"hidden"}
                          
                          _hover={{
                            transform: "perspective(1000px) rotatex(0deg) !important", // Add a 3D rotation effect on hover
                            boxShadow: "0 0 10px rgba(155, 40,231, 0.7)",
                            borderBottom:'15px solid rgba(0,0,0,0) !important',
                            transition: "transform 0.3s", 

                          }}
                          onClick={() =>
                            redirectToDevice ? redirectToDevice(tag) : null
                          }
                          style={{
                            transform: "perspective(1000px) rotatex(15deg)", // Add a 3D rotation effect on hover
                            transformStyle: "preserve-3d",
                            transition: "transform 0.3s", 
                            borderRadius: "40px", 
                            position:"relative", 
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            borderBottom:'15px solid rgb(12,12,15)',
                          }}
                        >

                          <Box
                              p={1}
                              // {...cell.getCellProps()}
                              width={"200px"}
                              alignContent={"center"}
                              display= {"flex"}
                              flexDirection= {"column"}
                            >
                              
                              <Box 
                              style={{ display: "flex", flexDirection: "column", alignItems: "center" , padding: '0'}}
                              >
                                  {/* {tag !== "undefined" && index === 0 ? ( */}
                                    <Box >
                                      <h2>{tag.name}</h2>
                                    </Box>
                                  {/* ) : ( */}
                                    <Box style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                      <img src={cypod} alt="logo" style={{ width: "50%",padding:"16px" }} />
                                      ID: {" "} {tag.id} 
                                    </Box>
                                  {/* )} */}
                              </Box>  

                              
                            </Box>

                        </Box>
                        
                        )
                        })
                      
                      }
                  </SimpleGrid>
                  )
              })
            }
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
