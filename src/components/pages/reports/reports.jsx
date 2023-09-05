import React, { useContext, useState, useEffect } from "react";
import {
  Box,
  Text,
  Flex,
  Center,
  Button,
  useDisclosure,
  Collapse,
  ButtonGroup,
  Heading,
  Input,
} from "@chakra-ui/react";
import StyledSelect from "../../ui/styled-select/styled-select";
import { ThemeContext } from "../../../context/theme";
import PieChart from "../../ui/charts/pie-chart/pie-chart";
import LineChart from "../../ui/charts/line-chart/line-chart";
import ComplexTable from "../../ui/table/complex-table";
import { Icon, SunIcon } from "@chakra-ui/icons";
import { TbReport } from "react-icons/tb";
import {
  createScheduledReports,
  getData,
  getElectricityData,
  getOptions,
  getScheduledReportsOptions,
} from "../../../api/reports";
import HistoryPicker from "../../ui/history-picker/history-picker";
import { getTotalSeconds } from "../../../helpers/time-operations";
import { showsuccess } from "../../../helpers/toast-emitter";
import validator from "@rjsf/validator-ajv8";
import Form from "@rjsf/chakra-ui";
import { getReportsUiSchema } from "../../../data/reports";
import { getFormsWidgets } from "../../../data/alarms";
import { useNavigate } from "react-router";
import {
  extractContainerHeaders,
  extractUniqueKeys,
  flattenObject,
} from "../../../helpers/array-map";
import PdfExport from "../../ui/pdf-export/pdf-export";
import ExcelExport from "../../ui/excel-export/excel-export";
import { DevicesContext } from "../../../context/devices";
import SpinnerLoader from "../../ui/loader/spinner-loader";
import ObjectFieldTemplate from "../../form-widgets/custom-object";

