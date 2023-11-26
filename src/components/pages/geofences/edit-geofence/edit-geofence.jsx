import { Box, Button, IconButton, Tooltip } from "@chakra-ui/react";
import React, { useState } from "react";
import { editGeofence } from "../../../../api/geofences";
import { showsuccess } from "../../../../helpers/toast-emitter";
import FunctionalModal from "../../../ui/functional-modal/functional-modal";
import Map from "../../../ui/map/map";
import { AiFillEdit } from "react-icons/ai";

function EditGeofence({
  geofences,
  geofence,
  setIsEditingGeoFence,
  setSelectedGeofence,
  setMapKey,
  setUpdate,
}) {
  const [polygon, setPolygon] = useState(geofence.polygon);

  const editGeoFenceAction = () => {
    editGeofence(
      geofence.id,
      polygon.map((point) => [point.lat, point.lng]),
      newGeoName
    ).then((res) => {
      showsuccess("Successfully updated geofence");
      geofence.callBack(true);
    });
  };

  return (
    <Tooltip
      label="Edit GeoFence"
      hasArrow
      placement="left"
      bg={"action.80"}
      color="white"
    >
      <IconButton
        icon={<AiFillEdit />}
        borderRadius={"full"}
        bg={"action.80"}
        color="white"
        _hover={{ bg: "action.60" }}
        variant="solid"
        size={"sm"}
        onClick={() => {
          setIsEditingGeoFence(true);
          setSelectedGeofence(geofence);
          setUpdate(true);
          // Rerender the Map component
          setMapKey((prevKey) => prevKey + 1);
        }}
      ></IconButton>
    </Tooltip>
  );
}

export default EditGeofence;
