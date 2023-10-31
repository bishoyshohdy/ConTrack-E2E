import { Box, Button } from '@chakra-ui/react';
import React, { useState } from 'react';
import { editGeofence } from '../../../../api/geofences';
import { showsuccess } from '../../../../helpers/toast-emitter';
import FunctionalModal from '../../../ui/functional-modal/functional-modal';
import Map from '../../../ui/map/map';
import { AiFillEdit } from "react-icons/ai";


function EditGeofence ({ geofences, geofence }) {
    const [polygon, setPolygon] = useState(geofence.polygon);

    const editGeoFenceAction = () => {
        editGeofence(geofence.id, polygon.map((point) => [point.lat, point.lng])).then((res) => {
            showsuccess('Successfully updated geofence');
            geofence.callBack(true);
        });
    };

    const [isEditModalOpen, setEditModalOpen] = useState(false);

    return (
        <FunctionalModal
            modalTitle={`Edit ${geofence.name}`}
            btnTitle={'Edit'}
            iconBtn={AiFillEdit}
            btnSize={'sm'}
            iconSize={'20px'}
            modalMinH={'700px'}
            modalMinW={'80%'}
            btnAction={<Button onClick={
                () => {
                    editGeoFenceAction();
                    setEditModalOpen(false);
                }
            } bg={'primary.100'} color={'text.primary'}>Edit {geofence.name}</Button>}
            btnColor={'action.100'}
            isOpen={isEditModalOpen}
            onOpen={() => setEditModalOpen(true)}
            onClose={() => setEditModalOpen(false)}
        >
            <Box w={'100%'} h={'600px'} bg={'primary.80'} borderRadius={'5px'}>
                <Map oldCenter={geofence.center} zoom={16} trips={false} geofences={[geofence]}
                />
            </Box>
        </FunctionalModal>
    );
}

export default EditGeofence;
