import http from "../http";

const ENDPOINT = `workflows`;

export const workflowService = {
  getAllWorkflows: (params = {}) => http.get(ENDPOINT, { params }),
  getAllWorkflowsWithoutPagination: () => http.get(`${ENDPOINT}-list`),
  addWorkflow: (payload) => http.post(ENDPOINT, payload),
  getWorkflow: (id) => http.get(`${ENDPOINT}/${id}`),
  updateWorkflow: (payload) => http.put(`${ENDPOINT}/${payload.id}`, payload),
  deleteWorkflow: (id) => http.delete(`${ENDPOINT}/${id}`),
};
