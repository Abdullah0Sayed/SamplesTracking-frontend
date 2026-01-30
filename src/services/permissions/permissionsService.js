import http from "../http";

const ENDPOINT = `permissions`;

export const permissionsService = {
  getAllPermissions: () => http.get(ENDPOINT),
};
