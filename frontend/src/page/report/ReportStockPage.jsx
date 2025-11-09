import React, { useEffect, useState, useCallback } from 'react';
import { Button, DatePicker, Table, Space, message } from 'antd';
import dayjs from 'dayjs';
import { formatDateClient, request } from '../../util/helper';
import { FaSearch } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
function ReportStockPage() {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [totalCost, setTotalCost] = useState(0);

    const [filter, setFilter] = useState({
        from_date: dayjs().subtract(5, 'd'),
        to_date: dayjs().add(1, 'd'),
    });

    useEffect(() => {
        getStockReport();
    }, []);

    const getStockReport = async () => {
        try {
            setLoading(true);

            const params = {
                from_date: dayjs(filter.from_date).format('YYYY-MM-DD'),
                to_date: dayjs(filter.to_date).format('YYYY-MM-DD'),
            };

            const res = await request('report/stock_report', 'get', params);

            if (res && !res.error) {
                const list = Array.isArray(res.list)
                    ? res.list
                    : Array.isArray(res.data)
                        ? res.data
                        : Array.isArray(res)
                            ? res
                            : [];

                if (list.length === 0) {
                    setData([]); 
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

    // const getTotalProductCost = useCallback(async () => {
    //     try {
    //         setLoading(true);
    //         const res = await request('total_coffee_cost', 'get');
    //         if (res && !res.error) {
    //             setTotalCost(res.total_cost || 0);
    //         } else {
    //             setTotalCost(0);
    //             message.info('No total product cost data found.');
    //         }
    //     } catch (err) {
    //         console.error('Failed to get total product cost data.', err);
    //     } finally {
    //         setLoading(false);
    //     }
    // }, []);

    const columns = [
        {
            key: 'No',
            title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{t('common.number')}</span>,
            render: (_, __, index) => index + 1,
        },
        {
            title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{t('stockReport.labels.productname')}</span>,
            dataIndex: 'product_name',
            key: 'product_name',
            render: (product_name) => (
                <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{product_name}</span>
            ),
        },
        {
            title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{t('stockReport.labels.qty')}</span>,
            dataIndex: 'qty',
            key: 'qty',
            render: (qty) => (
                <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{qty}</span>
            ),
        },
        {
            title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{t('stockReport.labels.categories')}</span>,
            dataIndex: 'categorie_name',
            key: 'categorie_name',
            render: (categorie_name) => (
                <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{categorie_name}</span>
            ),
        },
        {
            title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{t('stockReport.labels.cost')}</span>,
            dataIndex: 'cost',
            key: 'cost',
            render: (cost) => `$${cost}`,
        },
        {
            key: 'total_cost',
            title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{t('stockReport.labels.totalcost')}</span>,
            dataIndex: 'total_cost',
            render: (total_cost) => `$${total_cost}`,
        },
        {
            title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{t('stockReport.labels.description')}</span>,
            dataIndex: 'description',
            key: 'description',
            render: (description) => (
                <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{description}</span>
            ),
        },
        {
            title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{t('stockReport.labels.created_by')}</span>,
            dataIndex: 'create_by',
            key: 'create_by',
            render: (create_by) => (
                <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{create_by}</span>
            ),
        },
        {
            title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{t('stockReport.labels.created_at')}</span>,
            dataIndex: 'create_at',
            key: 'create_at',
            render: (create_at) => formatDateClient(create_at),
        },
    ];

    return (
        <div>
            <h2 style={{ fontSize: 20, fontWeight: 'bold', color: '#e35214ff', fontFamily: 'Khmer OS Muol Light' }}>
                {t('stockReport.title')}
            </h2>
            <br />
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
                    onChange={(value) => {
                        setFilter((prev) => ({
                            ...prev,
                            from_date: value?.[0] || null,
                            to_date: value?.[1] || null,
                        }));
                    }}
                />
                <Button type="primary" onClick={getStockReport} style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>
                    <FaSearch /> {t('stockReport.labels.filter')}
                </Button>
                    <div style={{ marginLeft:'50px', fontWeight: 'bold' , fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' ,fontSize: '26px'}}>
                        {t('stockReport.table.totalcost')}: ${totalCost.toFixed(2)}
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

export default ReportStockPage;
