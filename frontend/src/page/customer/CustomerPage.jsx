import { useCallback, useEffect, useState } from "react";
import { Button, Form, Input, message, Modal, Select, Space, Table, Tag } from "antd";
import { MdDelete, MdEdit } from "react-icons/md";
import MainPage from "../../component/layout/MainPage";
import { request } from "../../util/helper";
import { DeleteOutlined, EditOutlined, EyeOutlined, FileAddFilled } from "@ant-design/icons";
// import PropTypes from "prop-types";
import { Flex } from 'antd';
import { IoMdEye } from "react-icons/io";
import { FiSearch } from "react-icons/fi";
function CustomerPage() {
  const [form] = Form.useForm();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState({
    visibleModal: false,
    id: null,
    name: "",
    descriptoin: "",
    status: "",
    parentId: null,
    txtSearch: "",
  });

  const getList = useCallback(async () => {
    setLoading(true);
    var param = {
      txtSearch: state.txtSearch,
    };
    const res = await request("customer", "get", param);
    setLoading(false);
    if (res) {
      setList(res.list);
    }
  }, [state, setLoading, setList]);

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
  const onClickEdit = (data) => {
    setState({
      ...state,
      visibleModal: true,
      id: data.id,
    });
    form.setFieldsValue({
      id: data.id, // hiden id (save? | update?)
      name: data.name,
      phone: data.phone,
      email: data.email,
      address: data.address,
      description: data.description,
      status: data.status,
    });
    //
    // formRef.getFieldValue("id")
  };
  const clickReadOnly = (data) => {
    setState({
      ...state,
      visibleModal: true,
      isReadOnly: true,
      id: data.id
    });
    form.setFieldsValue({
      id: data.id,
      name: data.name,
      phone: data.phone,
      email: data.email,
      address: data.address,
      description: data.description,
      status: data.status,
    });
  }
  const onClickDelete = async (data) => {
    Modal.confirm({
      title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>លុប{data.name}</span>,
      content: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif', fontWeight: 'bold', color: '#e42020ff' }}>តើអ្នកចង់លុប {data.name} មែនទេ ?</span>,
      okText: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif', fontWeight: 'bold', color: '#e42020ff' }}>បាទ/ចាស</span>,
      okType: 'danger',
      cancelText: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif', fontWeight: 'bold', color: '#25a331ff' }}>ទេ!</span>,
      onOk: async () => {
        const res = await request("customer", "delete", {
          id: data.id,
        });
        if (res && !res.error) {
          // getList(); // request to api response
          // remove in local
          message.success(res.message);
          const newList = list.filter((item) => item.id != data.id);
          setList(newList);
        }
      },
    });
  };
  const onClickAddBtn = () => {
    setState({
      ...state,
      visibleModal: true,
    });
  };
  const onCloseModal = () => {
    form.resetFields();
    setState({
      ...state,
      visibleModal: false,
      id: null,
      isReadOnly: false
    });
  };

  const onFinish = async (items) => {
    var data = {
      id: form.getFieldValue("id"),
      name: items.name,
      phone: items.phone,
      email: items.email,
      address: items.address,
      description: items.description,
      status: items.status,
      parent_id: 0,
    };
    var method = "post";
    if (form.getFieldValue("id")) {
      // case update
      method = "put";
    }
    const res = await request("customer", method, data);
    if (res && !res.error) {
      // message.success(res.message);
      message.success(`Customer ${method === "put" ? "Edited" : "Created"} Successfully`);
      getList();
      onCloseModal();
    }
  };
  return (
    <MainPage loading={loading} >
      <div className="pageHeader" style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>
        <Space>
          {/* <Flex vertical gap={12}>
            <Input placeholder="Outlined" />
          </Flex> */}
          <Flex>
            <Input
              placeholder="ស្វែងរក"
              prefix={<FiSearch />}
              className="khmer-search"
              value={state.txtSearch || ""}
              onChange={(event) =>
                setState((prev) => ({
                  ...prev,
                  txtSearch: event.target.value,
                }))
              }
              allowClear
              style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}
            // placeholder="ស្វែងរក"
            // className="khmer-search"
            // value={state.txtSearch || ""}
            // onChange={(event) =>
            //   setState((prev) => ({
            //     ...prev,
            //     txtSearch: event.target.value,
            //   }))
            // }
            // style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }} 
            />
          </Flex>
          {/* <Button type="primary" onClick={getList} style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>
            <FaSearch style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }} /> ស្វែងរក
          </Button> */}
        </Space>
        <Button type="primary" style={{ padding: "10px", marginBottom: "10px", marginLeft: "auto", fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }} onClick={onClickAddBtn} >
          <FileAddFilled style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }} /> បញ្ចូលថ្មី
        </Button>
      </div>
      <div style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif', fontWeight: 'bold', margin: '0 0 10px 0' }}>តារាងអតិថិជន </div>
      <Modal
        style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}
        open={state.visibleModal}
        title={state.isReadOnly ? "មើល" : (state.id ? "កែប្រែ" : "បញ្ចូលអតិថិជន")}
        footer={null}
        onCancel={onCloseModal}
      >
        <Form layout="vertical" onFinish={onFinish} form={form} initialValues={{
          status: 1
        }}>
          <Form.Item
            style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}
            name="name"
            label={<span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>ឈ្មោះអតិថិជន</span>}
            rules={[{ required: true, message: 'សូមបញ្ចូល ឈ្មោះអតិថិជន!' }]}
          >
            <Input placeholder="បញ្ចូល ឈ្មោះអតិថិជន" disabled={state.isReadOnly} style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }} />
          </Form.Item>
          <Form.Item
            name="phone"
            label={<span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>លេខទូរស័ព្ទ</span>}
            rules={[{ required: true, message: 'សូមបញ្ចូល លេខទូរស័ព្ទ!' }]}
          >
            <Input placeholder="បញ្ចូល លេខទូរស័ព្ទ" disabled={state.isReadOnly} style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }} />
          </Form.Item>
          <Form.Item
            name="email"
            label={<span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>អ៊ីម៉ែល</span>}
            rules={[{ required: true, message: 'សូមបញ្ចូល អ៊ីម៉ែល!' }, { type: 'email', message: 'Please enter a valid email!' }]}
          >
            <Input placeholder="បញ្ចូល អ៊ីម៉ែល" disabled={state.isReadOnly} style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }} />
          </Form.Item>
          <Form.Item name={"address"} label={<span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>ទីកន្លែង</span>}>
            <Input placeholder="បញ្ចូល ទីកន្លែង" name="address" disabled={state.isReadOnly} style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }} />
          </Form.Item>
          <Form.Item name={"description"} label={<span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>ពណ៌នា</span>}>
            <Input.TextArea placeholder="ពណ៌នា" disabled={state.isReadOnly} style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }} />
          </Form.Item>
          <Form.Item
            style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}
            name="status"
            label={<span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>ស្ថានភាព</span>}
            rules={[{ required: true, message: 'Please select a status!' }]}
          >
            <Select
              style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}
              placeholder="ជ្រើសរើស្ថានភាព"
              disabled={state.isReadOnly}
              options={[
                {
                  label: "សកម្ម",
                  value: 1,
                  style: { fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' },
                },
                {
                  label: "អសកម្ម",
                  value: 0,
                  style: { fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' },
                },
              ]}
            />
          </Form.Item>
          <Form.Item style={{ textAlign: "right" }}>
            <Space>
              <Button type="default" onClick={onCloseModal} style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{state.isReadOnly ? "បិទ" : "បោះបង់"}</Button>
              {!state.isReadOnly && (
                <Button type="primary" htmlType="submit" style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>
                  {form.getFieldValue("id") ? "កែប្រែ" : "រក្សាទុក"}
                </Button>
              )}
            </Space>
          </Form.Item>

        </Form>
      </Modal>
      <Table
        dataSource={list}
        columns={[
          {
            key: "No",
            title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>ល.រ</span>,
            render: (item, data, index) => index + 1,
          },
          {
            key: "name",
            title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>ឈ្មោរ</span>,
            dataIndex: "name",
            render: (text) => <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{text}</span>,
          },
          {
            key: "phone",
            title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>លេខទូរស័ព្ទ</span>,
            dataIndex: "phone",
          },
          {
            key: "email",
            title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>ទំនាក់ទំនង</span>,
            dataIndex: "email",
          },
          {
            key: "address",
            title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>ទីកន្លែង</span>,
            dataIndex: "address",
            render: (text) => <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{text}</span>,
          },
          {
            key: "description",
            title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>ពណ៌នា</span>,
            dataIndex: "description",
            render: (text) => <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{text}</span>,
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
    </MainPage>
  );
}

export default CustomerPage;
