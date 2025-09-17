import { useEffect, useState } from "react";
import { AlignCenterOutlined,AppstoreOutlined,DollarOutlined,HomeOutlined,SettingOutlined,ShopOutlined,ShoppingCartOutlined,SlidersOutlined, 
TransactionOutlined, AppstoreAddOutlined, UsergroupAddOutlined, UserOutlined, UserSwitchOutlined} from "@ant-design/icons";
import { BsPeople,BsCurrencyExchange } from "react-icons/bs";
import { BiLogOutCircle } from "react-icons/bi";
import { Dropdown, Layout, Menu, theme } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import { MdOutlineLibraryBooks } from "react-icons/md";
import { TbReportAnalytics } from "react-icons/tb";
import "./MainLayout.css";
import Logo from "../../assets/v-friends.jpg";
import ImgUser from "../../assets/admin.jpg";
import { IoIosNotifications } from "react-icons/io";
import { MdOutlineMarkEmailUnread } from "react-icons/md"; 
import {
  getPermission, getProfile, setAcccessToken, setProfile, setPermission } from "../../store/profile.store";
import { request } from "../../util/helper";
import { configStore } from "../../store/configStore";
// import { icons } from "antd/es/image/PreviewGroup";
const { Content, Sider } = Layout;

const items_menu = [
  {
    key: "",
    style: { fontFamily: 'Noto Sans Khmer, Roboto, sans-serif'},
    label: "ទំព័រដើម",
    children: null,
    icon: <HomeOutlined />
  },
  {
    key: "pos",
    style: { fontFamily: 'Noto Sans Khmer, Roboto, sans-serif'},
    label: "កាលក់",
    children: null,
    icon: <ShopOutlined />
  },
  {
    label: "ទំនិញ",
    // children: [
    //   {
    //     key: "product",
    //     label: "List Porduct",
    //     children: null,
    //     icon: <UnorderedListOutlined />
    //   },
    //   {
    //     key: "category",
    //     label: "Category",
    //     children: null,
    //     icon: <SortDescendingOutlined />
    //   },
    // ],
    key: "product",
    style: { fontFamily: 'Noto Sans Khmer, Roboto, sans-serif'},
    children: null,
    // icon: <UnorderedListOutlined />
    icon: <AppstoreOutlined />
  },
  {
    key: "category",
    style: { fontFamily: 'Noto Sans Khmer, Roboto, sans-serif'},
    label: "ប្រភេទទំនិញ",
    children: null,
    icon: <AppstoreAddOutlined />
  },
  {
    key: "customer",
    style: { fontFamily: 'Noto Sans Khmer, Roboto, sans-serif'},
    label: "អតិថិជន",
    children: null,
    icon: <UsergroupAddOutlined />
  },
  {
    key: "order",
    style: { fontFamily: 'Noto Sans Khmer, Roboto, sans-serif'},
    label: "ការបញ្ចារទិញ",
    children: null,
    icon: <ShoppingCartOutlined />
  },
  {
    key: "supplier",
    style: { fontFamily: 'Noto Sans Khmer, Roboto, sans-serif'},
    label: "អ្នកផ្គត់ផ្គង់",
    children: null,
    icon: <UserSwitchOutlined />
    // icon: <ShoppingOutlined />
  },
  {
    label: "ការចំណាយ",
    style: { fontFamily: 'Noto Sans Khmer, Roboto, sans-serif'},
    children: [
      {
        key: "expanse",
        style: { fontFamily: 'Noto Sans Khmer, Roboto, sans-serif'},
        label: "ការចំណាយ",
        children: null,
        icon: <DollarOutlined />
      },
    ],
    icon: <TransactionOutlined />
  },
  {
    label: "ស្តុក",
    style: { fontFamily: 'Noto Sans Khmer, Roboto, sans-serif'},
    children: [
      {
        key: "stock",
        style: { fontFamily: 'Noto Sans Khmer, Roboto, sans-serif'},
        label: "ស្តុកកាហ្វេ",
        children: null,
        icon: "💹"
        // icon: <StockOutlined/>
      },
      // {
      //   key: 'product_stock',
      //   style: { fontFamily: 'Noto Sans Khmer, Roboto, sans-serif'},
      //   label: "ស្តុកផ្សេងៗ",
      //   children: null,
      //   icon: "💹"
      //   // icon: <StockOutlined/>
      // }
    ],
    icon: <SlidersOutlined />
  },
  {
    label: "របាយការណ៍",
    style: { fontFamily: 'Noto Sans Khmer, Roboto, sans-serif'},
    children: [
      // {
      //   key: "report_sale_summary",
      //   label: "Sale summary",
      //   children: null,
      //   icon: <AlignCenterOutlined />
      // },
      // {
      //   key: "report_expense_summary",
      //   label: "Expense Summary",
      //   children: null,
      //   icon: <AccountBookOutlined />
      // },
      {
        key: "getsalereport",
        style: { fontFamily: 'Noto Sans Khmer, Roboto, sans-serif'},
        label: "របាយការណ៍នៃការលក់",
        children: null,
        // icon: <LuNotebookText />
        icon: <TbReportAnalytics />
      },
      {
        key: "get_sale_summary",
        style: { fontFamily: 'Noto Sans Khmer, Roboto, sans-serif'},
        label: "របាយការណ៍លំអិតការលក់",
        children: null,
        icon: <AlignCenterOutlined />
      }
    ],
    // icon: <SnippetsOutlined />
    icon: <MdOutlineLibraryBooks />
  },

  {
    label: "អ្នកប្រើប្រាស់ទូទៅ",
    style: { fontFamily: 'Noto Sans Khmer, Roboto, sans-serif'},
    children: [
      {
        key: "user",
        style: { fontFamily: 'Noto Sans Khmer, Roboto, sans-serif'},
        label: "អ្នកប្រើប្រាស់",
        children: null,
        icon: <BsPeople />
      },
      {
        key: "role",
        style: { fontFamily: 'Noto Sans Khmer, Roboto, sans-serif'},
        label: "កំណត់ការប្រើប្រាស់",
        children: null,
        icon: <UserOutlined />
      }
    ],
    icon: <UsergroupAddOutlined />
  },

  {
    label: "កំណត់",
    style: { fontFamily: 'Noto Sans Khmer, Roboto, sans-serif'},
    children: [
      {
        key: "Currency",
        style: { fontFamily: 'Noto Sans Khmer, Roboto, sans-serif'},
        label: "ប្ដូរប្រាក់",
        children: null,
        icon: <BsCurrencyExchange />
      }
    ],
    icon: <SettingOutlined />
  },
];

