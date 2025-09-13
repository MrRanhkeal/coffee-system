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

export default function SaleSummaryChart() {
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
    <div className="w-full h-[400px] p-4 bg-white rounded-lg shadow-md">
      <Chart
        style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}
        // width={'100%'}
        // height={'100%'}
        width="1000px"
        height="400px"
        chartType="ColumnChart"
        loader={<div>Loading Chart...</div>}
        data={[
          ['Month', 'Total Cost', 'Total test amount'],
          ...months
            .filter(month => month.dataIndex && month.dataIndex !== 'year' && month.dataIndex !== 'currency')
            .map(month => {
              const testAmount = parseCurrency(saleSummaryByMonth[0][month.dataIndex]);
              // Replace with your actual "test amount" field if different
              const totalCost = parseCurrency(saleSummaryByMonth[0][month.dataIndex + '_test'] || 0);
              return [month.key, totalCost, testAmount];
            })
        ]}
        options={{
          chartArea: { width: '85%', height: '75%' },
          hAxis: {
            slantedText: true,
            slantedTextAngle: 45,
            textStyle: { fontSize: 13, fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }
          },
          vAxis: {
            minValue: 0,
            format: 'decimal',
            textStyle: { fontSize: 13 }
          },
          legend: { position: 'right', alignment: 'center', textStyle: { fontSize: 14 } },
          colors: ['#e53935', '#1976d2'],
          bar: { groupWidth: '60%' },
          backgroundColor: 'transparent',
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