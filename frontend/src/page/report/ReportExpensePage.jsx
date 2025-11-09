
import React, { useEffect, useState } from 'react';
import { Button, DatePicker, Table, Space, message } from 'antd';
import dayjs from 'dayjs';
import { formatDateClient, request } from '../../util/helper';
import { FaSearch } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
function ReportExpensePage() {
    // const [fromDate, setFromDate] = useState(dayjs().startOf('month'));
    // const [toDate, setToDate] = useState(dayjs());
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);

    const [filter, setFilter] = useState({
        // from_date: dayjs().startOf('month'),
        from_date: dayjs().subtract(5, 'd'),
        to_date: dayjs().add(1, 'd'),
    })
    useEffect(() => {
        getExpenseRreport();
    }, []);

    const getExpenseRreport = async () => {
        try {
            var param = {
                from_date: dayjs(filter.from_date).format('YYYY-MM-DD'),
                to_date: dayjs(filter.to_date).format('YYYY-MM-DD'),
            };
            setLoading(false);
            const res = await request('report/expense_report', 'get', param);
            if (res && Array.isArray(res.list)) {
                setData(res.list);
            } else if (res && Array.isArray(res)) {
                setData(res);
            } else {
                setData([]); 
            }
        } catch (err) {
            message.error('Failed to get report.', err);
        }
    };

    const columns = [
        {
            key: 'No',
            title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{t('common.number')}</span>,
            dataIndex: 'No',
            render: (value, record, index) => index + 1,
        },
        {
            title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{t('expenseReport.labels.expensetype')}</span>,
            dataIndex: 'expense_type',
            key: 'expense_type',
            render: (expense_type) => {
                return <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{expense_type}</span>;
            },
        },
        {
            title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{t('expenseReport.labels.amount')}</span>,
            dataIndex: 'amount',
            key: 'amount',
            render: (amount) => '$' + amount,
        },
        {
            key: "vendor_payee",
            title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{t('expenseReport.labels.vendorpayee')}</span>,
            dataIndex: "vendor_payee",
            render: (vendor_payee) => {
                return <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{vendor_payee}</span>;
            },
        },
        {
            title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{t('expenseReport.labels.paymentmethod')}</span>,
            dataIndex: 'payment_method',
            key: 'payment_method',
            render: (payment_method) => {
                return <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{payment_method}</span>;
            },
        },
        {
            title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{t('expenseReport.labels.description')}</span>,
            dataIndex: 'description',
            key: 'description',
            render: (description) => {
                return <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{description}</span>;
            },
        },
        {
            title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{t('expenseReport.labels.created_by')}</span>,
            dataIndex: 'create_by',
            key: 'create_by',
            render: (create_by) => {
                return <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{create_by}</span>;
            },
        },
        {
            title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{t('expenseReport.labels.expense_date')}</span>,
            dataIndex: 'expense_date',
            key: 'expense_date',
            render: (expense_date) => {
                return <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{formatDateClient(expense_date)}</span>;
            }
        },
    ];

    return (
        <div>
            <h2 style={{ fontSize: "20px", fontWeight: "bold", color: '#e35214ff', fontFamily: 'Khmer OS Muol Light' }}>{t('expenseReport.title')}</h2><br />
            <Space style={{ marginBottom: 16 }}>
                <DatePicker.RangePicker style={{ width: "400px" }}
                    allowClear={true}
                    value={filter.from_date && filter.to_date ? [dayjs(filter.from_date), dayjs(filter.to_date)] : []}
                    format={"YYYY-MM-DD"}
                    onChange={(value) => {
                        setFilter((p) => ({
                            ...p,
                            from_date: value && value[0] ? value[0] : null,
                            to_date: value && value[1] ? value[1] : null,
                        }));
                    }}
                />
                <Button type="primary" onClick={getExpenseRreport} style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>
                    <FaSearch />{t('expenseReport.labels.filter')}
                </Button>
            </Space>
            <Table
                columns={columns}
                dataSource={data}
                loading={loading}
                rowKey={(record, idx) => record.order_no + '_' + idx}
                pagination={{ defaultPageSize: 10, showSizeChanger: true, pageSizeOptions: ['10', '20', '50', '100'] }}
                // pagination={false}
                scroll={false}
            />
        </div>
    );
}

export default ReportExpensePage;