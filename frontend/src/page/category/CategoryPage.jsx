import React, { useCallback, useEffect, useState } from "react";
import { Button, Flex, Form, Input, message, Modal, Select, Space, Table, Tag, Spin } from "antd";
import { request } from "../../util/helper";
import { MdDelete, MdEdit } from "react-icons/md";
import { DeleteOutlined, EditOutlined, EyeOutlined, FileAddFilled } from "@ant-design/icons";
import { IoMdEye } from "react-icons/io"; 
import { FiSearch } from "react-icons/fi";
function CategoryPage() {
  const [formRef] = Form.useForm();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState({
    loading: true,
    visibleModal: false,
  });
  const [state, setState] = useState({
    visibleModal: false,
    id: null,
    name: "",
    descriptoin: "",
    status: "",
    parentId: null,
    txtSearch: "",
    isReadOnly: false,
  });
  // const getList = useCallback(async () => {
  //   setLoading(true);
  //   var param = {
  //     txtSearch: state.txtSearch,
  //   };
  //   const res = await request("categorys", "get", param);
  //   setLoading(false);
  //   if (res) {
  //     setList(res.list);
  //   }
  // }, [state, setLoading, setList]);
  const getList = useCallback(async () => {
    setLoading((prev) => ({ ...prev, loading: true }));

    const param = {
      txtSearch: state.txtSearch,
    };

    const res = await request("category", "get", param);

    if (res && res.list) {
      setList(res.list);
    } else {
      setList([]);
    }

    setLoading((prev) => ({ ...prev, loading: false }));
  }, [state.txtSearch]);

  useEffect(() => {
    getList();
  }, [getList]);

  useEffect(() => {
    if (list.length === 0) {
      setLoading((prev) => ({ ...prev, loading: true }));
    }
  }, [list]);

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans+Khmer:wght@400;700&family=Roboto:wght@400;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);

  const onClickEdit = (data) => {
    setState({
      ...state,
      visibleModal: true,
    });
    formRef.setFieldsValue({
      id: data.id, // hiden id (save? | update?) 
      name: data.name,
      description: data.description,
      status: data.status,
    });
  };
  const clickReadOnly = (data) => {
    setState({
      ...state,
      visibleModal: true,
      isReadOnly: true
    });
    formRef.setFieldsValue({
      id: data.id,
      name: data.name,
      description: data.description,
      status: data.status,
    });
  };
  const onClickDelete = async (data) => {
    Modal.confirm({
      title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>លុប{data.name}</span>,
      content: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif', fontWeight: 'bold', color: '#e42020ff' }}>តើអ្នកចង់លុប {data.name} មែនទេ ?</span>,
      okText: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif', fontWeight: 'bold', color: '#e42020ff' }}>បាទ/ចាស</span>,
      okType: 'danger',
      cancelText: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif', fontWeight: 'bold', color: '#25a331ff' }}>ទេ!</span>,
      onOk: async () => {
        const res = await request("category", "delete", {
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
    formRef.resetFields();
    setState({
      ...state,
      visibleModal: false,
      id: null,
      isReadOnly: false,
    });
  };

  const onFinish = async (items) => {
    // Get the current user's name from the profile
    const profileData = localStorage.getItem('profile');
    console.log('Profile data from localStorage:', profileData);

    const currentUser = profileData ? JSON.parse(profileData) : {};
    console.log('Parsed user data:', currentUser);

    // Try to get user name from different possible properties
    const userName = currentUser?.user?.name || currentUser?.name || currentUser?.username || 'system';
    console.log('Selected username:', userName);

    const isEdit = formRef.getFieldValue("id") != null;

    var data = {
      ...items,
      id: formRef.getFieldValue("id"),
      name: items.name,
      description: items.description,
      status: items.status,
      parent_id: 0,
      // Only set create_by for new categories
      create_by: isEdit ? undefined : userName,
    };
    var method = "post";
    if (formRef.getFieldValue("id")) {
      // case update
      method = "put";
    }
    const res = await request("category", method, data);
    if (res && !res.error) {
      // message.success(res.message);
      message.success(`Category ${method === "put" ? "updated" : "created"} successfully`);
      getList();
      onCloseModal();
    }
  };
  return (
    <div className="pag_my_header">
      <div className="pageHeader">
        <Space>
          <Flex style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}> 
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
            />

          </Flex>
          {/* <Button
            type="primary"
            onClick={getList}
            style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}
          >
            <FaSearch /> ស្វែងរក
          </Button> */}
        </Space>
        <Button
          type="primary"
          onClick={onClickAddBtn}
          style={{
            padding: "10px",
            marginBottom: "10px",
            marginLeft: "auto",
            fontFamily: 'Noto Sans Khmer, Roboto, sans-serif'
          }}
        >
          <FileAddFilled /> បញ្ចូលថ្មី
        </Button>
      </div>

      <div style={{
        fontFamily: 'Noto Sans Khmer, Roboto, sans-serif',
        fontWeight: 'bold',
        margin: '0 0 10px 0'
      }}>
        តារាងប្រភេទទំនិញ
      </div>

      <Modal
        open={state.visibleModal}
        style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}
        title={state.isReadOnly ? "មើល" : (formRef.getFieldValue("id") ? "កែប្រែ" : "បញ្ចូលថ្មី")}
        footer={null}
        onCancel={onCloseModal}
      >
        <Form layout="vertical" onFinish={onFinish} form={formRef}>
          <Form.Item
            name={"name"}
            label={<span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>ឈ្មោះប្រភេទទំនិញ</span>}
          >
            <Input
              placeholder="បញ្ចូល ឈ្មោះប្រភេទទំនិញ"
              disabled={state.isReadOnly}
              style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}
            />
          </Form.Item>
          <Form.Item
            name={"description"}
            label={<span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>ពណ៌នា</span>}
          >
            <Input.TextArea
              placeholder="ពណ៌នា"
              disabled={state.isReadOnly}
              style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}
            />
          </Form.Item>
          <Form.Item
            name="status"
            label={<span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>ស្ថានភាព</span>}
          >
            <Select
              style={{ fontWeight: "bold", fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}
              placeholder="ជ្រើសរើសសកម្មភាព"
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
              <Button onClick={onCloseModal} style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>
                {state.isReadOnly ? "បិទ" : "បោះបង់"}
              </Button>
              {!state.isReadOnly && (
                <Button type="primary" htmlType="submit" style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>
                  {formRef.getFieldValue("id") ? "កែប្រែ" : "រក្សាទុក"}
                </Button>
              )}
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {loading.loading ? (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Spin />
          <div style={{
            marginTop: 10,
            fontFamily: 'Noto Sans Khmer, Roboto, sans-serif',
            fontWeight: 'bold'
          }}>
            កំពុងផ្ទុកទិន្នន័យ...
          </div>
        </div>
      ) : (
        <Table
          dataSource={list}
          columns={[
            {
              key: "No",
              title: <span style={{ fontWeight: "bold", fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>ល.រ</span>,
              render: (item, data, index) => index + 1,
            },
            {
              key: "name",
              title: <span style={{ fontWeight: "bold", fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>ឈ្មោះ</span>,
              dataIndex: "name",
              render: (text) => <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{text}</span>,
            },
            {
              key: "description",
              title: <span style={{ fontWeight: "bold", fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>ការពណ៌នា</span>,
              dataIndex: "description",
              render: (text) => <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{text}</span>,
            },
            {
              key: "status",
              title: <span style={{ fontWeight: "bold", fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>ស្ថានភាព</span>,
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
              title: <span style={{ fontWeight: "bold", fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>សកម្មភាព</span>,
              align: "center",
              render: (item, data, index) => (
                <Space>
                  <EditOutlined
                    style={{ color: "green", fontSize: 20 }}
                    onClick={() => onClickEdit(data, index)}
                    icon={<MdEdit />}
                  />
                  <DeleteOutlined
                    danger
                    style={{ color: "red", fontSize: 20 }}
                    onClick={() => onClickDelete(data, index)}
                    icon={<MdDelete />}
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
          locale={{
            emptyText: (
              <span style={{
                fontFamily: 'Noto Sans Khmer, Roboto, sans-serif',
                fontWeight: 'bold'
              }}>
                មិនមានទិន្នន័យ
              </span>
            ),
          }}
          rowKey="id"
        />
      )}
    </div>
  );

}
export default CategoryPage;