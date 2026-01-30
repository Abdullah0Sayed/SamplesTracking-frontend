import http from "../http";

const ENDPOINT = "queues";

export const queuesService = {
  getAllQueues: (params = {}) => http.get(ENDPOINT, { params }),
};
