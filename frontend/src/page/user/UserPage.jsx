import { useEffect, useState } from "react";
import { request } from "../../util/helper";
import { Button, Form, Input, message, Modal, Select, Space, Table, Tag, } from "antd";
// import { resetWarned } from "antd/es/_util/warning";
// import { configStore } from "../../store/configStore";
import { MdDelete, MdEdit } from "react-icons/md";
import { DeleteOutlined, EditOutlined, EyeOutlined, FileAddFilled } from "@ant-design/icons";
import { IoMdEye } from "react-icons/io";
import { useTranslation } from "react-i18next";

function UserPage() {
    const [form] = Form.useForm();
    // const { config } = configStore();
    const { t } = useTranslation();
    const [list, setList] = useState([]);
    const [roles, setRoles] = useState([]);
    const [state, setState] = useState({
        list: [],
        role_id: null,
        loading: true,
        isEdit: false,
        editingUser: null,
        isReadOnly: false
    });
    useEffect(() => {
        getList();
        gethRoles();
    }, []);

    const getList = async () => {
        setState((prev) => ({ ...prev, loading: true }));
        try {
            const res = await request("auth/getlist", "get");
            if (res && !res.error) {
                setList(res.data || []); // Changed from res.list to res.data to match backend response
                setState(prev => ({
                    ...prev,
                    role: res.roles || [] // Store roles from the response
                }));
            }
        } catch (error) {
            // console.error("Failed to get list:", error);
            message.error("Failed to get user list", error);
        } finally {
            setState((prev) => ({ ...prev, loading: false }));
        }
    };

    const gethRoles = async () => {
        try {
            const res = await request("role", "get");
            if (res?.data) {
                setRoles(res.data);
            }
        } catch (error) {
            // console.error("Failed to get roles:", error);
            message.error("Failed to get roles", error);
        }
    };

    const clickBtnEdit = (record) => {
        form.setFieldsValue({
            id: record.id,
            name: record.name,
            username: record.username,
            // role_id: record.role_id,
            role_id: record.role_id,
            is_active: record.is_active
        });
        setState(prev => ({
            ...prev,
            visible: true,
            isEdit: true,
            editingUser: record
        }));
    };
    const clickReadOnly = (record) => {
        form.setFieldsValue({
            id: record.id,
            name: record.name,
            username: record.username,
            // role_id: record.role_id,
            role_id: record.role_id ? record.role_id : null,
            is_active: record.is_active
        });
        setState(prev => ({
            ...prev,
            visible: true,
            isEdit: false,
            isReadOnly: true,
            editingUser: record
        }));
    };
    const clickBtnDelete = async (record) => {
        try {
            Modal.confirm({
                title: (
                    <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>
                        {t('user.confirm.delete_title', { name: record.name })}
                    </span>
                ),
                content: (
                    <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif', fontWeight: 'bold', color: '#e42020ff' }}>
                        {t('user.confirm.delete_content', { name: record.name })}
                    </span>
                ),
                okText: (
                    <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif', fontWeight: 'bold', color: '#e42020ff' }}>
                        {t('common.yes')}
                    </span>
                ),
                okType: 'danger',
                cancelText: (
                    <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif', fontWeight: 'bold', color: '#25a331ff' }}>
                        {t('common.no')}
                    </span>
                ),
                onOk: async () => {
                    const res = await request(`auth/delete/${record.id}`, "delete");
                    if (res && !res.error) {
                        message.success(t('user.confirm.delete_success', { name: record.name }));
                        getList();
                    } else {
                        message.error(res.message || t('user.confirm.delete_failed', { name: record.name }));
                    }
                }
            });
        } catch (error) {
            message.error(t('user.confirm.delete_failed', { name: record.name }), error);
        }
    };
    // const clickBtnDelete = async (record) => {
    //     try {
    //         Modal.confirm({
    //             title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{t('user.confirm_delete', { name: record.name })}</span>,
    //             content: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif', fontWeight: 'bold', color: '#e42020ff' }}>{t('user.confirm_delete_content', { name: record.name })}</span>,
    //             okText: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif', fontWeight: 'bold', color: '#e42020ff' }}>{t('common.yes')}</span>,
    //             okType: 'danger',
    //             cancelText: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif', fontWeight: 'bold', color: '#25a331ff' }}>{t('common.no')}</span>,
    //             onOk: async () => {
    //                 const res = await request(`auth/delete/${record.id}`, "delete");
    //                 if (res && !res.error) {
    //                     message.success("User deleted successfully");
    //                     getList();
    //                 } else {
    //                     message.error(res.message || "Failed to delete user");
    //                 }
    //             }
    //         })
    //     }
    //     catch (error) {
    //         // console.error("Delete error:", error);
    //         message.error("Failed to delete user", error);
    //     }
    // };

    const handleCloseModal = () => {
        form.resetFields();
        setState((pre) => ({
            ...pre,
            visible: false,
            isEdit: false,
            editingUser: null,
            isReadOnly: false
        }));
        form.resetFields();
    };

    const handleOpenModal = () => {
        setState((pre) => ({
            ...pre,
            visible: true,
        }));
    };

    const onFinish = async (item) => {
        if (!state.isEdit && item.password !== item.confirm_password) {
            message.warning("Password and Confirm Password do not match!");
            return;
        }

        // Get the current user's name from the profile
        const currentUser = JSON.parse(localStorage.getItem('profile')) || {};
        const create_by = currentUser.name || 'system';

        const data = {
            ...item,
            role_id: state.role_id || item.role_id,
            create_by: state.isEdit ? undefined : create_by, // Only set create_by for new users
        };
        try {
            let res;
            if (state.isEdit) {
                // Update existing user
                res = await request("auth/update", "put", {
                    ...data,
                    id: state.editingUser.id
                });
            } else {
                // Create new user
                res = await request("auth/register", "post", data);
            }

            if (res && !res.error) {
                message.success(res.message || (state.isEdit ? "Update successful" : "Registration successful"));
                getList();
                handleCloseModal();
            }
            else {
                // Show backend message (fallback to default if not provided)
                const defaultMsg = state.isEdit
                    ? "Name or username already exists!"
                    : "Name or username already exists!";
                message.warning(res.message || defaultMsg);
            }
            // else { 
            //     message.warning(res.message || (!state.isEdit ? "name or username already exists!" : "name or email already exists!"));
            // }
        }
        catch (err) {
            console.error(state.isEdit ? "Update error:" : "Registration error:", err);
            message.error(`Something went wrong during ${state.isEdit ? "update" : "registration"}!`);
        }
    };
    return (
        <div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    paddingBottom: 10,
                }}
            >
                <Button type="primary"
                    style={{ padding: "10px", marginBottom: "10px", marginLeft: "auto", fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}
                    onClick={handleOpenModal}
                    allowClear
                >
                    <FileAddFilled style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }} />{t('common.new')}
                </Button>
            </div>
            <div style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif', fontWeight: 'bold' }}>{t('user.title')}</div>
            <Modal
                style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}
                open={state.visible}
                title={state.isReadOnly ? t('common.view') : (state.isEdit ? t('common.update') : t('common.new'))}
                onCancel={handleCloseModal}
                footer={null}
                maskClosable={false}
                keyboard={false}    
            >
                <Form layout="vertical" form={form} onFinish={onFinish}>
                    <Form.Item
                        name={"name"}
                        label={<span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{t('user.labels.name')}</span>}
                        rules={[
                            {
                                required: true,
                                message: "Please fill in name",
                            },
                        ]}
                    >
                        <Input placeholder={t('user.labels.name')} disabled={state.isReadOnly} style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }} />
                    </Form.Item>
                    <Form.Item
                        name={"username"}
                        label={<span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{t('user.labels.username')}</span>}
                        rules={[
                            {
                                required: true,
                                message: "សូមបញ្ចូលអ៊ីមែល",
                            },
                        ]}
                    >
                        <Input placeholder={t('user.labels.username')} disabled={state.isReadOnly} style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }} />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label={<span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{t('user.labels.password')}</span>}
                        rules={[{ required: true, message: 'សូមបញ្ចូលពាក្យសម្ងាត់!' }]}
                    >
                        <Input.Password placeholder={t('user.labels.password')} disabled={state.isReadOnly} visibilityToggle className="khmer-search" />
                    </Form.Item>
                    <Form.Item
                        style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}
                        name={"confirm_password"}
                        label={<span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{t('user.labels.confirm_password')}</span>}
                        rules={[
                            {
                                required: true,
                                message: "សូមបញ្ជាក់ពាក្យសម្ងាត់",
                            },
                        ]}
                    >
                        <Input.Password placeholder={t('user.labels.confirm_password')} className="khmer-search" disabled={state.isReadOnly} style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }} />
                    </Form.Item>

                    <Form.Item
                        name="role_id"
                        label={<span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{t('user.labels.role')}</span>}
                        rules={[
                            {
                                required: true,
                                message: "fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' + 'សូមជ្រើសរើសតួនាទី'",
                            },
                        ]}
                    >
                        <Select
                            placeholder={t('user.labels.role')}
                            style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}
                            disabled={state.isReadOnly}
                            options={roles.map(role => ({
                                label: role.name,
                                value: role.id,
                            }))}
                        />
                    </Form.Item>
                    <Form.Item
                        name={"is_active"}
                        label={<span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{t('user.labels.status')}</span>}
                        rules={[
                            {
                                required: true,
                                message: 'fontFamily: "Noto Sans Khmer, Roboto, sans-serif" + "សូមជ្រើសរើសស្ថានភាព',
                            },
                        ]}
                    >
                        <Select
                            style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}
                            placeholder={t('user.labels.status')}
                            disabled={state.isReadOnly}
                            options={[
                                {
                                    label: "សកម្ម",
                                    value: 1,
                                    style: { fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }
                                },
                                {
                                    label: "អសកម្ម",
                                    value: 0,
                                    style: { fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }
                                },
                            ]}
                        />
                    </Form.Item>
                    <Form.Item style={{ textAlign: "right" }}>
                        <Space>
                            <Button onClick={handleCloseModal} style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{state.isReadOnly ? t('common.close') : t('common.cancel')}</Button>
                            {!state.isReadOnly && (
                                <Button type="primary" htmlType="submit" style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>
                                    {state.isEdit ? t('common.update') : t('common.save')}
                                </Button>
                            )}
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
            <Table
                // dataSource={state.list}
                dataSource={list}
                loading={state.loading}
                columns={[
                    {
                        key: "no",
                        title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{t('common.number')}</span>,
                        render: (value, data, index) => index + 1,
                    },
                    {
                        key: "name",
                        title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{t('user.labels.name')}</span>,
                        dataIndex: "name",
                        render: (text) => <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{text}</span>,
                    },
                    {
                        key: "username",
                        title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{t('user.labels.username')}</span>,
                        dataIndex: "username",
                        render: (text) => <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{text}</span>,
                    },
                    {
                        key: "role_name",
                        title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{t('user.labels.role')}</span>,
                        dataIndex: "role_name",
                        render: (text) => <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{text}</span>,
                    },
                    {
                        key: "is_active",
                        title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{t('common.status')}</span>,
                        dataIndex: "is_active",
                        render: (value) =>
                            value ? (
                                <Tag color="green" style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{t('common.active')}</Tag>
                            ) : (
                                <Tag color="red" style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{t('common.inactive')}</Tag>
                            ),
                    },
                    {
                        key: "create_by",
                        title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{t('user.labels.create_by')}</span>,
                        dataIndex: "create_by",
                        render: (text) => <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{text}</span>,
                    },
                    {
                        key: "action",
                        title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{t('common.action')}</span>,
                        align: "center",
                        render: (value, data) => (
                            <Space>
                                <EditOutlined
                                    icon={<MdEdit />}
                                    style={{ color: "green", fontSize: 20 }}
                                    onClick={() => clickBtnEdit(data)}
                                    type="primary">
                                </EditOutlined>
                                <DeleteOutlined
                                    onClick={() => clickBtnDelete(data)}
                                    danger
                                    style={{ color: "red", fontSize: 20 }}
                                    type="primary"
                                    icon={<MdDelete />}
                                >
                                </DeleteOutlined>
                                <EyeOutlined
                                    icon={<IoMdEye />}
                                    style={{ color: 'rgb(12, 59, 4)', fontSize: 20 }}
                                    onClick={() => clickReadOnly(data)}
                                >
                                </EyeOutlined>
                            </Space>
                        ),
                    },
                ]}
            />
        </div>
    );
}

export default UserPage;