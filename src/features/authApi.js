import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api",
});

// ✅ Attach token automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export const registerUser = (data) => API.post("/auth/register", data);

export const loginUser = (data) => API.post("/auth/login", data);

export const getPlans = () => API.get("/auth/getplans");

export const subscribePlan = (planId) => API.post(`/auth/subscribe/${planId}`);

export const getMyPlans = () => API.get("/auth/my-subscriptions");


// Admin APIs

export const createOrder = (data) => API.post("/auth/create-order", data);

export const dashboard = (data) => API.post("/auth/dashboard", data);

export const createPlan = (data) => API.post("/auth/plans", data);

export const updatePlan = (data) => API.post("/auth/update", data);

export const deletePlan = (planId) => API.delete(`/auth/delete/${planId}`);

export const Admindashboard = (data) => API.post("/auth/Dashboard", data);

export const getAllUsers = (data) => API.get("/auth/allusers", data);




