import React, { useContext, useEffect, useState } from "react";
import {
  Badge,
  Icon,
  Center,
  Text,
  Avatar,
  Tooltip,
  Box,
  Flex,
  Grid,
  GridItem,
  Button,
  Select,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
  ButtonGroup,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  Progress,
} from "@chakra-ui/react";
import { assignCytag, unAssignCytag } from "../api/device-actions";
import EditGeofence from "../components/pages/geofences/edit-geofence/edit-geofence";
import DeleteGeofence from "../components/pages/geofences/delete-geofence/delete-geofence";
import { deleteGeofence, deleteRoute } from "../api/geofences";
import { SEVERITY } from "../data/alarms";
import { assignAlarmSettingToEntity } from "../api/alarms";
import AssignEntities from "../components/pages/alarms-settings/assign-entities/assign-entities";
import EditAlarmSetting from "../components/pages/alarms-settings/edit-alarm-setting/edit-alarm-setting";
import { AlarmAction } from "../components/pages/dashboard/dashboard";
import moment from "moment-timezone";
import { FaLock, FaLockOpen, FaCopy } from "react-icons/fa";
import CytagChip from "../components/ui/cytag-chip/cytag-chip";
import DeleteAlarmSetting from "../components/pages/alarms-settings/delete-alarm-settings/delete-alarm-settings";
import { hasPermission } from "./permissions-helper";
import { PERMISSIONS } from "../types/devices";
import { showsuccess } from "./toast-emitter";
import { getEmojiFlag, getCountryCode } from "countries-list";
import { continents, countries, languages } from "countries-list";

export function extractUniqueKeys(data) {
  const keys = [];
  data.forEach((item) => {
    keys.push(...Object.keys(item));
  });
  return Array.from(new Set(keys)).reverse();
}

export function sortHeaders(headers) {
  let timekey = "";
  let devicekey = "";
  const keys = [];
  const res = [];
  headers.forEach((header) => {
    if (switchSortWeight(header) === 1) {
      timekey = header;
    } else if (switchSortWeight(header) === 2) {
      devicekey = header;
    } else {
      keys.push(header);
    }
  });
  if (devicekey.length !== 0) {
    res.push(devicekey);
  }
  if (timekey.length !== 0) {
    res.push(timekey);
  }
  res.push(...keys);
  return res;
}

export function switchSortWeight(header) {
  switch (header) {
    case "device":
      return 2;
    case "date":
    case "start_time":
    case "updated_time":
    case "offload_time":
    case "assign_time":
    case "timestamp":
    case "message_time":
      return 1;
    default:
      return 99;
  }
}

export function extractTelemetryHeaders(data = [], alarms) {
  return data.length !== 0
    ? extractUniqueKeys(data)
        .sort()
        .map((key) => {
          return {
            Header: key.toUpperCase().replaceAll("_", " "),
            accessor: key,
            Cell: (props) => switchMainHeader(key, props),
            isSorted: false,
            isSortedDesc: false,
          };
        })
    : [];
}

export function extractContainerHeaders(data = [], alarms) {
  return data.length !== 0
    ? extractUniqueKeys(data)
        .sort()
        .map((key) => {
          return {
            Header: key.toUpperCase().replaceAll("_", " "),
            accessor: key,
            Cell: (props) => switchMainHeader(key, props),
          };
        })
    : [];
}

export function extractHeaders(data = [], alarms) {
  return data.length !== 0
    ? Object.keys(data[0])
        .reverse()
        .map((key) => {
          return {
            Header: key.toUpperCase().replaceAll("_", " "),
            accessor: key,
            Cell: (props) => switchMainHeader(key, props),
          };
        })
    : [];
}

