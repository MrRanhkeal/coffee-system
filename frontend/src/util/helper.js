import axios from "axios";
import { Config } from "./config";
import { setServerSatus } from "../store/server.store";
import { getAcccessToken } from "../store/profile.store";
import dayjs from "dayjs";


export const request = (url = "", method = "get", data = {}) => {
  var access_token = getAcccessToken();
  // var permission = getPermission();
  // in react
  var headers = { "Content-Type": "application/json" };
  if (data instanceof FormData) {
    // check if param data is FormData
    headers = { "Content-Type": "multipart/form-data" };
  }
  var param_query = "?";
  if (method == "get" && data instanceof Object) {
    Object.keys(data).map((key) => {
      if (data[key] != "" && data[key] != null) {
        param_query += "&" + key + "=" + data[key];
      }
    });
  }
  return axios({
    url: Config.base_url + url + param_query,
    method: method,
    data: data,
    headers: {
      ...headers,
      Authorization: "Bearer " + access_token,
    },
  })
    .then((res) => {
      setServerSatus(200);
      return res.data;
    })
    .catch((err) => {
      var response = err.response;
      if (response) {
        var status = response.status;
        if (status == "401") {
          status = 403;
        }
        setServerSatus(status);
      } else if (err.code == "ERR_NETWORK") {
        setServerSatus("error");
      }
      console.log(">>>", err);
      return false;
    });
};

export const formatDateClient = (date,) => {
  const utcDate = new Date(date);
  // Manually add 7 hours (UTC+7)
  const utcPlus7 = new Date(utcDate.getTime() + 7 * 60 * 60 * 1000);
  return utcPlus7.toLocaleString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
};

export const formatDateServer = (date, format = "YYYY-MM-DD HH:mm:ss") => {
  if (date) return dayjs(date).format(format);
  return null;
};