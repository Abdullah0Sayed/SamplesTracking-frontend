import http from "../http";

const ENDPOINT = "departments";

export const departmentsService = {
  addNewDepartment: (payload) => http.post(ENDPOINT, payload),
  getDepartment: (payload) => http.get(`${ENDPOINT}/${payload?.id}`, payload),
  updateDepartment: (payload) =>
    http.put(`${ENDPOINT}/${payload?.id}`, payload),
  deleteDepartment: (id) => http.delete(`${ENDPOINT}/${id}`),
  getAllDepartments: (params = {}) => http.get(ENDPOINT, { params }),
  getAllDepartmentsWithoutPagination: () => http.get(`${ENDPOINT}-list`),
  exportSheet: (ids = [], action) =>
    http.post(`${ENDPOINT}/export-csv`, { ids, action }),
};
