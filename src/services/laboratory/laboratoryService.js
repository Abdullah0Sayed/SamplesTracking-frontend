import http from "../http";

const ENDPOINT = `laboratories`;

export const laboratoryService = {
  getLaboratoriesList: (params = {}) => http.get(ENDPOINT, { params }),
  getAllLaboratoriesWithoutPagination: () => http.get(`${ENDPOINT}-list`),
  addLaboratory: (payload) => http.post(ENDPOINT, payload),
  getLaboratoryByID: (id) => http.get(`${ENDPOINT}/${id}`),
  updateLaboratory: (payload) => http.put(`${ENDPOINT}/${payload.id}`, payload),
  deleteLaboratory: (id) => http.delete(`${ENDPOINT}/${id}`),
};
