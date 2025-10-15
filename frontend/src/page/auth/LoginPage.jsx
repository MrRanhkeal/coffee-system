import { useEffect, useState } from "react";
import { Form, message } from "antd";
import { request } from "../../util/helper";
import { setAcccessToken, setPermission, setProfile } from "../../store/profile.store";
import { useNavigate } from "react-router-dom";
import { LoginOutlined, EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { FcLock } from "react-icons/fc";
import { FcBusinessman } from "react-icons/fc"; 
// import "./LoginPage.css";
import backgroundImage from '../../assets/coffee_Image_backgorund.png';
import './LoginPage.css';
import { useTranslation } from "react-i18next";
function LoginPage() { 
  const [showPassword, setShowPassword] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const onLogin = async (values) => {
    try {
      const res = await request("auth/login", "post", values);
      if (res && res.error) {
        message.error(res.error?.message || t('login.failed'));

      } else if (res && res.access_token) {
        setAcccessToken(res.access_token);
        setProfile(JSON.stringify(res.profile));
        setPermission(res.permission);
        message.success(t('login.success'));
        navigate("/");
      } else {
        message.error(t('login.error'));
      }
    } catch (err) {
      console.error("Login error:", err);
      message.error(t('login.error'));
    }
  };
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans+Khmer:wght@400;700&family=Roboto:wght@400;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);
  return (
    <div className="login-page" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      
      <Form
        form={form}
        name="login"
        initialValues={{ remember: true }}
        onFinish={onLogin}
        layout="vertical"
        size="large"
        className="login-form"
      >
        <h2 
          style={{
            color: "#12CC60",
            fontSize: "40px",
            fontWeight: "bold",
            textAlign: "center",
            margin: "0 0 20px 0",
            fontFamily: "Noto Sans Khmer, Roboto, sans-serif",
          }}
        > 
          {t('login.titles')}
        </h2>

        {/* Username */}
        <Form.Item
          name="username"
          type="email"
          rules={[{ required: true, message: t('validation.username_required') }]}
        >
          <div className="input-field" type='email'>
            <i>
              <FcBusinessman />
            </i>
            <input
              type="email"
              placeholder=" "  
              autoComplete="email" 
              style={{
                fontFamily: "Noto Sans Khmer, Roboto, sans-serif", 
                margin: "0 0 0 20px",
                color: "#ffffffff",
              }}
            />
            <label
              style={{
                fontFamily: "Noto Sans Khmer, Roboto, sans-serif", 
                fontWeight: "bold",
                margin: "0 0 0 20px",
                color: "#080808ff",
              }}
            >
              {t('login.username')}
            </label>
          </div>
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: t('validation.password_required') }]}
        >
          <div className="input-field" style={{ position: "relative" }}>
            <i>
              <FcLock />
            </i>
            <input
              type={showPassword ? "text" : "password"}
              placeholder=" "
              autoComplete="current-password"
              style={{
                fontFamily: "Noto Sans Khmer, Roboto, sans-serif", 
                margin: "0 0 0 20px",
                color: "#ffffffff",
                paddingRight: "35px", // Add space for the icon
              }}
            />
            <label
              style={{
                fontFamily: "Noto Sans Khmer, Roboto, sans-serif",
                fontWeight: "bold",
                margin: "0 0 0 20px",
                color: "#080808ff",
              }}
            >
              {t('login.password')}
            </label> 
            {/* Toggle eye icon */}
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                fontSize: "20px",
                color: "#d43232ff",
                zIndex: 2,
              }}
            >
              {showPassword ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
            </span>
            {/* <label
              style={{
                fontFamily: "Noto Sans Khmer, Roboto, sans-serif",
                fontWeight: "bold",
                margin: "0 0 0 20px",
                color: "#030a04ff",
              }}
            >
              ពាក្យសម្ងាត់
            </label> */}

            {/* Toggle eye icon */}
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                fontSize: "18px",
              }} 
            > 
            </span>
          </div>
        </Form.Item>

        {/* Remember me */}
        <Form.Item>
          <div className="check-group">
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <div className="check-box">
                <input type="checkbox" />
                <span style={{fontFamily: "Noto Sans Khmer, Roboto, sans-serif", color: "#080808ff"}}>{t('login.remember')}</span>
              </div>
            </Form.Item>
          </div>
        </Form.Item>

        {/* Submit */}
        <Form.Item style={{ width: '50%', justifyContent: 'center',  margin: '0 auto'}}>
          <button className="login-title"
            type="submit"
            style={{fontFamily: "Noto Sans Khmer, Roboto, sans-serif"}} 
          >
            <LoginOutlined 
            style={{ marginRight: "8px" }}  
            />
            {t('login.submit')}
          </button>
        </Form.Item>
      </Form>
    </div>  
  );
}

export default LoginPage;
