import React from 'react';
// import FunctionalModal from '../../../ui/functional-modal/functional-modal';
import ComplexTable from '../../../ui/table/complex-table';
// import { Button, Box, Flex } from '@chakra-ui/react';
import { capatalizeName } from '../../../../helpers/string-operations';
// import DeviceForm from '../device-form/device-form';
import { getDeviceIdentifier } from '../../../../data/device-form';

function DeviceTab ({ type, deviceList, createAction, deleteAction,CreateDevice }) {
    // const [id, setId] = useState('');
    // const [name, setName] = useState('');

    return (
        <>
            <ComplexTable
                hiddenCols={['pccw_iccid', 'satcom_iccid', 'lat', 'lng', 'lock_status', 'Battery']}
                title={capatalizeName(type) + 's'}
                data={deviceList}
                //deleteBtn={deleteAction}
                // setId={setId}
                // setName={setName}
                idLabel={getDeviceIdentifier(type)}
                type={type}
                CreateDevice={CreateDevice}
            >
                {/* <Box mb={2} as={Flex} justifyContent={'end'}>
                    <FunctionalModal
                        modalTitle={`Add ${type}`}
                        btnTitle={`Add ${type}`}
                        btnColor={'action.100'}
                        btnMinH={'50px'}
                        modalMinH={'500px'}
                        btnAction={<Button bg={'primary.100'} color={'text.primary'} onClick={() => createAction({ id, name })}>Create {type}</Button>}
                    >
                        <DeviceForm name={name} id={id} setId={setId} setName={setName} idLabel={getDeviceIdentifier(type)} />
                    </FunctionalModal>
                </Box> */}
            </ComplexTable>
        </>
    );
}

export default DeviceTab;
