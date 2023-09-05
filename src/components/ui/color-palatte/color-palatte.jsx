import { Box, Heading, Stack } from '@chakra-ui/react';
import React from 'react';

function ColorPalatte () {
    return (
        <Box ml={100} position={'relative'} mt={20} >
            <Heading>Our Color Palette</Heading>
            <Stack direction={'row'}>
                <Box borderWidth={2} borderColor={'secondary.100'} p={3} bg={'#9370db'} color={'#8a2be2'}>primary.100</Box>
                <Box borderWidth={2} borderColor={'secondary.100'} p={3} bg={'primary.80'} color={'secondary.100'}>primary.80</Box>
                <Box borderWidth={2} borderColor={'secondary.100'} p={3} bg={'primary.60'} color={'secondary.100'}>primary.60</Box>
                <Box borderWidth={2} borderColor={'secondary.100'} p={3} bg={'primary.40'} color={'secondary.100'}>primary.40</Box>
                <Box borderWidth={2} borderColor={'secondary.100'} p={3} bg={'primary.20'} color={'secondary.100'}>primary.20</Box>
                <Box borderWidth={2} borderColor={'secondary.100'} p={3} bg={'primary.10'} color={'secondary.100'}>primary.10</Box>
            </Stack>
            <Stack direction={'row'}>
                <Box borderWidth={2} borderColor={'primary.60'} p={3} bg={'secondary.100'} color={'primary.100'}>secondary.100</Box>
                <Box borderWidth={2} borderColor={'primary.60'} p={3} bg={'secondary.80'} color={'primary.100'}>secondary.80</Box>
                <Box borderWidth={2} borderColor={'primary.60'} p={3} bg={'secondary.60'} color={'primary.100'}>secondary.60</Box>
                <Box borderWidth={2} borderColor={'primary.60'} p={3} bg={'secondary.40'} color={'primary.100'}>secondary.40</Box>
                <Box borderWidth={2} borderColor={'primary.60'} p={3} bg={'secondary.20'} color={'primary.100'}>secondary.20</Box>
                <Box borderWidth={2} borderColor={'primary.60'} p={3} bg={'secondary.10'} color={'primary.100'}>secondary.10</Box>
            </Stack>
            <Stack direction={'row'}>
                <Box borderWidth={2} borderColor={'primary.40'} p={3} bg={'action.100'} color={'primary.100'}>action.100</Box>
                <Box borderWidth={2} borderColor={'primary.40'} p={3} bg={'success.100'} color={'primary.100'}>success.100</Box>
                <Box borderWidth={2} borderColor={'primary.40'} p={3} bg={'warning.100'} color={'primary.100'}>warning.100</Box>
                <Box borderWidth={2} borderColor={'primary.40'} p={3} bg={'danger.100'} color={'primary.100'}>danger.100</Box>
                <Box borderWidth={2} borderColor={'primary.40'} p={3} bg={'blue.100'} color={'primary.100'}>blue.100</Box>
                <Box borderWidth={2} borderColor={'primary.40'} p={3} bg={'blue.50'} color={'primary.100'}>blue.50</Box>
            </Stack>
            <Stack direction={'row'}>
                <Box borderWidth={2} borderColor={'text.primary'} p={3} bg={'text.secondary'} color={'text.primary'}>text.primary</Box>
                <Box borderWidth={2} borderColor={'text.primary'} p={3} bg={'text.primary'} color={'text.secondary'}>text.secondary</Box>
                <Box borderWidth={2} borderColor={'text.gray.50'} p={3} bg={'text.gray.100'} color={'text.gray.50'}>text.gray.50</Box>
                <Box borderWidth={2} borderColor={'text.gray.200'} p={3} bg={'text.gray.50'} color={'text.gray.200'}>text.gray.100</Box>
            </Stack>
            <Stack direction={'row'}>
                <Box borderWidth={2} p={3} bg={'chart.100'} color={'text.primary'}>chart.100</Box>
                <Box borderWidth={2} p={3} bg={'chart.80'} color={'text.primary'}>chart.80</Box>
                <Box borderWidth={2} p={3} bg={'chart.60'} color={'text.primary'}>chart.60</Box>
                <Box borderWidth={2} p={3} bg={'chart.40'} color={'text.primary'}>chart.40</Box>
            </Stack>
        </Box>);
}

export default ColorPalatte;
