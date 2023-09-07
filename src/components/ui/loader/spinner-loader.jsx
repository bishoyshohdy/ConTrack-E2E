import { Box, Center, Spinner } from '@chakra-ui/react';
import React from 'react';

function SpinnerLoader ({ loading, body, transparent=false, center=true }) {
    return (
        <>
            { !loading
                ? <>{ body }</>
                : <Box as={center && Center} mt={4} w={'100%'}> <Spinner
                    thickness='8px'
                    speed='0.65s'
                    emptyColor={transparent ? 'transparent' : 'secondary.100'}
                    color='transparent'
                    size='5xl'
                /> </Box>
            }
        </>
    );
}

export default SpinnerLoader;
