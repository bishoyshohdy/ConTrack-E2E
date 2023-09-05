import { Center } from '@chakra-ui/react';
import React from 'react';
import Chart from 'react-apexcharts';

function LineChart ({ ops, data }) {
    return (
        <>
            {
                data.length !== 0
                    ? (
                        <Chart
                            options={ops}
                            series={data}
                            type='area'
                            width='100%'
                            height='500px'
                        />
                    )
                    : (
                        <Center mt={10} color={'text.primary'}>There are no data to display</Center>
                    )
            }
        </>

    );
}

export default LineChart;
