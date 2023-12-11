import { Icon, CheckCircleIcon, CheckIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  chackraProvider,
  Circle,
  Center,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Tooltip,
} from "@chakra-ui/react";
import React, { useEffect, useState, useContext, useRef } from "react";
import StatCard from "../../ui/card/stat-card";
import ContainerTable from "../../ui/table/container-table";
import CardTable from "../../ui/table/card-table";
import AlarmTable from "../../ui/table/alarm-table";
import TabPan from "../../ui/tabs/tab-panel";
import theme from "../../ui/tabs/tab-theme";
import Map from "../../ui/map/map";
import "./dashboard.css";
import { useNavigate } from "react-router-dom";
import { BiFilter } from "react-icons/bi";
import { showsuccess } from "../../../helpers/toast-emitter";
import {
  extractAlarmHeaders,
  extractUniqueKeys,
  formatLocalToISOUTC,
} from "../../../helpers/array-map";
import { actionAlarm, getAlarms, getAlarmsTypes } from "../../../api/alarms";
import FunctionalModal from "../../ui/functional-modal/functional-modal";
import HistoryPicker from "../../ui/history-picker/history-picker";
import StyledSelect from "../../ui/styled-select/styled-select";
import { ALARM_STATUS, SEVERITY } from "../../../data/alarms";
import { DevicesContext } from "../../../context/devices";
import CyLockIcon from "../../ui/icon/cylock-icon";
import { ThemeContext } from "../../../context/theme";
import CyTagIcon from "../../ui/icon/cytag-icon";
import AlarmIcon from "../../ui/icon/alarm-icon";
import PdfExport from "../../ui/pdf-export/pdf-export";
import ExcelExport from "../../ui/excel-export/excel-export";
import { FaMapMarkedAlt } from "react-icons/fa";
import GeneralAccordion from "../../ui/general-accordion/general-accordion";
import { GiCargoCrate } from "react-icons/gi";
import { hasPermission } from "../../../helpers/permissions-helper";
import { PERMISSIONS } from "../../../types/devices";
import { set } from "react-hook-form";
import { debounce } from "lodash";
import TagContainer from "../../ui/table/tag-container";
import { useLocation } from "react-router-dom";
import { MdClear } from "react-icons/md";

export function AlarmAction({
  actionPerformed,
  alarm,
  callback,
  acknowldgeAction,
  useAlarmId,
}) {
  const actionAlarmCall = () => {
    actionAlarm(
      alarm,
      acknowldgeAction ? ALARM_STATUS.ACKNOWLEDGED : ALARM_STATUS.CLEARED
    ).then((res) => {
      showsuccess(`Alarm ${acknowldgeAction ? "acknowledged" : "cleared"}`);
      callback(useAlarmId ? alarm : {});
    });
  };

  return (
    <Box as={Flex} justifyContent={"center"}>
      {!actionPerformed ? (
        <FunctionalModal
          modalTitle={acknowldgeAction ? "Acknowledge alarm" : "Clear alarm"}
          modalMinW={"100px"}
          modalMinH={"200px"}
          btnColor={"action.80"}
          iconBtn={acknowldgeAction ? CheckIcon : MdClear}
          btnAction={
            <Button
              onClick={actionAlarmCall}
              bg={"action.80"}
              _hover={{ bg: "action.60" }}
              color={"white"}
            >
              {acknowldgeAction ? "Acknowledge" : "Clear"}
            </Button>
          }
        >
          Are You Sure you want to {acknowldgeAction ? "acknowledge" : "clear"}{" "}
          this alarm?
        </FunctionalModal>
      ) : (
        <Tooltip
          label={"Acknowledged"}
          placement={"bottom"}
          hasArrow
          bg={"success.100"}
        >
          <Center
            w={"40px"}
            h={"40px"}
            borderRadius={"full"}
            bg={"white"}
            boxShadow={"0px 0px 7px 0px #8c8c8c"}
          >
            <Icon
              h={"70%"}
              w={"70%"}
              as={CheckIcon}
              p={"10%"}
              borderRadius={"full"}
              color={"white"}
              bg={"success.100"}
            />
          </Center>
        </Tooltip>
      )}
    </Box>
  );
}

