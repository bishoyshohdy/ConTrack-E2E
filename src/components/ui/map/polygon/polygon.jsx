import { Box, Text } from '@chakra-ui/react';
import { InfoWindowF, PolygonF } from '@react-google-maps/api';
import React, { useState } from 'react';

function Polygon ({ name, editMode, oldpath, editAction, center }) {
    // Store Polygon path in state
    const [path, setPath] = useState(oldpath);
    // Define refs for Polygon instance and listeners
    const polygonRef = React.useRef(null);
    const listenersRef = React.useRef([]);

    // Call setPath with new edited path
    const onEdit = React.useCallback(() => {
        if (polygonRef.current) {
            const nextPath = polygonRef.current
                .getPath()
                .getArray()
                .map(latLng => {
                    return { lat: latLng.lat(), lng: latLng.lng() };
                });
            setPath(nextPath);
            editAction(nextPath);
        }
    }, [setPath]);

    // Bind refs to current Polygon and listeners
    const onLoad = React.useCallback(
        polygon => {
            polygonRef.current = polygon;
            const path = polygon.getPath();
            listenersRef.current.push(
                path.addListener('set_at', onEdit),
                path.addListener('insert_at', onEdit),
                path.addListener('remove_at', onEdit)
            );
        },
        [onEdit]
    );

    // Clean up refs
    const onUnmount = React.useCallback(() => {
        listenersRef.current.forEach(lis => lis.remove());
        polygonRef.current = null;
    }, []);
    const [showBox, toggleShowBox] = useState(false);
    return (
        <>
            <PolygonF
                editable={editMode}
                draggable={editMode}
                path={path}
                onClick={() => toggleShowBox(!showBox)}
                // Event used when manipulating and adding points
                onMouseUp={onEdit}
                // Event used when dragging the whole Polygon
                onDragEnd={onEdit}
                onLoad={onLoad}
                onUnmount={onUnmount}
            />
            { showBox &&
                <InfoWindowF
                    position={center}
                >
                    <Box>
                        <Text color={'blue.50'}>{name}</Text>
                    </Box>
                </InfoWindowF>
            }
        </>
    );
}

export default Polygon;
