import React, { useContext, useEffect, useState } from 'react';
import {
    Flex,
    Button,
    Text,
    Input,
    Box,
    InputGroup,
    InputRightElement,
    IconButton,
    Center
} from '@chakra-ui/react';
import FunctionalModal from '../../../ui/functional-modal/functional-modal';
import StyledSelect from '../../../ui/styled-select/styled-select';
import {
    getDeviceConfigurations,
    getWifiUsername,
    getDeviceModes,
    getFirmwareLastUpdate,
    getPreDeviceConfigurations,
    getDeviceAlarmInterval
} from '../../../../api/configurations';
import { formatDate } from '../../../../helpers/array-map';
import { AttachmentIcon, CloseIcon } from '@chakra-ui/icons';
import { getDeviceGeofences } from '../../../../api/geofences';
import { DevicesContext } from '../../../../context/devices';

const deviceModes = {
    '5 Minute Reporting Rate': 0,
    '30 Minute Reporting Rate': 1,
    '1 Hour Reporting Rate': 2,
    '1 Day Reporting': 3
};

const deviceMainModes = {
    'Demo Mode': 1,
    'SATCOM Demo Mode': 2,
    'Normal Mode': 3,
    'Power Saving Mode': 4,
    'Ultra-Power Saving Mode': 5
};

const alarmIntervalMode = {
    'Alarm Interval 1 Min': 1,

    'Alarm Interval 5 Min': 2,

    'Alarm Interval 15 Min': 3,

    'Alarm Interval 1 Hour': 4,

    'Alarm Interval 6 Hours': 5,

    'Alarm Interval 24 Hours': 6
};
function DeviceFunction ({
    keyToDisplay,
    lastUpdateTime,
    lastReqTime,
    previousValue,
    value,
    setFunction,
    options
}) {
    console.log('OPT', options);
    console.log('VAL', value);
    const ops = [];
    Object.keys(options).forEach((optKey) =>
        ops.push({ label: optKey, value: options[optKey] })
    );
    return (
        <>
            <Text>{keyToDisplay}</Text>
            <StyledSelect options={ops} value={value} onchange={setFunction} />
            <Text mt={2} w={'100%'} fontSize={'12px'} m={2}>
                Requested {keyToDisplay}:{' '}
                {value && ops.find((opp) => opp.value === parseInt(value))
                    ? ops.find((opp) => opp.value === parseInt(value)).label
                    : value || value}
            </Text>
            <Text w={'100%'} fontSize={'12px'} m={2}>
                Last Requested At : {formatDate(lastReqTime)}
            </Text>
            {previousValue !== undefined && previousValue !== null
                ? (
                    <>
                        <Text w={'100%'} fontSize={'12px'} m={2}>
            Current Configuration: {previousValue}
                        </Text>
                        <Text w={'100%'} fontSize={'12px'} m={2}>
            Last Update At : {formatDate(lastUpdateTime)}
                        </Text>
                    </>
                )
                : null}
        </>
    );
}