const DummyContainerData = [
  {
    customs_clearance: {
      name: "Ben Davis",
      jobTitle: "Customs Broker",
      role: "Assistant",
      phone_number: "+123456789",
      email: "bendavis@xyz.com",
    },
    phone_number: "+971 5547896",
    shippingline_key_contact: "shipping-line1@shippingline.com",
    timeline: {
      startdate: "2023-12-01",
      enddate: "2023-12-08",
    },
    document_status: {
      current_status: "Canceled",
      possible_status: ["In Progress", "Done", "Stuck", "Canceled"],
    },
    priority: {
      current_priority: "Low",
      possible_priority: ["High", "Medium", "Low"],
    },
    estimate_start_time: "2023-12-01",
    status: {
      current_status: "Fleet Forwarders",
      possible_status: ["Warehousing", "Fleet Forwarders", "Shipping Line"],
    },
    importer: {
      name: "John Doe",
      jobTitle: "IoT Business Development Manager",
      role: "Admin",
      phone_number: "+971 5547896",
      email: "bendavis@xyz.com",
    },
    name: "MSCU5285725",
    id: "5285725",
  },
  {
    customs_clearance: {
      name: "Alice Johnson",
      jobTitle: "Software Engineer",
      role: "Developer",
      phone_number: "+987654321",
      email: "alicejohnson@xyz.com",
    },
    shippingline_key_contact: "shipping-line2@shippingline.com",
    phone_number: "+254 1234567",
    timeline: {
      startdate: "2023-12-05",
      enddate: "2023-12-12",
    },
    document_status: {
      current_status: "Done",
      possible_status: ["In Progress", "Done", "Stuck", "Canceled"],
    },
    priority: {
      current_priority: "High",
      possible_priority: ["High", "Medium", "Low"],
    },
    estimate_start_time: "2023-12-05",
    status: {
      current_status: "Shipping Line",
      possible_status: ["Warehousing", "Fleet Forwarders", "Shipping Line"],
    },
    importer: {
      name: "Jane Smith",
      jobTitle: "Supply Chain Analyst",
      role: "Manager",
      phone_number: "+987654321",
      email: "alicejohnson@xyz.com",
    },
    name: "CMAU7351982",
    id: "7351982",
  },
  {
    customs_clearance: {
      name: "David Smith",
      jobTitle: "Marketing Specialist",
      role: "Coordinator",
      phone_number: "+212 1234567",
      email: "davidsmith@xyz.com",
    },
    phone_number: "+212 2023344",
    shippingline_key_contact: "shipping-line3@shippingline.com",
    timeline: {
      startdate: "2023-12-08",
      enddate: "2023-12-15",
    },

    document_status: {
      current_status: "Canceled",
      possible_status: ["In Progress", "Done", "Stuck", "Canceled"],
    },
    priority: {
      current_priority: "High",
      possible_priority: ["High", "Medium", "Low"],
    },
    estimate_start_time: "2023-12-08",
    status: {
      current_status: "Fleet Forwarders",
      possible_status: ["Warehousing", "Fleet Forwarders", "Shipping Line"],
    },
    importer: {
      name: "Sarah Brown",
      jobTitle: "Logistics Coordinator",
      role: "Coordinator",
      phone_number: "+11 1223344",
      email: "davidmiller@xyz.com",
    },
    name: "HPLU6247319",
    id: "6247319",
  },
  {
    customs_clearance: {
      name: "Emily White",
      jobTitle: "Graphic Designer",
      role: "Designer",
      phone_number: "+99 8877665",
      email: "emilywhite@xyz.com",
    },
    phone_number: "+20 10504020",
    shippingline_key_contact: "shipping-line4@shippingline.com",
    timeline: {
      startdate: "2023-12-03",
      enddate: "2023-12-10",
    },
    document_status: {
      current_status: "Stuck",
      possible_status: ["In Progress", "Done", "Stuck", "Canceled"],
    },
    priority: {
      current_priority: "Low",
      possible_priority: ["High", "Medium", "Low"],
    },
    estimate_start_time: "2023-12-03",
    status: {
      current_status: "Warehousing",
      possible_status: ["Warehousing", "Fleet Forwarders", "Shipping Line"],
    },
    importer: {
      name: "Emma White",
      jobTitle: "Operations Manager",
      role: "Supervisor",
      phone_number: "+2010504020",
      email: "chrisanderson@xyz.com",
    },
    name: "OOCL8901245",
    id: "8901245",
  },
  {
    customs_clearance: {
      name: "Michael Turner",
      jobTitle: "Financial Analyst",
      role: "Analyst",
      phone_number: "+112233445",
      email: "michaelturner@xyz.com",
    },
    phone_number: "+49 57084213",
    timeline: {
      startdate: "2023-11-7",
      enddate: "2023-12-20",
    },
    shippingline_key_contact: "shipping-line5@shippingline.com",
    document_status: {
      current_status: "In Progress",
      possible_status: ["In Progress", "Done", "Stuck", "Canceled"],
    },
    priority: {
      current_priority: "Medium",
      possible_priority: ["High", "Medium", "Low"],
    },
    estimate_start_time: "2023-12-12",
    status: {
      current_status: "Shipping Line",
      possible_status: ["Warehousing", "Fleet Forwarders", "Shipping Line"],
    },
    importer: {
      name: "Olivia Taylor",
      jobTitle: "Warehouse Supervisor",
      role: "Supervisor",
      phone_number: "+77 7888999",
      email: "ryancarter@xyz.com",
    },
    name: "NYKU4321567",
    id: "4321567",
  },
  {
    customs_clearance: {
      name: "Alice Smith",
      jobTitle: "Customs Broker",
      role: "Assistant",
      phone_number: "+123456789",
      email: "alicesmith@dummy.com",
    },
    phone_number: "+971 5551234",
    shippingline_key_contact: "shipping-line1@shippingline.com",
    timeline: {
      startdate: "2023-12-01",
      enddate: "2023-12-08",
    },
    document_status: {
      current_status: "In Progress",
      possible_status: ["In Progress", "Done", "Stuck", "Canceled"],
    },
    priority: {
      current_priority: "Medium",
      possible_priority: ["High", "Medium", "Low"],
    },
    estimate_start_time: "2023-12-01",
    status: {
      current_status: "Warehousing",
      possible_status: ["Warehousing", "Fleet Forwarders", "Shipping Line"],
    },
    importer: {
      name: "Bob Johnson",
      jobTitle: "Logistics Coordinator",
      role: "Admin",
      phone_number: "+971 5555678",
      email: "bobjohnson@dummy.com",
    },
    name: "OOCL8901245",
    id: "5285725",
  },
  {
    customs_clearance: {
      name: "Eva Davis",
      jobTitle: "Customs Agent",
      role: "Assistant",
      phone_number: "+987654321",
      email: "evadavis@dummy.com",
    },
    phone_number: "+971 5554321",
    shippingline_key_contact: "shipping-line2@shippingline.com",
    timeline: {
      startdate: "2023-12-02",
      enddate: "2023-12-09",
    },
    document_status: {
      current_status: "Done",
      possible_status: ["In Progress", "Done", "Stuck", "Canceled"],
    },
    priority: {
      current_priority: "High",
      possible_priority: ["High", "Medium", "Low"],
    },
    estimate_start_time: "2023-12-02",
    status: {
      current_status: "Fleet Forwarders",
      possible_status: ["Warehousing", "Fleet Forwarders", "Shipping Line"],
    },
    importer: {
      name: "Charlie Brown",
      jobTitle: "Supply Chain Manager",
      role: "Admin",
      phone_number: "+971 5558765",
      email: "charliebrown@dummy.com",
    },
    name: "NYKU4321567",
    id: "5285726",
  },
  {
    customs_clearance: {
      name: "Grace Miller",
      jobTitle: "Customs Specialist",
      role: "Assistant",
      phone_number: "+1122334455",
      email: "gracemiller@dummy.com",
    },
    phone_number: "+971 5555555",
    shippingline_key_contact: "shipping-line3@shippingline.com",
    timeline: {
      startdate: "2023-09-03",
      enddate: "2024-5-10",
    },
    document_status: {
      current_status: "Stuck",
      possible_status: ["In Progress", "Done", "Stuck", "Canceled"],
    },
    priority: {
      current_priority: "Low",
      possible_priority: ["High", "Medium", "Low"],
    },
    estimate_start_time: "2023-12-03",
    status: {
      current_status: "Shipping Line",
      possible_status: ["Warehousing", "Fleet Forwarders", "Shipping Line"],
    },
    importer: {
      name: "David White",
      jobTitle: "Operations Manager",
      role: "Admin",
      phone_number: "+971 5551111",
      email: "davidwhite@dummy.com",
    },
    name: "MSCU5285727",
    id: "5285727",
  },
  {
    customs_clearance: {
      name: "Helen Wilson",
      jobTitle: "Customs Coordinator",
      role: "Assistant",
      phone_number: "+9988776655",
      email: "helenwilson@dummy.com",
    },
    phone_number: "+971 5556666",
    shippingline_key_contact: "shipping-line4@shippingline.com",
    timeline: {
      startdate: "2023-02-04",
      enddate: "2024-12-11",
    },
    document_status: {
      current_status: "Canceled",
      possible_status: ["In Progress", "Done", "Stuck", "Canceled"],
    },
    priority: {
      current_priority: "High",
      possible_priority: ["High", "Medium", "Low"],
    },
    estimate_start_time: "2023-12-04",
    status: {
      current_status: "Warehousing",
      possible_status: ["Warehousing", "Fleet Forwarders", "Shipping Line"],
    },
    importer: {
      name: "Ivan Johnson",
      jobTitle: "Logistics Specialist",
      role: "Admin",
      phone_number: "+971 5552222",
      email: "ivanjohnson@dummy.com",
    },
    name: "MSCU5285728",
    id: "5285728",
  },
  {
    customs_clearance: {
      name: "Julia Brown",
      jobTitle: "Customs Administrator",
      role: "Assistant",
      phone_number: "+1122334455",
      email: "juliabrown@dummy.com",
    },
    phone_number: "+971 5557777",
    shippingline_key_contact: "shipping-line5@shippingline.com",
    timeline: {
      startdate: "2023-6-05",
      enddate: "2023-12-12",
    },
    document_status: {
      current_status: "In Progress",
      possible_status: ["In Progress", "Done", "Stuck", "Canceled"],
    },
    priority: {
      current_priority: "Medium",
      possible_priority: ["High", "Medium", "Low"],
    },
    estimate_start_time: "2023-12-05",
    status: {
      current_status: "Fleet Forwarders",
      possible_status: ["Warehousing", "Fleet Forwarders", "Shipping Line"],
    },
    importer: {
      name: "Kevin Davis",
      jobTitle: "Supply Chain Coordinator",
      role: "Admin",
      phone_number: "+971 5553333",
      email: "kevindavis@dummy.com",
    },
    name: "MSCU5285729",
    id: "5285729",
  },
  {
    customs_clearance: {
      name: "Linda Wilson",
      jobTitle: "Customs Officer",
      role: "Assistant",
      phone_number: "+9988776655",
      email: "lindawilson@dummy.com",
    },
    phone_number: "+971 5558888",
    shippingline_key_contact: "shipping-line6@shippingline.com",
    timeline: {
      startdate: "2023-12-06",
      enddate: "2025-12-13",
    },
    document_status: {
      current_status: "Done",
      possible_status: ["In Progress", "Done", "Stuck", "Canceled"],
    },
    priority: {
      current_priority: "Low",
      possible_priority: ["High", "Medium", "Low"],
    },
    estimate_start_time: "2023-12-06",
    status: {
      current_status: "Shipping Line",
      possible_status: ["Warehousing", "Fleet Forwarders", "Shipping Line"],
    },
    importer: {
      name: "Mary Johnson",
      jobTitle: "Logistics Officer",
      role: "Admin",
      phone_number: "+971 5554444",
      email: "maryjohnson@dummy.com",
    },
    name: "MSCU5285730",
    id: "5285730",
  },
  {
    customs_clearance: {
      name: "Nathan Davis",
      jobTitle: "Customs Specialist",
      role: "Assistant",
      phone_number: "+1122334455",
      email: "nathandavis@dummy.com",
    },
    phone_number: "+971 5559999",
    shippingline_key_contact: "shipping-line7@shippingline.com",
    timeline: {
      startdate: "2023-12-07",
      enddate: "2024-12-14",
    },
    document_status: {
      current_status: "Stuck",
      possible_status: ["In Progress", "Done", "Stuck", "Canceled"],
    },
    priority: {
      current_priority: "High",
      possible_priority: ["High", "Medium", "Low"],
    },
    estimate_start_time: "2023-12-07",
    status: {
      current_status: "Warehousing",
      possible_status: ["Warehousing", "Fleet Forwarders", "Shipping Line"],
    },
    importer: {
      name: "Olivia Brown",
      jobTitle: "Supply Chain Specialist",
      role: "Admin",
      phone_number: "+971 5555555",
      email: "oliviabrown@dummy.com",
    },
    name: "MSCU5285731",
    id: "5285731",
  },
  {
    customs_clearance: {
      name: "Peter Wilson",
      jobTitle: "Customs Administrator",
      role: "Assistant",
      phone_number: "+9988776655",
      email: "peterwilson@dummy.com",
    },
    phone_number: "+971 5550000",
    shippingline_key_contact: "shipping-line8@shippingline.com",
    timeline: {
      startdate: "2023-12-08",
      enddate: "2023-12-15",
    },
    document_status: {
      current_status: "Canceled",
      possible_status: ["In Progress", "Done", "Stuck", "Canceled"],
    },
    priority: {
      current_priority: "Medium",
      possible_priority: ["High", "Medium", "Low"],
    },
    estimate_start_time: "2023-12-08",
    status: {
      current_status: "Fleet Forwarders",
      possible_status: ["Warehousing", "Fleet Forwarders", "Shipping Line"],
    },
    importer: {
      name: "Quincy Davis",
      jobTitle: "Logistics Administrator",
      role: "Admin",
      phone_number: "+971 5556666",
      email: "quincydavis@dummy.com",
    },
    name: "MSCU5285732",
    id: "5285732",
  },
  {
    customs_clearance: {
      name: "Rachel Miller",
      jobTitle: "Customs Coordinator",
      role: "Assistant",
      phone_number: "+1122334455",
      email: "rachelmiller@dummy.com",
    },
    phone_number: "+971 5551234",
    shippingline_key_contact: "shipping-line9@shippingline.com",
    timeline: {
      startdate: "2023-12-30",
      enddate: "2024-1-16",
    },
    document_status: {
      current_status: "In Progress",
      possible_status: ["In Progress", "Done", "Stuck", "Canceled"],
    },
    priority: {
      current_priority: "Low",
      possible_priority: ["High", "Medium", "Low"],
    },
    estimate_start_time: "2023-12-09",
    status: {
      current_status: "Warehousing",
      possible_status: ["Warehousing", "Fleet Forwarders", "Shipping Line"],
    },
    importer: {
      name: "Sam Johnson",
      jobTitle: "Supply Chain Officer",
      role: "Admin",
      phone_number: "+971 5554321",
      email: "samjohnson@dummy.com",
    },
    name: "MSCU5285733",
    id: "5285733",
  },
];

