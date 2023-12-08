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
import { ExtractContainerHeaders } from "../../../helpers/array-map";
import { MaterialReactTable } from "material-react-table";

function ContainerTable({ isLoading, data, title, icon }) {
  const themeCtx = useContext(ThemeContext);
  const [LoadingElapsed, setLoadingElapsed] = useState(true);
  setTimeout(() => {
    setLoadingElapsed(false);
  }, 1200);

  return (
    <>
      {isLoading || LoadingElapsed ? (
        <Box>{/* Add your loading indicator or content here */}</Box>
      ) : (
        <>
          {/* No Data */}
          {data.length === 0 ? (
            <Center my={4}>
              <Text
                color={"text.primary"}
                fontSize={"xl"}
                fontWeight={"bold"}
                textAlign={"center"}
              >
                There is no data to display
              </Text>
              <Center mt={10} mb={5}>
                <Image
                  src={themeCtx.darkMode ? NoDataVectorDark : NoDataVectorLight}
                  alt="No Data Vector"
                  height="300px"
                />
              </Center>
            </Center>
          ) : (
            <Box>{/* Render your data here */}</Box>
          )}
        </>
      )}
    </>
  );
}

export default ContainerTable;
