import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const registerUser = async (data: any) => {
  const res = await axios.post(`${BASE_URL}/register`, data);
  return res.data;
};

export const loginUser = async (data: any) => {
  const res = await axios.post(`${BASE_URL}/login`, data, {
    withCredentials: true, // important for cookies
  });
  return res.data; // backend returns { user }
};

