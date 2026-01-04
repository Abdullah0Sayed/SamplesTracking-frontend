import http from "../http";

const ENDPOINT = `admin/clients`;

export const clientsService = {
  getAllClients: (params = {}) => http.get(`${ENDPOINT}`, { params }),
  addClient: (payload) => http.post(`${ENDPOINT}`, payload),
  updateClient: (payload) => http.put(`${ENDPOINT}/${payload.id}`, payload),
  getClient: (id) => http.get(`${ENDPOINT}/${id}`),
  deleteClient: (id) => http.delete(`${ENDPOINT}/${id}`),
  blockClient: (id) => http.post(`admin/clientBlock`, { id }),
  unBlockClient: (id) => http.post(`admin/clientUnblock`, { id }),
  bulkActions: (ids = [], action) =>
    http.post(`admin/clientBulkActions`, { ids, action }),
  getMySubscriptions: (params = {}) =>
    http.get(`/admin/subscriptions`, { params }),
  getMyReviews: (id) => http.get(`/admin/feedbacksByClientId/${id}`),
};
