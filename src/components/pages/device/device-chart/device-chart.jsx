import { Box, Flex, Heading, Tag } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import HistoryPicker from '../../../ui/history-picker/history-picker';
import LineChart from '../../../ui/charts/line-chart/line-chart';
import PieChart from '../../../ui/charts/pie-chart/pie-chart';
import StyledSelect from '../../../ui/styled-select/styled-select';
import { formatDate } from '../../../../helpers/array-map';
import { getMessagesWithType } from '../../../../api/devices';
import SpinnerLoader from '../../../ui/loader/spinner-loader';

function DeviceChart ({ startType = 'Cylock Battery', mt, mb, id, pie = false, options, setStartDate, ops, startDate, endDate, setEndDate }) {
    const [chartTele, setChartTele] = useState();
    const [chartDataFiltered, setChartDataFiltered] = useState({ id: 'all', name: 'all', data: [] });
    const [opsFiltered, setOpsFiltered] = useState({
        chart: {
            id: 'area-datetime',
            type: 'area',
            height: 350,
            zoom: {
                autoScaleYaxis: true
            }
        },
        stroke: {
            curve: 'smooth'
        },
        dataLabels: {
            enabled: false
        },
        markers: {
            size: 0,
            style: 'hollow'
        },
        xaxis: {
            type: 'datetime',
            min: new Date().getTime(),
            tickAmount: 6
        },
        tooltip: {
            enabled: true,
            enabledOnSeries: undefined,
            shared: true,
            followCursor: true,
            intersect: false,
            inverseOrder: false,
            custom: undefined,
            fillSeriesColor: true,
            style: {
                fontSize: '12px',
                fontFamily: undefined
            },
            onDatasetHover: {
                highlightDataSeries: false
            },
            x: {
                show: true,
                format: 'dd MMM yyyy, HH:mm',
                formatter: undefined
            },
            y: {
                formatter: undefined,
                title: {
                    formatter: (seriesName) => seriesName
                }
            }
        },
        grid: {
            show: false
        },
        legend: {
            show: true
        },
        fill: {
            type: 'gradient',
            shade: 'dark',
            shadeIntensity: 0.5,
            gradientToColors: undefined,
            inverseColors: true,
            opacityFrom: 0.5,
            opacityTo: 1,
            stops: [0, 50, 100],
            colorStops: []
        }
    });
    const [loading, setLoading] = useState(false);
    const getLastTeleByType = (type) => {
        setLoading(true);
        getMessagesWithType(type + '', '50', id, startDate, endDate).then((res) => {
            const filtered = res.data.data[type + ''].reverse();
            let chartName = '';
            let chartType;
            if (options) {
                chartType = options.find((op) => op.value === parseInt(chartTele));
                if (chartType) {
                    chartName = chartType.label;
                }
            }
            setChartDataFiltered({
                id: chartTele,
                name: chartName,
                data: filtered.map((dat) => [new Date(dat.message_time), parseFloat(dat.message_value)])
            });
            const dataSeries = filtered.map((point) => {
                return formatDate(point.message_time);
            });
            setOpsFiltered(Object.assign(
                opsFiltered,
                {
                    stroke: {
                        curve: chartType.graph_type === 'binary' ? 'stepline' : 'smooth'
                    },
                    xaxis: {
                        categories: dataSeries,
                        type: 'datetime',
                        min: new Date(filtered.length !== 0 && filtered[0].message_time + 'Z').getTime(),
                        tickAmount: 6,
                        labels: {
                            show: true,
                            datetimeFormatter: {
                                year: 'yyyy',
                                month: 'MMM \'yy',
                                day: 'dd MMM',
                                hour: 'HH:mm'
                            }
                        }
                    },
                    tooltip: {
                        enabled: true,
                        enabledOnSeries: undefined,
                        shared: true,
                        followCursor: true,
                        intersect: false,
                        inverseOrder: false,
                        custom: undefined,
                        fillSeriesColor: true,
                        style: {
                            fontSize: '12px',
                            fontFamily: undefined
                        },
                        onDatasetHover: {
                            highlightDataSeries: false
                        },
                        x: {
                            show: true,
                            format: 'dd MMM yyyy, HH:mm'
                        }
                    }
                }));
            setLoading(false);
        }).catch(err => {
            console.error(err);
            setLoading(false);
        });
    };
    useEffect(() => {
        if (chartTele) {
            getLastTeleByType(chartTele);
        }
    }, [chartTele]);

    useEffect(() => {
        if (options.length !== 0 && !chartTele) {
            console.log(options);
            setChartTele(options.find((op) => op.label === startType).value);
        }
    }, [options]);

    const getLabel = () => {
        if (startDate && endDate) {
            return `${formatDate(startDate)} - ${formatDate(endDate)}`;
        } else {
            return 'Last 50 Messages';
        }
    };
    const getChartTitle = () => {
        const type = options.find((title) => title.value === parseInt(chartTele));
        if (type) {
            return type.label;
        } else {
            return '';
        }
    };
    return (
        <Box
            w="100%"
            h={'100%'}
            mb={mb}
            mt={mt}
            p={1}
            bg={'primary.80'}
            borderRadius={'5px'}
        >
            <Box justifyContent={'space-between'} alignItems={'baseline'} gap={2} as={Flex}>
                <Heading fontSize={'2xl'} m={4} color={'text.primary'}>
                    {chartTele && chartTele !== '-1' ? getChartTitle()[0].toUpperCase() + getChartTitle().slice(1, getChartTitle().length) : ''} {' Chart'}
                </Heading>
                <Box fontSize={'md'} mb={2} color={'text.primary'}>
                    <Tag fontSize={'md'} color={'text.primary'} bg={'action.100'}>{getLabel()}</Tag>
                </Box>
                <Box as={Flex} gap={1}>
                    <HistoryPicker
                        selectStartDate={(date) => setStartDate(date)}
                        handleClick={() => getLastTeleByType(chartTele)}
                        selectEndDate={(date) => setEndDate(date)}
                        disabled={!startDate || !endDate}
                        startDate={startDate}
                        endDate={endDate}
                    />
                    <StyledSelect options={options} value={chartTele} onchange={setChartTele} />
                </Box>
            </Box>
            <Box
                display={'flex'}
                justifyContent={'flex-start'}
                flexWrap={'wrap'}
                bg={'primary.80'}
                w={'100%'}
            >
                <SpinnerLoader loading={loading}
                    body={
                        <Box mt={4} w={'100%'}>
                            { pie
                                ? (<PieChart ops={opsFiltered} data={chartDataFiltered} />)
                                : (<LineChart data={[chartDataFiltered]} ops={opsFiltered} />)
                            }
                        </Box>
                    }
                />
            </Box>
        </Box>
    );
}

export default DeviceChart;
