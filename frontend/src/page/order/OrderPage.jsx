import React, { useEffect, useState, useTransition } from "react";
import {
    Button,
    DatePicker,
    Image,
    message,
    Modal,
    Space,
    Table,
    Tag,
} from "antd";
import { formatDateServer, request, formatDateClient } from "../../util/helper";
import { MdDelete } from "react-icons/md";
import MainPage from "../../component/layout/MainPage";
import { IoMdEye } from "react-icons/io";
import { Config } from "../../util/config";
import dayjs from "dayjs";
import { DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { FaSearch } from "react-icons/fa";
import { useTranslation } from "react-i18next"; 
import { useReactToPrint } from "react-to-print";
import PrintInvoice from "../../component/pos/PrintInvoice";

function OrderPage() {
    const {t} = useTranslation();
    const [list, setList] = useState([]);
    const [orderDetail, setOrderDetails] = useState([]);
    const user = JSON.parse(localStorage.getItem("profile")); //print by user.role_name on profile
    const cashierName = (user && (user.name || user.username)) || 'System';
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(false);
    const [state, setState] = useState({
        visibleModal: false,
        // txtSearch: "",
    });
    //const user = JSON.parse(localStorage.getItem("user")); //check it for get user 
    const [filter, setFiler] = useState({
        from_date: dayjs().subtract(5, "d"), // current
        to_date: dayjs().add(0, "d"), // current
    });

    useEffect(() => {
        const link = document.createElement('link');
        link.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans+Khmer:wght@400;700&family=Roboto:wght@400;700&display=swap';
        link.rel = 'stylesheet';
        document.head.appendChild(link);
        return () => { document.head.removeChild(link); };
    }, []);

    useEffect(() => {
        getList();
    }, []);

    const getList = async (res) => {
        try {
            var param = {
                // txtSearch: state.txtSearch,
                from_date: formatDateServer(filter.from_date), // 2024-11-20
                to_date: formatDateServer(filter.to_date), // 2024-11-22
            };
            setLoading(true);
            const res = await request("order", "get", param);
            setLoading(false);
            if (res) {
                setList(res.list);
                setSummary(res.summary);
            }
        }
        catch (err) {
            res.send("data not get", err)
        }
    };
    const getOrderDetail = async (data) => {
        setLoading(true);
        const res = await request("order_detail/" + data.id, "get");
        setLoading(false);
        if (res) {
            // Ensure sugar_level is always defined
            const patchedList = (res.list || []).map(item => ({
                ...item,
                sugar_level: item.sugar_level ?? item.sugarLevel ?? 0
            }));
            setOrderDetails(patchedList);
            setState({
                ...state,
                visibleModal: true,
            });
        }
    };
    const refInvoice = React.useRef(null);
    const handlePrintInvoice = useReactToPrint({
        contentRef: refInvoice,
        onBeforePrint: () => {
            // Any setup before printing can be done here
            console.log("`onBeforePrint` called");
            return Promise.resolve();
        },
        onAfterPrint: () => {
            // Reset the print data after printing
            window.close();
        }
    });
    const onClickDelete = async (data) => {
        Modal.confirm({
            title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>លុប{data.id}</span>,
                content: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif', fontWeight: 'bold', color: '#e42020ff' }}>តើអ្នកចង់លុប {data.id} មែនទេ ?</span>,
                okText: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif', fontWeight: 'bold', color: '#e42020ff' }}>បាទ/ចាស</span>,
                okType: 'danger',
                cancelText: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif', fontWeight: 'bold', color: '#25a331ff' }}>ទេ!</span>,
            onOk: async () => {
                const res = await request("order", "delete", {
                    id: data.id,
                });
                if (res && !res.error) {
                    message.success(res.message);
                    getList();
                }
            },
        });
    };
    useEffect(() => {
        handlePrintInvoice();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const onCloseModal = () => {
        setState({
            ...state,
            visibleModal: false,
        });
    };
    // Calculate printSummary before returning JSX
    const printSummary = (() => {
        const order = list.find(o => o.id === orderDetail[0]?.order_id) || {};
        let sub_total = 0, save_discount = 0, total = 0;
        let change = 0; // Initialize change
        if (orderDetail && orderDetail.length > 0) {
            orderDetail.forEach(item => {
                const qty = Number(item.qty) || 0;
                const price = Number(item.price) || 0;
                const discount = Number(item.discount) || 0;
                const lineTotal = qty * price;
                sub_total += lineTotal;
                save_discount += (lineTotal * discount) / 100;
                total += lineTotal - (lineTotal * discount) / 100;
                change = (order.total_paid ?? total) - total; // calculate change
            });
        }
        return {
            ...order,
            order_no: order.order_no,
            order_date: order.order_date,
            customer_id: order.customer_name,
            payment_method: order.payment_method,
            sub_total: order.sub_total ?? sub_total,
            save_discount: order.save_discount ?? save_discount,
            total: order.total ?? total,
            total_paid: order.total_paid ?? total, // fallback: assume fully paid
            change: (order.total_paid ?? total) - total, // calculate change
        };
    })();

    return (
        <MainPage loading={loading}>
            <div className="pageHeader">
                <Space>
                    <div>
                        <div style={{ fontWeight: "bold", color: "#ed5125ff", fontSize: "20px", paddingBottom: "10px", fontFamily: 'Khmer OS Muol Light' }}>{t('order.table.orders')}</div>
                        <div style={{ fontSize: "16px", fontWeight: "bold", fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>
                            {t('order.table.orders')} &nbsp;: {summary?.total_order || 0}&nbsp; {t('order.table.bong')} <br /> {t('order.table.total_orders')} &nbsp;:{" "}&nbsp;
                            ${summary?.total_amount || 0}
                        </div>
                    </div>
                    {/* <Input.Search
                        onChange={(value) =>
                            setState((p) => ({ ...p, txtSearch: value.target.value }))
                        }
                        allowClear
                        onSearch={getList}
                        placeholder="Search"
                    /> */}
                    <DatePicker.RangePicker style={{ margin: "40px 0px 0px 20px", width: "400px" }}
                        value={filter.from_date && filter.to_date ? [dayjs(filter.from_date, "DD/MM/YYYY"), dayjs(filter.to_date, "DD/MM/YYYY")] : []}
                        allowClear={true}
                        format={"DD/MM/YYYY"}
                        onChange={(value) => {
                            setFiler((p) => ({
                                ...p,
                                from_date: value && value[0] ? value[0] : null,
                                to_date: value && value[1] ? value[1] : null
                                // from_date: value[0],
                                // to_date: value[1],
                            }));
                        }}
                        getList={getList}
                    />
                    <Button style={{ margin: "40px 0px 0px 20px" , fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}
                        type="primary" onClick={getList}>
                        <FaSearch />{t('common.filter')}
                    </Button>
                </Space>
            </div>
            <Modal
                open={state.visibleModal}
                style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}
                title={t('order.table.detail')}
                footer={null}
                onCancel={onCloseModal}
                width={800}
            >
                <Table
                    style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}
                    dataSource={orderDetail}
                    pagination={false}
                    columns={[
                        {
                            key: "p_name",
                            title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{t('order.table.product')}</span>,
                            dataIndex: "p_name", 
                            render: (data,row) => (
                                <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>
                                    {data}
                                    <div>{row.p_des}</div>
                                </span>
                            )
                            // render: (data, row) => (
                            //     <div>
                            //         <div style={{ fontWeight: "bold" }}>{data}</div>
                            //         <div>
                            //             {row.p_brand} -{row.p_des}
                            //         </div>
                            //         {/* <div>{row.p_des}</div> */}
                            //     </div>
                            // ),
                        },
                        {
                            key: "p_category_name",
                            title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{t('order.table.p_category_name')}</span>,
                            // dataIndex: "p_category_name",
                            dataIndex: "p_category_name",
                            render: (text) => (
                                <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>
                                    {text}
                                </span>
                            )
                        },
                        {
                            key: "p_image",
                            title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{t('order.table.p_image')}</span>,
                            dataIndex: "p_image",
                            render: (value) => (
                                <Image
                                    src={Config.image_path + value}
                                    alt=""
                                    style={{ width: 60, borderRadius: 5, margin: 0, padding: 0 }}
                                />
                            ),
                        },
                        {
                            key: "sugar_level",
                            title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{t('order.table.sugar_level')}</span>,
                            dataIndex: "sugar_level",
                            render: (value) => <Tag color="blue">{value}%</Tag>,
                        },
                        {
                            key: "qty",
                            title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{t('order.table.qty')}</span>,
                            dataIndex: "qty",
                        },
                        {
                            key: "price",
                            title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{t('order.table.price')}</span>,
                            dataIndex: "price",
                            render: (value) => <Tag color="green">{value}$</Tag>,
                        },
                        {
                            key: "discount",
                            title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{t('order.table.discount')}</span>,
                            dataIndex: "discount",
                            render: (value) => <Tag color="red">{value}%</Tag>,
                        },
                        {
                            key: "total",
                            title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{t('order.table.total')}</span>,
                            dataIndex: "total",
                            render: (value) => <Tag color="green">{value}$</Tag>,
                        }
                    ]}
                />
                <div style={{ marginTop: 16, textAlign: "right" }}>
                    <Button onClick={onCloseModal} style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{t('common.close')}</Button>
                    <Button
                        type="primary"
                        style={{ marginLeft: 10, fontFamily: 'Noto Sans Khmer, Roboto, sans-serif'}}
                        onClick={() => {
                            // Use getOrderDetail data for printing
                            if (orderDetail && orderDetail.length > 0) {
                                const detail = orderDetail[0];
                                const order = list.find(o => o.id === detail.order_id);
                                if (order) {
                                    setTimeout(() => {
                                        handlePrintInvoice();
                                    }, 300);
                                } else {
                                    message.error('Order info not found for printing');
                                }
                            } else {
                                message.error('No order details available to print');
                            }
                        }}
                    >
                        {t('common.print')}
                    </Button>
                </div>
            </Modal>
            {state.visibleModal && (
                <div style={{ display: 'none' }}>
                    <PrintInvoice
                        ref={refInvoice}
                        cart_list={orderDetail.map(item => ({
                            name: item.p_name,
                            cart_qty: item.qty,
                            price: item.price,
                            discount: item.discount,
                            sugarLevel: item.sugar_level || 0
                        }))}
                        objSummary={printSummary}
                        cashier={cashierName || ''}
                    />
                </div>
            )}
            <Table
                dataSource={list}
                columns={[
                    {
                        key: "No",
                        title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{t('common.number')}</span>,
                        dataIndex: "No",
                        render: (value, data, index) => index + 1,
                    },
                    {
                        key: "order_no",
                        title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{t('order.table.order_no')}</span>,
                        dataIndex: "order_no",
                        render: (value) => <div style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{value}</div>,
                    },
                    {
                        key: "customer_name",
                        title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{}{t('order.table.customer')}</span>,
                        dataIndex: "customer_name",
                        render: (value, data) => (
                            <div>
                                <div style={{ fontWeight: "bold", fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{data.customer_name}</div>
                                <div style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{data.customer_tel}</div>
                                <div style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{data.customer_address}</div>
                            </div>
                        ),
                    },
                    {
                        key: "total_amount",
                        title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{t('order.table.total_amount')}</span>,
                        dataIndex: "total_amount",
                        // render: (value) => ' $' + parseFloat(value).toFixed(2)
                        render: (value) => (<div style={{ fontWeight: "bold", color: '#e13333ff' }}>${value}</div>),
                    },
                    {
                        key: "paid_amount",
                        title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{t('order.table.paid_amount')}</span>,
                        dataIndex: "paid_amount",
                        render: (value) => (<div style={{ fontWeight: "bold", color: '#3bb722ff' }}>${value}</div>),
                    },
                    {
                        key: "Due",
                        title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{t('order.table.pay_back')}</span>,
                        render: (value, data) => (
                            <Tag color="red">$
                                {(Number(data.total_amount) - Number(data.paid_amount)).toFixed(
                                    2
                                )}
                            </Tag>
                        ),
                    },
                    {
                        key: "payment_method",
                        title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{t('order.table.payment_method')}</span>,
                        dataIndex: "payment_method",
                    },
                    {
                        key: "remark",
                        title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{t('order.table.remark')}</span>,
                        dataIndex: "remark",
                    },
                    {
                        key: "create_by",
                        title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{t('order.table.cashier')}</span>,
                        dataIndex: "create_by",
                        render: (value) => <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{value}</span>,
                    },
                    {
                        key: "create_at",
                        title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{t('order.table.created_at')}</span>,
                        dataIndex: "create_at",
                        //render: (value) => formatDateClient(value, "DD/MM/YYYY h:mm A"),
                        //render: (date) => new Date(date).toLocaleDateString("en-GB", { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                        render: (date) =>
                            <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>
                                {formatDateClient(date)}
                            </span>
                    },
                    {
                        key: "Action",
                        title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{t('order.table.action')}</span>,
                        align: "center",
                        render: (item, data, index) => (
                            <Space>
                                <EyeOutlined
                                    style={{ color: "rgb(12, 59, 4)", fontSize: 20 }}
                                    type="primary"
                                    icon={<IoMdEye />}
                                    onClick={() => getOrderDetail(data, index)}
                                />
                                {/* <DeleteOutlined
                                    danger
                                    type="primary"
                                    icon={<MdDelete />}
                                    onClick={() => onClickDelete(data)}
                                    style={{ color: "red", fontSize: 20 }}
                                /> */}
                            </Space>
                        ),
                    },
                ]}
                pagination={{ defaultPageSize: 10, showSizeChanger: true, pageSizeOptions: ['10', '20', '50', '100'] }}
            />
        </MainPage>
    );
}

export default OrderPage;