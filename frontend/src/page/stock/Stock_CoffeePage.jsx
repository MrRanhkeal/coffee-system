import React, { useState, useEffect, useCallback } from 'react';
import { Button, Table, Modal, Form, Input, message, Select, Tag, Space, InputNumber } from 'antd';
import { request } from '../../util/helper';
import { DeleteOutlined, EditOutlined, EyeOutlined, FileAddFilled } from '@ant-design/icons';
import { MdDelete, MdEdit } from 'react-icons/md';
import { configStore } from '../../store/configStore';
import { IoMdEye } from 'react-icons/io';

function Stock_CoffeePage() {
    const [state, setState] = useState({
        loading: false,
        data: [],
        visibleModal: false,
        id: null,
        product_name: null,
        categories: null,
        qty: null,
        cost: null,
        total_cost: null,
        supplier_id: null,
        status: null
    });
    const { config } = configStore();
    const [suppliers, setSuppliers] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [editingId, setEditingId] = useState({});
    const [total_cost, setTotalCost] = useState(0);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState({
        product_name: "",
        categories: "",
        txtSearch: "",
    });
    // get suppliers list
    const getSuppliers = useCallback(async () => {
        try {
            const res = await request('supplier', 'get', {});
            if (res && !res.error && res.list) {
                setSuppliers(res.list);
            }
        } catch (error) {
            console.error('Failed to get suppliers:', error);
        }
    }, [setState, filter.product_name]);

    // get stock list
    const getList = useCallback(async () => {
        try {
            setState((p) => ({
                ...p,
                loading: true
            }));
            const res = await request('stock_coffee', 'get');
            if (res && !res.error) {
                // Calculate total_cost for each item
                const processedData = (res.data || []).map(item => ({
                    ...item,
                    total_cost: (parseFloat(item.cost) * parseFloat(item.qty)).toFixed(2)
                }));
                setState((p) => ({
                    ...p,
                    data: processedData,
                    loading: false
                }))
            }
        }
        catch (error) {
            message.error(`Failed to get stock list: ${error.message}`);
            setState((p) => ({
                ...p,
                loading: false
            }));
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
        getSuppliers();
        getTotalProductCost();
    }, [getList, getSuppliers]);

    // Helper function to get supplier name by ID
    const getSupplierName = (supplierId) => {
        const supplier = suppliers.find(s => s.id === supplierId);
        return supplier ? supplier.name : `ID: ${supplierId}`;
    };
    const getTotalProductCost = useCallback(async () => {
        //setLoading(true);
        try {
            const res = await request('total_coffee_cost', 'get');
            if (res && !res.error) {
                setData(res);
                setTotalCost(res.total_cost || null);
            }
            else {
                setData([]);
                // setSummary(null);
                setTotalCost(null);
                message.info('No total product cost data found.');
            }
        }
        catch (err) {
            console.error('Failed to get total product cost data.', err);
        }
        finally {
            setLoading(false);
        }
    });
    // Handle form submission for both create and update
    const onFinish = async (values) => {
        try {
            setState((p) => ({
                ...p,
                loading: true
            }));

            const method = editingId ? "put" : "post";

            // Calculate new total quantity
            const updatedQty = parseInt(values.qty) + parseInt(values.newQty || 0);

            const payload = {
                // name: values.name,
                product_name: values.product_name,
                categories: values.categories,
                qty: updatedQty,
                cost: values.cost,
                supplier_id: values.supplier_id,
                description: values.description,
                status: values.status
            };

            if (method === "put") {
                payload.id = editingId;
            }

            const res = await request('stock_coffee', method, payload);

            if (res && !res.error) {
                message.success(`Stock ${editingId ? 'updated' : 'created'} successfully`);
                setIsModalVisible(false);
                form.resetFields();
                setEditingId(null);
                getList();
            } else {
                message.error(res.error || 'Failed to save stock');
            }
        } catch (error) {
            message.error(error.message);
        } finally {
            setState((p) => ({
                ...p,
                loading: false
            }));
        }
    };
    const openModal = () => {
        form.setFieldsValue({
            // name: '',
            product_name: '',
            categories: '',
            qty: 0,
            newQty: 0,
            cost: 0,
            supplier_id: undefined,
            description: '',
            status: 1
        });
        setEditingId(null);
        setIsModalVisible(true);
    };
    const onClickDelete = async (record) => {
        try {
            Modal.confirm({
                title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>ការលុបទំនិញ</span>,
                // content: `តើអ្នកចង់លុបទំនិញនេះមែនទេ! ${record.product_name} ?`,
                content: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif', fontWeight: 'bold', color: '#e42020ff' }}>តើអ្នកចង់លុបទំនិញនេះមែនទេ! {record.product_name} ?</span>,
                //okText: 'បាទ/ចាស',
                okText: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif', fontWeight: 'bold', color: '#e42020ff' }}>បាទ/ចាស</span>,
                okType: 'danger',
                cancelText: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif', fontWeight: 'bold', color: '#25a331ff' }}>ទេ!</span>,
                onOk: async () => {
                    const res = await request('stock_coffee', 'delete', { id: record.id });
                    if (res && !res.error) {
                        message.success('Stock deleted successfully');
                        getList();
                    }
                }
            })
        } catch (error) {
            message.error(`Delete failed: ${error.message}`);
        }
    };
    const clickReadOnly = (record) => {
        setState({
            ...state,
            visibleModal: true,
            isReadOnly: true,
            id: record.id
        });
        form.setFieldsValue({
            id: record.id,
            product_name: record.product_name,
            categories: record.categories,
            qty: record.qty,
            cost: record.cost,
            supplier_id: record.supplier_id,
            description: record.description,
            status: record.status,
        });
    }
    //upadte stock current qty + new qty
    const onClickEdit = (record) => {
        form.setFieldsValue({
            //...record, 
            // name: record.name,
            product_name: record.product_name,
            categories: record.categories,
            qty: record.qty,
            newQty: 0,  // Initialize additional quantity to 0
            cost: record.cost,
            supplier_id: record.supplier_id,
            description: record.description,
            status: record.status
        });
        setEditingId(record.id);
        setIsModalVisible(true);
    };
    return (
        <div style={{ margin: 0, padding: 0, fontSize: "20px", color: "rgb(237, 53, 53)", fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }} loading={loading}>
            <div style={{ margin: '20px 0', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}> 
                {(() => {
                    const TotalCost = Array.isArray(total_cost) && total_cost.length > 0
                        ? total_cost[0].total_cost || 0
                        : 0;
                    return <span>ការចំណាយសរុប: ${Number(TotalCost).toFixed(2)}</span>;
                })()}
            </div>
            <div style={{ marginBottom: 2, textAlign: 'right', fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>
                <Button
                    Button type="primary"
                    onClick={openModal}
                    style={{ padding: "10px", marginBottom: "10px", marginLeft: "auto", fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}
                >
                    <FileAddFilled style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }} />បញ្ចូលថ្មី
                </Button>
            </div>
            <div style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif', fontWeight: 'bold', margin: '0 0 10px 0' }}>ស្តុកកាហ្វេ</div>
            <Modal
                style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}
                open={state.visibleModal || isModalVisible}
                title={state.isReadOnly ? "មើល" : editingId ? "កែប្រែ" : (editingId && editingId.id ? "" : "បញ្ចូលថ្មី")}
                onCancel={() => {
                    setIsModalVisible(false);
                    setState(p => ({ ...p, visibleModal: false, isReadOnly: false }));
                    form.resetFields();
                    setEditingId(null);
                }}
                footer={state.isReadOnly ? [
                    <Button key="close" type="primary"
                        style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}
                        onClick={() => {
                            setIsModalVisible(false);
                            setState(p => ({ ...p, visibleModal: false, isReadOnly: false }));
                            form.resetFields();
                            setEditingId(null);
                        }}>
                        បិទ
                    </Button>
                ] : null}
                width={600}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}
                >
                    <Form.Item
                        name="product_name"
                        label={<span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>ឈ្មោះទំនិញ</span>}
                        rules={[
                            {
                                required: true,
                                message: 'សូមបញ្ចូល ឈ្មោះទំនិញ!'
                            }
                        ]}
                    >
                        <Select
                            style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}
                            placeholder="ជ្រើសរើស ឈ្មោះទំនិញ"
                            showSearch
                            allowClear
                            // options={(config.product_name || []).map(item => ({
                            //     label: item.label,
                            //     value: item.value
                            // }))}
                            options={config.product_name?.map((opt) => ({
                                value: opt.value,
                                label: (
                                    <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>
                                        {opt.label}
                                    </span>
                                )
                            }))}
                            onChange={(value) => {
                                setFilter(prev => ({
                                    ...prev,
                                    product_name: value
                                }));
                                getList();
                            }}
                            disabled={state.isReadOnly}
                        />

                    </Form.Item>
                    <Form.Item
                        name="categories"
                        label={<span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>ប្រភេទទំនិញ</span>}
                        style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}
                        rules={[{ required: true, message: 'សូមបញ្ចូលប្រភេទទំនិញ!' }]}
                    >
                        <Select
                            style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}
                            placeholder="ជ្រើសរើសប្រភេទទំនិញ"
                            showSearch
                            allowClear
                            optionFilterProp="children" 
                            options={config.categories?.map((opt) => ({
                                value: opt.value,
                                label: (
                                    <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>
                                        {opt.label}
                                    </span>
                                )
                            }))}
                            onChange={(value) => {
                                setFilter(prev => ({
                                    ...prev,
                                    categories: value
                                }));
                                getList();
                            }}
                            disabled={state.isReadOnly}
                        />
                    </Form.Item>
                    <Form.Item
                        name="supplier_id"
                        label={<span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>អ្នកផ្គត់ផ្គង់ទំនិញ</span>}
                        style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}
                        rules={[{ required: true, message: 'Please select a supplier!' }]}
                    >
                        <Select
                            style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}
                            placeholder="ជ្រើសរើសអ្នកផ្គត់ទំនិញ"
                            showSearch
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                            disabled={state.isReadOnly}
                        >
                            {suppliers.map(supplier => (
                                <Select.Option key={supplier.id} value={supplier.id} style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>
                                    {supplier.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="qty"
                        label={<span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>ចំនួនទំនិញក្នុងស្តុក</span>}
                        style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}
                    >
                        <InputNumber disabled min={0} style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        name="newQty"
                        label={<span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>ចំនួនបន្ថែម</span>}
                        style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}
                        rules={[{ required: true, message: 'Please input quantity to add!' }]}
                    >
                        <InputNumber min={0} style={{ width: '100%', fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }} placeholder="បញ្ចូលចំនួនបន្ថែម" disabled={state.isReadOnly} />
                    </Form.Item>
                    <Form.Item
                        name="cost"
                        label={<span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>ការចំណាយ/Kg</span>}
                        style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}
                    >
                        <InputNumber
                            min={0}
                            style={{ width: '100%' }}
                            formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                            step={0.5}
                            disabled={state.isReadOnly}
                        />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label={<span style={{ fontFamily: '"Noto Sans Khmer", Roboto, sans-serif' }}>ពណ៌នា</span>}
                        style={{ fontFamily: '"Noto Sans Khmer", Roboto, sans-serif' }}
                        rules={[{ required: true, message: 'Please input description!' }]}
                    >
                        <Input.TextArea
                            style={{ fontFamily: '"Noto Sans Khmer", Roboto, sans-serif' }}
                            rows={3}
                            placeholder="ពណ៌នា"
                            disabled={state.isReadOnly}
                        />
                    </Form.Item>


                    <Form.Item
                        name="status"
                        label={<span style={{ fontFamily: '"Noto Sans Khmer", Roboto, sans-serif' }}>ស្ថានភាព</span>}
                        style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}
                        initialValue={1}
                    >
                        <Select
                            placeholder="សូមជ្រើសរើសស្ថានភាព"
                            style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}
                            disabled={state.isReadOnly}
                        >
                            <Select.Option value={1} style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>សកម្ម</Select.Option>
                            <Select.Option value={0} style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>អសកម្ម</Select.Option>
                        </Select>
                    </Form.Item>

                    {!state.isReadOnly && (
                        <Form.Item
                            style={{ textAlign: "right" }}
                        >
                            <Button
                                style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif', marginRight: '8px' }}
                                onClick={() => {
                                    setIsModalVisible(false);
                                    form.resetFields();
                                    setEditingId(null);
                                }}>
                                បោះបង់
                            </Button>
                            <Button type="primary" htmlType="submit" style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }} loading={state.loading}>
                                {editingId ? "កែប្រែ" : (editingId && editingId.id ? "" : "រក្សាទុក")}
                            </Button>

                        </Form.Item>
                    )}
                </Form>
            </Modal>
            <Table
                dataSource={state.data}
                columns={[
                    {
                        key: "id",
                        //title: "ល.រ",
                        title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>ល.រ</span>,
                        render: (item, data, index) => index + 1,
                    },
                    {
                        key: "product_name",
                        title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>ឈ្មោះទំនិញ</span>,
                        dataIndex: "product_name",
                        render: (data) => (
                            <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>
                                {data}
                            </span>
                        ),
                    },
                    {
                        key: "categories",
                        title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>ប្រភេទទំនិញ</span>,
                        dataIndex: "categories",
                        render: (data) => (
                            <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>
                                {data}
                            </span>
                        ),
                    },
                    {
                        key: "supplier_id",
                        title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>អ្នកផ្គត់ផ្គង់</span>,
                        dataIndex: "supplier_id",
                        // render: (data, row) => (
                        //     <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>
                        //         <div>{row.supplier_id}</div>
                        //     </span>
                        // )
                        render: (supplierId) => (
                            <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>
                                {getSupplierName(supplierId)}
                            </span>
                        )
                    },
                    {
                        key: "qty",
                        title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>ចំនួនក្នុងស្តុក</span>,
                        dataIndex: "qty",
                        render: (qty) => parseFloat(qty).toFixed(2) + ' Kg',
                    },
                    {
                        key: "cost",
                        title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>ចំណាយ/Kg</span>,
                        dataIndex: "cost",
                        render: (cost) => '$' + cost,
                    },
                    {
                        key: "total_cost",
                        title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>ចំណាយសរុប</span>,
                        dataIndex: "total_cost",
                        render: (total_cost) => '$' + total_cost,
                    },
                    {
                        key: "description",
                        title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>សម្គាល់</span>,
                        dataIndex: "description",
                        render: (description) => (
                            <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>
                                {description}
                            </span>
                        ),

                    },
                    {
                        key: "create_at",
                        title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>កាលបរិច្ឆេទបង្កើត</span>,
                        dataIndex: "create_at",
                        render: (date) => new Date(date).toLocaleDateString("en-GB", { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                    },
                    {
                        key: "status",
                        title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>ស្ថានភាព</span>,
                        dataIndex: "status",
                        render: (status) =>
                            status == 1 ? (
                                <Tag color="green" style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>សកម្ម</Tag>
                            ) : (
                                <Tag color="red" style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>អសកម្ម</Tag>
                            ),
                    },
                    {
                        key: "Action",
                        title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>សកម្មភាព</span>,
                        align: "center",
                        render: (item, data, index) => (
                            <Space>
                                <EditOutlined
                                    type="primary"
                                    style={{ color: "green", fontSize: 20 }}
                                    icon={<MdEdit />}
                                    onClick={() => onClickEdit(data, index)}
                                />
                                <DeleteOutlined
                                    type="primary"
                                    danger
                                    style={{ color: "red", fontSize: 20 }}
                                    icon={<MdDelete />}
                                    onClick={() => onClickDelete(data, index)}
                                />
                                <EyeOutlined
                                    style={{ color: 'rgb(12, 59, 4)', fontSize: 20 }}
                                    onClick={() => clickReadOnly(data)}
                                    icon={<IoMdEye />}
                                />
                            </Space>
                        ),
                    },
                ]}
            />
        </div>
    );
}

export default Stock_CoffeePage;