import { ProductOutlined } from '@ant-design/icons';
import { Card, Space, Statistic } from 'antd';
import React, { useEffect, useState } from 'react'
import { request } from '../../../util/helper';
import PropTypes from "prop-types";
function DashboardProduct() {
    const [products, setProducts] = useState(0);
    useEffect(() => {
        const link = document.createElement('link');
        link.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans+Khmer:wght@400;700&family=Roboto:wght@400;700&display=swap';
        link.rel = 'stylesheet';
        document.head.appendChild(link);
        return () => { document.head.removeChild(link); };
    }, []);
    // get products count
    useEffect(() => {
        const getProducts = async () => {
            try {
                const res = await request("product", "get", {}); // Using request helper
                if (res && !res.error) {
                    // Use res.total if available, otherwise fallback to list length
                    setProducts(res.total || (res.list && res.list.length) || 0);
                } else {
                    console.warn("Product data is not in expected format:", res);
                    setProducts(0);
                }
            } catch (error) {
                console.error("Error getting products:", error);
                setProducts(0);
            }
        };
        getProducts();
    }, []);
    function DashboardProduct({ title, value, icon }) {
        return (
            <Card direction='horizontal'
                style={{ margin: '10px 10px 10px 10px', width: "210px", height: "120px", backgroundColor: '#cfe4c7ff', borderRadius: 6, fontSize: 20, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', fontWeight: 'bold', display: 'flex', textAlign: 'center' }}
            >
                <Space >
                    {icon}
                    <Statistic title={title} value={value} />
                </Space>
            </Card>
        );
    }
    return (
        <Space style={{ fontWeight: "bold", fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>
            <DashboardProduct
                icon={
                    <ProductOutlined
                        style={{
                            color: 'green',
                            backgroundColor: 'rgba(0,255,0,0.25)',
                            borderRadius: 50,
                            fontSize: 40,
                            padding: 8,
                            fontWeight: 'bold'
                        }}
                    />
                }
                title={<span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>ទំនិញ</span>}
                value={products}
            />
        </Space>
    )
}
DashboardProduct.propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]).isRequired,
    icon: PropTypes.node.isRequired
};
export default DashboardProduct;