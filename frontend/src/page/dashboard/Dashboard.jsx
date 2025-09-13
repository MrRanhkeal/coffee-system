import React,{} from 'react'
import { Space, Typography } from 'antd';
// import { DollarCircleFilled } from '@ant-design/icons';
import DashboardProduct from '../../component/home/product/DashboardProduct';
import DashboardCategory from '../../component/home/category/DashboardCategory';
import DashboardCustomer from '../../component/home/customer/DashboardCustomer';
import DashboardOrder from '../../component/home/order/DashboardOrder';
import DashboardReven from '../../component/home/revenue/DashboardReven';
import RevenueChart from '../../component/home/revenue/RevenueChart';
import RecentOrders from '../../component/home/recentorder/RecentOrders';
import Calendar from '../../component/home/calendar/Calendar'; 
import SaleSummaryChart from '../report/SaleSummaryChart';
import SaleSummaryPieChart from '../report/SaleSummaryPieChart';

function Dashboard() {
    return (
        <Space size={20} direction='vertical'>
            <Typography.Title level={4} style={{fontWeight: 'bold',fontSize: '30px',color:'#2A7B9B',fontFamily: 'Noto Sans Khmer, Roboto, sans-serif'}}>ទិដ្ឋិភាពទូទៅ</Typography.Title>
            <Space direction='horizontal'> 
                <DashboardProduct/>
                <DashboardCategory/>
                <DashboardCustomer/>
                <DashboardOrder/>
                <DashboardReven/> 
                
            </Space>
            <Space style={{width: "100%",height: "100%",display:"content",overflow:"hidden"}}> 
                <RecentOrders /> 
            </Space>
            <Space style={{width: "100%",height: "100%",display:"flex"}}>
                <RevenueChart/> 
                <Calendar/>
                
            </Space>
            <Space style={{ width: "100%", height: "100%", display: "flex" }}>
                <SaleSummaryChart /> 
                <SaleSummaryPieChart />
            </Space>
        </Space>
    )
}


export default Dashboard;