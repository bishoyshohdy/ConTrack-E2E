import React from 'react';
import { SiMicrosoftexcel } from 'react-icons/si';
import { CSVLink } from 'react-csv';
import { IconButton } from '@chakra-ui/react';

function ExcelExport ({ title, data }) {
    return (
        <>

            <CSVLink
                data={data}
                target="_blank"
                filename={title + '.csv'}
            >
                <IconButton size={'md'} p={1} color={'text.primary'} bg={'action.80'} 
                rounded={10} as={SiMicrosoftexcel} _hover={{ bg: "action.80", opacity: 0.8 }}
                />
            </CSVLink>
        </>
    );
}

export default ExcelExport;
