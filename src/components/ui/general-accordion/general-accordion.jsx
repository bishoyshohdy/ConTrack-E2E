import React from 'react';
import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Flex
} from '@chakra-ui/react';

function GeneralAccordion ({ title, children }) {
    return (
        <>
            <Accordion borderColor={'primary.80'} allowToggle>
                <AccordionItem borderRadius={'5px'}>
                    <AccordionButton h={'50px'} borderRadius={'5px'} _hover={{ cursor: 'pointer' }} as={Flex} bg={'primary.80'} color={'action.100'}>
                        {title}
                        <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel bg={'primary.80'} pb={2}>
                        {children}
                    </AccordionPanel>
                </AccordionItem>
            </Accordion>
        </>
    );
}

export default GeneralAccordion;
