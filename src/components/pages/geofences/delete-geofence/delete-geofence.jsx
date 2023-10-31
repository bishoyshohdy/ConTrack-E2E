import { Button, Text, Tag, TagLabel } from '@chakra-ui/react';
import React, { useState } from 'react';
import { showsuccess } from '../../../../helpers/toast-emitter';
import FunctionalModal from '../../../ui/functional-modal/functional-modal';
import {
  DeleteIcon,
} from "@chakra-ui/icons";

function DeleteGeofence ({ name, callBack, id, deleteAction }) {

    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    

    return (
        <FunctionalModal
            modalTitle={`Delete ${name}`}
            btnTitle={'Delete'}
            iconBtn={DeleteIcon}
            btnColor={'danger.100'}
            btnSize={'sm'}
            modalMinH={'250px'}
            modalMinW={'25%'}
            btnAction={<Button bg={'danger.100'} color={'text.primary'} onClick={() => {
                deleteAction(id).then((res) => {
                    showsuccess('Successfully deleted');
                    setDeleteModalOpen(false);
                    callBack(true);
                });
            }}>Delete {name}</Button>}
            isOpen={isDeleteModalOpen}
            onOpen={() => setDeleteModalOpen(true)}
            onClose={() => setDeleteModalOpen(false)}
        >
            <Text>Are you sure you want to delete {name}?</Text>
            <Tag
                size="lg"
                colorScheme="danger"
                borderRadius="full"
                margin={5}
                >
                <TagLabel >
                    {name} : {id}
                </TagLabel>
                </Tag>
        </FunctionalModal>
    );
}
export default DeleteGeofence;
