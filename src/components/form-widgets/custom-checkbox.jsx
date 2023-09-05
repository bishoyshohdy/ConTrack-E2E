import { Box, Checkbox } from '@chakra-ui/react';
import React from 'react';

const CustomCheckbox = function (props) {
    return (
        <Box mb={6}>
            <Checkbox color={'text.primary'} onChange={(e) => props.onChange(e.target.checked)} isDisabled={props.disabled} isReadOnly={props.isReadOnly} isChecked={props.value} value={props.value}>{props.label.replaceAll('_', ' ')}</Checkbox>
        </Box>
    );
};

export default CustomCheckbox;
