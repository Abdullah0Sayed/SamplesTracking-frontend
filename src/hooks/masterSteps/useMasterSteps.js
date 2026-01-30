import { useCallback, useEffect, useState } from "react";
import { masterStepsService } from "../../services/masterSteps/masterStepsService";

const INITIAL_FILTERS = {
  sorted_by: "all",
  search: "",
};

export default function useMasterSteps(initialPage = 1) {
  /* ========== MasterSteps ========== */
  const [masterSteps, setMasterSteps] = useState([]);

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
  const fetchMasterSteps = useCallback(async () => {
    try {
      const { data } = await masterStepsService.getAllMasterSteps({
        sorted_by: filters.sorted_by !== null ? filters.sorted_by : undefined,
        search: filters.search !== null ? filters.search : undefined,
        page: pagination.current,
      });

      setMasterSteps(data?.data);
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
  }, [filters.sorted_by, filters.search, pagination.current]);

  const fetchMasterStep = useCallback(async (masterStepId) => {
    try {
      const res = await masterStepsService.getMasterStep(masterStepId);
      return res;
    } catch (error) {
      console.log(error);
    }
  }, []);

  /* ========== EFFECT ========== */
  useEffect(() => {
    fetchMasterSteps();
  }, [fetchMasterSteps]);

  /* ========== Fetch Master Steps Without Pagination ========== */
  const fetchMasterStepsWithoutPagination = useCallback(async () => {
    try {
      const res = await masterStepsService.getAllMasterStepsWithoutPagination();
      return res;
    } catch (error) {
      console.log(error);
    }
  }, []);

  /* ========== Apply Local Search (client-side filter) ========== */
  const visibleRows = masterSteps.filter((masterStep) => {
    if (!filters.search) return true;

    const hayStack = Object.values(masterStep).join(" ").toLowerCase();
    return hayStack.includes(filters.search.toLowerCase());
  });

  return {
    masterSteps: visibleRows,
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

    /** Fetch MasterStep */
    fetchMasterStep,
    /** Without Pagination */
    fetchMasterStepsWithoutPagination,
    /** Manual Refetch */
    refetchMasterSteps: fetchMasterSteps,

    exportSheet: async (ids = []) => {
      try {
        const { data } = await masterStepsService.exportSheet(ids);
        window.open(data.data, "_blank");
      } catch (e) {
        console.log(e);
        alert("فشل تصدير شيت الإكسيل");
      }
    },
  };
}
