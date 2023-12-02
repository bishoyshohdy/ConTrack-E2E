import { CopyIcon, Icon } from "@chakra-ui/icons";
import {
  Box,
  Center,
  Flex,
  Image,
  Heading,
  Button,
  Tag,
  ButtonGroup,
  IconButton,
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  AccordionIcon,
  TagLeftIcon,
  TagLabel,
  Spacer,
  Text,
  Grid,
  GridItem,
  Circle,
  useBreakpointValue,
} from "@chakra-ui/react";
import React, { useEffect, useContext, useState, useRef } from "react";
import { SiMicrosoftexcel } from "react-icons/si";
import StatCard from "../../ui/card/stat-card";
import StatBox from "../../ui/card/stat-box";
import ComplexTable from "../../ui/table/complex-table";
import { GiBatteryPack, GiCargoCrate, GiSattelite } from "react-icons/gi";
import "./device.css";
import HistoryPicker from "../../ui/history-picker/history-picker";
import { FcOvertime } from "react-icons/fc";
import CycollectImg from "../../../assets/images/devices/cycollector.webp";
import { DevicesContext } from "../../../context/devices";
import { useParams } from "react-router-dom";
import { AiFillLock, AiFillUnlock } from "react-icons/ai";
import { TbAntenna, TbRoute } from "react-icons/tb";
import { HiOutlineLocationMarker } from "react-icons/hi";
import {
  getTelemetry,
  changeLockStatus,
  getDeviceTypesById,
  getMessagesWithType,
  exportTelemetry,
} from "../../../api/devices";
import DeviceFunctions from "./device-functions/device-functions";
import {
  editDeviceConfigurations,
  editDeviceThresholds,
  changeWifiConfigrations,
  editDeviceMode,
  uploadFirmWareFile,
  getDeviceModes,
  editDeviceAlarmInterval,
} from "../../../api/configurations";
import { showinfo, showsuccess } from "../../../helpers/toast-emitter";
import { DEVICES, PERMISSIONS } from "../../../types/devices";
import {
  addGeofenceToDevice,
  addTrip,
  changeTripStatus,
  deleteDeviceGeofence,
  editDeviceGeofence,
  getDeviceGeofences,
  getTripsByDevice,
} from "../../../api/geofences";
import { BiAlarm } from "react-icons/bi";
import { getAlarms } from "../../../api/alarms";
import { ALARM_STATUS } from "../../../data/alarms";
import {
  extractAlarmHeaders,
  extractContainerHeaders,
  formatDate,
} from "../../../helpers/array-map";
import StyledSelect from "../../ui/styled-select/styled-select";
import RoutesMap from "../../ui/routes-map/routes-map";
import { TripStatus } from "../../../data/trips";
import DeviceChart from "./device-chart/device-chart";
import { FaBroadcastTower, FaSimCard } from "react-icons/fa";
import moment from "moment-timezone";
import { MdGpsFixed } from "react-icons/md";
import { hasPermission } from "../../../helpers/permissions-helper";
import TableV2 from "../../ui/table-v2/table-v2";
import SpinnerLoader from "../../ui/loader/spinner-loader";
import { io } from "socket.io-client";
import { ThemeContext } from "../../../context/theme";
const URL = process.env.REACT_APP_SERVER_URL;

const FileDownload = require("js-file-download");

const EmptyGridItem = () => {
  const Theme = useContext(ThemeContext);
  const gradientDark = "linear-gradient(to top, transparent, #2d3748cc)";
  const gradientLight = "linear-gradient(to top, transparent, #e6e8ebcc)";
  const gradient = Theme.darkMode ? gradientDark : gradientLight;
  return (
    <Box
      rounded={"xl"}
      // if dark mode
      bg={gradient}
      w={"100%"}
      h={"250px"}
    />
  );
};

