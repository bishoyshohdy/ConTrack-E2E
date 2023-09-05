import React from "react";
import { Badge, Icon, Center } from "@chakra-ui/react";
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
import { FaLock, FaLockOpen } from "react-icons/fa";
import CytagChip from "../components/ui/cytag-chip/cytag-chip";
import DeleteAlarmSetting from "../components/pages/alarms-settings/delete-alarm-settings/delete-alarm-settings";
import { hasPermission } from "./permissions-helper";
import { PERMISSIONS } from "../types/devices";

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
  // const cols = [];
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
        return String(props.value);
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
        <Badge
          w={"100%"}
          textAlign={"center"}
          p={1}
          variant="solid"
          bg={mapThreatToColor(props.value)}
        >
          {props.value}
        </Badge>
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
      return String(props.value);
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
