import { Box, Flex, Heading, Text, Button } from '@chakra-ui/react';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { UsersContext } from '../../../../context/users';
import AvatarCard from '../../../ui/avatar-card/avatar-card';
import FunctionalModal from '../../../ui/functional-modal/functional-modal';
import StyledSelect from '../../../ui/styled-select/styled-select';
import { assignRoles, editUserDeviceRoles } from '../../../../api/user-management';
import { showsuccess } from '../../../../helpers/toast-emitter';
import { EditIcon } from '@chakra-ui/icons';
import { hasPermission } from '../../../../helpers/permissions-helper';
import { PERMISSIONS } from '../../../../types/devices';
import { useDragControls } from 'framer-motion';


function UserPage () {
    const { id } = useParams();
    const deviceCtx = useContext(UsersContext);
    const [user, setUser] = useState();
    const [device, setDevice] = useState();
    const [role, setRole] = useState([]);
    const [userDevices,setUserDevices] = useState([])
    const [currentUserDevices , setCurrentUserDevices] = useState([])
    const [name, setName] = useState('');
    const [userRoles, setUserRoles] = useState([]);
    const usersCtx = useContext(UsersContext);

    const editDeviceRole = (deviceId, roles) => {
        editUserDeviceRoles(user.id, deviceId, roles.map((role) => parseInt(role.value))).then((res) => {
            showsuccess('Successfully updated device role');
            setDevice(null);
            setRole([]);
            deviceCtx.getDevicesCall();
            deviceCtx.getUsersCall();
        });
    };

    const editUser = () => {
        assignRoles(user.id, userRoles.map((role) => parseInt(role.value)),  userDevices.map((device) =>device.value)).then((res) => {
            showsuccess('Successfully updated user roles');
            deviceCtx.getUsersCall();
        });
    };

    const setChosenOptions = () => {
        setUserRoles(user ? user.roles.map((role) => { return { value: role.id + '', label: role.name }; }) : []);
        setUserDevices(user ? user.devices.map((device) => { 
            return { value: device.id + '', label: device.name }; }) : []);
    };

    useEffect(() => {
        setChosenOptions();
        setName(user ? user.name : '');
    }, [user]);

    useEffect(() => {
        setUser(deviceCtx ? deviceCtx.getOneUser(id) : null);
        setCurrentUserDevices(user ? usersCtx.devices : [])
    }, [id, deviceCtx]);

    useEffect(() => {
        if(useContext)
        {
            setCurrentUserDevices(usersCtx.devices)
        }  
    }, [usersCtx]);

    return (
        <>
            <Box>
                {user &&
                    <>
                        <AvatarCard title={user.user_name} subtitle={user.name} list1={user.roles} list2={user.devices} clickable={false}>
                            <Box as={Flex} justifyContent={'end'} w={'10%'}>
                                {hasPermission(PERMISSIONS.EDIT_USERS) &&
                                (
                                    <FunctionalModal
                                    modalMinH={'600px'}
                                    modalTitle={'Edit ' + user.name}
                                    btnColor={'action.100'}
                                    btnTitle={'Edit ' + user.name}
                                    btnSize={'md'}
                                    iconBtn={EditIcon}
                                    btnAction={<Button color={'text.primary'} bg={'primary.100'} onClick={editUser}>Edit User</Button>}
                                    reset={setChosenOptions}
                                
                                >
                                    <Box as={Flex} flexWrap={'wrap'} gap={5}>
                                        <Box w={'100%'} gap={5} as={Flex} alignItems={'center'}>
                                            <Text w={'30%'}>Name </Text>
                                            <Text maxW={'70%'}>{name}</Text>
                                        </Box>
                                        <Box w={'100%'} gap={5} as={Flex} alignItems={'center'}>
                                            <Text w={'35%'}>Roles</Text>
                                            <Box w={'100%'}>
                                            <StyledSelect multi value={userRoles} onchange={setUserRoles} options={deviceCtx.allRoles.map((role) => { return { label: role.name, value: role.id + '' }; })} size={'md'} />
                                            </Box>  
                                        </Box>
                                        <Box w={'100%'} gap={5} as={Flex} alignItems={'center'}>
                                <Text w={'35%'}>Devices</Text>
                                <Box w={'100%'}>
                            <StyledSelect multi value={userDevices} onchange={setUserDevices} options={currentUserDevices.map((device) => { return { label: device.name, value: device.id }; })} size={'md'} />
                            </Box>
                            </Box>
                                    </Box>
                                </FunctionalModal>
                                )}

                            </Box>
                        </AvatarCard>
                        {/* <Box flexWrap={'wrap'} as={Flex} gap={2} w={'100%'}>
                            <Box pt={5} gap={5} as={Flex} justifyContent={'space-between'} w={'100%'}>
                                <Heading p={1} color={'text.primary'} fontSize={'2xl'}>Device Roles</Heading>
                                {hasPermission(PERMISSIONS.CREATE_DEVICE_ROLE) &&
                                (
                                    <FunctionalModal
                                    modalMinH={'600px'}
                                    modalTitle={'Create New Device Role'}
                                    btnColor={'action.100'}
                                    btnTitle={'Create New Device Role'}
                                    btnSize={'md'}
                                    btnAction={<Button color={'text.primary'} bg={'primary.100'} onClick={() => editDeviceRole(device, role)}>Create device role</Button>}
                                >
                                    <Box as={Flex} gap={4} flexWrap={'wrap'} w={'100%'}>
                                        <Box w={'100%'} gap={5} as={Flex} alignItems={'center'}>
                                            <Text w={'40%'}>Pick a Device</Text>
                                            <StyledSelect size={'md'} multi={false} value={device} onchange={setDevice} options={deviceCtx.devices.filter((dev) => user.devices.find((d) => d.id === dev.id) === undefined).map((dev) => { return { value: dev.id + '', label: dev.name }; })} />
                                        </Box>
                                        <Box w={'100%'} gap={5} as={Flex} alignItems={'center'}>
                                            <Text w={'40%'}>Pick a Role</Text>
                                            <StyledSelect size={'md'} multi={true} value={role} onchange={setRole} options={deviceCtx.deviceRoles.map((role) => { return { value: role.id + '', label: role.name }; })} />
                                        </Box>
                                    </Box>
                                </FunctionalModal>
                                )}

                            </Box>
                            {user.devices.map((dev) => {
                                return <AvatarCard key={dev.id} editRole={editDeviceRole} initroleChoice={dev.roles.map((role) => { return { value: role.id + '', label: role.name }; })} initdeviceChoice={dev.id} device={dev.device_type} title={dev.name} subtitle={dev.id} list1={dev.roles} clickable={true} list2={[]} />;
                            })}
                        </Box> */}
                    </>
                }
            </Box>
        </>
    );
}

export default UserPage;
