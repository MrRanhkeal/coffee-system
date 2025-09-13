import React from 'react';
import { Button, Input, InputNumber, Select, Empty } from 'antd';
import PropTypes from 'prop-types';
// import styled, { keyframes } from 'styled-components'; 
import BillItem from '../BillItem';
import MyQRCode from '../../../assets/myqr.jpg';

// Define the keyframes
const redPulse = {
    animation: 'redPulse 1.5s infinite',
    fontSize: '14px',
    color: '#666'
};

// Add keyframes for redPulse animation in a style tag
const RedPulseKeyframes = () => (
    <style>
        {`
        @keyframes redPulse {
            0% { color: #666; }
            50% { color: red; }
            100% { color: #666; }
        }
        `}
    </style>
);


function CartView({
    customers,
    state,
    objSummary,
    setObjSummary,
    handleClearCart,
    handleIncrease,
    handleDescrease,
    handleRemove,
    handleClickOut
}) {
    const baseHeight = 650;
    const itemHeight = 56;
    const maxHeight = Math.max(baseHeight, 260 + state.cart_list.length * itemHeight);

    React.useEffect(() => {
        if ((objSummary.payment_method === 'QR' || objSummary.payment_method === 'Cash') && objSummary.total_paid !== objSummary.total) {
            setObjSummary(prev => ({
                ...prev,
                total_paid: prev.total,
            }));
        } else if (objSummary.payment_method !== 'QR' && objSummary.payment_method !== 'Cash') {
            setObjSummary(prev => ({ ...prev, total_paid: 0 }));
        }
    }, [objSummary.payment_method, objSummary.total]);

    const paidInUSD = (objSummary.total_paid);

    return (
        <div style={{ width: '100%', height: '100%', margin: '0', padding: '0', backgroundColor: '#fff', borderRadius: '8px' }}>
            <RedPulseKeyframes />
            <div style={{
                background: '#ffffff',
                borderRadius: '8px',
                boxShadow: '0 2px 8px #b5b1b1ff',
                padding: '10px',
                maxWidth: '100%',
                width: '100%',
                height: '100%',
                // maxHeight: '100%',
                position: 'relative',
                // margin: '0 auto',
                margin: '0 0 20px 0',
                transition: 'max-height 0.3s',
                maxHeight: maxHeight,
                overflowY: 'auto'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '2px'
                }}>
                    <h2 style={{ fontWeight: 'bold', fontSize: '20px', margin: 0 }}>
                        Cart <span style={{ fontWeight: 'normal', fontSize: '16px' }}>({state.cart_list.length})</span>
                    </h2>
                    {state.cart_list.length > 0 && (
                        <Button
                            danger
                            size="small"
                            onClick={handleClearCart}
                            style={{ marginLeft: '8px', fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}

                        >
                            សម្អាត
                        </Button>
                    )}
                </div>
                <div style={{ minHeight: '120px', marginBottom: '16px' }}>
                    {state.cart_list.length === 0 ? (
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description={
                                <span style={{ color: '#595959' }}>
                                    Cart is empty
                                </span>
                            }
                        />
                    ) : (
                        state.cart_list.map((item, index) => (
                            <BillItem
                                key={index}
                                item={item}
                                handleIncrease={() => handleIncrease(item, index)}
                                handleDescrease={() => handleDescrease(item, index)}
                                handleRemove={() => handleRemove(item)}
                            />
                        ))
                    )}
                </div>
                <div style={{ borderTop: '1px solid #eee', paddingTop: '12px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>ប្រាក់សរុប</span>
                        <span>${objSummary.sub_total.toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>ចំនួន</span>
                        <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{objSummary.total_qty} ធាតុ</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>ប្រាក់បញ្ចុះតម្លៃ</span>
                        <span>${objSummary.save_discount.toFixed(2)}</span>
                    </div>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontWeight: 'bold',
                        fontSize: '16px',
                        color: '#090d11ff'
                    }}>
                        <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif', fontWeight: 'bold' }}>សរុប</span>
                        <span>${objSummary.total.toFixed(2)}</span>
                    </div>
                </div>
                <div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ fontWeight: 'bold', marginBottom: '4px', display: 'block', fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>អតិថិជន</label>
                        <Select
                            style={{ width: '100%', fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}
                            //isRequired:false
                            value={objSummary.customer_id || undefined}
                            placeholder="ជ្រើសរើសអតិថិជន"
                            onChange={(value) => setObjSummary(prev => ({
                                ...prev,
                                customer_id: value || undefined
                            }))}
                            //options={customers}
                            options={customers.map(cust => ({
                                value: cust.value,
                                label: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{cust.label}</span>
                            }))}
                        />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ fontWeight: 'bold', marginBottom: '4px', display: 'block', fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>វិធីសាស្រ្តបង់ប្រាក់</label>
                        <Select
                            style={{ width: '100%', fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}
                            value={objSummary.payment_method || undefined}
                            placeholder="ជ្រើសរើសវិធីបង់ប្រាក់"
                            onChange={(value) => setObjSummary(prev => ({ ...prev, payment_method: value }))}
                            options={[
                                { value: 'Cash', label: 'សាច់ប្រាក់', style: { fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' } },
                                { value: 'QR', label: 'QR Code', style: { fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' } },
                            ]}
                        />
                    </div>
                    {objSummary.payment_method === 'QR' && (
                        <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
                            <label style={{ fontWeight: 'bold', marginBottom: '4px', display: 'block' }}>Scan QR Code to Pay</label>
                            <div style={{
                                padding: '2px',
                                backgroundColor: "rgb(240, 241, 240)",
                                borderRadius: '8px',
                                border: '1px solid #d9d9d9',
                                display: 'inline-block'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <img src={MyQRCode} alt="QR Code" style={{ width: '25%', height: 'auto' }} />
                                    <div style={{ textAlign: 'left' }}>
                                        <div style={{ ...redPulse, fontSize: '16px', fontWeight: 'bold', margin: '10% 10% 0 10%', fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>
                                            Pay to this QR Code
                                            <br />
                                            ចំនួន: ${objSummary.total.toFixed(2)}
                                        </div>
                                        <div style={{ ...redPulse, fontSize: '14px', margin: '8px 8px 8px 8px', fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>
                                            ស្កេនជាមួយកម្មវិធីបង់ប្រាក់លើទូរស័ព្ទរបស់អ្នក
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ fontWeight: 'bold', marginBottom: '4px', display: 'block', fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>ចំណាំ</label>
                        <Input.TextArea
                            value={objSummary.remark}
                            onChange={(e) => setObjSummary(prev => ({ ...prev, remark: e.target.value }))}
                            placeholder="Add any special instructions"
                            autoSize={{ minRows: 1, maxRows: 2 }}
                        />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <label style={{ fontWeight: 'bold', fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>ចំនួនប្រាក់ដែលបានបង់</label>
                            {paidInUSD < objSummary.total && (
                                <span style={{ color: 'red', fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>
                                    ចំនួនប្រាក់ដែលត្រូវបង់ (${(objSummary.total - paidInUSD).toFixed(2)} បន្ថែមទៀត)
                                </span>
                            )}
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <InputNumber
                                style={{ width: '100%' }}
                                value={objSummary.total_paid}
                                formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                min={0}
                                step={0.5}
                                disabled={objSummary.payment_method === 'QR'}
                                onChange={val => setObjSummary(prev => ({ ...prev, total_paid: Number(val) }))}
                            />
                        </div>
                    </div>
                    <div>
                        <label style={{ fontWeight: 'bold', fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>ប្រាក់បង់ត្រលប់</label>
                        <Input
                            style={{ width: '100%' }}
                            value={`$ ${(objSummary.total_paid - objSummary.total).toFixed(2)}`}
                            readOnly
                            disabled={objSummary.payment_method === 'QR'}
                        />
                    </div>
                </div>
                <Button
                    onClick={handleClickOut}
                    type="primary"
                    style={{
                        width: '100%',
                        fontWeight: 'bold',
                        fontSize: '20px',
                        position: 'sticky',
                        bottom: 0,
                        zIndex: 10,
                        marginTop: '8px'
                    }}
                    disabled={state.cart_list.length === 0 || paidInUSD < objSummary.total}
                >
                    Checkout
                </Button>
            </div>
        </div>
    );
}

CartView.propTypes = {
    customers: PropTypes.array.isRequired,
    state: PropTypes.object.isRequired,
    objSummary: PropTypes.object.isRequired,
    setObjSummary: PropTypes.func.isRequired,
    handleClearCart: PropTypes.func.isRequired,
    handleIncrease: PropTypes.func.isRequired,
    handleDescrease: PropTypes.func.isRequired,
    handleRemove: PropTypes.func.isRequired,
    handleClickOut: PropTypes.func.isRequired
};

export default CartView