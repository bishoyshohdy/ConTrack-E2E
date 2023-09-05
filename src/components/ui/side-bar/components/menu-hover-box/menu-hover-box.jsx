import React from 'react';
import {
    Flex,
    Heading,
    Icon,
    Radio,
    RadioGroup,
    Stack
} from '@chakra-ui/react';

export default function MenuHoverBox ({ title, icon, choices }) {
    const [value, setValue] = React.useState('1');
    return (
        <>
            <Flex
                pos="absolute"
                mt="calc(100px - 7.5px)"
                ml="-10px"
                width={0}
                height={0}
                borderTop="10px solid transparent"
                borderBottom="10px solid transparent"
                borderRight="10px solid #82AAAD"
            />
            <Flex
                h={200}
                w={200}
                flexDir="column"
                alignItems="center"
                justify="center"
                backgroundColor="#82AAAD"
                borderRadius="10px"
                color="#fff"
                textAlign="center"
            >
                <Icon as={icon} fontSize="3xl" mb={4} />
                <Heading size="md" fontWeight="normal">{title}</Heading>
                <RadioGroup onChange={setValue} value={value}>
                    <Stack direction='column'>
                        {choices.map((choice) => {
                            return <Radio key={choice.key} value={choice.key}>{choice.name}</Radio>;
                        })}
                    </Stack>
                </RadioGroup>
            </Flex>
        </>
    );
}
