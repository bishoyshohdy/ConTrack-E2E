import React, { useContext,useEffect, useState } from "react";

import MarkupRenderer from "../../../ui/markup-renderer/markup-renderer";
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    Box,
    Button,
    Checkbox,
  } from '@chakra-ui/react'
import { secondStepLogin } from "../../../../api/user";
import boschTerms from "../../../../assets/markup/bosch.md";
import { CUSTOMERS } from "../../../../types/customers";
//theme
import {ThemeContext} from "../../../../context/theme";

function TermsAndConditions({ isOpen, onClose, userInfo, token }) {
    const cancelRef = React.useRef()
    const theme = useContext(ThemeContext);

    const acceptTerms = () => {
        secondStepLogin(token,userInfo);
    }
    const [termsFile, setTermsFile] = useState(boschTerms);
    useEffect(() => {
        if (userInfo && userInfo.customer === CUSTOMERS.BOSCH) {
            setTermsFile(boschTerms);
        }
    }, [userInfo])
    const [checkAccept, setCheckAccept] = useState();
    return (
        <>
            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
                bg={'primary.100'}
                w={'100%'}
                isCentered
            >
                <AlertDialogOverlay>
                <AlertDialogContent maxW="700px" bg={'primary.100'}>
                    <AlertDialogHeader color={'text.primary'} fontSize='lg' fontWeight='bold'>
                    Terms and Conditions
                    </AlertDialogHeader>
                    <AlertDialogBody bg={'primary.100'}>
                        <Box overflowY={'scroll'} p={2} h={'300px'} color={'text.primary'}>
                            <MarkupRenderer  termsFile={termsFile} />
                        </Box>
                        <Box mt={2} gap={1} w={'100%'}>
                            <Checkbox
                             alignItems={'baseline'}
                             colorScheme={theme.darkMode? 'purple':'blue'}
                            borderColor={'text.primary'}
                              color={'text.primary'} size={'md'} value={checkAccept} 
                              onChange={(e) => setCheckAccept(e.target.checked)}>I agree to the terms and conditions as set out by the user agreement</Checkbox>
                        </Box>
                    </AlertDialogBody>

                    <AlertDialogFooter>
                        <Button isDisabled={!checkAccept} bg={'action.100'} color={'text.primary'} onClick={acceptTerms}>
                            Confirm
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    );
}

export default TermsAndConditions;
