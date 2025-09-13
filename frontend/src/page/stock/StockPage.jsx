import React, { useState,useEffect } from 'react';
import { GiCoffeeBeans } from "react-icons/gi"; 
import Stock_CoffeePage from './Stock_CoffeePage';
import Stock_ProductPage from './Stock_ProductPage';
import { GrAppsRounded } from "react-icons/gr";
function StockPage() {
    const [activeTab, setActiveTab] = useState('coffee');

    // const buttonStyles = {
    //     normal: {
    //         backgroundColor: '#f0f2f5',
    //         transform: 'scale(1)',
    //         transition: 'all 0.3s ease'
    //     },
    //     hover: {
    //         backgroundColor: '#e6f7ff',
    //         transform: 'scale(1.02)'
    //     }
    // };

    useEffect(() => {
        const link = document.createElement('link');
        link.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans+Khmer:wght@400;700&family=Roboto:wght@400;700&display=swap';
        link.rel = 'stylesheet';
        document.head.appendChild(link);
        return () => { document.head.removeChild(link); };
    }, []);

    return (
        <div >
            <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 16, color: 'rgb(75, 212, 51)' ,fontFamily: 'Khmer OS Muol Light'}}>ប្រភេទស្តុកទំនិញ</div>
            <div style={{ display: 'flex', gap: 16 }}>
                <button
                    onClick={() => setActiveTab('coffee')}
                    style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        width: 80, height: 80, borderRadius: 10, border: activeTab === 'coffee' ? '2px solid #1890ff' : '1px solid #d9d9d9',
                        background: activeTab === 'coffee' ? '#e6f7ff' : '#f7f8fa', cursor: 'pointer', boxShadow: activeTab === 'coffee' ? '0 2px 8px #1890ff22' : 'none', transition: 'all 0.25s',
                    }}
                    aria-label="Coffee Stock"
                >
                    <GiCoffeeBeans style={{ fontSize: 44, color: activeTab === 'coffee' ? '#1890ff' : '#222' }} />
                    <span style={{ marginTop: 8, fontWeight: 500, color: activeTab === 'coffee' ? '#1890ff' : '#222',fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>កាហ្វេ</span>
                </button>
                <button
                    onClick={() => setActiveTab('product')}
                    style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        width: 80, height: 80, borderRadius: 10, border: activeTab === 'product' ? '2px solid #1890ff' : '1px solid #d9d9d9',
                        background: activeTab === 'product' ? '#e6f7ff' : '#f7f8fa', cursor: 'pointer', boxShadow: activeTab === 'cup' ? '0 2px 8px #1890ff22' : 'none', transition: 'all 0.25s',
                    }}
                    aria-label="Products Stock"
                >
                <GrAppsRounded style={{ fontSize: 44, color: activeTab === 'cup' ? '#1890ff' : '#222' }} />
                    {/* <LuCupSoda style={{ fontSize: 44, color: activeTab === 'cup' ? '#1890ff' : '#222' }} /> */}
                    <span style={{ marginTop: 8, fontWeight: 500, color: activeTab === 'cup' ? '#1890ff' : '#222' ,fontFamily: 'Noto Sans Khmer, Roboto, sans-serif'}}>ទំនិញផ្សេងៗ</span>
                </button>
            </div>
            <div style={{ marginTop: 6 }}>
                {activeTab === 'coffee' ? <Stock_CoffeePage /> : <Stock_ProductPage />}
            </div>
        </div>
        // </div>
    );
}

export default StockPage;