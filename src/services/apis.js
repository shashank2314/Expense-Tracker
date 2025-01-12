// const BASE_URL = "http://localhost:4000/api/v1"; // Adjust as necessary
const BASE_URL = `${process.env.REACT_APP_URL}/api/v1`
export const User_api = {
  LOGIN: `${BASE_URL}/login`,
  REGISTER: `${BASE_URL}/register`,
  LOGOUT: `${BASE_URL}/logout`,
  REFRESHTOKEN: `${BASE_URL}/refreshtoken`,
  SENDOTP: `${BASE_URL}/sendotp`,
};

export const Expenses_api = {
  CREATEEXPENSE: `${BASE_URL}/expenses`,
  GETEXPENSE: `${BASE_URL}/expenses`,
  UPDATEEXPENSE: `${BASE_URL}/expenses/:id`,
  DELETEEXPENSE: `${BASE_URL}/expenses/:id`,
};

// Helper function for dynamic endpoints
export const getEndpoint = (endpoint, params) => {
  let url = endpoint;
  Object.keys(params).forEach((param) => {
    url = url.replace(`:${param}`, params[param]);
  });
  return url;
};
