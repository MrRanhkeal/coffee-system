import React, { useCallback, useEffect, useRef, useState } from "react";
import { Col, message, notification, Row, Space, Card, Typography, Input, Empty, Flex, Modal, Button } from "antd";
import PropTypes from "prop-types";
import MainPage from "../../component/layout/MainPage";
import ProductItem from "../../component/pos/ProductItem";
import CartView from "../../component/pos/cart/CartView";
import Exchange from "../../component/home/exchange/Exchange";
// import Excha from '../currency/ExchangePage';
import { useReactToPrint } from "react-to-print";
import PrintInvoice from "../../component/pos/PrintInvoice";
import { request } from "../../util/helper";
import { getProfile } from "../../store/profile.store";
import { FiSearch } from "react-icons/fi";
import { QRCodeSVG } from "qrcode.react";
import { useTranslation } from "react-i18next";
function PosPage() {
    const { Text } = Typography;
    const { t } = useTranslation();
    const profile = getProfile();
    const refInvoice = React.useRef(null);
    const pollRef = useRef(null);
    const timerRef = useRef(null);

    const [state, setState] = useState({
        list: [],
        total: 0,
        loading: false,
        visibleModal: false,
        cart_list: [],
        customers: []
    });

    const [objSummary, setObjSummary] = useState({
        sub_total: 0,
        total_qty: 0,
        save_discount: 0,
        tax: 10,
        total: 0,
        total_paid: 0,
        customer_id: null,
        customer_name: null,
        payment_method: null,
        remark: '0',
        order_no: null, // set after order
        order_date: null, // set after order
    });

    // KHQR Modal state
    const [qrModal, setQrModal] = useState({
        open: false,
        qr: '',
        md5: '',
        expiresAt: 0,
        status: 'pending',
    });
    const [qrRemainMs, setQrRemainMs] = useState(0);
    const [forceLoading, setForceLoading] = useState(false);

    const refPage = React.useRef(1);

    const [filter, setFilter] = useState({
        txt_search: "",
        category_id: "",
        //category_name: "",
        brand: "",

    });

    const [categories, setCategories] = useState([
        { id: "", name: "All", icon: "🛒" }
    ]);

    const handleCalSummary = useCallback(() => {
        setState(currentState => {
            let total_qty = 0,
                sub_total = 0,
                save_discount = 0;

            try {
                currentState.cart_list.forEach((item) => {
                    total_qty += item.cart_qty; //check that(-=1 from product_stock.qty)
                    const original_total = Number(item.cart_qty) * Number(item.price);
                    let final_price = original_total;

                    if (item.discount != null && item.discount != 0) {
                        final_price = original_total - (original_total * Number(item.discount)) / 100;
                        save_discount += (original_total * Number(item.discount)) / 100;
                    }
                    sub_total += final_price;
                });

                setObjSummary(p => ({
                    ...p,
                    sub_total: Number(sub_total.toFixed(2)),
                    total_qty: total_qty,
                    save_discount: Number(save_discount.toFixed(2)),
                    total: Number(sub_total.toFixed(2)),
                    total_paid: p.total_paid || 0,
                }));
            } catch (e) {
                console.log(e);
            }
            return currentState;
        });
    }, []);

    const handleAdd = useCallback(({ sugarLevel, ...item }) => {
        setState(prevState => {
            const cart_tmp = [...prevState.cart_list];
            const findIndex = cart_tmp.findIndex((row) =>
                // row.sugarLevel === sugarLevel
                row.id === item.id && row.sugarLevel === sugarLevel
            );

            if (findIndex === -1) {
                cart_tmp.push({ ...item, sugarLevel, cart_qty: 1 });
            } else {
                cart_tmp[findIndex].cart_qty += 1;
            }
            return { ...prevState, cart_list: cart_tmp };
        });
        handleCalSummary();
    }, [handleCalSummary]);

    const getList = useCallback(async () => {
        try {
            setState(pre => ({ ...pre, loading: true }));
            const param = {
                ...filter,
                page: refPage.current,
                is_list_all: 1,
            };
            const res = await request("product", "get", param);
            if (res && !res.error) {
                // Removed auto-insert logic for single product result
                // Products will now only be added to cart via explicit user action
                const processedList = res.list.map(item => ({
                    ...item,
                    price: Number(item.price),
                    discount: Number(item.discount)
                }));
                setState(pre => ({
                    ...pre,
                    list: processedList,
                    total: refPage.current === 1 ? res.total : pre.total,
                    loading: false,
                }));
            }
        } catch (error) {
            console.error('Error getting products:', error);
            setState(pre => ({ ...pre, loading: false }));
        }
    }, [filter]);

    const getCustomers = useCallback(async () => {
        try {
            const res = await request('customer', 'get');
            if (res && !res.error) {
                setState(prev => ({
                    ...prev,
                    customers: res.list.map(customer => ({
                        value: customer.id || 'walk-in',
                        label: customer.name || 'Customer 1',
                    }))
                }));
            }
        }
        catch (error) {
            console.error('Error getting customers:', error);
        }
    }, []);

    const getCategories = useCallback(async () => {
        try {
            const res = await request('category', 'get');
            if (res && !res.error && res.list) {
                //Create category icons mapping
                const categoryIcons = {
                    'Hot Drink': '☕',
                    'Could Drink': '🍦',
                    'Soda': '🥤',
                    'Ice Tea': '🍵',
                    'Milk': '🥛',
                };  

                const categoriesFromBackend = res.list.map(category => ({
                    id: category.id,
                    name: category.name,
                    icon: categoryIcons[category.name] || '📦'
                }));

                setCategories([
                    { id: "", name: "All", icon: "🛒" },
                    ...categoriesFromBackend
                ]);
            }
        } catch (error) {
            console.error('Error getting categories:', error);
            // Keep default "All" category if get fails
            setCategories([
                { id: "", name: "All", icon: "🛒" }
            ]);
        }
    }, []);

    useEffect(() => {
        const link = document.createElement('link');
        link.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans+Khmer:wght@400;700&family=Roboto:wght@400;700&display=swap';
        link.rel = 'stylesheet';
        document.head.appendChild(link);
        return () => { document.head.removeChild(link); };
    }, []);

    useEffect(() => {
        getList();
    }, [getList]);

    useEffect(() => {
        getCustomers();
    }, [getCustomers]);

    useEffect(() => {
        getCategories();
    }, [getCategories]);

    // Cleanup timers on unmount
    useEffect(() => {
        return () => {
            if (pollRef.current) clearInterval(pollRef.current);
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    useEffect(() => {
        if (filter.category_id !== undefined) {
            getList();
        }
    }, [filter.category_id, getList]);

    // const onFilter = () => {
    //     getList();
    // };

    const handleClearCart = useCallback(() => {
        setState((p) => ({ ...p, cart_list: [] }));
        setObjSummary((p) => ({
            ...p,
            sub_total: 0,
            total_qty: 0,
            save_discount: 0,
            tax: 10,
            total: 0,
            total_paid: 0,
        }));
    }, []);

    const handleIncrease = (item, index) => {
        try {
            state.cart_list[index].cart_qty += 1;
            setState((p) => ({ ...p, cart_list: state.cart_list }));
            handleCalSummary();
        }
        catch (e) {
            console.log(e, 'handleIncrease error');
        }
    };

    const handleDescrease = (item, index) => {
        try {
            if (item.cart_qty > 1) {
                state.cart_list[index].cart_qty -= 1;
                setState((p) => ({ ...p, cart_list: state.cart_list }));
                handleCalSummary();
            }
        }
        catch (e) {
            console.log(e, 'handleDescrease error');
        }
    };

    const handleRemove = (item) => {
        try {
            const new_list = state.cart_list.filter(
                (item1) => item1.id !== item.id || item1.sugarLevel !== item.sugarLevel
            );
            setState((p) => ({
                ...p,
                cart_list: new_list,
            }));
            handleCalSummary();
        }
        catch (e) {
            console.log(e, 'handleRemove error');
        }
    };

    // const handleClickOut = async () => {
    //     if (objSummary.total_paid < objSummary.total) {
    //         notification.error({
    //             message: "Insufficient Payment",
    //             description: "Paid amount is not sufficient, please check again!",
    //             placement: "top",
    //             style: {
    //                 backgroundColor: "#ece5e5ff",
    //                 outline: "1px solid #ff4d4f",
    //             },
    //         });
    //         return;
    //     }

    //     try {
    //         const order_details = state.cart_list.map(item => ({
    //             product_id: item.id || 'Guest',
    //             product_name: item.name,
    //             qty: item.cart_qty,
    //             price: Number(item.price),
    //             discount: Number(item.discount || 0),
    //             total: Number((item.cart_qty * item.price * (1 - (item.discount || 0) / 100)).toFixed(2)),
    //             sugarLevel: item.sugarLevel
    //         }));
    //         const param = {
    //             order: {
    //                 total_amount: objSummary.total,
    //                 paid_amount: objSummary.total_paid,
    //                 total_qty: objSummary.total_qty,
    //                 save_discount: objSummary.save_discount,

    //                 // Convert null to 'Guest'
    //                 customer_id: objSummary.customer_id ? objSummary.customer_id : 'Guest',
    //                 customer_name: objSummary.customer_name ? objSummary.customer_name : 'Guest',

    //                 payment_method: objSummary.payment_method || 'Cash',
    //                 remark: objSummary.remark || '',
    //             },
    //             order_details: order_details,
    //         };

    //         const res = await request("order", "post", param);

    //         if (res && !res.error) {
    //             message.success("Order completed successfully!");

    //             const invoiceData = {
    //                 ...objSummary,
    //                 order_no: res.order?.order_no,
    //                 order_date: res.order?.create_at
    //             };

    //             setObjSummary(invoiceData);

    //             setTimeout(() => {
    //                 handlePrintInvoice();

    //                 setTimeout(() => {
    //                     handleClearCart();

    //                     setObjSummary({
    //                         sub_total: 0,
    //                         total_qty: 0,
    //                         save_discount: 0,
    //                         tax: 10,
    //                         total: 0,
    //                         total_paid: 0,
    //                         customer_id: null,          // reset to null
    //                         customer_name: null,       // reset to null
    //                         payment_method: null,
    //                         remark: '0',
    //                         order_no: null,
    //                         order_date: null,
    //                     });

    //                 }, 1000);
    //             }, 500);

    //         } else {
    //             throw new Error(res.error || 'Failed to complete order');
    //         }

    //     } catch (error) {
    //         notification.error({
    //             message: "Order Failed",
    //             description: error.message || "Failed to complete the order. Please try again.",
    //             placement: "top",
    //         });
    //     }
    // };

    // Move print handlers above finalizeSuccess to avoid TDZ on dependency array
    const onBeforePrint = React.useCallback(() => {
        console.log("`onBeforePrint` called");
        return Promise.resolve();
    }, []);

    const onAfterPrint = React.useCallback((event) => {
        handleClearCart();
        console.log("`onAfterPrint` called", event);
    }, [handleClearCart]);

    const onPrintError = React.useCallback(() => {
        console.log("`onPrintError` called");
    }, []);

    const handlePrintInvoice = useReactToPrint({
        // content: () => refInvoice.current,        // required
        // onBeforePrint,                            // optional
        // onAfterPrint,                             // optional
        // onPrintError,                             // optional
        contentRef: refInvoice,
        onBeforePrint: onBeforePrint,
        onAfterPrint: onAfterPrint,
        onPrintError: onPrintError,
    });

    const finalizeSuccess = useCallback(() => {
        if (pollRef.current) clearInterval(pollRef.current);
        if (timerRef.current) clearInterval(timerRef.current);
        setQrModal((m) => ({ ...m, status: 'paid' }));

        // Print and cleanup
        setTimeout(() => {
            handlePrintInvoice();
            setTimeout(() => {
                handleClearCart();
                setObjSummary({
                    sub_total: 0,
                    total_qty: 0,
                    save_discount: 0,
                    tax: 10,
                    total: 0,
                    total_paid: 0,
                    customer_id: null,
                    customer_name: null,
                    payment_method: null,
                    remark: '0',
                    order_no: null,
                    order_date: null,
                });
                setQrModal({ open: false, qr: '', md5: '', expiresAt: 0, status: 'pending' });
                message.success('Payment successful');
            }, 800);
        }, 400);
    }, [handleClearCart, handlePrintInvoice, setObjSummary]);

    const handleExpired = useCallback(() => {
        if (pollRef.current) clearInterval(pollRef.current);
        if (timerRef.current) clearInterval(timerRef.current);
        setQrModal((m) => ({ ...m, status: 'expired' }));
        notification.warning({
            message: 'QR Expired',
            description: 'The KHQR has expired. Please try again.',
            placement: 'top'
        });
    }, []);

    const handleForceComplete = useCallback(async () => {
        try {
            if (!qrModal.md5) return;
            setForceLoading(true);
            const res = await request('payment/force', 'post', { md5: qrModal.md5 });
            if (res && !res.error) {
                finalizeSuccess();
            } else {
                throw new Error(res?.message || 'Failed to force-complete payment');
            }
        } catch (e) {
            notification.error({ message: 'Force Complete Failed', description: e.message || 'Could not complete payment manually.' });
        } finally {
            setForceLoading(false);
        }
    }, [qrModal.md5, finalizeSuccess]);

    const handleClickOut = async () => {
        const isQR = (objSummary.payment_method || 'Cash') === 'QR';
        // For cash, ensure sufficient payment; for QR, allow to proceed
        if (!isQR && objSummary.total_paid < objSummary.total) {
            notification.error({
                message: "Insufficient Payment",
                description: "Paid amount is not sufficient, please check again!",
                placement: "top",
                style: {
                    backgroundColor: "#ece5e5ff",
                    outline: "1px solid #ff4d4f",
                },
            });
            return;
        }

        try {
            // Prepare order details with complete item information
            const order_details = state.cart_list.map(item => ({
                product_id: item.id || 'Guest',
                product_name: item.name,
                qty: item.cart_qty,
                price: Number(item.price),
                discount: Number(item.discount || 0),
                total: Number((item.cart_qty * item.price * (1 - (item.discount || 0) / 100)).toFixed(2)),
                sugarLevel: item.sugarLevel
            }));

            const param = {
                order: {
                    total_amount: objSummary.total,
                    paid_amount: isQR ? 0 : objSummary.total_paid,
                    total_qty: objSummary.total_qty,
                    save_discount: objSummary.save_discount,
                    customer_id: objSummary.customer_id || 'Guest',
                    customer_name: objSummary.customer_name || 'Guest',
                    payment_method: objSummary.payment_method || 'Cash',
                    remark: objSummary.remark || '',
                },
                order_details: order_details,
            };

            const res = await request("order", "post", param);

            if (res && !res.error) {
                // Branch by payment method
                if ((objSummary.payment_method || 'Cash') === 'QR') {
                    if (!res.qr || !res.md5) {
                        throw new Error('Failed to generate KHQR');
                    }

                    // Set invoice metadata for later printing
                    setObjSummary(prev => ({
                        ...prev,
                        order_no: res.order?.order_no,
                        order_date: res.order?.create_at
                    }));

                    // Open QR modal and start timers/polling
                    setQrModal({ open: true, qr: res.qr, md5: res.md5, expiresAt: res.expiresAt, status: 'pending' });
                    setQrRemainMs(Math.max(0, (res.expiresAt || 0) - Date.now()));

                    if (timerRef.current) clearInterval(timerRef.current);
                    timerRef.current = setInterval(() => {
                        setQrRemainMs((prev) => {
                            const next = Math.max(0, prev - 1000);
                            if (next <= 0 && timerRef.current) {
                                clearInterval(timerRef.current);
                            }
                            return next;
                        });
                    }, 1000);



                    if (pollRef.current) clearInterval(pollRef.current);
                    pollRef.current = setInterval(async () => {
                        try {
                            const check = await request('payment/check', 'post', { md5: res.md5 });
                            if (check && !check.error) {
                                const localStatus = check.data?.local_status;
                                const bakongStatus = check.data?.bakong_status;
                                if (localStatus === 'paid' || bakongStatus === 'SUCCESS' || bakongStatus === 'MANUAL_CONFIRMED') {
                                    finalizeSuccess();
                                } else if (localStatus === 'expired' || Date.now() > (res.expiresAt || 0)) {
                                    handleExpired();
                                }
                            }
                        } catch {
                            // ignore transient errors
                        }
                    }, 3000);

                    // Do not proceed further here for QR; wait for polling
                    return;
                } else {
                    // Cash flow (existing)
                    message.success("Order completed successfully!");

                    const invoiceData = {
                        ...objSummary,
                        order_no: res.order?.order_no,
                        order_date: res.order?.create_at
                    };
                    setObjSummary(invoiceData);

                    setTimeout(() => {
                        handlePrintInvoice();
                        setTimeout(() => {
                            handleClearCart();
                            setObjSummary({
                                sub_total: 0,
                                total_qty: 0,
                                save_discount: 0,
                                tax: 10,
                                total: 0,
                                total_paid: 0,
                                customer_id: null,
                                customer_name: null,
                                payment_method: null,
                                remark: '0',
                                order_no: null,
                                order_date: null,
                            });
                        }, 1000);
                    }, 500);
                }
            } else {
                throw new Error(res.error || 'Failed to complete order');
            }

        } catch (error) {
            notification.error({
                message: "Order Failed",
                description: error.message || "Failed to complete the order. Please try again.",
                placement: "top",
            });
        }
    };
    // moved print handlers above

    return (
        <MainPage loading={state.loading}>
            <div style={{ display: "none" }}>
                <PrintInvoice
                    ref={refInvoice}
                    cart_list={state.cart_list}
                    objSummary={{
                        ...objSummary,
                        // customer_id: objSummary.customer_id ? String(objSummary.customer_id) : "VIP Customer",
                        //customer_id: objSummary.customer_id ? String(objSummary.customer_id ?? "VIP Customer") : "VIP Customer",
                        customer_id: objSummary.customer_name ? String(objSummary.customer_name ?? "VIP Customer") : "VIP Customer",
                    }}
                    cashier={profile?.name || 'System'}
                // ...other props
                />
                {/* <PrintInvoice
                    ref={refInvoice}
                    cart_list={state.cart_list}
                    objSummary={objSummary}
                    cashier={profile?.name || 'System'}
                /> */}
            </div>

            {/* KHQR Payment Modal */}
            <Modal
                open={qrModal.open}
                onCancel={() => {
                    if (pollRef.current) clearInterval(pollRef.current);
                    if (timerRef.current) clearInterval(timerRef.current);
                    setQrModal({ open: false, qr: '', md5: '', expiresAt: 0, status: 'pending' });
                }}
                footer={null}
                title="Scan to Pay (KHQR)"
                destroyOnClose
                centered
            >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                        <QRCodeSVG value={qrModal.qr} size={240} includeMargin={true} />
                        <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            background: 'white',
                            padding: '2px 6px',
                            borderRadius: 4,
                            fontWeight: 'bold',
                            fontSize: 20,
                            color: 'rgba(27, 202, 41, 0.9)',
                        }}>
                            ${objSummary.total.toFixed(2)}
                        </div>
                    </div>
                    <div style={{ marginTop: 8 }}>
                        {qrModal.status === 'paid' ? (
                            <span style={{ color: 'green', fontWeight: 'bold', fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{t('pos.labels.paymentsuccess')}</span>
                        ) : qrModal.status === 'expired' ? (
                            <span style={{ color: 'red', fontWeight: 'bold', fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{t('pos.labels.qrexpire')}</span>
                        ) : (
                            <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>
                                {t('pos.labels.expirein')}: {Math.max(0, Math.floor(qrRemainMs / 1000))}{t('pos.labels.second')}
                            </span>
                        )}
                    </div>
                    {qrModal.status === 'pending' && qrModal.md5 && (
                        <div style={{ marginTop: 12 }}>
                            <Button type="primary" loading={forceLoading} onClick={handleForceComplete} style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>
                                {t('pos.labels.makeassprint')}
                            </Button>
                        </div>
                    )}
                    {/* {qrModal.qr ? ( 
                            <QRCodeSVG value={qrModal.qr} size={240} includeMargin={true} /> 
                    ) : (
                        <Empty description="Waiting for QR..." />
                    )} */}


                    {/* <div style={{ textAlign: 'center' }}>
                        <div style={{ fontWeight: 'bold',fontSize:'16px' }}>Amount: ${objSummary.total.toFixed(2)}</div> 
                        <div style={{ marginTop: 8 }}>
                            {qrModal.status === 'paid' ? (
                                <span style={{ color: 'green', fontWeight: 'bold' }}>Payment successful</span>
                            ) : qrModal.status === 'expired' ? (
                                <span style={{ color: 'red', fontWeight: 'bold' }}>QR expired</span>
                            ) : (
                                <span>
                                    Expires in: {Math.max(0, Math.floor(qrRemainMs / 1000))}s
                                </span>
                            )}
                        </div>
                        {qrModal.status === 'pending' && qrModal.md5 && (
                            <div style={{ marginTop: 12 }}>
                                <Button type="primary" loading={forceLoading} onClick={handleForceComplete}>
                                    Mark as Paid & Print
                                </Button>
                            </div>
                        )}
                    </div> */}
                </div>
            </Modal>
            {/* <Row gutter={24} style={{ height: 'calc(100vh - 64px)', overflow: 'hidden' }}></Row> */}
            <Row gutter={24} style={{ height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
                <Col span={16} style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: '1rem' }}>
                    <div
                        // style={{ marginBottom: '1rem' }}
                        style={{ margin: 0, padding: 0 }}
                    >
                        <Space >
                            {/* <Typography.Title level={3} style={{ margin: 0 }}>Products</Typography.Title> */}
                            <Flex style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>
                                <Input
                                    placeholder={t('common.search')}
                                    prefix={<FiSearch />}
                                    className="khmer-search"
                                    value={filter.txt_search || ""}
                                    onChange={(event) =>
                                        setFilter((prev) => ({
                                            ...prev,
                                            txt_search: event.target.value,
                                        }))
                                    }
                                    allowClear
                                    style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}
                                />
                            </Flex>
                        </Space>

                        <div style={{ marginBottom: '1rem' }}>
                            <Typography.Title level={5} style={{ marginBottom: '1rem', color: '#595959', fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{t('pos.labels.categorie')}</Typography.Title>
                            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: '0.5rem', fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>
                                {categories.map((category) => {
                                    {/* const isSelected = String(filter.category_name) === String(category.name); */ }
                                    const isSelected = category.id === filter.category_id;
                                    return (
                                        <Card
                                            key={category.name}
                                            hoverable
                                            size="small"
                                            onClick={() => {
                                                setFilter((prev) => ({
                                                    ...prev,
                                                    category_id: category.id,
                                                }));
                                                // Filtering will be triggered automatically by useEffect
                                            }}
                                            style={{
                                                minWidth: 90,
                                                textAlign: 'center',
                                                backgroundColor: isSelected ? '#e6f7ff' : '#ffffff',
                                                border: isSelected ? '1px solid #1890ff' : '1px solid #f0f0f0',
                                                borderRadius: 8,
                                                cursor: 'pointer',
                                                transition: 'all 0.3s',
                                                fontFamily: 'Noto Sans Khmer, Roboto, sans-serif'
                                            }}
                                            styles={{ body: { padding: 12 } }}
                                        >
                                            <Space direction="vertical" size={4} align="center" style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>
                                                <div style={{ fontSize: '1.5rem', lineHeight: 1, color: isSelected ? '#1890ff' : '#595959' }}>{category.icon}</div>
                                                <Text style={{
                                                    fontWeight: isSelected ? 600 : 400,
                                                    fontSize: 12,
                                                    color: isSelected ? '#1890ff' : '#595959',
                                                    fontFamily: 'Noto Sans Khmer, Roboto, sans-serif'
                                                }}>
                                                    {category.name}
                                                </Text>
                                            </Space>
                                        </Card>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <div style={{
                        flex: 1,
                        overflowY: 'auto',
                        paddingRight: '12px',
                        marginRight: '-8px',
                        marginTop: '1rem'
                    }}>
                        <Row gutter={[16, 16]}>
                            {state.list.length === 0 ? (
                                <Col span={24} style={{ textAlign: 'center', padding: '32px' }}>
                                    <Empty
                                        description={
                                            <span style={{ color: '#595959', fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>
                                                {t('pos.labels.notfound')}
                                            </span>
                                        }
                                    />
                                </Col>
                            )
                                :
                                (
                                    state.list.map((item, index) => (
                                        <Col key={index} span={8}>
                                            <ProductItem {...item} handleAdd={handleAdd} />
                                        </Col>
                                    ))
                                )
                            }
                        </Row>
                    </div>
                </Col>
                <Col span={8}>
                    <div>
                        <CartView
                            state={state}
                            objSummary={objSummary}
                            setObjSummary={setObjSummary}
                            customers={[
                                // { value: 'walk-in', label: 'Walk in customer' },
                                ...(state.customers || []).map(customer => ({
                                    value: customer.id || customer.value,
                                    label: customer.name || customer.label
                                }))
                            ]}
                            handleClearCart={handleClearCart}
                            handleIncrease={handleIncrease}
                            handleDescrease={handleDescrease}
                            handleRemove={handleRemove}
                            handleClickOut={handleClickOut}
                        />
                    </div>
                    <div style={{ width: '100%', alignItems: 'center', justifyContent: 'center', display: 'flex', margin: '0 0 6px 0' }}><Exchange /></div>
                </Col>
            </Row>
        </MainPage>
    );
}
PrintInvoice.propTypes = {
    objSummary: PropTypes.shape({
        customer_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.oneOf([null])]),
        customer_name: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]),
        // ...other props
    }),
    // ...
};
ProductItem.propTypes = {
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    images: PropTypes.arrayOf(PropTypes.string),
    category_name: PropTypes.string.isRequired,
    brand: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    discount: PropTypes.number,
    final_price: PropTypes.number,
    qty: PropTypes.number,
    handleAdd: PropTypes.func.isRequired,
};
export default PosPage;