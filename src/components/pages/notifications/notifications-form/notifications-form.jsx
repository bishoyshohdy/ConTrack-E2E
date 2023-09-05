import { Box, Button, Checkbox, Flex, Input, Text } from '@chakra-ui/react';
import React, { useState } from 'react';

function NotificationsForm ({ formData, disabled, saveAction }) {
    const [enabled, setEnabled] = useState(formData.enabled);
    const [email, setEmail] = useState(formData.contact_details.email);
    const [sms, setSms] = useState(formData.contact_details.sms);
    const [choices, setChoices] = useState(formData.notification_type);

    const addElementToArray = (array, element) => {
        array.splice(array.findIndex((el) => el === element), 1);
        return array;
    };

    const modifyChoice = (choice, checked) => {
        if (!checked) {
            setChoices(addElementToArray(choices, choice));
        } else {
            setChoices([...choices, choice]);
        }
    };

    const saveChanges = () => {
        saveAction({
            enabled,
            contact_details: {
                email,
                sms
            },
            notification_type: choices
        });
    };
    return (
        <>
            <Box mt={6} as={Flex} flexWrap={'wrap'} gap={6} color={'text.primary'}>
                <Checkbox size={'lg'} w={'100%'} isDisabled={disabled} defaultChecked={formData.enabled} value={enabled} onChange={(e) => setEnabled(e.target.checked)}>Enabled</Checkbox>
                <Text w={'100%'} fontSize={'xl'}>Contact Details</Text>
                <Box w={'100%'} alignItems={'center'} as={Flex} flexWrap={'wrap'} gap={2} m={2}>
                    <Text w={'25%'}>Email</Text>
                    <Input w={'70%'} bg={'primary.100'} borderColor={'text.primary'} variant={'outline'} isDisabled={disabled} type={'email'} value={email} onChange={(e) => setEmail(e.target.value)} />
                    <Text w={'25%'}>Phone Number</Text>
                    <Input w={'70%'} bg={'primary.100'} borderColor={'text.primary'} variant={'outline'} isDisabled={disabled} type={'tel'} value={sms} onChange={(e) => setSms(e.target.value)} />
                </Box>
                <Text w={'100%'} fontSize={'xl'}>Notification Type</Text>
                <Box w={'100%'} m={2} as={Flex} justifyContent={'space-between'}>
                    <Checkbox size={'lg'} isDisabled={disabled} defaultChecked={!!formData.notification_type.find((choice) => choice === 'sms')} value={!!choices.find((choice) => choice === 'sms')} onChange={(e) => modifyChoice('sms', e.target.checked)}>SMS</Checkbox>
                    <Checkbox size={'lg'} isDisabled={disabled} defaultChecked={!!formData.notification_type.find((choice) => choice === 'email')} value={!!choices.find((choice) => choice === 'email')} onChange={(e) => modifyChoice('email', e.target.checked)}>Email</Checkbox>
                    <Checkbox size={'lg'} isDisabled={disabled} defaultChecked={!!formData.notification_type.find((choice) => choice === 'app')} value={!!choices.find((choice) => choice === 'app')} onChange={(e) => modifyChoice('app', e.target.checked)}>App</Checkbox>
                </Box>
                <Box w={'100%'} as={Flex} justifyContent={'end'}>
                    <Button isDisabled={disabled} bg={'action.100'} onClick={saveChanges}>Save Changes</Button>
                </Box>
            </Box>
        </>
    );
}

export default NotificationsForm;
