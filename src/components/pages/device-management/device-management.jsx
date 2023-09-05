import React, { useContext, useEffect, useState } from 'react';
import {
    Tabs,
    Tab,
    TabList,
    TabPanel,
    TabPanels
} from '@chakra-ui/react';
import { DevicesContext } from '../../../context/devices';
import { DEVICES } from '../../../types/devices';
import { capatalizeName } from '../../../helpers/string-operations';
import DeviceTab from './device-tab/device-tab';
import { createCycollector, createCytag, deleteCycollector, deleteCytag } from '../../../api/device-actions';
import { showsuccess } from '../../../helpers/toast-emitter';
import CreateDevice from '../../ui/create-device/create-device';
import { UsersContext } from '../../../context/users';

function DeviceManagement () {
    const [types, setTypes] = useState([]);
    const [cycollectors, setCycollectors] = useState([]);
    const [cytags, setCytags] = useState([]);
    const [cypowers, setCypowers] = useState([]);
    const [users,SetUsers]=useState([]);
    const [roles,SetRoles]=useState([]);

    const devicesContext = useContext(DevicesContext);
    const userContext=useContext(UsersContext);

    useEffect(() => {
        setTypes(devicesContext.devicesObj.types);
        console.log('type id=',devicesContext.devicesObj.types);
        setCycollectors(
            devicesContext.devicesObj.devices.cycollector
                ? devicesContext.devicesObj.devices.cycollector
                : []
        );
        setCytags(
            devicesContext.devicesObj.devices.cytag
                ? devicesContext.devicesObj.devices.cytag
                : []
        );
        setCypowers(
            devicesContext.devicesObj.devices.cypower
                ? devicesContext.devicesObj.devices.cypower
                : []
        );
        
    }, [devicesContext]);


    useEffect(()=>{
        if(userContext.users){
        SetUsers(userContext.users);
        SetRoles(userContext.allRoles);
        }
    },[userContext])



    const getDeviceList = (type) => {
        switch (type) {
        case DEVICES.CYCOLLECTOR:
        case DEVICES.CYLOCK:
            return cycollectors;
        case DEVICES.CYTAG:
            return cytags;
        default:
            return cypowers;
        }
    };

    const getCreationMethod = (type) => {
        switch (type) {
        case DEVICES.CYCOLLECTOR:
        case DEVICES.CYLOCK:
            return createCycollector.then((res) => {
                showsuccess('Successfully created device');
                devicesContext.getDevicesCall();
            });

        case DEVICES.CYTAG:
            return createCytag.then((res) => {
                showsuccess('Successfully created device');
                devicesContext.getDevicesCall();
            });
        }
    };

    const getDeletionMethod = (type) => {
        switch (type) {
        case DEVICES.CYCOLLECTOR:
        case DEVICES.CYLOCK:
            return deleteCycollector.then((res) => {
                showsuccess('Successfully deleted device');
                devicesContext.getDevicesCall();
            });
        case DEVICES.CYTAG:
            return deleteCytag.then((res) => {
                showsuccess('Successfully deleted device');
                devicesContext.getDevicesCall();
            });
        }
    };

    return (
        <>
            <Tabs colorScheme='action' color={'text.primary'} isFitted variant="soft-rounded">
                <TabList borderRadius={'20px'} mb="1em" bg={'primary.80'}>
                    {types &&
                        types.map((type) => {
                            return <Tab key={type} color={'text.primary'}>{capatalizeName(type) + 's'}</Tab>;
                        })}
                </TabList>
                <TabPanels color={'text.primary'}>
                    {types &&
                        types.map((type) => {
                            return <TabPanel key={type}>
                                <DeviceTab deleteAction={() => { getDeletionMethod(type); devicesContext.getDevicesCall(); }} createAction={() => { getCreationMethod(type); devicesContext.getDevicesCall(); }} type={type} deviceList={getDeviceList(type)} CreateDevice={<CreateDevice DeviceType={type} users={users} roles={roles}></CreateDevice>}/>
                            </TabPanel>;
                        }) 
                    }
                </TabPanels>
            </Tabs>
        </>
    );
}

export default DeviceManagement;
