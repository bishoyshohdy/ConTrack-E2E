import React from 'react';
import {
    Flex,
    Text,
    Icon,
    Link,
    Menu,
    MenuButton
    // MenuList
} from '@chakra-ui/react';
// import MenuHoverBox from '../menu-hover-box/menu-hover-box';
import { NavLink } from 'react-router-dom';

export default function MenuItem ({ icon, title, description, active, navSize, path, choices }) {
    return (
        <Flex
            flexDir="column"
            w="100%"
            alignItems={navSize === 'small' ? 'center' : 'flex-start'}
        >
            <Menu placement="right">
                <Link
                    as={NavLink}
                    backgroundColor={active && 'secondary.100'}
                    p={3}
                    px={5}
                    borderRadius={8}
                    _hover={{ textDecor: 'none', backgroundColor: 'secondary.40' }}
                    w={navSize === 'large' && '100%'}
                    to={path}
                >
                    <MenuButton  alignContent={'center'} h={'100%'} w="100%">
                        <Flex alignItems="center">
                            <Icon
                                as={icon}
                                fontSize="2xl"
                                color={active ? 'text.secondary' : 'text.primary'}
                            />
                            <Text color={active ? 'text.secondary' : 'text.primary'} ml={5} display={navSize === 'small' ? 'none' : 'flex'}>
                                {title}
                            </Text>
                        </Flex>
                    </MenuButton>
                </Link>
                {/* {choices && (
                    <MenuList
                        py={0}
                        border="none"
                        w={200}
                        h={200}
                        ml={5}
                    >
                        <MenuHoverBox title={title} icon={icon} choices={choices} />
                    </MenuList>
                )} */}
            </Menu>
        </Flex>
    );
}
