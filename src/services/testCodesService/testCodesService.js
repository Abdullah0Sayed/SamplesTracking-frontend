import http from "../http";

const ENDPOINT = `test-codes`;

export const testCodesService = {
  getAllTestCodes: (params = {}) => http.get(ENDPOINT, { params }),
  getAllTestCodesWithoutPagination: () => http.get(`${ENDPOINT}-list`),
  addTestCode: (payload) => http.post(ENDPOINT, payload),
  getTestCode: (id) => http.get(`${ENDPOINT}/${id}`),
  updateTestCode: (payload) => http.patch(`${ENDPOINT}/${payload.id}`, payload),
  deleteTestCode: (id) => http.delete(`${ENDPOINT}/${id}`),
};
