import React, { useEffect, useState } from 'react'
import PropTypes from "prop-types";
import { request } from '../../../util/helper';
import { Card, Space, Statistic } from 'antd';
import { DollarCircleFilled } from '@ant-design/icons';
function DashboardReven() {
    const [revenue, setRevenue] = useState(0);

    // Calculate total revenue from orders
    useEffect(() => {
        const getRevenue = async () => {
            try {
                const res = await request("order", "get", {});
                if (res && res.list && Array.isArray(res.list)) {
                    // Calculate total revenue from all orders
                    const totalRevenue = res.list.reduce((sum, order) => {
                        const amount = parseFloat(order.total_amount) || 0;
                        return sum + amount;
                    }, 0);
                    setRevenue(totalRevenue);
                } else {
                    setRevenue(0);
                }
            } catch (error) {
                console.error("Error get revenue:", error);
                setRevenue(0);
            }
        };
        getRevenue();
    }, []);
    function DashboardReven({ title, value, icon }) {
        return (
            <Card direction='horizontal'
                style={{margin: '10px 10px 10px 10px', width: "220px", height: "120px", backgroundColor: '#c4de75ff', borderRadius: 6, fontSize: 20, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', fontWeight: 'bold', display: 'flex', textAlign: 'center' }}
            >
                <Space >
                    {icon}
                    <Statistic title={title} value={value} />
                </Space>
            </Card>
        );
    }
    return (
        <Space style={{ fontWeight: "bold" }}>
            <DashboardReven
                icon={
                    <DollarCircleFilled
                        style={{
                            color: "green",
                            backgroundColor: "rgba(255,0,0,0.25)",
                            borderRadius: 50,
                            fontSize: 40,
                            padding: 8,
                        }}
                    />
                }
                title={<span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>ប្រាក់ចំណូលសរុប</span>}
                value={revenue}
            />
        </Space>
    )
}
DashboardReven.propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    icon: PropTypes.node.isRequired
}
export default DashboardReven