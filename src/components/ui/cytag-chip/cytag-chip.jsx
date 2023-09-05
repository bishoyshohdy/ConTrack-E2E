import React, { useContext, useEffect, useState } from 'react';
import { DevicesContext } from '../../../context/devices';
import { HStack, Tag, TagLabel, Button, Text } from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import FunctionalModal from '../functional-modal/functional-modal';
import CytagAssign from '../cytag-assign/cytag-assign';
import { showsuccess } from '../../../helpers/toast-emitter';

function CytagChip ({ cycollectorId, assignAction, unAssignAction }) {
    const [cytags, setCytags] = useState([]);
    const deviceCtx = useContext(DevicesContext);
    useEffect(() => {
        setCytags(deviceCtx.getAssignedCytags(cycollectorId));
    }, [deviceCtx, cycollectorId]);

    return (
        <>
            <HStack minW={'max-content'} spacing={4}>
                    <CytagAssign
                        assignAction={assignAction}
                        cycollectorId={cycollectorId}
                    />
                    {cytags.map(
                        (cytag) =>
                            cytag && (
                                <Tag
                                    size={'md'}
                                    key={cytag.id}
                                    borderRadius="full"
                                    variant="solid"
                                    bg="chart.80"
                                    gap={1}
                                    minW={'fit-content'}
                                >
                                    <TagLabel>{cytag.name}</TagLabel>
                                    <FunctionalModal
                                        btnSize={'xs'}
                                        iconBtn={CloseIcon}
                                        btnColor={'transparent'}
                                        modalTitle={'Unassign Cytag'}
                                        modalMinH={'500px'}
                                        btnAction={
                                            <Button
                                                bg={'danger.100'}
                                                color={'text.primary'}
                                                onClick={() => {
                                                    unAssignAction(cytag.id, cycollectorId).then(
                                                        (res) => {
                                                            showsuccess('Successfully unassigned cytag');
                                                            deviceCtx.getDevicesCall();
                                                        }
                                                    );
                                                }}
                                            >
                                                Unassign cytag
                                            </Button>
                                        }
                                    >
                                        <Text>Are you sure you want to Unassign this cytag?</Text>
                                        <Tag size="lg" colorScheme="danger" borderRadius="full">
                                            <TagLabel>
                                                {cytag.name} : {cytag.id}
                                            </TagLabel>
                                        </Tag>
                                    </FunctionalModal>
                                </Tag>
                            )
                    )}
            </HStack>
        </>
    );
}

export default CytagChip;
