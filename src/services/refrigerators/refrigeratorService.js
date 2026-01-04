import http from "../http";

const ENDPOINT = `refrigerators`;

export const refrigeratorService = {
  addRefrigerator: (payload) => http.post(ENDPOINT, payload),
  getRefrigeratorList: (params = {}) => http.get(`${ENDPOINT}`, { params }),
  getRefrigeratorListWithoutPagination: () => http.get(`${ENDPOINT}-list`),
  getRefrigeratorById: (id) => http.get(`${ENDPOINT}/${id}`),
  updateRefrigerator: (payload) =>
    http.put(`${ENDPOINT}/${payload.id}`, payload),
  deleteRefrigeratorById: (id) => http.delete(`${ENDPOINT}/${id}`),
};
