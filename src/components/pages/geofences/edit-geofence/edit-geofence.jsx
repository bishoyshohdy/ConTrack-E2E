import { Box, Button } from '@chakra-ui/react';
import React, { useState } from 'react';
import { editGeofence } from '../../../../api/geofences';
import { showsuccess } from '../../../../helpers/toast-emitter';
import FunctionalModal from '../../../ui/functional-modal/functional-modal';
import Map from '../../../ui/map/map';

function EditGeofence ({ geofences, geofence }) {
    const [polygon, setPolygon] = useState(geofence.polygon);

    const editGeoFenceAction = () => {
        editGeofence(geofence.id, polygon.map((point) => [point.lat, point.lng])).then((res) => {
            showsuccess('Successfully updated geofence');
            geofence.callBack(true);
        });
    };

    return (
        <FunctionalModal
            modalTitle={`Edit ${geofence.name}`}
            btnTitle={'Edit'}
            btnSize={'sm'}
            iconSize={'20px'}
            modalMinH={'700px'}
            modalMinW={'80%'}
            btnAction={<Button onClick={editGeoFenceAction} bg={'primary.100'} color={'text.primary'}>Edit {geofence.name}</Button>}
            btnColor={'action.100'}
        >
            <Box w={'100%'} h={'600px'} bg={'primary.80'} borderRadius={'5px'}>
                <Map oldCenter={geofence.center} zoom={16} trips={false} geofences={geofences.map((geo) => {
                    if (geo.id === geofence.id) {
                        return { ...geo, editMode: true, edit: setPolygon };
                    }
                    return geo;
                })}
                />
            </Box>
        </FunctionalModal>
    );
}

export default EditGeofence;
