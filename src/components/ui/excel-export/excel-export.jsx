import React from "react";
import { SiMicrosoftexcel } from "react-icons/si";
import { CSVLink } from "react-csv";
import { IconButton } from "@chakra-ui/react";

function ExcelExport({ title, data }) {
  return (
    <>
      <CSVLink data={data} target="_blank" filename={title + ".csv"}>
        <IconButton
          size={"sm"}
          p={1}
          color={"white"}
          bg={"action.80"}
          _hover={{ bg: "action.60" }}
          rounded={"full"}
          as={SiMicrosoftexcel}
        />
      </CSVLink>
    </>
  );
}

export default ExcelExport;
