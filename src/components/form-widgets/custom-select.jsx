import { Box, Text } from '@chakra-ui/react';
import React from 'react';
import StyledSelect from '../ui/styled-select/styled-select';

const CustomSelect = function (props) {
    if (props.options.enumOptions.length === 2 && props.options.enumOptions[0].value === '0' && props.options.enumOptions[1].value === '1') {
        props.options.enumOptions = props.options.enumOptions.map((option) => {
            return {
                ...option,
                label: option.value === '0' ? 'no' : 'yes'
            };
        });
    }
    if (props.options.enumOptions.length !== 0 && typeof (props.options.enumOptions[0].value) === 'object') {
        props.options.enumOptions = props.options.enumOptions.map((option) => {
            return option.value;
        });
    }
    return (
        <Box mb={6}>
            {props.label && <Text mb={2}>{props.label.replaceAll('_', ' ')}</Text>}
            <StyledSelect removeNoChoice={true} disabled={props.disabled} options={props.options.enumOptions} placeholder={"aa"} value={props.value} onchange={(e) => {
                props.onChange(e);
            }}
            />
        </Box>
    );
};

export default CustomSelect;