const MainLayout = () => {
  const permission = getPermission();
  const { setConfig } = configStore();
  const profile = getProfile();
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const navigate = useNavigate();

  const [items, setItems] = useState([]);

  useEffect(() => {
        const link = document.createElement('link');
        link.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans+Khmer:wght@400;700&family=Roboto:wght@400;700&display=swap';
        link.rel = 'stylesheet';
        document.head.appendChild(link);
        return () => { document.head.removeChild(link); };
    }, []);

  useEffect(() => {
    getMenuByUser();
    getConfig();
    if (!profile) {
      navigate("/login");
    }
  }, []);

  const getMenuByUser = () => {
    let new_item_menu = [];
    if (permission?.all) {
      // Admin: show all menu items
      new_item_menu = [...items_menu];
    } else if (permission && typeof permission === 'object' && !Array.isArray(permission)) {
      // New object-based permission: include items with truthy key or allowed children
      items_menu.forEach((item) => {
        const isAllowed = !!permission[item.key];
        let allowedChildren = [];
        if (item?.children && item.children.length > 0) {
          allowedChildren = item.children.filter((child) => !!permission[child.key]);
        }
        if (allowedChildren.length > 0) {
          new_item_menu.push({ ...item, children: allowedChildren });
        } else if (isAllowed || (item.key === "" && (permission[""] || permission.dashboard))) {
          new_item_menu.push(item);
        }
      });
    } 
    // else if (permission?.pos || permission?.order || permission?.customer) {
    //   // Backward-compatibility special-case for POS-like roles
    //   new_item_menu = items_menu.filter(item => ["", "pos", "order", "customer"].includes(item.key));
    // } 
    else if (Array.isArray(permission)) {
      // Fallback to old array logic
      items_menu?.map((item1) => {
        // level one
        const p1 = permission?.findIndex(
          (data1) => data1.web_route_key == "/" + item1.key
        );
        if (p1 != -1) {
          new_item_menu.push(item1);
        }
        // level two
        if (item1?.children && item1?.children.length > 0) {
          let childTmp = [];
          item1?.children.map((data1) => {
            permission?.map((data2) => {
              if (data2.web_route_key == "/" + data1.key) {
                childTmp.push(data1);
              }
            });
          });
          if (childTmp.length > 0) {
            item1.children = childTmp; // update new child
            new_item_menu.push(item1);
          }
        }
      });
    }
    setItems(new_item_menu);
  };

  const getConfig = async () => {
    const res = await request("config", "get");
    if (res) {
      setConfig(res);
    }
  };

  const onClickMenu = (item) => {
    navigate(item.key);
  };
  const onLoginOut = () => {
    setProfile("");
    setAcccessToken("");
    setPermission("");
    navigate("/login");
  };

  if (!profile) {
    return null;
  }

  const itemsDropdown = [
    // {
    //   key: "1",
    //   label: (
    //     <a target="_blank" rel="noopener noreferrer" href="/" style={{ color: "green-yellow", fontSize: 15 }}>
    //       Profile
    //     </a>
    //   ),
    //   icon: <ProfileOutlined />
    // },
    // {
    //   key: "2",
    //   label: (
    //     <a target="_blank" rel="noopener noreferrer" href="/">
    //       chage password
    //     </a>
    //   ),
    //   icon: <SmileOutlined />,
    //   disabled: true,
    // },
    {
      key: "logout",
      danger: true,
      label: "LOGOUT",
      icon: <BiLogOutCircle style={{ color: "red", fontSize: 20 }}/>
    },
  ];

  return (
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="demo-logo-vertical" />
        {/* {permission?.map((item, index) => (
          <div key={index}>
            <div>
              {item.name}:{item.web_route_key}
            </div>
          </div>
        ))} */}
        <Menu
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={items}
          onClick={onClickMenu}
        />
      </Sider>
      <Layout>
        <div className="admin-header">
          <div className="admin-header-g1">
            <div style={{padding:'6px',margin:'6px 0 0 0'}}>
              <img className="admin-logo" src={Logo} alt="Logo" />
              <div style={{ fontWeight: 'bold', color: 'green' }}>V-Friend Coffee</div>
            </div>
            <div>
              <div className="txt-brand-name" style={{ fontFamily: 'Khmer OS Muol Light', fontWeight: 'bold',color:'#ea2618ff',fontSize:'30px',alignContent: 'center',justifyContent: 'center',margin: '30px 0 0 400px'}}>ប្រព័ន្ធគ្រប់គ្រង និងការលក់</div>
              {/* <div className="txt-brand-name">Count : {count}</div> */}

              
            </div>
            {/* <div>
              <Input.Search
                style={{ width: 180, marginLeft: 15, marginTop: 10 }}
                size="large"
                placeholder="Search"
              />
            </div> */}
          </div>

          <div className="admin-header-g2">
            {/* <div>
              <Dropdown
                menu={{
                  items: [
                    {
                      key: "en",
                      label: "English",
                    },
                    {
                      key: "kh",
                      label: "Khmer",
                    },
                  ],
                  onClick: (event) => {
                    if (event.key == "en") {
                      setConfig({ lang: "en" });
                    } else if (event.key == "kh") {
                      setConfig({ lang: "kh" });
                    }
                  },
                }}
                trigger={['click']}
                placement="bottomRight"
              >
                <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span>Language</span>
                  <GrLanguage style={{ fontSize: '18px' }} />
                </div>
              </Dropdown>
            </div>
            <div>&nbsp;&nbsp;&nbsp;</div> */}
            <IoIosNotifications className="icon-notify" style={{ width: 30, height: 30 }} />
            <MdOutlineMarkEmailUnread className="icon-email" style={{ width: 30, height: 30 }} />
            <div>
              <div className="txt-username">{profile?.name}</div>
              <div>{profile?.role_name}</div>
            </div>
            <Dropdown
              menu={{
                items: itemsDropdown,
                onClick: (event) => {
                  if (event.key == "logout") {
                    onLoginOut();
                  }
                },
              }}
            >
              <img className="img-user" src={ImgUser} alt="Logo" style={{ width: 50, height: 50 }} />
            </Dropdown>
          </div>
        </div>
        <Content
          style={{
            margin: "10px",
          }}
        >
          <div
            className="admin-body"
            style={{
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};
export default MainLayout;
