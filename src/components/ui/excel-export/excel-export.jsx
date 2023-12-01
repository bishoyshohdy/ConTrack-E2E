import React from "react";
import { SiMicrosoftexcel } from "react-icons/si";
import { CSVLink } from "react-csv";
import { IconButton, Center } from "@chakra-ui/react";

function ExcelExport({ title, data }) {
  return (
    <>
      <Center
        w={"40px"}
        h={"40px"}
        borderRadius={"full"}
        bg={"white"}
        boxShadow={"0px 0px 7px 0px #8c8c8c"}
      >
        <CSVLink data={data} target="_blank" filename={title + ".csv"}>
          <IconButton
            size={"sm"}
            p={1}
            color={"white"}
            bg={"action.80"}
            _hover={{ opacity: 0.8 }}
            rounded={"full"}
            as={SiMicrosoftexcel}
          />
        </CSVLink>
      </Center>
    </>
  );
}

export default ExcelExport;
