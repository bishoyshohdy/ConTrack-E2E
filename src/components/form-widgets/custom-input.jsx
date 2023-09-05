import { Box, Input, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Text } from '@chakra-ui/react';
import React from 'react';

const CustomNumberInput = function (props) {
    console.log(props);
    return (
        <Box>
            <Text color={'text.primary'} mb={2}>{props.label.replaceAll('_', ' ')}</Text>
            {props.schema.type === 'number'
                ? <>
                    <NumberInput min={props.schema.minimum} max={props.schema.maximum} isReadOnly={props.readonly} isRequired={props.required} isDisabled={props.disabled} variant={'outline'} borderRadius={'10px'} borderColor={'transparent'} bg={'primary.100'} allowMouseWheel value={props.value} onChange={(e) => props.onChange(e)}>
                        <NumberInputField />
                        <NumberInputStepper>
                            <NumberIncrementStepper borderRadius={'10px'} borderColor={'transparent'} color={'action.100'} />
                            <NumberDecrementStepper borderRadius={'10px'} borderColor={'transparent'} color={'action.100'} />
                        </NumberInputStepper>
                    </NumberInput>
                </>
                : <>
                    <Input isReadOnly={props.readonly} isRequired={props.required} isDisabled={props.disabled} variant={'outline'} borderRadius={'10px'} borderColor={'transparent'} bg={'primary.100'} value={props.value} onChange={(e) => props.onChange(e.target.value)} />
                </>
            }
        </Box>
    );
};

export default CustomNumberInput;
