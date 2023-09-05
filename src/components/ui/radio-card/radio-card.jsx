import React from 'react';
import { useRadio, Box, Circle } from '@chakra-ui/react';

export function RadioCard (props) {
    const { getInputProps, getCheckboxProps } = useRadio(props);

    const input = getInputProps();
    const checkbox = getCheckboxProps();

    return (
        <Box as='label'>
            <input {...input} />
            <Circle
                size={'35px'}
                {...checkbox}
                cursor='pointer'
                borderWidth='1px'
                _checked={{
                    bg: 'action.100',
                    color: 'text.primary',
                    borderColor: 'action.100'
                }}
                _focus={{
                    boxShadow: 'outline'
                }}
                bg={'primary.100'}
                color={'text.primary'}
                fontSize={'sm'}
            >
                {props.children}
            </Circle>
        </Box>
    );
}
