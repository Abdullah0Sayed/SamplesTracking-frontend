import http from "../http";

export const sampleTestStatusService = {
  updateSampleTestStatus: (payload) =>
    http.put(
      `samples/${payload.sample_id}/sampleTest/${payload.sample_test_id}`,
      payload
    ),
};