function DeviceFunctions ({
    imei,
    changeMode,
    changeThres,
    changeWifi,
    setConfig,
    updateFirmware,
    updateDeviceGeofence,
    updateDeviceGeofenceList,
    removeDeviceGeofence,
    createTrip,
    route,
    setRoute,
    routes,
    setTripDate,
    tripDate,
    editDeviceAlarmInterval
}) {
    const [update, setUpdate] = useState(true);

    // const [modesOptions, setDeviceModes] = useState([]);
    const [gpsIntervals, setGpsIntervals] = useState([]);
    // const [gpsTimeoutIntervals, setGpsTimeoutIntervals] = useState([]);
    const [scanIntervals, setScanIntervals] = useState([]);
    // const [scanTimeoutIntervals, setTimeoutIntervals] = useState([]);

    const [thresholdEnabled, setThresholdEnabled] = useState();

    const [mode, setMode] = useState();
    const [deviceMode, setDeviceMode] = useState();
    const [gpsInterval, setGpsInterval] = useState();
    const [cytagScan, setCytagScan] = useState();
    const [previouswifiName, setpreviousWifiName] = useState();
    const [wifiName, setWifiName] = useState();
    const [wifiPassword, setWifiPassword] = useState();
    const [maxT, setMaxT] = useState();
    const [minT, setMinT] = useState();
    const [maxLight, setMaxLight] = useState();
    const [minLight, setMinLight] = useState();
    const [minH, setMinH] = useState();
    const [maxH, setMaxH] = useState();

    const hiddenFileInput = React.useRef(null);
    const [file, setFile] = useState();
    const [version, setVersion] = useState();
    const handleFileChange = (e) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };
    const [previousMode, setPreviousMode] = useState();
    const [modeUpdatedTime, setModeUpdateTime] = useState();
    const [modeRequestedTime, setModeRequestedTime] = useState();

    const [mainModeUpdatedTime, setMainModeUpdatedTime] = useState();
    const [mainModeRequesedTime, setMainModeRequesedTime] = useState();
    const [previousMainMode, setPreviousMainMode] = useState();

    const [previousGPSInterval, setPreviousGPSInterval] = useState();
    const [gpsIntervalUpdatedTime, setGPSIntervalUpdatedTime] = useState();
    const [gpsIntervalRequestedTime, setGPSIntervalRequestedTime] = useState();

    const [previousScanInterval, setPreviousScanInterval] = useState();
    const [scanIntervalUpdatedTime, setScanIntervalUpdatedTime] = useState();
    const [scanIntervalRequestedTime, setScanIntervalRequestedTime] = useState();

    const [updateRequestUpdatedTime, setupdateRequestUpdateTime] = useState();
    const [updateRequestRequestedTime, setupdateRequestRequestedTime] = useState();
    const [previousUpdateRequest, setPreviousUpdateRequest] = useState();
    const [updateRequest, setUpdateRequest] = useState();
    // ALARM INTERVAL

    const [previousAlarmInterval, setPreviousAlarmInterval] = useState();
    const [AlarmIntervalUpdatedTime, setAlarmIntervalUpdatedTime] = useState();
    const [updateAlarmRequestUpdatedTime, setupdateAlarmRequestUpdateTime] =
    useState();
    const [previousAlarmUpdateRequest, setAlarmPreviousUpdateRequest] =
    useState();
    //
    const [keysToDisplay, setKeysToDisplay] = useState('');
    const [alarmInterval, setAlarmInterval] = useState();

    useEffect(() => {
        getFirmwareLastUpdate(imei).then((res) => {
            console.log({ resssssssssssssss: res.data });
            setupdateRequestUpdateTime(res.data.update_request_updated_time);
            setupdateRequestRequestedTime(res.data.requested_at);
            setPreviousUpdateRequest(res.data.previous_update_request);
            setUpdateRequest(res.data.update_request);
        });
        getDeviceModes(imei).then((res) => {
            setModeUpdateTime(res.data.Mode_updated_time);
            setModeRequestedTime(res.data.Mode_requested_at);
            setGPSIntervalUpdatedTime(res.data.GPS_Interval_updated_time);
            setGPSIntervalRequestedTime(res.data.GPS_Interval_requested_at);
            setScanIntervalUpdatedTime(res.data.Scan_Interval_updated_time);
            setScanIntervalRequestedTime(res.data.Scan_Interval_requested_at);
            setPreviousMode(res.data.previous_Mode);
            setPreviousGPSInterval(res.data.previous_GPS_Interval);
            setPreviousScanInterval(res.data.previous_Scan_Interval);
        });
        getPreDeviceConfigurations(imei).then((res) => {
            console.log({ 'peter\'s modes : ': res.data });
            // if (deviceMainModes[res.data.conf]) {
            //     setMode(deviceMainModes[res.data.conf]);
            // } else {
            //     setMode('-1');
            // }
            setMainModeUpdatedTime(res.data.conf_updated_time);
            setMode(res.data.conf);
            setMainModeRequesedTime(res.data.requested_at);
            setPreviousMainMode(res.data.previous_conf);
        });
        getDeviceConfigurations(imei).then((res) => {
            const previous = res.data.current_configurations;
            setCytagScan(previous.scan_interval);
            setGpsInterval(previous.gps_interval);
            setMaxH(previous.Max_Humidity_Threshold);
            setMinH(previous.Min_Humidity_Threshold);
            setMaxT(previous.Max_Temperature_Threshold);
            setMinT(previous.Min_Temperature_Threshold);
            setMaxLight(previous.Max_Light_Threshold);
            setMinLight(previous.Min_Light_Threshold);
            setThresholdEnabled(previous.thresholds_enabled);

            setKeysToDisplay(res.data.key_to_display);

            const configurations = res.data.cycollector_configurations_all;
            // setDeviceModes(configurations.mode);
            setGpsIntervals(configurations.gps_interval);
            // setGpsTimeoutIntervals(configurations.gps_scan_timeout);
            setScanIntervals(configurations.scan_interval);
            // setTimeoutIntervals(configurations.scan_timeout);
        });

        getDeviceAlarmInterval(imei).then((res) => {
            console.log('RESPPP', res);
            setPreviousAlarmInterval(res.data.alarm_interval);
            setAlarmIntervalUpdatedTime(res.data.alarm_interval_updated_time);
            setupdateAlarmRequestUpdateTime(res.data.alarm_interval_requested_at);
            setAlarmPreviousUpdateRequest(res.data.previous_alarm_interval);
            setAlarmInterval(alarmIntervalMode[res.data.alarm_interval]);
            setDeviceMode(deviceModes[res.data.Mode] || res.data.Mode);
        }).then(() =>
            console.log(
                'ALARM INT',
                previousAlarmInterval,
                AlarmIntervalUpdatedTime,
                updateAlarmRequestUpdatedTime,
                previousAlarmUpdateRequest
            )
        );
        getWifiUsername(imei).then((res) => {
            setWifiName(res.data.wifi_username);
            setpreviousWifiName(res.data.wifi_username);
        });
        getDeviceGeofences(imei).then((res) => {
            setDeviceGeofences(res.data.device_geofences);
        });
        setUpdate(false);
    }, [update]);

    const callback = () => setUpdate(true);

    const devicesContext = useContext(DevicesContext);

    const [deviceGeofences, setDeviceGeofences] = useState([]);
    const [geofenceChoice, setGeofenceChoice] = useState();
    const [geofenceType, setGeofenceType] = useState();
    const [geofenceStatus, setGeofenceStatus] = useState();

    const [geofences, setGeofences] = useState([]);
    useEffect(() => {
        setGeofences(devicesContext.geofences ? devicesContext.geofences : []);
        setUpdate(false);
    }, [update, devicesContext]);

    return (
        <Box alignItems={'center'} w={'100%'} as={Flex} flexWrap={'wrap'} gap={2}>
            <FunctionalModal
                btnMinH={'50px'}
                btnColor={'card.100'}
                btnTitle={'Manage Device Configurations'}
                transparent={true}
                modalMinH={'fit-content'}
                footer={false}
                btnMinW={'300px'}
            >
                <Center>
                    <Flex
                        h={'100%'}
                        gap={5}
                        flexWrap={'wrap'}
                        justifyContent={'center'}
                        p={4}
                    >
                        <Box as={Center} w={'100%'}>
                            <FunctionalModal
                                modalTitle={'Set Mode'}
                                btnMinH={'50px'}
                                btnColor={'card.100'}
                                btnTitle={'Set Mode'}
                                modalMinH={'500px'}
                                btnMinW={'200px'}
                                btnAction={
                                    <Button
                                        bg={'primary.100'}
                                        color={'text.primary'}
                                        onClick={() => changeMode({ mode, callback })}
                                    >
                    Set Mode
                                    </Button>
                                }
                            >
                                <DeviceFunction
                                    keyToDisplay={keysToDisplay.mode}
                                    value={mode}
                                    setFunction={setMode}
                                    previousValue={previousMainMode}
                                    lastUpdateTime={mainModeUpdatedTime}
                                    lastReqTime={mainModeRequesedTime}
                                    options={deviceMainModes}
                                />
                            </FunctionalModal>
                        </Box>
                        <Box as={Center} w={'100%'}>
                            <FunctionalModal
                                modalTitle={'Set Threshold'}
                                btnMinH={'50px'}
                                btnColor={'card.100'}
                                btnTitle={'Set Threshold'}
                                modalMinH={'500px'}
                                btnMinW={'200px'}
                                btnAction={
                                    <Button
                                        bg={'primary.100'}
                                        color={'text.primary'}
                                        onClick={() =>
                                            changeThres({
                                                maxT,
                                                maxH,
                                                minLight,
                                                minH,
                                                maxLight,
                                                minT,
                                                callback
                                            })
                                        }
                                    >
                    Set Thresholds
                                    </Button>
                                }
                            >
                                <Box gap={2} as={Flex} flexWrap={'wrap'}>
                                    <Box w={'48%'}>
                                        <Text>Minimum Temperature</Text>
                                        <Input
                                            variant="filled"
                                            borderRadius={'10px'}
                                            bg={'primary.100'}
                                            value={minT}
                                            onChange={(e) => setMinT(e.target.value)}
                                            type={'number'}
                                        />
                                    </Box>
                                    <Box w={'48%'}>
                                        <Text>Maximum Temperature</Text>
                                        <Input
                                            variant="filled"
                                            borderRadius={'10px'}
                                            bg={'primary.100'}
                                            value={maxT}
                                            onChange={(e) => setMaxT(e.target.value)}
                                            type={'number'}
                                        />
                                    </Box>
                                    <Box w={'48%'}>
                                        <Text>Minimum Light Intensity</Text>
                                        <Input
                                            variant="filled"
                                            borderRadius={'10px'}
                                            bg={'primary.100'}
                                            value={minLight}
                                            onChange={(e) => setMinLight(e.target.value)}
                                            type={'number'}
                                        />
                                    </Box>
                                    <Box w={'48%'}>
                                        <Text>Maximum Light Intensity</Text>
                                        <Input
                                            variant="filled"
                                            borderRadius={'10px'}
                                            bg={'primary.100'}
                                            value={maxLight}
                                            onChange={(e) => setMaxLight(e.target.value)}
                                            type={'number'}
                                        />
                                    </Box>
                                    <Box w={'48%'}>
                                        <Text>Minimum Humidity</Text>
                                        <Input
                                            variant="filled"
                                            borderRadius={'10px'}
                                            bg={'primary.100'}
                                            value={minH}
                                            onChange={(e) => setMinH(e.target.value)}
                                            type={'number'}
                                        />
                                    </Box>
                                    <Box w={'48%'}>
                                        <Text>Maximum Humidity</Text>
                                        <Input
                                            variant="filled"
                                            borderRadius={'10px'}
                                            bg={'primary.100'}
                                            value={maxH}
                                            onChange={(e) => setMaxH(e.target.value)}
                                            type={'number'}
                                        />
                                    </Box>
                                </Box>
                                <Text mt={2} w={'100%'} fontSize={'12px'} m={2}>
                  Thresholds mode status:{' '}
                                    {thresholdEnabled ? 'enabled' : 'disabled'}
                                </Text>
                                {/* <Text w={"100%"} fontSize={"12px"} m={2}>
                                On device thresholds: enabled
                            </Text> */}
                                {/* <Text w={'100%'} fontSize={'12px'} m={2}>
                                Last Update At : 2023-02-05 09:22:32
                                </Text> */}
                            </FunctionalModal>
                        </Box>
                        <Box as={Center} w={'100%'}>
                            <FunctionalModal
                                modalTitle={'Set Wifi Credentials'}
                                btnMinH={'50px'}
                                btnColor={'card.100'}
                                btnTitle={'Set Wifi Credentials'}
                                modalMinH={'500px'}
                                btnMinW={'200px'}
                                btnAction={
                                    <Button
                                        bg={'primary.100'}
                                        color={'text.primary'}
                                        onClick={() =>
                                            changeWifi({ wifiName, wifiPassword, callback })
                                        }
                                    >
                    Update Credentials
                                    </Button>
                                }
                            >
                                <Box gap={2} as={Flex} flexWrap={'wrap'}>
                                    <Box w={'48%'}>
                                        <Text>Wifi name</Text>
                                        <Input
                                            maxLength={32}
                                            variant="filled"
                                            borderRadius={'10px'}
                                            bg={'primary.100'}
                                            value={wifiName}
                                            onChange={(e) => setWifiName(e.target.value)}
                                            type={'text'}
                                        />
                                    </Box>
                                    <Box w={'48%'}>
                                        <Text>Wifi password</Text>
                                        <Input
                                            maxLength={32}
                                            variant="filled"
                                            borderRadius={'10px'}
                                            bg={'primary.100'}
                                            value={wifiPassword}
                                            onChange={(e) => setWifiPassword(e.target.value)}
                                            type={'password'}
                                        />
                                    </Box>
                                </Box>
                                <Text w={'100%'} fontSize={'12px'} m={2}>
                  Last Wifi Name: {previouswifiName}
                                </Text>
                            </FunctionalModal>
                        </Box>
                        <Box as={Center} w={'100%'}>
                            <FunctionalModal
                                modalTitle={'Set Configurations'}
                                btnMinH={'50px'}
                                btnColor={'card.100'}
                                btnTitle={'Set Configurations'}
                                modalMinH={'100%'}
                                btnMinW={'200px'}
                                btnAction={
                                    <Button
                                        bg={'primary.100'}
                                        color={'text.primary'}
                                        onClick={() =>
                                            setConfig({
                                                deviceMode,
                                                gpsInterval,
                                                cytagScan,
                                                callback
                                            })
                                        }
                                    >
                    Set Mode
                                    </Button>
                                }
                            >
                                <DeviceFunction
                                    keyToDisplay={keysToDisplay.mode}
                                    value={deviceMode}
                                    setFunction={setDeviceMode}
                                    options={deviceModes}
                                    previousValue={previousMode}
                                    lastUpdateTime={modeUpdatedTime}
                                    lastReqTime={modeRequestedTime}
                                />
                                <DeviceFunction
                                    keyToDisplay={keysToDisplay.gps_interval}
                                    value={gpsInterval}
                                    setFunction={setGpsInterval}
                                    options={gpsIntervals}
                                    previousValue={previousGPSInterval}
                                    lastUpdateTime={gpsIntervalUpdatedTime}
                                    lastReqTime={gpsIntervalRequestedTime}
                                />
                                <DeviceFunction
                                    keyToDisplay={keysToDisplay.scan_interval}
                                    value={cytagScan}
                                    setFunction={setCytagScan}
                                    options={scanIntervals}
                                    previousValue={previousScanInterval}
                                    lastUpdateTime={scanIntervalUpdatedTime}
                                    lastReqTime={scanIntervalRequestedTime}
                                />
                            </FunctionalModal>
                        </Box>
                        <Box as={Center} w={'100%'}>
                            <FunctionalModal
                                modalTitle={'Remote Update'}
                                btnMinH={'50px'}
                                btnColor={'card.100'}
                                btnTitle={'Firmware Update'}
                                modalMinH={'500px'}
                                btnMinW={'200px'}
                                btnAction={
                                    <Button
                                        bg={'primary.100'}
                                        color={'text.primary'}
                                        onClick={() => updateFirmware({ file, version, callback })}
                                    >
                    Send Update
                                    </Button>
                                }
                            >
                                <Box pb={2} as={Flex} w={'100%'}>
                                    <Text w={'15%'} m={2}>
                    Version
                                    </Text>
                                    <Input
                                        w={'100%'}
                                        variant="filled"
                                        borderRadius={'10px'}
                                        bg={'primary.100'}
                                        value={version}
                                        onChange={(e) => setVersion(e.target.value)}
                                        type={'text'}
                                    />
                                </Box>
                                <Input
                                    ref={hiddenFileInput}
                                    type="file"
                                    onChange={handleFileChange}
                                    display={'none'}
                                />
                                <InputGroup m={2} size="lg" w={'100%'}>
                                    <Input
                                        mt={2}
                                        type={'text'}
                                        color={'text.primary'}
                                        pr={'20%'}
                                        variant={'unstyled'}
                                        isDisabled={true}
                                        placeholder="Upload a file"
                                        value={file ? file.name : ''}
                                    />
                                    <InputRightElement width={'20%'} gap={1}>
                                        <IconButton
                                            title="remove file"
                                            bg={'primary.100'}
                                            icon={<CloseIcon color={'danger.100'} />}
                                            rounded={'full'}
                                            size={'sm'}
                                            onClick={() => setFile(null)}
                                        />
                                        <IconButton
                                            title="upload file"
                                            bg={'primary.100'}
                                            icon={<AttachmentIcon color={'action.100'} />}
                                            rounded={'full'}
                                            size={'sm'}
                                            onClick={() => hiddenFileInput.current.click()}
                                        />
                                    </InputRightElement>
                                </InputGroup>
                                <Text w={'100%'} fontSize={'12px'} m={2}>
                  Last Requested Update: {updateRequest}
                                </Text>
                                <Text w={'100%'} fontSize={'12px'} m={2}>
                  Requested At : {formatDate(updateRequestRequestedTime)}
                                </Text>
                                <Text w={'100%'} fontSize={'12px'} m={2}>
                  Current Update: {previousUpdateRequest}
                                </Text>
                                <Text w={'100%'} fontSize={'12px'} m={2}>
                  Last Update At : {formatDate(updateRequestUpdatedTime)}
                                </Text>
                            </FunctionalModal>
                        </Box>
                        {/* ALARM INTERVAL */}
                        <Box as={Center} w={'100%'}>
                            <FunctionalModal
                                modalTitle={'Set Alarm Interval'}
                                btnMinH={'50px'}
                                btnColor={'card.100'}
                                btnTitle={'Set Alarm Interval'}
                                modalMinH={'500px'}
                                btnMinW={'200px'}
                                btnAction={
                                    <Button
                                        bg={'primary.100'}
                                        color={'text.primary'}
                                        onClick={() =>
                                            editDeviceAlarmInterval({ alarmInterval, callback })
                                        }
                                    >
                    Set Alarm Interval
                                    </Button>
                                }
                            >
                                <DeviceFunction
                                    keyToDisplay={'Alarm Interval'}
                                    value={alarmInterval}
                                    setFunction={setAlarmInterval}
                                    previousValue={previousAlarmUpdateRequest}
                                    lastUpdateTime={AlarmIntervalUpdatedTime}
                                    lastReqTime={updateAlarmRequestUpdatedTime}
                                    options={alarmIntervalMode}
                                />
                            </FunctionalModal>
                        </Box>
                    </Flex>
                </Center>
            </FunctionalModal>
            <FunctionalModal
                btnMinW={'300px'}
                btnMinH={'50px'}
                btnColor={'card.100'}
                btnTitle={'Manage Spatial Configurations'}
                transparent={true}
                modalMinH={'fit-content'}
                footer={false}
            >
                <Center>
                    <Flex
                        h={'100%'}
                        gap={5}
                        flexWrap={'wrap'}
                        justifyContent={'center'}
                        p={4}
                    >
                        <Box as={Center} w={'100%'}>
                            <FunctionalModal
                                modalTitle={'Add Geofences'}
                                btnMinH={'50px'}
                                btnColor={'card.100'}
                                btnTitle={'Add Geofences'}
                                modalMinH={'500px'}
                                btnMinW={'200px'}
                                btnAction={
                                    <Button
                                        bg={'primary.100'}
                                        color={'text.primary'}
                                        onClick={() =>
                                            updateDeviceGeofenceList(geofenceChoice, geofenceType)
                                        }
                                    >
                    Add Geofence
                                    </Button>
                                }
                            >
                                <Text>Select Geofence</Text>
                                <StyledSelect
                                    options={geofences.map((geo) => {
                                        return { label: geo.name, value: geo.id };
                                    })}
                                    value={geofenceChoice}
                                    onchange={setGeofenceChoice}
                                />
                                <Text>Select Type</Text>
                                <StyledSelect
                                    options={[
                                        { value: 'ASSERT_IN', label: 'Alert when device is outside geofence' },
                                        { value: 'ASSERT_OUT', label: 'Alert when device is inside geofence' }
                                    ]}
                                    value={geofenceType}
                                    onchange={setGeofenceType}
                                />
                            </FunctionalModal>
                        </Box>
                        <Box as={Center} w={'100%'}>
                            <FunctionalModal
                                modalTitle={'Activate/Deactivate Geofences'}
                                btnMinH={'50px'}
                                btnColor={'card.100'}
                                btnTitle={'Activate/Deactivate Geofences'}
                                modalMinH={'500px'}
                                btnMinW={'200px'}
                                btnAction={
                                    <Button
                                        bg={'primary.100'}
                                        color={'text.primary'}
                                        onClick={() =>
                                            updateDeviceGeofence(geofenceChoice, geofenceStatus)
                                        }
                                    >
                    Activate/Deactivate Geofence
                                    </Button>
                                }
                            >
                                <Text>Select Geofence</Text>
                                <StyledSelect
                                    options={deviceGeofences.map((geo) => {
                                        return { label: geo.geofence.name, value: geo.geofence.id };
                                    })}
                                    value={geofenceChoice}
                                    onchange={setGeofenceChoice}
                                />
                                <Text>Select Status</Text>
                                <StyledSelect
                                    options={[
                                        { value: false, label: 'Inactive' },
                                        { value: true, label: 'Active' }
                                    ]}
                                    value={geofenceStatus}
                                    onchange={setGeofenceStatus}
                                />
                            </FunctionalModal>
                        </Box>
                        <Box as={Center} w={'100%'}>
                            <FunctionalModal
                                modalTitle={'Remove Geofences'}
                                btnMinH={'50px'}
                                btnColor={'card.100'}
                                btnTitle={'Remove Geofences'}
                                modalMinH={'500px'}
                                btnMinW={'200px'}
                                btnAction={
                                    <Button
                                        bg={'primary.100'}
                                        color={'text.primary'}
                                        onClick={() => removeDeviceGeofence(geofenceChoice)}
                                    >
                    Remove Geofence
                                    </Button>
                                }
                            >
                                <Text>Select Geofence</Text>
                                <StyledSelect
                                    options={deviceGeofences.map((geo) => {
                                        return { label: geo.geofence.name, value: geo.geofence.id };
                                    })}
                                    value={geofenceChoice}
                                    onchange={setGeofenceChoice}
                                />
                            </FunctionalModal>
                        </Box>
                        <Box as={Center} w={'100%'}>
                            <FunctionalModal
                                btnMinH={'50px'}
                                btnColor={'card.100'}
                                btnTitle={'Add trip'}
                                modalTitle={'Add trip'}
                                transparent={false}
                                btnAction={
                                    <Button
                                        onClick={createTrip}
                                        bg={'action.100'}
                                        color={'text.primary'}
                                    >
                    Create trip
                                    </Button>
                                }
                            >
                                <Box as={Flex} flexWrap={'wrap'} gap={4}>
                                    <Box w={'100%'} mb={1}>
                                        <Text>Routes</Text>
                                        <StyledSelect
                                            value={route}
                                            onchange={setRoute}
                                            options={routes.map((route) => {
                                                return { label: route.name, value: route.id };
                                            })}
                                        />
                                    </Box>
                                    <Box w={'100%'} mb={1}>
                                        <Text>Start Date</Text>
                                        <Input
                                            color={'text.primary'}
                                            bg={'primary.100'}
                                            borderRadius={'10px'}
                                            borderWidth={0}
                                            placeholder="Select start date and time"
                                            size="md"
                                            w={'100%'}
                                            variant={'outline'}
                                            type="datetime-local"
                                            onChange={(e) => setTripDate(e.target.value)}
                                            min={tripDate}
                                        />
                                    </Box>
                                </Box>
                            </FunctionalModal>
                        </Box>
                    </Flex>
                </Center>
            </FunctionalModal>
        </Box>
    );
}

export default DeviceFunctions;
