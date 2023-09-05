import React, { useState } from 'react';
import { MarkerF, InfoWindowF } from '@react-google-maps/api';

import { Box, Text } from '@chakra-ui/react';

function ComplexMarker ({ key, marker }) {
    const [showBox, toggleShowBox] = useState(false);
    return (
        <>
            <MarkerF
                key={key}
                name={marker.name}
                position={{ lat: parseFloat(marker.position.lat), lng: parseFloat(marker.position.lng) }}
                label={marker.name}
                onClick={() => toggleShowBox(!showBox)}
            />
            { showBox && <InfoWindowF position={{ lat: parseFloat(marker.position.lat), lng: parseFloat(marker.position.lng) }}>
                <Box>
                    <Text color={'blue.50'}>{marker.msg ? marker.msg : marker.name}</Text>
                </Box>
            </InfoWindowF>
            }
        </>
    );
}

export default ComplexMarker;
