import http from "../http";

const ENDPOINT = `samples`;

export const sampleService = {
  getAllSamples: (params = {}) => http.get(ENDPOINT, { params }),
  getAllSamplesWithoutPagination: () => http.get(`${ENDPOINT}-list`),
  addSample: (payload) => http.post(ENDPOINT, payload),
  getSample: (id) => http.get(`${ENDPOINT}/${id}`),
  updateSample: (payload) => http.put(`${ENDPOINT}/${payload.id}`, payload),
  deleteSample: (id) => http.delete(`${ENDPOINT}/${id}`),
};
