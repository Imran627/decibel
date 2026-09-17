import api from "./api";

export const leaveService = {
  types: () => api.get("/leave-types"),
  createType: (data) => api.post("/leave-types", data),
  requests: (params) => api.get("/leave-requests", { params }),
  submitRequest: (data) => api.post("/leave-requests", data),
  approve: (id, comment) => api.post(`/leave-requests/${id}/approve`, { comment }),
  reject: (id, comment) => api.post(`/leave-requests/${id}/reject`, { comment }),
};
