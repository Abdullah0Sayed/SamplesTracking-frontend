import http from "../http";

const ENDPOINT = `samples`;

export const sampleService = {
  getAllSamples: (params = {}) => http.get(ENDPOINT, { params }),
  getAllSamplesWithoutPagination: () => http.get(`${ENDPOINT}-list`),
  addSample: (payload) => http.post(ENDPOINT, payload),
  getSample: (id) => http.get(`${ENDPOINT}/${id}`),
  updateSample: (payload) => http.put(`${ENDPOINT}/${payload.id}`, payload),
  deleteSample: (id) => http.delete(`${ENDPOINT}/${id}`),
  updateReceivingQc: (id, payload) =>
    http.patch(`${ENDPOINT}/${id}/update/qc`, payload),
  moveToNextDepartment: (id) =>
    http.patch(`${ENDPOINT}/${id}/move-to-next-step`),
  addTestResultsForStep: (payload) => http.post(`test-results`, payload),
  exportSheet: (ids = [], action) =>
    http.post(`${ENDPOINT}/export-csv`, { ids, action }),
};
