import React, { useState, useContext, useEffect, useRef } from "react";
import { Icon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  Image,
  Stack,
  Heading,
  Tag,
  Button,
} from "@chakra-ui/react";
import StatCard from "../../ui/card/stat-card";
import ComplexTable from "../../ui/table/complex-table";
import { GiBatteryPack } from "react-icons/gi";
import { FiThermometer } from "react-icons/fi";
import "./cytag-page.css";
import HistoryPicker from "../../ui/history-picker/history-picker";
import { WiHumidity } from "react-icons/wi";
import CytagImg from "../../../assets/images/devices/cytag.webp";
import { DevicesContext } from "../../../context/devices";
import { useParams } from "react-router-dom";
import { BsLightning } from "react-icons/bs";
import {
  getDeviceTypesById,
  getMessagesWithType,
  getTelemetry,
} from "../../../api/devices";
import { DEVICES } from "../../../types/devices";
import { BiAlarm } from "react-icons/bi";
import { getAlarms } from "../../../api/alarms";
import { ALARM_STATUS } from "../../../data/alarms";
import {
  extractAlarmHeaders,
  extractContainerHeaders,
  formatDate,
} from "../../../helpers/array-map";
import DeviceChart from "../device/device-chart/device-chart";
import { FcOvertime } from "react-icons/fc";
import TableV2 from "../../ui/table-v2/table-v2";
import SpinnerLoader from "../../ui/loader/spinner-loader";
import { io } from "socket.io-client";
const URL = process.env.REACT_APP_SERVER_URL;
function CytagPage() {
  const { Id, identifier } = useParams();
  const deviceCtx = useContext(DevicesContext);
  const [device, setDevice] = useState();
  const [alarms, setAlarms] = useState([]);
  const [battery, setBattery] = useState("");
  const [lastBatteryTimestamp, setLastBatteryTimestamp] = useState();
  const [temp, setTemp] = useState("");
  const [lastTempTimestamp, setLastTempTimestamp] = useState();
  const [humid, setHumid] = useState("");
  const [lastHumidTimestamp, setLastHumidTimestamp] = useState();
  const [lightIntensity, setLightIntensity] = useState("");
  const [lastLightIntensityTimestamp, setLastLightIntensityTimestamp] =
    useState();
  const [messageTypes, setMessageTypes] = useState([]);
  const [alarmTablePage, setAlarmTablePage] = useState(0);
  const [loadingLabels, seLoadingLabels] = useState(true);
  const [isConnected, setIsConnected] = useState();

  const getMessageTypes = () => {
    getDeviceTypesById(identifier).then((res) => {
      setMessageTypes(res.data.data);
      if (res.data.data.length !== 0) {
        getMessageLabels(res.data.data);
      }
    });
  };
  const getMessageLabels = (messagetypes = messageTypes) => {
    let typesIds = [];
    const batType = messagetypes.find((type) => type.name === "Battery");
    const lightType = messagetypes.find(
      (type) => type.name === "Light Intensity"
    );
    const tempType = messagetypes.find((type) => type.name === "Temperature");
    const humidType = messagetypes.find((type) => type.name === "Humidity");
    if (batType && lightType && tempType && humidType) {
      typesIds = [batType.id, lightType.id, tempType.id, humidType.id];
      getMessagesWithType(typesIds, "1", device.id)
        .then((res) => {
          if (res.data.data[batType.id + ""].length !== 0) {
            setBattery(res.data.data[batType.id + ""][0].message_value);
            setLastBatteryTimestamp(
              res.data.data[batType.id + ""][0].message_time
            );
          }
          if (res.data.data[lightType.id + ""].length !== 0) {
            setLightIntensity(
              res.data.data[lightType.id + ""][0].message_value
            );
            setLastLightIntensityTimestamp(
              res.data.data[lightType.id + ""][0].message_time
            );
          }
          if (res.data.data[tempType.id + ""].length !== 0) {
            setTemp(res.data.data[tempType.id + ""][0].message_value);
            setLastTempTimestamp(
              res.data.data[tempType.id + ""][0].message_time
            );
          }
          if (res.data.data[humidType.id + ""].length !== 0) {
            setHumid(res.data.data[humidType.id + ""][0].message_value);
            setLastHumidTimestamp(
              res.data.data[humidType.id + ""][0].message_time
            );
          }
          seLoadingLabels(false);
        })
        .catch((e) => seLoadingLabels(false));
    }
  };
  useEffect(() => {
    if (!device) {
      setDevice(deviceCtx.getDevice(Id, DEVICES.CYTAG));
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
    getAlarms(filters).then((res) => {
      setAlarms(setupAlarms(res.data));
    });
  };

  const [paginationData, setPaginationData] = useState({
    data: [],
    numberOfPages: 0,
    pageNum: 0,
    numberPerPage: 25,
  });

  useEffect(() => {
    device &&
      getTelemetryPagination(
        paginationData.pageNum,
        paginationData.numberPerPage
      );

    device && getMessageTypes();
    device && getAlarmsCall({ entity_id: device.id });
  }, [device]);

  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [tableStartDate, setTableStartDate] = useState();
  const [tableEndDate, setTableEndDate] = useState();
  // const { theme } = useContext(ThemeContext);

  const pageNumber = useRef(0);
  const numberPerPageRef = useRef(25);

  const getTelemetryPagination = (pageNum, numberPerPage) => {
    pageNumber.current = pageNum;
    numberPerPageRef.current = numberPerPage;
    getTelemetry(
      device.id,
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

  const refreshedTelePagination = () => {
    console.log(
      `refreshing page ${pageNumber.current} number/page ${numberPerPageRef.current}`
    );
    getTelemetryPagination(pageNumber.current, numberPerPageRef.current);
  };

  useEffect(() => {
    if (device) {
      const intervalId = setInterval(() => {
        if (!tableStartDate && !tableEndDate) {
          refreshedTelePagination();
        }
      }, 10000);
      return () => clearInterval(intervalId);
    }
  }, [device]);

  const getLabel = () => {
    if (tableStartDate && tableEndDate) {
      return `${formatDate(tableStartDate)} - ${formatDate(tableEndDate)}`;
    } else {
      return "Latest Messages";
    }
  };

  useEffect(() => {
    let socket = io(URL, { secure: true }).connect();
    console.log("is connected ?", socket.connected);
    function onConnect() {
      console.log("Connected");
      setIsConnected(true);
    }
    function onDisconnect() {
      console.log("Disconnected");
      setIsConnected(false);
    }

    function newMessageHandler(value) {
      console.log("value= ", value);
      if (!tableStartDate && !tableEndDate && pageNumber.current === 0) {
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
    function newAlarmHandler(value) {
      console.log(value);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on(`${identifier}/message`, newMessageHandler);
    socket.on(`${identifier}/alarm`, newAlarmHandler);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off(`${identifier}/message`, newMessageHandler);
      socket.off(`${identifier}/alarm`, newAlarmHandler);
    };
  }, [paginationData]);

  useEffect(() => {
    const handlePageClose = (event) => {
      socket.disconnect();
      setIsConnected(false);
    };

    window.addEventListener("beforeunload", handlePageClose);
    window.addEventListener("popstate", handlePageClose);
    window.addEventListener("hashchange", handlePageClose);

    return () => {
      window.removeEventListener("beforeunload", handlePageClose);
      window.removeEventListener("popstate", handlePageClose);
      window.removeEventListener("hashchange", handlePageClose);
    };
  }, []);

  return (
    <>
      <div className={"grid"}>
        <Box w={"100%"} borderRadius={"5px"} bg={"primary.80"}>
          <Box
            borderTopRadius={"5px"}
            gap={2}
            p={3}
            alignItems={"center"}
            as={Flex}
            bg={"card.100"}
          >
            <Image
              borderRadius="full"
              bg={"primary.100"}
              p={2}
              objectFit={"scale-down"}
              w={"100px"}
              h={"100px"}
              alt="device"
              src={CytagImg}
            />
            <Box>
              <Heading fontSize={"3xl"} color={"text.primary"}>
                {device && device.name}
              </Heading>
              <Tag
                mt={2}
                p={1}
                bg={"action.100"}
                fontSize="sm"
                textDecoration={"underline"}
                color={"text.primary"}
              >
                Bluetooth ID: {device && device.id}
              </Tag>
            </Box>
          </Box>
          <Stack p={4} spacing="3">
            <StatCard
              icon={
                <GiBatteryPack
                  size={"25px"}
                  h={"100%"}
                  display={"block"}
                  margin={"auto"}
                  p={"20%"}
                  color="secondary.60"
                />
              }
              title="Battery"
              subTitle={
                <SpinnerLoader
                  loading={loadingLabels}
                  body={battery ? `${parseFloat(battery)} V` : ""}
                />
              }
              subText={
                lastBatteryTimestamp
                  ? `Last updated at: ${formatDate(lastBatteryTimestamp)}`
                  : ""
              }
              bgColor={"card.100"}
              textColor={"secondary.100"}
              maxH={"xs"}
              maxW={"100%"}
            />
            <StatCard
              icon={
                <WiHumidity
                  size={"30px"}
                  h={"100%"}
                  display={"block"}
                  margin={"auto"}
                  p={"20%"}
                  color="secondary.60"
                />
              }
              title="Humidity"
              subTitle={
                <SpinnerLoader
                  loading={loadingLabels}
                  body={humid ? `${parseFloat(humid)} %RH` : ""}
                />
              }
              subText={
                lastHumidTimestamp
                  ? `Last updated at: ${formatDate(lastHumidTimestamp)}`
                  : ""
              }
              bgColor={"card.100"}
              textColor={"secondary.100"}
              maxH={"xs"}
              maxW={"100%"}
            />
            <StatCard
              icon={
                <FiThermometer
                  size={"30px"}
                  h={"100%"}
                  display={"block"}
                  margin={"auto"}
                  p={"20%"}
                  color="secondary.60"
                />
              }
              title="Tempreture"
              subTitle={
                <SpinnerLoader
                  loading={loadingLabels}
                  body={temp ? `${parseFloat(temp)} C` : ""}
                />
              }
              subText={
                lastTempTimestamp
                  ? `Last updated at: ${formatDate(lastTempTimestamp)}`
                  : ""
              }
              bgColor={"card.100"}
              textColor={"secondary.100"}
              maxH={"xs"}
              maxW={"100%"}
            />
            <StatCard
              icon={
                <BsLightning
                  size={"30px"}
                  h={"100%"}
                  display={"block"}
                  margin={"auto"}
                  p={"20%"}
                  color="secondary.60"
                />
              }
              title="Light Intensity"
              subTitle={
                <SpinnerLoader
                  loading={loadingLabels}
                  body={
                    lightIntensity ? `${parseFloat(lightIntensity)} hlx` : ""
                  }
                />
              }
              subText={
                lastLightIntensityTimestamp
                  ? `Last updated at: ${formatDate(
                      lastLightIntensityTimestamp
                    )}`
                  : ""
              }
              bgColor={"card.100"}
              textColor={"secondary.100"}
              maxH={"xs"}
              maxW={"100%"}
            />
          </Stack>
        </Box>
        <Box mb={1} as={Flex} w={"100%"}>
          <DeviceChart
            startType={"Temperature"}
            mb={"0"}
            mt={"0"}
            id={device ? device.id : ""}
            setStartDate={setStartDate}
            options={messageTypes
              .filter((t) => t.graph_type !== null)
              .map((op) => {
                return { label: op.name, value: op.id, ...op };
              })}
            startDate={startDate}
            endDate={endDate}
            setEndDate={setEndDate}
          />
        </Box>
      </div>
      <Box w="100%" margin={"0.5%"}>
        <ComplexTable
          hiddenCols={[
            "id",
            "alarm_settings",
            "description",
            "notified",
            "entity_id",
          ]}
          pageNumber={alarmTablePage}
          setPageNumber={setAlarmTablePage}
          extractFn={extractAlarmHeaders}
          title={"Alarms"}
          icon={<Icon as={BiAlarm} boxSize={"30px"} color={"action.100"} />}
          data={alarms}
        />
      </Box>
      <Box margin={"0.5%"}>
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
              {/* <ExcelExport
                title={"Timeseries "}
                data={excelData}
              /> */}
            </Box>
          </Box>
        </TableV2>
      </Box>
    </>
  );
}

export default CytagPage;
