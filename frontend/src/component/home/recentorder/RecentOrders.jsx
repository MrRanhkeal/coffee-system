import React, { useEffect } from 'react'
import { request, formatDateClient } from '../../../util/helper'; // Added import for request helper and formatDateClient 
import { Space, Table } from 'antd';
import Link from 'antd/es/typography/Link';

function RecentOrders() {
    const [dataSource, setDataSource] = React.useState([]);
    const [loading, setLoading] = React.useState(false);

    useEffect(() => {
        const getRecentOrders = async () => {
            setLoading(true);
            try {
                const res = await request("order", "get", {}); // Use request helper
                if (res && res.list && Array.isArray(res.list)) {
                    // Display the first 10 orders. If API sorts by newest first, these are the most recent.
                    setDataSource(res.list.slice(0, 15));
                } else if (Array.isArray(res)) {
                    setDataSource(res.slice(0, 10)); // Fallback if API returns a direct array
                } else {
                    console.warn("Recent orders data is not in expected format ({list: array} or array):", res);
                    setDataSource([]);
                }
            } catch (error) {
                console.error("Error recent orders:", error);
                setDataSource([]);
            } finally {
                setLoading(false);
            }
        };
        getRecentOrders();
    }, []);
    return (
        <>
            {/* <Typography.Text strong>Recent Orders</Typography.Text> */}
            <div style={{ fontWeight: 'bold', color: '#833AB4', fontFamily: 'Noto Sans Khmer, Roboto, sans-serif', margin: '0 0 10px 0' }}>ការបញ្ជារទំនិញថ្មីៗ</div>
            <Space style={{ width: '100%', display: "block", overflowX: "auto" }}>
                <Table style={{ width: 1450, minWidth: 1200, maxWidth: "100%", display: "block", overflowX: "auto" }}
                    columns={[
                        // {
                        //     key: "NO",
                        //     title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>លេខរៀង</span>,
                        //     dataIndex: "NO",
                        //     width: '10%',
                        //     align: 'left',
                        //     render: (item, data, index) => (
                        //         <Link style={{ color: '#cc2121ff', fontSize: "14px" }}>
                        //             {'INV-' + String(index + 1).padStart(3, '0')}
                        //         </Link>
                        //     ) 
                        // }, 
                        {
                            key: "order_no",
                            title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>លេខបញ្ជារទិញ</span>,
                            dataIndex: "order_no",
                            render: (value) => <div style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{value}</div>,
                            // render: (value) => {
                            //     // Ensure it's formatted as INV-XXX with 3 digits
                            //     const formatted = `INV-${String(value).padStart(3, '0')}`;
                            //     return <div style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{formatted}</div>;
                            // },
                            width: '10%',
                            align: 'left'
                        },
                        // {
                        //     key: "customer_name",
                        //     title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>ឈ្មោះអតិថិជន</span>,
                        //     dataIndex: "customer_name",
                        //     render: (text) => <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{text}</span>,
                        //     width: '20%',
                        //     align: 'left'
                        // },
                        {
                            key: "total_amount",
                            title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>សរុប</span>,
                            dataIndex: "total_amount",
                            width: '20%',
                            align: 'left',
                            render: (value) => {
                                const numValue = parseFloat(value);
                                return !isNaN(numValue) ? `$${numValue.toFixed(2)}` : '$0.00';
                            }
                        },
                        {
                            key: "paid_amount",
                            title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>ចំនួនប្រាក់ដែលបានបង់</span>,
                            dataIndex: "paid_amount",
                            width: '20%',
                            align: 'left',
                            render: (value) => {
                                const numValue = parseFloat(value);
                                return !isNaN(numValue) ? `$${numValue.toFixed(2)}` : '$0.00';
                            }
                        },
                        {
                            key: "payment_method",
                            title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>វិធីសាស្រ្តការទូទាត់</span>,
                            dataIndex: "payment_method",
                            width: '20%',
                            align: 'left'
                        },
                        {
                            key: "create_by",
                            title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>អ្នកលក់</span>,
                            dataIndex: "create_by",
                            render: (value) => <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{value}</span>,
                        },
                        {
                            key: "create_at",
                            title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>កាលបរិច្ឆេទ</span>,
                            dataIndex: "create_at",
                            width: '20%',
                            align: 'left',
                            //render: (value) => value ? formatDateClient(value, "DD/MM/YYYY") : "N/A"
                            render: (date) => new Date(date).toLocaleDateString("en-GB", { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                        }
                    ]}
                    dataSource={dataSource}
                    loading={loading}
                    pagination={false}
                    scroll={{ y: 220 }}

                    // rowClassName={() => 'table-row-hover'}
                    // bordered
                    size="small"
                />
            </Space>
        </>
    )
}

export default RecentOrders