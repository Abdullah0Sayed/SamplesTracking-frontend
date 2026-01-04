import http from "../http";

const ENDPOINT = `sample-codes`;

export const sampleCodesService = {
  getAllSampleCodes: (params = {}) => http.get(ENDPOINT, { params }),
  getAllSampleCodesWithoutPagination: () => http.get(`${ENDPOINT}-list`),
  addSampleCode: (payload) => http.post(ENDPOINT, payload),
  getSampleCode: (id) => http.get(`${ENDPOINT}/${id}`),
  updateSampleCode: (payload) =>
    http.patch(`${ENDPOINT}/${payload.id}`, payload),
  deleteSampleCode: (id) => http.delete(`${ENDPOINT}/${id}`),
};
