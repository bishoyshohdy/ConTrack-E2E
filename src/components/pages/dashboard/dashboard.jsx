import { Icon, CheckCircleIcon , CheckIcon} from "@chakra-ui/icons";

import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  Tabs, 
  TabList, 
  TabPanels, 
  Tab, 
  TabPanel, 
  chackraProvider, 
  Circle,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton, 
} from "@chakra-ui/react";
import React, { useEffect, useState, useContext, useRef } from "react";
import StatCard from "../../ui/card/stat-card";
import ComplexTable from "../../ui/table/complex-table";
import CardTable from "../../ui/table/card-table";
import AlarmTable from "../../ui/table/alarm-table";
import TabPan from "../../ui/tabs/tab-panel";
import theme from "../../ui/tabs/tab-theme";
import Map from "../../ui/map/map";
import "./dashboard.css";
import { useNavigate } from "react-router-dom";
import { BiFilter } from "react-icons/bi";
import { showsuccess } from "../../../helpers/toast-emitter";
import {
  extractAlarmHeaders,
  extractUniqueKeys,
  formatLocalToISOUTC,
} from "../../../helpers/array-map";
import { actionAlarm, getAlarms, getAlarmsTypes } from "../../../api/alarms";
import FunctionalModal from "../../ui/functional-modal/functional-modal";
import HistoryPicker from "../../ui/history-picker/history-picker";
import StyledSelect from "../../ui/styled-select/styled-select";
import { ALARM_STATUS, SEVERITY } from "../../../data/alarms";
import { DevicesContext } from "../../../context/devices";
import CyLockIcon from "../../ui/icon/cylock-icon";
import { ThemeContext } from "../../../context/theme";
import CyTagIcon from "../../ui/icon/cytag-icon";
import AlarmIcon from "../../ui/icon/alarm-icon";
import PdfExport from "../../ui/pdf-export/pdf-export";
import ExcelExport from "../../ui/excel-export/excel-export";
import { FaMapMarkedAlt } from "react-icons/fa";
import GeneralAccordion from "../../ui/general-accordion/general-accordion";
import { GiCargoCrate } from "react-icons/gi";
import { hasPermission } from "../../../helpers/permissions-helper";
import { PERMISSIONS } from "../../../types/devices";
import { set } from "react-hook-form";
import { debounce } from 'lodash';
import TagContainer from "../../ui/table/tag-container";


export function AlarmAction({
  actionPerformed,
  alarm,
  callback,
  acknowldgeAction,
  useAlarmId,
}) {
  const actionAlarmCall = () => {
    actionAlarm(
      alarm,
      acknowldgeAction ? ALARM_STATUS.ACKNOWLEDGED : ALARM_STATUS.CLEARED
    ).then((res) => {
      showsuccess(`Alarm ${acknowldgeAction ? "acknowledged" : "cleared"}`);
      callback(useAlarmId ? alarm : {});
    });
  };



  return (
    <Box as={Flex} justifyContent={"center"}>
      {!actionPerformed ? (
        <FunctionalModal
          modalTitle={acknowldgeAction ? "Acknowledge alarm" : "Clear alarm"}
          modalMinW={"70%"}
          modalMinH={"200px"}
          btnColor={"action.100"}
          btnAction={
            <Button
              onClick={actionAlarmCall}
              bg={"primary.100"}
              color={"text.purple"}
            >
              {acknowldgeAction ? "Acknowledge" : "Clear"}
            </Button>
          }
        >
          Are You Sure you want to {acknowldgeAction ? "acknowledge" : "clear"}{" "}
          this alarm?
        </FunctionalModal>
      ) : (
        <Icon
          as={CheckIcon}
          borderRadius={"20px"}
          boxSize={"30px"}
          color={"text.primary"}
          bg={"gray.600"}
        />
      )}
    </Box>
  );
}



