import { useEffect, useState } from "react";
import {
  AlignCenterOutlined, AppstoreOutlined, DollarOutlined, HomeOutlined, SettingOutlined, ShopOutlined, ShoppingCartOutlined, SlidersOutlined,
  TransactionOutlined, AppstoreAddOutlined, UsergroupAddOutlined, UserOutlined, UserSwitchOutlined
} from "@ant-design/icons";
import { BsPeople, BsCurrencyExchange } from "react-icons/bs";
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
import { getPermission, getProfile, setAcccessToken, setProfile, setPermission } from "../../store/profile.store";
import { request } from "../../util/helper";
import { configStore } from "../../store/configStore";
import { useTranslation } from "react-i18next";
import { GrLanguage } from "react-icons/gr";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { HiDocumentReport } from "react-icons/hi";
import { TbReportMoney } from "react-icons/tb";
// import { icons } from "antd/es/image/PreviewGroup";
const { Content, Sider } = Layout;

// Menu items are built dynamically using i18n inside the component

const MainLayout = () => {
  const { t, i18n } = useTranslation();
  const permission = getPermission();
  const { setConfig } = configStore();
  const profile = getProfile();
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const navigate = useNavigate();

  const [items, setItems] = useState([]);

  // Update document lang when language changes
  useEffect(() => {
    document.documentElement.lang = i18n.language || 'en';
  }, [i18n.language]);

  // Build menu items with translated labels
  const menuTemplate = [
    {
      key: "",
      style: { fontFamily: 'Noto Sans Khmer, Roboto, sans-serif', fontSize: '16px', fontWeight: 'bold' },
      label: t('menu.dashboard'),
      children: null,
      icon: <HomeOutlined />
    },
    {
      key: "pos",
      style: { fontFamily: 'Noto Sans Khmer, Roboto, sans-serif', fontSize: '14px', fontWeight: 'bold' },
      label: t('menu.pos'),
      children: null,
      icon: <ShopOutlined />
    },
    {
      label: t('menu.product'),
      key: "product",
      style: { fontFamily: 'Noto Sans Khmer, Roboto, sans-serif', fontSize: '14px', fontWeight: 'bold' },
      children: null,
      icon: <AppstoreOutlined />
    },
    {
      key: "category",
      style: { fontFamily: 'Noto Sans Khmer, Roboto, sans-serif', fontSize: '14px', fontWeight: 'bold' },
      label: t('menu.category'),
      children: null,
      icon: <AppstoreAddOutlined />
    },
    {
      key: "customer",
      style: { fontFamily: 'Noto Sans Khmer, Roboto, sans-serif', fontSize: '14px', fontWeight: 'bold' },
      label: t('menu.customer'),
      children: null,
      icon: <UsergroupAddOutlined />
    },
    {
      key: "order",
      style: { fontFamily: 'Noto Sans Khmer, Roboto, sans-serif', fontSize: '14px', fontWeight: 'bold' },
      label: t('menu.order'),
      children: null,
      icon: <ShoppingCartOutlined />
    },
    {
      key: "supplier",
      style: { fontFamily: 'Noto Sans Khmer, Roboto, sans-serif', fontSize: '14px', fontWeight: 'bold' },
      label: t('menu.supplier'),
      children: null,
      icon: <UserSwitchOutlined />
    },
    {
      label: t('menu.expense'),
      style: { fontFamily: 'Noto Sans Khmer, Roboto, sans-serif', fontSize: '14px', fontWeight: 'bold' },
      children: [
        {
          key: "expanse",
          style: { fontFamily: 'Noto Sans Khmer, Roboto, sans-serif', fontSize: '14px', fontWeight: 'bold' },
          label: t('menu.expense'),
          children: null,
          icon: <DollarOutlined />
        },
      ],
      icon: <TransactionOutlined />
    },
    {
      label: t('menu.stock'),
      style: { fontFamily: 'Noto Sans Khmer, Roboto, sans-serif', fontSize: '14px', fontWeight: 'bold' },
      children: [
        {
          key: "stock",
          style: { fontFamily: 'Noto Sans Khmer, Roboto, sans-serif', fontSize: '14px', fontWeight: 'bold' },
          label: t('menu.stock_coffee'),
          children: null,
          icon: "💹",
        },
      ],
      icon: <SlidersOutlined />
    },
    {
      label: t('menu.report'),
      style: { fontFamily: 'Noto Sans Khmer, Roboto, sans-serif', fontSize: '14px', fontWeight: 'bold' },
      children: [
        {
          key: "salereport",
          style: { fontFamily: 'Noto Sans Khmer, Roboto, sans-serif', fontSize: '14px', fontWeight: 'bold' },
          label: t('menu.salereport'),
          children: null,
          icon: <TbReportAnalytics />
        },
        {
          key: "salesummary",
          style: { fontFamily: 'Noto Sans Khmer, Roboto, sans-serif', fontSize: '14px', fontWeight: 'bold' },
          label: t('menu.salesummary'),
          children: null,
          icon: <AlignCenterOutlined />
        },
        {
          key: "expensereport",
          style: { fontFamily: 'Noto Sans Khmer, Roboto, sans-serif', fontSize: '14px', fontWeight: 'bold' },
          label: t('menu.expensereport'),
          children: null,
          icon: <HiOutlineDocumentReport />
        },
        {
          key: "stockreport",
          style: { fontFamily: 'Noto Sans Khmer, Roboto, sans-serif', fontSize: '14px', fontWeight: 'bold' },
          label: t('menu.stockreport'),
          children: null,
          icon: <HiDocumentReport />
        },
        {
          key: "productreport",
          style: { fontFamily: 'Noto Sans Khmer, Roboto, sans-serif', fontSize: '14px', fontWeight: 'bold' },
          label: t('menu.productreport'),
          children: null,
          icon: <TbReportMoney />
        }
      ],
      icon: <MdOutlineLibraryBooks />
    },
    {
      label: t('menu.users_group'),
      style: { fontFamily: 'Noto Sans Khmer, Roboto, sans-serif', fontSize: '14px', fontWeight: 'bold' },
      children: [
        {
          key: "user",
          style: { fontFamily: 'Noto Sans Khmer, Roboto, sans-serif', fontSize: '14px', fontWeight: 'bold' },
          label: t('menu.user'),
          children: null,
          icon: <BsPeople />
        },
        {
          key: "role",
          style: { fontFamily: 'Noto Sans Khmer, Roboto, sans-serif', fontSize: '14px', fontWeight: 'bold' },
          label: t('menu.role'),
          children: null,
          icon: <UserOutlined />
        }
      ],
      icon: <UsergroupAddOutlined />
    },
    {
      label: t('menu.setting'),
      style: { fontFamily: 'Noto Sans Khmer, Roboto, sans-serif', fontSize: '14px', fontWeight: 'bold' },
      children: [
        {
          key: "Currency",
          style: { fontFamily: 'Noto Sans Khmer, Roboto, sans-serif', fontSize: '14px' },
          label: t('menu.currency'),
          children: null,
          icon: <BsCurrencyExchange />
        }
      ],
      icon: <SettingOutlined />
    },
  ];

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans+Khmer:wght@400;700&family=Roboto:wght@400;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);

  // Run once on mount
  useEffect(() => {
    getConfig();
    getMenuByUser();
    if (!profile) {
      navigate("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Rebuild menu when language changes
  useEffect(() => {
    getMenuByUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);

  const getMenuByUser = () => {
    let new_item_menu = [];
    if (permission?.all) {
      // Admin: show all menu items
      new_item_menu = [...menuTemplate];
    } else if (permission && typeof permission === 'object' && !Array.isArray(permission)) {
      // New object-based permission: include items with truthy key or allowed children
      menuTemplate.forEach((item) => {
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
      menuTemplate?.map((item1) => {
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
      label: t('common.logout'),
      style: { fontFamily: 'Noto Sans Khmer, Roboto, sans-serif', fontSize: '14px', fontWeight: 'bold' },
      icon: <BiLogOutCircle style={{ color: "red", fontSize: 20 }} />
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
          className="custom-sidebar-menu"
        />
      </Sider>
      <Layout>
        <div className="admin-header">
          <div className="admin-header-g1">
            <div style={{ padding: '6px', margin: '6px 0 0 0' }}>
              <img className="admin-logo" src={Logo} alt="Logo" />
              <div style={{ fontWeight: 'bold', color: 'green', fontFamily: 'Noto Sans Khmer, Roboto, sans-serif'}}>{t('app.brand')}</div>
            </div>
            <div>
              <div className="txt-brand-name" style={{ fontFamily: 'Khmer OS Muol Light', fontWeight: 'bold', color: '#ea2618ff', fontSize: '30px', alignContent: 'center', justifyContent: 'center', margin: '30px 0 0 300px' }}>{t('app.title')}</div>
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
            <div>
              <Dropdown
                menu={{
                  items: [ 
                    {
                      key: 'en',
                      label: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif', fontSize: '14px', fontWeight: 'bold'}}>{t('common.english')}</span>,
                    },
                    {
                      key: 'kh',
                      label: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif', fontSize: '14px', fontWeight: 'bold' }}>{t('common.khmer')}</span>,
                    },
                    {
                      key: 'ch',
                      label: <span style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif', fontSize: '14px', fontWeight: 'bold' }}>{t('common.chinese')}</span>,
                    } 
                  ],
                  onClick: (event) => {
                    i18n.changeLanguage(event.key);
                  },
                }}
                trigger={['click']}
                placement="bottomRight"
                overlayClassName="custom-dropdown"
              >
                <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontFamily: 'Noto Sans Khmer, Roboto, sans-serif', fontSize: '14px', fontWeight: 'bold' }}>
                  <span>{t('common.language')}</span>
                  <GrLanguage style={{ fontSize: '18px', }} />
                </div>
              </Dropdown>
            </div>
            <div>&nbsp;&nbsp;&nbsp;</div>
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
