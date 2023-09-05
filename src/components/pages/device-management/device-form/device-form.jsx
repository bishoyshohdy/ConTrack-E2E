import { Box, Text, Input } from '@chakra-ui/react';
import React, { useEffect } from 'react';

function DeviceForm ({ id, name, setId, setName, idLabel, initialId, initialName }) {
    useEffect(() => {
        setId(initialId);
        setName(initialName);
    }, []);
    return (
        <>
            <Box>
                <Text>{idLabel}</Text>
                <Input type={'text'} defaultValue={initialId} value={id} onChange={(e) => setId(e.target.value)} />
            </Box>
            <Box>
                <Text>Name</Text>
                <Input type={'text'} defaultValue={initialName} value={name} onChange={(e) => setName(e.target.value)} />
            </Box>
        </>
    );
}

export default DeviceForm;
