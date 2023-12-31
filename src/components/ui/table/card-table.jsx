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
  Card,
  CardHeader,
  CardBody,
  CardFooter,
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
  SearchIcon,
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
import { FiUnlock, FiLock } from "react-icons/fi";
import container_side_light from "../../../assets/images/resources/container_side_light.png";
import container_side_dark from "../../../assets/images/resources/container_side_dark.png";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import {
  RiArrowLeftSLine as LeftIcon,
  RiArrowRightSLine as RightIcon,
} from "react-icons/ri";

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
  toggleDrawer,
}) {
  const theme = useContext(ThemeContext);
  const [flatData, setFlatData] = useState(data);
  const [locks, setLocks] = useState([]);
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [searchText, setSearchText] = useState("");

  const [divWidth, setDivWidth] = useState(0);
  const [cardWidth, setCardWidth] = useState(0);

  useEffect(() => {
    const updateDivWidth = () => {
      const cardTableDiv = document.getElementById("cardTable");
      const cardWidth = document.getElementById("card");
      if (cardTableDiv && cardWidth) {
        const newWidth = cardTableDiv.offsetWidth;
        const newCardWidth = cardWidth.offsetWidth;
        setDivWidth(newWidth);
        setCardWidth(newCardWidth);
      }
    };

    updateDivWidth();

    window.addEventListener("resize", updateDivWidth);

    return () => {
      window.removeEventListener("resize", updateDivWidth);
    };
  }, [data]);

  const [cardsPerRow, setCardsPerRow] = useState(4);
  useEffect(() => {
    if (divWidth) {
      const cardsPerRow = Math.floor(divWidth / cardWidth);

      // minimum 1 card per row
      if (cardsPerRow < 1) {
        setCardsPerRow(1);
      } else setCardsPerRow(cardsPerRow);
    }
  }, [data, divWidth]);

  useEffect(() => {
    let tmpLocks = [];

    for (let i = 0; i < data.length; i++) {
      if (i % (cardsPerRow * 2) === 0) {
        tmpLocks.push([]);
      }
      tmpLocks[tmpLocks.length - 1].push(data[i]);
    }
    setLocks(tmpLocks);
  }, [data, divWidth]);

  const columns = React.useMemo(
    () =>
      reverse
        ? [...extractFn(data, hiddenCols).reverse()]
        : [...extractFn(data, hiddenCols)],
    [data]
  );

  const [LoadingElapsed, setLoadingElapsed] = useState(true);
  setTimeout(() => {
    setLoadingElapsed(false);
  }, 1200);

  const handleColumnSelect = (selected) => {
    setSelectedColumn(selected);

    if (searchText) {
      setSearchText("");
    } else {
      const sortedData = [...data].sort((a, b) => {
        const valueA = a[selected];
        const valueB = b[selected];

        return valueA - valueB;
      });

      let tmpLocks = [];
      for (let i = 0; i < sortedData.length; i++) {
        if (i % (cardsPerRow * 2) === 0) {
          tmpLocks.push([]);
        }
        tmpLocks[tmpLocks.length - 1].push(sortedData[i]);
      }
      setLocks(tmpLocks);
    }
  };

  const handleSearch = () => {
    const filteredData = data.filter((item) => {
      return Object.values(item)
        .join(" ")
        .toLowerCase()
        .includes(searchText.toLowerCase());
    });

    let tmpLocks = [];
    for (let i = 0; i < filteredData.length; i++) {
      if (i % (cardsPerRow * 2) === 0) {
        tmpLocks.push([]);
      }
      tmpLocks[tmpLocks.length - 1].push(filteredData[i]);
    }
    setLocks(tmpLocks);
  };

  return (
    <>
      {isLoading || LoadingElapsed ? (
        <Grid templateColumns="repeat(4, 1fr)" gap={4} mx={6}>
          {Array.from({ length: 8 }, (_, index) => (
            //Alarm Card Skeleton
            <GridItem>
              <Box
                w={"100%"}
                border="2px"
                borderColor="grey"
                borderRadius="25px"
                p={3}
                m={"2"}
              >
                <SkeletonCircle size={12} />
                <Skeleton my={2}>
                  <Box h={"25px"}></Box>
                </Skeleton>
                <hr />
                <SkeletonText my={3} />
                <SkeletonText my={3} />
                <Flex justifyContent={"end"}>
                  <SkeletonCircle size={12} />
                </Flex>
                <SkeletonText my={3} />
              </Box>
            </GridItem>
          ))}
        </Grid>
      ) : (
        <Box
          backgroundColor={"primary.80"}
          borderRadius={"25px"}
          w={"100%"}
          p={{ base: 0, sm: 2 }}
          minH={columns.length !== 0 ? "555px" : minHEmpty}
          minW={minW}
          boxShadow={
            theme.darkMode ? "0px 0px 10px 0px #111" : "0px 0px 1px 0px #aaaa"
          }
        >
          <Flex
            p={{ base: 0, sm: 2 }}
            justifyContent={{ base: "center", sm: "space-between" }}
            gap={2}
            alignItems={"center"}
            flexDirection={["column", "column", "row"]}
          >
            <Box
              w={children ? "30%" : "70%"}
              gap={2}
              as={Flex}
              px={{ base: 0, md: 4 }}
              mt={{ base: 5, sm: 0 }}
            >
              {icon}
              <Heading
                w={"100%"}
                color={"text.primary"}
                fontSize={"xl"}
                alignSelf={"center"}
              >
                {title}
              </Heading>
            </Box>

            <Flex
              justifyContent={"center"}
              alignItems={"center"}
              flexDirection={["column", "column", "row"]}
            >
              <Flex my={3}>
                <Text
                  fontSize={"lg"}
                  color={"text.primary"}
                  mr={{ base: 0, md: 4 }}
                  whiteSpace={"nowrap"}
                  my={1}
                  mx={3}
                >
                  Sort By:
                </Text>

                <Box>
                  <StyledSelect
                    size={"md"}
                    options={columns.map((col) => ({
                      value: col.accessor,
                      label: col.Header,
                    }))}
                    value={selectedColumn}
                    onchange={(res) => handleColumnSelect(res)}
                  />
                </Box>
              </Flex>

              {/* Search Bar */}
              <Box
                display={"flex"}
                alignItems={"center"}
                justifyContent={{ base: "center", sm: "end" }}
                my={2}
              >
                <Input
                  size="md"
                  color={"text.primary"}
                  fontFamily="DM Sans"
                  borderRadius={"10px"}
                  placeholder="Search"
                  bg={"primary.100"}
                  mr={4}
                  width={"70%"}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />

                <Center
                  w={"40px"}
                  h={"40px"}
                  borderRadius={"full"}
                  bg={"white"}
                  boxShadow={"0px 0px 7px 0px #8c8c8c"}
                  mr={{ base: 0, sm: 4 }}
                >
                  <IconButton
                    size={"sm"}
                    aria-label="Search"
                    icon={<SearchIcon color={"white"} />}
                    _hover={{ opacity: 0.8 }}
                    rounded={"full"}
                    bg={"action.80"}
                    onClick={() => handleSearch()}
                  />
                </Center>
              </Box>

              {CreateDevice}
              {children ? (
                <Flex me={{ base: 0, sm: 10 }} my={1}>
                  <Text
                    fontSize={"lg"}
                    color={"text.primary"}
                    my={1}
                    mx={3}
                    display={{ base: "block", sm: "none" }}
                  >
                    Export to Excel:
                  </Text>
                  {children}
                </Flex>
              ) : null}
            </Flex>
          </Flex>

          {columns.length !== 0 ? (
            <>
              <Box my={3} bg={"111"}>
                <Carousel
                  showArrows={true}
                  showStatus={false}
                  showIndicators={true}
                  swipeable={true}
                  renderArrowPrev={(clickHandler, hasPrev) => {
                    return (
                      <Flex
                        top={0}
                        bottom={0}
                        left={0}
                        zIndex={20}
                        justifyContent={"center"}
                        alignItems={"center"}
                        position={"absolute"}
                        onClick={clickHandler}
                        style={{ transition: " 0.1s" }}
                        _hover={{ bg: "card.100", cursor: "pointer" }}
                        _focus={{ bg: "transparent" }}
                        disabled={!hasPrev}
                        rounded={"full"}
                        w={"30px"}
                      >
                        <IconButton
                          onClick={clickHandler}
                          icon={<LeftIcon size={"30px"} />}
                          bg={"transparent"}
                          _hover={{ bg: "transparent" }}
                          _focus={{ bg: "transparent" }}
                          color={"text.primary"}
                          borderRadius={"full"}
                          size={"lg"}
                          mr={2}
                          disabled={!hasPrev}
                        />
                      </Flex>
                    );
                  }}
                  renderArrowNext={(clickHandler, hasNext) => {
                    return (
                      <Flex
                        top={0}
                        bottom={0}
                        right={0}
                        zIndex={20}
                        justifyContent={"center"}
                        alignItems={"center"}
                        position={"absolute"}
                        onClick={clickHandler}
                        style={{ transition: " 0.1s" }}
                        _hover={{ bg: "card.100", cursor: "pointer" }}
                        _focus={{ bg: "transparent" }}
                        disabled={!hasNext}
                        rounded={"full"}
                        w={"30px"}
                      >
                        <IconButton
                          onClick={clickHandler}
                          icon={<RightIcon size={"30px"} />}
                          bg={"transparent"}
                          _hover={{ bg: "transparent" }}
                          _focus={{ bg: "transparent" }}
                          color={"text.primary"}
                          borderRadius={"full"}
                          size={"lg"}
                          ml={2}
                          disabled={!hasNext}
                        />
                      </Flex>
                    );
                  }}
                  renderIndicator={(clickHandler, isSelected, index, label) => {
                    if (isSelected) {
                      return (
                        <Tag
                          bg={"action.80"}
                          color={"white"}
                          borderRadius={"full"}
                          size={"sm"}
                          mr={2}
                          onClick={clickHandler}
                          key={index}
                          boxShadow={"sm"}
                          _hover={{ bg: "action.80", cursor: "pointer" }}
                          _focus={{ bg: "action.80", cursor: "pointer" }}
                          style={{ transition: " 0.1s" }}
                        >
                          <Text
                            fontSize={"sm"}
                            color={"white"}
                            display={{ base: "none", sm: "block" }}
                          >
                            {index + 1}
                          </Text>
                        </Tag>
                      );
                    }
                    return (
                      <Tag
                        bg={"primary.100"}
                        color={"text.primary"}
                        borderRadius={"full"}
                        size={"sm"}
                        mr={2}
                        onClick={clickHandler}
                        key={index}
                        boxShadow={"sm"}
                        _hover={{ bg: "action.80", cursor: "pointer" }}
                        _focus={{ bg: "action.80", cursor: "pointer" }}
                        style={{ transition: " 0.1s" }}
                      >
                        <Text
                          fontSize={"sm"}
                          color={"text.primary"}
                          display={{ base: "none", sm: "block" }}
                        >
                          {index + 1}
                        </Text>
                      </Tag>
                    );
                  }}
                >
                  {locks.map((page, index) => (
                    <Box key={index}>
                      <SimpleGrid
                        id="cardTable"
                        spacing={4}
                        templateColumns={{
                          base: "repeat(auto-fill, minmax( 220px, auto ))",
                          lg: "repeat(auto-fill, minmax( 350px, auto ))",
                        }}
                        m={10}
                      >
                        {page.map((lock, rindex) => (
                          <Card
                            id="card"
                            bg={"card.100"}
                            color="secondary.100"
                            width={"100%"}
                            border="1px solid transparent"
                            _hover={{
                              backgroundColor: "primary.100",
                              borderColor: "action.80",
                            }}
                            cursor={redirectToDevice ? "pointer" : "default"}
                            onClick={() =>
                              redirectToDevice ? redirectToDevice(lock) : null
                            }
                            key={rindex}
                            borderRadius={"25px"}
                          >
                            <CardHeader pb={"10px"}>
                              <Flex alignItems={"center"}>
                                <Heading size="md" mb={"10px"}>
                                  {lock.name}
                                </Heading>
                                <Spacer />
                                {lock.lock_status === "true" ? (
                                  <div
                                    style={{
                                      color: "green",
                                      marginLeft: "auto",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                    }}
                                  >
                                    <FiLock />
                                    <Text fontSize="lg" ml={"3px"}>
                                      {" "}
                                      Locked
                                    </Text>
                                  </div>
                                ) : (
                                  <div
                                    style={{
                                      color: "red",
                                      marginLeft: "auto",
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    <FiUnlock />
                                    <Text fontSize="lg" ml={"3px"}>
                                      {" "}
                                      Unlocked
                                    </Text>
                                  </div>
                                )}
                              </Flex>
                              <hr style={{ width: "60%", color: "blue" }} />
                            </CardHeader>

                            <CardBody pt={"10px"} pb={"0px"} pr={"0px"}>
                              <Text align={"start"}>
                                {" "}
                                IMEI: {lock.imei}
                                <br />
                                Last Location Type: {lock.last_location_type}
                                <br />
                                <Box
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();

                                    cytagsBtn(lock.imei);
                                    const sectionElement =
                                      document.getElementById(
                                        "connected_cytags"
                                      ); // Replace with the actual ID of the section
                                    if (sectionElement) {
                                      sectionElement.scrollIntoView({
                                        behavior: "smooth",
                                      }); // Use smooth scrolling for a nicer effect
                                    }

                                    toggleDrawer();
                                  }}
                                  _hover={{
                                    textDecoration: "underline",
                                  }}
                                  color={"action.80"}
                                >
                                  {" "}
                                  Connected Cytags
                                </Box>
                              </Text>
                            </CardBody>
                            <CardFooter
                              mt={"5%"}
                              pb={"0px"}
                              pr={"0px"}
                              pt={"10px"}
                            >
                              <Text align={"start"} width={"200px"}>
                                Attached To: {lock.attached_to}
                              </Text>
                              <Spacer />
                              <Image
                                src={
                                  theme.darkMode
                                    ? container_side_dark
                                    : container_side_light
                                }
                                alt="Container"
                                width={"60%"}
                                p={0}
                                m={0}
                                borderRadius={"0px 0px 25px 0px"}
                                overflowY={"hidden"}
                              />
                            </CardFooter>
                          </Card>
                        ))}
                      </SimpleGrid>
                    </Box>
                  ))}
                </Carousel>
              </Box>
            </>
          ) : (
            <Center color={"text.primary"}>There are no data to display</Center>
          )}
        </Box>
      )}
    </>
  );
}

export default CardTable;
