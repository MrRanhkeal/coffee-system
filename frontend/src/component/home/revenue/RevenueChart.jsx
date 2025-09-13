import { useState, useEffect } from 'react';
import { Chart } from 'react-google-charts';
import { request, formatDateServer } from '../../../util/helper';
import dayjs from 'dayjs';

function RevenueChart() {
    const [revenueData, setRevenueData] = useState([]);

    useEffect(() => {
        getRevenueData();
    }, []);

    const getRevenueData = async () => {
        try {
            // Get data for the last 7 days
            const endDate = dayjs();
            const startDate = dayjs().subtract(6, 'day');

            const param = {
                from_date: formatDateServer(startDate),
                to_date: formatDateServer(endDate),
            };

            const res = await request('order', 'get', param);

            if (res && !res.error && res.list) {
                // Process orders to get daily revenue
                const dailyRevenue = res.list.reduce((acc, order) => {
                    const date = dayjs(order.create_at).format('DD/MM/YYYY');
                    acc[date] = (acc[date] || 0) + Number(order.total_amount);
                    return acc;
                }, {});

                // Fill in missing dates with 0 revenue
                let currentDate = startDate;
                while (currentDate.isSame(endDate) || currentDate.isBefore(endDate)) {
                    const dateStr = currentDate.format('DD/MM/YYYY');
                    if (!dailyRevenue[dateStr]) {
                        dailyRevenue[dateStr] = 0;
                    }
                    currentDate = currentDate.add(1, 'day');
                }

                // Convert to format required by Google Charts
                const chartData = [
                    ['Date', 'Revenue'],
                    ...Object.entries(dailyRevenue)
                        .sort((a, b) => dayjs(a[0], 'DD/MM/YYYY').unix() - dayjs(b[0], 'DD/MM/YYYY').unix())
                        .map(([date, revenue]) => [date, revenue])
                ];

                setRevenueData(chartData);
            }
        } catch (error) {
            console.error('Error get revenue data:', error);
        }
    };

    const options = {
        title: 'Last 7 Days Revenue',
        curveType: 'function',
        legend: { position: 'bottom' },
        hAxis: { title: 'Date' },
        vAxis: { title: 'Revenue ($)' },
        backgroundColor: 'transparent',
        animation: {
            startup: true,
            duration: 1000,
            easing: 'out'
        }
    };

    return (
        <div className="w-full h-[400px] p-4 bg-white rounded-lg shadow-md">
            {revenueData.length > 0 ? (
                <Chart
                    chartType="LineChart"
                    width="900px"
                    height="400px"
                    data={revenueData}
                    options={options}
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center">
                    Loading revenue data...
                </div>
            )}
        </div>
    );
}

export default RevenueChart;