import http from "../http";

const ENDPOINT = "storage-locations";

export const storageLocationsService = {
  addNewStorageLocation: (payload) => http.post(ENDPOINT, payload),
  getStorageLocation: (payload) =>
    http.get(`${ENDPOINT}/${payload?.id}`, payload),
  updateStorageLocation: (payload) =>
    http.put(`${ENDPOINT}/${payload?.id}`, payload),
  deleteStorageLocation: (id) => http.delete(`${ENDPOINT}/${id}`),
  getAllStorageLocation: (params = {}) => http.get(ENDPOINT, { params }),
  getAllStorageLocationsWithoutPagination: () => http.get(`${ENDPOINT}-list`),
  exportSheet: (ids = [], action) =>
    http.post(`${ENDPOINT}/export-csv`, { ids, action }),
};
