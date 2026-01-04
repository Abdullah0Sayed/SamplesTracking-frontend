import http from "../http";

const ENDPOINT = `admin/plans`;

export const plansService = {
  getAllPlans: (params = {}) => http.get(ENDPOINT, { params }),
  addNewPlan: (payload) => http.post(ENDPOINT, payload),
  updatePlan: (payload) => http.put(`${ENDPOINT}/${payload.id}`, payload),
  deletePlan: (id) => http.delete(`${ENDPOINT}/${id}`),
  getPlan: (id) => http.get(`${ENDPOINT}/${id}`),
  bulkActions: (ids = [], action) =>
    http.post(`${ENDPOINT}/bulk-actions`, { ids, action }),
};
