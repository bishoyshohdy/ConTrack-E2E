import React, { useContext, useState } from 'react';
import { ThemeContext } from '../../../../context/theme';
import './login.css';
import {
  Box,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Center,
  Button,
  Heading,
  Image,
  useToast,
  useDisclosure
} from "@chakra-ui/react";
import { useForm } from 'react-hook-form';
import LightImg from '../../../../assets/images/login/login-light.png';
import DarkImg from '../../../../assets/images/login/login-dark.png';
import DarkLogo from '../../../../assets/images/logo/logo-dark.png';
import LightLogo from '../../../../assets/images/logo/logo-light.png';
import ThemeButton from '../../../ui/theme-button/theme-button';
import { firstStepLogin, acceptedTermsAndConditions, secondStepLogin, hasTermsAndConditions } from '../../../../api/user';
import TermsAndConditions from '../terms-and-conditions/terms-and-conditions';

function Login() {
    const theme = useContext(ThemeContext);
    const { register, formState: { errors, isSubmitting }, handleSubmit } = useForm();
    const toast = useToast();
    const [userInfo, setUserInfo] = useState();
    const [token, setToken] = useState();
    const { isOpen, onOpen, onClose } = useDisclosure()
    function onSubmit(data) {
        firstStepLogin(data.username, data.password).then((res) => {
            setUserInfo(res.userInfo);
            setToken(res.token);
            if (hasTermsAndConditions(res.userInfo.customer)) {
                if (acceptedTermsAndConditions(res.userInfo.customer)) {
                    secondStepLogin(res.token, res.userInfo);
                } else {
                    onOpen();
                }
            } else {
                secondStepLogin(res.token, res.userInfo);
            }
        }).catch(err => {
            toast({
                title: 'Login was not successful',
                description: err.response.data.message,
                status: 'error',
                variant: 'solid',
                isClosable: true
            });
        });
    }
    return (
        <>
            <Box display={'flex'} justifyContent={'end'} p={1} pt={8} pe={8}>
                <ThemeButton />
            </Box>
            <Box position={'fixed'} top={'15%'} left={'25%'} bottom={'25%'} right={'25%'}>
                <Center mb={7}>
                    <Image alt="logo" w={'xs'} src={theme.darkMode ? LightLogo : DarkLogo} />
                </Center>
                <Center mb={7}>
                    <Heading color={'text.primary'}>Sign in</Heading>
                </Center>
                <Center flexWrap={'wrap'}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <FormControl mb={7} color={'text.primary'} w={'100%'} isRequired isInvalid={errors.username}>
                            <FormLabel htmlFor='username'>Username</FormLabel>
                            <Input
                                //focusBorderColor="transparent"
                                bg={'white'}
                                color={'black'}
                                id='username'
                                placeholder='Username'
                                {...register('username', {
                                    required: 'This is required',
                                    minLength: { value: 3, message: 'Minimum length should be 3' }
                                })}
                            />
                            <FormErrorMessage color={'danger.100'}>
                                {errors.username && errors.username.message}
                            </FormErrorMessage>
                        </FormControl>
                        <FormControl mb={7} color={'text.primary'} w={'100%'} isRequired isInvalid={errors.password}>
                            <FormLabel htmlFor='password'>Password</FormLabel>
                            <Input
                                bg={'white'}
                                color={'black'}
                                id='password'
                                type={'Password'}
                                placeholder='Password'
                                {...register('password', {
                                    required: 'This is required',
                                    minLength: { value: 2, message: 'Minimum length should be 2' }
                                })}
                            />
                            <FormErrorMessage color={'danger.100'}>
                                {errors.password && errors.password.message}
                            </FormErrorMessage>
                        </FormControl>
                        <Center mb={7}>
                            <Button bg={'#9b29e7'} color={'white'} isLoading={isSubmitting} type='submit'>Login</Button>
                        </Center>
                        <Box w={'100%'}>
                            <TermsAndConditions isOpen={isOpen} onClose={onClose} userInfo={userInfo} token={token}/>
                        </Box>
                    </form>
                </Center>
            </Box>
            <Image zIndex={-1} alt="login" w={'100%'} className={'loginImg'} src={theme.darkMode ? DarkImg : LightImg} />
        </>
    );
}

export default Login;
