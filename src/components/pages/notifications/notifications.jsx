import { Box, Flex, Text } from '@chakra-ui/layout';
import React, { useEffect, useState } from 'react';
import { SEVERITY } from '../../../data/alarms';
import {
    getNotificationsSettings,
    editNotificationsSettings
} from '../../../api/notifications';
import NotificationsForm from './notifications-form/notifications-form';
import { showsuccess } from '../../../helpers/toast-emitter';

function Notifications () {
    const defaultObj = {
        enabled: false,
        contact_details: {
            email: '',
            sms: ''
        },
        notification_type: []
    };

    const [highData, setHighData] = useState(null);
    const [medData, setMedData] = useState();
    const [urgData, setUrgData] = useState(null);
    const setFormData = (notifSetting) => {
        return {
            enabled: notifSetting.notification_settings.enabled,
            contact_details: {
                email: notifSetting.notification_settings.contact_details.email
                    ? notifSetting.notification_settings.contact_details.email
                    : '',
                sms: notifSetting.notification_settings.contact_details.sms
                    ? notifSetting.notification_settings.contact_details.sms
                    : ''
            },
            notification_type: notifSetting.notification_settings.notification_type
        };
    };

    const removeUnneededkeys = (obj) => {
        Object.keys(obj).forEach((key) => {
            if (obj[key] === '') {
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
                        contact_details: removeUnneededkeys(urgData.contact_details)
                    }
                },
                {
                    severity: SEVERITY.MEDIUM,
                    notification_settings: {
                        ...medData,
                        contact_details: removeUnneededkeys(medData.contact_details)
                    }
                },
                {
                    severity: SEVERITY.HIGH,
                    notification_settings: {
                        ...body,
                        contact_details: removeUnneededkeys(body.contact_details)
                    }
                }
            ]
        }).then((res) => {
            showsuccess('Successfully updated notification settings');
        });
    };
    const medEditCall = (body) => {
        editNotificationsSettings({
            alarms: [
                {
                    severity: SEVERITY.URGENT,
                    notification_settings: {
                        ...urgData,
                        contact_details: removeUnneededkeys(urgData.contact_details)
                    }
                },
                {
                    severity: SEVERITY.HIGH,
                    notification_settings: {
                        ...highData,
                        contact_details: removeUnneededkeys(highData.contact_details)
                    }
                },
                {
                    severity: SEVERITY.MEDIUM,
                    notification_settings: {
                        ...body,
                        contact_details: removeUnneededkeys(body.contact_details)
                    }
                }
            ]
        }).then((res) => {
            showsuccess('Successfully updated notification settings');
        });
    };
    const urgEditCall = (body) => {
        editNotificationsSettings({
            alarms: [
                {
                    severity: SEVERITY.HIGH,
                    notification_settings: {
                        ...highData,
                        contact_details: removeUnneededkeys(highData.contact_details)
                    }
                },
                {
                    severity: SEVERITY.MEDIUM,
                    notification_settings: {
                        ...medData,
                        contact_details: removeUnneededkeys(medData.contact_details)
                    }
                },
                {
                    severity: SEVERITY.URGENT,
                    notification_settings: {
                        ...body,
                        contact_details: removeUnneededkeys(body.contact_details)
                    }
                }
            ]
        }).then((res) => {
            showsuccess('Successfully updated notification settings');
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
        <>
            <Box m={2} bg={'primary.100'} borderRadius={'5px'}>
                <Box p={2} h={'50px'} as={Flex} justifyContent={'space-between'} bg={'card.100'} borderTopRadius={'5px'}>
                    <Text color={'text.primary'} fontSize={'xl'}>High Severity</Text>
                </Box>
                <Box p={5}>

                    {highData && (
                        <NotificationsForm
                            formData={highData}
                            title={'High Severity'}
                            disabled={false}
                            saveAction={highEditCall}
                        />
                    )}
                </Box>
            </Box>
            <Box m={2} bg={'primary.100'} borderRadius={'5px'}>
                <Box p={2} h={'50px'} as={Flex} justifyContent={'space-between'} bg={'card.100'} borderTopRadius={'5px'}>
                    <Text color={'text.primary'} fontSize={'xl'}>Medium Severity</Text>
                </Box>
                <Box p={5}>

                    {medData && (
                        <NotificationsForm
                            formData={medData}
                            title={'Medium Severity'}
                            disabled={false}
                            saveAction={medEditCall}
                        />
                    )}
                </Box>
            </Box>
            <Box m={2} bg={'primary.100'} borderRadius={'5px'}>
                <Box p={2} h={'50px'} as={Flex} justifyContent={'space-between'} bg={'card.100'} borderTopRadius={'5px'}>
                    <Text color={'text.primary'} fontSize={'xl'}>Urgent Severity</Text>
                </Box>
                <Box p={5}>

                    {urgData && (
                        <NotificationsForm
                            formData={urgData}
                            title={'Urgent Severity'}
                            disabled={false}
                            saveAction={urgEditCall}
                        />
                    )}
                </Box>
            </Box>
        </>
    );
}

export default Notifications;
