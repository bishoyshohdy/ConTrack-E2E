import { 
  Box, 
  Button, 
  Flex, 
  Input, 
  Text, 
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton, 
  useDisclosure,
  Heading,
  Spacer,
  Card,
  CardHeader,
  CardBody,
  CardFooter,

} from "@chakra-ui/react";
import React, { useContext, useEffect, useState,  } from "react";
import { createGeofence } from "../../../api/geofences";
import { showsuccess } from "../../../helpers/toast-emitter";
import Map from "../../ui/map/map";
import GeofenceTable from "../../ui/table/geofence-table";
import { extractGeoHeaders } from "../../../helpers/array-map";
import { Icon } from "@chakra-ui/icons";
import FunctionalModal from "../../ui/functional-modal/functional-modal";
import "./geofences.css";
import { DevicesContext } from "../../../context/devices";
import { hasPermission } from "../../../helpers/permissions-helper";
import { PERMISSIONS } from "../../../types/devices";
import { deleteGeofence } from "../../../api/geofences";
import EditGeofence from "../../pages/geofences/edit-geofence/edit-geofence";
import DeleteGeofence from "../../pages/geofences/delete-geofence/delete-geofence";
import { FaMapMarkedAlt, FaEye} from "react-icons/fa";
import { use } from "marked";
import { MdAdd } from "react-icons/md";

