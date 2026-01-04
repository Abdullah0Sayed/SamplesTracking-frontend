import http from "../http";

const ENDPOINT = `freezers`;

export const freezerService = {
  addFreezer: (payload) => http.post(ENDPOINT, payload),
  getFreezersList: (params = {}) => http.get(`${ENDPOINT}`, { params }),
  getFreezersListWithoutPagination: () => http.get(`${ENDPOINT}-list`),
  getFreezerById: (id) => http.get(`${ENDPOINT}/${id}`),
  updateFreezer: (payload) => http.put(`${ENDPOINT}/${payload.id}`, payload),
  deleteFreezerById: (id) => http.delete(`${ENDPOINT}/${id}`),
};
