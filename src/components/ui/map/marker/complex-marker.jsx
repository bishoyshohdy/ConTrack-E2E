import React, { useState } from "react";
import { MarkerF, InfoWindowF } from "@react-google-maps/api";

// import the cylock icon
import CyLockIcon from "../../../../assets/images/devices/cycollector.webp";

import { Box, Text } from "@chakra-ui/react";

function ComplexMarker({ key, marker }) {
  const [showBox, toggleShowBox] = useState(false);
  return (
    <>
      <MarkerF
        //   resize the icon, width and height are in pixels (px)
        // ratio must be maintained

        icon={{
          url: CyLockIcon,
          scaledSize: new window.google.maps.Size(35, 50),
          origin: new window.google.maps.Point(0, 0),
          anchor: new window.google.maps.Point(15, 15),
        }}
        key={key}
        name={marker.name}
        position={{
          lat: parseFloat(marker.position.lat),
          lng: parseFloat(marker.position.lng),
        }}
        // label={marker.name}
        // title={marker.name}
        onClick={() => toggleShowBox(!showBox)}
      />
      {showBox && (
        <InfoWindowF
          position={{
            lat: parseFloat(marker.position.lat),
            lng: parseFloat(marker.position.lng),
          }}
        >
          <Box>
            <Text color={"blue.50"}>
              {marker.msg ? marker.msg : marker.name}
            </Text>
          </Box>
        </InfoWindowF>
      )}
    </>
  );
}

export default ComplexMarker;
