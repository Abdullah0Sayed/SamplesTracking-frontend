import http from "../http";

const ENDPOINT = `admin/roles`;

export const rolesService = {
  getAllRoles: () => http.get(`${ENDPOINT}`),
  addRole: (payload) => http.post(ENDPOINT, payload),
  updateRole: (payload, roleId) => http.put(`${ENDPOINT}/${roleId}`, payload),
  getRoleById: (id) => http.get(`${ENDPOINT}/${id}`),
  deleteRole: (id) => http.delete(`${ENDPOINT}/${id}`),
};
