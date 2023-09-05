import React, { useState, useEffect, useContext } from 'react';
import {
    GoogleMap,
    PolylineF,
    DrawingManagerF
} from '@react-google-maps/api';
import {
    Box,
    ButtonGroup,
    IconButton,
    Input,
    Flex,
    Text,
    HStack,
    useRadioGroup,
    SkeletonText
} from '@chakra-ui/react';
import { RadioCard } from '../radio-card/radio-card';
import ComplexMarker from './marker/complex-marker';
import { path1, path2 } from './paths-test';
import { BsFillPlayFill, BsFillPauseFill } from 'react-icons/bs';
import { MdReplay } from 'react-icons/md';
import StyledSelect from '../styled-select/styled-select';
import Polygon from './polygon/polygon';
import { DevicesContext } from '../../../context/devices';

function Map ({ minH = '500px', draw = false, oldCenter, zoom = 3, trips, markers = [], geofences = [], drawingComplete }) {
    const deviceCtx = useContext(DevicesContext);
    const trip1 = { value: 1, label: 'Trip 1', path: path1 };
    const trip2 = { value: 2, label: 'Trip 2', path: path2 };
    const tripChoices = [trip1, trip2];
    const [tripChoice, setTripChoice] = useState(trip1);
    const [speed, setSpeed] = useState('500');
    const speedChoices = ['500', '300', '200'];
    const speedChoicesLabels = ['1x', '1.5x', '2x'];
    const { getRootProps, getRadioProps } = useRadioGroup({
        name: 'Speed',
        defaultValue: speed,
        onChange: (spd) => {
            setSpeed(spd);
            stopTrip();
        }
    });
    const group = getRootProps();
    const containerStyle = {
        width: '100%',
        height: '80%',
        minHeight: minH
    };
    const [center, setCenter] = useState(path1[parseInt(path1.length - 1)]);
    useEffect(() => {
        if (!trips && deviceCtx && deviceCtx.location) {
            setCenter(deviceCtx.location);
        }
    }, [deviceCtx]);
    const options = {
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35,
        clickable: false,
        draggable: false,
        editable: false,
        visible: true,
        radius: 30000,
        zIndex: 1
    };
    const [mainMarker, setMainMarker] = useState({
        position: path1[0],
        name: 'our device'
    });
    let [counter, setCounter] = useState(0);
    const [pause, setPause] = useState(true);

    const [timeOutId, setId] = useState();

    function callBack () {
        if (counter < tripChoice.path.length) {
            setMainMarker({
                position: tripChoice.path[counter],
                name: 'our device'
            });
            setCounter(counter++);
        } else {
            clearAll();
        }
    }

    function travelPath (speed) {
        setId(window.setInterval(callBack, speed));
    }

    const clearAll = () => {
        setPause(false);
        setCounter(0);
        stopTrip();
        setMainMarker({
            position: tripChoice.path[0],
            name: 'our device'
        });
    };

    const playTrip = (speed) => {
        setPause(false);
        travelPath(speed);
    };

    const stopTrip = () => {
        setPause(true);
        window.clearInterval(timeOutId);
    };

    useEffect(() => {
        setCounter(0);
        setMainMarker({
            position: tripChoice.path[0],
            name: tripChoice.name
        });
    }, [tripChoice]);
    if (!deviceCtx | !deviceCtx.isLoaded) {
        return <SkeletonText />;
    }

    return (
        <>
            {trips && (
                <Box as={Flex} justifyContent={'space-between'} gap={4} m={2}>
                    <Input
                        color={'text.primary'}
                        borderRadius={'20px'}
                        borderWidth={0}
                        bg={'primary.100'}
                        placeholder="Select date and time"
                        size="sm"
                        w={'100%'}
                        type="datetime-local"
                        variant={'outline'}
                        onChange={(e) => console.log(e.target.value)}
                    />
                    <Box w={'100%'}>
                        <StyledSelect
                            options={tripChoices}
                            size="sm"
                            borderRadius={'20px'}
                            value={tripChoice.id}
                            onchange={(e) => {
                                setTripChoice(e === '1' ? trip1 : trip2);
                            }}
                        />
                    </Box>
                </Box>
            )}
            {deviceCtx && deviceCtx.isLoaded && <GoogleMap mapContainerStyle={containerStyle} center={oldCenter || center} zoom={trips ? 16 : zoom}>
                {draw && <DrawingManagerF
                    drawingMode={'polygon'}
                    onPolygonComplete={(e) => drawingComplete(e)}
                    options={
                        {
                            polygonOptions: {
                                editable: true,
                                draggable: true,
                                clickable: true
                            }
                        }
                    }
                />
                }
                {trips &&
                    (<><PolylineF
                        path={tripChoice ? tripChoice.path : []}
                        options={options}
                    />
                    <ComplexMarker marker={mainMarker} /></>)
                }
                {markers.map((marker, index) => {
                    return (
                        <>
                            <ComplexMarker key={index} marker={marker} />
                        </>
                    );
                })}
                {geofences.map((geofence) => {
                    return <Polygon
                        key={geofence.id}
                        center={geofence.center}
                        name={geofence.name}
                        oldpath={geofence.polygon}
                        editMode={geofence.editMode}
                        editAction={geofence.edit}
                    />;
                })}
            </GoogleMap>
            }
            {trips && (
                <Box m={3} as={Flex} flexWrap={'wrap'} justifyContent={'space-between'} alignItems={'baseline'}>
                    <ButtonGroup m={2}>
                        <IconButton
                            aria-label="start trip"
                            bg="action.100"
                            rounded="full"
                            size={'sm'}
                            onClick={clearAll}
                            icon={<MdReplay />}
                            isDisabled={!pause}
                        />
                        <IconButton
                            aria-label="start trip"
                            bg="action.100"
                            rounded="full"
                            size={'sm'}
                            onClick={() => playTrip(speed)}
                            icon={<BsFillPlayFill />}
                            isDisabled={!pause}
                        />
                        <IconButton
                            aria-label="pause trip"
                            bg="action.100"
                            rounded="full"
                            size={'sm'}
                            onClick={stopTrip}
                            icon={<BsFillPauseFill />}
                            isDisabled={pause}
                        />
                    </ButtonGroup>
                    <HStack m={2} {...group}>
                        {speedChoices.map((value, index) => {
                            const radio = getRadioProps({ value });
                            return (
                                <RadioCard key={value} value={value} {...radio}>
                                    {speedChoicesLabels[index]}
                                </RadioCard>
                            );
                        })}
                    </HStack>
                    <Box ml={6} p={5} borderRadius={'20px'} bg={'primary.100'}>
                        <Text color={'text.primary'}>{mainMarker.name}</Text>
                    </Box>
                </Box>
            )}
        </>
    );
}

export default Map;
