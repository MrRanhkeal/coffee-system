import { Chart } from 'react-google-charts';
import { useEffect, useState } from 'react';
import { request } from '../../util/helper';

const months = [
    { key: 'Jan 2025', dataIndex: 'jan' },
    { key: 'Feb 2025', dataIndex: 'feb' },
    { key: 'Mar 2025', dataIndex: 'mar' },
    { key: 'Apr 2025', dataIndex: 'apr' },
    { key: 'May 2025', dataIndex: 'may' },
    { key: 'Jun 2025', dataIndex: 'jun' },
    { key: 'Jul 2025', dataIndex: 'jul' },
    { key: 'Aug 2025', dataIndex: 'aug' },
    { key: 'Sep 2025', dataIndex: 'sep' },
    { key: 'Oct 2025', dataIndex: 'oct' },
    { key: 'Nov 2025', dataIndex: 'nov' },
    { key: 'Dec 2025', dataIndex: 'dec' }
];

const parseCurrency = (value) => {
    if (typeof value === 'string') {
        return parseFloat(value.replace(/[^0-9.-]+/g, '')) || 0;
    }
    return value || 0;
};

export default function SaleSummaryPieChart() {
    const [saleSummaryByMonth, setSaleSummaryByMonth] = useState([{}]);

    useEffect(() => {
        async function getData() {
            const res = await request('report/get_sale_summary', 'get');
            if (res && res.sale_summary_by_month) {
                setSaleSummaryByMonth(res.sale_summary_by_month);
            }
        }
        getData();
    }, []);

    return (
        <div >
            <Chart
                width="400px"
                height="400px"
                // width={'100%'}
                // height={'100%'}
                chartType="PieChart"
                loader={<div>Loading Chart...</div>}
                data={[
                    ['Month', 'Sales'],
                    ...months
                        .filter(month => month.dataIndex && month.dataIndex !== 'year' && month.dataIndex !== 'currency')
                        .map(month => {
                            const value = parseCurrency(saleSummaryByMonth[0][month.dataIndex]);
                            return [month.key, value];
                        })
                        .filter(([, value]) => value > 0)
                ]}
                options={{
                    key: '',
                    pieHole: 0.4,
                    is3D: false,
                    chartArea: {
                        width: '90%',
                        height: '80%',
                        top: 20,
                        right: 10,
                        bottom: 20,
                        left: 10
                    },
                    legend: {
                        position: 'right',
                        alignment: 'center',
                        textStyle: {
                            fontSize: 12
                        }
                    },
                    pieSliceText: 'value',
                    pieSliceTextStyle: {
                        color: 'white',
                        fontSize: 12,
                        bold: true
                    },
                    tooltip: {
                        showColorCode: true,
                        text: 'value',
                        format: 'currency',
                        ignoreBounds: false,
                        trigger: 'focus'
                    },
                    slices: {
                        0: { color: '#ef4e0a' },
                        1: { color: '#ff9800' },
                        2: { color: '#ffc107' },
                        3: { color: '#8bc34a' },
                        4: { color: '#4caf50' },
                        5: { color: '#00bcd4' },
                        6: { color: '#2196f3' },
                        7: { color: '#3f51b5' },
                        8: { color: '#673ab7' },
                        9: { color: '#9c27b0' },
                        10: { color: '#e91e63' },
                        11: { color: '#f44336' }
                    },
                    animation: {
                        startup: true,
                        duration: 1000,
                        easing: 'out'
                    }
                }}
            />
        </div>
    );
}