function Dashboard() {
  const deviceCtx = useContext(DevicesContext);
  const themeCtx = useContext(ThemeContext);

  const [markers, setMarkers] = useState([]);
  const navigate = useNavigate();
  const [cycollects, setCycollects] = useState([]);
  const [cytags, setCytags] = useState([]);
  const [selectedCytags, setSelectedCytags] = useState([]);
  const [alarms, setAlarms] = useState([]);
  const [alarmsData, setAlarmsData] = useState([]);

  const [alarmTypes, setAlarmTypes] = useState([]);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [alarmType, setAlarmType] = useState();
  const [entity, setEntity] = useState();
  const [notified, setNotified] = useState();
  const [severity, setSeverity] = useState();
  const [status, setStatus] = useState();
  const [alarmTablePage, setAlarmTablePage] = useState(0);
  const [deviceTablePage, setDeviceTablePage] = useState(0);
  const [tagsTablePage, setTagsTablePage] = useState(0);

  const [activeTab, setActiveTab] = useState(0);
  const [isHovered, setIsHovered] = useState(0);

  
  const [isLoadingAlarms, setIsLoadingAlarms] = useState(true);

  
  const refAlarm = useRef(null);
  const refDevices = useRef(null);
  const refTags = useRef(null);

  useEffect(() => {
    deviceCtx.getDevicesCall();
  }, []);

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
            alarm.alarm_settings.alarm_type.name
            //  +
            // " : " +
            // alarm.alarm_settings.configurations.telemetry_type;
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
          details += `${key} : ${alarm.details[key]}`;
        });
        newObj.details = details;
        newObj.start_time = alarm.start_time;
        newObj.updated_time = alarm.updated_time;
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
        newObj.current_status = alarm.current_status;
        delete newObj.alarm_settings;
        // if(details.split(" : ")[0] !== "Undetected tag"){
        alarmss.push(newObj);
        // }
      }
    });
    return alarmss;
  };

  const getAlarmsCall = (filters) => {
    getAlarms(filters)
      .then((res) => {
        setIsLoadingAlarms(false);
        setAlarms(setupAlarms(res.data));
        setAlarmsData(
          setupAlarms(res.data).map((oneAlarm) => {
            delete oneAlarm.Acknowledge;
            return oneAlarm;
          })
        );
      })}


  const handleFilter = (reset) => {
    const filters = {};
    if (reset) {
      getAlarmsCall(filters);
    } else {
      if (startDate !== "" && startDate !== undefined && startDate !== "-1") {
        const startDateISO = formatLocalToISOUTC(startDate);
        filters.from_date = startDateISO;
      }
      if (endDate !== "" && endDate !== undefined && endDate !== "-1") {
        const endDateISO = formatLocalToISOUTC(endDate);
        filters.to_date = endDateISO;
      }
      if (notified !== "" && notified !== undefined && notified !== "-1") {
        filters.notified = notified;
      }
      if (alarmType !== "" && alarmType !== undefined && alarmType !== "-1") {
        filters.alarm_type = alarmType;
      }
      if (severity !== "" && severity !== undefined && severity !== "-1") {
        filters.severity = severity;
      }
      if (status !== "" && status !== undefined && status !== "-1") {
        filters.status = status;
      }
      if (entity !== "" && entity !== undefined && entity !== "-1") {
        filters.entity_id = entity;
      }
      getAlarmsCall(filters);
    }
  };
  const redirectToCytag = (row) => {
    return navigate(
      "device/Cytag/" +
      row.find((col) => col.column.Header === "NAME").value +
      "/" +
      row.find((col) => col.column.Header === "ID").value
    );
  };

  const redirectToDevice = (row) => {
    return navigate(
      "device/" +
      row.find((col) => col.column.Header === "NAME").value +
      "/" +
      row.find((col) => col.column.Header === "IMEI").value
    );
  };
  useEffect(() => {
    setMarkers(
      cycollects.map((dev) => {
        return { position: { lat: dev.lat, lng: dev.lng }, name: dev.name };
      })
    );
  }, [cycollects]);
  const [statToday, setStatToday] = useState();
  const [statYesterday, setStatYesterday] = useState();
  const [statLastWeek, setStatLastWeek] = useState();
  const [statLastMonth, setStatLastMonth] = useState();

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  const lastWeek = new Date();
  lastWeek.setDate(today.getDate() - 7);
  const lastMonth = new Date();
  lastMonth.setMonth(today.getMonth() - 1);
  useEffect(() => {
    if (deviceCtx && deviceCtx.devicesObj.devices) {

      setCycollects(
        deviceCtx.devicesObj.devices.cycollector
          ? deviceCtx.devicesObj.devices.cycollector
          : []
      );
      setCytags(
        deviceCtx.devicesObj.devices.cytag
          ? deviceCtx.devicesObj.devices.cytag
          : []
      );

        getAlarmsCall({});
    }
    if (deviceCtx) {
      setStatToday(deviceCtx.statToday);
      setStatYesterday(deviceCtx.statYesterday);
      setStatLastWeek(deviceCtx.statLastWeek);
      setStatLastMonth(deviceCtx.statLastMonth);
    }
    getAlarmsTypes().then((res) => {
      setAlarmTypes(res.data);
    });
  }, [deviceCtx]);

  const prepareExportDataAlarms = (data) => {
    data.map((alarm) => {
      delete alarm.Acknowledge;
      delete alarm.description;
      delete alarm.id;
      Object.keys(alarm).forEach((key) => {
        if (alarm[key]) {
          alarm[key] = String(alarm[key]) + "";
        } else {
          delete alarm[key];
        }
      });
      return alarm;
    });
    return data;
  };
  const prepareExportDataCyLock = (data) => {
    const keys = extractUniqueKeys(data);
    data.map((dev) => {
      let cytagStr = "";
      dev.cytags &&
        typeof dev.cytags !== "string" &&
        dev.cytags.forEach((cytag) => {
          cytagStr += cytag.name + ",";
        });
      dev.cytags = cytagStr;
      delete dev.roles;
      keys.forEach((key) => {
        if (key !== "roles" && key !== "lat" && key !== "lng") {
          if (dev[key]) {
            dev[key] = String(dev[key]) + "";
          } else {
            dev[key] = "-";
          }
        }
      });
      return dev;
    });
    return data;
  };
  const prepareExportDataCyTag = (data) => {
    data.map((dev) => {
      delete dev.roles;
      const keys = Object.keys(dev);
      keys.forEach((key) => {
        if (dev[key]) {
          dev[key] = String(dev[key]) + "";
        } else {
          delete dev[key];
        }
      });
      return dev;
    });
    return data;
  };
  const handleClickToScroll = (refto) => {
    console.log("SCROLLING", refto);
    refto.current?.scrollIntoView({ behavior: "smooth" });
  };

  function handleTabHover(index) {
    setIsHovered(index);
  }

  function handleTabClick(index) {
    setActiveTab(index);
  }


  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  function toggleDrawer () {
    setIsDrawerOpen(!isDrawerOpen);
  }
  

  return (
    <>
      <Box position="relative" h="100vh" >
          <Tabs isFitted variant='solid-rounded' size="sm" m={5} defaultIndex={1}>
            <TabList>
              <Tab 
                mx={2}
                _selected={{ color: 'white', bg: 'action.100'}}
                _hover={{bg: 'action.80'}}
              >
                <Box>
                  <Circle
                    size="80px"
                    borderRadius={'40%'}
                    position={'relative'}
                    top={'25%'}
                    bg={'transparent'}
                    margin={"5px"}
                  >
                    <AlarmIcon
                      margin={"auto"}
                      p={"15%"}
                      color={themeCtx.theme.colors && themeCtx.theme.colors.text.primary}
                    />
                  </Circle>
                </Box>
                <Text fontSize='4xl' > {alarms && alarms.length} Alarms</Text>
              </Tab>
              
              <Tab    
                mx={2}
                _selected={{ color: 'white', bg: 'action.100'}}
                _hover={{bg: 'action.80'}}
              >
                <Box>
                  <Circle
                    size="80px"
                    borderRadius={'40%'}
                    position={'relative'}
                    top={'25%'}
                    bg={'transparent'}
                    margin={"5px"}

                  >
                    <CyLockIcon
                      margin={"auto"}
                      p={"auto"}
                      color={themeCtx.theme.colors && themeCtx.theme.colors.text.primary}
                    />
                  </Circle>
                </Box>
                <Text fontSize='4xl'> {cycollects && cycollects.length} CyLocks</Text>
              </Tab>
        
              <Tab 
                mx={2}
                _selected={{ color: 'white', bg: 'action.100'}}
                _hover={{bg: 'action.80'}}
              >
                <Box>
                  <Circle
                    size="80px"
                    borderRadius={'40%'}
                    position={'relative'}
                    top={'25%'}
                    margin={"5px"}
                    bg={'transparent'}
                  >
                    <CyTagIcon
                      margin={"auto"}
                      p={"15%"}
                      color={
                        themeCtx.theme.colors && themeCtx.theme.colors.text.primary
                      }
                    />
                  </Circle>
                </Box>
                <Text fontSize='4xl'> {cytags && cytags.length} Cytags</Text>
              </Tab>
         
              </TabList>

             {/*  */}
            <Box w={"100%"} mb={2} mt={5}>
        <GeneralAccordion
          title={
            <Box p={"1%"} w={"100%"} gap={1} as={Flex}>
              <Icon as={FaMapMarkedAlt} fontSize="2xl" color={"action.100"} />
              <Heading w={"100%"} color={"text.primary"} fontSize={"2xl"}>
                CyLocks Map
              </Heading>
            </Box>
          }
        >
          <Box
            backgroundColor={"primary.80"}
            w={"100%"}
            minH={"480px"}
            h={"100%"}
            mt={1}
            borderRadius={"5px"}
          >
            <Map minH={"450px"} trips={false} markers={markers} />
          </Box>
        </GeneralAccordion>
              </Box>

            <TabPanels>
              <TabPanel p={"0px"} mb={5}>
                <Box mb={5} ref={refAlarm} mt={5}>
                  <AlarmTable
                    hiddenCols={[
                      "id",
                      "current_status",
                      "description",
                      "resolved_time",
                      "notified",
                      "entity_id",
                    ]}
                    pageNumber={alarmTablePage}
                    setPageNumber={setAlarmTablePage}
                    extractFn={extractAlarmHeaders}
                    title={"Alarms"}
                    icon={
                      <AlarmIcon
                        boxSize={"30px"}
                        margin={"auto"}
                        color={themeCtx.theme.colors && themeCtx.theme.colors.action[100]}
                      />
                    }
                    data={[...alarms]}
                    isLoading={isLoadingAlarms}
                  >

                  </AlarmTable>
                </Box>
              </TabPanel>
              <TabPanel p={"0px"}>
                <div ref={refDevices}>

                  {/* DEVICES TABLE */}
                  <Box mt={5}>
                  <CardTable
                    toggleDrawer={toggleDrawer}
                    isLoading={deviceCtx.isLoadingCylocks}
                    pageNumber={deviceTablePage}
                    setPageNumber={setDeviceTablePage}
                    redirectToDevice={redirectToDevice}
                    cytagsBtn={
                      cytags.length !== 0
                        ? (rows) =>
                          setSelectedCytags(
                            cytags.filter((cytag) => cytag.cycollector_id === rows) 
                          )
                        : null 
                    }
                    data={
                      hasPermission(PERMISSIONS.GET_DEVICE_DETAILS) &&
                        hasPermission(PERMISSIONS.GET_DEVICE) &&
                        hasPermission(PERMISSIONS.GET_ALL_DEVICES) &&
                        hasPermission(PERMISSIONS.GET_DEVICES_REQUESTS) &&
                        hasPermission(PERMISSIONS.GET_DEVICES_TELEMETRY) &&
                        hasPermission(PERMISSIONS.GET_DEVICES_SPATIAL)
                        ? cycollects.map((lock) => {
                          return { ...lock, imei: lock.id };
                        })
                        : []
                    }
                    hiddenCols={[
                      "pccw_iccid",
                      "satcom_iccid",
                      "cytags",
                      "latest_values",
                      "id",
                      "lat",
                      "lng",
                    ]}
                    title={"CyLocks"}
                    icon={
                      <CyLockIcon
                        boxSize={"30px"}
                        margin={"auto"}
                        color={themeCtx.theme.colors && themeCtx.theme.colors.action[100]}
                        
                      />
                    }
                  >
                    <Box as={Flex} gap={1}>
                      <PdfExport
                        title={"CyLocks"}
                        data={prepareExportDataCyLock([...cycollects])}
                      />
                      <ExcelExport
                        title={"CyLocks"}
                        data={prepareExportDataCyLock([...cycollects])}
                      />
                    </Box>
                  </CardTable>
                  </Box>


                  {/* Connected Cytags */}
                  <Box mt={5}>
                  {cytags.length !== 0 && (
                      <>
                      <Drawer
                      isOpen={isDrawerOpen}
                      placement='bottom'
                      onClose={toggleDrawer}

                      >
                      <DrawerOverlay />
                      <DrawerContent
                        bg={"primary.80"}
                        color={"text.primary"}
                        borderRadius={"10px"}
                      >
                        <DrawerCloseButton />
                        <DrawerBody >
                        <TagContainer
                          redirectToDevice={redirectToCytag}
                          data={selectedCytags}
                          title={"Connected CyTags"}
                          icon={
                            <CyTagIcon
                              boxSize={"30px"}
                              margin={"auto"}
                              color={
                                themeCtx.theme.colors && themeCtx.theme.colors.action[100]
                              }
                            />
                          }
                        />
                        </DrawerBody>
                      </DrawerContent>
                      </Drawer>

                        
                        </>
                  )}
                  </Box>

                  {/* Stop */}
                </div>
              </TabPanel>
              <TabPanel p={"0px"}>
              <Box mt={5}>
                {cytags.length !== 0 && (
                  <Box mt={1} w={"100%"} ref={refTags}>
                    <TagContainer
                      isLoading={deviceCtx.isLoadingCytags}
                      pageNumber={tagsTablePage}
                      setPageNumber={setTagsTablePage}
                      redirectToDevice={redirectToCytag}
                      data={cytags}
                      title={"CyTags"}
                      icon={
                        <CyTagIcon
                          boxSize={"30px"}
                          margin={"auto"}
                          color={
                            themeCtx.theme.colors && themeCtx.theme.colors.action[100]
                          }
                          
                        />
                      }
                    >
                      <Box as={Flex} gap={1}>
                        <PdfExport
                          title={"CyTags"}
                          data={prepareExportDataCyTag([...cytags])}
                        />
                        <ExcelExport
                          title={"CyTags"}
                          data={prepareExportDataCyTag([...cytags])}
                        />
                      </Box>
                    </TagContainer>
                  </Box>
                )}
                </Box>
              </TabPanel>
            </TabPanels>
          </Tabs>
      </Box>

    </>
  );
}

export default Dashboard;
