import { Button, Text } from '@chakra-ui/react';
import React, { useContext, useState, useEffect } from 'react';

import { BsPlusCircle } from 'react-icons/bs';
import { DevicesContext } from '../../../context/devices';
import { showsuccess } from '../../../helpers/toast-emitter';
import FunctionalModal from '../functional-modal/functional-modal';
import StyledSelect from '../styled-select/styled-select';
import { hasPermission } from '../../../helpers/permissions-helper';
import { PERMISSIONS } from '../../../types/devices';

function CytagAssign ({ cycollectorId, assignAction }) {
    const deviceCtx = useContext(DevicesContext);
    const [cytags, setCytags] = useState([]);
    const [cytag, setCytag] = useState('');
    useEffect(() => {
        if (deviceCtx.devicesObj) {
            const allCytags = deviceCtx.devicesObj.devices.cytag;
            setCytags(allCytags
                ? allCytags
                    .filter((tag) => tag.cycollector_id !== cycollectorId)
                    .map((tag) => {
                        return { value: tag.id, label: tag.name };
                    })
                : []);
        }
    }, [deviceCtx]);
    return (
        <> {hasPermission(PERMISSIONS.ASSIGN_TAGS) && (
            <FunctionalModal
                modalTitle={'Assign Cytags'}
                iconBtn={BsPlusCircle}
                btnColor={'chart.80'}
                btnMinH={'20px'}
                modalMinH={'500px'}
                btnAction={
                    <Button
                        color={'text.primary'}
                        bg={'primary.100'}
                        onClick={() => {
                            assignAction(cytag, cycollectorId).then((res) => {
                                showsuccess('Successfully assigned device');
                                deviceCtx.getDevicesCall();
                            });
                        }
                        }
                    >
                        Assign Tag
                    </Button>
                }
            >
                <Text>Select a cytag</Text>
                <StyledSelect
                    size={'md'}
                    value={cytag}
                    onchange={setCytag}
                    options={cytags}
                />
            </FunctionalModal>
        )}

        </>
    );
}

export default CytagAssign;
