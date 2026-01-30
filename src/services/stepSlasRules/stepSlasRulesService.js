import http from "../http";
const ENDPOINT = "step-slas-rules";

export const stepSlasRulesService = {
  addNewStepSlasRule: (payload) => http.post(ENDPOINT, payload),
  getStepSlasRule: (id) => http.get(`${ENDPOINT}/${id}`),
  getAllStepSlasRules: (params = {}) => http.get(ENDPOINT, { params }),
  updateStepSlasRule: (id, payload) => http.put(`${ENDPOINT}/${id}`, payload),
  deleteStepRule: (id) => http.delete(`${ENDPOINT}/${id}`),
  exportSheet: (ids = [], action) =>
    http.post(`${ENDPOINT}/export-csv`, { ids, action }),
};
