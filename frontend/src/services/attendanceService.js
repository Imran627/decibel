import api from "./api";

export const attendanceService = {
  list: (params) => api.get("/attendance", { params }),
  checkIn: (data) => api.post("/attendance/check-in", data),
  checkOut: (data) => api.post("/attendance/check-out", data),
  update: (id, data) => api.put(`/attendance/${id}`, data),
};
