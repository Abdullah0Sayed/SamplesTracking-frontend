import http from "../http";

const ENDPOINT = `admin/subscriptions`;

export const subscriptionsService = {
  getAllSubscriptions: (params = {}) => http.get(ENDPOINT, { params }),
  getActiveSubscriptions: (params = {}) =>
    http.get(`admin/getActiveSubscription`, { params }),
  getExpiredSubscriptions: (params = {}) =>
    http.get(`admin/getExpiredSubscription`, { params }),
  bulkActions: (ids = [], action) =>
    http.post(`${ENDPOINT}/bulk-actions`, { ids, action }),
};
