import React from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody
} from '@chakra-ui/react';

function FunctionalModalV2 ({ closeBtn, isOpen, footer = true, modalTitle, children, btnAction, modalMinH, modalMinW = '350px', transparent, smallBlur, initialRef }) {
    return (
        <>
            <Modal initialFocusRef={initialRef} scrollBehavior='inside' isCentered motionPreset='scale' w={'100%'} h={transparent && '100%'} isOpen={isOpen}>
                <ModalOverlay h={'100%'} backdropFilter='auto' backdropBlur={smallBlur ? '0px' : '4px'} />
                <ModalContent m={0} h={modalMinH} minW={modalMinW} bg={transparent ? 'transparent' : 'primary.80'}>
                    <ModalHeader bg={transparent ? 'transparent' : 'primary.80'} color={'text.primary'}>{modalTitle}</ModalHeader>
                    <ModalBody h={transparent ? '100%' : modalMinH} color={'text.primary'}>
                        {children}
                    </ModalBody>
                    {
                        footer && <ModalFooter h={'60px'} bg={transparent ? 'transparent' : 'primary.80'}>
                            {!transparent ? closeBtn : null }
                            {btnAction}
                        </ModalFooter>
                    }
                </ModalContent>
            </Modal>
        </>
    );
}

export default FunctionalModalV2;