function Geofences() {

  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = React.useRef()

  const [geoFences, setGeofences] = useState([]);

  const [routes, setRoutes] = useState([]);

  const [update, setUpdate] = useState(false);
  const deviceCtx = useContext(DevicesContext);

  useEffect(() => {
    deviceCtx.getGeofencesCall();
  }, []);

  useEffect(() => {
    if (update) {
      deviceCtx && deviceCtx.getGeofencesCall() && deviceCtx.getRoutesCall();
      setUpdate(false);
    }
    deviceCtx.geofences &&
      setGeofences(
        
        deviceCtx.geofences.map((geo) => {
          return {
            ...geo,
            callBack: setUpdate,
          };
        })
      );
    deviceCtx.routes &&
      setRoutes(
        deviceCtx.routes.map((route) => {
          return {
            ...route,
            callBack: setUpdate,
          };
        })
      );
  }, [deviceCtx, update]);

  const onPolygonComplete = (polygon) => {
    const pointList = polygon.getPath().getArray();
    console.log(polygon.getPath().getArray());
    const resPolygon = [];
    pointList.forEach((element) => {
      resPolygon.push({ lat: element.lat(), lng: element.lng() });
    });
    console.log(resPolygon);
    setNewGeoPolygon(resPolygon);
  };
  const [newGeoName, setNewGeoName] = useState("");
  const [newGeoPolygon, setNewGeoPolygon] = useState([]);
  const createNewGeo = () => {
    createGeofence(
      newGeoName,
      newGeoPolygon.map((point) => [point.lat, point.lng])
    ).then((res) => {
      showsuccess("Successfully created new geofence");
      setUpdate(true);
      setNewGeoName("");
      setNewGeoPolygon([]);
      geo.callBack(true);
    });
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => {
      setIsModalOpen(true);
    };

    const closeModal = () => {
      setIsModalOpen(false);
    };


    const [selectedGeofence, setSelectedGeofence] = useState(null);
    const [selectedGeofences, setSelectedGeofences] = useState(null);

    const handleViewClick = (geofences, geofence) => {
      setSelectedGeofence(geofence); 
      setSelectedGeofences(geofences); 
      onClose();
  };



  return (
    <>  
            <Box zIndex={2} position={"absolute"} mx={5} my={5}>
            {hasPermission(PERMISSIONS.CREATE_GEOFENCES)&&
            (
            <FunctionalModal
              modalTitle={"Create Geofence"}
              btnTitle={"Create Geofence"}
              btnSize={"md"}
              modalMinH={"700px"}
              modalMinW={"80%"}
              iconSize={"20px"} 
              iconBtn={MdAdd} 
              IconAndText={true}             
              btnAction={
                <Button
                  isDisabled={newGeoName.trim().length === 0 || newGeoPolygon.length === 0}
                  onClick={() => {
                    createNewGeo();
                    closeModal();
                  }}
                  bg={"primary.100"}
                  color={"text.primary"}

                >
                  Create Geofence
                </Button>
              }
              isOpen={isModalOpen}
              onClose={closeModal}
              onOpen={openModal} 
              btnColor={"action.100"}
              
            >
              <Box
                gap={2}
                alignItems={"baseline"}
                justifyContent={"space-between"}
                as={Flex}
                mb={2}
                w={"100%"}
                bg={"primary.80"}
                borderRadius={"5px"}
              >
                <Text>Name:</Text>
                <Input
                  value={newGeoName}
                  onChange={(e) => setNewGeoName(e.target.value)}
                />
              </Box>
              <Box w={"100%"} h={"80%"} bg={"primary.80"} borderRadius={"5px"}>
                <Map
                  draw={true}
                  drawingComplete={onPolygonComplete}
                  zoom={14}
                  trips={false}
                  geofences={geoFences}
                />
              </Box>
              </FunctionalModal>
            )}
            </Box>

            
            <Box zIndex={2} position={"absolute"} mx={5} my={16}>
            {hasPermission(PERMISSIONS.GET_GEOFENCES)&&
            (
              <>
              <Button 
              ref={btnRef} 
              bg={"action.100"}
              color={"text.primary"}
              size={"md"}
              onClick={onOpen}
              leftIcon={<Icon as={FaEye} w={5} h={5} />}
              >
                View Geofences
            </Button>
              
            {selectedGeofence !== null && ( 
            <Card 
                    borderRadius={'30px 30px 30px 30px'}
                    minW={'250px'}
                    minH={'200px'}
                    mx={2}
                    my={5}
                    bg={'#2d3748'}
                    color="secondary.100"
                    border="2px solid #2d3748" 
                    maxW={'250px'}
                    backgroundColor={"primary.80"}
                    borderColor={"primary.60"}
                    _hover={{
                      backgroundColor: "primary.100",
                      borderColor: "primary.60",
                      
                    }}
                    >
                      <Flex justifyContent={'start'} gap={2}>
                        <Button
                          colorScheme="red"
                          variant="solid"
                          size="sm"
                          ml={2}
                          mt={4}
                          mr={4}
                          pos={'absolute'}
                          right={'0px'}
                          top={'0px'}
                          onClick={() => {
                            setSelectedGeofence(null)
                            setSelectedGeofences(null) 
                          }
                          }

                          borderRadius={'50%'}
                        >
                          <Text>
                            X
                          </Text>
                        </Button>
                      </Flex
                    
                   >
                      <CardHeader
                        mt={8} 
                        pb={'10px'}>
                      <Flex alignItems={'center'}>
                        <Heading size='md' mb={'10px'}> 
                        <Text mb={2} fontSize={'xl'}>{selectedGeofence.name}</Text>
                        <Text fontSize={'lg'}>ID: {selectedGeofence.id}</Text>
                        </Heading>
                        <Spacer/>
                      </Flex>
                      <hr style={{ width: '60%', color: 'blue' }} />
                      </CardHeader>
                           
                      <CardBody
                      pt={'10px'} 
                      pb={'0px'}
                      pr={'0px'}>
                        <Flex justifyContent={'start'} gap={2}>
                          
                        <EditGeofence 
                          geofence={selectedGeofence}
                          geofences={selectedGeofence} 
                        />

                        <DeleteGeofence
                          name={selectedGeofence.name}
                          callBack={selectedGeofence.callBack}
                          id={selectedGeofence.id}
                          deleteAction={deleteGeofence}
                        />         


                        </Flex>
                      </CardBody>
             </Card>
            )}
              
            <Drawer
              isOpen={isOpen}
              placement='bottom'
              onClose={onClose}
              finalFocusRef={btnRef}

              
            >
              <DrawerOverlay />
              <DrawerContent
                bg={"primary.80"}
                color={"text.primary"}
                borderRadius={"10px"}
              >
                <DrawerCloseButton />
                <DrawerBody >
                <GeofenceTable
                        title={"GeoFences"}
                        extractFn={extractGeoHeaders}
                        data={ 
                          hasPermission(PERMISSIONS.DELETE_GEOFENCES) || hasPermission(PERMISSIONS.EDIT_GEOFENCES) ?
                          geoFences.map((geo) => {
                          return {
                            val: geo.name,
                            id: geo.id,
                            Geofence_Actions: { geofence: geo, geofences: geoFences },
                          };
                        })
                      :
                      geoFences.map((geo) => {
                        return {
                          val: geo.name,
                          id: geo.id,
                          
                        };
                      })
                      }

                      handleViewClick={handleViewClick}
                      >
                  </GeofenceTable>
                </DrawerBody>

                <DrawerFooter>

                </DrawerFooter>
              </DrawerContent>
            </Drawer>
            </>
            )}
            
            </Box>
            
            <Box maxH={'0vh'}>
            <Map 
            zoom={selectedGeofence ? 16 : 12} 
            trips={false} geofences={selectedGeofences ? [selectedGeofence]: geoFences} 
            oldCenter={selectedGeofence ? selectedGeofence.center : null} 
            />
            </Box>
    </>
  );
}

export default Geofences;
