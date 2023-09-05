import React, { useState } from 'react';
import FunctionalModal from '../functional-modal/functional-modal';
import { jsPDF as JsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { VscFilePdf } from 'react-icons/vsc';
import { Button } from '@chakra-ui/button';
import { Box, Flex, Text } from '@chakra-ui/layout';
import { Input } from '@chakra-ui/input';
import DarkLogo from '../../../assets/images/logo/logo-dark.png';
import { Checkbox } from '@chakra-ui/checkbox';

function PdfExport ({ title, data, tableRef }) {
    const [password, setPassword] = useState('');
    const [requirePass, setRequirePass] = useState(false);
    const createPdfCall = () => {
        const doc = new JsPDF(
            requirePass
                ? {
                    encryption: {
                        userPassword: password,
                        ownerPassword: password,
                        userPermissions: ['print', 'modify', 'copy', 'annot-forms']
                    },
                    orientation: 'landscape'
                }
                : {
                    orientation: 'landscape'
                });
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(25);
        doc.text(title, 15, 15);
        doc.addImage(DarkLogo, 'b', 150, 1, 40, 18);
        autoTable(doc, {
            head: [Object.keys(data[0])],
            body: data.map((item) => Object.values(item)),
            startX: 15,
            startY: 25,
            margin: { top: 10, bottom: 10, left: 15, right: 15 },
            headerStyles: { fillColor: 'black', textColor: 255, halign: 'center' }
        });
        doc.save(`${title}.pdf`);
    };
    return (
        <>
            {
                data && data.length !== 0 && Object.keys(data[0]).length <= 10 && <FunctionalModal
                    modalTitle={'Export as pdf'}
                    btnColor={'action.100'}
                    iconBtn={VscFilePdf}
                    btnAction={<Button color={'text.primary'} bg={'action.100'} onClick={() => createPdfCall()}>Download File</Button>}
                    modalMinH={'300px'}
                >
                    <Text>Password:</Text>
                    <Input value={password} type={'password'} onChange={(e) => setPassword(e.target.value)} />
                    <Box as={Flex} mt={2}>
                        <Checkbox value={requirePass} onChange={(e) => setRequirePass(e.target.checked)}>Require password</Checkbox>
                    </Box>
                </FunctionalModal>
            }
        </>
    );
}

export default PdfExport;
