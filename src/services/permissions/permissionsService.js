import http from "../http";

const ENDPOINT = `admin/permissions`;

export const permissionsService = {
  getAllPermissions: () => http.get(ENDPOINT),
};
