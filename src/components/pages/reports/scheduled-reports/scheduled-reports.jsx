import React, { useEffect, useState } from 'react';
import ComplexTable from '../../../ui/table/complex-table';
import { GrScheduleNew } from 'react-icons/gr';
import { getScheduledReports } from '../../../../api/reports';
import { flattenObject } from '../../../../helpers/array-map';

function ScheduledReports () {
    const [scheduledReports, setScheduledReports] = useState([]);
    useEffect(() => {
        getScheduledReports().then((res) => {
            setScheduledReports(res.data.scheduled_reports.map((report) => flattenObject(report)));
        });
    }, []);
    return (
        <ComplexTable
            data={scheduledReports}
            icon={<GrScheduleNew boxSize={'30px'} color={'action.100'} />}
            title={'Scheduled Reports'}
        />
    );
}

export default ScheduledReports;
