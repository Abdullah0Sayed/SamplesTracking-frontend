import http from "../http";

const ENDPOINT = `bio-banking`;

export const bioBankingService = {
  getAllBioBanking: (params = {}) => http.get(ENDPOINT, { params }),
  addBioBanking: (payload) => http.post(ENDPOINT, payload),
  getBioBanking: (id) => http.get(`${ENDPOINT}/${id}`),
  updateBioBanking: (payload) => http.put(`${ENDPOINT}/${payload.id}`, payload),
  deleteBioBanking: (id) => http.delete(`${ENDPOINT}/${id}`),
  exportSheet: (ids = [], action) =>
    http.post(`${ENDPOINT}/export-csv`, { ids, action }),
};
