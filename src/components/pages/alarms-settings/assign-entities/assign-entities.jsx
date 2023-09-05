import { Button, Text, Box } from '@chakra-ui/react';
import React, { useContext, useEffect, useState } from 'react';
import { DevicesContext } from '../../../../context/devices';
import { showsuccess } from '../../../../helpers/toast-emitter';
import FunctionalModal from '../../../ui/functional-modal/functional-modal';
import StyledSelect from '../../../ui/styled-select/styled-select';
import { DEVICES } from '../../../../types/devices';

function AssignEntities ({
    type,
    assignedEntities,
    multi = true,
    assignAction,
    mainId
}) {
    const devCtx = useContext(DevicesContext);
    const [entityValue, setEntityValue] = useState(assignedEntities.length !== 0 && typeof (assignedEntities) !== 'string' ? assignedEntities.map((et) => { return { value: et.id, label: et.name }; }) : []);
    const [allEntitties, setAllEntitties] = useState([]);
    const assignFn = () => {
        assignAction(mainId, entityValue.map((e) => e.value)).then((res) => showsuccess('Successfully assigned entity'));
    };

    const resetOptions = () => {
        setEntityValue(assignedEntities.length !== 0 && typeof (assignedEntities) !== 'string' ? assignedEntities.map((et) => { return { value: et.id, label: et.name }; }) : []);
    };

    useEffect(() => {
        if (devCtx.devicesObj) {
            const cytags = [];
            const cylocks = [];
            if (devCtx.devicesObj.devices.cytag) {
                cytags.push(...devCtx.devicesObj.devices.cytag);
            }
            if (devCtx.devicesObj.devices.cycollector) {
                cylocks.push(...devCtx.devicesObj.devices.cycollector);
            }
            if (type === DEVICES.CYTAG) {
                setAllEntitties([...cytags]);
            } else if (type === DEVICES.CYCOLLECTOR) {
                setAllEntitties([...cylocks]);
            } else {
                setAllEntitties([...cylocks, ...cytags]);
            }
        }
    }, [devCtx]);
    return (
        <FunctionalModal
            modalMinH={'600px'}
            footer
            modalTitle={'Assign ' + (type === 'alarm' ? 'Entities' : 'Devices')}
            btnTitle={'Assign Entities'}
            btnColor={'action.100'}
            reset={resetOptions}     
            btnAction={
                <Button bg={'primary.100'} color={'text.primary'} onClick={() => assignFn()}>
                    Add Entity
                </Button>
            }
        >
            <Text>{type !== 'alarm' ? 'Pick Devices' : 'Pick Entities'}</Text>
            <Box>
                <StyledSelect
                    value={entityValue}
                    onchange={setEntityValue}
                    multi={multi}
                     options={allEntitties
                        .map((en) => {
                            return { label: en.name, value: en.id };
                        })}
                />
            </Box>
        </FunctionalModal>
    );
}

export default AssignEntities;
