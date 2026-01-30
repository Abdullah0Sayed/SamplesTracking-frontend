import { useCallback, useEffect, useState } from "react";
import { queuesService } from "../../services/queues/queuesService";

const INITIAL_FILTERS = {
  sorted_by: "",
  search: "",
  current_department_id: "",
  current_step_id: "",
  test_type_id: "",
};

export default function useQueues(initialPage = 1) {
  /* ========== Queues ========== */
  const [sampleQueues, setSampleQueues] = useState([]);

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
  const fetchSampleQueues = useCallback(async () => {
    try {
      const { data } = await queuesService.getAllQueues({
        sorted_by: filters.sorted_by !== null ? filters.sorted_by : undefined,
        search: filters.search !== null ? filters.search : undefined,
        current_department_id:
          filters.current_department_id !== null
            ? filters.current_department_id
            : undefined,
        current_step_id:
          filters.current_step_id !== null
            ? filters.current_step_id
            : undefined,
        test_type_id:
          filters.test_type_id !== null ? filters.test_type_id : undefined,
        page: pagination.current,
      });

      setSampleQueues(data?.data);
      setPagination({
        current: data?.pagination?.current_page,
        total: data?.pagination?.last_page,
      });
    } catch (error) {
      console.log(error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }, [
    filters.sorted_by,
    filters.current_department_id,
    filters.current_step_id,
    filters.test_type_id,
    pagination.current,
  ]);

  /* ========== EFFECT ========== */
  useEffect(() => {
    fetchSampleQueues();
  }, [fetchSampleQueues]);

  /* ========== Apply Local Search (client-side filter) ========== */
  const visibleRows = sampleQueues.filter((sampleQueue) => {
    if (!filters.search) return true;

    const hayStack = Object.values(sampleQueue).join(" ").toLowerCase();
    return hayStack.includes(filters.search.toLowerCase());
  });

  return {
    sampleQueues: visibleRows,
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

    /** Manual Refetch */
    refetchSampleQueues: fetchSampleQueues,
  };
}
