import { HamburgerIcon, Icon } from '@chakra-ui/icons';
import {
    Box,
    Flex,
    Text,
    IconButton,
    Spacer,
    Avatar,
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    useDisclosure,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    VStack,
    StackDivider,
    Heading
} from '@chakra-ui/react';
import React, { useContext, useEffect, useState } from 'react';
import Logo from '../side-bar/components/logo/logo';
import lightLogo from '../../../assets/images/logo/logo-light.png';
import DarkLogo from '../../../assets/images/logo/logo-dark.png';
import { ThemeContext } from '../../../context/theme';
import { NavLink, useLocation } from 'react-router-dom';
import { FaSignOutAlt } from 'react-icons/fa';
import { getUserInfo, signOut } from '../../../api/user';
import useScreenSize from '../../../hooks/screen-size';
import SearchMenu from '../search-menu/search-menu';
import { SCREEN_SIZE } from '../../../types/screen';
import { sideBarData } from '../../../data/side-bar';
import AlexPortImg from '../../../assets/images/logo/alex-port-en.png';
import AlexPortDarkImg from '../../../assets/images/logo/alex-port-dark-en.png';
// import BoschImg from '../../../assets/images/logo/bosch.svg';

function NavBar (props) {
    const themeCtx = useContext(ThemeContext);
    const location = useLocation().pathname;
    const navData = location.split('/').splice(1);
    const size = useScreenSize();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const btnRef = React.useRef();
    const [lightImage, setLightImage] = useState('');
    const [darkImage, setDarkImage] = useState('');
    useEffect(() => {
        if (getUserInfo()) {
            if (getUserInfo().customer === 'customer1') {
                setLightImage(AlexPortImg);
                setDarkImage(AlexPortDarkImg);
            }
            // if (getUserInfo().customer === 'bosch') {
            //     setLightImage(BoschImg);
            //     setDarkImage(BoschImg);
            // }
        }
    }, []);
    return (
        
        <Flex
            mb={0}
            p={2}
            bg={'primary.80'}
            minWidth="100%"
            alignItems="center"
            gap="2"
        >
            {size < SCREEN_SIZE.LG && <IconButton
                ms={1}
                bg={'transparent'}
                size={'lg'}
                icon={<HamburgerIcon color={'text.primary'} />}
                    ref={btnRef}
                onClick={onOpen}
            />
            }
            <Box>
                <Heading as={'span'} fontSize={useScreenSize().size >= SCREEN_SIZE.MD ? '3xl' : 'xl'} color={'secondary.100'} mt={5} mb={2}>
                    {navData[0].length === 0 && (
                        'Dashboard'
                    )}
                    {navData[0].length > 0 && navData[navData.length - 1].split('-').map((navD) => {
                        return navD[0].toUpperCase() + navD.slice(1, navD.length) + ' ';
                    })}
                </Heading>
            </Box>
            <Spacer />
            {size >= SCREEN_SIZE.LG
                ? (
                    <SearchMenu showUser />
                )
                : (
                    <Flex bg={'primary.80'} borderRadius={'20px'}>
                        <SearchMenu />
                        <Drawer
                            isOpen={isOpen}
                            placement="left"
                            onClose={onClose}
                            finalFocusRef={btnRef}
                        >
                            <DrawerOverlay />
                            <DrawerContent bg={'primary.80'}>
                                <DrawerCloseButton bg={'transparent'} color={'text.primary'} />
                                <DrawerHeader>
                                    <Flex>
                                        <Logo w={100} logo={themeCtx.darkMode ? lightLogo : DarkLogo} />
                                    </Flex>
                                </DrawerHeader>
                                <DrawerBody>
                                    <VStack
                                        divider={<StackDivider borderColor="text.primary" />}
                                        spacing={4}
                                        align="stretch"
                                    >
                                        {sideBarData.data.map((dev) => {
                                            return (
                                                <Box
                                                    key={dev.id}
                                                    _hover={{ bg: 'primary.80', opacity: 0.5 }}
                                                    p={2}
                                                    display={'flex'}
                                                    as={NavLink}
                                                    gap={3}
                                                    alignItems={'center'}
                                                    textAlign="left"
                                                    bg={'transparent'}
                                                    color={'text.primary'}
                                                    w="100%"
                                                    cursor={'pointer'}
                                                    to={dev.path}
                                                >
                                                    <Icon as={dev.icon} />
                                                    {dev.name}
                                                </Box>
                                            );
                                        })}
                                        <Accordion
                                            borderWidth={0}
                                            borderStyle={'hidden'}
                                            color={'text.primary'}
                                            allowMultiple
                                        >
                                            <AccordionItem borderWidth={0} cursor={'pointer'}>
                                                <AccordionButton
                                                    pl={0}
                                                    justifyContent={'space-between'}
                                                    gap={2}
                                                    as={Flex}
                                                    textAlign="left"
                                                >
                                                    <Text>
                                                        <Avatar
                                                            // mr={2}
                                                            size={'sm'}
                                                            name={getUserInfo && getUserInfo().user_name ? getUserInfo().user_name : ''}
                                                        />{getUserInfo && getUserInfo().user_name ? getUserInfo().user_name : ''}
                                                    </Text>
                                                    <AccordionIcon />
                                                </AccordionButton>
                                                <AccordionPanel pb={4}>
                                                    <Box
                                                        _hover={{ bg: 'primary.80', opacity: 0.5 }}
                                                        p={2}
                                                        as={Flex}
                                                        gap={3}
                                                        alignItems={'center'}
                                                        textAlign="left"
                                                        onClick={signOut}
                                                        bg={'transparent'}
                                                        color={'text.primary'}
                                                        w="100%"
                                                        cursor={'pointer'}
                                                    >
                                                        <FaSignOutAlt />
Sign Out
                                                    </Box>
                                                </AccordionPanel>
                                            </AccordionItem>
                                        </Accordion>
                                    </VStack>
                                </DrawerBody>
                            </DrawerContent>
                        </Drawer>
                    </Flex>
                )}
        </Flex>
    );
}
export default NavBar;