export function extractNestedHeaders(data = [], hiddenCols) {
  const res = [];
  if (data.length !== 0) {
    Object.keys(data[0]).forEach((key) => {
      if (!hiddenCols.find((coll) => coll === key)) {
        if (typeof data[0][key] === "object" && data[0][key]) {
          const keys = [];
          Object.keys(data[0][key]).forEach((subKey) => {
            keys.push({
              Header: subKey.toUpperCase().replaceAll("_", " "),
              accessor: subKey,
              Cell: (props) => switchMainHeader(key, props),
            });
          });
          res.push({
            Header: key.toUpperCase().replaceAll("_", " "),
            columns: keys,
            accessor: key,
          });
        } else {
          res.push({
            Header: key.toUpperCase().replaceAll("_", " "),
            accessor: key,
            columns: [
              {
                Header: "",
                accessor: key,
                Cell: (props) => switchMainHeader(key, props),
              },
            ],
          });
        }
      }
    });
    return res;
  } else {
    return [];
  }
}
export function formatDate(date) {
  return moment(date + "Z")
    .utcOffset(moment().utcOffset())
    .format("DD/MM/YYYY, HH:mm:ss");
}

export function formatDateNoTime(date) {
  return moment(date + "Z")
    .utcOffset(moment().utcOffset())
    .format("DD/MM/YYYY");
}

export function formatLocalToISOUTC(date) {
  return moment(date).utc().toISOString().replace("Z", "");
}

export function switchMainHeader(key, props) {
  if (key.includes("inspect") && !key.includes("duration")) {
    return String(formatDate(props.value));
  } else {
    switch (key) {
      case "cytags":
        return (
          <CytagChip
            cycollectorId={props.row.original.id}
            assignAction={assignCytag}
            unAssignAction={unAssignCytag}
          />
        );
      case "myCytags":
        return (
          <CytagChip
            cycollectorId={props}
            assignAction={assignCytag}
            unAssignAction={unAssignCytag}
          />
        );
      case "Lock feedback":
        return String(props.value === "1" ? "Locked" : "Unlocked");
      case "lock_status":
        return (
          <Center w={"100%"} h={"100%"}>
            <Icon
              color={"action.100"}
              boxSize={"25px"}
              as={props.value === "true" ? FaLock : FaLockOpen}
            />
          </Center>
        );
      case "date":
      case "start_time":
      case "updated_time":
      case "offload_time":
      case "assign_time":
      case "release_time":
      case "timestamp":
      case "message_time":
        return String(formatDate(props.value));
      default:
        // capitalize first letter of each word
        try {
          const val = String(props.value)
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")
            .replaceAll("_", " ");
          return val;
        } catch (error) {
          return String(props.value);
        }
    }
  }
}

export function extractGeoHeaders(data = []) {
  return data.length !== 0
    ? Object.keys(data[0]).map((key) => {
        return {
          Header: key.toUpperCase().replaceAll("_", " "),
          accessor: key,
          Cell: (props) =>
            key === "Geofence_Actions" ? (
              <>
                {hasPermission(PERMISSIONS.EDIT_GEOFENCES) && (
                  <EditGeofence
                    geofence={props.value.geofence}
                    geofences={props.value.geofences}
                  />
                )}
                {hasPermission(PERMISSIONS.DELETE_GEOFENCES) && (
                  <DeleteGeofence
                    deleteAction={deleteGeofence}
                    id={props.value.geofence.id}
                    callBack={props.value.geofence.callBack}
                    name={props.value.geofence.name}
                  />
                )}
              </>
            ) : (
              props.value
            ),
        };
      })
    : [];
}

export function extractRouteHeaders(data = []) {
  return data.length !== 0
    ? Object.keys(data[0]).map((key) => {
        return {
          Header: key.toUpperCase().replaceAll("_", " "),
          accessor: key,
          Cell: (props) =>
            key === "Route_Actions" ? (
              <>
                <DeleteGeofence
                  deleteAction={deleteRoute}
                  id={props.value.geofence.id}
                  callBack={props.value.geofence.callBack}
                  name={props.value.geofence.name}
                />{" "}
              </>
            ) : (
              props.value
            ),
        };
      })
    : [];
}

