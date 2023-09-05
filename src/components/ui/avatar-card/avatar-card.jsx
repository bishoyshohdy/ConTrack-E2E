import React, { useContext, useState } from 'react';
import { Avatar, Box, Flex, Heading, HStack, Tag, TagLabel, Text, Button, Image } from '@chakra-ui/react';
import useScreenSize from '../../../hooks/screen-size';
import { SCREEN_SIZE } from '../../../types/screen';
import { useNavigate } from 'react-router-dom';
import { getDeviceImg } from '../../../data/device-form';
import FunctionalModal from '../functional-modal/functional-modal';
import { EditIcon } from '@chakra-ui/icons';
import { UsersContext } from '../../../context/users';
import StyledSelect from '../styled-select/styled-select';
import './avatar-card.css';
import { hasPermission } from '../../../helpers/permissions-helper';
import { PERMISSIONS } from '../../../types/devices';

function AvatarCard ({ title, subtitle, list1, list2, clickable, navigation, device, initroleChoice, initdeviceChoice, editRole, children }) {
    const size = useScreenSize();
    const deviceCtx = useContext(UsersContext);
    const devicesLength = list2.length - 4;
    const rolesLength = list1.length - 4;
    const devices = list2.length > 4 && clickable ? [...list2].splice(4, list2.length) : [...list2];
    const roles = list1.length > 4 && clickable ? [...list1].splice(4, list1.length) : [...list1];

    const [deviceChoice] = useState(initdeviceChoice);
    const [roleChoice, setRoleChoice] = useState(initroleChoice);

    const navigate = useNavigate();
    const redirectToDevice = () => {
        return navigate(title);
    };
    return (
        <Box
            onClick={navigation ? redirectToDevice : null}
            flexWrap={size === SCREEN_SIZE.LG ? 'nowrap' : 'wrap'}
            w={'100%'}
            cursor={clickable && navigation ? 'pointer' : 'unset'}
            _hover={{ backgroundColor: clickable ? 'card.100' : 'primary.80' }}
            as={Flex}
            alignItems={'center'}
            p={!clickable ? 5 : 3}
            gap={10}
            borderRadius={!clickable ? '0px' : '10px'}
            color={'text.primary'}
            bg={'primary.80'}
        >
            {device
                ? <Image src={getDeviceImg(device)} boxSize='100px' p={2} borderRadius={'20px'} />
                : <Avatar size={'xl'} borderRadius={'20px'} />
            }
            <Box minW={'20%'}>
                <Heading fontSize={'2xl'} mb={5}>
                    {title}
                </Heading>
                {subtitle}
            </Box>
            <HStack w={'40%'} flexWrap={'wrap'} spacing={0} gap={0.5}>
                {roles.map((role) => (
                    <Tag
                        size={'md'}
                        key={role.id}
                        borderRadius={'20px'}
                        variant="solid"
                        bg={'danger.100'}
                    >
                        <TagLabel>{role.name}</TagLabel>
                    </Tag>
                ))}
                {rolesLength > 0 && clickable && (
                    <Tag
                        size={'md'}
                        key={1}
                        borderRadius={'20px'}
                        variant="solid"
                        bg={'danger.100'}
                    >
                        <TagLabel>+{rolesLength}</TagLabel>
                    </Tag>
                )}
            </HStack>
            {
                !device
                    ? <HStack w={'40%'} flexWrap={'wrap'} spacing={0} gap={0.5}>
                        {devices.map((device) => (
                            <Tag
                                size={'md'}
                                key={device.id}
                                borderRadius={'20px'}
                                variant="solid"
                                bg={'action.100'}
                            >
                                <Avatar
                                    src={getDeviceImg(device.device_type)}
                                    size="xs"
                                    name={device.name}
                                    ml={-1}
                                    mr={1}
                                    mb={1}
                                    mt={1}
                                    bg={'primary.100'}
                                    p={1}
                                />
                                <TagLabel>{device.name}</TagLabel>
                            </Tag>
                        ))}
                        {devicesLength > 0 && clickable && (
                            <Tag
                                size={'md'}
                                key={1}
                                borderRadius={'20px'}
                                variant="solid"
                                bg={'action.100'}
                            >
                                <TagLabel>+{devicesLength}</TagLabel>
                            </Tag>
                        )}
                    </HStack>
                    : 
                    <Box as={Flex} justifyContent={'end'} w={'40%'}>
                        {hasPermission(PERMISSIONS.EDIT_DEVICE_ROLE) &&
                        (
                            <FunctionalModal
                            modalMinH={'600px'}
                            modalTitle={'Edit Device Role'}
                            btnColor={'action.100'}
                            btnTitle={'Edit Device Role'}
                            btnSize={'md'}
                            iconBtn={EditIcon}
                            btnAction={<Button color={'text.primary'} bg={'primary.100'} onClick={() => editRole(deviceChoice, roleChoice)}>Edit device role</Button>}
                        >
                            <Box as={Flex} gap={4} flexWrap={'wrap'} w={'100%'}>
                                <Box w={'100%'} gap={5} as={Flex} alignItems={'center'}>
                                    <Text w={'40%'}>Device</Text>
                                    <Text size={'md'}>{title}</Text>
                                </Box>
                                <Box w={'100%'} gap={5} as={Flex} alignItems={'center'}>
                                    <Text w={'40%'}>Pick a Role</Text>
                                    <StyledSelect size={'md'} multi={true} value={roleChoice} onchange={setRoleChoice} options={deviceCtx.deviceRoles.map((role) => { return { value: role.id + '', label: role.name }; })} />
                                </Box>
                            </Box>
                        </FunctionalModal>
                        )}

                    </Box>
            }
            {children}
        </Box>
    );
}

export default AvatarCard;
