import React, { useEffect } from 'react'
import { Box,
        Input,FormLabel,Flex, Button, FormControl,FormErrorMessage,Select, background, color
} from '@chakra-ui/react'
import FunctionalModal from '../functional-modal/functional-modal'
import { useState } from 'react'
import CustomFormValidation from '../CustomFormValidation/CustomFormValidation'
import {CreateDeviceUserRole} from '../../../api/device-actions'
import { showsuccess } from '../../../helpers/toast-emitter'
import { globalErrorHandler } from '../../../api/api-helpers'

const CreateDevice=({
    DeviceType,
    users=[],
    roles=[]
})=>{
    
    const [deviceName,setDeviceName]=useState('');
    const [allroles,setAllRoles]=useState([]);
    const [allusers,setAllUsers]=useState([]);
    const [deviceType,setDeviceType]=useState([]);
    const [imei,setImei]=useState();
    const [roleChosen,SetROleChosen]=useState(0);
    const [userChosen,SetUserChosen]=useState(0);  
    const [deviceNameErrorMessage,SetDeviceNameErrorMessage]=useState();
    const [ImeiErrorMessage,SetImeiErrorMessage]=useState();
    const [RoleErrorMessage,SetRoleErrorMessage]=useState();
    const [UserErrorMessage,SetUserErrorMessage]=useState();
    let UserMap=new Map()
    let RoleMap=new Map()
      

    useEffect(()=>{

        DeviceType ? setDeviceType(DeviceType):''
        if(users){
          
          setAllUsers(users.filter((Item)=>Item.name!=null).map((Item)=>{
            UserMap.set(Item.name,Item.Id)
            return {value:Item.id,label:String(Item.name)}
          }))

          
          // setAllRoles(roles.map((Item)=>{return Item.description}))
        }
        if(roles)
        {
          setAllRoles(roles.map((Item)=>
          {
            RoleMap.set(Item.name,Item.id)
            console.log('RoleMap= '+RoleMap)
            return {value:Item.id,label:String(Item.name)}  
          }))
        }
        
        console.log('---------------------------------',deviceType)
    },[DeviceType,users])

    const InputHandler=(e)=>{
        console.log(e.target.id)
        
        switch (e.target.id){
         case 'imei': 
            setImei(e.target.value)
            console.log('imei=  '+imei)
         case 'deviceName':
            setDeviceName(e.target.value)
            console.log('deviceName=    '+deviceName)
        }
    }
    const userInputHandler=(e)=>{
        console.log(e.target.value)
        SetUserChosen(e.target.value);

    }
    const roleInputHandler=(e)=>{
      console.log(e.target.value)
      SetROleChosen(e.target.value);
           
    }

    const validationChecker=()=>{
        if(!imei)
          return {check:true,name:'imei'}
        if(!deviceName)
          SetDeviceNameErrorMessage(<CustomFormValidation check={true} message="Device Name is required" ></CustomFormValidation>)
        if(!roleChosen)
          return {check:true,name:'role'}
        if(!userChosen)
          return {check:true,name:'user'}

    }
    const submitHandler=()=>{
      console.log('Type on Submit',DeviceType)
      if(DeviceType && imei && roleChosen && userChosen && deviceName)
      {
        console.log('imei',imei)
        CreateDeviceUserRole({imei,DeviceType,userChosen,roleChosen,deviceName}).then((res)=>{
          showsuccess('Device Created Successfully!');

        })
      }
    }
    


    return (
        <FunctionalModal
          modalTitle={'Create device with user roles'}
          btnTitle={'Create Device'}
          modalMinH={'610px'}
          modalMinW={"700px"}
          btnMinH={'40px'}
          btnColor={'white'}
          footer={false}
          >
            <form >
            <Flex direction={'column'} paddingBottom={'15'} >
              <Box mb={'10'}>
                <FormControl isRequired>
                <FormLabel>Device Name</FormLabel><Input id="deviceName" placeholder=" please enter Device Name" padding={'2'} bg={"primary.100"} color={"secondary.100"} variant={"flushed"} borderRadius={'10'}  onChange={InputHandler}></Input>
                  {/* {deviceNameErrorMessage} */}
                  {/* <CustomFormValidation check={true} message={"Device Name is required"}></CustomFormValidation> */}
                  <FormErrorMessage></FormErrorMessage>
                </FormControl>
                </Box>
              <Box mb={'10'}>
                <FormControl isRequired>
                <FormLabel>IMEI</FormLabel><Input id="imei" placeholder="please enter IMEI" padding={'2'} sx={{"&::placeholder": {textAlign: "",color:""},}} bg={"primary.100"} color={"secondary.100"} variant={"flushed"} borderRadius={'10'}  onChange={InputHandler}></Input>
                <FormErrorMessage></FormErrorMessage>
                </FormControl>
              </Box>
              {/* <Box mb={'10'}><FormLabel>Device Type</FormLabel><StyledSelect sx={{"&::placeholder": {textAlign: "center",},}} options={devicesType} size={'md'} borderRadius={'10'} justifyContent="center" ></StyledSelect></Box> */}
              <Box mb={'10'}>
                <FormControl isRequired>
                <FormLabel>User</FormLabel>
                {/* <StyledSelect id="role" sx={{"&::placeholder": {textAlign: "center",color:'#878B9C'},}}  options={allroles} size={'md'} borderRadius={'10'} onChange={InputHandler}></StyledSelect> */}
                <Select borderRadius='10'style={{"paddingLeft":"15px"}} variant={'flushed'} backgroundColor={"white"} value={userChosen} onChange={userInputHandler} >
                  {allusers.map((Item)=>{
                    return  <option value={Item.value} label={Item.label}></option>
                  })}
                </Select>
                <FormErrorMessage></FormErrorMessage>
                </FormControl>
              </Box>
              <Box mb={'10'}>
                <FormControl isRequired>
                <FormLabel>Role</FormLabel>
                {/* <StyledSelect id="role" sx={{"&::placeholder": {textAlign: "center",color:'#878B9C'},}}  options={allroles} size={'md'} borderRadius={'10'} onChange={InputHandler}></StyledSelect> */}
                <Select borderRadius='10'style={{"paddingLeft":"15px"}} variant={'flushed'} backgroundColor={"white"} value={roleChosen} onChange={roleInputHandler} >
                  {allroles.map((Item2)=>{
                    return  <option value={Item2.value} label={Item2.label}></option>
                  })}
                </Select>
                <FormErrorMessage></FormErrorMessage>
                </FormControl>
              </Box>
              <Box>    
                <Button float='right' onClick={submitHandler}>Submit</Button>
              </Box>
              
            </Flex>
            </form>
          </FunctionalModal>
    )
}

export default CreateDevice;