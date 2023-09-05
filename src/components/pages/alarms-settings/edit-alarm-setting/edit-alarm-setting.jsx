import React, { useContext, useEffect, useState } from "react";
import validator from "@rjsf/validator-ajv8";
import Form from "@rjsf/chakra-ui";
import { editAlarmSetting } from "../../../../api/alarms";
import {
  createAlarmSettingSchema,
  getAlarmSettingUiSchema,
  getFormsWidgets,
} from "../../../../data/alarms";
import { BiPencil } from "react-icons/bi";
import { showsuccess } from "../../../../helpers/toast-emitter";
import {
  Button,
  Center,
  Icon,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";
import FunctionalModalV2 from "../../../ui/functional-modal-v2/functional-modal-v2";
import { DevicesContext } from "../../../../context/devices";
import ObjectFieldTemplate from "../../../form-widgets/custom-object";

function EditAlarmSetting({ alarm, callback, alarmTypes }) {
  const [schema, setSchema] = useState({});
  const formRef = React.useRef(null);
  const [alarmSetting] = useState(alarm);
  const [formData, setFormData] = useState({});
  const deviceCtx = useContext(DevicesContext);
  const setDefaultValues = (formdata, alarmSetting) => {
    formdata.severity = alarmSetting.severity;
    formdata.alarm_type = alarmSetting.alarm_type.name;
    formdata.enabled = alarmSetting.enabled;
    if (alarmSetting.configurations) {
      // eslint-disable-next-line no-return-assign
      Object.keys(alarmSetting.configurations).forEach(
        (key) => (formdata[key] = alarmSetting.configurations[key])
      );
    }
    return formdata;
  };
  useEffect(() => {
    console.log("IN EDIT : ", alarmTypes);
    if (alarmTypes) {
      setSchema(
        createAlarmSettingSchema(
          alarmTypes,
          deviceCtx.geofences || [],
          deviceCtx.routes || []
        )
      );
      setFormData(setDefaultValues(formData, alarmSetting));
    }
  }, [deviceCtx]);
  const editAlarmSettingCall = (data) => {
    const editObj = {};
    if (data.severity !== alarm.severity) {
      editObj.severity = data.severity;
      delete data.severity;
    }
    if (data.enabled !== alarm.enabled) {
      editObj.enabled = data.enabled;
      delete data.enabled;
    }
    const configurations = {};
    Object.keys(alarm.configurations).forEach((key) => {
      if (key !== "alarm_type") {
        configurations[key] = data[key];
      }
    });
    if (Object.keys(configurations).length !== 0) {
      Object.keys(configurations).forEach((key) => {
        if (configurations[key] !== alarm.configurations[key]) {
          editObj.configurations = configurations;
        }
      });
    }
    editAlarmSetting({ alarm_settings_id: alarm.id, ...editObj }).then(
      (res) => {
        showsuccess("Successfully edited alarm setting");
        callback(alarmTypes);
        onClose();
      }
    );
  };
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Center>
      <IconButton
        onClick={onOpen}
        size={"sm"}
        rounded={"full"}
        bg={"yellow.400"}
        icon={<Icon boxSize={"20px"} as={BiPencil} color={"text.primary"} />}
      />
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
        modalTitle={"Edit Configurations"}
        modalMinH={"100%"}
        footer={true}
        modalMinW={"70%"}
        onClose={onClose}
      >
        <Form
          showErrorList={false}
          ref={formRef}
          formData={formData}
          schema={schema}
          validator={validator}
          onSubmit={() => editAlarmSettingCall(formRef.current.state.formData)}
          uiSchema={getAlarmSettingUiSchema(
            alarm.alarm_type.uneditable_fields,
            true
          )}
          widgets={getFormsWidgets()}
          templates={{ ObjectFieldTemplate }}
        />
      </FunctionalModalV2>
    </Center>
  );
}

export default EditAlarmSetting;
