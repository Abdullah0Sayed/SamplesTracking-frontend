import http from "../http";

export const homeService = {
  getSampleByStatusNumeric: (params = {}) =>
    http.get(`dashboard/SampleByStatusNumeric`, { params }),
  getLatestActivities: (params = {}) =>
    http.get(`dashboard/LatestActivities`, { params }),
  getPercentageOfSampleStatus: (params = {}) =>
    http.get(`dashboard/percentageOfSamples`, { params }),
  getActiveWorkflows: (params = {}) =>
    http.get(`dashboard/activeWorkflows`, { params }),
  getSamplesConditions: (params = {}) =>
    http.get(`dashboard/samplesConditionsStats`, { params }),
  getSamplesTrends: (params = {}) =>
    http.get(`dashboard/SamplesTrendWithinPeriod`, { params }),
};
