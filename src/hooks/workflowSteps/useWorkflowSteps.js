import { useCallback, useEffect, useState } from "react";
import { workflowStepsService } from "../../services/workflowSteps/workflowStepsService";

const INITIAL_FILTERS = {
  sorted_by: "all",
  search: "",
  department_id: "",
  test_type_id: "",
  master_step_id: "",
};

export default function useWorkflowSteps(initialPage = 1) {
  /* ========== Workflow Steps ========== */
  const [workflowSteps, setWorkflowSteps] = useState([]);

  /* ========== Loading , Error ========== */
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  /* ========== Filter ========== */
  const [filters, setFilters] = useState(INITIAL_FILTERS);

  /* ========== Pagination ========== */
  const [pagination, setPagination] = useState({
    current: initialPage,
    total: 1,
  });

  /* ========== CallBack ========== */
  const fetchWorkflowSteps = useCallback(async () => {
    try {
      const { data } = await workflowStepsService.getAllWorkflowSteps({
        sorted_by: filters.sorted_by !== null ? filters.sorted_by : undefined,
        search: filters.search !== null ? filters.search : undefined,
        department_id:
          filters.department_id !== null ? filters.department_id : undefined,
        master_step_id:
          filters.master_step_id !== null ? filters.master_step_id : undefined,
        test_type_id:
          filters.test_type_id !== null ? filters.test_type_id : undefined,
        page: pagination.current,
      });

      setWorkflowSteps(data?.data);
      setPagination({
        current: data?.pagination.current_page,
        total: data?.pagination.last_page,
      });
    } catch (error) {
      console.log(error);
      setError(error?.message || "Unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }, [
    filters.sorted_by,
    filters.search,
    filters.department_id,
    filters.master_step_id,
    filters.test_type_id,
    pagination.current,
  ]);

  const fetchWorkflowStep = useCallback(async (workflowStepId) => {
    try {
      const res = await workflowStepsService.getWorkflowStep(workflowStepId);
      return res;
    } catch (error) {
      console.log(error);
    }
  }, []);

  /* ========== EFFECT ========== */
  useEffect(() => {
    fetchWorkflowSteps();
  }, [fetchWorkflowSteps]);

  /* ========== Apply Local Search (client-side filter) ========== */
  const visibleRows = workflowSteps.filter((workflowStep) => {
    if (!filters.search) return true;

    const hayStack = Object.values(workflowStep).join(" ").toLowerCase();
    return hayStack.includes(filters.search.toLowerCase());
  });

  return {
    workflowSteps: visibleRows,
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

    /** Fetch Workflow Step */
    fetchWorkflowStep,
    /** Manual Refetch */
    refetchWorkflowSteps: fetchWorkflowSteps,

    exportSheet: async (ids = []) => {
      try {
        const { data } = await workflowStepsService.exportSheet(ids);
        window.open(data.data, "_blank");
      } catch (e) {
        console.log(e);
        alert("فشل تصدير شيت الإكسيل");
      }
    },
  };
}
