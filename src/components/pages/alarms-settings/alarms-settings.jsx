import React, { useContext, useEffect, useState } from "react";
import {
  createAlarmSetting,
  getAlarmSettings,
  getAlarmsTypes,
} from "../../../api/alarms";
import { Box, Button, Flex, useDisclosure } from "@chakra-ui/react";
import ComplexTable from "../../ui/table/complex-table";
import { Icon } from "@chakra-ui/icon";
import { BiAlarm } from "react-icons/bi";
import validator from "@rjsf/validator-ajv8";
import Form from "@rjsf/chakra-ui";
import {
  createAlarmSettingSchema,
  getAlarmSettingUiSchema,
  getFormsWidgets,
} from "../../../data/alarms";
import { showsuccess } from "../../../helpers/toast-emitter";
import { extractAlarmHeaders, flattenObject } from "../../../helpers/array-map";
import { capatalizeName } from "../../../helpers/string-operations";
import ObjectFieldTemplate from "../../form-widgets/custom-object";
import FunctionalModalV2 from "../../ui/functional-modal-v2/functional-modal-v2";
import { DevicesContext } from "../../../context/devices";
import { DEVICES, PERMISSIONS } from "../../../types/devices";
import { hasPermission } from "../../../helpers/permissions-helper";

const NO_TYPE_SELECTED = "-choose a type-";
const UNDETECTED_TAG = "undetected_tag";

