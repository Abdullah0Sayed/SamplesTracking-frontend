import http from "../http";

const ENDPOINT = "master-steps";

export const masterStepsService = {
  addNewMasterStep: (payload) => http.post(ENDPOINT, payload),
  getMasterStep: (payload) => http.get(`${ENDPOINT}/${payload?.id}`, payload),
  updateMasterStep: (payload) =>
    http.put(`${ENDPOINT}/${payload?.id}`, payload),
  deleteMasterStep: (id) => http.delete(`${ENDPOINT}/${id}`),
  getAllMasterSteps: (params = {}) => http.get(ENDPOINT, { params }),
  getAllMasterStepsWithoutPagination: () => http.get(`${ENDPOINT}-list`),
  exportSheet: (ids = [], action) =>
    http.post(`${ENDPOINT}/export-csv`, { ids, action }),
};
