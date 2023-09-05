import { SearchIcon } from '@chakra-ui/icons';
import { Input } from '@chakra-ui/input';
import { Box, Center } from '@chakra-ui/layout';
import React from 'react';
import { useAsyncDebounce } from 'react-table';
import useScreenSize from '../../../../../hooks/screen-size';
import { SCREEN_SIZE } from '../../../../../types/screen';
import FunctionalModal from '../../../functional-modal/functional-modal';

function GlobalFilter ({
    preGlobalFilteredRows,
    globalFilter,
    setGlobalFilter,
    width = 'xs'
}) {
    const count = preGlobalFilteredRows.length;
    const [value, setValue] = React.useState(globalFilter);
    const onChange = useAsyncDebounce(value => {
        setGlobalFilter(value || undefined);
    }, 200);
    const initialRef = React.useRef(null);

    const size = useScreenSize();

    const filterBody = () => {
        return (
            <Input
                ref={initialRef}
                variant={'outline'}
                borderColor={'primary.100'}
                bg={'primary.100'}
                borderRadius={'10px'}
                value={value || ''}
                w={width}
                color={'text.primary'}
                onChange={e => {
                    setValue(e.target.value);
                    onChange(e.target.value);
                }}
                placeholder={`Search in ${count} records`}
            />
        );
    };

    return (
        <Box>
            {
                size === SCREEN_SIZE.SM
                    ? <FunctionalModal
                        iconBtn={SearchIcon}
                        btnColor={'action.100'}
                        transparent={true}
                        modalMinH={'200px'}
                        smallBlur
                        initialRef={initialRef}
                        footer={false}
                    >
                        {/* <Text color={"text.primary"}>Search:</Text> */}
                        <Center>
                            {filterBody()}
                        </Center>
                    </FunctionalModal>
                    : filterBody()
            }
        </Box>
    );
}

export default GlobalFilter;
