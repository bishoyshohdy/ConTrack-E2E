import React, { useEffect, useState } from "react";
import FunctionalModal from "../../../ui/functional-modal/functional-modal";
import {
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Text,
  Center,
  Button,
} from "@chakra-ui/react";
import { AlarmAction } from "../../dashboard/dashboard";
import { formatDate } from "../../../../helpers/array-map";
import { DeleteIcon } from "@chakra-ui/icons";
import { deleteAlarmSettings, getAlarms } from "../../../../api/alarms";
import { showsuccess } from "../../../../helpers/toast-emitter";

export function AlarmsList({ alarms, callbackFn }) {
  const [alarmsMapped, setAlarmsMapped] = useState([]);
  useEffect(() => {
    const alarmsmap = [];
    alarms.forEach((alarm) => {
      alarmsmap.push({
        id: alarm.id,
        severity: alarm.alarm_settings.severity,
        entity: alarm.entity ? alarm.entity.name : "",
        type: alarm.alarm_settings.alarm_type.name,
        start_time: alarm.start_time,
        updated_time: alarm.updated_time,
        Clear: { alarm: alarm.id },
      });
    });
    setAlarmsMapped([...alarmsmap]);
  }, [alarms]);
  return (
    <TableContainer>
      <Text>
        You need to clear these alarms first before you can delete this alarm
        settings
      </Text>
      {alarmsMapped && alarmsMapped.length > 0 && (
        <Table variant="simple">
          <Thead>
            <Tr>
              {Object.keys(alarmsMapped[0]).map((key) => {
                return <Th>{key.toUpperCase().replaceAll("_", " ")}</Th>;
              })}
            </Tr>
          </Thead>
          <Tbody>
            {alarmsMapped.map((alarm) => {
              return (
                <Tr>
                  {Object.keys(alarmsMapped[0]).map((key) => {
                    if (key === "Clear") {
                      return (
                        <AlarmAction
                          useAlarmId={true}
                          callback={callbackFn}
                          actionPerformed={false}
                          acknowldgeAction={false}
                          alarm={alarm.id}
                        />
                      );
                    } else if (key === "updated_time" || key === "start_time") {
                      return <Td>{formatDate(alarm[key])}</Td>;
                    } else {
                      return <Td>{alarm[key]}</Td>;
                    }
                  })}
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      )}
    </TableContainer>
  );
}

function DeleteAlarmSetting({ alarmSetting, callback, alarmTypes }) {
  const [alarms, setAlarms] = useState([]);
  const filterAlarms = (alarmId) => {
    setAlarms([...alarms.filter((alarm) => alarm.id !== alarmId)]);
  };
  const deleteAlarmSettingCall = () => {
    deleteAlarmSettings(alarmSetting.id)
      .then(() => {
        showsuccess("successfully deleted alarm setting");
        console.log("DELETE :", alarmTypes);
        callback(alarmTypes);
      })
      .catch((err) => {
        if (err.response.status === 403) {
          setAlarms(err.response.data.data);
        }
      });
  };
  return (
    <Center>
      <FunctionalModal
        iconBtn={DeleteIcon}
        modalTitle={"Delete alarm setting"}
        btnColor={"danger.100"}
        btnAction={
          <Button
            bg={"action.100"}
            color={"text.primary"}
            onClick={deleteAlarmSettingCall}
          >
            Delete alarm setting
          </Button>
        }
        modalMinW={"80%"}
      >
        {alarms.length === 0 ? (
          <Text>Are you sure you want to delete this alarm setting?</Text>
        ) : (
          <AlarmsList alarms={alarms} callbackFn={filterAlarms} />
        )}
      </FunctionalModal>
    </Center>
  );
}
export default DeleteAlarmSetting;
