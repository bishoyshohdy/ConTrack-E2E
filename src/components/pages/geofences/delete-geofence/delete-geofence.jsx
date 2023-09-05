import { Button, Text } from '@chakra-ui/react';
import React from 'react';
import { showsuccess } from '../../../../helpers/toast-emitter';
import FunctionalModal from '../../../ui/functional-modal/functional-modal';

function DeleteGeofence ({ name, callBack, id, deleteAction }) {
    return (
        <FunctionalModal
            modalTitle={`Delete ${name}`}
            btnTitle={'Delete'}
            btnColor={'danger.100'}
            btnSize={'sm'}
            modalMinH={'200px'}
            modalMinW={'50%'}
            btnAction={<Button bg={'primary.100'} color={'text.primary'} onClick={() => {
                deleteAction(id).then((res) => {
                    showsuccess('Successfully deleted');
                    callBack(true);
                });
            }}>Delete {name}</Button>}
        >
            <Text>Are you sure you want to delete {name}?</Text>
        </FunctionalModal>
    );
}
export default DeleteGeofence;