const DummyUpdatesData = [
  {
    containerName: "MSCU5285725",
    updates: [
      {
        user: "John Doe",
        message: "Container loaded onto vessel for shipment.",
        date: "2023-12-10 12:00:00",
        replies: [
          {
            user: "Jane Smith",
            reply: "Great! When is the estimated arrival?",
            date: "2023-12-10 12:00:00",
            seenCount: 2,
          },
          {
            user: "David Smith",
            reply: "Thanks for the update!",
            date: "2023-12-10 12:00:00",
            seenCount: 1,
          },
        ],
        seenCount: 3,
      },
      {
        user: "Sameh Elsayed",
        message: "Container reached port successfully.",
        date: "2023-12-10 12:00:00",
        replies: [
          {
            user: "Fathy Gaafer",
            reply: "Any customs clearance issues?",
            date: "2023-12-10 12:00:00",
            seenCount: 2,
          },
        ],
        seenCount: 2,
      },
    ],
  },
  {
    containerName: "CMAU7351982",
    updates: [
      {
        user: "Sarah Brown",
        message: "Container departed from origin port.",
        date: "2023-12-10 12:00:00",
        replies: [
          {
            user: "Sameh Elsayed",
            reply: "Safe travels! Let me know when it arrives.",
            date: "2023-12-10 12:00:00",
            seenCount: 2,
          },
        ],
        seenCount: 2,
      },
      {
        user: "Sameh Sayed",
        message: "Customs clearance completed for CMAU7351982.",
        date: "2023-12-10 12:00:00",
        replies: [
          {
            user: "Ramy Agieb",
            reply: "That's good news! Thanks for the update.",
            date: "2023-12-10 12:00:00",
            seenCount: 1,
          },
        ],
        seenCount: 1,
      },
    ],
  },
  {
    containerName: "HPLU6247319",
    updates: [
      {
        user: "Chris Anderson",
        message: "Delayed departure for HPLU6247319 due to weather conditions.",
        date: "2023-12-10 12:00:00",
        replies: [
          {
            user: "Awad Elsayed",
            reply: "Stay safe! Keep me posted on any changes.",
            seenCount: 2,
          },
        ],
        seenCount: 2,
      },
      {
        user: "Peter Magdy",
        message: "New departure time confirmed for HPLU6247319.",
        date: "2023-12-10 12:00:00",
        replies: [
          {
            user: "Ramy Agieb",
            reply:
              "Thanks for the update. Hopefully, smooth sailing from here.",
            date: "2023-12-10 12:00:00",
            seenCount: 1,
          },
        ],
        seenCount: 1,
      },
    ],
  },
  {
    containerName: "OOCL8901245",
    updates: [
      {
        user: "Ramy Agieb",
        message: "OOCL8901245 arrived at destination port.",
        date: "2023-12-10 12:00:00",
        replies: [
          {
            user: "Bishoy Magdy",
            reply: "Excellent! Any issues during the journey?",
            date: "2023-12-10 12:00:00",
            seenCount: 2,
          },
        ],
        seenCount: 2,
      },
      {
        user: "Bishoy Magdy",
        message: "Container OOCL8901245 cleared customs at destination.",
        date: "2023-12-10 12:00:00",
        replies: [
          {
            user: "Peter Magdy",
            reply: "Good to hear! Thanks for the update.",
            date: "2023-12-10 12:00:00",
            seenCount: 1,
          },
        ],
        seenCount: 1,
      },
    ],
  },
  {
    containerName: "NYKU4321567",
    updates: [
      {
        user: "Peter Magdy",
        message:
          "Loading cargo into NYKU4321567 for the next leg of the journey.",
        date: "2023-12-10 12:00:00",
        replies: [
          {
            user: "Sameh Elsayed",
            reply: "Is everything on schedule?",
            date: "2023-12-10 12:00:00",
            seenCount: 2,
          },
        ],
        seenCount: 2,
      },
      {
        user: "Masoud Matar",
        message: "NYKU4321567 departed from transshipment port.",
        date: "2023-12-10 12:00:00",
        replies: [
          {
            user: "Mo Salah",
            reply: "Thanks for the update! Safe travels.",
            date: "2023-12-10 12:00:00",
            seenCount: 1,
          },
        ],
        seenCount: 1,
      },
    ],
  },
  // NEW
  {
    containerName: "OOCL8901245",
    updates: [
      {
        user: "Ramy Agieb",
        message: "OOCL8901245 arrived at destination port.",
        date: "2023-12-10 12:00:00",
        replies: [
          {
            user: "Bishoy Magdy",
            reply: "Excellent! Any issues during the journey?",
            date: "2023-12-10 12:00:00",
            seenCount: 2,
          },
        ],
        seenCount: 2,
      },
      {
        user: "Bishoy Magdy",
        message: "Container OOCL8901245 cleared customs at destination.",
        date: "2023-12-10 12:00:00",
        replies: [
          {
            user: "Peter Magdy",
            reply: "Good to hear! Thanks for the update.",
            date: "2023-12-10 12:00:00",
            seenCount: 1,
          },
        ],
        seenCount: 1,
      },
    ],
  },
  {
    containerName: "NYKU4321567",
    updates: [
      {
        user: "Ramy Agieb",
        message: "NYKU4321567 arrived at destination port.",
        date: "2023-12-10 12:00:00",
        replies: [
          {
            user: "Bishoy Magdy",
            reply: "Excellent! Any issues during the journey?",
            date: "2023-12-10 12:00:00",
            seenCount: 2,
          },
        ],
        seenCount: 2,
      },
      {
        user: "Bishoy Magdy",
        message: "Container NYKU4321567 cleared customs at destination.",
        date: "2023-12-10 12:00:00",
        replies: [
          {
            user: "Peter Magdy",
            reply: "Good to hear! Thanks for the update.",
            date: "2023-12-10 12:00:00",
            seenCount: 1,
          },
        ],
        seenCount: 1,
      },
    ],
  },
  {
    containerName: "MSCU5285727",
    updates: [
      {
        user: "Ramy Agieb",
        message: "MSCU5285727 arrived at destination port.",
        date: "2023-12-10 12:00:00",
        replies: [
          {
            user: "Bishoy Magdy",
            reply: "Excellent! Any issues during the journey?",
            date: "2023-12-10 12:00:00",
            seenCount: 2,
          },
        ],
        seenCount: 2,
      },
      {
        user: "Bishoy Magdy",
        message: "Container MSCU5285727 cleared customs at destination.",
        date: "2023-12-10 12:00:00",
        replies: [
          {
            user: "Peter Magdy",
            reply: "Good to hear! Thanks for the update.",
            date: "2023-12-10 12:00:00",
            seenCount: 1,
          },
        ],
        seenCount: 1,
      },
    ],
  },
  {
    containerName: "MSCU5285728",
    updates: [
      {
        user: "Ramy Agieb",
        message: "MSCU5285728 arrived at destination port.",
        date: "2023-12-10 12:00:00",
        replies: [
          {
            user: "Bishoy Magdy",
            reply: "Excellent! Any issues during the journey?",
            date: "2023-12-10 12:00:00",
            seenCount: 2,
          },
        ],
        seenCount: 2,
      },
      {
        user: "Bishoy Magdy",
        message: "Container MSCU5285728 cleared customs at destination.",
        date: "2023-12-10 12:00:00",
        replies: [
          {
            user: "Peter Magdy",
            reply: "Good to hear! Thanks for the update.",
            date: "2023-12-10 12:00:00",
            seenCount: 1,
          },
        ],
        seenCount: 1,
      },
    ],
  },
  {
    containerName: "MSCU5285730",
    updates: [
      {
        user: "Ramy Agieb",
        message: "MSCU5285730 arrived at destination port.",
        date: "2023-12-10 12:00:00",
        replies: [
          {
            user: "Bishoy Magdy",
            reply: "Excellent! Any issues during the journey?",
            date: "2023-12-10 12:00:00",
            seenCount: 2,
          },
        ],
        seenCount: 2,
      },
      {
        user: "Bishoy Magdy",
        message: "Container MSCU5285730 cleared customs at destination.",
        date: "2023-12-10 12:00:00",
        replies: [
          {
            user: "Peter Magdy",
            reply: "Good to hear! Thanks for the update.",
            date: "2023-12-10 12:00:00",
            seenCount: 1,
          },
        ],
        seenCount: 1,
      },
    ],
  },
  {
    containerName: "MSCU5285732",
    updates: [
      {
        user: "Ramy Agieb",
        message: "MSCU5285732 arrived at destination port.",
        date: "2023-12-10 12:00:00",
        replies: [
          {
            user: "Bishoy Magdy",
            reply: "Excellent! Any issues during the journey?",
            date: "2023-12-10 12:00:00",
            seenCount: 2,
          },
        ],
        seenCount: 2,
      },
      {
        user: "Bishoy Magdy",
        message: "Container MSCU5285732 cleared customs at destination.",
        date: "2023-12-10 12:00:00",
        replies: [
          {
            user: "Peter Magdy",
            reply: "Good to hear! Thanks for the update.",
            date: "2023-12-10 12:00:00",
            seenCount: 1,
          },
        ],
        seenCount: 1,
      },
    ],
  },
  {
    containerName: "MSCU5285729",
    updates: [
      {
        user: "Ramy Agieb",
        message: "MSCU5285729 arrived at destination port.",
        date: "2023-12-10 12:00:00",
        replies: [
          {
            user: "Bishoy Magdy",
            reply: "Excellent! Any issues during the journey?",
            date: "2023-12-10 12:00:00",
            seenCount: 2,
          },
        ],
        seenCount: 2,
      },
      {
        user: "Bishoy Magdy",
        message: "Container MSCU5285729 cleared customs at destination.",
        date: "2023-12-10 12:00:00",
        replies: [
          {
            user: "Peter Magdy",
            reply: "Good to hear! Thanks for the update.",
            date: "2023-12-10 12:00:00",
            seenCount: 1,
          },
        ],
        seenCount: 1,
      },
    ],
  },
  {
    containerName: "OOCL8901245",
    updates: [
      {
        user: "Ramy Agieb",
        message: "OOCL8901245 arrived at destination port.",
        date: "2023-12-10 12:00:00",
        replies: [
          {
            user: "Bishoy Magdy",
            reply: "Excellent! Any issues during the journey?",
            date: "2023-12-10 12:00:00",
            seenCount: 2,
          },
        ],
        seenCount: 2,
      },
      {
        user: "Bishoy Magdy",
        message: "Container OOCL8901245 cleared customs at destination.",
        date: "2023-12-10 12:00:00",
        replies: [
          {
            user: "Peter Magdy",
            reply: "Good to hear! Thanks for the update.",
            date: "2023-12-10 12:00:00",
            seenCount: 1,
          },
        ],
        seenCount: 1,
      },
    ],
  },
  {
    containerName: "OOCL8901245",
    updates: [
      {
        user: "Ramy Agieb",
        message: "OOCL8901245 arrived at destination port.",
        date: "2023-12-10 12:00:00",
        replies: [
          {
            user: "Bishoy Magdy",
            reply: "Excellent! Any issues during the journey?",
            date: "2023-12-10 12:00:00",
            seenCount: 2,
          },
        ],
        seenCount: 2,
      },
      {
        user: "Bishoy Magdy",
        message: "Container OOCL8901245 cleared customs at destination.",
        date: "2023-12-10 12:00:00",
        replies: [
          {
            user: "Peter Magdy",
            reply: "Good to hear! Thanks for the update.",
            date: "2023-12-10 12:00:00",
            seenCount: 1,
          },
        ],
        seenCount: 1,
      },
    ],
  },
  {
    containerName: "OOCL8901245",
    updates: [
      {
        user: "Ramy Agieb",
        message: "OOCL8901245 arrived at destination port.",
        date: "2023-12-10 12:00:00",
        replies: [
          {
            user: "Bishoy Magdy",
            reply: "Excellent! Any issues during the journey?",
            date: "2023-12-10 12:00:00",
            seenCount: 2,
          },
        ],
        seenCount: 2,
      },
      {
        user: "Bishoy Magdy",
        message: "Container OOCL8901245 cleared customs at destination.",
        date: "2023-12-10 12:00:00",
        replies: [
          {
            user: "Peter Magdy",
            reply: "Good to hear! Thanks for the update.",
            date: "2023-12-10 12:00:00",
            seenCount: 1,
          },
        ],
        seenCount: 1,
      },
    ],
  },
];