export function mapThreatToProgress(threat) {
  switch (threat) {
    case "Critical":
      return 100;
    case "Major":
      return 75;
    default:
      return 50;
  }
}

export function extractAlarmHeaders(data = []) {
  return data.length !== 0
    ? Object.keys(data[0]).map((key) => {
        return {
          Header: key.toUpperCase().replaceAll("_", " "),
          accessor: key,
          Cell: (props) => switchAlarmsTableFields(key, props),
        };
      })
    : [];
}

export function switchAlarmsTableFields(field, props) {
  switch (field) {
    case "severity":
      return (
        <Text
          w={"100%"}
          color={mapThreatToColor(props.value)}
          textTransform={"capitalize"}
          fontWeight={"bold"}
        >
          {props.value}
        </Text>
      );
    case "entities":
      return (
        <AssignEntities
          type={props.value.type}
          assignAction={assignAlarmSettingToEntity}
          mainId={props.row.original.id}
          assignedEntities={props.value.value}
        />
      );
    case "edit":
      return (
        <EditAlarmSetting
          alarmTypes={props.value.alarmTypes}
          alarm={props.value.alarm}
          callback={props.value.callback}
        />
      );
    case "delete":
      return (
        <DeleteAlarmSetting
          alarmSetting={props.value.alarmSetting}
          callback={props.value.callback}
          alarmTypes={props.value.alarmTypes}
        />
      );
    case "Acknowledge":
      return (
        <AlarmAction
          acknowldgeAction={true}
          actionPerformed={props.value.actionPerformed}
          alarm={props.value.alarm}
          callback={props.value.callback}
        />
      );
    case "Clear":
      return (
        <AlarmAction
          acknowldgeAction={false}
          actionPerformed={props.value.actionPerformed}
          alarm={props.value.alarm}
          callback={props.value.callback}
        />
      );
    case "start_time":
    case "updated_time":
      return String(formatDate(props.value));
    default:
      const val = String(props.value)
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
        .replaceAll("_", " ");
      return val;
  }
}

export function mapThreatToColor(threat) {
  switch (threat) {
    case SEVERITY.URGENT:
      return "#780000";
    case SEVERITY.HIGH:
      return "#dc0000";
    case SEVERITY.MEDIUM:
      return "#fd8c00";
    default:
      return "#fdc500";
  }
}

export function getPage(data, pageNumber, pageSize) {
  const start = (pageNumber - 1) * pageSize;
  const end = start + pageSize;
  return data.slice(start, end);
}

export function mapToKeyValPair(objects) {
  const arrrr = Object.entries(objects).map((obj) => {
    return { value: obj[1] + "", label: obj[0] + "" };
  });
  return arrrr;
}

export function findVlaById(objects, id) {
  let val = "";
  try {
    val = mapToKeyValPair(objects).find((obj) => obj.id === id + "").val;
  } catch (error) {
    console.error(error);
  }
  return val;
}

export function flattenObject(object) {
  const newObject = {};
  Object.keys(object).forEach((key) => {
    if (
      typeof object[key] === "object" &&
      !Array.isArray(object[key]) &&
      object[key]
    ) {
      Object.keys(object[key]).forEach((smallKey) => {
        if (smallKey !== "id") {
          if (
            typeof object[key][smallKey] === "object" &&
            !Array.isArray(object[key][smallKey]) &&
            object[key][smallKey]
          ) {
            Object.keys(object[key][smallKey]).forEach((smallerKey) => {
              if (smallerKey !== "id") {
                newObject[smallerKey] = object[key][smallKey][smallerKey];
              }
            });
          } else {
            newObject[smallKey] = object[key][smallKey];
          }
        }
      });
    } else {
      newObject[key] = object[key];
    }
  });
  return newObject;
}

