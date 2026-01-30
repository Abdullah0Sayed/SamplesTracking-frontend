import http from "../http";

const ENDPOINT = `users`;

export const adminsService = {
  getAllAdmins: (params = {}) => http.get(ENDPOINT, { params }),
  deleteAdmin: (id) => http.delete(`${ENDPOINT}/${id}`),
  blockAdmin: (id) => http.post(`admin/userBlock`, { id }),
  unBlockAdmin: (id) => http.post(`admin/userUnblock`, { id }),
  addAdmin: (payload) => http.post(`${ENDPOINT}`, payload),
  updateAdmin: (payload) => http.put(`${ENDPOINT}/${payload.id}`, payload),
  getAdmin: (id) => http.get(`${ENDPOINT}/${id}`),
  exportSheet: (ids = [], action) =>
    http.post(`${ENDPOINT}/export-csv`, { ids, action }),
};
