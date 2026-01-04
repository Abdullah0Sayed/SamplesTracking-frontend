import { useCallback, useEffect, useState } from "react";
import { testCodesService } from "../../services/testCodesService/testCodesService";
import { workflowService } from "../../services/workflows/workflowService";

const INITIAL_FILTERS = {
  sorted_by: "",
  search: "",
};

export default function useWorkflows(initialPage = 1) {
  /** workflows */
  const [workflows, setWorkflows] = useState([]);

  /** Pagination */
  const [pagination, setPagination] = useState({
    current: initialPage,
    total: 1,
  });

  /** filters */
  const [filters, setFilters] = useState(INITIAL_FILTERS);

  /** Loading & Errors */
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /** Fetch Workflows */
  const fetchWorkflows = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const { data } = await workflowService.getAllWorkflows({
        sorted_by: filters.sorted_by || undefined,
        search: filters.search || undefined,
        page: pagination.current,
      });

      console.log(data.data);
      setWorkflows(data.data);

      setPagination({
        current: data.pagination.current_page,
        total: data.pagination.last_page,
      });
    } catch (err) {
      setError(err?.message || "Unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }, [filters.sorted_by, filters.search, pagination.current]);

  /** Auto Fetch on First Load + Filters + Pagination Change */
  useEffect(() => {
    fetchWorkflows();
  }, [fetchWorkflows]);

  /** Fetch Workflow */
  const fetchWorkflow = useCallback(async (workflowID) => {
    try {
      const res = await testCodesService.getTestCode(workflowID);
      return res;
    } catch (error) {
      console.log(error);
    }
  }, []);

  /** Fetch Workflows Without Pagination */
  const fetchWorkflowsWithoutPagination = useCallback(async () => {
    try {
      const res = await workflowService.getAllWorkflowsWithoutPagination();
      return res;
    } catch (error) {
      console.log(error);
    }
  }, []);

  /** Apply Local Search (client-side filter) */
  const visibleRows = workflows.filter((testCode) => {
    if (!filters.search) return true;

    const hayStack = Object.values(testCode).join(" ").toLowerCase();
    return hayStack.includes(filters.search.toLowerCase());
  });

  return {
    workflows: visibleRows,
    loading,
    error,
    pagination,

    filters,
    setFilters: (cb) => {
      setFilters((prev) => ({
        ...prev,
        ...(typeof cb === "function" ? cb(prev) : cb),
      }));
    },

    /** Change page and auto trigger reload */
    setPage: (page) => {
      setPagination((prev) => ({ ...prev, current: page }));
    },

    /** Fetch Test Code */
    fetchWorkflow,
    /** Manual Refetch */
    refetchWorkflows: fetchWorkflows,

    /** Without Pagination */
    fetchWorkflowsWithoutPagination,
  };
}
