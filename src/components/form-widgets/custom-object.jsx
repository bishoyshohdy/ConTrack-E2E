import { Box, Text } from '@chakra-ui/react';
import React from 'react';

function ObjectFieldTemplate (props) {
    return (
        <>
            <Text color={'text.primary'} fontSize={'lg'}>{props.title ? props.title[0].toUpperCase() + props.title.slice(1, props.title.length).replaceAll('_', ' ') : ''}</Text>
            <Text color={'text.primary'} fontSize={'md'}>{props.description || ''}</Text>
            <Box p={2}>
                {props.properties.map((element, index) => (
                    <Box key={index}>{element.content}</Box>
                ))}
            </Box>
        </>
    );
}

export default ObjectFieldTemplate;

// render(
//     <Form schema={schema} validator={validator} templates={{ ObjectFieldTemplate }} />,
//     document.getElementById('app')
// );
