import { useCallback, useEffect, useState } from "react";
import { Button, Form, Input, InputNumber, message, Modal, Select, Space, Table } from "antd";
import { request } from "../../util/helper";
import { MdDelete, MdEdit } from "react-icons/md";
import MainPage from "../../component/layout/MainPage";
import { DeleteOutlined, EditOutlined, EyeOutlined, FileAddOutlined } from "@ant-design/icons";
import { IoMdEye } from "react-icons/io";
import { configStore } from "../../store/configStore";
import Link from "antd/es/typography/Link";
import { MdCalendarMonth } from "react-icons/md";
import { FaCalendarWeek } from "react-icons/fa6";
import { BiCalendarWeek } from "react-icons/bi";
import { LiaCalendarWeekSolid } from "react-icons/lia";
import { FiSearch } from "react-icons/fi";
import './ex.css'
function ExpansePage() {
  const [formRef] = Form.useForm();
  const [list, setList] = useState([]);
  const { config } = configStore();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  //summary expanse
  // const [summary, setSummary] = useState(null);
  const [expense_this_month, setThisMonth] = useState(null);
  const [expense_last_month, setLastMonth] = useState(null);
  const [expense_this_year, setThisYear] = useState(null);
  const [total_expense, setTotalExpense] = useState(null);
  const [state, setState] = useState({
    visibleModal: false,
    isReadOnly: false,
    id: null,
    expense_type: null,
    vendor_payee: "",
    payment_method: "",
    expense_date: "",
    amount: null,
    descriptoin: "",
    status: "",
    txtSearch: "",
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
    getExpense();
  }, []);
  const [filter, setFilter] = useState({
    txtSearch: "",
    expense_type: "",
  })
  const getList = useCallback(async () => {
    setLoading(true);
    var param = {
      txtSearch: state.txtSearch,
      expense_type: filter.expense_type,
    };
    const res = await request("expense", "get", param);
    setLoading(false);
    if (res) {
      setList(res.list);
    }
  });
  useEffect(() => {
    const handler = setTimeout(() => {
      getList();
    }, 400); // 400ms debounce

    return () => {
      clearTimeout(handler);
    };
  }, [state.txtSearch, getList]);
  const getExpense = useCallback(async () => {
    setLoading(true);
    try {
      const res = await request('getexpense_summary', 'get');
      if (res && !res.error) {
        setData(res);
        setThisMonth(res.expense_this_month || null);
        setLastMonth(res.expense_last_month || null);
        setThisYear(res.expense_this_year || null);
        setTotalExpense(res.total_expense || null);
      }
      else {
        setData([]);
        // setSummary(null);
        setThisMonth(null);
        setLastMonth(null);
        setThisYear(null);
        setTotalExpense(null);
        message.info('No expense data found.');
      }
    }
    catch (err) {
      console.error('Failed to get expense summary data.', err);
    } finally {
      setLoading(false);
    }
  })
  const onClickView = (data) => {
    if (!state.visibleModal) {
      setState({
        ...state,
        visibleModal: true,
        isReadOnly: true,
        id: data.id,
      });
      formRef.setFieldsValue({
        id: data.id,
        expense_type: data.expense_type,
        vendor_payee: data.vendor_payee,
        amount: data.amount,
        payment_method: data.payment_method,
        description: data.description,
        expense_date: data.expense_date,
      });
    }
  };

  const openModal = () => {
    setState({
      // ...state,
      id: null,
      expense_type: "",
      vendor_payee: "",
      amount: '',
      payment_method: "",
      description: "",
      expense_date: "",
      isReadOnly: false,
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
    formRef.resetFields();
  };

  const onFinish = async (items) => {
    var data = {
      id: formRef.getFieldValue("id"),
      expense_type: items.expense_type,
      vendor_payee: items.vendor_payee,
      amount: items.amount,
      payment_method: items.payment_method,
      description: items.description,
      // expense_date: items.expense_date,
    };
    var method = "post";
    if (formRef.getFieldValue("id")) {
      // case update
      method = "put";
    }
    const res = await request("expense", method, data);
    if (res && !res.error) {
      message.success(res.message);
      getList();
      onCloseModal();
    }
  };
  const onClickEdit = (data) => {
    setState({
      ...state,
      visibleModal: true,
      id: data.id,
    });
    formRef.setFieldsValue({
      id: data.id,
      expense_type: data.expense_type,
      vendor_payee: data.vendor_payee,
      amount: data.amount,
      payment_method: data.payment_method,
      description: data.description,
      // expense_date: data.expense_date,
    });
  };
  const onClickDelete = async (data) => {
    Modal.confirm({
      title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>លុប{data.expense_type}</span>,
      content: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif', fontWeight: 'bold', color: '#e42020ff' }}>តើអ្នកចង់លុប {data.expense_type} មែនទេ ?</span>,
      okText: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif', fontWeight: 'bold', color: '#e42020ff' }}>បាទ/ចាស</span>,
      okType: 'danger',
      cancelText: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif', fontWeight: 'bold', color: '#25a331ff' }}>ទេ!</span>,
      icon: <MdDelete style={{ color: "red", fontSize: 20 }} />,
      onOk: async () => {
        const res = await request('expense', 'delete', { id: data.id });
        if (res && !res.error) {
          message.success(res.message);
          const newList = list.filter((item) => item.id != data.id);
          setList(newList);
        }
      },
    });
  };
  return (
    <MainPage loading={loading}>
      <div className="pageHeader">
        <Space>
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
          // style={{ width: '100%', fontFamily: 'Noto Sans Khmer, Roboto, sans-serif', fontSize: '16px', borderRadius: '8px', padding: '8px 12px' }}
          // onChange={(value) =>
          //   setState((p) => ({ ...p, txtSearch: value.target.value }))
          // }
          // allowClear
          // onSearch={getList}
          // value={state.txtSearch}
          // placeholder="ស្វែងរក"
          // className="khmer-search"
          // style={{ width: '100%',fontFamily: 'Noto Sans Khmer, Roboto, sans-serif',fontSize: '16px',borderRadius: '8px',padding: '8px 12px'}}
          />
        </Space>
        <Button
          type="primary"
          onClick={openModal}
          style={{ padding: "10px", marginBottom: "10px", marginLeft: "auto", fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}
        >
          <FileAddOutlined style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }} />បញ្ចូលថ្មី
        </Button>
      </div>
      <div style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>តារាងនៃការចំណាយ</div>
      <div style={{ margin: '20px 0', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
        <h3 style={{ marginBottom: 16, color: '#d32a2aff', fontSize: 20, fontWeight: 'bold', fontFamily: 'Khmer OS Muol Light' }}>ការចំណាយ</h3>
        {/* Extract values safely from arrays/objects */}
        {(() => {
          const thisMonthValue = Array.isArray(expense_this_month) && expense_this_month.length > 0
            ? expense_this_month[0].expense_this_month || 0
            : 0;
          const lastMonthValue = Array.isArray(expense_last_month) && expense_last_month.length > 0
            ? expense_last_month[0].expense_last_month || 0
            : 0;
          const thisYearValue = Array.isArray(expense_this_year) && expense_this_year.length > 0
            ? expense_this_year[0].expense_this_year || 0
            : 0;
          const totalExpenseValue = Array.isArray(total_expense) && total_expense.length > 0
            ? (total_expense[0].total_expense || 0)
            : 0;
          return (
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
              <div style={{ margin: '10px', color: '#0c3e6b', backgroundColor: '#e4eae2ff', borderRadius: 6, fontSize: 20, padding: 18, boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', fontWeight: 'bold', textAlign: 'center' }}>
                <FaCalendarWeek />
                <b style={{ color: '#2d1817ff', fontWeight: 'bold', fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>ការចំណាយខែកន្លងទៅ&nbsp;</b>
                <span style={{ color: '#da2016ff', fontWeight: 'bold' }}>${Number(lastMonthValue).toFixed(2)}</span>
              </div>
              <div style={{ margin: '10px', color: '#0c3e6b', backgroundColor: '#e6ece4ff', borderRadius: 6, fontSize: 20, padding: 18, boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', fontWeight: 'bold', textAlign: 'center' }}>
                <MdCalendarMonth style={{ justifyContent: 'center', alignItems: 'center' }} />
                <b style={{ color: '#2d1817ff', fontWeight: 'bold', fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>ការចំណាយខែនេះ&nbsp;</b>
                <span style={{ color: '#da2016ff', fontWeight: 'bold' }}>${Number(thisMonthValue).toFixed(2)}</span>
              </div>
              <div style={{ margin: '10px', color: '#0c3e6b', backgroundColor: '#e2e8ecff', borderRadius: 6, fontSize: 20, padding: 18, boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', fontWeight: 'bold', textAlign: 'center' }}>
                <LiaCalendarWeekSolid />
                <b style={{ color: '#2d1817ff', fontWeight: 'bold', fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>ការចំណាយឆ្នាំនេះ&nbsp;</b>
                <span style={{ color: '#da2016ff', fontWeight: 'bold' }}>${Number(thisYearValue).toFixed(2)}</span>
              </div>
              <div style={{ margin: '10px', color: '#0c3e6b', backgroundColor: '#e1e6eaff', borderRadius: 6, fontSize: 20, padding: 18, boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', fontWeight: 'bold', textAlign: 'center' }}>
                <BiCalendarWeek />
                <b style={{ color: '#2d1817ff', fontWeight: 'bold', fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>ការចំណាយសរុប&nbsp;</b>
                <span style={{ color: '#da2016ff', fontWeight: 'bold' }}>${Number(totalExpenseValue).toFixed(2)}</span>
              </div>
            </div>
          );
        })()}
      </div>
      <Modal
        style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}
        open={state.visibleModal}
        title={state.isReadOnly ? "មើល" : (state.id ? "កែប្រែ" : "បញ្ចូលថ្មី")}
        footer={null}
        onCancel={onCloseModal}
      >
        <Form
          form={formRef}
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item
            name={"expense_type"}
            label={<span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>ប្រភេទនៃការចំណាយ</span>}
            rules={[
              {
                required: true,
                message: 'សូមបញ្ចូល ប្រភេទនៃការចំណាយ!'
              }
            ]}
          >
            <Select
              style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}
              placeholder="ជ្រើសរើស ប្រភេទនៃការចំណាយ"
              showSearch
              allowClear
              options={config.expense_type?.map((opt) => ({
                value: opt.value,
                label: (
                  <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>
                    {opt.label}
                  </span>
                )
              }))}
              // options={(config.expense_type || []).map(item => ({
              //   label: item.label,
              //   value: item.value
              // }))}
              onChange={(value) => {
                setFilter(prev => ({
                  ...prev,
                  expense_type: value
                }));
                getList();
              }}
              disabled={state.isReadOnly}
            />
          </Form.Item>
          <Form.Item name={"amount"} label={<span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>ចំនួន</span>} rules={[{ required: true, message: 'សូមបញ្ចូល ចំនួន!' }]}>
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
            name={"vendor_payee"}
            label={<span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>អ្នកលក់/អ្នកទទួល</span>}
            rules={[
              {
                required: true,
                message: 'សូមបញ្ចូល អ្នកលក់/អ្នកទទួល!'
              }
            ]}
          >
            <Select
              style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}
              placeholder="ជ្រើសរើស អ្នកលក់/អ្នកទទួល"
              showSearch
              allowClear
              options={config.vendor_payee?.map((opt) => ({
                value: opt.value,
                label: (
                  <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>
                    {opt.label}
                  </span>
                )
              }))}
              // options={(config.vendor_payee || []).map(item => ({
              //   label: item.label,
              //   value: item.value
              // }))}
              onChange={(value) => {
                setFilter(prev => ({
                  ...prev,
                  vendor_payee: value
                }));
                getList();
              }}
              disabled={state.isReadOnly} />
          </Form.Item>
          <Form.Item
            name={"payment_method"}
            label={<span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>ការទូទាត់</span>}
            rules={[
              {
                required: true,
                message: 'សូមបញ្ចូល ការបទូទាត់!'
              }
            ]}
          >
            <Select
              style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}
              placeholder="ជ្រើសរើស ការទូទាត់"
              showSearch
              allowClear
              options={config.payment_method?.map((opt) => ({
                value: opt.value,
                label: (
                  <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>
                    {opt.label}
                  </span>
                )
              }))}
              // options={(config.payment_method || []).map(item => ({
              //   label: item.label,
              //   value: item.value
              // }))}
              onChange={(value) => {
                setFilter(prev => ({
                  ...prev,
                  payment_method: value
                }));
                getList();
              }}
              disabled={state.isReadOnly} />
          </Form.Item>
          <Form.Item name={"description"} label={<span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>ពណ៌នា</span>} rules={[{ required: true, message: 'សូមបញ្ចូល ពណ៌នា!' }]}>
            <Input.TextArea placeholder="ពណ៌នា" disabled={state.isReadOnly} style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }} />
          </Form.Item>
          {/* <Form.Item name={"expense_date"} label="Expense Date" rules={[{ required: true, message: 'Please input expense date!' }]}>
            <Input type="date" placeholder="Expense Date" disabled={state.isReadOnly} />
          </Form.Item> */}
          <Form.Item style={{ textAlign: "right" }}>
            <Button onClick={onCloseModal} style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{state.isReadOnly ? "បិទ" : "បោះបង់"}</Button> &nbsp;
            {!state.isReadOnly && (
              <Button type="primary" htmlType="submit" style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>
                {formRef.getFieldValue("id") ? "កែប្រែ" : "រក្សាទុក"}
              </Button>
            )}
          </Form.Item>
        </Form>
      </Modal>
      <Table
        dataSource={list}
        columns={[
          // {
          //   key: "No",
          //   title: "No",
          //   render: (item, data, index) => index + 1,
          // },
          {
            title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>លេខកូដ</span>,
            dataIndex: "id",
            key: "id",
            render: (item, data, index) => (
              <Link style={{ color: '#cc2121ff', fontSize: "14px" }}>
                {'EXP-' + String(index + 1).padStart(3, '0')}
              </Link>
            )
          },
          {
            key: "expense_type",
            title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>ប្រភេទនៃការចំណាយ</span>,
            dataIndex: "expense_type",
            render: (expense_type) => {
              return <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{expense_type}</span>;
            },
          },
          {
            key: "vendor_payee",
            title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>អ្នកលក់/អ្នកទទួល</span>,
            dataIndex: "vendor_payee",
            render: (vendor_payee) => {
              return <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{vendor_payee}</span>;
            },
          },
          {
            key: "amount",
            title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>ចំនួន</span>,
            dataIndex: "amount",
            render: (amount) => '$' + amount
          },
          {
            key: "payment_method",
            title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>ការទូទាត់</span>,
            dataIndex: "payment_method",
            render: (payment_method) => {
              return <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{payment_method}</span>;
            },
          },
          {
            key: "description",
            title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>ពណ៌នា</span>,
            dataIndex: "description",
            render: (description) => {
              return <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{description}</span>;
            },
          },
          {
            key: "expense_date",
            title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>ថ្ងៃ/ខែ/ឆ្នាំនៃការចំណាយ</span>,
            dataIndex: "expense_date",
            render: (date) => new Date(date).toLocaleDateString("en-GB", { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            //render: (date) => new Date(date).toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          },
          {
            key: "create_by",
            title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>អ្នកគ្រប់គ្រង</span>,
            dataIndex: "create_by",
            render: (create_by) => {
              return <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{create_by}</span>;
            },
          },
          {
            key: "Action",
            title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>សកម្មភាព</span>,
            align: "center",
            render: (item, data, index) => (
              <Space>
                <EditOutlined
                  type="primary"
                  icon={<MdEdit />}
                  style={{ color: "green", fontSize: 20 }}
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
                  style={{ color: "rgb(12, 59, 4)", fontSize: 20 }}
                  icon={<IoMdEye />}
                  onClick={() => onClickView(data, index)}
                />
              </Space>
            ),
          },
        ]}
      />
    </MainPage>
  );
}

export default ExpansePage;
