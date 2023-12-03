import { Box, Flex, Text, Grid } from "@chakra-ui/layout";
import React, { useEffect, useState, useContext } from "react";
import { SEVERITY } from "../../../data/alarms";
import {
  getNotificationsSettings,
  editNotificationsSettings,
} from "../../../api/notifications";
import NotificationsForm from "./notifications-form/notifications-form";
import { showsuccess } from "../../../helpers/toast-emitter";
import { Divider, Stack } from "@chakra-ui/react";
import { ThemeContext } from "../../../context/theme";

function Notifications() {
  const defaultObj = {
    enabled: false,
    contact_details: {
      email: "",
      sms: "",
    },
    notification_type: [],
  };

  const [highData, setHighData] = useState(null);
  const [medData, setMedData] = useState();
  const [urgData, setUrgData] = useState(null);
  const theme = useContext(ThemeContext);
  const setFormData = (notifSetting) => {
    return {
      enabled: notifSetting.notification_settings.enabled,
      contact_details: {
        email: notifSetting.notification_settings.contact_details.email
          ? notifSetting.notification_settings.contact_details.email
          : "",
        sms: notifSetting.notification_settings.contact_details.sms
          ? notifSetting.notification_settings.contact_details.sms
          : "",
      },
      notification_type: notifSetting.notification_settings.notification_type,
    };
  };

  const removeUnneededkeys = (obj) => {
    Object.keys(obj).forEach((key) => {
      if (obj[key] === "") {
        delete obj[key];
      }
    });
    return obj;
  };

  const highEditCall = (body) => {
    editNotificationsSettings({
      alarms: [
        {
          severity: SEVERITY.URGENT,
          notification_settings: {
            ...urgData,
            contact_details: removeUnneededkeys(urgData.contact_details),
          },
        },
        {
          severity: SEVERITY.MEDIUM,
          notification_settings: {
            ...medData,
            contact_details: removeUnneededkeys(medData.contact_details),
          },
        },
        {
          severity: SEVERITY.HIGH,
          notification_settings: {
            ...body,
            contact_details: removeUnneededkeys(body.contact_details),
          },
        },
      ],
    }).then((res) => {
      showsuccess("Successfully updated notification settings");
    });
  };
  const medEditCall = (body) => {
    editNotificationsSettings({
      alarms: [
        {
          severity: SEVERITY.URGENT,
          notification_settings: {
            ...urgData,
            contact_details: removeUnneededkeys(urgData.contact_details),
          },
        },
        {
          severity: SEVERITY.HIGH,
          notification_settings: {
            ...highData,
            contact_details: removeUnneededkeys(highData.contact_details),
          },
        },
        {
          severity: SEVERITY.MEDIUM,
          notification_settings: {
            ...body,
            contact_details: removeUnneededkeys(body.contact_details),
          },
        },
      ],
    }).then((res) => {
      showsuccess("Successfully updated notification settings");
    });
  };
  const urgEditCall = (body) => {
    editNotificationsSettings({
      alarms: [
        {
          severity: SEVERITY.HIGH,
          notification_settings: {
            ...highData,
            contact_details: removeUnneededkeys(highData.contact_details),
          },
        },
        {
          severity: SEVERITY.MEDIUM,
          notification_settings: {
            ...medData,
            contact_details: removeUnneededkeys(medData.contact_details),
          },
        },
        {
          severity: SEVERITY.URGENT,
          notification_settings: {
            ...body,
            contact_details: removeUnneededkeys(body.contact_details),
          },
        },
      ],
    }).then((res) => {
      showsuccess("Successfully updated notification settings");
    });
  };

  useEffect(() => {
    getNotificationsSettings().then((res) => {
      const notificationsData = res.data.message.alarms;
      setHighData(defaultObj);
      setMedData(defaultObj);
      setUrgData(defaultObj);
      notificationsData.forEach((element) => {
        switch (element.severity) {
          case SEVERITY.HIGH:
            setHighData(setFormData(element));
            break;
          case SEVERITY.MEDIUM:
            setMedData(setFormData(element));
            break;
          case SEVERITY.URGENT:
            setUrgData(setFormData(element));
            break;
          default:
            break;
        }
      });
    });
  }, []);
  return (
    <Grid
      templateColumns={{
        base: "repeat(1, 1fr)",
        md: "repeat(2, 1fr)",
        lg: "repeat(2, 1fr)",
      }}
      gap={4}
    >
      <Box m={2} bg={"card.60"} borderRadius={"25px"} my={4}>
        <Box
          p={4}
          h={"50px"}
          as={Flex}
          justifyContent={"space-between"}
          bg={"card.60"}
          borderTopRadius={"25px"}
        >
          <Text color={"text.primary"} fontSize={"xl"}>
            Medium Severity
          </Text>
        </Box>
        <Stack
          direction="row"
          spacing={0}
          height="inherit"
          borderRadius={"25px"}
        >
          {/* Line on the left of the box that indicates severity */}
          <Divider
            orientation="vertical"
            borderWidth="10px"
            borderBottomLeftRadius={"25px"}
            borderColor="#fd8c00"
            height="inherit"
          />

          <Box>
            <Box p={5}>
              {medData && (
                <NotificationsForm
                  formData={medData}
                  title={"Medium Severity"}
                  disabled={false}
                  saveAction={medEditCall}
                  style={{ color: "white" }}
                />
              )}
            </Box>
          </Box>
        </Stack>
      </Box>
      <Box m={2} bg={"card.60"} borderRadius={"25px"} my={4}>
        <Box
          p={4}
          h={"50px"}
          as={Flex}
          justifyContent={"space-between"}
          bg={"card.60"}
          borderTopRadius={"25px"}
        >
          <Text color={"text.primary"} fontSize={"xl"}>
            High Severity
          </Text>
        </Box>
        <Stack direction="row" spacing={0} height="inherit">
          <Divider
            orientation="vertical"
            borderWidth="10px"
            borderBottomLeftRadius={"25px"}
            borderColor="#dc0000"
            height="inherit"
          />
          <Box>
            <Box p={5}>
              {highData && (
                <NotificationsForm
                  formData={highData}
                  title={"High Severity"}
                  disabled={false}
                  saveAction={highEditCall}
                />
              )}
            </Box>
          </Box>
        </Stack>
      </Box>
      <Box m={2} bg={"card.60"} borderRadius={"25px"} my={4}>
        <Box
          p={4}
          h={"50px"}
          as={Flex}
          justifyContent={"space-between"}
          bg={"card.60"}
          borderTopRadius={"25px"}
        >
          <Text color={"text.primary"} fontSize={"xl"}>
            Urgent Severity
          </Text>
        </Box>
        <Stack direction="row" spacing={0} height="inherit">
          <Divider
            orientation="vertical"
            borderWidth="10px"
            borderBottomLeftRadius={"25px"}
            borderColor="#780000"
            height="inherit"
          />
          <Box>
            <Box p={5}>
              {urgData && (
                <NotificationsForm
                  formData={urgData}
                  title={"Urgent Severity"}
                  disabled={false}
                  saveAction={urgEditCall}
                />
              )}
            </Box>
          </Box>
        </Stack>
      </Box>
    </Grid>
  );
}

export default Notifications;
