import axios from "axios";
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || "/api" });
export const getTransactions = (params) => api.get("/transactions", { params }).then((r) => r.data);
export const saveTransaction = (data, id) => id ? api.put(`/transactions/${id}`, data).then((r) => r.data.data) : api.post("/transactions", data).then((r) => r.data.data);
export const deleteTransaction = (id) => api.delete(`/transactions/${id}`);
export const getSummary = (params) => api.get("/dashboard/summary", { params }).then((r) => r.data);
export const getCharts = (params) => api.get("/dashboard/charts", { params }).then((r) => r.data);
export const getReport = (path, params) => api.get(`/reports/${path}`, { params }).then((r) => r.data);