function Reports() {
  const { theme } = useContext(ThemeContext);
  const deviceCtx = useContext(DevicesContext);
  const [devices, setDevices] = useState([]);
  const [containers, setContainers] = useState([]);
  const [project, setProject] = useState("cylocks");
  const [containerChoices, setContainerChoices] = useState([]);
  const [lockReportPage, setLockReportPage] = useState(0);
  const [cypowerReportPage, setCypowerReportPage] = useState(0);

  useEffect(() => {
    if (deviceCtx) {
      if (deviceCtx.devicesObj.devices) {
        const devices = [];
        if (deviceCtx.devicesObj.devices.cycollector) {
          devices.push(...deviceCtx.devicesObj.devices.cycollector);
        }
        if (deviceCtx.devicesObj.devices.cytag) {
          devices.push(...deviceCtx.devicesObj.devices.cytag);
        }
        setDevices(devices);
      }
      if (deviceCtx.containers) {
        setContainers(deviceCtx.containers);
        setContainerChoices([
          { label: "all", value: "all" },
          ...Array.from(
            new Set(
              deviceCtx.containers.map((container) => {
                return JSON.stringify({
                  label: container.name,
                  value: container.name,
                });
              })
            )
          ).map((ob) => JSON.parse(ob)),
        ]);
      }
    }
  }, [deviceCtx]);
  useEffect(() => {
    deviceCtx.getContainersCall();
  }, []);

  const { isOpen, onToggle } = useDisclosure();

  const formRef = React.useRef(null);

  const [lineChartOptions, setLineChartOptions] = useState({
    colors: theme.colors
      ? [theme.colors.chart["80"], theme.colors.chart["40"]]
      : [],
    tooltip: {
      theme: "dark",
    },
    grid: {
      show: false,
    },
    legend: {
      show: false,
    },
    height: "500px",
    yaxis: {
      labels: {
        style: {
          colors: theme.colors ? theme.colors.text.primary : "",
          fontSize: "14px",
          fontWeight: "500",
        },
      },
    },
    xaxis: {
      categories: [],
      labels: {
        style: {
          colors: theme.colors ? theme.colors.text.primary : "",
          fontSize: "14px",
          fontWeight: "500",
        },
      },
    },
  });
  const [lineChartData, setLineChartData] = useState([]);
  const [pieChartOptions, setPieChartOptions] = useState({
    colors: theme.colors
      ? [
          theme.colors.chart[100],
          theme.colors.chart[80],
          theme.colors.chart[40],
        ]
      : [],
    states: {
      hover: {
        filter: {
          type: "none",
        },
      },
    },
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: true,
    },
    hover: { mode: null },
    plotOptions: {
      donut: {
        expandOnClick: true,
        donut: {
          labels: {
            show: true,
          },
        },
      },
    },
    fill: {
      colors: theme.colors
        ? [
            theme.colors.chart[100],
            theme.colors.chart[80],
            theme.colors.chart[60],
            theme.colors.chart[40],
            theme.colors.chart[20],
          ]
        : [],
    },
    tooltip: {
      enabled: true,
    },
  });

  const [pieChartData, setPieChartData] = useState([]);

  const rooms = [];
  const [actions, setActions] = useState([]);
  const [allActions, setAllActions] = useState([]);

  const [reportsOptions, setReportsOptions] = useState([]);
  const [entity, setEntity] = useState([]);
  let entityId;
  const [actionId, setActionId] = useState([]);
  const [fields, setFields] = useState([]);
  const [fieldsChoices, setFieldsChoices] = useState([]);
  const [fieldsquery, setFieldsquery] = useState({});

  useEffect(() => {
    const choices = [];
    const allActions = [];
    const result = actionId.find((field) => field.value === "all");
    if (result) {
      actions.forEach((action) => {
        allActions.push({ ...action, label: action.name, value: action.name });
      });
    }
    (result ? allActions : actionId).forEach((action) => {
      if (action.allowedFields) {
        choices.push(...action.allowedFields);
      }
    });
    setFieldsChoices(Array.from(new Set(choices)));
  }, [actionId, actions]);

  const [formSchema, setFormSchema] = useState({});

  useEffect(() => {
    getOptions().then((res) => {
      setReportsOptions(res.data.entity.map((ent) => ent.name));
      // setUsers(res.data.users);
      // setRooms(res.data.room);
      // setBands(res.data.band);
      // setActions(res.data.entity_actions_type.cycollector);
      setAllActions(res.data.entity_actions_type);
    });
    getScheduledReportsOptions().then((res) =>
      setFormSchema(res.data.scheduled_report_options)
    );
    const updatedFields = [];
    fields.forEach((field) => {
      if (fieldsChoices.includes(field.value)) {
        updatedFields.push(field);
      } else {
        delete fieldsquery[field.value];
      }
    });
    setFields(updatedFields);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fieldsChoices, fieldsquery]);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [elecTableData, setElecTableData] = useState([]);

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const handleSelectData = () => {
    setPieChartData([]);
    setLineChartData([]);
    setLoading(true);
    console.log("pick action: ", actionId);
    console.log("fields: ", fields);
    console.log("fields query: ", fieldsquery);
    console.log("field choices: ", fieldsChoices);
    console.log("actions: ", actions);
    console.log("actionId: ", actionId);
    const allActions = actionId.find((field) => field.value === "all");
    getData(
      entity,
      (allActions ? [] : actionId).map((e) => e.value).toString(),
      startDate ? startDate + "" : startDate,
      endDate + "",
      entityId,
      fieldsquery
    )
      .then((res) => {
        setTableData(res.data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
    if (entity === "room") {
      getElectricityData(startDate + "", endDate + "", entityId).then((res) => {
        const data = res.data.data;
        showsuccess("Successfully fetched electricity reports");
        setElecTableData(data.Summary);
        if (entityId !== "all") {
          setPieChartOptions({
            ...pieChartOptions,
            labels: [
              "Frontdesk hours",
              "Hours in Period",
              "Occupancy hours",
              "Power-on while checked-in",
              "Room service hours",
              "Total power-on hours",
            ],
          });
          setPieChartData([
            getTotalSeconds(data.Summary[0]["Frontdesk hours"]),
            getTotalSeconds(data.Summary[0]["Hours in Period"]),
            getTotalSeconds(data.Summary[0]["Occupancy hours"]),
            getTotalSeconds(data.Summary[0]["Power-on while checked-in"]),
            getTotalSeconds(data.Summary[0]["Room service hours"]),
            getTotalSeconds(data.Summary[0]["Total power-on hours"]),
          ]);
        } else {
          setLineChartOptions({
            ...lineChartOptions,
            xaxis: {
              ...lineChartOptions.xaxis,
              categories: [
                ...data.Summary.map((room) => {
                  return room["Room number"];
                }),
              ],
            },
          });
          setLineChartData([
            {
              id: "0",
              name: "Frontdesk hours",
              data: [
                ...data.Summary.map((room) => {
                  return getTotalSeconds(room["Frontdesk hours"]);
                }),
              ],
            },
            {
              id: "1",
              name: "Hours in Period",
              data: [
                ...data.Summary.map((room) => {
                  return getTotalSeconds(room["Hours in Period"]);
                }),
              ],
            },
            {
              id: "2",
              name: "Occupancy hours",
              data: [
                ...data.Summary.map((room) => {
                  return getTotalSeconds(room["Occupancy hours"]);
                }),
              ],
            },
            {
              id: "3",
              name: "Power-on while checked-in",
              data: [
                ...data.Summary.map((room) => {
                  return getTotalSeconds(room["Power-on while checked-in"]);
                }),
              ],
            },
            {
              id: "4",
              name: "Room service hours",
              data: [
                ...data.Summary.map((room) => {
                  return getTotalSeconds(room["Room service hours"]);
                }),
              ],
            },
            {
              id: "5",
              name: "Total power-on hours",
              data: [
                ...data.Summary.map((room) => {
                  return getTotalSeconds(room["Total power-on hours"]);
                }),
              ],
            },
          ]);
        }
      });
    } else {
      setElecTableData([]);
    }
  };

  const setReportsScheduling = () => {
    let actions = '';
    if (actionId ) {
      let isAllSelected = actionId.find((field) => field.value === "all");
      if(!isAllSelected){
        actionId.forEach((action, index) => {
          actions = actions + action.value;
          if(index < actionId.length - 1){
            actions = actions + ',';
          }
        })
      }else {
        actions = null;
      }
    }
    createScheduledReports(
      Object.assign(formRef.current.state.formData, {
        scheduled_at: formRef.current.state.formData.scheduled_at.replace(
          "Z",
          ""
          ),
      }),
      entity,
      actions,
      fieldsquery
    ).then((res) => showsuccess("Successfully added scheduled reports"));
  };

  const setFiledQueryCall = (field, value, allValues) => {
    allValues.shift();
    const result = value.find((field) => field.value === "all");
    if (!result) {
      const fields = { ...fieldsquery };
      fields[field] = value.map((vl) => vl.value);
      setFieldsquery(fields);
    }
  };

  const setDataContainer = (val) => {
    if (val.find((v) => v.value === "all")) {
      const temp = [...containerChoices];
      temp.shift();
      val = temp;
      console.log(val);
    }
    setTableData(
      containers
        .filter((cont) => val.find((v) => v.value === cont.name))
        .map((con) => {
          return {
            ...con.details,
            container_name: con.name,
            device: `${con.device.name} : ${con.device.id}`,
          };
        })
    );
  };

  const prepareReportsForExport = (data) => {
    const keys = extractUniqueKeys(data);
    data.map((dev) => {
      keys.forEach((key) => {
        if (dev[key]) {
          dev[key] = String(dev[key]) + "";
        } else {
          dev[key] = "-";
        }
      });
      return dev;
    });
    //console.log({ data });
    return data;
  };

  const ContainersForm = () => {
    return (
      <>
        <Box w={"300px"} p={1}>
          <Text p={1} color={"text.primary"}>
            Choose Entity:
          </Text>
          <StyledSelect
            multi
            options={containerChoices}
            onchange={setDataContainer}
          />
        </Box>
      </>
    );
  };

  const titleDisplayed = (title) => {
    const titleSplitted = title.split("_");
    let titleToDisplay = "";
    titleSplitted.forEach((word) => {
      titleToDisplay += word.charAt(0).toUpperCase() + word.slice(1) + " ";
    });
    return titleToDisplay;
  };

  const CylockForm = () => {
    return (
      <>
        <>
          <Box w={"300px"} p={1}>
            <Text p={1} color={"text.primary"}>
              Choose Entity:
            </Text>
            <StyledSelect
              value={entity}
              onchange={(val) => {
                setEntity(val);
                const vals = [];
                vals.push(...allActions[val]);
                setActions(vals);
                setActionId([]);
                setFields([]);
                setFieldsquery({});
              }}
              options={reportsOptions.map((op) => {
                if (op === "cycollector") {
                  return { label: "cylock", value: "cycollector" };
                } else {
                  return { label: op, value: op };
                }
              })}
            />
          </Box>
          {entity.length !== 0 ? (
            <Box w={"300px"} p={1}>
              <Text p={1} color={"text.primary"}>
                Pick Action:
              </Text>
              <StyledSelect
                multi
                value={actionId}
                onchange={(val) => {
                  setActionId(val);

                  if (val.length === 0) {
                    setFields([]);
                  }
                }}
                options={[
                  { label: "all", value: "all" },
                  ...actions.map((action) => {
                    return {
                      ...action,
                      label: action.name,
                      value: action.name,
                    };
                  }),
                ]}
              />
            </Box>
          ) : (
            ""
          )}
          {actionId.length !== 0 ? (
            <Box w={"300px"} p={1}>
              <Text p={1} color={"text.primary"}>
                Pick Field:
              </Text>
              <StyledSelect
                multi
                value={fields}
                onchange={(val) => {
                  setFields(val);
                  Object.keys(fieldsquery).forEach(function (key) {
                    const result = val.find((field) => field.value === key);
                    if (result === undefined) {
                      delete fieldsquery[key];
                    }
                  });
                }}
                options={fieldsChoices.map((field) => {
                  return { label: field, value: field };
                })}
              />
            </Box>
          ) : (
            ""
          )}
          {fields.map((field, index) => {
            switch (field.value) {
              case "device_id":
                const options = devices
                  ? [
                      { label: "all", value: "all" },
                      ...devices.map((dev) => {
                        return {
                          label: `${dev.name}:${dev.id}`,
                          value: dev.id,
                        };
                      }),
                    ]
                  : [];
                return (
                  <Box key={field.value} w={"300px"} p={1}>
                    <Text p={1} color={"text.primary"}>
                      {titleDisplayed(field.value)}:
                    </Text>
                    <StyledSelect
                      multi
                      options={options}
                      onchange={(val) =>
                        setFiledQueryCall(field.value, val, options)
                      }
                    />
                  </Box>
                );
              case "container_id":
                const options2 = containers
                  ? [
                      { label: "all", value: "all" },
                      ...containers.map((container) => {
                        return { label: container.name, value: container.name };
                      }),
                    ]
                  : [];
                return (
                  <Box key={field.value} w={"300px"} p={1}>
                    <Text p={1} color={"text.primary"}>
                      {titleDisplayed(field.value)}:
                    </Text>
                    <StyledSelect
                      multi
                      options={options2}
                      onchange={(val) =>
                        setFiledQueryCall(field.value, val, options2)
                      }
                    />
                  </Box>
                );
              case "cytag_id":
                const options3 = deviceCtx.devicesObj.devices.cytag
                  ? [
                      { label: "all", value: "all" },
                      ...deviceCtx.devicesObj.devices.cytag.map((dev) => {
                        return {
                          label: `${dev.name}:${dev.id}`,
                          value: dev.id,
                        };
                      }),
                    ]
                  : [];
                return (
                  <Box key={field.value} w={"300px"} p={1}>
                    <Text p={1} color={"text.primary"}>
                      {titleDisplayed(field.value)}:
                    </Text>
                    <StyledSelect
                      multi
                      options={options3}
                      onchange={(val) =>
                        setFiledQueryCall(field.value, val, options3)
                      }
                    />
                  </Box>
                );
              case "cylock_id":
                const options4 = deviceCtx.devicesObj.devices.cycollector
                  ? [
                      { label: "all", value: "all" },
                      ...deviceCtx.devicesObj.devices.cycollector.map((dev) => {
                        return {
                          label: `${dev.name}:${dev.id}`,
                          value: dev.id,
                        };
                      }),
                    ]
                  : [];
                return (
                  <Box key={field.value} w={"300px"} p={1}>
                    <Text p={1} color={"text.primary"}>
                      {titleDisplayed(field.value)}:
                    </Text>
                    <StyledSelect
                      multi
                      options={options4}
                      onchange={(val) =>
                        setFiledQueryCall(field.value, val, options4)
                      }
                    />
                  </Box>
                );
              default:
                return (
                  <Box key={field.value} w={"300px"} p={1}>
                    <Text p={1} color={"text.primary"}>
                      {field.value}:
                    </Text>
                    <Input
                      onChange={(e) =>
                        setFiledQueryCall(field.value, [
                          { value: e.target.value },
                        ])
                      }
                    />
                  </Box>
                );
            }
          })}
        </>
        <>
          <HistoryPicker
            selectStartDate={(date) => setStartDate(date)}
            selectEndDate={(date) => setEndDate(date)}
            disabled={!startDate || !endDate}
            endDate={endDate}
            startDate={startDate}
            showBtn={false}
          />
        </>
      </>
    );
  };

  return (
    <>
      {reportsOptions && (
        <Box
          alignItems={"start"}
          alignContent={"baseline"}
          borderRadius={"5px"}
          p={3}
          bg={"primary.80"}
          mt={2}
          as={Flex}
          w={"100%"}
          flexWrap={"wrap"}
        >
          <Box w={"200px"} p={1}>
            <Text p={1} color={"text.primary"}>
              Devices/Containers:
            </Text>
            <StyledSelect
              value={project}
              onchange={(val) => {setProject(val); setTableData([]); setEntity([]); setFields([]); setActions([]); setFieldsquery({}); setActionId([]); setAllActions([]);}}
              options={[
                { value: "cylocks", label: "CyLocks" },
                { value: "containers", label: "Containers" },
              ]}
            />
          </Box>
          {project === "cylocks" ? CylockForm() : ContainersForm()}

          <Center gap={3} mt={8} ml={2}>
            <ButtonGroup
              as={Flex}
              flexWrap={"wrap"}
              isAttached
              variant="outline"
            >
              <Button
                onClick={handleSelectData}
                color={"text.primary"}
                bg={"action.100"}
              >
                Show Data
              </Button>
              <Button
                onClick={onToggle}
                bg={"action.100"}
                color={"text.primary"}
              >
                Set Scheduling
              </Button>
              <Button
                onClick={() => navigate("/scheduled-reports")}
                bg={"action.100"}
                color={"text.primary"}
              >
                View Scheduled reports
              </Button>
            </ButtonGroup>
          </Center>
          <Box p={1} w={"100%"}>
            <Collapse in={isOpen} animateOpacity>
              <Heading fontSize={"2xl"} color={"text.primary"}>
                Schedule reports
              </Heading>
              <Box
                p={2}
                color="text.primary"
                mt="4"
                rounded="md"
                shadow="md"
                w={"100%"}
                h={"100%"}
              >
                <Form
                  focusOnFirstError
                  showErrorList={false}
                  onChange={() =>
                    console.log(
                      formRef.current && formRef.current.state.formData
                    )
                  }
                  ref={formRef}
                  formData={
                    formRef.current ? formRef.current.state.formData : {}
                  }
                  schema={formSchema}
                  validator={validator}
                  onSubmit={() => setReportsScheduling()}
                  uiSchema={getReportsUiSchema()}
                  widgets={getFormsWidgets()}
                  templates={{ ObjectFieldTemplate }}
                />
              </Box>
            </Collapse>
          </Box>
        </Box>
      )}
      <Box mt={2} as={Flex} w={"100%"} gap={2} flexWrap={"wrap"}>
        <SpinnerLoader
          loading={loading}
          body={
            <ComplexTable
              pageNumber={lockReportPage}
              setPageNumber={setLockReportPage}
              hiddenCols={["id", "label", "value"]}
              flatten={true}
              extractFn={extractContainerHeaders}
              data={tableData.map((datum) => flattenObject(datum))}
              title={"Audit Logs"}
              icon={
                <Icon as={TbReport} boxSize={"30px"} color={"action.100"} />
              }
            >
              <Box as={Flex} gap={1}>
                <PdfExport
                  title={"Audit logs"}
                  data={prepareReportsForExport(
                    tableData.map((datum) => flattenObject(datum))
                  )}
                />
                <ExcelExport
                  title={"Audit logs"}
                  data={tableData.map((datum) => flattenObject(datum))}
                />
              </Box>
            </ComplexTable>
          }
        />

        {entity === "room" && (
          <ComplexTable
            pageNumber={cypowerReportPage}
            setPageNumber={setCypowerReportPage}
            data={elecTableData}
            title={"Electricity Report"}
            icon={<SunIcon boxSize={"30px"} color={"action.100"} />}
          />
        )}
        {pieChartData.length !== 0 && (
          <Box
            minH={"500px"}
            minW={"100%"}
            p={1}
            borderRadius={"5px"}
            bg={"primary.80"}
          >
            <Text p={2} color={"text.primary"} fontSize={"lg"}>
              Room:{" "}
              {entity === "room" && rooms.length !== 0
                ? rooms.find((room) => room.id === entityId).room_no
                : ""}
            </Text>
            <PieChart ops={pieChartOptions} data={pieChartData} />
          </Box>
        )}
        {lineChartData.length !== 0 && (
          <Box
            minH={"500px"}
            minW={"100%"}
            p={1}
            borderRadius={"5px"}
            bg={"primary.80"}
          >
            <Text p={2} color={"text.primary"} fontSize={"lg"}>
              Power Consumption By Room
            </Text>
            <LineChart ops={lineChartOptions} data={lineChartData} />
          </Box>
        )}
      </Box>
    </>
  );
}
export default Reports;
