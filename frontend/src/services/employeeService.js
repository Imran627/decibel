import api from "./api";

export const employeeService = {
  list: (params) => api.get("/employees", { params }),
  get: (id) => api.get(`/employees/${id}`),
  create: (data) => api.post("/employees", data),
  update: (id, data) => api.put(`/employees/${id}`, data),
  remove: (id) => api.delete(`/employees/${id}`),
  leaveBalances: (id, year) => api.get(`/employees/${id}/leave-balances`, { params: { year } }),
};

export const departmentService = {
  list: (params) => api.get("/departments", { params }),
  create: (data) => api.post("/departments", data),
  update: (id, data) => api.put(`/departments/${id}`, data),
  remove: (id) => api.delete(`/departments/${id}`),
};

export const designationService = {
  list: (params) => api.get("/designations", { params }),
  create: (data) => api.post("/designations", data),
  update: (id, data) => api.put(`/designations/${id}`, data),
  remove: (id) => api.delete(`/designations/${id}`),
};
