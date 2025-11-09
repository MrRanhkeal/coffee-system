import React, { useEffect, useState } from 'react';
import { Button, DatePicker, Table, Space, message } from 'antd';
import dayjs from 'dayjs';
import { formatDateClient, request } from '../../util/helper';
import { FaSearch } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
function ReportProductPage() {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [totalCost, setTotalCost] = useState(0);

    const [filter, setFilter] = useState({
        from_date: dayjs().subtract(5, 'day'),
        to_date: dayjs(),
    });

    useEffect(() => {
        getProductReport();
    }, []);

    const getProductReport = async () => {
        try {
            setLoading(true);

            const params = {
                from_date: filter.from_date ? dayjs(filter.from_date).format('YYYY-MM-DD') : null,
                to_date: filter.to_date ? dayjs(filter.to_date).format('YYYY-MM-DD') : null,
            };

            const res = await request('report/product_report', 'get', params);

            if (res && !res.error) {
                const list = Array.isArray(res.list)
                    ? res.list
                    : Array.isArray(res.data)
                        ? res.data
                        : Array.isArray(res)
                            ? res
                            : [];

                if (!list.length) {
                    setData([]);
                    setTotalCost(0); 
                    return;
                }

                const processedData = list.map((item) => ({
                    ...item,
                    total_cost: (parseFloat(item.cost || 0) * parseFloat(item.qty || 0)).toFixed(2),
                }));

                setData(processedData);

                const total = processedData.reduce((sum, i) => sum + parseFloat(i.total_cost), 0);
                setTotalCost(total);
            } else {
                message.error('Failed to fetch product report.');
            }
        } catch (err) {
            console.error(err);
            message.error('Failed to get report.');
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            key: 'No',
            title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{t('common.number')}</span>,
            render: (_, __, index) => index + 1,
        },
        {
            title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{t('productReport.labels.productname')}</span>,
            dataIndex: 'product_name',
            key: 'product_name',
            render: (product_name) => (
                <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{product_name}</span>
            ),
        },
        {
            title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{t('productReport.labels.qty')}</span>,
            dataIndex: 'qty',
            key: 'qty',
        },
        {
            title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{t('productReport.labels.categories')}</span>,
            dataIndex: 'brand',
            key: 'brand',
            render: (brand) => (
                <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{brand}</span>
            ),
        },
        {
            title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{t('productReport.labels.cost')}</span>,
            dataIndex: 'cost',
            key: 'cost',
            render: (cost) => `$${parseFloat(cost || 0).toFixed(2)}`,
        },
        {
            title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{t('productReport.labels.totalcost')}</span>,
            dataIndex: 'total_cost',
            key: 'total_cost',
            render: (total_cost) => `$${parseFloat(total_cost || 0).toFixed(2)}`,
        },
        {
            title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{t('productReport.labels.description')}</span>,
            dataIndex: 'description',
            key: 'description',
            render: (description) => (
                <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{description}</span>
            ),
        },
        {
            title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{t('productReport.labels.created_by')}</span>,
            dataIndex: 'create_by',
            key: 'create_by',
        },
        {
            title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{t('productReport.labels.created_at')}</span>,
            dataIndex: 'create_at',
            key: 'create_at',
            render: (create_at) => formatDateClient(create_at),
        },
    ];

    return (
        <div>
            <h2 style={{ fontSize: 20, fontWeight: 'bold', color: '#e35214', marginBottom: 16, fontFamily: 'Khmer OS Muol Light' }}>
                {t('productReport.title')}
            </h2>

            <Space style={{ marginBottom: 16 }}>
                <DatePicker.RangePicker
                    style={{ width: 400 }}
                    allowClear
                    value={
                        filter.from_date && filter.to_date
                            ? [dayjs(filter.from_date), dayjs(filter.to_date)]
                            : []
                    }
                    format="YYYY-MM-DD"
                    onChange={(dates) => {
                        setFilter({
                            from_date: dates?.[0] || null,
                            to_date: dates?.[1] || null,
                        });
                    }}
                />
                <Button type="primary" onClick={getProductReport} style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>
                    <FaSearch  /> {t('common.filter')}
                </Button>
                <div style={{ marginLeft: '50px', fontWeight: 'bold', fontFamily: 'Noto Sans Khmer, Roboto, sans-serif', fontSize: '26px' }}>
                    {t('productReport.table.totalcost')}: ${totalCost.toFixed(2)}
                </div>
            </Space>

            <Table
                columns={columns}
                dataSource={data}
                loading={loading}
                rowKey={(record, idx) => `${record.product_name}_${idx}`}
                pagination={{
                    defaultPageSize: 10,
                    showSizeChanger: true,
                    pageSizeOptions: ['10', '20', '50', '100'],
                }}
            /> 
        </div>
    );
}

export default ReportProductPage;
