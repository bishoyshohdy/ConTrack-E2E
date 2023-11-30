import { Button, Text, Tag, TagLabel, Tooltip } from "@chakra-ui/react";
import React, { useState } from "react";
import { showsuccess } from "../../../../helpers/toast-emitter";
import FunctionalModal from "../../../ui/functional-modal/functional-modal";
import { DeleteIcon } from "@chakra-ui/icons";
import { set } from "react-hook-form";

function DeleteGeofence({
  name,
  callBack,
  id,
  deleteAction,
  onDelete,
  setUpdate,
  setMapKey,
  setIsViewingGeoFence,
  setSelectedGeofence,
  setSelectedGeofences,
}) {
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  return (
    <FunctionalModal
      modalTitle={`Delete ${name}`}
      btnTitle={"Delete"}
      iconBtn={DeleteIcon}
      iconSize="15px"
      btnColor={"danger.100"}
      btnSize={"sm"}
      modalMinH={"250px"}
      modalMinW={"25%"}
      btnAction={
        <Button
          bg={"danger.100"}
          _hover={{ opacity: 0.8 }}
          color={"white"}
          onClick={() => {
            deleteAction(id).then((res) => {
              showsuccess("Successfully deleted");
              console.log(setSelectedGeofence);
              setSelectedGeofence(null);
              setSelectedGeofences(null);
              setDeleteModalOpen(false);
              setIsViewingGeoFence(false);
              setUpdate(true);
              setMapKey((prevKey) => prevKey + 1);
              callBack(true);
              if (onDelete) {
                onDelete();
              }
            });
          }}
        >
          Delete {name}
        </Button>
      }
      isOpen={isDeleteModalOpen}
      onOpen={() => setDeleteModalOpen(true)}
      onClose={() => setDeleteModalOpen(false)}
    >
      <Text>Are you sure you want to delete {name}?</Text>
      <Tag
        size="lg"
        colorScheme="danger"
        borderRadius="full"
        color={"white"}
        margin={5}
      >
        <TagLabel>
          {name} : {id}
        </TagLabel>
      </Tag>
    </FunctionalModal>
  );
}
export default DeleteGeofence;
