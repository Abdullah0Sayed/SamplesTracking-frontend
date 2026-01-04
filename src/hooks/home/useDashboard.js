import { useCallback, useEffect, useState } from "react";
import { homeService } from "../../services/home/homeService";

const INITIAL_FILTERS = {
  start_date: "",
  end_date: "",
};

export default function useDashboard() {
  /** Samples Status Statics Numeric  */
  const [samplesStatusNumericStats, setSamplesStatusNumericStats] = useState(
    {}
  );

  /** Latest Activities */
  const [latestActivities, setLatestActivities] = useState([]);

  /** Percentage Samples Status */
  const [sampleStatusPercentage, setSampleStatusPercentage] = useState([]);

  /** Active Workflows */
  const [activeWorkflows, setActiveWorkflows] = useState([]);

  /** Sample Conditions */
  const [sampleConditionsStats, setSampleConditionsStats] = useState([]);

  /** Sample Trends */
  const [sampleTrends, setSampleTrends] = useState([]);

  /** FILTERS */
  const [filters, setFilters] = useState(INITIAL_FILTERS);

  /** Loading & Error */
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchDashboardStats = useCallback(async () => {
    setLoading(true);
    try {
      const [
        sampleStatusStaticNumbersRes,
        latestActivitiesRes,
        sampleStatusPercentageRes,
        activeWorkflowsRes,
        sampleConditionsStatsRes,
        sampleTrendsRes,
      ] = await Promise.all([
        homeService.getSampleByStatusNumeric(filters),
        homeService.getLatestActivities(filters),
        homeService.getPercentageOfSampleStatus(filters),
        homeService.getActiveWorkflows(filters),
        homeService.getSamplesConditions(filters),
        homeService.getSamplesTrends(filters),
      ]);
      console.log(sampleTrendsRes?.data?.data);
      setSamplesStatusNumericStats(sampleStatusStaticNumbersRes?.data?.data);
      setLatestActivities(latestActivitiesRes?.data?.data);
      setSampleStatusPercentage(sampleStatusPercentageRes?.data?.data);
      setActiveWorkflows(activeWorkflowsRes?.data?.data);
      setSampleConditionsStats(sampleConditionsStatsRes?.data?.data);
      setSampleTrends(sampleTrendsRes?.data?.data);
    } catch (error) {
      setError(error);
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  /** EFFECTS */
  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats]);
  return {
    sampleConditionsStats,
    sampleStatusPercentage,
    samplesStatusNumericStats,
    latestActivities,
    activeWorkflows,
    sampleTrends,
    filters,
    loading,
    error,
    setFilters: (cb) =>
      setFilters((prev) => ({
        ...prev,
        ...(typeof cb === "function" ? cb(prev) : cb),
      })),
  };
}