function Device() {
  const { Id, identifier } = useParams();
  const deviceCtx = useContext(DevicesContext);
  const [device, setDevice] = useState();
  const [alarms, setAlarms] = useState([]);
  const [messageTypes, setMessageTypes] = useState([]);
  const [tringLoc, setTringLoc] = useState(false);
  const [deviceGeofences, setDeviceGeofences] = useState([]);
  const [alarmTablePage, setAlarmTablePage] = useState(0);
  const [isConnected, setIsConnected] = useState();
  const [loadingExportReport, setLoadingExportRepord] = useState(false);
  const Theme = useContext(ThemeContext);

  const getMessageTypes = () => {
    getDeviceTypesById(identifier).then((res) => {
      setMessageTypes(res.data.data);
      getLatestValues(res.data.data);
    });
  };

  const getLatestValues = (messageTypes) => {
    const batType = messageTypes.find((type) => type.name === "Cylock Battery");
    const latType = messageTypes.find((type) => type.name === "Latitude");
    const lngType = messageTypes.find((type) => type.name === "Longitude");
    const lattrinType = messageTypes.find(
      (type) => type.name === "Latitude Triangulation"
    );
    const lngtrinType = messageTypes.find(
      (type) => type.name === "Longitude Tringulation"
    );
    const commType = messageTypes.find((type) => type.name === "Communication");
    getMessagesWithType(
      [
        commType.id,
        batType.id,
        latType.id,
        lngType.id,
        lattrinType.id,
        lngtrinType.id,
      ],
      "1",
      identifier,
      null,
      null
    )
      .then((res) => {
        const lat1 = res.data.data[latType.id + ""];
        const lng1 = res.data.data[lngType.id + ""];
        const lat2 = res.data.data[lattrinType.id + ""];
        const lng2 = res.data.data[lngtrinType.id + ""];
        if (res.data.data[batType.id + ""].length !== 0) {
          setBattery(res.data.data[batType.id + ""][0].message_value);
          setLastBatteryTimestamp(
            res.data.data[batType.id + ""][0].message_time
          );
        }
        if (res.data.data[commType.id + ""].length !== 0) {
          setComm(res.data.data[commType.id + ""][0].message_value);
          setLastCommTimestamp(res.data.data[commType.id + ""][0].message_time);
        }
        if (lat2.length === 0 && lat1.length !== 0) {
          setLat(lat1[0].message_value);
          setLng(lng1[0].message_value);
          setLastLocationTimestamp(lat1[0].message_time);
        } else if (lat1.length === 0 && lat2.length !== 0) {
          setLat(lat2[0].message_value);
          setLng(lng2[0].message_value);
          setLastLocationTimestamp(lat2[0].message_time);
        } else if (lat1.length !== 0 && lat2.length !== 0) {
          if (
            moment(lat1[0].message_time).diff(
              moment(lat2[0].message_time),
              "seconds"
            ) >= 0
          ) {
            setTringLoc(false);
            setLat(lat1[0].message_value);
            setLng(lng1[0].message_value);
            setLastLocationTimestamp(lat1[0].message_time);
          } else {
            setTringLoc(true);
            setLat(lat2[0].message_value);
            setLng(lng2[0].message_value);
            setLastLocationTimestamp(lat2[0].message_time);
          }
        }
        setLatestValuesLoading(false);
      })
      .catch((err) => {
        console.err(err);
        setLatestValuesLoading(false);
      });
  };

  useEffect(() => {
    if (!device) {
      setDevice(deviceCtx.getDevice(Id, DEVICES.CYCOLLECTOR));
      setLocked(device ? device.lock_status : true);
    }
  }, [deviceCtx]);

  const setupAlarms = (alarms) => {
    const alarmss = [];
    alarms.forEach((alarm) => {
      const newObj = {};
      const entity = deviceCtx.getDeviceById(alarm.entity_id, "");
      if (entity) {
        newObj.severity = alarm.alarm_settings.severity;
        newObj.entity = entity ? entity.name : "";
        if (alarm.alarm_settings.configurations.telemetry_type) {
          newObj.type =
            alarm.alarm_settings.alarm_type.name +
            " : " +
            alarm.alarm_settings.configurations.telemetry_type;
        } else {
          newObj.type = alarm.alarm_settings.alarm_type.name;
        }
        if (alarm.alarm_settings.configurations.max) {
          newObj.max = alarm.alarm_settings.configurations.max;
        } else {
          newObj.max = "-";
        }
        if (alarm.alarm_settings.configurations.min) {
          newObj.min = alarm.alarm_settings.configurations.min;
        } else {
          newObj.min = "-";
        }
        let details = "";
        Object.keys(alarm.details).forEach((key) => {
          details += `${key}:${alarm.details[key]}`;
        });
        newObj.details = details;
        newObj.start_time = alarm.start_time;
        newObj.updated_time = alarm.updated_time;
        newObj.current_status = alarm.current_status;
        if (alarm.current_status === ALARM_STATUS.ACTIVE) {
          newObj.Acknowledge = { alarm: alarm.id, callback: getAlarmsCall };
        } else {
          newObj.Acknowledge = { actionPerformed: true };
        }
        if (alarm.current_status !== ALARM_STATUS.CLEARED) {
          newObj.Clear = { alarm: alarm.id, callback: getAlarmsCall };
        } else {
          newObj.Clear = { actionPerformed: true };
        }
        delete newObj.alarm_settings;
        alarmss.push(newObj);
      }
    });
    return alarmss;
  };
  const getAlarmsCall = (filters) => {
    //  console.log("GETTING ALARMS")
    getAlarms(filters).then((res) => {
      setAlarms(setupAlarms(res.data));
    });
  };

  useEffect(() => {
    if (device) {
      getMessageTypes();
      console.log("getMessageType inside useEffect");
      getDeviceModes(identifier).then((res) => {
        setStatus(res.data.Status);
        setPreviousStatus(res.data.previous_Status);
        setStatusUpdatedTime(res.data.Status_updated_time);
        setStatusRequestedAt(res.data.Status_requested_at);
      });
      getDeviceGeofences(identifier).then((res) => {
        setDeviceGeofences(
          res.data.device_geofences
            .map((geo) => geo.geofence)
            .map((geonewo) => {
              return {
                ...geonewo,
                center: { lat: geonewo.center[0], lng: geonewo.center[1] },
                polygon: geonewo.polygon.map((latLng) => {
                  return { lat: latLng[0], lng: latLng[1] };
                }),
              };
            })
        );
      });
      setMarkers([
        {
          position: {
            lat: device.lat,
            lng: device.lng,
          },
          name: device.name,
        },
      ]);
      getTelemetryPagination(
        paginationData.pageNum,
        paginationData.numberPerPage
      );
      getAlarmsCall({ entity_id: identifier });
      getTripsCall();
      // prepareExportDataTimesireis();
    }
  }, [device]);

  const [inProgressTrip, setInProgressTrip] = useState();
  const getTripsCall = () => {
    getTripsByDevice(identifier).then((res) => {
      setTrips(res.data.trips);
      res.data.trips.forEach((trip) => {
        if (trip.status === TripStatus.IN_PROGRESS) {
          setInProgressTrip(trip);
        }
      });
    });
  };
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [tableStartDate, setTableStartDate] = useState();
  const [tableEndDate, setTableEndDate] = useState();
  const [markers, setMarkers] = useState([]);
  const [locked, setLocked] = useState(device ? device.lock_status : true);

  const handleTelemetryExport = () => {
    setLoadingExportRepord(true);
    exportTelemetry(identifier, tableStartDate, tableEndDate)
      .then((res) => {
        console.log("here");
        console.log(res);
        FileDownload(res.data, "report.csv");
        setLoadingExportRepord(false);
      })
      .catch(() => {
        console.log("ERROR IN HANDLE");
        setLoadingExportRepord(false);
      });
  };
  const setConfigurations = ({
    deviceMode,
    gpsInterval,
    cytagScan,
    callback,
  }) => {
    editDeviceConfigurations(
      identifier,
      gpsInterval,
      cytagScan,
      deviceMode
    ).then(() => {
      callback();
      showsuccess("Successfully updated configurations");
    });
  };

  const setThresholds = ({
    maxT,
    maxH,
    minLight,
    minH,
    maxLight,
    minT,
    callback,
  }) => {
    editDeviceThresholds(
      identifier,
      minT,
      maxT,
      minH,
      maxH,
      minLight,
      maxLight
    ).then(() => {
      callback();
      showsuccess("Successfully updated thresholds");
    });
  };

  const setWifi = ({ wifiName, wifiPassword, callback }) => {
    changeWifiConfigrations(identifier, wifiName, wifiPassword).then(() => {
      callback();
      showsuccess("Successfully updated wifi credentials");
    });
  };
  const setDeviceMode = ({ mode, callback }) => {
    editDeviceMode(identifier, mode).then(() => {
      callback();
      showsuccess("Successfully updated device mode");
    });
  };
  const sendFirmwareUpdate = ({ file, version, callback }) => {
    uploadFirmWareFile(identifier, file, version).then(() => {
      callback();
      showsuccess(`Successfully sent device firmware v${version}`);
    });
  };
  const editDeviceAlarmIntervalCall = ({ alarmInterval, callback }) => {
    editDeviceAlarmInterval(identifier, alarmInterval).then(() => {
      callback();
      showsuccess("Successfully updated device alarm interval");
    });
  };
  const handleLockToggle = (status) => {
    changeLockStatus(identifier, !status ? "Unlock" : "Lock").then((res) => {
      showsuccess(`Successfully ${!status ? "Unlocked" : "Locked"} the device`);
      setLocked(status);
    });
  };

  const updateDeviceGeofenceList = (geofenceId, geofenceType) => {
    addGeofenceToDevice(
      geofenceId,
      identifier,
      DEVICES.CYCOLLECTOR,
      geofenceType
    ).then((res) => {
      deviceCtx.getDevicesCall();
      showsuccess("Successfully updated geofence for this device");
    });
  };
  const removeDeviceGeofence = (geofenceId) => {
    deleteDeviceGeofence(identifier, geofenceId).then((res) => {
      deviceCtx.getDevicesCall();
      showsuccess("Successfully removed geofence for this device");
    });
  };
  const updateDeviceGeofence = (geofenceId, active) => {
    editDeviceGeofence(identifier, geofenceId, active).then((res) => {
      deviceCtx.getDevicesCall();
      showsuccess("Successfully activated geofence for this device");
    });
  };

  const [route, setRoute] = useState();
  const [routes, setRoutes] = useState([]);
  const [tripDate, setTripDate] = useState();
  const [trip, setTrip] = useState();
  const [trips, setTrips] = useState([]);

  const createTrip = () => {
    addTrip(route, identifier, tripDate).then((res) => {
      showsuccess("successfully added trip");
      getTripsCall();
    });
  };
  const [paginationData, setPaginationData] = useState({
    data: [],
    numberOfPages: 0,
    pageNum: 0,
    numberPerPage: 25,
  });

  const pageNumber = useRef(0);
  const numberPerPageRef = useRef(25);

  const getTelemetryPagination = (pageNum, numberPerPage) => {
    pageNumber.current = pageNum;
    numberPerPageRef.current = numberPerPage;
    console.log("getting time series data");
    getTelemetry(
      identifier,
      tableStartDate,
      tableEndDate,
      pageNum,
      numberPerPage
    ).then((res) => {
      setPaginationData({
        data: res.data.data.grouped_messages,
        numberOfPages: res.data.data.pages_number,
        pageNum: pageNum,
        numberPerPage: numberPerPage,
      });
    });
  };

  useEffect(() => {
    if (deviceCtx) {
      setRoutes(deviceCtx.routes);
    }
  }, [deviceCtx]);

  const getTripField = (tripId, field) => {
    try {
      const trip = trips.find((t) => t.id === parseInt(tripId));
      // return trip[field];
      return trip[field].toUpperCase().charAt(0) + trip[field].slice(1);
    } catch (error) {
      console.error(
        "could not find the trip with the given id try again later maybe we can find it"
      );
      return "";
    }
  };

  const copyLocationLink = () => {
    navigator.clipboard.writeText(
      `https://www.google.com/maps/?q=${device.lat},${device.lng}`
    );
    showsuccess("Copied google maps link to clipboard");
  };

  const switchTripMsg = (status) => {
    switch (status) {
      case TripStatus.IN_PROGRESS:
        return "Started";
      case TripStatus.COMPLETED:
        return "Completed";
      case TripStatus.PENDING:
        return "Stoped";
      default:
        break;
    }
  };

  const changeTripStatusCall = (trip, status) => {
    changeTripStatus(trip, status).then((res) => {
      showsuccess(`Successfully ${switchTripMsg(status)} the trip`);
      getTripsCall();
    });
  };

  const [currentTrip, setCurrentTrip] = useState([]);
  const [battery, setBattery] = useState("");
  const [lastBatteryTimestamp, setLastBatteryTimestamp] = useState();
  const [lat, setLat] = useState("");
  const [lastLocationTimestamp, setLastLocationTimestamp] = useState();
  const [lng, setLng] = useState("");
  const [status, setStatus] = useState();
  const [previousStatus, setPreviousStatus] = useState();
  const [statusUpdatedTime, setStatusUpdatedTime] = useState();
  const [statusRequestedAt, setStatusRequestedAt] = useState();
  const [comm, setComm] = useState("");
  const [lastCommTimestamp, setLastCommTimestamp] = useState();
  const [latestValuesLoading, setLatestValuesLoading] = useState(true);
  const setTripInMap = (trip) => {
    setTrip(trip);
    const route = trips.find((t) => t.id === parseInt(trip)).route;
    Object.assign(route, {
      points: route.points.map((point) => {
        return {
          lat: point[0],
          lng: point[1],
        };
      }),
    });
    setCurrentTrip([route]);
  };

  const getLabel = () => {
    if (tableStartDate && tableEndDate) {
      return `${formatDate(tableStartDate)} - ${formatDate(tableEndDate)}`;
    } else {
      return "Latest Messages";
    }
  };

  const [socket, setSocket] = useState(undefined);

  useEffect(() => {
    let socket = io(URL + "devices", {
      secure: true,
      upgrade: false,
      autoConnect: false,
    }).connect();

    setSocket(socket);
    console.log("is connected ?", socket.connected);

    function onConnect() {
      socket.emit("join_room", identifier);
      console.log("Connected");
    }
    socket.on("connect_error", () => {
      socket.close();
    });

    socket.on("disconnect", (reason) => {
      if (reason === "io server disconnect") {
        console.log("Disconnected");
        socket.close();
      }
      if (reason === "transport close") {
        console.log("Disconnected");
        socket.close();
      }
      if (reason === "transport error") {
        console.log("Disconnected");
        socket.close();
      }
      if (reason === "ping timeout") {
        console.log("Disconnected");
        socket.close();
      }
    });
    function onClose() {
      console.log("Disconnected");
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onClose);

    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    function newMessageHandler(value) {
      console.log("value= ", value);
      if (
        !tableStartDate &&
        !tableEndDate &&
        pageNumber.current === 0 &&
        paginationData.data
      ) {
        const updatedPaginationData = paginationData.data;
        if (
          updatedPaginationData.length > 0 &&
          updatedPaginationData[0].message_time === value.message_time
        ) {
          for (var key of Object.keys(value)) {
            updatedPaginationData[0][key] = value[key];
          }
        } else {
          if (updatedPaginationData.length === paginationData.numberPerPage) {
            updatedPaginationData.pop();
          }
          updatedPaginationData.unshift(value);
        }
        setPaginationData({ ...paginationData, data: updatedPaginationData });
      }
    }
    if (socket) {
      socket.removeAllListeners(`${identifier}/message`);
      socket.on(`${identifier}/message`, newMessageHandler);
    }
  }, [socket, paginationData]);

  const DarkGradient1 = "linear-gradient(to bottom, #9b29e7cc 20%, #2d3748)";
  const DarkGradient2 = "linear-gradient(to top, #9b29e7cc, #2d3748 25%)";
  const LightGradient1 = "linear-gradient(to top, #229CE2cc, #e6e8eb )";
  const LightGradient2 = "linear-gradient(to bottom, #229CE2cc, #e6e8eb 25%)";

  const gradient1 = Theme.darkMode ? DarkGradient1 : LightGradient1;
  const gradient2 = Theme.darkMode ? DarkGradient2 : LightGradient2;

  return (
    <>
      <Flex
        alignContent={"center"}
        p={4}
        gap={4}
        flexDir={["column", "column", "column", "row"]}
      >
        {/* CyLock Info */}
        <Box
          minW={"55%"}
          borderRadius={"25px"}
          bg={"primary.80"}
          minH={"500px"}
          boxShadow={"0px 0px 5px 0px rgba(0,0,0,0.5)"}
        >
          {/* CyLock Info Header */}
          <Flex
            p={4}
            justifyContent={{ base: "center", md: "start" }}
            alignContent={{ base: "center", md: "start" }}
          >
            <Circle
              w={{ base: "70px", md: "100px" }}
              h={{ base: "70px", md: "100px" }}
              bg={"primary.100"}
              m={2}
            >
              <Image
                p={3}
                objectFit={"scale-down"}
                w={{ base: "70px", md: "100px" }}
                h={{ base: "70px", md: "100px" }}
                alt="device"
                src={CycollectImg}
              />
            </Circle>
            <Box ms={{ base: 4, md: 0 }}>
              <Heading
                fontSize={{ base: "xl", md: "3xl" }}
                color={"text.primary"}
                m={2}
              >
                <Text>{device && device.name}</Text>
              </Heading>
              <Tag
                bg={"primary.80"}
                p={1}
                mt={2}
                fontSize="sm"
                textDecoration={"underline"}
                color={"text.primary"}
              >
                IMEI: {device && identifier}
              </Tag>
              <Tag
                bg={"primary.80"}
                p={1}
                mt={2}
                ml={1}
                fontSize="sm"
                textDecoration={"underline"}
                color={"text.primary"}
              >
                <TagLeftIcon boxSize="12px" as={GiCargoCrate} />
                <TagLabel>Container: {device && device.attached_to}</TagLabel>
              </Tag>
            </Box>
          </Flex>

          {/* CyLock Lock/Unlock */}
          <Box
            as={Flex}
            px={4}
            justifyContent={{ base: "center", md: "start" }}
          >
            {device && hasPermission(PERMISSIONS.LOCK_UNLOCK_DEVICE) && (
              <Box as={Flex}>
                <Center
                  zIndex={1}
                  className={!locked ? "leftTranslate" : "rightTranslate"}
                  color={"text.primary"}
                  borderRadius={"10px"}
                  bg={"primary.100"}
                  h={"40px"}
                  w={"152px"}
                >
                  {locked ? (
                    <Icon color={"green"} as={AiFillLock} boxSize={"30px"} />
                  ) : (
                    <Icon color={"red"} as={AiFillUnlock} boxSize={"30px"} />
                  )}
                </Center>
                <Center
                  as={Button}
                  zIndex={0}
                  borderLeftRadius={"10px"}
                  cursor={"pointer"}
                  color={"white"}
                  onClick={() => handleLockToggle(true)}
                  borderRightRadius={"0px"}
                  bg={"action.80"}
                  h={"40px"}
                  w={"150px"}
                  _hover={{ bg: "action.60" }}
                >
                  {!locked ? "Lock" : ""}
                </Center>
                <Center
                  as={Button}
                  zIndex={0}
                  borderRightRadius={"10px"}
                  cursor={"pointer"}
                  color={"white"}
                  onClick={() => handleLockToggle(false)}
                  borderLeftRadius={"0px"}
                  bg={"action.80"}
                  h={"40px"}
                  w={"150px"}
                  _hover={{ bg: "action.60" }}
                >
                  {!locked ? "" : "Unlock"}
                </Center>
              </Box>
            )}
          </Box>

          {/* Bento Grid */}
          <Center>
            <Grid
              my={4}
              p={4}
              templateColumns={{
                base: "repeat(1, 1fr)",
                md: "repeat(3, minmax(100px, 1fr))",
              }}
              gap={4}
            >
              <Center bg={gradient1} rounded={"xl"} p={0.5} boxShadow={"md"}>
                <GridItem
                  rowSpan={1}
                  colSpan={1}
                  rounded={"xl"}
                  bg="card.100"
                  w={"100%"}
                  h={"100%"}
                >
                  <StatBox
                    icon={<GiBatteryPack size={"25px"} />}
                    title="Battery"
                    textColor={"secondary.100"}
                    subTitle={
                      <SpinnerLoader
                        center={false}
                        transparent={true}
                        loading={latestValuesLoading}
                        body={battery ? `${parseFloat(battery)} V` : "-"}
                      />
                    }
                    subText={`Last updated at: ${
                      lastBatteryTimestamp
                        ? formatDate(lastBatteryTimestamp)
                        : "-"
                    }`}
                  />
                </GridItem>
              </Center>

              <Center bg={gradient2} rounded={"xl"} p={0.5} boxShadow={"md"}>
                <GridItem
                  rowSpan={1}
                  colSpan={1}
                  rounded={"xl"}
                  bg="card.100"
                  w={"100%"}
                  h={"100%"}
                >
                  <StatBox
                    icon={<TbAntenna size={"30px"} />}
                    title="Communication type"
                    subTitle={
                      <SpinnerLoader
                        center={false}
                        transparent={true}
                        loading={latestValuesLoading}
                        body={comm || "-"}
                      />
                    }
                    subText={
                      lastCommTimestamp
                        ? `Last updated at: ${formatDate(lastCommTimestamp)}`
                        : "-"
                    }
                    bgColor={"card.100"}
                    textColor={"secondary.100"}
                  />
                </GridItem>
              </Center>

              <Center bg={gradient1} rounded={"xl"} p={0.5} boxShadow={"md"}>
                <GridItem
                  rowSpan={1}
                  colSpan={1}
                  rounded={"xl"}
                  bg="card.100"
                  w={"100%"}
                  h={"100%"}
                >
                  {tringLoc ? (
                    <StatBox
                      icon={<FaBroadcastTower size={"30px"} />}
                      title="Location Type"
                      subTitle={"Triangulation Location"}
                      bgColor={"card.100"}
                      textColor={"secondary.100"}
                    />
                  ) : (
                    <StatBox
                      icon={<MdGpsFixed size={"30px"} />}
                      title="Location Type"
                      subTitle={"GPS Location"}
                      bgColor={"card.100"}
                      textColor={"secondary.100"}
                    />
                  )}
                </GridItem>
              </Center>

              <GridItem
                rowSpan={1}
                colSpan={{ base: 1, md: 2 }}
                rounded={"xl"}
                bg="card.100"
                boxShadow={"md"}
              >
                <Box mx={4}>
                  <StatCard
                    minH={"130px"}
                    width={"100%"}
                    icon={<AiFillLock size={"40px"} />}
                    subTitle={`Last requested status: ${status || "-"}`}
                    subText={`Last Status: ${previousStatus || "-"}`}
                    subText2={`last updated: ${
                      statusUpdatedTime ? formatDate(statusUpdatedTime) : "-"
                    }`}
                    subText3={`Requested at: ${
                      statusRequestedAt ? formatDate(statusRequestedAt) : "-"
                    }`}
                    textColor={"secondary.100"}
                  />
                </Box>
              </GridItem>

              <GridItem
                rowSpan={1}
                colSpan={1}
                rounded={"xl"}
                bg="card.100"
                boxShadow={"md"}
              >
                <StatBox
                  icon={<FaSimCard size={"30px"} />}
                  title="PCCW ICCID"
                  subTitle={
                    <Text fontSize={"md"}>
                      {device && device.pccw_iccid
                        ? `${device.pccw_iccid}`
                        : "-"}
                    </Text>
                  }
                  subText={""}
                  textColor={"secondary.100"}
                />
              </GridItem>

              <GridItem
                rowSpan={1}
                colSpan={1}
                rounded={"xl"}
                bg="card.100"
                boxShadow={"md"}
              >
                <StatBox
                  icon={<GiSattelite size={"40px"} />}
                  title="SATCOM ICCID"
                  subTitle={
                    <Text fontSize={"md"}>
                      {device && device.satcom_iccid
                        ? `${device.satcom_iccid}`
                        : "-"}
                    </Text>
                  }
                  subText={""}
                  textColor={"secondary.100"}
                />
              </GridItem>

              <GridItem
                rowSpan={1}
                colSpan={{ base: 1, md: 2 }}
                rounded={"xl"}
                bg="card.100"
                boxShadow={"md"}
              >
                <Box mx={4} my={3}>
                  <StatCard
                    icon={<HiOutlineLocationMarker size={"40px"} />}
                    title="Location"
                    subTitle={
                      <SpinnerLoader
                        center={false}
                        transparent={true}
                        loading={latestValuesLoading}
                        body={`LAT: ${device ? lat : "-"}, LNG: ${
                          device ? lng : "-"
                        }`}
                      />
                    }
                    subText={
                      lastLocationTimestamp
                        ? `Last updated at: ${formatDate(
                            lastLocationTimestamp
                          )}`
                        : "-"
                    }
                    textColor={"secondary.100"}
                  />
                </Box>
              </GridItem>

              <GridItem
                rowSpan={1}
                colSpan={{ base: 1, md: 2 }}
                rounded={"xl"}
                bg="card.100"
                boxShadow={"md"}
              >
                <Box mx={4} my={3}>
                  <StatCard
                    icon={<TbRoute size={"40px"} />}
                    title="In progress trips"
                    subTitle={
                      inProgressTrip && inProgressTrip.route
                        ? inProgressTrip.route.name
                        : "No trip is currently in progress"
                    }
                    subText={`Trip started at: ${
                      inProgressTrip
                        ? formatDate(inProgressTrip.start_date)
                        : "-"
                    }`}
                    textColor={"secondary.100"}
                  />
                </Box>
              </GridItem>

              <Center
                bg={gradient1}
                rounded={"xl"}
                p={0.5}
                boxShadow={"md"}
                colSpan={2}
              >
                <GridItem
                  rowSpan={1}
                  colSpan={1}
                  rounded={"xl"}
                  bg={"card.100"}
                  boxShadow={"md"}
                  w={"100%"}
                  h={"100%"}
                >
                  {/* CyLock Settings Buttons */}
                  <Flex justifyContent={"center"} my={5} mx={2}>
                    {device &&
                      hasPermission(PERMISSIONS.POST_DEVICE_MODE) &&
                      hasPermission(PERMISSIONS.EDIT_DEVICE_GEOFENCES) && (
                        <DeviceFunctions
                          removeDeviceGeofence={removeDeviceGeofence}
                          updateDeviceGeofenceList={updateDeviceGeofenceList}
                          updateDeviceGeofence={updateDeviceGeofence}
                          imei={identifier}
                          setConfig={setConfigurations}
                          changeMode={setDeviceMode}
                          changeThres={setThresholds}
                          changeWifi={setWifi}
                          updateFirmware={sendFirmwareUpdate}
                          createTrip={createTrip}
                          route={route}
                          setRoute={setRoute}
                          routes={routes}
                          setTripDate={setTripDate}
                          tripDate={tripDate}
                          editDeviceAlarmInterval={editDeviceAlarmIntervalCall}
                        />
                      )}
                  </Flex>
                </GridItem>
              </Center>

              {useBreakpointValue({
                base: null,
                md: (
                  <>
                    <EmptyGridItem /> <EmptyGridItem /> <EmptyGridItem />
                  </>
                ),
              })}
            </Grid>
          </Center>
        </Box>

        {/* Map & Battery Chart */}
        <Flex maxW={"100%"} minW={"45%"} flexDir={"column"}>
          <Box
            borderRadius={"25px"}
            backgroundColor={"primary.80"}
            boxShadow={"0px 0px 5px 0px rgba(0,0,0,0.5)"}
          >
            <Box
              m={1}
              w={"100%"}
              p={"2%"}
              alignContent={"baseline"}
              as={Flex}
              gap={4}
              paddingBottom={2}
              borderRadius={"25px"}
            >
              <Heading
                w={"100%"}
                color={"text.primary"}
                fontSize={"2xl"}
                as={Flex}
                justify={"space-between"}
              >
                <Flex>
                  <Icon
                    as={HiOutlineLocationMarker}
                    boxSize={"30px"}
                    me={2}
                    color={"action.80"}
                  />
                  <Text>Map</Text>
                </Flex>
                <Button
                  bg={"action.80"}
                  _hover={{ bg: "action.60" }}
                  leftIcon={<Icon as={CopyIcon} />}
                  onClick={() => copyLocationLink()}
                  textColor={"white"}
                  rounded={"xl"}
                >
                  Copy location
                </Button>
              </Heading>
            </Box>
            {/* <Map trips={false} markers={markers} /> */}
            {/* Map */}
            <Box my={6}>
              <RoutesMap
                zoom={16}
                geofences={deviceGeofences}
                markers={markers}
                routes={currentTrip}
                tripChoices={
                  trips.length !== 0 ? (
                    <Accordion m={1} w={"100%"} allowMultiple>
                      <AccordionItem>
                        <AccordionButton bg={"primary.80"}>
                          <Box
                            color={"text.primary"}
                            fontSize={"xl"}
                            textAlign="left"
                          >
                            Trips
                          </Box>
                          <AccordionIcon color={"white"} />
                        </AccordionButton>
                        <AccordionPanel>
                          <Box
                            w={"100%"}
                            alignContent={"center"}
                            as={Flex}
                            flexWrap={"wrap"}
                            gap={2}
                          >
                            <Box
                              as={Flex}
                              gap={1}
                              alignItems={"center"}
                              w={"100%"}
                              mb={1}
                            >
                              <StyledSelect
                                value={trip}
                                onchange={setTripInMap}
                                options={trips.map((trip) => {
                                  return {
                                    label: trip.route
                                      ? trip.route.name
                                      : "Unnamed Trip",
                                    value: trip.id,
                                  };
                                })}
                              />

                              {trip && getTripField(trip, "status") ? (
                                <Tag
                                  size={"lg"}
                                  color={"text.primary"}
                                  colorScheme="action"
                                  ml={"2"}
                                >
                                  {trip && getTripField(trip, "status")}
                                </Tag>
                              ) : (
                                <br />
                              )}
                            </Box>
                            <Flex>
                              <ButtonGroup
                                w={"100%"}
                                color={"text.primary"}
                                isAttached
                                variant="outline"
                              >
                                <Button
                                  onClick={() =>
                                    changeTripStatusCall(
                                      trip,
                                      TripStatus.IN_PROGRESS
                                    )
                                  }
                                  bg={"action.100"}
                                  isDisabled={
                                    trip &&
                                    getTripField(trip, "status") !==
                                      TripStatus.PENDING
                                  }
                                  color={"white"}
                                >
                                  Start Trip
                                </Button>
                                <Button
                                  onClick={() =>
                                    changeTripStatusCall(
                                      trip,
                                      TripStatus.COMPLETED
                                    )
                                  }
                                  bg={"action.100"}
                                  isDisabled={
                                    trip &&
                                    getTripField(trip, "status") !==
                                      TripStatus.IN_PROGRESS
                                  }
                                  color={"white"}
                                >
                                  Complete Trip
                                </Button>
                              </ButtonGroup>
                              <Button
                                ml={3}
                                w={"100%"}
                                variant="outline"
                                onClick={() =>
                                  changeTripStatusCall(trip, TripStatus.PENDING)
                                }
                                bg={"danger.100"}
                                isDisabled={
                                  trip &&
                                  getTripField(trip, "status") !==
                                    TripStatus.IN_PROGRESS
                                }
                                color={"white"}
                              >
                                Stop Trip
                              </Button>
                            </Flex>
                          </Box>
                        </AccordionPanel>
                      </AccordionItem>
                    </Accordion>
                  ) : null
                }
              />
            </Box>
          </Box>

          <Box
            mt={4}
            py={8}
            px={4}
            w={"100%"}
            borderRadius={"25px"}
            backgroundColor={"primary.80"}
            boxShadow={"0px 0px 5px 0px rgba(0,0,0,0.5)"}
          >
            <DeviceChart
              mb={4}
              id={device ? identifier : ""}
              options={messageTypes
                .filter((t) => t.graph_type !== null)
                .map((op) => {
                  return { label: op.name, value: op.id, ...op };
                })}
              setStartDate={setStartDate}
              startDate={startDate}
              endDate={endDate}
              setEndDate={setEndDate}
            />
          </Box>
        </Flex>
      </Flex>

      {/* Alarms */}
      <Box
        m={4}
        py={8}
        borderRadius={"25px"}
        backgroundColor={"primary.80"}
        boxShadow={"0px 0px 5px 0px rgba(0,0,0,0.5)"}
      >
        <ComplexTable
          hiddenCols={[
            "id",
            "alarm_settings",
            "description",
            "notified",
            "entity_id",
            "min",
            "max",
          ]}
          extractFn={extractAlarmHeaders}
          title={"Alarms"}
          icon={<Icon as={BiAlarm} boxSize={"30px"} color={"action.80"} />}
          data={alarms}
          pageNumber={alarmTablePage}
          setPageNumber={setAlarmTablePage}
        />
      </Box>

      {/* Time series data */}
      <Box
        m={4}
        py={8}
        px={4}
        borderRadius={"25px"}
        backgroundColor={"primary.80"}
        boxShadow={"0px 0px 5px 0px rgba(0,0,0,0.5)"}
      >
        <TableV2
          title={"Time series data"}
          icon={<Icon as={FcOvertime} boxSize={"30px"} color={"action.100"} />}
          fetchData={getTelemetryPagination}
          data={paginationData}
          extractFn={extractContainerHeaders}
          hiddenCols={["id", "device"]}
          defaultPageSize={25}
          firstCol={"message_time"}
        >
          <Box
            bg={"primary.80"}
            w={"100%"}
            as={Flex}
            gap={2}
            justifyContent={"space-between"}
            alignContent={"flex-start"}
          >
            <Box fontSize={"md"} mb={2} color={"text.primary"} w={"85%"}>
              <Tag
                fontSize={"md"}
                textAlign={"center"}
                //w={"100%"}
                color={"text.primary"}
                bg={"action.100"}
              >
                {getLabel()}
              </Tag>
            </Box>
            <Box
              bg={"primary.80"}
              as={Flex}
              flexWrap={"wrap"}
              gap={2}
              justifyContent={"end"}
              w={"60%"}
              alignContent={"flex-start"}
            >
              <Button
                onClick={() =>
                  device
                    ? getTelemetryPagination(
                        paginationData.pageNum,
                        paginationData.numberPerPage
                      )
                    : null
                }
                color={"text.primary"}
                bg={"action.100"}
                size={"sm"}
              >
                refresh
              </Button>
              <HistoryPicker
                selectStartDate={(date) => setTableStartDate(date)}
                handleClick={() =>
                  getTelemetryPagination(0, paginationData.numberPerPage)
                }
                selectEndDate={(date) => setTableEndDate(date)}
                disabled={!tableStartDate || !tableEndDate}
                startDate={tableStartDate}
                endDate={tableEndDate}
              />
              {device && hasPermission(PERMISSIONS.EXPORT_DEVICE_TELEMETRY) && (
                <>
                  {!loadingExportReport ? (
                    <IconButton
                      size={"sm"}
                      p={1}
                      color={"text.primary"}
                      bg={"action.100"}
                      rounded={"full"}
                      as={SiMicrosoftexcel}
                      onClick={handleTelemetryExport}
                    />
                  ) : (
                    <Tag
                      bg={"action.100"}
                      ml={1}
                      fontSize="md"
                      color={"text.primary"}
                    >
                      <TagLeftIcon boxSize="12px" as={SiMicrosoftexcel} />
                      <TagLabel>Preparing data</TagLabel>
                    </Tag>
                  )}
                </>
              )}
            </Box>
          </Box>
        </TableV2>
      </Box>
    </>
  );
}
export default Device;
