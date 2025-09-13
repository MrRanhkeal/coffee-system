import { Button, message, Result, Spin } from "antd";
import React from "react";
import PropTypes from 'prop-types';
import { getServerStatus } from "../../store/server.store";

const info = {
  404: {
    message: "404-Route Not Found !",
    sub: "404-Route Not Found. Please confirm your currect route that request to server",
  },
  403: {
    message: "403-Authorized !",
    sub: "Sorry, you are not authorized to access this page.",
  },
  500: {
    message: "500-Internal Error Server !",
    sub: "please contact administrator",
  },
  error: {
    message: "Can not connect to server !",
    sub: "please contact administrator",
  },
};
function MainPage({ children, loading }) {
  var server_status = getServerStatus();
  const isServerError =
    server_status == "403" ||
    server_status == "500" ||
    server_status == "404" ||
    server_status == "error";
  if (isServerError) {
    return (
      <Result
        status={server_status + ""}
        title={info[server_status].message}
        subTitle={info[server_status].sub}
        extra={<Button type="primary" href="/pos">Back Home</Button>}
      />
    );
  }

  return (
    <div>
      <Spin spinning={loading}>{children}</Spin>
    </div>
  );
}
MainPage.propTypes = {
  children: PropTypes.node,
  loading: PropTypes.bool,
};

export default MainPage;