import { Box, Button, Flex, Input, Text, FormControl,  FormErrorMessage, FormHelperText, } from '@chakra-ui/react';
import React, { useContext, useEffect, useState } from 'react';

import { createUser } from '../../../api/user-management';
import { showsuccess } from '../../../helpers/toast-emitter';
import AvatarCard from '../../ui/avatar-card/avatar-card';
import FunctionalModal from '../../ui/functional-modal/functional-modal';
import StyledSelect from '../../ui/styled-select/styled-select';
import { UsersContext } from '../../../context/users';
import { hasPermission } from '../../../helpers/permissions-helper';
import { PERMISSIONS } from '../../../types/devices';

function Users () {
    const [users, setUsers] = useState([]);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [allRoles, setRoles] = useState([]);
    const [userRoles, setUserRoles] = useState([]);
    const [userDevices, setUserDevices] = useState([]);
    const [update, setUpdate] = useState(true);
    const [currentUserDevices , setCurrentUserDevices] = useState([])
    const usersCtx = useContext(UsersContext);
    const [isNameError, setIsNameError] = useState(true);
    const [isUsernameError, setIsUsernameError] = useState(true);
    const [isPasswordError, setIsPassworError] = useState(true);
    const [isEmailError, setIsEmailError] = useState(true);
    const [nameError, setNameError] = useState("");
    const [usernameError, setUsernameError] = useState("");
    const [passwordError, setPassworError] = useState("");
    const [emailError, setEmailError] = useState("");
    const emailRegex = /^\S+@\S+\.\S+$/;

    useEffect(() => {
        if(name === ''){
            setIsNameError(true)
            setNameError("Name is required.")
        }else if (name.length <= 3){
            setIsNameError(true)
            setNameError("Name must be at least 4 characters.")
        }else{
            setIsNameError(false)
        }
    }, [name]);

    useEffect(() => {
        if(username === ''){
            setIsUsernameError(true)
            setUsernameError("Username is required.")
        }else if (username.length <= 3){
            setIsUsernameError(true)
            setUsernameError("Username must be at least 4 characters.")
        }else{
            setIsUsernameError(false)
        }
        
    }, [username]);

    useEffect(() => {
        if(email === ''){
            setIsEmailError(true)
            setEmailError("Email is required.")
        }else if (!emailRegex.test(email)){
            setIsEmailError(true)
            setEmailError("Email must be valid.")
        }else{
            setIsEmailError(false)
        }
    }, [email]);

    useEffect(() => {
        if(password === ''){
            setIsPassworError(true)
            setPassworError("Password is required.")
        }else if (password.length <= 3){
            setIsPassworError(true)
            setPassworError("Password must be at least 4 characters.")
        }else{
            setIsPassworError(false)
        }
    }, [password]);

    useEffect(() => {
        if (usersCtx.users) {
            setUsers(usersCtx.users);
            setRoles(usersCtx.allRoles);
            setUpdate(false);
            setCurrentUserDevices(usersCtx.devices)
        }
    }, [usersCtx, update]);

    const createNewUser = () => {
        createUser(username, password, name, email, userRoles.map((role) => role.value), userDevices.map((device) => device.value)).then((res) => {
            showsuccess('Successfully created user');
            setUpdate(true);
        });
    };

    return (
        <>
            <Flex p={2} flexWrap={'wrap'} gap={2}>
                <Box w={'100%'} justifyContent={'end'} as={Flex}>
                    {hasPermission(PERMISSIONS.CREATE_USERS) && 
                    (  <FunctionalModal
                        modalTitle={'Create new user'}
                        btnTitle={'Create user'}
                        btnColor={'action.100'}
                        btnSize={'lg'}
                        modalMinH={'600px'}
                        btnAction={<Button onClick={createNewUser} isDisabled={ isNameError || isUsernameError || isEmailError || isPasswordError} color={'text.primary'} bg={'primary.100'}>Create User</Button>}
                    >
                        
                        <Box as={Flex} flexWrap={'wrap'} gap={5}>
                            <Box w={'100%'} gap={5} as={Flex} alignItems={'center'}>
                                <Text w={'30%'}>Name</Text>
                                <Box as={Flex}  w={'100%'} alignItems={'flex-start'} flexDirection={"column"}>
                                <FormControl isInvalid={isNameError}>
                                <Input type="text" placeholder='Name'  maxW={'100%'} value={name} onChange={(e) => setName(e.target.value)}/>
                                {!isNameError ? (
                                    ''
                            ) : (
                                <FormErrorMessage>{nameError}</FormErrorMessage>
                            )}
                            </FormControl>
                            </Box>
                            </Box>
                            <Box w={'100%'} gap={5} as={Flex} alignItems={'center'}>
                                <Text w={'30%'}>Username</Text>
                                <Box as={Flex}  w={'100%'} alignItems={'flex-start'} flexDirection={"column"}>
                                <FormControl isInvalid={isUsernameError}>
                                <Input maxW={'100%'} placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)} />
                                {!isUsernameError ? (
                                    ''
                            ) : (
                                <FormErrorMessage>{usernameError}</FormErrorMessage>
                            )}
                             </FormControl>
                            </Box>
                            </Box>
                            <Box w={'100%'} gap={5} as={Flex} alignItems={'center'}>
                                <Text w={'30%'}>Email</Text>
                                <Box as={Flex}  w={'100%'} alignItems={'flex-start'} flexDirection={"column"}>
                                <FormControl isInvalid={isEmailError}>
                                <Input maxW={'100%'} value={email} type={'email'} placeholder='Email' onChange={(e) => setEmail(e.target.value)} />
                                {!isEmailError ? (
                                    ''
                            ) : (
                                <FormErrorMessage>{emailError}</FormErrorMessage>
                            )}
                              </FormControl>
                            </Box>
                            </Box>
                            <Box w={'100%'} gap={5} as={Flex} alignItems={'center'}>
                                <Text w={'30%'}>Password</Text>
                                <Box as={Flex}  w={'100%'} alignItems={'flex-start'} flexDirection={"column"}>
                                <FormControl isInvalid={isPasswordError}>
                                <Input maxW={'100%'} value={password} type={'password'} placeholder='Password' onChange={(e) => setPassword(e.target.value)} />
                                {!isPasswordError ? (
                                    ''
                            ) : (
                                <FormErrorMessage>{passwordError}</FormErrorMessage>
                            )}
                             </FormControl>
                            </Box>
                            </Box>
                            <Box w={'100%'} gap={5} as={Flex} alignItems={'center'}>
                                <Text w={'30%'}>Roles</Text>
                                <Box w={'100%'}>
                                <StyledSelect multi value={userRoles} onchange={setUserRoles} options={allRoles.map((role) => { return { label: role.name, value: role.id }; })} size={'md'} />
                                </Box>
                            </Box>
                            <Box w={'100%'} gap={5} as={Flex} alignItems={'center'}>
                                <Text w={'30%'}>Devices</Text>
                                <Box w={'100%'}>
                            <StyledSelect multi value={userDevices} onchange={setUserDevices} options={currentUserDevices.map((device) => { return { label: device.name, value: device.id }; })} size={'md'} />
                            </Box>
                            </Box>
                        </Box>
                        
                    </FunctionalModal>)}

                </Box>
                {users.map((user) => {
                    return <AvatarCard key={user.id} navigation={true} clickable={true} title={user.user_name} subtitle={user.name} list1={user.roles} list2={user.devices} />;
                })}
            </Flex>
        </>
    );
}

export default Users;
