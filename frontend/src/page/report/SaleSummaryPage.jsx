import { Table, Button, message } from 'antd';
import { useState, useEffect } from 'react';
import { request } from '../../util/helper';
import { IoIosRefresh } from "react-icons/io";
// import { Chart } from 'react-google-charts';
import SaleSummaryChart from '../report/SaleSummaryChart';
//import { Chart } from 'react-chartjs-2';
import { MdCalendarMonth } from "react-icons/md";
import { FaCalendarWeek } from "react-icons/fa6";
import { CiCalendarDate } from "react-icons/ci";
import { BiCalendarWeek } from "react-icons/bi";
import { LiaCalendarWeekSolid } from "react-icons/lia";
import SaleSummaryPieChart from './SaleSummaryPieChart';
import { useTranslation } from 'react-i18next';
// Helper function to parse currency string to number
// const parseCurrency = (value) => {
//     if (typeof value === 'string') {
//         return parseFloat(value.replace(/[^0-9.-]+/g, '')) || 0;
//     }
//     return value || 0;
// };

function SaleSummaryPage() {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const { t } = useTranslation();
    // Optionally store summary and sale_summary_by_month if needed
    const [summary, setSummary] = useState(null);
    const [saleSummaryByMonth, setSaleSummaryByMonth] = useState([]);
    const [summary_per_year, setSummaryByYear] = useState(null);
    const [summaryLastMonth, setSummaryLastMonth] = useState(null);
    const [summaryPerWeek, setSummaryPerWeek] = useState(null);
    const [this_week, setThisWeek] = useState(null);
    const [last_week, setLastWeek] = useState(null);

    useEffect(() => {
        const link = document.createElement('link');
        link.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans+Khmer:wght@400;700&family=Roboto:wght@400;700&display=swap';
        link.rel = 'stylesheet';
        document.head.appendChild(link);
        return () => { document.head.removeChild(link); };
    }, []);

    useEffect(() => {
        getData();
    }, []);
    const getData = async () => {
        setLoading(true);
        try {
            const res = await request('report/get_sale_summary', 'get');
            if (res && res.sale_summary_by_month) {
                //console.log('Sale Summary Data:', res.sale_summary_by_month); // Debug log
                setData(res.sale_summary_by_month);
                setSummary(res.summary_month ? res.summary_month[0] : null);
                setSaleSummaryByMonth(res.sale_summary_by_month);
                setSummaryByYear(res.summary_per_year);
                setSummaryPerWeek(res.summary_per_week);
                setSummaryLastMonth(res.summary_last_month || null);
                setThisWeek(res.this_week || null);
                setLastWeek(res.last_week || null);

            } else {
                setData([]);
                setSummary(null);
                setSaleSummaryByMonth([]);
                setSummaryByYear(null);
                //setSaleSummaryByday([]);
                message.info('No sale data found.');
            }
        } catch (err) {
            message.error('Failed to get sale per month data.', err);
        } finally {
            setLoading(false);
        }
    };
    const months = [
        {
            title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{t('report.labels.year')}</span>,
            dataIndex: 'year',
            key: 'year',
        },
        {
            key: 'jan',
            title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{t('report.labels.jan')}</span>,
            dataIndex: 'jan',
        },
        {
            title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{t('report.labels.feb')}</span>,
            dataIndex: 'feb',
            key: 'feb',
        },
        {
            title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{t('report.labels.mar')}</span>,
            dataIndex: 'mar',
            key: 'mar',
        },
        {
            title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{t('report.labels.apr')}</span>,
            dataIndex: 'apr',
            key: 'apr',
        },
        {
            title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{t('report.labels.may')}</span>,
            dataIndex: 'may',
            key: 'may',
        },
        {
            title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{t('report.labels.jun')}</span>,
            dataIndex: 'jun',
            key: 'jun',
        },
        {
            title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{t('report.labels.jul')}</span>,
            dataIndex: 'jul',
            key: 'jul',
        },
        {
            title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{t('report.labels.aug')}</span>,
            dataIndex: 'aug',
            key: 'aug',
        },
        {
            title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{t('report.labels.sep')}</span>,
            dataIndex: 'sep',
            key: 'sep',
        },
        {
            title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{t('report.labels.oct')}</span>,
            dataIndex: 'oct',
            key: 'oct',
        },
        {
            title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{t('report.labels.nov')}</span>,
            dataIndex: 'nov',
            key: 'nov',
        },
        {
            title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{t('report.labels.dec')}</span>,
            dataIndex: 'dec',
            key: 'dec',
        },
    ]
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <span style={{ fontWeight: 'bold', fontSize: 20, color: '#ef4e0aff', fontFamily: 'Khmer OS Muol Light' }}>{t('report.labels.salereport')}</span>
                <Button type="primary" onClick={getData} loading={loading}><IoIosRefresh />Refresh</Button>
            </div>
            {summary && (
                <div style={{ marginBottom: 16, fontSize: 16 }}>
                    <b style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{t('report.labels.salethismonth')}</b> <span style={{ color: '#ea4909ff', fontWeight: 'bold' }}>{summary.summary.Total}</span>  <br /> <b style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{t('report.labels.orderthismonth')}</b> <span style={{ color: '#ea4909ff', fontWeight: 'bold' }}>{summary.summary.Total_Order} </span><b style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{t('report.labels.bong')}</b>
                </div>
            )}
            <div style={{ margin: '20px 0', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                <h3 style={{ marginBottom: 16, color: '#fa0808ff', fontSize: 20, fontWeight: 'bold', fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{t('report.labels.salereport')}</h3>
                {summaryPerWeek ? (
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                        {summaryLastMonth && (
                            <div style={{ margin: '10px', color: '#f04107ff', backgroundColor: '#e6ece4ff', borderRadius: 6, fontSize: 20, padding: 18, boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', fontWeight: 'bold', textAlign: 'center' }}>
                                <MdCalendarMonth style={{ justifyContent: 'center', alignItems: 'center' }} />
                                <b style={{ color: '#2d1817ff', fontWeight: 'bold', fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{t('report.labels.lastmonth')}&nbsp;</b>
                                <span style={{ color: '#da2016ff', fontWeight: 'bold' }}>${parseFloat(summaryLastMonth.total || '0').toFixed(2)}</span>
                            </div>
                        )}
                        {last_week && (
                            <div style={{ margin: '10px', color: '#0c3e6b', backgroundColor: '#e2e8ecff', borderRadius: 6, fontSize: 20, padding: 18, boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', fontWeight: 'bold', textAlign: 'center' }}>
                                <LiaCalendarWeekSolid />
                                <b style={{ color: '#2d1817ff', fontWeight: 'bold', fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{t('report.labels.thisweek')}&nbsp;</b>
                                <span style={{ color: '#da2016ff', fontWeight: 'bold' }}>
                                    ${parseFloat((last_week?.total_last_week || summaryPerWeek?.[1]?.total_last_week || summaryPerWeek?.[1]?.total_per_week || '0')).toFixed(2)}
                                </span>
                            </div>
                        )}
                        {summary && (
                            <div style={{ margin: '10px', color: '#e3683fff', backgroundColor: '#e4eae2ff', borderRadius: 6, fontSize: 20, padding: 18, boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', fontWeight: 'bold', textAlign: 'center' }}>
                                <FaCalendarWeek />
                                <b style={{ color: '#2d1817ff', fontWeight: 'bold', fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{t('report.labels.thismonth')}&nbsp;</b>
                                <span style={{ color: '#da2016ff', fontWeight: 'bold', fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>${parseFloat(summary.summary.Total?.replace('$', '') || '0').toFixed(2)}</span>
                            </div>
                        )}
                        {/* {(last_week || (summaryPerWeek && summaryPerWeek.length > 1)) && (
                            <div style={{ margin: '10px', color: '#0c3e6b', backgroundColor: '#e8e6e2ff', borderRadius: 6, fontSize: 20, padding: 18, boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', fontWeight: 'bold', textAlign: 'center' }}>
                                <TbCalendarWeekFilled />
                                <b style={{ color: '#2d1817ff', fontWeight: 'bold' }}>Last Week ({(last_week?.week_start_date || summaryPerWeek?.[1]?.week_start_date) ?? 'N/A'}):</b>
                                <span style={{ color: '#da2016ff', fontWeight: 'bold' }}>
                                    ${parseFloat((last_week?.total_last_week || summaryPerWeek?.[1]?.total_last_week || summaryPerWeek?.[1]?.total_per_week || '0')).toFixed(2)}
                                </span>
                            </div>
                        )} */}

                        {(this_week || (summaryPerWeek && summaryPerWeek.length > 0)) && (
                            <div style={{ margin: '10px', color: '#0c3e6b', backgroundColor: '#e1e6eaff', borderRadius: 6, fontSize: 20, padding: 18, boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', fontWeight: 'bold', textAlign: 'center' }}>
                                <BiCalendarWeek />
                                <b style={{ color: '#2d1817ff', fontWeight: 'bold', fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{t('report.labels.thisweek')}&nbsp;</b>
                                <span style={{ color: '#da2016ff', fontWeight: 'bold' }}>
                                    ${parseFloat((this_week?.total_this_week || summaryPerWeek?.[0]?.total_this_week || '0')).toFixed(2)}
                                </span>
                            </div>
                        )}
                        {summary_per_year && (
                            <div style={{ margin: '10px', color: '#0c3e6b', backgroundColor: '#e8e6e2ff', borderRadius: 6, fontSize: 20, padding: 18, boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', fontWeight: 'bold', textAlign: 'center' }}>
                                <CiCalendarDate />
                                <b style={{ color: '#2d1817ff', fontWeight: 'bold', fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{t('report.labels.thisyear')}&nbsp;</b>
                                <span style={{ color: '#da2016ff', fontWeight: 'bold' }}>${parseFloat(summary_per_year[0]?.total_per_year || '0').toFixed(2)}</span>
                            </div>
                        )}
                    </div>
                ) : (
                    <div>Loading summary data...</div>
                )}
            </div>
            <br />
            <Table
                style={{ fontWeight: 'bold' }}
                dataSource={data}
                columns={months}
                loading={loading}
                pagination={false}
            />
            <div style={{ marginTop: 32, marginBottom: 32 }}>
                {saleSummaryByMonth?.[0] ? (
                    <div>
                        <h3 style={{ textAlign: 'center', marginBottom: 24, color: '#f33939ff', fontSize: 20, fontFamily: 'Noto Sans Khmer, Roboto, sans-serif', fontWeight: 'bold' }}>{t('report.labels.analysispermoth')}</h3> 
                        <div style={{ marginBottom: 24 }}> 
                            <div style={{ height: 400 ,fontFamily: 'Noto Sans Khmer, Roboto, sans-serif',display: 'flex', justifyContent: 'space-between'}}>
                                <SaleSummaryChart />
                                <SaleSummaryPieChart />
                            </div> 
                        </div> 
                    </div>
                ) : (
                    <div style={{
                        textAlign: 'center',
                        marginTop: 20,
                        padding: '40px',
                        border: '2px dashed #ddd',
                        borderRadius: '8px',
                        backgroundColor: '#f9f9f9'
                    }}>
                            <p style={{ fontSize: '16px', color: '#666' }}>{t('report.labels.nodatatoshow')}</p>
                        <Button type="primary" onClick={getData} style={{ marginTop: '10px' }}>
                            <IoIosRefresh /> Refresh Data
                        </Button>
                    </div>
                )}
            </div>
            {data.length === 0 && !loading && (
                <div style={{ textAlign: 'center', marginTop: 20 }}>
                    <span>{t('report.labels.nodata')}</span>
                </div>
            )}
        </div>
    )
}

export default SaleSummaryPage;