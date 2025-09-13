import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Row, Col } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';

function Exchange() {
    const [form] = Form.useForm();
    const [KHRValue, setKHRValue] = useState('');
    const [USDValue, setUSDValue] = useState('');
    useEffect(() => {
        const link = document.createElement('link');
        link.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans+Khmer:wght@400;700&family=Roboto:wght@400;700&display=swap';
        link.rel = 'stylesheet';
        document.head.appendChild(link);
        return () => { document.head.removeChild(link); };
    }, []);
    const USD_TO_KHR_RATE = 4000; // $1 = 4,000៛

    // Handle KHR input change
    // const handleKHRChange = (e) => {
    //     let value = e.target.value.replace(/,/g, '');
    //     setKHRValue(value);

    //     if (value && !isNaN(value)) {
    //         const floatValue = parseFloat(value);
    //         const usd = floatValue / USD_TO_KHR_RATE;
    //         const formattedUSD = usd.toFixed(2);

    //         setUSDValue(formattedUSD.replace(/,/g, ''));
    //         form.setFieldsValue({ usd: formattedUSD });
    //     } else {
    //         setUSDValue('');
    //         form.setFieldsValue({ usd: '' });
    //     }
    // };
    const handleKHRChange = (e) => {
        let rawValue = e.target.value.replace(/,/g, '');

        if (rawValue && !isNaN(rawValue)) {
            const floatValue = parseFloat(rawValue);

            // Format KHR value if >= 5000
            if (floatValue >= 1000) {
                const formattedValue = floatValue.toLocaleString(); // e.g., 1000 -> "5,000"
                setKHRValue(formattedValue);
            } else {
                setKHRValue(rawValue);
            }

            const usd = floatValue / USD_TO_KHR_RATE;
            const formattedUSD = usd.toFixed(2);
            setUSDValue(formattedUSD);
            form.setFieldsValue({ usd: formattedUSD });

        } else {
            setKHRValue(rawValue); // Still set to show user input
            setUSDValue('');
            form.setFieldsValue({ usd: '' });
        }
    };

    // Handle USD input change
    const handleUSDChange = (e) => {
        let value = e.target.value.replace(/,/g, '');
        setUSDValue(value);

        if (value && !isNaN(value)) {
            const floatValue = parseFloat(value);
            const khr = floatValue * USD_TO_KHR_RATE;
            const formattedKHR = khr.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            });

            setKHRValue(formattedKHR);
            form.setFieldsValue({ khr: formattedKHR });
        } else {
            setKHRValue('');
            form.setFieldsValue({ khr: '' });
        }
    };

    // Reset form fields
    const handleReset = () => {
        setKHRValue('');
        setUSDValue('');
        form.resetFields();
    };
    return (
        <div style={{minHeight: '20%',width: '100%', background: '#ffffff', padding: 10, borderRadius: 8, boxShadow: '0 2px 8px #b5b1b1ff', fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>
            <div style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif', fontWeight: 'bold', fontSize: '24px', alignItems: 'center', justifyContent: 'center', display: 'flex', margin: '0 0 6px 0' }}>អត្រាប្ដូរប្រាក់</div>
            <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 0 6px 0' }}>
                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif', margin: '0 0 10px 0' }}>ប្រាក់ដុល្លា (USD)</label><br />
                    <Input
                        style={{ width: '90%', fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}
                        value={USDValue}
                        onChange={handleUSDChange}
                        placeholder="បញ្ចូលប្រាក់ដុល្លា"
                        className="khmer-search"
                        prefix="$"
                        autoComplete="off"

                    /><b>&nbsp;&nbsp;&nbsp;=</b>
                </div>
                <div style={{ marginBottom: '1rem', marginLeft: '10px' }}>
                    <label style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif', margin: '0 0 10px 0' }}>ប្រាក់រៀល (KHR)</label><br />
                    <Input
                        style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif', width: '90%' }}
                        value={KHRValue}
                        onChange={handleKHRChange}
                        placeholder="បញ្ចូលប្រាក់រៀល"
                        className="khmer-search"
                        suffix="៛"
                        autoComplete="off"
                    />
                </div>
            </div>
            <div style={{ alignItems: 'center', justifyContent: 'center', display: 'flex', margin: '0 0 6px 0' }}>
                <Row justify="space-between">
                    <Col>
                        <Button onClick={handleReset} icon={<ReloadOutlined />} type="default" style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>
                            សម្អាត
                        </Button>
                    </Col>
                </Row>
            </div>
        </div>
    );
}

export default Exchange;