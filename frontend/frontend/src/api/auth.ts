import axios from "axios";

const API_URL = "http://localhost:6898"; // Change to your backend URL

export const registerUser = async (userData: any) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, userData,{//);
    headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: any) {
    return { error: error.response?.data || "Registration failed" };
  }
};

export const loginUser = async (credentials: any) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    return response.data;
  } catch (error: any) {
    return { error: error.response?.data || "Login failed" };
  }

  
};

export const logoutUser = () => {
    localStorage.removeItem("token"); // Remove stored auth token
    localStorage.removeItem("user"); // Remove user data if stored
  };