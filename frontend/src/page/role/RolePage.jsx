import { useEffect, useState } from "react";
import { request } from "../../util/helper";
import { Button, Form, Input, message, Modal, Space, Table, Select, Tag } from "antd";
import { DeleteOutlined, EditOutlined, FileAddFilled } from "@ant-design/icons";
import { } from "react-icons/md";

function RolePage() {
    // Define available routes for permission selection
    // const availableRoutes = [
    //     { value: 'order', label: 'Order' },
    //     { value: 'product', label: 'Product' },
    //     { value: 'report', label: 'Report' },
    //     // Add more routes as needed
    // ];
    const [state, setState] = useState({
        list: [],
        loading: true,
        visible: false
    });
    const [form] = Form.useForm();
    const permissionOptions = [
        { label: 'All', value: 'all' },
        { label: 'Dashboard', value: 'dashboard' },
        { label: 'POS', value: 'pos' },
        { label: 'Order', value: 'order' },
        { label: 'Customer', value: 'customer' },
        // management
        { label: 'Product', value: 'product' },
        { label: 'Category', value: 'category' },
        { label: 'Supplier', value: 'supplier' },
        { label: 'User', value: 'user' },
        { label: 'Role', value: 'role' },
        // expenses & stock
        { label: 'Expense', value: 'expanse' },
        { label: 'Stock', value: 'stock' },
        // reports
        { label: 'Sale Report', value: 'getsalereport' },
        { label: 'Sale Summary', value: 'get_sale_summary' },
    ];

    useEffect(() => {
        getList();
    }, []);

    // Get list of roles
    const getList = async () => {
        setState(pre => ({ ...pre, loading: true }));
        try {
            const res = await request("role", "get");
            if (res?.data) {
                setState(pre => ({
                    ...pre,
                    list: res.data
                }));
            }
        } catch {
            message.error("Failed to get roles");
        } finally {
            setState(pre => ({ ...pre, loading: false }));
        }
    };

    // Handle edit button click
    const handleEdit = (record) => {
        // normalize permission from DB to multi-select values
        let values = [];
        try {
            const perm = record.permission;
            if (perm === 'all') {
                values = ['all'];
            } else if (perm) {
                const parsed = typeof perm === 'string' ? JSON.parse(perm) : perm;
                if (parsed && parsed.all) {
                    values = ['all'];
                } else if (parsed && typeof parsed === 'object') {
                    values = Object.keys(parsed).filter(k => parsed[k]);
                }
            }
        } catch { /* no-op: ignore malformed permission */ }

        form.setFieldsValue({
            id: record.id,
            name: record.name,
            permission: values
        });
        setState(pre => ({ ...pre, visible: true }));
    };

    // Handle delete button click
    const handleDelete = (record) => {
        Modal.confirm({
            title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>លុប {record.name}</span>,
            content: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif', fontWeight: 'bold', color: '#e42020ff' }}>តើអ្នកចង់លុប {record.name} មែនទេ ?</span>,
            okText: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif', fontWeight: 'bold', color: '#e42020ff' }}>បាទ/ចាស</span>,
            okType: 'danger',
            cancelText: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif', fontWeight: 'bold', color: '#25a331ff' }}>ទេ!</span>,
            onOk: async () => {
                try {
                    const res = await request("role", "delete", { id: record.id });
                    if (res) {
                        message.success("Role deleted successfully");
                        getList();
                    }
                } catch {
                    message.error("Failed to delete role");
                }
            }
        });
    };

    // Handle form submission (create/update)
    const onFinish = async (values) => {
        const method = form.getFieldValue("id") ? "put" : "post";
        try {
            // Convert selected keys to permission payload
            let permissionPayload = null;
            const selected = Array.isArray(values.permission) ? values.permission : [];
            if (selected.includes('all')) {
                permissionPayload = 'all';
            } else {
                permissionPayload = {};
                selected.forEach(k => { permissionPayload[k] = true; });
            }

            const data = {
                name: values.name,
                permission: permissionPayload
            };

            // Add id for update operation
            if (method === "put") {
                data.id = form.getFieldValue("id");
            }

            const res = await request("role", method, data);
            if (res) {
                message.success(`Role ${method === "put" ? "updated" : "created"} successfully`);
                handleCancel();
                getList();
            }
        } catch {
            message.error(`Failed to ${method === "put" ? "update" : "create"} role`);
        }
    };

    // Handle modal cancel
    const handleCancel = () => {
        form.resetFields();
        setState(pre => ({ ...pre, visible: false }));
    };

    // Table columns configuration
    const columns = [
        {
            title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>ល.រ</span>,
            key: "index",
            width: 70,
            render: (_, __, index) => index + 1
        },
        {
            title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>ឈ្មោះតួនាទី</span>,
            dataIndex: "name",
            render: (text) => <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{text}</span>,
            key: "name",
            // style: {
            //     whiteSpace: "nowrap",
            //     overflow: "hidden",
            //     textOverflow: "ellipsis"
            // }
        },
        {
            title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>សិទ្ធិប្រើប្រាស់</span>,
            dataIndex: "permission",
            key: "permission",
            render: (permissionOptions) => {
                let tags = [];
                try {
                    if (permissionOptions === 'all') {
                        tags.push(<Tag color="blue" key="all" style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>All</Tag>);
                    } else if (permissionOptions) {
                        const parsed = typeof permissionOptions === 'string' ? JSON.parse(permissionOptions) : permissionOptions;
                        if (parsed && parsed.all) {
                            tags.push(<Tag color="blue" key="all" style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>All</Tag>);
                        } else if (parsed && typeof parsed === 'object') {
                            Object.keys(parsed).forEach(k => {
                                if (parsed[k]) {
                                    tags.push(<Tag color="green" key={k} style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif', textTransform: 'capitalize' }}>{k.replace(/=/g, ' ')}</Tag>);
                                }
                            });
                        }
                    }
                } catch {
                    console.log("Failed to parse permissions");
                }
                return <div>{tags.length > 0 ? tags : <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif', fontStyle: 'italic', color: '#7f11b3ff' }}>No Permissions</span>}</div>;
            }

        },
        {
            title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>សកម្មភាព</span>,
            key: "action",
            width: 150,
            render: (_, record) => (
                <Space>
                    <EditOutlined type="primary" style={{ color: "green", fontSize: 20 }} onClick={() => handleEdit(record)}>
                        Edit
                    </EditOutlined>
                    <DeleteOutlined danger style={{ color: "red", fontSize: 20 }} onClick={() => handleDelete(record)}>
                        Delete
                    </DeleteOutlined>
                </Space>
            )
        }
    ];

    return (
        <div className="page-content" >
            <div className="page-header" style={{ display: "flex" }}>
                <Button type="primary" onClick={() => setState(pre => ({ ...pre, visible: true }))} style={{ padding: "10px", marginBottom: "10px", marginLeft: "auto", fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}
                // icon={<FileAddTwoTone />}
                // style={{
                //     marginLeft: "auto",
                //     fontSize: 40,
                //     color: "green",
                // }}
                >
                    <FileAddFilled style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }} />
                    បញ្ចូលថ្មី
                </Button>
            </div>
            <h3 style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif', fontWeight: 'bold', margin: '0 0 10px 0' }}>តារាងគ្រប់គ្រងតួនាទី</h3>
            <Table
                columns={columns}
                dataSource={state.list}
                rowKey="id"
                loading={state.loading}
                pagination={{ pageSize: 10 }}
            />

            <Modal
                style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}
                title={form.getFieldValue("id") ? "កែប្រែ" : "បង្កើតថ្មី"}
                open={state.visible}
                onCancel={handleCancel}
                footer={null}
                destroyOnClose
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                >
                    <Form.Item name="id" hidden>
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="name"
                        label={<span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>ឈ្មោះតួនាទី</span>}
                        rules={[{ required: true, message: "Please input role name" }]}
                    >
                        <Input placeholder="ឈ្មោះតួនាទី" style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }} />
                    </Form.Item>
                    <Form.Item
                        name="permission"
                        label={<span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>សិទ្ធិប្រើប្រាស់</span>}
                    >
                        <Select
                            mode="multiple"
                            allowClear
                            placeholder="ជ្រើសសិទ្ធិ"
                            options={permissionOptions}
                            style={{ width: '100%', fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}
                        />
                    </Form.Item>
                    <Form.Item style={{ textAlign: "right" }}>
                        <Space>
                            <Button type="default" onClick={handleCancel} style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{state.isReadOnly ? "បិទ" : "បោះបង់"}</Button>
                            <Button type="primary" htmlType="submit"
                                style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}
                            >
                                {form.getFieldValue("id") ? "កែប្រែ" : "រក្សាទុក"}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default RolePage;