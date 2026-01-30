import http from "../http";

const ENDPOINT = "workflow-steps";

export const workflowStepsService = {
  addNewWorkflowStep: (payload) => http.post(ENDPOINT, payload),
  getWorkflowStep: (payload) => http.get(`${ENDPOINT}/${payload?.id}`, payload),
  updateWorkflowStep: (payload) =>
    http.put(`${ENDPOINT}/${payload?.id}`, payload),
  deleteWorkflowStep: (id) => http.delete(`${ENDPOINT}/${id}`),
  getAllWorkflowSteps: (params = {}) => http.get(ENDPOINT, { params }),
  exportSheet: (ids = [], action) =>
    http.post(`${ENDPOINT}/export-csv`, { ids, action }),
};
