import { apiConnector } from "./apiconnector";
import { User_api, Expenses_api, getEndpoint } from "./apis";

export const api = {
  auth: {
    signUp: async (name, email, password, otp) => {
      const response = await apiConnector("POST", User_api.REGISTER, { name, email, password,otp }, {
        headers: {
            'Content-Type': 'application/json'
        },
        withCredentials: true
    });
      return response.data; // Return only the necessary data
    },
    signIn: async (email, password) => {
      const response = await apiConnector("POST", User_api.LOGIN, { email, password },{
        headers: {
            'Content-Type': 'application/json'
        },
        withCredentials: true
    });
      return response.data;
    },
    logout: async () => {
      const response = await apiConnector("GET", User_api.LOGOUT);
      return response.data;
    },
    refreshToken: async () => {
      const response = await apiConnector("GET", User_api.REFRESHTOKEN);
      return response.data;
    },
    sendOtp: async (email) => {
      const response = await apiConnector("POST", User_api.SENDOTP, { email }, {
        headers: {
            'Content-Type': 'application/json'
        },
        withCredentials: true
    });
      return response.data;
    },
  },
  expenses: {
    getAll: async () => {
      const response = await apiConnector("GET", Expenses_api.GETEXPENSE);
      return response.data;
    },
    create: async (expense) => {
      const response = await apiConnector("POST", Expenses_api.CREATEEXPENSE, expense,{
        headers: {
            'Content-Type': 'application/json'
        },
        withCredentials: true
    });
      return response.data;
    },
    update: async (id, expense) => {
      const url = getEndpoint(Expenses_api.UPDATEEXPENSE, { id });
      const response = await apiConnector("PUT", url, expense,{
        headers: {
            'Content-Type': 'application/json'
        },
        withCredentials: true
    });
      return response.data;
    },
    delete: async (id) => {
      const url = getEndpoint(Expenses_api.DELETEEXPENSE, { id });
      const response = await apiConnector("DELETE", url);
      return response.data;
    },
  },
};
