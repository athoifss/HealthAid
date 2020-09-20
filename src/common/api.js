import Axios from "axios";
import config from "./config.js";

const { baseUrl, apiToken } = config;

export const postRequest = (path, data) => {
  return Axios.post(`${baseUrl}/${path}`, data, {
    headers: {
      "auth-key": apiToken,
    },
  });
};

export const getRequest = (path) => {
  return Axios.get(`${baseUrl}/${path}`, {
    headers: {
      "auth-key": apiToken,
    },
  });
};