export function ExtractContainerHeaders(data = [], container) {
  return data.length !== 0
    ? Object.keys(data[0])
        .reverse()
        .map((key) => {
          return {
            Header: key.toUpperCase().replaceAll("_", " "),
            accessor: key,
            Cell: (props) => switchContainerHeaders(key, props),
          };
        })
    : [];
}

export function switchContainerHeaders(field, props) {
  // Importer states & functions
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  // Status functions and states
  const [selectedStatus, setSelectedStatus] = useState(
    props.value.current_status
  );

  const handleStatusChange = (newStatus) => {
    setSelectedStatus(newStatus);
  };

  const [isStatusOpen, setStatusIsOpen] = useState(false);

  const [selectedPriority, setSelectedPriority] = useState(
    props.value.current_priority
  );

  const handlePriorityChange = (newPriority) => {
    setSelectedPriority(newPriority);
  };

  const [isPriorityOpen, setPriorityIsOpen] = useState(false);

  // Document status functions and states
  const [selectedDocumentStatus, setSelectedDocumentStatus] = useState(
    props.value.current_status
  );

  const handleDocumentStatusChange = (newDocumentStatus) => {
    setSelectedDocumentStatus(newDocumentStatus);
  };

  const [isDocumentStatusOpen, setDocumentStatusIsOpen] = useState(false);

  // Customs clearance functions and states
  const [isTooltip2Open, setIsTooltip2Open] = useState(false);

  const countriesList = require("countries-list");
  // Phone number functions and states
  const [countryCode, phoneNumber] = String(props.value)
    .substring(1)
    .split(" ");

  const countryInfo = Object.values(countriesList.countries).find(
    (country) => country.phone[0] === Number(countryCode)
  );

  const Emoji = countryInfo
    ? getEmojiFlag(getCountryCode(countryInfo.name))
    : "🌐";

  // Timeline functions and states

  const { startdate, enddate } = props.value;

  const calculateProgress = () => {
    const currentDate = new Date();
    const startDate = new Date(startdate);
    const endDate = new Date(enddate);

    const totalDuration = endDate - startDate;
    const elapsedDuration = currentDate - startDate;

    return Math.min((elapsedDuration / totalDuration) * 100, 100);
  };

  const calculateDaysRemaining = () => {
    const currentDate = new Date();
    const endDate = new Date(enddate);
    const timeRemaining = endDate - currentDate;
    const daysRemaining = Math.ceil(timeRemaining / (1000 * 60 * 60 * 24));

    return daysRemaining > 0 ? daysRemaining : 0;
  };
  switch (field) {
    case "importer":
      return (
        <>
          <Tooltip
            hasArrow
            pb={0}
            px={0}
            boxShadow={"xl"}
            borderRadius={"25px"}
            minH={"100px"}
            minW={"120px"}
            label={
              <>
                <Box p={4}>
                  <Flex>
                    <Avatar name={props.value.name} size={"lg"} />
                    <Flex flexDirection={"column"} ml={4}>
                      <Text fontSize={"xl"} my={1}>
                        {props.value.name}
                      </Text>
                      <Text my={1} textOverflow={"ellipsis"}>
                        {props.value.jobTitle}
                      </Text>
                      <Badge
                        w={"fit-content"}
                        my={1}
                        colorScheme={
                          props.value.role === "Admin" ? "success" : null
                        }
                        color={props.value.role === "Admin" ? "white" : ""}
                      >
                        {props.value.role}
                      </Badge>
                    </Flex>
                  </Flex>
                </Box>
                <Box
                  as={Flex}
                  h={"100%"}
                  w={"100%"}
                  roundedBottom={"25px"}
                  justifyContent={"center"}
                  alignItems={"center"}
                >
                  <ButtonGroup
                    isAttached
                    variant={"outline"}
                    p={0}
                    m={0}
                    w={"100%"}
                  >
                    <Menu>
                      <MenuButton
                        as={Button}
                        bg={"primary.80"}
                        rounded={0}
                        roundedBottom={"25px"}
                      >
                        Contact Details
                      </MenuButton>
                      <MenuList>
                        <MenuItem
                          onClick={() => {
                            navigator.clipboard.writeText(
                              props.value.phone_number
                            );
                            showsuccess("Copied to clipboard successfully");
                          }}
                        >
                          <Grid
                            templateColumns={"auto 1fr auto"}
                            alignItems={"center"}
                            gap={2}
                          >
                            <Text>
                              Phone Number: {props.value.phone_number}
                            </Text>
                            <Icon as={FaCopy} />
                          </Grid>
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            navigator.clipboard.writeText(props.value.email);
                            showsuccess("Copied to clipboard successfully");
                          }}
                        >
                          {/* Copy to clipboard */}
                          <Grid
                            templateColumns={"auto 1fr auto"}
                            alignItems={"center"}
                            gap={2}
                          >
                            <Text>Email: {props.value.email}</Text>
                            <Icon as={FaCopy} />
                          </Grid>
                        </MenuItem>
                      </MenuList>
                    </Menu>
                    <Button
                      bg={"primary.80"}
                      rounded={0}
                      roundedBottom={"25px"}
                    >
                      Ask for an update
                    </Button>
                  </ButtonGroup>
                </Box>
              </>
            }
            bg="primary.80"
            color="text.primary"
            placement="top"
            isOpen={isTooltipOpen}
            onOpen={() => setIsTooltipOpen(true)}
            onMouseEnter={() => setIsTooltipOpen(true)}
            onMouseLeave={() => {
              setIsTooltipOpen(false);
            }}
            pointerEvents={"auto"}
          >
            <Avatar
              onMouseEnter={() => setIsTooltipOpen(true)}
              onMouseLeave={() => {
                setIsTooltipOpen(false);
              }}
              name={props.value.name}
              size={"sm"}
            />
          </Tooltip>
        </>
      );
    case "status":
      return (
        <Popover
          placement="auto"
          isOpen={isStatusOpen}
          onClose={() => setStatusIsOpen(false)}
        >
          <PopoverTrigger>
            <Center
              w={"100%"}
              h={"100%"}
              px={6}
              py={3}
              fontWeight={500}
              bg={
                selectedStatus === "Warehousing"
                  ? "orange"
                  : selectedStatus === "Fleet Forwarders"
                  ? "danger.100"
                  : selectedStatus === "Shipping Line"
                  ? "success.100"
                  : "danger.100"
              }
              cursor="pointer"
              _hover={{ opacity: 0.8 }}
              onClick={() => setStatusIsOpen(true)}
            >
              <Text color={"white"}>{selectedStatus}</Text>
            </Center>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverHeader>Change Priority</PopoverHeader>
            <PopoverBody>
              {props.value.possible_status.map((status) => (
                <Center>
                  <Button
                    w={"100%"}
                    py={3}
                    color={"white"}
                    rounded={0}
                    fontWeight={500}
                    bg={
                      status === "Warehousing"
                        ? "orange"
                        : status === "Fleet Forwarders"
                        ? "danger.100"
                        : status === "Shipping Line"
                        ? "success.100"
                        : "danger.100"
                    }
                    _hover={{ opacity: 0.8 }}
                    key={status}
                    variant={status === selectedStatus ? "solid" : "outline"}
                    onClick={() => {
                      handleStatusChange(status);
                      setPriorityIsOpen(false);
                    }}
                  >
                    {status}
                  </Button>
                </Center>
              ))}
            </PopoverBody>
          </PopoverContent>
        </Popover>
      );
    case "estimate_start_time":
      return String(formatDateNoTime(props.value));
    case "priority":
      return (
        <Popover
          placement="auto"
          isOpen={isPriorityOpen}
          onClose={() => setPriorityIsOpen(false)}
        >
          <PopoverTrigger>
            <Center
              w={"100%"}
              h={"100%"}
              px={6}
              py={3}
              fontWeight={500}
              bg={
                selectedPriority === "High"
                  ? "#311cac"
                  : selectedPriority === "Medium"
                  ? "#5559DF"
                  : selectedPriority === "Low"
                  ? "#579BFC"
                  : "danger.100"
              }
              cursor="pointer"
              _hover={{ opacity: 0.8 }}
              onClick={() => setPriorityIsOpen(true)}
            >
              <Text color={"white"}>{selectedPriority}</Text>
            </Center>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverHeader>Change Priority</PopoverHeader>
            <PopoverBody>
              {props.value.possible_priority.map((priority) => (
                <Center>
                  <Button
                    w={"100%"}
                    py={3}
                    color={"white"}
                    rounded={0}
                    fontWeight={500}
                    bg={
                      priority === "High"
                        ? "#311cac"
                        : priority === "Medium"
                        ? "#5559DF"
                        : priority === "Low"
                        ? "#579BFC"
                        : "danger.100"
                    }
                    _hover={{ opacity: 0.8 }}
                    key={priority}
                    variant={
                      priority === selectedPriority ? "solid" : "outline"
                    }
                    onClick={() => {
                      handlePriorityChange(priority);
                      setPriorityIsOpen(false);
                    }}
                  >
                    {priority}
                  </Button>
                </Center>
              ))}
            </PopoverBody>
          </PopoverContent>
        </Popover>
      );
    case "document_status":
      return (
        <Popover
          placement="auto"
          isOpen={isDocumentStatusOpen}
          onClose={() => setDocumentStatusIsOpen(false)}
        >
          <PopoverTrigger>
            <Center
              w={"100%"}
              h={"100%"}
              px={6}
              py={3}
              fontWeight={500}
              bg={
                selectedDocumentStatus === "In Progress"
                  ? "orange"
                  : selectedDocumentStatus === "Done"
                  ? "success.100"
                  : selectedDocumentStatus === "Stuck"
                  ? "danger.100"
                  : selectedDocumentStatus === "Canceled"
                  ? "grey"
                  : "danger.100"
              }
              cursor="pointer"
              _hover={{ opacity: 0.8 }}
              onClick={() => setDocumentStatusIsOpen(true)}
            >
              <Text color={"white"}>{selectedDocumentStatus}</Text>
            </Center>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverHeader>Change Priority</PopoverHeader>
            <PopoverBody>
              {props.value.possible_status.map((documentStatus) => (
                <Center>
                  <Button
                    w={"100%"}
                    py={3}
                    color={"white"}
                    rounded={0}
                    fontWeight={500}
                    bg={
                      documentStatus === "In Progress"
                        ? "orange"
                        : documentStatus === "Done"
                        ? "success.100"
                        : documentStatus === "Stuck"
                        ? "danger.100"
                        : documentStatus === "Canceled"
                        ? "grey"
                        : "danger.100"
                    }
                    _hover={{ opacity: 0.8 }}
                    key={documentStatus}
                    variant={
                      documentStatus === selectedDocumentStatus
                        ? "solid"
                        : "outline"
                    }
                    onClick={() => {
                      handleDocumentStatusChange(documentStatus);
                      setDocumentStatusIsOpen(false);
                    }}
                  >
                    {documentStatus}
                  </Button>
                </Center>
              ))}
            </PopoverBody>
          </PopoverContent>
        </Popover>
      );
    case "timeline":
      return (
        <Box>
          <Progress value={calculateProgress()} rounded={"full"} />

          {/* Text */}
          <Tooltip
            label={`${calculateDaysRemaining()} days remaining`}
            hasArrow
          >
            <Text textAlign="center" mt={2}>
              {`${startdate} - ${enddate}`}
            </Text>
          </Tooltip>
        </Box>

        // format date
        // <Text w={"100%"}>{String(formatDateNoTime(props.value))}</Text>
      );
    case "customs_clearance":
      return (
        <Tooltip
          hasArrow
          pb={0}
          px={0}
          boxShadow={"xl"}
          borderRadius={"25px"}
          minH={"100px"}
          minW={"120px"}
          label={
            <>
              <Box p={4}>
                <Flex>
                  <Avatar name={props.value.name} size={"lg"} />
                  <Flex flexDirection={"column"} ml={4}>
                    <Text fontSize={"xl"} my={1}>
                      {props.value.name}
                    </Text>
                    <Text my={1} textOverflow={"ellipsis"}>
                      {props.value.jobTitle}
                    </Text>
                    <Badge
                      w={"fit-content"}
                      my={1}
                      colorScheme={
                        props.value.role === "Admin" ? "success" : null
                      }
                      color={props.value.role === "Admin" ? "white" : ""}
                    >
                      {props.value.role}
                    </Badge>
                  </Flex>
                </Flex>
              </Box>
              <Box
                as={Flex}
                h={"100%"}
                w={"100%"}
                roundedBottom={"25px"}
                justifyContent={"center"}
                alignItems={"center"}
              >
                <ButtonGroup
                  isAttached
                  variant={"outline"}
                  p={0}
                  m={0}
                  w={"100%"}
                >
                  <Menu>
                    <MenuButton
                      as={Button}
                      bg={"primary.80"}
                      rounded={0}
                      roundedBottom={"25px"}
                    >
                      Contact Details
                    </MenuButton>
                    <MenuList>
                      <MenuItem
                        onClick={() => {
                          navigator.clipboard.writeText(
                            props.value.phone_number
                          );
                          showsuccess("Copied to clipboard successfully");
                        }}
                      >
                        <Grid
                          templateColumns={"auto 1fr auto"}
                          alignItems={"center"}
                          gap={2}
                        >
                          <Text>Phone Number: {props.value.phone_number}</Text>
                          <Icon as={FaCopy} />
                        </Grid>
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          navigator.clipboard.writeText(props.value.email);
                          showsuccess("Copied to clipboard successfully");
                        }}
                      >
                        {/* Copy to clipboard */}
                        <Grid
                          templateColumns={"auto 1fr auto"}
                          alignItems={"center"}
                          gap={2}
                        >
                          <Text>Email: {props.value.email}</Text>
                          <Icon as={FaCopy} />
                        </Grid>
                      </MenuItem>
                    </MenuList>
                  </Menu>
                  <Button bg={"primary.80"} rounded={0} roundedBottom={"25px"}>
                    Ask for an update
                  </Button>
                </ButtonGroup>
              </Box>
            </>
          }
          bg="primary.80"
          color="text.primary"
          placement="top"
          isOpen={isTooltip2Open}
          onOpen={() => setIsTooltipOpen(true)}
          onMouseEnter={() => setIsTooltip2Open(true)}
          onMouseLeave={() => {
            setIsTooltip2Open(false);
          }}
          pointerEvents={"auto"}
        >
          <Avatar
            onMouseEnter={() => setIsTooltip2Open(true)}
            onMouseLeave={() => {
              setIsTooltip2Open(false);
            }}
            name={props.value.name}
            size={"sm"}
          />
        </Tooltip>
      );
    case "shippingline_key_contact":
      return (
        <Text
          as={"a"}
          href={`mailto:${props.value}`}
          textDecoration={"underline"}
          color={"action.80"}
        >
          {props.value}
        </Text>
      );
    case "phone_number":
      return (
        <Grid
          templateColumns={"auto 1fr"}
          gap={2}
          alignItems="center"
          w={"100%"}
        >
          <Text fontSize={"xl"}>{Emoji}</Text>
          <Text fontSize={"md"}> {props.value}</Text>
        </Grid>
      );
    default:
      return String(props.value);
  }
}
