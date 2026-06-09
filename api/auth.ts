import axios from "axios";

const BASE_URL = "http://localhost:5000/api/v1/auth";

export const registerUser = async (data: any) => {
  const res = await axios.post(`${BASE_URL}/register`, data);
  return res.data; // user created
};

export const loginUser = async (data: any) => {
  const res = await axios.post(`${BASE_URL}/login`, data, { withCredentials: true });
  return res.data;
};