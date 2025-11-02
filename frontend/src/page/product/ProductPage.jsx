import React, { useCallback, useEffect, useState } from "react";
import { Button, Col, Flex, Form, Image, Input, InputNumber, message, Modal, Row, Select, Space, Table, Tag, Upload, } from "antd";
import { request } from "../../util/helper";
import { MdDelete, MdEdit, MdImage } from "react-icons/md";
import MainPage from "../../component/layout/MainPage";
import { configStore } from "../../store/configStore";
import { DeleteOutlined, EditOutlined, EyeOutlined, FileAddFilled } from "@ant-design/icons";
import { IoMdEye } from "react-icons/io";
import { FiSearch } from "react-icons/fi";
import { useTranslation } from "react-i18next";
//please check this
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

function ProductPage() {
  // const { config } = configStore();
  const { config } = configStore();
  const { t } = useTranslation();
  const [formRef] = Form.useForm();
  const [state, setState] = useState({
    id: null,
    name: "",
    category_id: "",
    brand: "",
    description: "",
    qty: 0,
    price: 0,
    discount: 0,
    status: 1,
    isReadOnly: false,
    image: "",
    list: [],
    total: 0,
    loading: false,
    txt_search: "",
    visibleModal: false,
  });

  const refPage = React.useRef(1);

  const [filter, setFilter] = useState({
    txt_search: "",
    // category_id: "",
    // brand: "",
  });

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [imageDefault, setImageDefault] = useState([]);
  // const [imageOptional, setImageOptional] = useState([]);
  // const [imageOptional_Old, setImageOptional_Old] = useState([]);
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans+Khmer:wght@400;700&family=Roboto:wght@400;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);

  const getList = useCallback(async () => {
    // var param = {
    //   //...filter,
    //   page: refPage.current, // get value
    //   //txt_search: filter.txt_search,
    //   // category_id: filter.category_id,
    //   //brand: filter.brand,
    //   // page: filter.page,
    // };
    setState((pre) => ({ ...pre, loading: true }));
    const param = {
      page: refPage.current,
      txt_search: filter.txt_search,
    };
    const res = await request("product", "get", param);
    if (res && !res.error) {
      setState((pre) => ({
        ...pre,
        list: res.list,
        total: refPage.current == 1 ? res.total : pre.total,
        loading: false,
      }));
    }
    else {
      setState((pre) => ({
        ...pre,
        list: [],
        total: 0,
        loading: false,
      }));
    }
  }, [filter.txt_search])
  useEffect(() => {
    getList();
  }, [getList]);
  // useEffect(() => {
  //   if (filter.category_id !== undefined) {
  //     getList();
  //   }
  // }, [filter.category_id, getList]);

  useEffect(() => {
    const handler = setTimeout(() => {
      getList();
    }, 400); // 400ms debounce

    return () => {
      clearTimeout(handler);
    };
  }, [filter.txt_search, getList]);

  // const getList = async () => {
  //   var param = {
  //     ...filter,
  //     page: refPage.current, // get value
  //     // txt_search: filter.txt_search,
  //     // category_id: filter.category_id,
  //     // brand: filter.brand,
  //     // page: filter.page,
  //   };
  //   setState((pre) => ({ ...pre, loading: true }));
  //   const res = await request("product", "get", param);
  //   if (res && !res.error) {
  //     setState((pre) => ({
  //       ...pre,
  //       list: res.list,
  //       total: refPage.current == 1 ? res.total : pre.total,
  //       loading: false,
  //     }));
  //   }
  // };

  const onCloseModal = () => {
    setState((p) => ({
      ...p,
      visibleModal: false,
      id: null,
      isReadOnly: false
    }));
    setImageDefault([]);
    // setImageOptional([]);
    formRef.resetFields();
  };
  const onFinish = async (items) => {

    var params = new FormData();
    // id	category_id	barcode	name	brand	description	qty	price	discount	status	image
    params.append("name", items.name);
    params.append("category_id", items.category_id);
    // params.append("barcode", items.barcode); //
    params.append("brand", items.brand);
    params.append("description", items.description);
    // params.append("qty", items.qty);
    params.append("price", items.price);
    params.append("discount", items.discount);
    params.append("status", items.status);

    // when update this two more key
    params.append("image", formRef.getFieldValue("image")); // just name image 

    params.append("id", formRef.getFieldValue("id"));

    if (items.image_default && items.image_default.file) {
      const file = items.image_default.file;

      if (file.status === "removed") {
        params.append("image_remove", "1");
      } else if (file.originFileObj) {
        // Force uploaded file to have .png extension (for backend handling)
        const pngFileName = file.name.replace(/\.[^/.]+$/, "") + ".png";
        params.append("upload_image", file.originFileObj, pngFileName);
      }
    }

    const method = formRef.getFieldValue("id") ? "put" : "post";

    const res = await request("product", method, params);

    if (res && !res.error) {
      message.success(`Product ${method === "put" ? "updated" : "created"} successfully`);
      onCloseModal();
      getList();
    } else {
      message.error("Upload failed");
    }
    // if (items.image_default) {
    //   if (items.image_default.file.status === "removed") {
    //     params.append("image_remove", "1");
    //   } else {
    //     params.append(
    //       "upload_image",
    //       items.image_default.file.originFileObj,
    //       items.image_default.file.name
    //     );
    //   }
    // }  
    // var method = "post";
    // if (formRef.getFieldValue("id")) {
    //   method = "put";
    // }
    // const res = await request("product", method, params);
    // if (res && !res.error) {
    //   // message.success(res.message);
    //   message.success(`Product ${method === "put" ? "updated" : "created"} successfully`);
    //   onCloseModal();
    //   getList();
    // } else {
    //   res.error("error");
    //   // res.error?.barcode && message.error(res.error?.barcode);
    // }
  };
  const onBtnNew = async () => {
    setState((p) => ({
      ...p,
      visibleModal: true,
      isReadOnly: false
    }));
    getList();
    formRef.resetFields();
    setImageDefault([]);
  };
  // const onBtnNew = async () => {
  //   const res = await request("new_barcode", "post");
  //   if (res && !res.error) {
  //     formRef.setFieldValue("barcode", res.barcode);
  //     setState((p) => ({
  //       ...p,
  //       visibleModal: true,
  //     }));
  //   }
  // };

  //please check this
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const handleChangeImageDefault = ({ fileList: newFileList }) =>
    setImageDefault(newFileList);
  // const handleChangeImageOptional = ({ fileList: newFileList }) =>
  //   setImageOptional(newFileList);

  // const onFilter = () => {
  //   getList();
  // };
  const onClickEdit = async (item) => {
    formRef.setFieldsValue({
      ...item,
    });
    setState((pre) => ({ ...pre, visibleModal: true }));
    if (item.image != "" && item.image != null) {
      const imageProduct = [
        {
          uid: "-1",
          name: item.image,
          status: "done",
          url: "http://localhost/mycoffee/" + item.image,
        },
      ];
      setImageDefault(imageProduct);
      getList();
    } else {
      setImageDefault([]);
    }
    getList();
  };
  const clickReadOnly = (item) => {
    setState((p) => ({
      ...p,
      visibleModal: true,
      isReadOnly: true
    }))

    // Handle image display for view mode
    if (item.image) {
      setImageDefault([
        {
          uid: '-1',
          name: item.image,
          status: 'done',
          url: `http://localhost/mycoffee/${item.image}`,
        }
      ]);
    } else {
      setImageDefault([]);
    }

    formRef.setFieldsValue({
      id: item.id,
      name: item.name,
      category_id: item.category_id,
      // barcode: item.barcode,
      brand: item.brand,
      description: item.description,
      price: item.price,
      discount: item.discount,
      status: item.status,
      image: item.image,
    });
  };
  const onClickDelete = (item) => {
    Modal.confirm({
      title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{t('product.confirm.delete_title', { name: item.name })}</span>,
      content: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif', fontWeight: 'bold', color: '#e42020ff' }}>{t('product.confirm.delete_content', { name: item.name })}</span>,
      okText: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif', fontWeight: 'bold', color: '#e42020ff' }}>{t('common.yes')}</span>,
      okType: 'danger',
      cancelText: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif', fontWeight: 'bold', color: '#25a331ff' }}>{t('common.no')}</span>,
      onOk: async () => {
        const res = await request("product", "delete", item);
        if (res && !res.error) {
          message.success(res.message);
          getList();
        }
      },
    });
  };

  return (
    <MainPage loading={state.loading}>
      {/* <Modal
        open={previewOpen}
        // title="Image Preview"
        //footer={null}
        onCancel={() => setPreviewOpen(false)}
      >
        <img alt="preview" style={{ width: '100px',height:'100px' }} src={previewImage} />
      </Modal> */}
      <div className="pageHeader">
        <Space>
          <Flex style={{ width: "100%", fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>
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
          {/* <Input
            onChange={(value) =>
              setFilter((p) => ({ ...p, txt_search: value.target.value }))
            }
            allowClear 
            onSearch={onFilter}
            placeholder="Search"
            
          /> */}
          {/* <Select
            allowClear
            style={{ width: 130 }}
            placeholder="Category"
            options={config.category}
            onChange={(id) => {
              setFilter((pre) => ({ ...pre, category_id: id }));
            }}

          /> */}
          {/* <Select
            style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif', width: 130 }}
            placeholder="ម៉ាក/Brand"
            showSearch
            allowClear
            options={config.brand?.map((opt) => ({
              value: opt.value,
              label: (
                <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>
                  {opt.label}
                </span>
              )
            }))} 
            onChange={(id) => {
              setFilter((pre) => ({ ...pre, brand: id }));
            }}
          /> */}
          {/* <Button onClick={onFilter} type="primary">
            <FaSearch />Filter
          </Button> */}
        </Space>
        <Button type="primary" onClick={onBtnNew} style={{ padding: "10px", marginBottom: "10px", marginLeft: "auto", fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>
          <FileAddFilled style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }} /> {t('common.new')}
        </Button>
      </div>
      <div style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif', fontWeight: 'bold', margin: '0 0 10px 0' }}>{t('product.total_count', {count: state.total})}</div>
      <Modal
        style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}
        open={state.visibleModal}
        title={state.isReadOnly ? t('common.view') : (formRef.getFieldValue("id") ? t('common.update') : t('common.new'))}
        footer={
          state.isReadOnly ? (
            // View Product modal - only show Close button
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={onCloseModal} style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>
                {t('common.close')}
              </Button>
            </div>
          ) : (
            // Edit/New Product modal - show Save and Cancel buttons
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <Button onClick={onCloseModal} style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>
                {t('common.cancel')}
              </Button>
              <Button type="primary" onClick={() => formRef.submit()} style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>
                {formRef.getFieldValue("id") ? t('common.update') : t('common.save')}
              </Button>
            </div>
          )
        }
        onCancel={onCloseModal}
        maskClosable={false}
        keyboard={false}    
      >
        <Form
          form={formRef}
          layout="vertical"
          onFinish={onFinish}
          disabled={state.isReadOnly}
        >
          <div style={{ marginBottom: '20px' }}>
            <Row gutter={8}>
              <Col span={12}>
                <Form.Item
                  name={"name"}
                  label={<span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{t('product.labels.name')}</span>}
                  rules={[
                    {
                      required: true,
                      message: t('validation.product_name_required'),
                    },
                  ]}
                >
                  <Input placeholder={t('product.placeholders.name')} style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }} />
                </Form.Item>
                <Form.Item
                  name={"brand"}
                  label={<span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{t('product.labels.brand')}</span>}
                  rules={[
                    {
                      required: true,
                      message: t('validation.brand_required'),
                    },
                  ]}
                >
                  <Select
                    style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}
                    placeholder={t('product.placeholders.brand')}
                    allowClear
                    // options={config.brand?.map((item) => ({
                    //   label: item.label + " (" + item.country + ")",
                    //   value: item.value,
                    // }))}
                    options={config.brand?.map((opt) => ({
                      value: opt.value,
                      label: (
                        <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>
                          {opt.label}
                        </span>
                      )
                    }))}
                  />
                </Form.Item>
                {/* barcode */}
                {/* <Form.Item name={"barcode"} label="Barcode">
                <Input
                  disabled
                  placeholder="Barcode"
                  style={{ width: "100%" }}
                />
              </Form.Item> */}
                {/* <Form.Item name={"qty"} label="Quantity">
                <InputNumber placeholder="Quantity" style={{ width: "100%" }} />
              </Form.Item> */}
                <Form.Item name={"discount"} label={<span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{t('product.labels.discount')}</span>}>
                  <InputNumber placeholder={t('product.placeholders.discount')} className="khmer-search" style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}
                  name={"category_id"} 
                  label={<span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{t('product.labels.category')}</span>}
                  rules={[
                    {
                      required: true,
                      message: t('validation.category_required'),
                    },
                  ]} 
                >
                  <Select
                    style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}
                    placeholder={t('product.placeholders.category')}
                    allowClear
                    options={config.category?.map((opt) => ({
                      value: opt.value,
                      label: (
                        <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>
                          {opt.label}
                        </span>
                      )
                    }))}
                    // onChange={(id) => {
                    //   setFilter((pre) => ({ ...pre, category_id: id }));
                    // }}
                  />
                </Form.Item>

                <Form.Item
                  name={"price"}
                  style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}
                  label={<span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{t('product.labels.price')}</span>}
                >
                  <InputNumber placeholder={t('product.placeholders.price')} className="khmer-search" style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item name={"status"} label={<span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{t('product.labels.status')}</span>}>
                  <Select
                    style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}
                    placeholder={t('product.placeholders.status')}
                    options={[
                      {
                        label: t('common.active'),
                        value: 1,
                        style: { fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' },
                      },
                      {
                        label: t('common.inactive'),
                        value: 0,
                        style: { fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' },
                      },
                    ]}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item name={"description"} label={<span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{t('product.labels.description')}</span>} style={{ width: "100%", fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>
              <Input.TextArea placeholder={t('product.placeholders.description')} autoSize={{ minRows: 3, maxRows: 6 }} style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }} />
            </Form.Item>

            <Form.Item name={"image_default"} label={<span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{t('product.labels.image')}</span>} className="product_image" style={{ width: "100%", borderRadius: "20px", fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>
              <Upload
                customRequest={(options) => {
                  options.onSuccess();
                  // options.onProgress({ percent: 0 });
                  // options.onProgress({ percent: 100 });
                }}
                // accept=""
                maxCount={1}
                listType="picture-card"
                fileList={imageDefault}
                onPreview={handlePreview} //please chech this
                onChange={handleChangeImageDefault}
                style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}
              >
                {/* <MdImage style={{ fontSize: "30px", fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }} />រូបភាព */}
                <MdImage style={{ fontSize: "30px", fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }} />
                <b style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{t('product.labels.image')}</b>
              </Upload>
            </Form.Item>

            {/* <Form.Item name={"image_optional"} label="Image (Optional)">
            <Upload
              customRequest={(options) => {
                options.onSuccess();
              }}
              listType="picture-card"
              multiple={true}
              maxCount={4}
              fileList={imageOptional}
              onPreview={handlePreview} //please chech this
              onChange={handleChangeImageOptional}
            >
              <div>+Upload</div>
            </Upload>
          </Form.Item> */}

            {previewImage && (
              <Image
                wrapperStyle={{
                  display: "none",
                }}
                preview={{
                  visible: previewOpen,
                  onVisibleChange: (visible) => setPreviewOpen(visible,),
                  afterOpenChange: (visible) => !visible && setPreviewImage(""),
                }}
                src={previewImage}
              // style={{ width: 50, height: 50 ,borderRadius:2}}
              // style={{
              //   width: 30,
              //   height: 30,
              //   borderRadius: 2,
              // }}
              />
            )}
            {/* <Form.Item style={{ textAlign: "right" }}>
            <Space>
              <Button onClick={onCloseModal}>{state.isReadOnly ? "Close" : "Cancel"}</Button>
              {!state.isReadOnly && (
                <Button type="primary" htmlType="submit">
                  {formRef.getFieldValue("id") ? "Update" : "Save"}
                </Button>
              )}
            </Space>
          </Form.Item> */}
          </div>
        </Form>
      </Modal>
      <Table
        dataSource={state.list}
        loading={state.loading}
        rowKey="id"
        // pagination={{
        //   defaultPageSize: 10,
        //     showSizeChanger: true,
        //     showTotal: (total) => `Total ${total} items`,
        //     onChange: (page) => {
        //       refPage.current = page;
        //       getList();
        //     }
        // }}
        pagination={{
          pageSize: 10,
          total: state.total,
          onChange: (page) => {
            // setFilter((pre) => ({ ...pre, page: page }));
            refPage.current = page;
            getList();
          },
        }}
        columns={[
          {
            key: "No",
            title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{t('product.table.no')}</span>,
            render: (item, data, index) => index + 1,
          },
          {
            key: "name",
            title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{t('product.table.name')}</span>,
            dataIndex: "name",
            render: (text) => (
              <div className="truncate-text" title={text} style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>
                {text}
              </div>
            ),
          },
          // {
          //   key: "Barcode",
          //   title: "barcode",
          //   dataIndex: "barcode",
          // },
          {
            key: "Description",
            title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{t('product.table.description')}</span>,
            dataIndex: "description",
            render: (text) => (
              <div className="truncate-text" title={text} style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>
                {text}
              </div>
            ),
          },

          {
            key: "category_name",
            title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{t('product.table.category')}</span>,
            dataIndex: "category_name",
            render: (text) => (
              <div className="truncate-text" title={text} style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>
                {text}
              </div>
            ),
          },
          {
            key: "brand",
            title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{t('product.table.brand')}</span>,
            dataIndex: "brand",
            render: (text) => (
              <div className="truncate-text" title={text} style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>
                {text}
              </div>
            ),
          },
          // {
          //   key: "qty",
          //   title: "Quantity",
          //   dataIndex: "qty",
          // },
          {
            key: "price",
            title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{t('product.table.price')}</span>,
            dataIndex: "price",
            render: (price) => "$" + parseFloat(price).toFixed(2),
          },
          {
            key: "discount",
            title: (
              <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>
                {t('product.table.discount')}
              </span>
            ),
            dataIndex: "discount",
            render: (discount) =>
              discount !== undefined && discount !== null
                ? `${(parseFloat(discount) * 1).toFixed(2)}%`
                : "0%",
          },
          {
            key: "status",
            title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{t('product.table.status')}</span>,
            dataIndex: "status",
            render: (status) =>
              status == 1 ? (
                <Tag color="green" style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{t('common.active')}</Tag>
              ) : (
                <Tag color="red" style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{t('common.inactive')}</Tag>
              ),
          },
          {
            key: "image",
            title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{t('product.table.image')}</span>,
            dataIndex: "image",
            render: (value) =>
              value ? (
                <Image
                  src={"http://localhost/mycoffee/" + value}
                  style={{ width: 50, height: 50, borderRadius: 3 }}
                />
              ) : (
                <div
                  style={{ backgroundColor: "#EEE", width: 40, height: 40 }}
                />
              ),
          },
          {
            key: "Action",
            title: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>{t('product.table.action')}</span>,
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

export default ProductPage;