const DummyFilesData = [
  {
    ContainerName: "MSCU5285725",
    files: [
      {
        fileName: "Container.pdf",
        fileType: "pdf",
        date: "2023-12-10 12:00:00",
        location: {
          uri: require("../../../assets/DummyFiles/MSCU5285725/Container.pdf"),
        },
      },
      {
        fileName: "Customs.xls",
        fileType: "xls",
        date: "2023-12-10 12:00:00",
        location: {
          uri: require("../../../assets/DummyFiles/MSCU5285725/Customs.xls"),
        },
      },
      {
        fileName: "Freight Invoices.jpg",
        fileType: "jpg",
        date: "2023-12-10 12:00:00",
        location: {
          uri: require("../../../assets/DummyFiles/MSCU5285725/Freight Invoices.jpg"),
        },
      },
    ],
  },
  {
    ContainerName: "CMAU7351982",
    files: [
      {
        fileName: "Container.pdf",
        fileType: "pdf",
        date: "2023-12-10 12:00:00",
        location: {
          uri: "../../../assets/DummyFiles/CMAU7351982/Container.pdf",
        },
      },
      {
        fileName: "Customs.xls",
        fileType: "xls",
        date: "2023-12-10 12:00:00",
        location: { uri: "../../../assets/DummyFiles/CMAU7351982/Customs.xls" },
      },
      {
        fileName: "Freight Invoices.jpg",
        fileType: "jpg",
        date: "2023-12-10 12:00:00",
        location: {
          uri: "../../../assets/DummyFiles/CMAU7351982/Freight Invoices.jpg",
        },
      },
    ],
  },
  {
    ContainerName: "HPLU6247319",
    files: [
      {
        fileName: "Container.pdf",
        fileType: "pdf",
        date: "2023-12-10 12:00:00",
        location: {
          uri: "../../../assets/DummyFiles/HPLU6247319/Container.pdf",
        },
      },
      {
        fileName: "Customs.xls",
        fileType: "xls",
        date: "2023-12-10 12:00:00",
        location: { uri: "../../../assets/DummyFiles/HPLU6247319/Customs.xls" },
      },
      {
        fileName: "Freight Invoices.jpg",
        fileType: "jpg",
        date: "2023-12-10 12:00:00",
        location: {
          uri: "../../../assets/DummyFiles/HPLU6247319/Freight Invoices.jpg",
        },
      },
    ],
  },
  {
    ContainerName: "OOCL8901245",
    files: [
      {
        fileName: "Container.pdf",
        fileType: "pdf",
        date: "2023-12-10 12:00:00",
        location: {
          uri: "../../../assets/DummyFiles/OOCL8901245/Container.pdf",
        },
      },
      {
        fileName: "Customs.xls",
        fileType: "xls",
        date: "2023-12-10 12:00:00",
        location: { uri: "../../../assets/DummyFiles/OOCL8901245/Customs.xls" },
      },
      {
        fileName: "Freight Invoices.jpg",
        fileType: "jpg",
        date: "2023-12-10 12:00:00",
        location: {
          uri: "../../../assets/DummyFiles/OOCL8901245/Freight Invoices.jpg",
        },
      },
    ],
  },
  {
    ContainerName: "NYKU4321567",
    files: [
      {
        fileName: "Container.pdf",
        fileType: "pdf",
        date: "2023-12-10 12:00:00",
        location: {
          uri: "../../../assets/DummyFiles/NYKU4321567/Container.pdf",
        },
      },
      {
        fileName: "Customs.xls",
        fileType: "xls",
        date: "2023-12-10 12:00:00",
        location: { uri: "../../../assets/DummyFiles/NYKU4321567/Customs.xls" },
      },
      {
        fileName: "Freight Invoices.jpg",
        fileType: "jpg",
        date: "2023-12-10 12:00:00",
        location: {
          uri: "../../../assets/DummyFiles/NYKU4321567/Freight Invoices.jpg",
        },
      },
    ],
  },
  {
    ContainerName: "OOCL8901245",
    files: [
      {
        fileName: "Container.pdf",
        fileType: "pdf",
        date: "2023-12-10 12:00:00",
        location: {
          uri: "../../../assets/DummyFiles/NYKU4321567/Container.pdf",
        },
      },
      {
        fileName: "Customs.xls",
        fileType: "xls",
        date: "2023-12-10 12:00:00",
        location: { uri: "../../../assets/DummyFiles/NYKU4321567/Customs.xls" },
      },
      {
        fileName: "Freight Invoices.jpg",
        fileType: "jpg",
        date: "2023-12-10 12:00:00",
        location: {
          uri: "../../../assets/DummyFiles/NYKU4321567/Freight Invoices.jpg",
        },
      },
    ],
  },
  {
    ContainerName: "NYKU4321567",
    files: [
      {
        fileName: "Container.pdf",
        fileType: "pdf",
        date: "2023-12-10 12:00:00",
        location: {
          uri: "../../../assets/DummyFiles/NYKU4321567/Container.pdf",
        },
      },
      {
        fileName: "Customs.xls",
        fileType: "xls",
        date: "2023-12-10 12:00:00",
        location: { uri: "../../../assets/DummyFiles/NYKU4321567/Customs.xls" },
      },
      {
        fileName: "Freight Invoices.jpg",
        fileType: "jpg",
        date: "2023-12-10 12:00:00",
        location: {
          uri: "../../../assets/DummyFiles/NYKU4321567/Freight Invoices.jpg",
        },
      },
    ],
  },
  {
    ContainerName: "MSCU5285727",
    files: [
      {
        fileName: "Container.pdf",
        fileType: "pdf",
        date: "2023-12-10 12:00:00",
        location: {
          uri: "../../../assets/DummyFiles/NYKU4321567/Container.pdf",
        },
      },
      {
        fileName: "Customs.xls",
        fileType: "xls",
        date: "2023-12-10 12:00:00",
        location: { uri: "../../../assets/DummyFiles/NYKU4321567/Customs.xls" },
      },
      {
        fileName: "Freight Invoices.jpg",
        fileType: "jpg",
        date: "2023-12-10 12:00:00",
        location: {
          uri: "../../../assets/DummyFiles/NYKU4321567/Freight Invoices.jpg",
        },
      },
    ],
  },
  {
    ContainerName: "MSCU5285728",
    files: [
      {
        fileName: "Container.pdf",
        fileType: "pdf",
        date: "2023-12-10 12:00:00",
        location: {
          uri: "../../../assets/DummyFiles/NYKU4321567/Container.pdf",
        },
      },
      {
        fileName: "Customs.xls",
        fileType: "xls",
        date: "2023-12-10 12:00:00",
        location: { uri: "../../../assets/DummyFiles/NYKU4321567/Customs.xls" },
      },
      {
        fileName: "Freight Invoices.jpg",
        fileType: "jpg",
        date: "2023-12-10 12:00:00",
        location: {
          uri: "../../../assets/DummyFiles/NYKU4321567/Freight Invoices.jpg",
        },
      },
    ],
  },
  {
    ContainerName: "MSCU5285730",
    files: [
      {
        fileName: "Container.pdf",
        fileType: "pdf",
        date: "2023-12-10 12:00:00",
        location: {
          uri: "../../../assets/DummyFiles/NYKU4321567/Container.pdf",
        },
      },
      {
        fileName: "Customs.xls",
        fileType: "xls",
        date: "2023-12-10 12:00:00",
        location: { uri: "../../../assets/DummyFiles/NYKU4321567/Customs.xls" },
      },
      {
        fileName: "Freight Invoices.jpg",
        fileType: "jpg",
        date: "2023-12-10 12:00:00",
        location: {
          uri: "../../../assets/DummyFiles/NYKU4321567/Freight Invoices.jpg",
        },
      },
    ],
  },
  {
    ContainerName: "MSCU5285731",
    files: [
      {
        fileName: "Container.pdf",
        fileType: "pdf",
        date: "2023-12-10 12:00:00",
        location: {
          uri: "../../../assets/DummyFiles/NYKU4321567/Container.pdf",
        },
      },
      {
        fileName: "Customs.xls",
        fileType: "xls",
        date: "2023-12-10 12:00:00",
        location: { uri: "../../../assets/DummyFiles/NYKU4321567/Customs.xls" },
      },
      {
        fileName: "Freight Invoices.jpg",
        fileType: "jpg",
        date: "2023-12-10 12:00:00",
        location: {
          uri: "../../../assets/DummyFiles/NYKU4321567/Freight Invoices.jpg",
        },
      },
    ],
  },
  {
    ContainerName: "MSCU5285729",
    files: [
      {
        fileName: "Container.pdf",
        fileType: "pdf",
        date: "2023-12-10 12:00:00",
        location: {
          uri: "../../../assets/DummyFiles/NYKU4321567/Container.pdf",
        },
      },
      {
        fileName: "Customs.xls",
        fileType: "xls",
        date: "2023-12-10 12:00:00",
        location: { uri: "../../../assets/DummyFiles/NYKU4321567/Customs.xls" },
      },
      {
        fileName: "Freight Invoices.jpg",
        fileType: "jpg",
        date: "2023-12-10 12:00:00",
        location: {
          uri: "../../../assets/DummyFiles/NYKU4321567/Freight Invoices.jpg",
        },
      },
    ],
  },
  {
    ContainerName: "NYKU4321567",
    files: [
      {
        fileName: "Container.pdf",
        fileType: "pdf",
        date: "2023-12-10 12:00:00",
        location: {
          uri: "../../../assets/DummyFiles/NYKU4321567/Container.pdf",
        },
      },
      {
        fileName: "Customs.xls",
        fileType: "xls",
        date: "2023-12-10 12:00:00",
        location: { uri: "../../../assets/DummyFiles/NYKU4321567/Customs.xls" },
      },
      {
        fileName: "Freight Invoices.jpg",
        fileType: "jpg",
        date: "2023-12-10 12:00:00",
        location: {
          uri: "../../../assets/DummyFiles/NYKU4321567/Freight Invoices.jpg",
        },
      },
    ],
  },
  {
    ContainerName: "NYKU4321567",
    files: [
      {
        fileName: "Container.pdf",
        fileType: "pdf",
        date: "2023-12-10 12:00:00",
        location: {
          uri: "../../../assets/DummyFiles/NYKU4321567/Container.pdf",
        },
      },
      {
        fileName: "Customs.xls",
        fileType: "xls",
        date: "2023-12-10 12:00:00",
        location: { uri: "../../../assets/DummyFiles/NYKU4321567/Customs.xls" },
      },
      {
        fileName: "Freight Invoices.jpg",
        fileType: "jpg",
        date: "2023-12-10 12:00:00",
        location: {
          uri: "../../../assets/DummyFiles/NYKU4321567/Freight Invoices.jpg",
        },
      },
    ],
  },
  {
    ContainerName: "MSCU5285729",
    files: [
      {
        fileName: "Container.pdf",
        fileType: "pdf",
        date: "2023-12-10 12:00:00",
        location: {
          uri: "../../../assets/DummyFiles/NYKU4321567/Container.pdf",
        },
      },
      {
        fileName: "Customs.xls",
        fileType: "xls",
        date: "2023-12-10 12:00:00",
        location: { uri: "../../../assets/DummyFiles/NYKU4321567/Customs.xls" },
      },
      {
        fileName: "Freight Invoices.jpg",
        fileType: "jpg",
        date: "2023-12-10 12:00:00",
        location: {
          uri: "../../../assets/DummyFiles/NYKU4321567/Freight Invoices.jpg",
        },
      },
    ],
  },
];