function AlarmsSettings() {
  const [alarmTypes, setAlarmTypes] = useState([]);
  const [schema, setSchema] = useState({});
  const formRef = React.useRef(null);
  const [update, setUpdate] = useState(false);
  const [alarmSetting, setAlarmSetting] = useState([]);
  const deviceCtx = useContext(DevicesContext);
  const hiddenCols = [
    "id",
    "uneditable_fields",
    "notification_settings",
    "message_types",
  ];
  if (!hasPermission(PERMISSIONS.EDIT_ALARMS_SETTINGS)) {
    hiddenCols.push("edit");
  }
  if (!hasPermission(PERMISSIONS.ASSIGN_ALARMS_SETTINGS)) {
    hiddenCols.push("entities");
  }
  const findDeviceTypes = (msgTypes) => {
    let cylockFlag = false;
    let cytagFlag = false;
    msgTypes.forEach((type) => {
      type.device_types.forEach((dev) => {
        if (dev.name === DEVICES.CYCOLLECTOR) {
          cylockFlag = true;
        } else if (dev.name === DEVICES.CYTAG) {
          cytagFlag = true;
        }
      });
    });
    if ((cylockFlag && cytagFlag) || (!cylockFlag && !cytagFlag)) {
      return "";
    }
    if (cylockFlag && !cytagFlag) {
      return DEVICES.CYCOLLECTOR;
    }
    if (!cylockFlag && cytagFlag) {
      return DEVICES.CYTAG;
    }
  };
  const getAlarmSettingsCall = (allalarmTypes) => {
    console.log("IN getAlarmSettingsCall", allalarmTypes);
    getAlarmSettings().then((settingRes) => {
      setAlarmSetting(
        settingRes.data.map((o) => {
          const newObj = flattenObject(o);
          return {
            ...newObj,
            entities: {
              value: newObj.entities,
              type:
                newObj.name === UNDETECTED_TAG
                  ? DEVICES.CYTAG
                  : findDeviceTypes(newObj.message_types),
            },
            edit: {
              alarm: o,
              callback: getAlarmSettingsCall,
              alarmTypes: allalarmTypes,
            },
            delete: {
              alarmSetting: o,
              callback: getAlarmSettingsCall,
              alarmTypes: allalarmTypes,
            },
          };
        })
      );
    });
  };
  useEffect(() => {
    if (deviceCtx) {
      getAlarmsTypes().then((res) => {
        const allalarmTypes = [
          {
            name: NO_TYPE_SELECTED,
            configurations_schema: { title: NO_TYPE_SELECTED },
          },
          ...res.data.map((t) => {
            return {
              ...t,
              configurations_schema: {
                ...t.configurations_schema,
                title: t.name,
              },
            };
          }),
        ];
        console.log("USEEFFECT Alarm ty:", allalarmTypes);
        setAlarmTypes(allalarmTypes);
        getAlarmSettingsCall(allalarmTypes);
        setSchema(
          createAlarmSettingSchema(
            allalarmTypes,
            deviceCtx.geofences || [],
            deviceCtx.routes || []
          )
        );
      });
    }
  }, [deviceCtx]);

  useEffect(() => {
    if (update) {
      setUpdate(false);
      getAlarmSettings().then((settingRes) => {
        setAlarmSetting(
          settingRes.data.map((o) => {
            const newObj = flattenObject(o);
            return {
              ...newObj,
              entities: {
                value: newObj.entities,
                type:
                  newObj.name === UNDETECTED_TAG
                    ? DEVICES.CYTAG
                    : findDeviceTypes(newObj.message_types),
              },
              edit: { alarm: o, alarmTypes: alarmTypes },
              delete: {
                alarmSetting: o,
                callback: getAlarmSettingsCall,
                alarmTypes: alarmTypes,
              },
            };
          })
        );
      });
      console.log("Aka", alarmTypes);
      setSchema(
        createAlarmSettingSchema(
          alarmTypes,
          deviceCtx.geofences || [],
          deviceCtx.routes || []
        )
      );
    }
  }, [update]);

  const createAlarmSettingCall = (data) => {
    const alarmType = alarmTypes.find(
      (type) => type.name === data.alarm_type
    ).id;
    if (data.alarm_type === "CyLock Battery") {
      data.telemetry_type = "Cylock Battery";
    }
    if (data.alarm_type === "CyTag Battery") {
      data.telemetry_type = "battery";
    }
    delete data.alarm_type;
    const severity = data.severity;
    delete data.severity;
    const enabled = data.enabled ? data.enabled : false;
    delete data.enabled;
    createAlarmSetting(alarmType, data, severity, enabled).then((res) => {
      setUpdate(true);
      onClose();
      showsuccess("Added new settings");
    });
  };
  const { isOpen, onOpen, onClose } = useDisclosure({
    id: "modal-alarm-settings",
  });

  return (
    <>
      <Box mt={2} mb={2} as={Flex} justifyContent={"end"}>
        {hasPermission(PERMISSIONS.CREATE_ALARMS_SETTINGS) && (
          <Button color={"text.primary"} bg={"action.100"} onClick={onOpen}>
            Create Alarm Configurations
          </Button>
        )}

        <FunctionalModalV2
          closeBtn={
            <Button
              color={"text.primary"}
              bg={"danger.100"}
              mr={3}
              onClick={onClose}
            >
              Close
            </Button>
          }
          isOpen={isOpen}
          modalTitle={"Create Alarm Configurations"}
          modalMinH={"100%"}
          footer={true}
          modalMinW={"70%"}
        >
          <Form
            showErrorList={false}
            onChange={() =>
              console.log(
                "form refff :",
                formRef.current && formRef.current.state.formData
              )
            }
            ref={formRef}
            formData={
              formRef.current
                ? { ...formRef.current.state.formData }
                : { alarm_type: NO_TYPE_SELECTED }
            }
            schema={schema}
            validator={validator}
            onSubmit={() =>
              createAlarmSettingCall(
                formRef.current && formRef.current.state.formData
              )
            }
            uiSchema={getAlarmSettingUiSchema(
              [],
              false,
              deviceCtx ? deviceCtx.geofences : [],
              deviceCtx ? deviceCtx.routes : []
            )}
            widgets={getFormsWidgets()}
            templates={{ ObjectFieldTemplate }}
          />
        </FunctionalModalV2>
      </Box>
      {alarmTypes &&
        alarmTypes.map((type, index) => {
          return (
            type.name !== NO_TYPE_SELECTED && (
              <Box key={index} mb={2}>
                <ComplexTable
                  data={alarmSetting.filter((sett) => sett.name === type.name)}
                  extractFn={extractAlarmHeaders}
                  hiddenCols={hiddenCols}
                  title={
                    capatalizeName(type.name).replaceAll("_", " ") +
                    " Alarm Settings"
                  }
                  icon={
                    <Icon as={BiAlarm} boxSize={"30px"} color={"action.100"} />
                  }
                />
              </Box>
            )
          );
        })}
    </>
  );
}

export default AlarmsSettings;
