import React from 'react'
import { Text } from '@chakra-ui/react';

const CustomFormValidation=(check,message)=>{

    return (
        check ?
        
        <Text color="red"> {message} </Text>   :   
        
        <Text></Text>
    );
}
export default CustomFormValidation