function Dashboard() {
  const location = useLocation();
  let initialActiveTab = 1;

  const [TabChange, setTabChange] = useState(false);

  function handleTabClick() {
    setTabChange(true);
  }

  useEffect(() => {
    setTabChange(false);
  }, [TabChange]);

  const deviceCtx = useContext(DevicesContext);
  const themeCtx = useContext(ThemeContext);

  const [markers, setMarkers] = useState([]);
  const navigate = useNavigate();
  const [cycollects, setCycollects] = useState([]);
  const [cytags, setCytags] = useState([]);
  const [selectedCytags, setSelectedCytags] = useState([]);
  const [alarms, setAlarms] = useState([]);
  const [alarmsData, setAlarmsData] = useState([]);

  const [alarmTypes, setAlarmTypes] = useState([]);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [alarmType, setAlarmType] = useState();
  const [entity, setEntity] = useState();
  const [notified, setNotified] = useState();
  const [severity, setSeverity] = useState();
  const [status, setStatus] = useState();
  const [alarmTablePage, setAlarmTablePage] = useState(0);
  const [deviceTablePage, setDeviceTablePage] = useState(0);
  const [tagsTablePage, setTagsTablePage] = useState(0);

  const [isHovered, setIsHovered] = useState(0);

  const [isLoadingAlarms, setIsLoadingAlarms] = useState(true);

  const refAlarm = useRef(null);
  const refDevices = useRef(null);
  const refTags = useRef(null);

  useEffect(() => {
    deviceCtx.getDevicesCall();
  }, []);

  const setupAlarms = (alarms) => {
    const alarmss = [];
    alarms.forEach((alarm) => {
      const newObj = {};
      const entity = deviceCtx.getDeviceById(alarm.entity_id, "");
      if (entity) {
        newObj.severity = alarm.alarm_settings.severity;
        newObj.entity = entity ? entity.name : "";
        if (alarm.alarm_settings.configurations.telemetry_type) {
          newObj.type = alarm.alarm_settings.alarm_type.name;
        } else {
          newObj.type = alarm.alarm_settings.alarm_type.name;
        }
        if (alarm.alarm_settings.configurations.max) {
          newObj.max = alarm.alarm_settings.configurations.max;
        } else {
          newObj.max = "-";
        }
        if (alarm.alarm_settings.configurations.min) {
          newObj.min = alarm.alarm_settings.configurations.min;
        } else {
          newObj.min = "-";
        }
        let details = "";
        Object.keys(alarm.details).forEach((key) => {
          details += `${key} : ${alarm.details[key]}`;
        });
        newObj.details = details;
        newObj.start_time = alarm.start_time;
        newObj.updated_time = alarm.updated_time;
        if (alarm.current_status === ALARM_STATUS.ACTIVE) {
          newObj.Acknowledge = { alarm: alarm.id, callback: getAlarmsCall };
        } else {
          newObj.Acknowledge = { actionPerformed: true };
        }
        if (alarm.current_status !== ALARM_STATUS.CLEARED) {
          newObj.Clear = { alarm: alarm.id, callback: getAlarmsCall };
        } else {
          newObj.Clear = { actionPerformed: true };
        }
        newObj.current_status = alarm.current_status;
        delete newObj.alarm_settings;
        if (details.split(" : ")[0] !== "Undetected tag") {
          alarmss.push(newObj);
        }
      }
    });
    return alarmss;
  };

  const getAlarmsCall = (filters) => {
    getAlarms(filters).then((res) => {
      setIsLoadingAlarms(false);
      setAlarms(setupAlarms(res.data));
      setAlarmsData(
        setupAlarms(res.data).map((oneAlarm) => {
          delete oneAlarm.Acknowledge;
          return oneAlarm;
        })
      );
    });
  };

  const handleFilter = (reset) => {
    const filters = {};
    if (reset) {
      getAlarmsCall(filters);
    } else {
      if (startDate !== "" && startDate !== undefined && startDate !== "-1") {
        const startDateISO = formatLocalToISOUTC(startDate);
        filters.from_date = startDateISO;
      }
      if (endDate !== "" && endDate !== undefined && endDate !== "-1") {
        const endDateISO = formatLocalToISOUTC(endDate);
        filters.to_date = endDateISO;
      }
      if (notified !== "" && notified !== undefined && notified !== "-1") {
        filters.notified = notified;
      }
      if (alarmType !== "" && alarmType !== undefined && alarmType !== "-1") {
        filters.alarm_type = alarmType;
      }
      if (severity !== "" && severity !== undefined && severity !== "-1") {
        filters.severity = severity;
      }
      if (status !== "" && status !== undefined && status !== "-1") {
        filters.status = status;
      }
      if (entity !== "" && entity !== undefined && entity !== "-1") {
        filters.entity_id = entity;
      }
      getAlarmsCall(filters);
    }
  };
  const redirectToCytag = (row) => {
    return navigate(
      "device/Cytag/" +
        row.find((col) => col.column.Header === "NAME").value +
        "/" +
        row.find((col) => col.column.Header === "ID").value
    );
  };

  const redirectToTag = (tag) => {
    console.log("REDIRECTING TO DEVICE", tag);
    return navigate("device/Cytag/" + tag.name + "/" + tag.id);
  };

  const redirectToDevice = (row) => {
    return navigate(
      "device/" +
        row.find((col) => col.column.Header === "NAME").value +
        "/" +
        row.find((col) => col.column.Header === "IMEI").value
    );
  };

  const redirectToLock = (lock) => {
    return navigate("device/" + lock.name + "/" + lock.imei);
  };
  useEffect(() => {
    setMarkers(
      cycollects.map((dev) => {
        return { position: { lat: dev.lat, lng: dev.lng }, name: dev.name };
      })
    );
  }, [cycollects]);
  const [statToday, setStatToday] = useState();
  const [statYesterday, setStatYesterday] = useState();
  const [statLastWeek, setStatLastWeek] = useState();
  const [statLastMonth, setStatLastMonth] = useState();

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  const lastWeek = new Date();
  lastWeek.setDate(today.getDate() - 7);
  const lastMonth = new Date();
  lastMonth.setMonth(today.getMonth() - 1);
  useEffect(() => {
    if (deviceCtx && deviceCtx.devicesObj.devices) {
      setCycollects(
        deviceCtx.devicesObj.devices.cycollector
          ? deviceCtx.devicesObj.devices.cycollector
          : []
      );
      setCytags(
        deviceCtx.devicesObj.devices.cytag
          ? deviceCtx.devicesObj.devices.cytag
          : []
      );

      getAlarmsCall({});
    }
    if (deviceCtx) {
      setStatToday(deviceCtx.statToday);
      setStatYesterday(deviceCtx.statYesterday);
      setStatLastWeek(deviceCtx.statLastWeek);
      setStatLastMonth(deviceCtx.statLastMonth);
    }
    getAlarmsTypes().then((res) => {
      setAlarmTypes(res.data);
    });
  }, [deviceCtx]);

  const prepareExportDataAlarms = (data) => {
    data.map((alarm) => {
      delete alarm.Acknowledge;
      delete alarm.description;
      delete alarm.id;
      Object.keys(alarm).forEach((key) => {
        if (alarm[key]) {
          alarm[key] = String(alarm[key]) + "";
        } else {
          delete alarm[key];
        }
      });
      return alarm;
    });
    return data;
  };
  const prepareExportDataCyLock = (data) => {
    const keys = extractUniqueKeys(data);
    data.map((dev) => {
      let cytagStr = "";
      dev.cytags &&
        typeof dev.cytags !== "string" &&
        dev.cytags.forEach((cytag) => {
          cytagStr += cytag.name + ",";
        });
      dev.cytags = cytagStr;
      delete dev.roles;
      keys.forEach((key) => {
        if (key !== "roles" && key !== "lat" && key !== "lng") {
          if (dev[key]) {
            dev[key] = String(dev[key]) + "";
          } else {
            dev[key] = "-";
          }
        }
      });
      return dev;
    });
    return data;
  };
  const prepareExportDataCyTag = (data) => {
    data.map((dev) => {
      delete dev.roles;
      const keys = Object.keys(dev);
      keys.forEach((key) => {
        if (dev[key]) {
          dev[key] = String(dev[key]) + "";
        } else {
          delete dev[key];
        }
      });
      return dev;
    });
    return data;
  };
  const handleClickToScroll = (refto) => {
    console.log("SCROLLING", refto);
    refto.current?.scrollIntoView({ behavior: "smooth" });
  };

  function handleTabHover(index) {
    setIsHovered(index);
  }

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  function toggleDrawer() {
    setIsDrawerOpen(!isDrawerOpen);
  }

  return (
    <>
      <Box>
        <Tabs
          isFitted
          variant="soft-rounded"
          m={{ base: 0, md: 5 }}
          my={{ base: 3, md: 5 }}
          defaultIndex={initialActiveTab}
          onChange={handleTabClick}
        >
          <Center>
            <TabList
              h={"75px"}
              minW={"100%"}
              maxW={"100%"}
              gap={{ base: 0, md: 15 }}
            >
              <Tab
                mx={2}
                _selected={{
                  color: "text.primary",
                  bg: "primary.80",
                  border: "3px solid",
                  borderColor: "action.80",
                  boxShadow: "0px 0px 10px 0px #aaaa",
                }}
                _hover={{ bg: "action.80" }}
              >
                <Box>
                  <Circle size={{ base: "60px", md: "70px" }}>
                    <AlarmIcon
                      margin={"auto"}
                      p={{ base: 0, md: "15%" }}
                      color={
                        themeCtx.theme.colors &&
                        themeCtx.theme.colors.text.primary
                      }
                    />
                  </Circle>
                </Box>

                <Text fontSize="2xl" display={{ base: "none", md: "block" }}>
                  {" "}
                  {alarms && alarms.length} Alarms
                </Text>
              </Tab>

              <Tab
                mx={2}
                _selected={{
                  color: "text.primary",
                  bg: "primary.80",
                  border: "3px solid",
                  borderColor: "action.80",
                  boxShadow: "0px 0px 10px 0px #aaaa",
                }}
                _hover={{ bg: "action.80" }}
              >
                <Box>
                  <Circle size={{ base: "60px", md: "50px" }}>
                    <CyLockIcon
                      margin={"auto"}
                      p={"auto"}
                      color={
                        themeCtx.theme.colors &&
                        themeCtx.theme.colors.text.primary
                      }
                    />
                  </Circle>
                </Box>
                <Text fontSize="2xl" display={{ base: "none", md: "block" }}>
                  {" "}
                  {cycollects && cycollects.length} CyLocks
                </Text>
              </Tab>

              <Tab
                mx={2}
                _selected={{
                  color: "text.primary",
                  bg: "primary.80",
                  border: "3px solid",
                  borderColor: "action.80",
                  boxShadow: "0px 0px 10px 0px #aaaa",
                }}
                _hover={{ bg: "action.80" }}
              >
                <Box>
                  <Circle size={{ base: "30px", md: "30px" }}>
                    <GiCargoCrate
                      size={{ base: "5px", md: "5px" }}
                      margin={"auto"}
                      p={"auto"}
                      color={
                        themeCtx.theme.colors &&
                        themeCtx.theme.colors.text.primary
                      }
                    />
                  </Circle>
                </Box>
                <Text
                  mx={2}
                  fontSize="2xl"
                  display={{ base: "none", md: "block" }}
                >
                  ConColab
                </Text>
              </Tab>

              <Tab
                mx={2}
                _selected={{
                  color: "text.primary",
                  bg: "primary.80",
                  border: "3px solid",
                  borderColor: "action.80",
                  boxShadow: "0px 0px 10px 0px #aaaa",
                }}
                _hover={{ bg: "action.80" }}
              >
                <Box>
                  <Circle size={{ base: "60px", md: "80px" }}>
                    <CyTagIcon
                      margin={"auto"}
                      p={{ base: 0, md: "15%" }}
                      color={
                        themeCtx.theme.colors &&
                        themeCtx.theme.colors.text.primary
                      }
                    />
                  </Circle>
                </Box>
                <Text fontSize="2xl" display={{ base: "none", md: "block" }}>
                  {" "}
                  {cytags && cytags.length} Cytags
                </Text>
              </Tab>
            </TabList>
          </Center>

          {/* Map */}
          <Box
            w={"100%"}
            h={"100%"}
            borderRadius={"25px"}
            mb={2}
            mt={5}
            p={2}
            bg={"primary.80"}
          >
            <GeneralAccordion
              title={
                <Box
                  p={"1%"}
                  borderRadius={"25px"}
                  w={"100%"}
                  h={"90%"}
                  gap={1}
                  as={Flex}
                  alignItems={"center"}
                  bg={"primary.80"}
                >
                  <Icon
                    as={FaMapMarkedAlt}
                    fontSize="2xl"
                    color={"action.80"}
                    mx={2}
                  />
                  <Heading w={"100%"} color={"text.primary"} fontSize={"2xl"}>
                    CyLocks Map
                  </Heading>
                </Box>
              }
              children={<Map minH={"450px"} trips={false} markers={markers} />}
            ></GeneralAccordion>
          </Box>

          {/* ALARMS */}
          <TabPanels>
            <TabPanel p={"0px"} mb={5}>
              <Box mb={5} ref={refAlarm} mt={5}>
                <AlarmTable
                  hiddenCols={[
                    "id",
                    "current_status",
                    "description",
                    "resolved_time",
                    "notified",
                    "entity_id",
                  ]}
                  pageNumber={alarmTablePage}
                  setPageNumber={setAlarmTablePage}
                  extractFn={extractAlarmHeaders}
                  title={"Alarms"}
                  icon={
                    <AlarmIcon
                      boxSize={"35px"}
                      margin={"auto"}
                      color={
                        themeCtx.theme.colors &&
                        themeCtx.theme.colors.action[80]
                      }
                    />
                  }
                  data={[...alarms]}
                  isLoading={isLoadingAlarms}
                ></AlarmTable>
              </Box>
            </TabPanel>

            {/* CYLOCKS */}
            <TabPanel p={"0px"}>
              <div ref={refDevices}>
                {/* DEVICES TABLE */}
                <Box mt={5}>
                  <CardTable
                    toggleDrawer={toggleDrawer}
                    isLoading={deviceCtx.isLoadingCylocks}
                    pageNumber={deviceTablePage}
                    setPageNumber={setDeviceTablePage}
                    redirectToDevice={redirectToLock}
                    cytagsBtn={
                      cytags.length !== 0
                        ? (rows) =>
                            setSelectedCytags(
                              cytags.filter(
                                (cytag) => cytag.cycollector_id === rows
                              )
                            )
                        : null
                    }
                    data={
                      hasPermission(PERMISSIONS.GET_DEVICE_DETAILS) &&
                      hasPermission(PERMISSIONS.GET_DEVICE) &&
                      hasPermission(PERMISSIONS.GET_ALL_DEVICES) &&
                      hasPermission(PERMISSIONS.GET_DEVICES_REQUESTS) &&
                      hasPermission(PERMISSIONS.GET_DEVICES_TELEMETRY) &&
                      hasPermission(PERMISSIONS.GET_DEVICES_SPATIAL)
                        ? cycollects.map((lock) => {
                            return { ...lock, imei: lock.id };
                          })
                        : []
                    }
                    hiddenCols={[
                      "pccw_iccid",
                      "satcom_iccid",
                      "cytags",
                      "latest_values",
                      "id",
                      "lat",
                      "lng",
                    ]}
                    title={"CyLocks"}
                    icon={
                      <CyLockIcon
                        boxSize={"50px"}
                        margin={"auto"}
                        color={
                          themeCtx.theme.colors &&
                          themeCtx.theme.colors.action[80]
                        }
                      />
                    }
                  >
                    <Box as={Flex} gap={1}>
                      <PdfExport
                        title={"CyLocks"}
                        data={prepareExportDataCyLock([...cycollects])}
                      />
                      <ExcelExport
                        title={"CyLocks"}
                        data={prepareExportDataCyLock([...cycollects])}
                      />
                    </Box>
                  </CardTable>
                </Box>

                {/* Connected Cytags */}
                <Box mt={5}>
                  {cytags.length !== 0 && (
                    <>
                      <Drawer
                        isOpen={isDrawerOpen}
                        placement="bottom"
                        onClose={toggleDrawer}
                      >
                        <DrawerOverlay />
                        <DrawerContent
                          bg={"primary.80"}
                          color={"text.primary"}
                          borderRadius={"10px"}
                        >
                          <DrawerCloseButton />
                          <DrawerBody>
                            <TagContainer
                              redirectToDevice={redirectToTag}
                              data={selectedCytags}
                              title={"Connected CyTags"}
                              icon={
                                <CyTagIcon
                                  boxSize={"50px"}
                                  margin={"auto"}
                                  color={
                                    themeCtx.theme.colors &&
                                    themeCtx.theme.colors.action[80]
                                  }
                                />
                              }
                            />
                          </DrawerBody>
                        </DrawerContent>
                      </Drawer>
                    </>
                  )}
                </Box>

                {/* Stop */}
              </div>
            </TabPanel>

            {/* CONTAINERS */}
            <TabPanel p={"0px"}>
              <Box mt={5} borderRadius={"25px"} bg={"primary.80"}>
                {/* Table with following columns:
                Container ID (Sting)
                Container Name (Sting)
                Importer (Avatar) - Chosen from a list of avatars
                Status (String in banner) - Chosen from a list of statuses
                Estimate time to start shiping
                Priority (String in banner) - Chosen from a list of priorities [High, Medium, Low]
                Document Status (String in banner) - Chosen from a list of document statuses
                Shippingline key contact (String) 
                Timeline (Date) - Chosen from date picker
                Phone number (String) 
                Customs clearance (Avatar) - Chosen from a list of customs clearance Avatar
                 */}
                {/* Each row resembles a container */}
                {/* Use dummy data using regular Table components*/}
                <Box p={3}>
                  <ContainerTable
                    title={"ConColab"}
                    data={DummyContainerData}
                    updates={DummyUpdatesData}
                    files={DummyFilesData}
                    icon={
                      <GiCargoCrate
                        size={"40px"}
                        margin={"auto"}
                        p={"auto"}
                        color={
                          themeCtx.theme.colors &&
                          themeCtx.theme.colors.action[80]
                        }
                      />
                    }
                  ></ContainerTable>
                </Box>
              </Box>
            </TabPanel>

            {/* CYTAGS */}
            <TabPanel p={"0px"}>
              <Box mt={5}>
                {cytags.length !== 0 && (
                  <Box mt={1} ref={refTags}>
                    <TagContainer
                      TabChange={TabChange}
                      isLoading={deviceCtx.isLoadingCytags}
                      pageNumber={tagsTablePage}
                      setPageNumber={setTagsTablePage}
                      redirectToDevice={redirectToTag}
                      data={cytags}
                      title={"CyTags"}
                      icon={
                        <CyTagIcon
                          boxSize={"50px"}
                          margin={"auto"}
                          color={
                            themeCtx.theme.colors &&
                            themeCtx.theme.colors.action[80]
                          }
                        />
                      }
                    >
                      <Box as={Flex} gap={1}>
                        <PdfExport
                          title={"CyTags"}
                          data={prepareExportDataCyTag([...cytags])}
                        />
                        <ExcelExport
                          title={"CyTags"}
                          data={prepareExportDataCyTag([...cytags])}
                        />
                      </Box>
                    </TagContainer>
                  </Box>
                )}
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </>
  );
}

export default Dashboard;
